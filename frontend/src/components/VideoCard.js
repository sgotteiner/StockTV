import React, { useState, useEffect, useRef } from 'react';
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
    play,
    pause,
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

  // Handle pause/resume when switching to/from info view
  const wasPlayingRef = useRef(false);
  const previousShowInfoRef = useRef(showInfo);

  useEffect(() => {
    // Only act when showInfo actually changes
    if (previousShowInfoRef.current !== showInfo) {
      if (showInfo) {
        // Going to info view - remember current playing state and pause
        wasPlayingRef.current = isPlaying;
        if (isPlaying) {
          pause();
        }
      } else {
        // Returning from info view - resume if was playing
        if (wasPlayingRef.current) {
          // Small delay to ensure DOM is ready
          setTimeout(() => {
            play();
          }, 100);
        }
      }
      previousShowInfoRef.current = showInfo;
    }
  }, [showInfo, isPlaying, play, pause]);

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
      {/* Video container - always mounted, hidden when showing info */}
      <div
        className="video-container"
        {...swipeHandlers}
        onClick={togglePlayPause}
        style={{ display: showInfo ? 'none' : 'block' }}
      >
        <video
          ref={videoRef}
          src={video.file_path}
          playsInline
          muted={isMuted}
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

      {/* Info view - shown on top when active */}
      {showInfo && (
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