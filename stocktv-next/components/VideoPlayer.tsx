'use client'

import { useRef, useEffect } from 'react'
import { useVideoAspectRatio } from '@/hooks/useVideoAspectRatio'

interface VideoPlayerProps {
    src: string
    isMuted: boolean
    onTimeUpdate: () => void
    onEnded: () => void
    onVideoRef: (ref: HTMLVideoElement | null) => void
}

export default function VideoPlayer({
    src,
    isMuted,
    onTimeUpdate,
    onEnded,
    onVideoRef
}: VideoPlayerProps) {
    const { aspectRatio } = useVideoAspectRatio(src)
    const videoRef = useRef<HTMLVideoElement>(null)

    // Force video to reload when src changes
    useEffect(() => {
        if (videoRef.current) {
            // Completely reset the video element
            const video = videoRef.current
            video.pause()
            video.removeAttribute('src')
            video.load() // Clear current source
            video.src = src // Set new source
            video.load() // Load new source
        }
    }, [src])

    return (
        <video
            ref={(el) => {
                videoRef.current = el
                onVideoRef(el)
            }}
            className={`video-player ${aspectRatio}`}
            playsInline
            muted={isMuted}
            onTimeUpdate={onTimeUpdate}
            onEnded={onEnded}
        />
    )
}
