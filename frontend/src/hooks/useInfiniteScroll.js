import { useState, useEffect, useCallback } from 'react';
import { getVideos } from '../services/api';
import { PAGINATION } from '../constants';

/**
 * Custom hook for infinite scroll pagination
 * Handles loading videos with pagination and detecting scroll position
 * 
 * @param {string} userId - Current user ID (for personalized feed)
 * @returns {Object} Pagination state and handlers
 */
export function useInfiniteScroll(userId) {
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(PAGINATION.DEFAULT_PAGE);
    const [hasMore, setHasMore] = useState(true);

    // Load initial videos
    useEffect(() => {
        const fetchInitialVideos = async () => {
            try {
                setLoading(true);
                setPage(PAGINATION.DEFAULT_PAGE);
                const response = await getVideos(
                    userId,
                    PAGINATION.DEFAULT_PAGE,
                    PAGINATION.DEFAULT_PAGE_SIZE
                );
                setVideos(response.videos);
                setHasMore(response.pagination.hasMore);
                setError(null);
            } catch (err) {
                setError('Failed to load videos');
                console.error('Error fetching videos:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchInitialVideos();
    }, [userId]);

    // Load more videos
    const loadMore = useCallback(async () => {
        if (loadingMore || !hasMore) return;

        try {
            setLoadingMore(true);
            const nextPage = page + 1;
            const response = await getVideos(userId, nextPage, PAGINATION.DEFAULT_PAGE_SIZE);
            setVideos(prev => [...prev, ...response.videos]);
            setHasMore(response.pagination.hasMore);
            setPage(nextPage);
        } catch (err) {
            console.error('Error loading more videos:', err);
        } finally {
            setLoadingMore(false);
        }
    }, [userId, page, loadingMore, hasMore]);

    // Detect scroll position for snap-scrolling feeds
    useEffect(() => {
        const checkPosition = () => {
            const feedElement = document.querySelector('.video-feed');
            if (!feedElement) return;

            const videoCards = feedElement.querySelectorAll('.video-card');
            if (videoCards.length === 0) return;

            // Find currently visible video
            let currentVideoIndex = 0;
            videoCards.forEach((card, index) => {
                const rect = card.getBoundingClientRect();
                if (rect.top >= 0 && rect.top < window.innerHeight / 2) {
                    currentVideoIndex = index;
                }
            });

            // Load more if near end
            const isNearEnd = currentVideoIndex >= videos.length - 2;
            if (isNearEnd && hasMore && !loadingMore) {
                loadMore();
            }
        };

        checkPosition();
        const interval = setInterval(checkPosition, 500);

        return () => clearInterval(interval);
    }, [videos.length, hasMore, loadingMore, loadMore]);

    return {
        videos,
        loading,
        loadingMore,
        error,
        hasMore
    };
}
