'use client'

import React, { useState, useEffect, useRef } from 'react'
import { useSwipe } from '@/hooks/useSwipe'
import { useVideoPlayback } from '@/hooks/useVideoPlayback'
import { useVideoInteractions } from '@/hooks/useVideoInteractions'
import { useUser } from '@/context/UserProvider'
import { useMedia } from '@/context/MediaContext'
import VideoInfoView from './VideoInfoView'
import VideoOptionsMenu from './VideoOptionsMenu'
import '../app/videoStyles.css'
import '../app/videoPlayer.css'

interface VideoCardProps {
    video: {
        id: string
        title: string
        file_path: string
        companies?: { name: string; website?: string }
    }
    isFirst?: boolean
}

export default function VideoCard({ video, isFirst = false }: VideoCardProps) {
    const { currentUser } = useUser()
    const { isMuted, toggleMute } = useMedia()

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
    } = useVideoPlayback(isFirst)

    const { likeCount, isLiked, recordView, toggleLike } = useVideoInteractions(video, currentUser)

    const [showInfo, setShowInfo] = useState(false)
    const [showOptions, setShowOptions] = useState(false)

    // Record view when video starts playing
    useEffect(() => {
        recordView(isPlaying)
    }, [isPlaying, recordView])

    // Handle pause/resume when switching to/from info view
    const wasPlayingRef = useRef(false)
    const previousShowInfoRef = useRef(showInfo)

    useEffect(() => {
        if (previousShowInfoRef.current !== showInfo) {
            if (showInfo) {
                wasPlayingRef.current = isPlaying
                if (isPlaying) {
                    pause()
                }
            } else {
                if (wasPlayingRef.current) {
                    setTimeout(() => {
                        play()
                    }, 100)
                }
            }
            previousShowInfoRef.current = showInfo
        }
    }, [showInfo, isPlaying, play, pause])

    // Swipe handlers
    const swipeHandlers = useSwipe({
        onSwipeLeft: () => setShowInfo(false),
        onSwipeRight: () => setShowInfo(true),
        threshold: 50
    })

    const handleLike = async () => {
        const result = await toggleLike()
        if (result?.requiresLogin) {
            alert('Please login to like videos')
        }
    }

    return (
        <div className="video-card" ref={containerRef}>
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
                    onError={(e) => {
                        console.error('❌ Video error for', video.title, ':', e)
                        console.error('❌ Video src:', videoRef.current?.src)
                        console.error('❌ Video currentSrc:', videoRef.current?.currentSrc)
                    }}
                />

                {!isPlaying && <div className="play-icon-overlay">▶</div>}

                <div className="video-progress-container" onClick={handleSeek}>
                    <div className="video-progress-bar" style={{ width: `${progress}%` }} />
                </div>

                <div className="video-info">
                    <h2 className="video-title">{video.title}</h2>
                    {video.companies?.name && (
                        <p className="company-name">{video.companies.name}</p>
                    )}
                </div>

                <button className="mute-overlay" onClick={(e) => { e.stopPropagation(); toggleMute() }}>
                    {isMuted ? '🔇' : '🔊'}
                </button>

                <button className="video-options-button" onClick={(e) => { e.stopPropagation(); setShowOptions(true) }}>
                    ⋮
                </button>

                <button className={`like-button ${isLiked ? 'liked' : ''}`} onClick={(e) => { e.stopPropagation(); handleLike() }}>
                    {isLiked ? '♥' : '♡'} {likeCount}
                </button>
            </div>

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
    )
}
