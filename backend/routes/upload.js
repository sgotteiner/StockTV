import express from 'express';
import { downloadYouTubeVideo, uploadVideoFile, uploadVideoFromUrl } from '../controllers/uploadController.js';
import { upload } from '../utils/uploadUtils.js';

const router = express.Router();

/**
 * POST /api/upload/youtube
 * Download and save a YouTube video
 */
router.post('/youtube', async (req, res) => {
  try {
    const { youtubeUrl, companyId, userId } = req.body;

    if (!youtubeUrl) {
      return res.status(400).json({ error: 'YouTube URL is required' });
    }

    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    const result = await downloadYouTubeVideo(youtubeUrl, userId, companyId);

    res.json({
      success: true,
      video: result
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

/**
 * POST /api/upload/file
 * Upload a video file directly
 */
router.post('/file', upload.single('video'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No video file provided' });
    }

    const { companyId, userId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    const result = await uploadVideoFile(req.file, userId, companyId);

    res.json({
      success: true,
      video: result
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

/**
 * POST /api/upload/url
 * Download video from a direct URL
 */
router.post('/url', async (req, res) => {
  try {
    const { videoUrl, companyId, userId } = req.body;

    if (!videoUrl) {
      return res.status(400).json({ error: 'Video URL is required' });
    }

    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    const result = await uploadVideoFromUrl(videoUrl, userId, companyId);

    res.json({
      success: true,
      video: result
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router;