import express from 'express';
import { downloadYouTubeVideo } from '../controllers/uploadController.js';

const router = express.Router();

/**
 * POST /api/upload/youtube
 * Download and save a YouTube video
 * Requires authentication and proper role
 *
 * For now, userId comes from request body until auth is implemented.
 * In the future, it should come from JWT token after authentication middleware.
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

export default router;