import { getAllVideos } from '../storage/videoStorage.js';

export const fetchVideos = (req, res) => {
    try {
        const videos = getAllVideos();

        // Update the file_path to use the actual request host instead of localhost/env default
        // This ensures it works for mobile/external devices testing via IP
        const actualHost = `${req.protocol}://${req.get('host')}`;
        const updatedVideos = videos.map(video => ({
            ...video,
            file_path: video.file_path.replace(/(https?:\/\/[^\/]+)/, actualHost)
        }));

        res.json(updatedVideos);
    } catch (error) {
        console.error('Error fetching videos:', error);
        res.status(500).json({ error: 'Failed to fetch videos' });
    }
};