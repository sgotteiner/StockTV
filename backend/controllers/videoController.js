import { getVideos } from '../services/videoService.js';

export const fetchVideos = (req, res) => {
    try {
        const videos = getVideos();
        res.json(videos);
    } catch (error) {
        console.error('Error fetching videos:', error);
        res.status(500).json({ error: 'Failed to fetch videos' });
    }
};