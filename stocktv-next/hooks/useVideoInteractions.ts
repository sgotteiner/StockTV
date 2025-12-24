// Video Interactions Hook - Based on React's hooks/useVideoInteractions.js
// This hook manages video interaction state (likes, views)
// USES SERVICE LAYER - No direct DB calls!

'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { interactionService } from '@/services/interactionService'
import type { Video, User } from '@/types'

/**
 * Custom hook to manage video interactions (likes, views)
 * Based on React's useVideoInteractions pattern
 * @param video - Video object
 * @param currentUser - Current user object
 * @returns Interaction state and handlers
 */
export function useVideoInteractions(video: Video, currentUser: User | null) {
    const [likeCount, setLikeCount] = useState(0)
    const [isLiked, setIsLiked] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [viewRecorded, setViewRecorded] = useState(false)

    // Load initial like data - USES SERVICE (like React)
    useEffect(() => {
        const fetchLikeData = async () => {
            try {
                if (currentUser) {
                    const userLikes = await interactionService.getUserLikedVideos(currentUser.id)
                    const userLikedVideoIds = userLikes.likedVideos.map(item => item.videoId)
                    setIsLiked(userLikedVideoIds.includes(video.id))
                }
                const count = await interactionService.getVideoLikes(video.id)
                setLikeCount(count)
            } catch (error) {
                console.error('Error fetching like data:', error)
            }
        }
        fetchLikeData()
    }, [video.id, currentUser])

    // Record view when video starts playing - USES SERVICE (like React)
    const recordView = useCallback(async (isPlaying: boolean) => {
        if (isPlaying && currentUser && !viewRecorded) {
            try {
                await interactionService.recordVideoView(video.id, currentUser.id)
                setViewRecorded(true)
            } catch (error) {
                console.error('Error recording video view:', error)
            }
        }
    }, [video.id, currentUser, viewRecorded])

    // Handle like/unlike - USES SERVICE (like React)
    const toggleLike = useCallback(async () => {
        if (!currentUser || isLoading) {
            return { requiresLogin: !currentUser }
        }

        setIsLoading(true)
        try {
            if (isLiked) {
                const result = await interactionService.unlikeVideo(video.id, currentUser.id)
                setLikeCount(result.likeCount)
                setIsLiked(false)
            } else {
                const result = await interactionService.likeVideo(video.id, currentUser.id)
                setLikeCount(result.likeCount)
                setIsLiked(true)
            }
            return { success: true }
        } catch (error) {
            console.error('Error toggling like:', error)
            return { success: false, error: (error as Error).message }
        } finally {
            setIsLoading(false)
        }
    }, [video.id, currentUser, isLiked, isLoading])

    return useMemo(() => ({
        likeCount,
        isLiked,
        isLoading,
        recordView,
        toggleLike
    }), [likeCount, isLiked, isLoading, recordView, toggleLike])
}
