// UploadController.js - Business logic for video upload operations

import { getUserById } from '../storage/userStorage.js';
import { getAllVideos, updateVideoMetadata, addVideo } from '../storage/videoStorage.js';
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
export async function downloadYouTubeVideo(youtubeUrl, userId, requestedCompanyId) {
  // Validate user
  const user = getUserById(userId);
  if (!user) throw new Error('User not found');
  if (!requestedCompanyId) throw new Error('Company ID is required');

  // Validate YouTube URL format
  const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com\/(watch\?v=|shorts\/)|youtu\.be\/)[\w-]{11}(&.*)?$/;
  if (!youtubeRegex.test(youtubeUrl)) throw new Error('Invalid YouTube URL');

  let videoInfo;
  let filePath;

  try {
    // 1️⃣ Fetch metadata
    const infoRaw = await ytdlp(youtubeUrl, {
      dumpSingleJson: true,
      noWarnings: true
    });

    // Properly handle the response format
    if (typeof infoRaw === 'string') {
      videoInfo = JSON.parse(infoRaw);
    } else if (infoRaw.stdout) {
      videoInfo = JSON.parse(infoRaw.stdout);
    } else {
      videoInfo = infoRaw;
    }

    const fileName = videoInfo.title + '.mp4';
    filePath = path.join(videosDir, fileName);

    // 3️⃣ Download video - ensure single merged output in proper MP4 format
    await ytdlp(youtubeUrl, {
      format: 'bv*+ba/best',  // Best video + best audio
      output: filePath,
      noWarnings: true,
      ffmpegLocation: ffmpegPath.path || ffmpegPath, // Handle different export formats
      mergeOutputFormat: 'mp4',
      postprocessorArgs: '-c:v copy -c:a aac' // keep video, convert audio to aac
    });

  } catch (err) {
    console.error('Error downloading YouTube video:', err);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath); // Clean up partial download
    }
    throw new Error('Failed to download video');
  }

  // 4️⃣ Update metadata in DB
  const allVideos = getAllVideos();
  const existingVideo = allVideos.find(v => v.filename === path.basename(filePath));

  if (existingVideo) {
    // Update existing video metadata
    const updatedVideo = updateVideoMetadata(existingVideo.id, {
      title: videoInfo.title,
      company: requestedCompanyId,
      date: new Date().toISOString().split('T')[0],
      description: videoInfo.description || '',
      uploader: userId
    });
    return updatedVideo;
  } else {
    // If no existing video found, trigger the sync mechanism
    // The video storage system should pick up the new file automatically
    const allVideosAfter = getAllVideos();
    const newVideo = allVideosAfter.find(v => v.filename === path.basename(filePath));

    if (newVideo) {
      // Update newly created video with proper metadata
      const updatedVideo = updateVideoMetadata(newVideo.id, {
        title: videoInfo.title,
        company: requestedCompanyId,
        date: new Date().toISOString().split('T')[0],
        description: videoInfo.description || '',
        uploader: userId
      });
      return updatedVideo;
    } else {
      // The video file exists but hasn't been added to DB yet
      // Use the new addVideo function to directly add it with correct metadata
      const newVideo = addVideo({
        filename: path.basename(filePath),
        title: videoInfo.title,
        company: requestedCompanyId,
        date: new Date().toISOString().split('T')[0],
        description: videoInfo.description || '',
        uploader: userId,
        tags: []
      });
      return newVideo;
    }
  }
}
