import { getVideos } from '../services/videoService.js';

export const fetchVideos = (req, res) => {
    try {
        const videos = getVideos();

        // Update the file_path to use the actual request host instead of localhost
        const actualHost = `${req.protocol}://${req.get('host')}`;
        const updatedVideos = videos.map(video => ({
            ...video,
            file_path: video.file_path.replace('http://localhost:5000', actualHost)
        }));

        res.json(updatedVideos);
    } catch (error) {
        console.error('Error fetching videos:', error);
        res.status(500).json({ error: 'Failed to fetch videos' });
    }
};