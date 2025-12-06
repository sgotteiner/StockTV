import React, { useState, useEffect } from 'react';
import VideoCard from '../components/VideoCard';
import { getVideos } from '../services/api';
import '../App.css';

/**
 * FeedScreen Component
 * Displays the main video feed with scrolling and video cards
 */
function FeedScreen() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load videos when component mounts
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const videoData = await getVideos();
        setVideos(videoData);
        setLoading(false);
      } catch (err) {
        setError('Failed to load videos');
        setLoading(false);
        console.error('Error fetching videos:', err);
      }
    };

    fetchVideos();
  }, []);

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
          videos.map((video, index) => (
            <VideoCard key={video.id} video={video} isFirst={index === 0} />
          ))
        ) : (
          <div>No videos available</div>
        )}
      </div>
    </div>
  );
}

export default FeedScreen;