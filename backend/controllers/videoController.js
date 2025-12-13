import { getPersonalizedFeed } from '../services/feedService.js';
import { PAGINATION } from '../config/constants.js';

export const fetchVideos = (req, res) => {
    try {
        // Get userId from query params (optional)
        const userId = req.query.userId || null;

        // Get pagination params (with defaults)
        const page = parseInt(req.query.page) || PAGINATION.DEFAULT_PAGE;
        const limit = parseInt(req.query.limit) || PAGINATION.DEFAULT_PAGE_SIZE;

        // Get personalized feed based on user's watch history
        const result = getPersonalizedFeed(userId, page, limit);

        // Update the file_path to use the actual request host instead of localhost/env default
        // This ensures it works for mobile/external devices testing via IP
        const actualHost = `${req.protocol}://${req.get('host')}`;
        const updatedVideos = result.videos.map(video => ({
            ...video,
            file_path: video.file_path.replace(/(https?:\/\/[^\/]+)/, actualHost)
        }));

        // Return paginated response with metadata
        res.json({
            videos: updatedVideos,
            pagination: result.pagination
        });
    } catch (error) {
        console.error('Error fetching videos:', error);
        res.status(500).json({ error: 'Failed to fetch videos' });
    }
};