// Video Aspect Ratio Hook - Based on React's hooks/useVideoAspectRatio.js
// Detects video aspect ratio and adapts display
// CLEAN: Pure logic, no UI

'use client'

import { useState, useEffect, useRef } from 'react'

/**
 * Custom hook to detect video aspect ratio and adapt display
 * Based on React's useVideoAspectRatio.js (54 lines)
 * @param videoSrc - Video source URL
 * @returns Aspect ratio info and ref
 */
export function useVideoAspectRatio(videoSrc: string) {
    const [aspectRatio, setAspectRatio] = useState<'vertical' | 'horizontal' | 'square'>('vertical')
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 })
    const videoRef = useRef<HTMLVideoElement>(null)

    useEffect(() => {
        const video = videoRef.current
        if (!video) return

        const handleLoadedMetadata = () => {
            const width = video.videoWidth
            const height = video.videoHeight

            setDimensions({ width, height })

            // Determine aspect ratio
            const ratio = width / height

            if (ratio < 0.75) {
                // Portrait/Vertical (like TikTok 9:16)
                setAspectRatio('vertical')
            } else if (ratio > 1.33) {
                // Landscape/Horizontal (like YouTube 16:9)
                setAspectRatio('horizontal')
            } else {
                // Square-ish (1:1 or close)
                setAspectRatio('square')
            }
        }

        video.addEventListener('loadedmetadata', handleLoadedMetadata)

        return () => {
            video.removeEventListener('loadedmetadata', handleLoadedMetadata)
        }
    }, [videoSrc])

    return {
        videoRef,
        aspectRatio,
        dimensions,
        isVertical: aspectRatio === 'vertical',
        isHorizontal: aspectRatio === 'horizontal',
        isSquare: aspectRatio === 'square'
    }
}
