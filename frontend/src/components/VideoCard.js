import React, { useState, useEffect } from 'react';
import { useSwipe } from '../hooks/useSwipe';
import { useVideoPlayback } from '../hooks/useVideoPlayback';
import { useVideoInteractions } from '../hooks/useVideoInteractions';
import { useVideoAspectRatio } from '../hooks/useVideoAspectRatio';
import { useUser } from '../context/UserProvider';
import { useNavigation } from '../context/NavigationContext';
import { useMedia } from '../context/MediaContext';
import VideoInfoView from './VideoInfoView';
import VideoOptionsMenu from './VideoOptionsMenu';
import '../App.css';
import '../styles/videoOptionsStyles.css';
import '../styles/adaptiveVideoStyles.css';

/**
 * VideoCard Component
 * Displays a single video with swipe functionality and like button
 */
function VideoCard({ video, isFirst = false }) {
  // Custom hooks
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

  const { currentUser } = useUser();
  const { setActiveTab } = useNavigation();
  const { isMuted, toggleMute } = useMedia();

  const {
    likeCount,
    isLiked,
    recordView,
    toggleLike
  } = useVideoInteractions(video, currentUser);

  const [showInfo, setShowInfo] = useState(false);
  const [showOptions, setShowOptions] = useState(false);

  // Detect video aspect ratio
  const { aspectRatio } = useVideoAspectRatio(video.file_path);

  // Record view when video starts playing
  useEffect(() => {
    recordView(isPlaying);
  }, [isPlaying, recordView]);

  // Swipe handlers
  const swipeHandlers = useSwipe({
    onSwipeLeft: () => setShowInfo(false),
    onSwipeRight: () => setShowInfo(true),
    threshold: (window.innerHeight * 0.9) * (9 / 16) * 0.2
  });

  const handleLike = async () => {
    const result = await toggleLike();

    if (result.requiresLogin) {
      if (window.confirm('Please log in to like videos. Go to login page?')) {
        setActiveTab('profile');
      }
    } else if (!result.success) {
      alert('Failed to update like. Please try again.');
    }
  };

  return (
    <div
      className={`video-card aspect-${aspectRatio} ${showInfo ? 'info-view' : 'video-view'}`}
      ref={containerRef}
    >
      {!showInfo ? (
        <div
          className="video-container"
          {...swipeHandlers}
          onClick={togglePlayPause}
        >
          <video
            ref={videoRef}
            src={video.file_path}
            playsInline
            className="video-player"
            onTimeUpdate={handleTimeUpdate}
            onEnded={handleVideoEnd}
          />

          {!isPlaying && (
            <div className="play-icon-overlay">▶</div>
          )}

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
            className="video-options-button"
            onClick={(e) => { e.stopPropagation(); setShowOptions(true); }}
          >
            ⋮
          </button>

          <button
            className={`like-button ${isLiked ? 'liked' : ''}`}
            onClick={(e) => { e.stopPropagation(); handleLike(); }}
          >
            {isLiked ? '♥' : '♡'} {likeCount}
          </button>
        </div>
      ) : (
        <VideoInfoView
          video={video}
          likeCount={likeCount}
          onBack={() => setShowInfo(false)}
        />
      )}

      {showOptions && (
        <VideoOptionsMenu
          video={video}
          currentUser={currentUser}
          onClose={() => setShowOptions(false)}
        />
      )}
    </div>
  );
}

export default VideoCard;