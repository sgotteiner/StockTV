import express from 'express';
const router = express.Router();

import * as likeController from '../controllers/likeController.js';

// Get like count for a video
router.get('/videos/:videoId/likes', async (req, res) => {
  try {
    const result = await likeController.getVideoLikeCount(req.params.videoId);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Like a video
router.post('/videos/:videoId/like', async (req, res) => {
  try {
    const result = await likeController.likeVideo(req.params.videoId, req.body.userId);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Unlike a video
router.delete('/videos/:videoId/like', async (req, res) => {
  try {
    const result = await likeController.unlikeVideo(req.params.videoId, req.body.userId);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get user's liked videos
router.get('/users/:userId/likes', async (req, res) => {
  try {
    const result = await likeController.getUserLikedVideosList(req.params.userId);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;