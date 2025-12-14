import express from 'express';
import * as companyFollowStorage from '../storage/companyFollowStorage.js';
import { getCompanyById } from '../storage/companyStorage.js';

const router = express.Router();

/**
 * Follow a company
 */
router.post('/companies/:companyId/follow', async (req, res) => {
    try {
        const { userId } = req.body;
        if (!userId) {
            return res.status(400).json({ error: 'User ID is required' });
        }

        const follow = companyFollowStorage.followCompany(userId, req.params.companyId);
        res.json({ success: true, follow });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

/**
 * Unfollow a company
 */
router.delete('/companies/:companyId/follow', async (req, res) => {
    try {
        const { userId } = req.body;
        if (!userId) {
            return res.status(400).json({ error: 'User ID is required' });
        }

        const result = companyFollowStorage.unfollowCompany(userId, req.params.companyId);
        res.json(result);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

/**
 * Check if user follows a company
 */
router.get('/companies/:companyId/following/:userId', async (req, res) => {
    try {
        const isFollowing = companyFollowStorage.isFollowingCompany(req.params.userId, req.params.companyId);
        res.json({ isFollowing });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * Get user's followed companies
 */
router.get('/users/:userId/following', async (req, res) => {
    try {
        const companies = companyFollowStorage.getUserFollowedCompanies(req.params.userId);
        res.json({ companies });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
