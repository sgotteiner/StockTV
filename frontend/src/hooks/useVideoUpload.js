import { useState, useEffect } from 'react';
import { uploadYouTubeVideo, uploadVideoFile, uploadVideoUrl } from '../services/uploadApi';

/**
 * Custom hook for video upload logic
 * Handles multiple upload sources: YouTube, files, and other URLs
 * 
 * @param {Object} currentUser - Current user object
 * @returns {Object} Upload state and handlers
 */
export function useVideoUpload(currentUser) {
    const [uploadSource, setUploadSource] = useState('youtube'); // 'youtube', 'file', 'url'
    const [youtubeUrl, setYoutubeUrl] = useState('');
    const [videoFile, setVideoFile] = useState(null);
    const [videoUrl, setVideoUrl] = useState('');
    const [selectedCompany, setSelectedCompany] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    // Set company based on user role
    useEffect(() => {
        if (currentUser?.role === 'company') {
            setSelectedCompany(currentUser.name);
        } else {
            setSelectedCompany('');
        }
    }, [currentUser]);

    const validateYouTubeUrl = (url) => {
        if (!url) return 'Please enter a YouTube URL';
        const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com\/(watch\?v=|shorts\/)|youtu\.be\/)[a-zA-Z0-9_-]{11}(&.*)?$/;
        if (!youtubeRegex.test(url)) {
            return 'Please enter a valid YouTube URL';
        }
        return null;
    };

    const validateVideoFile = (file) => {
        if (!file) return 'Please select a video file';

        const validTypes = ['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime'];
        if (!validTypes.includes(file.type)) {
            return 'Please select a valid video file (MP4, WebM, OGG, MOV)';
        }

        // 100MB limit
        const maxSize = 100 * 1024 * 1024;
        if (file.size > maxSize) {
            return 'File size must be less than 100MB';
        }

        return null;
    };

    const validateVideoUrl = (url) => {
        if (!url) return 'Please enter a video URL';

        try {
            new URL(url);
            // Check if URL ends with video extension
            const videoExtensions = ['.mp4', '.webm', '.ogg', '.mov'];
            const hasVideoExtension = videoExtensions.some(ext => url.toLowerCase().includes(ext));

            if (!hasVideoExtension) {
                return 'URL must point to a video file (mp4, webm, ogg, mov)';
            }

            return null;
        } catch {
            return 'Please enter a valid URL';
        }
    };

    const handleSubmit = async () => {
        setError('');
        setMessage('');
        setIsLoading(true);

        try {
            let result;

            switch (uploadSource) {
                case 'youtube':
                    const youtubeError = validateYouTubeUrl(youtubeUrl);
                    if (youtubeError) {
                        setError(youtubeError);
                        setIsLoading(false);
                        return false;
                    }
                    result = await uploadYouTubeVideo(youtubeUrl, selectedCompany, currentUser.id);
                    setYoutubeUrl('');
                    break;

                case 'file':
                    const fileError = validateVideoFile(videoFile);
                    if (fileError) {
                        setError(fileError);
                        setIsLoading(false);
                        return false;
                    }
                    result = await uploadVideoFile(videoFile, selectedCompany, currentUser.id);
                    setVideoFile(null);
                    break;

                case 'url':
                    const urlError = validateVideoUrl(videoUrl);
                    if (urlError) {
                        setError(urlError);
                        setIsLoading(false);
                        return false;
                    }
                    result = await uploadVideoUrl(videoUrl, selectedCompany, currentUser.id);
                    setVideoUrl('');
                    break;

                default:
                    throw new Error('Invalid upload source');
            }

            setMessage('Video uploaded successfully!');
            return true;
        } catch (err) {
            setError(err.message);
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    return {
        uploadSource,
        setUploadSource,
        youtubeUrl,
        setYoutubeUrl,
        videoFile,
        setVideoFile,
        videoUrl,
        setVideoUrl,
        selectedCompany,
        setSelectedCompany,
        isLoading,
        message,
        error,
        handleSubmit
    };
}
