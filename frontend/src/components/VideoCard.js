import React, { useState, useEffect } from 'react';
import { useSwipe } from '../hooks/useSwipe';
import { useVideoPlayback } from '../hooks/useVideoPlayback';
import { useUser } from '../context/UserProvider';
import { useNavigation } from '../context/NavigationContext';
import { useMedia } from '../context/MediaContext';
import * as interactionsApi from '../services/interactionsApi';
import VideoInfoView from './VideoInfoView';
import '../App.css';

/**
 * VideoCard Component
 * Displays a single video with swipe functionality and like button
 */
function VideoCard({ video, isFirst = false }) {
  // Use custom playback hook
  const {
    videoRef,
    containerRef,
    isPlaying,
    progress,
    togglePlayPause,
    handleTimeUpdate,
    handleSeek,
    handleVideoEnd
  } = useVideoPlayback(isFirst);

  // Context and other state
  const { currentUser } = useUser();
  const { setActiveTab } = useNavigation();
  const { isMuted, toggleMute } = useMedia();

  const [likeCount, setLikeCount] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showInfo, setShowInfo] = useState(false);

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

  // Track if view has been recorded for this video in this session
  const [viewRecorded, setViewRecorded] = useState(false);

  // Record view when video starts playing (track all videos as they're viewed)
  useEffect(() => {
    if (isPlaying && currentUser && !viewRecorded) {
      const recordView = async () => {
        try {
          await interactionsApi.recordVideoView(video.id, currentUser.id);
          setViewRecorded(true); // Mark that view has been recorded for this session
        } catch (error) {
          console.error('Error recording video view:', error);
        }
      };
      recordView();
    }
  }, [isPlaying, currentUser, video.id, viewRecorded]);

  // Use Swipe Hook
  const swipeHandlers = useSwipe({
    onSwipeLeft: () => setShowInfo(false),
    onSwipeRight: () => setShowInfo(true),
    threshold: (window.innerHeight * 0.9) * (9 / 16) * 0.2
  });

  // Handle like/unlike functionality
  const handleLike = async () => {
    if (!currentUser) {
      if (window.confirm('Please log in to like videos. Go to login page?')) {
        setActiveTab('profile');
      }
      return;
    }

    if (isLoading) return;
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
    } catch (error) {
      alert('Failed to update like. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className={`video-card ${showInfo ? 'info-view' : 'video-view'}`}
      ref={containerRef}
    >
      {!showInfo ? (
        // Main video view
        <div
          className="video-container"
          {...swipeHandlers}
          onClick={togglePlayPause} // Tap to Play/Pause
        >
          <video
            ref={videoRef}
            src={video.file_path}
            playsInline
            className="video-player"
            onTimeUpdate={handleTimeUpdate}
            onEnded={handleVideoEnd}
          />

          {/* Custom Play/Pause Overlay Icon */}
          {!isPlaying && (
            <div className="play-icon-overlay">▶</div>
          )}

          {/* Progress Bar */}
          <div
            className="video-progress-container"
            onClick={handleSeek}
            style={{ cursor: 'pointer' }}
          >
            <div
              className="video-progress-bar"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Mute Indicator Overlay */}
          <button
            className="mute-overlay"
            style={{
              position: 'absolute',
              top: '2%',
              left: '2%',
              zIndex: 20,
              background: 'rgba(0,0,0,0.5)',
              border: 'none',
              borderRadius: '50%',
              padding: '10px',
              fontSize: '24px',
              cursor: 'pointer',
              color: 'white'
            }}
            onClick={(e) => { e.stopPropagation(); toggleMute(); }}
          >
            {isMuted ? '🔇' : '🔊'}
          </button>

          <button
            className={`like-button ${isLiked ? 'liked' : ''}`}
            onClick={(e) => { e.stopPropagation(); handleLike(); }}
          >
            {isLiked ? '♥' : '♡'} {likeCount}
          </button>
        </div>
      ) : (
        // Info view showing video details
        <VideoInfoView
          video={video}
          likeCount={likeCount}
          onBack={() => setShowInfo(false)}
        />
      )}
    </div>
  );
}

export default VideoCard;