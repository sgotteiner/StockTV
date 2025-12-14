import express from 'express';
const router = express.Router();

import * as interactionController from '../controllers/interactionController.js';

// Get like count for a video
router.get('/videos/:videoId/likes', async (req, res) => {
  try {
    const result = await interactionController.getVideoLikeCount(req.params.videoId);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Like a video
router.post('/videos/:videoId/like', async (req, res) => {
  try {
    const result = await interactionController.likeVideo(req.params.videoId, req.body.userId);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Unlike a video
router.delete('/videos/:videoId/like', async (req, res) => {
  try {
    const result = await interactionController.unlikeVideo(req.params.videoId, req.body.userId);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get user's liked videos
router.get('/users/:userId/likes', async (req, res) => {
  try {
    const result = await interactionController.getUserLikedVideosList(req.params.userId);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Record video view
router.post('/videos/:videoId/views', async (req, res) => {
  try {
    const result = await interactionController.recordVideoView(req.params.videoId, req.body.userId);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Save a video
router.post('/videos/:videoId/save', async (req, res) => {
  try {
    const result = await interactionController.saveVideo(req.params.videoId, req.body.userId);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Unsave a video
router.delete('/videos/:videoId/save', async (req, res) => {
  try {
    const result = await interactionController.unsaveVideo(req.params.videoId, req.body.userId);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get user's saved videos
router.get('/users/:userId/saved', async (req, res) => {
  try {
    const result = await interactionController.getUserSavedVideos(req.params.userId);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;