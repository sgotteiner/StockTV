// UploadController.js - Business logic for video upload operations

import { getUserById } from '../storage/userStorage.js';
import { getAllVideos, updateVideoMetadata, addVideo } from '../storage/videoStorage.js';
import { createCompany, getCompanyByName } from '../storage/companyStorage.js';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs-extra';
import ytdlp from 'yt-dlp-exec';
import ffmpegPath from '@ffmpeg-installer/ffmpeg';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Directory for storing uploaded videos
const videosDir = path.resolve(__dirname, '../../videos');

// Ensure directories exist
if (!fs.existsSync(videosDir)) {
  fs.mkdirSync(videosDir, { recursive: true });
}

/**
 * Download a YouTube video and save it to the appropriate company folder
 */
export async function downloadYouTubeVideo(youtubeUrl, userId, companyNameOrId) {
  // Validate user
  const user = getUserById(userId);
  if (!user) throw new Error('User not found');
  if (!companyNameOrId) throw new Error('Company name is required');

  // Get or create company
  let company = getCompanyByName(companyNameOrId);
  if (!company) {
    company = createCompany(companyNameOrId);
    console.log(`Created new company: ${company.name} (${company.id})`);
  }

  // Validate YouTube URL format
  const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com\/(watch\?v=|shorts\/)|youtu\.be\/)[\w-]{11}(&.*)?$/;
  if (!youtubeRegex.test(youtubeUrl)) throw new Error('Invalid YouTube URL');

  let videoInfo;
  let filePath;

  try {
    // Fetch metadata
    const infoRaw = await ytdlp(youtubeUrl, {
      dumpSingleJson: true,
      noWarnings: true
    });

    // Handle response format
    if (typeof infoRaw === 'string') {
      videoInfo = JSON.parse(infoRaw);
    } else if (infoRaw.stdout) {
      videoInfo = JSON.parse(infoRaw.stdout);
    } else {
      videoInfo = infoRaw;
    }

    const fileName = videoInfo.title + '.mp4';
    filePath = path.join(videosDir, fileName);

    // Download video
    await ytdlp(youtubeUrl, {
      format: 'bv*+ba/best',
      output: filePath,
      noWarnings: true,
      ffmpegLocation: ffmpegPath.path || ffmpegPath,
      mergeOutputFormat: 'mp4',
      postprocessorArgs: '-c:v copy -c:a aac'
    });

  } catch (err) {
    console.error('Error downloading YouTube video:', err);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    throw new Error('Failed to download video');
  }

  // Update metadata in DB
  const allVideos = getAllVideos();
  const existingVideo = allVideos.find(v => v.filename === path.basename(filePath));

  if (existingVideo) {
    const updatedVideo = updateVideoMetadata(existingVideo.id, {
      title: videoInfo.title,
      company_id: company.id,
      date: new Date().toISOString().split('T')[0],
      description: videoInfo.description || '',
      uploader: userId
    });
    return updatedVideo;
  } else {
    const allVideosAfter = getAllVideos();
    const newVideo = allVideosAfter.find(v => v.filename === path.basename(filePath));

    if (newVideo) {
      const updatedVideo = updateVideoMetadata(newVideo.id, {
        title: videoInfo.title,
        company_id: company.id,
        date: new Date().toISOString().split('T')[0],
        description: videoInfo.description || '',
        uploader: userId
      });
      return updatedVideo;
    } else {
      const createdVideo = addVideo({
        filename: path.basename(filePath),
        title: videoInfo.title,
        company_id: company.id,
        date: new Date().toISOString().split('T')[0],
        description: videoInfo.description || '',
        uploader: userId,
        tags: []
      });
      return createdVideo;
    }
  }
}

/**
 * Upload a video file directly
 */
export async function uploadVideoFile(file, userId, companyNameOrId) {
  // Validate user
  const user = getUserById(userId);
  if (!user) throw new Error('User not found');
  if (!companyNameOrId) throw new Error('Company name is required');

  // Get or create company
  let company = getCompanyByName(companyNameOrId);
  if (!company) {
    company = createCompany(companyNameOrId);
    console.log(`Created new company: ${company.name} (${company.id})`);
  }

  try {
    // File is already saved by multer in uploads/videos/
    // Move it to the main videos directory
    const sourceFile = file.path;
    const destFile = path.join(videosDir, file.filename);

    // Move file
    fs.moveSync(sourceFile, destFile, { overwrite: true });

    // Add video to database
    const newVideo = addVideo({
      filename: file.filename,
      title: file.originalname.replace(path.extname(file.originalname), ''),
      company_id: company.id,
      date: new Date().toISOString().split('T')[0],
      description: `Uploaded by ${user.name}`,
      uploader: userId,
      tags: []
    });

    return newVideo;
  } catch (error) {
    // Clean up file on error
    if (fs.existsSync(file.path)) {
      fs.unlinkSync(file.path);
    }
    throw new Error(`Failed to upload video file: ${error.message}`);
  }
}

/**
 * Download video from a direct URL
 */
export async function uploadVideoFromUrl(videoUrl, userId, companyNameOrId) {
  // Validate user
  const user = getUserById(userId);
  if (!user) throw new Error('User not found');
  if (!companyNameOrId) throw new Error('Company name is required');

  // Get or create company
  let company = getCompanyByName(companyNameOrId);
  if (!company) {
    company = createCompany(companyNameOrId);
    console.log(`Created new company: ${company.name} (${company.id})`);
  }

  // Import download utility
  const { downloadVideoFromUrl } = await import('../utils/downloadUtils.js');

  try {
    // Download video from URL
    const filename = await downloadVideoFromUrl(videoUrl);

    // Move to videos directory
    const uploadPath = path.join(__dirname, '../uploads/videos', filename);
    const destPath = path.join(videosDir, filename);
    fs.moveSync(uploadPath, destPath, { overwrite: true });

    // Extract title from URL
    const urlObj = new URL(videoUrl);
    const urlPath = urlObj.pathname;
    const title = path.basename(urlPath, path.extname(urlPath));

    // Add video to database
    const newVideo = addVideo({
      filename: filename,
      title: title || 'Video from URL',
      company_id: company.id,
      date: new Date().toISOString().split('T')[0],
      description: `Downloaded from ${videoUrl}`,
      uploader: userId,
      tags: []
    });

    return newVideo;
  } catch (error) {
    throw new Error(`Failed to download video from URL: ${error.message}`);
  }
}
