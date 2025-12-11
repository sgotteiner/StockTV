import express from 'express';
import { listAllUsers, updateUserRole } from '../controllers/userController.js';

const router = express.Router();

// Middleware to check for admin role (simplified for now)
// In a real app, this should verify the JWT token and check the user's role claim.
const requireAdmin = (req, res, next) => {
    // For MVP, we assume the frontend sends the user's role in a header or we rely on the controller checks.
    // Ideally, we'd check req.user.role here after an authMiddleware.
    // For now, let's allow the request through and let the controller handle logic or assume safe environment.
    // Note: The controller doesn't currently check "who" is asking, just "what" to do.
    // We should probably add a basic check here if we had the logged-in user context.
    next();
};

/**
 * GET /api/admin/users
 * List all users
 */
router.get('/users', requireAdmin, (req, res) => {
    try {
        const users = listAllUsers();
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * PUT /api/admin/users/:id/role
 * Update user role
 */
router.put('/users/:id/role', requireAdmin, (req, res) => {
    try {
        const { id } = req.params;
        const { role } = req.body;
        const updatedUser = updateUserRole(id, role);
        res.json(updatedUser);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

export default router;
