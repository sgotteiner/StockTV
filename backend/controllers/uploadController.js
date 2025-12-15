// UploadController.js - Business logic for video upload operations

import { getAllVideos, updateVideoMetadata } from '../storage/videoStorage.js';
import {
  validateUploadRequest,
  getOrCreateCompany,
  createVideoRecord,
  extractTitleFromFilename,
  extractTitleFromUrl
} from '../utils/uploadHelpers.js';
import { UPLOAD_CONFIG } from '../config/upload.config.js';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs-extra';
import ytdlp from 'yt-dlp-exec';
import ffmpegPath from '@ffmpeg-installer/ffmpeg';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure directories exist
if (!fs.existsSync(UPLOAD_CONFIG.VIDEOS_DIR)) {
  fs.mkdirSync(UPLOAD_CONFIG.VIDEOS_DIR, { recursive: true });
}

/**
 * Download a YouTube video
 */
export async function downloadYouTubeVideo(youtubeUrl, userId, companyNameOrId) {
  // Validate request
  const validation = validateUploadRequest(userId, companyNameOrId);
  if (!validation.isValid) {
    throw new Error(validation.error);
  }

  // Validate YouTube URL
  if (!UPLOAD_CONFIG.YOUTUBE_REGEX.test(youtubeUrl)) {
    throw new Error('Invalid YouTube URL');
  }

  // Get or create company
  const company = getOrCreateCompany(companyNameOrId);

  let videoInfo;
  let filePath;

  try {
    // Fetch metadata
    const infoRaw = await ytdlp(youtubeUrl, {
      dumpSingleJson: true,
      noWarnings: true
    });

    // Handle response format
    videoInfo = typeof infoRaw === 'string'
      ? JSON.parse(infoRaw)
      : (infoRaw.stdout ? JSON.parse(infoRaw.stdout) : infoRaw);

    const fileName = videoInfo.title + '.mp4';
    filePath = path.join(UPLOAD_CONFIG.VIDEOS_DIR, fileName);

    // Download video
    await ytdlp(youtubeUrl, {
      format: UPLOAD_CONFIG.YOUTUBE.FORMAT,
      output: filePath,
      noWarnings: true,
      ffmpegLocation: ffmpegPath.path || ffmpegPath,
      mergeOutputFormat: UPLOAD_CONFIG.YOUTUBE.MERGE_FORMAT,
      postprocessorArgs: UPLOAD_CONFIG.YOUTUBE.POSTPROCESSOR_ARGS
    });

  } catch (err) {
    console.error('Error downloading YouTube video:', err);
    if (filePath && fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    throw new Error('Failed to download video');
  }

  // Check if video already exists
  const allVideos = getAllVideos();
  const existingVideo = allVideos.find(v => v.filename === path.basename(filePath));

  if (existingVideo) {
    return updateVideoMetadata(existingVideo.id, {
      title: videoInfo.title,
      company_id: company.id,
      date: new Date().toISOString().split('T')[0],
      description: videoInfo.description || '',
      uploader: userId
    });
  }

  // Create new video record
  return createVideoRecord({
    filename: path.basename(filePath),
    title: videoInfo.title,
    description: videoInfo.description || ''
  }, company, userId);
}

/**
 * Upload a video file directly
 */
export async function uploadVideoFile(file, userId, companyNameOrId) {
  // Validate request
  const validation = validateUploadRequest(userId, companyNameOrId);
  if (!validation.isValid) {
    throw new Error(validation.error);
  }

  // Get or create company
  const company = getOrCreateCompany(companyNameOrId);

  try {
    // Move file to videos directory
    const sourceFile = file.path;
    const destFile = path.join(UPLOAD_CONFIG.VIDEOS_DIR, file.filename);
    fs.moveSync(sourceFile, destFile, { overwrite: true });

    // Create video record
    return createVideoRecord({
      filename: file.filename,
      title: extractTitleFromFilename(file.originalname),
      description: `Uploaded by ${validation.user.name}`
    }, company, userId);

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
  // Validate request
  const validation = validateUploadRequest(userId, companyNameOrId);
  if (!validation.isValid) {
    throw new Error(validation.error);
  }

  // Get or create company
  const company = getOrCreateCompany(companyNameOrId);

  // Import download utility
  const { downloadVideoFromUrl } = await import('../utils/downloadUtils.js');

  try {
    // Download video from URL
    const filename = await downloadVideoFromUrl(videoUrl);

    // Move to videos directory
    const uploadPath = path.join(UPLOAD_CONFIG.TEMP_UPLOAD_DIR, filename);
    const destPath = path.join(UPLOAD_CONFIG.VIDEOS_DIR, filename);
    fs.moveSync(uploadPath, destPath, { overwrite: true });

    // Create video record
    return createVideoRecord({
      filename,
      title: extractTitleFromUrl(videoUrl),
      description: `Downloaded from ${videoUrl}`
    }, company, userId);

  } catch (error) {
    throw new Error(`Failed to download video from URL: ${error.message}`);
  }
}
