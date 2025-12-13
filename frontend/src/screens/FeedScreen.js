import React, { useState, useEffect, useCallback } from 'react';
import VideoCard from '../components/VideoCard';
import { getVideos } from '../services/api';
import { useUser } from '../context/UserProvider';
import { PAGINATION } from '../constants';
import '../App.css';

/**
 * FeedScreen Component
 * Displays the main video feed with scrolling and video cards
 * Shows personalized feed based on user's watch history
 * Implements infinite scroll for pagination
 */
function FeedScreen() {
  const { currentUser } = useUser();
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(PAGINATION.DEFAULT_PAGE);
  const [hasMore, setHasMore] = useState(true);

  // Load initial videos when component mounts or user changes
  useEffect(() => {
    const fetchInitialVideos = async () => {
      try {
        setLoading(true);
        setPage(PAGINATION.DEFAULT_PAGE);
        // Pass userId for personalized feed (unwatched first, then watched by recency)
        const response = await getVideos(currentUser?.id, PAGINATION.DEFAULT_PAGE, PAGINATION.DEFAULT_PAGE_SIZE);
        setVideos(response.videos);
        setHasMore(response.pagination.hasMore);
        setLoading(false);
      } catch (err) {
        setError('Failed to load videos');
        setLoading(false);
        console.error('Error fetching videos:', err);
      }
    };

    fetchInitialVideos();
  }, [currentUser]); // Re-fetch when user logs in/out

  // Load more videos when scrolling
  const loadMore = useCallback(async () => {
    if (loadingMore || !hasMore) return;

    try {
      setLoadingMore(true);
      const nextPage = page + 1;
      const response = await getVideos(currentUser?.id, nextPage, PAGINATION.DEFAULT_PAGE_SIZE);
      setVideos(prev => [...prev, ...response.videos]);
      setHasMore(response.pagination.hasMore);
      setPage(nextPage);
      setLoadingMore(false);
    } catch (err) {
      console.error('Error loading more videos:', err);
      setLoadingMore(false);
    }
  }, [currentUser, page, loadingMore, hasMore]);

  // Infinite scroll for snap-scrolling feed
  // Check current video position periodically (snap scrolling doesn't fire scroll events reliably)
  useEffect(() => {
    const checkPosition = () => {
      const feedElement = document.querySelector('.video-feed');
      if (!feedElement) return;

      const videoCards = feedElement.querySelectorAll('.video-card');
      if (videoCards.length === 0) {
        return;
      }

      // Get the currently visible video (the one in viewport)
      let currentVideoIndex = 0;
      videoCards.forEach((card, index) => {
        const rect = card.getBoundingClientRect();
        // Check if video is in viewport (centered)
        if (rect.top >= 0 && rect.top < window.innerHeight / 2) {
          currentVideoIndex = index;
        }
      });

      // If we're at second-to-last video or beyond, load more
      const isNearEnd = currentVideoIndex >= videos.length - 2;

      if (isNearEnd && hasMore && !loadingMore) {
        loadMore();
      }
    };

    // Check immediately
    checkPosition();

    // Then check every 500ms
    const interval = setInterval(checkPosition, 500);

    return () => {
      clearInterval(interval);
    };
  }, [videos.length, hasMore, loadingMore, loadMore]);

  // Loading state
  if (loading) {
    return <div className="loading">Loading videos...</div>;
  }

  // Error state
  if (error) {
    return <div className="error">{error}</div>;
  }

  // Main feed view
  return (
    <div className="feed-screen">
      <div className="video-feed">
        {videos.length > 0 ? (
          <>
            {videos.map((video, index) => (
              <VideoCard key={video.id} video={video} isFirst={index === 0} />
            ))}

            {/* Loading indicator */}
            {loadingMore && (
              <div style={{ textAlign: 'center', padding: '20px' }}>
                <div className="loading">Loading more...</div>
              </div>
            )}

            {!hasMore && videos.length > 0 && (
              <div style={{ textAlign: 'center', padding: '20px', color: '#666' }}>
                No more videos
              </div>
            )}
          </>
        ) : (
          <div>No videos available</div>
        )}
      </div>
    </div>
  );
}

export default FeedScreen;