import React from 'react';
import VideoCard from '../components/VideoCard';
import { useUser } from '../context/UserProvider';
import { useInfiniteScroll } from '../hooks/useInfiniteScroll';
import '../App.css';

/**
 * FeedScreen Component
 * Displays personalized video feed with infinite scroll
 */
function FeedScreen() {
  const { currentUser } = useUser();
  const { videos, loading, loadingMore, error, hasMore } = useInfiniteScroll(currentUser?.id);

  if (loading) {
    return <div className="loading">Loading videos...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="feed-screen">
      <div className="video-feed">
        {videos.length > 0 ? (
          <>
            {videos.map((video, index) => (
              <VideoCard key={video.id} video={video} isFirst={index === 0} />
            ))}

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