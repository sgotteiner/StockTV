import React, { useState, useRef, useEffect } from 'react';
import { useUser } from '../context/UserProvider';
import * as likesApi from '../services/likesApi';
import VideoInfoView from './VideoInfoView';
import '../App.css';

/**
 * VideoCard Component
 * Displays a single video with swipe functionality and like button
 * @param {Object} video - Video object with id, title, company, date, file_path
 * @param {boolean} isFirst - Whether this is the first video (for auto-play settings)
 */
function VideoCard({ video, isFirst = false }) {
  // Refs for DOM elements and touch/mouse tracking
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const touchStartX = useRef(0);
  const touchStartY = useRef(0); // Added for directional swipe detection
  const touchEndX = useRef(0);
  const mouseStartX = useRef(0);
  const mouseEndX = useRef(0);

  // Context and state
  const { currentUser } = useUser();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showInfo, setShowInfo] = useState(false); // Toggle between video and info view

  // Auto play/pause when video enters/leaves viewport
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setIsInView(true);
          } else {
            setIsInView(false);
          }
        });
      },
      { threshold: 0.5 } // Trigger when 50% of element is visible
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    };
  }, []);

  // Handle auto play/pause based on visibility
  useEffect(() => {
    if (videoRef.current) {
      if (isInView) {
        const playPromise = videoRef.current.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => setIsPlaying(true))
            .catch(error => {
              console.error('Error playing video:', error);
            });
        }
      } else {
        try {
          videoRef.current.pause();
          setIsPlaying(false);
        } catch (error) {
          console.error('Error pausing video:', error);
        }
      }
    }
  }, [isInView]);

  // Load initial like data when component mounts
  useEffect(() => {
    const fetchLikeData = async () => {
      try {
        if (currentUser) {
          const userLikes = await likesApi.getUserLikedVideos(currentUser.id);
          const userLikedVideoIds = userLikes.likedVideos.map(item => item.videoId);
          setIsLiked(userLikedVideoIds.includes(video.id));
        }

        const likeData = await likesApi.getVideoLikes(video.id);
        setLikeCount(likeData.likeCount);
      } catch (error) {
        console.error('Error fetching like data:', error);
      }
    };

    fetchLikeData();
  }, [video.id, currentUser]);

  // Calculate swipe threshold based on current card dimensions
  const calculateSwipeThreshold = () => {
    // 20% of card width (which is based on 90vh * 9/16)
    return (window.innerHeight * 0.9) * (9/16) * 0.2;
  };

  /**
   * Touch Event Handlers
   * Detect horizontal swipes while allowing vertical scrolling
   */
  const handleTouchStart = (e) => {
    const touch = e.targetTouches[0];
    touchStartX.current = touch.clientX;
    touchStartY.current = touch.clientY;
  };

  const handleTouchMove = (e) => {
    const touch = e.targetTouches[0];
    const currentTouchX = touch.clientX;
    const currentTouchY = touch.clientY;

    // Calculate movement differences
    const diffX = touchStartX.current - currentTouchX;
    const diffY = touchStartY.current - currentTouchY;

    // Determine if movement is primarily horizontal or vertical
    const isPrimarilyHorizontal = Math.abs(diffX) > Math.abs(diffY);

    // Only prevent default for horizontal swipes to allow vertical scrolling
    if (isPrimarilyHorizontal) {
      e.preventDefault();
    }

    touchEndX.current = currentTouchX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;

    const diffX = touchStartX.current - touchEndX.current;
    const threshold = calculateSwipeThreshold();

    if (Math.abs(diffX) > threshold) {
      if (diffX > 0) {
        // Swiped left - return to video view
        setShowInfo(false);
      } else {
        // Swiped right - show info view
        setShowInfo(true);
      }
    }

    // Reset touch tracking
    touchStartX.current = 0;
    touchEndX.current = 0;
  };

  /**
   * Mouse Event Handlers
   * Similar to touch events but for desktop users
   */
  const handleMouseDown = (e) => {
    mouseStartX.current = e.clientX;
  };

  const handleMouseMove = (e) => {
    // Only track when left mouse button is pressed
    if (e.buttons !== 1) return;
    mouseEndX.current = e.clientX;
  };

  const handleMouseUp = () => {
    if (!mouseStartX.current || !mouseEndX.current) return;

    const diffX = mouseStartX.current - mouseEndX.current;
    const threshold = calculateSwipeThreshold();

    if (Math.abs(diffX) > threshold) {
      if (diffX > 0) {
        // Dragged left - return to video view
        setShowInfo(false);
      } else {
        // Dragged right - show info view
        setShowInfo(true);
      }
    }

    // Reset mouse tracking
    mouseStartX.current = 0;
    mouseEndX.current = 0;
  };

  // Handle like/unlike functionality
  const handleLike = async () => {
    if (!currentUser) {
      alert('Please log in to like videos');
      return;
    }

    if (isLoading) return;

    setIsLoading(true);

    try {
      if (isLiked) {
        // Unlike the video
        const result = await likesApi.unlikeVideo(video.id, currentUser.id);
        setLikeCount(result.likeCount);
        setIsLiked(false);
      } else {
        // Like the video
        const result = await likesApi.likeVideo(video.id, currentUser.id);
        setLikeCount(result.likeCount);
        setIsLiked(true);
      }
    } catch (error) {
      console.error('Error updating like:', error);
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
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onTouchCancel={handleTouchEnd}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={() => {
            // Reset tracking when mouse leaves
            mouseStartX.current = 0;
            mouseEndX.current = 0;
          }}
        >
          <video
            ref={videoRef}
            src={video.file_path}
            controls
            autoPlay
            muted={isFirst}
            preload="metadata"
            className="video-player"
            onEnded={() => {
              // Scroll to next video when current one ends
              const nextCard = containerRef.current?.nextElementSibling;
              if (nextCard) {
                nextCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
                const nextVideo = nextCard.querySelector('video');
                if (nextVideo) {
                  nextVideo.play().catch(e => console.error('Error playing next video:', e));
                }
              }
            }}
            onError={(e) => console.error('Video loading error:', e)}
            onLoadedMetadata={() => {
              if (videoRef.current && !videoRef.current.playing) {
                const playPromise = videoRef.current.play();
                if (playPromise !== undefined) {
                  playPromise
                    .then(() => setIsPlaying(true))
                    .catch(error => {
                      console.info('Autoplay failed due to browser policy:', error);
                    });
                }
              }
            }}
            onCanPlay={() => console.log('Video can play')}
          />
          <button
            className={`like-button ${isLiked ? 'liked' : ''}`}
            onClick={handleLike}
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