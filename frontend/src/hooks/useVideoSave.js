import { useState, useEffect } from 'react';
import { saveVideo, unsaveVideo, getUserSavedVideos } from '../services/interactionsApi';

/**
 * Custom hook for video save/unsave and share functionality
 * @param {Object} video - Video object
 * @param {Object} currentUser - Current user object
 * @returns {Object} { isSaved, toggleSave, shareVideo, message }
 */
export function useVideoSave(video, currentUser) {
    const [isSaved, setIsSaved] = useState(false);
    const [message, setMessage] = useState('');

    // Fetch initial saved status
    useEffect(() => {
        const checkSavedStatus = async () => {
            if (!currentUser || !video) {
                setIsSaved(false);
                return;
            }

            try {
                const { savedVideos } = await getUserSavedVideos(currentUser.id);
                const saved = savedVideos.some(v => v.video_id === video.id);
                setIsSaved(saved);
            } catch (error) {
                console.error('Error checking saved status:', error);
                setIsSaved(false);
            }
        };

        checkSavedStatus();
    }, [video?.id, currentUser?.id]);

    const toggleSave = async () => {
        if (!currentUser) {
            setMessage('Please log in to save videos');
            setTimeout(() => setMessage(''), 2000);
            return;
        }

        try {
            if (isSaved) {
                await unsaveVideo(video.id, currentUser.id);
                setIsSaved(false);
                setMessage('Video unsaved');
            } else {
                await saveVideo(video.id, currentUser.id);
                setIsSaved(true);
                setMessage('Video saved!');
            }

            setTimeout(() => setMessage(''), 1500);
        } catch (error) {
            console.error('Error toggling save:', error);
            setMessage('Failed to save video');
            setTimeout(() => setMessage(''), 2000);
        }
    };

    const shareVideo = () => {
        setMessage('Share feature coming soon!');
        setTimeout(() => setMessage(''), 2000);
    };

    return { isSaved, toggleSave, shareVideo, message };
}
