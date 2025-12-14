import { useState, useEffect, useCallback } from 'react';
import * as interactionsApi from '../services/interactionsApi';

/**
 * Custom hook to manage video interactions (likes, views)
 * @param {Object} video - Video object
 * @param {Object} currentUser - Current user object
 * @returns {Object} Interaction state and handlers
 */
export function useVideoInteractions(video, currentUser) {
    const [likeCount, setLikeCount] = useState(0);
    const [isLiked, setIsLiked] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [viewRecorded, setViewRecorded] = useState(false);

    // Load initial like data
    useEffect(() => {
        const fetchLikeData = async () => {
            try {
                if (currentUser) {
                    const userLikes = await interactionsApi.getUserLikedVideos(currentUser.id);
                    const userLikedVideoIds = userLikes.likedVideos.map(item => item.videoId);
                    setIsLiked(userLikedVideoIds.includes(video.id));
                }
                const likeData = await interactionsApi.getVideoLikes(video.id);
                setLikeCount(likeData.likeCount);
            } catch (error) {
                console.error('Error fetching like data:', error);
            }
        };
        fetchLikeData();
    }, [video.id, currentUser]);

    // Record view when video starts playing
    const recordView = useCallback(async (isPlaying) => {
        if (isPlaying && currentUser && !viewRecorded) {
            try {
                await interactionsApi.recordVideoView(video.id, currentUser.id);
                setViewRecorded(true);
            } catch (error) {
                console.error('Error recording video view:', error);
            }
        }
    }, [video.id, currentUser, viewRecorded]);

    // Handle like/unlike
    const toggleLike = useCallback(async () => {
        if (!currentUser || isLoading) return { requiresLogin: !currentUser };

        setIsLoading(true);
        try {
            if (isLiked) {
                const result = await interactionsApi.unlikeVideo(video.id, currentUser.id);
                setLikeCount(result.likeCount);
                setIsLiked(false);
            } else {
                const result = await interactionsApi.likeVideo(video.id, currentUser.id);
                setLikeCount(result.likeCount);
                setIsLiked(true);
            }
            return { success: true };
        } catch (error) {
            console.error('Error toggling like:', error);
            return { success: false, error: error.message };
        } finally {
            setIsLoading(false);
        }
    }, [video.id, currentUser, isLiked, isLoading]);

    return {
        likeCount,
        isLiked,
        isLoading,
        recordView,
        toggleLike
    };
}
