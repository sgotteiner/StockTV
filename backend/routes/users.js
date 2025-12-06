import express from 'express';
const router = express.Router();

import * as userController from '../controllers/userController.js';

// Register a new user
router.post('/register', async (req, res) => {
  try {
    const user = await userController.registerUser(req.body);
    res.status(201).json({ user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Login user
router.post('/login', async (req, res) => {
  try {
    const user = await userController.loginUser(req.body);
    res.json({ user });
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
});

// Get user profile
router.get('/:userId', async (req, res) => {
  try {
    const user = await userController.getUserProfile(req.params.userId);
    res.json({ user });
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

// Update user profile
router.put('/:userId', async (req, res) => {
  try {
    const user = await userController.updateUserProfile(req.params.userId, req.body);
    res.json({ user });
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

export default router;