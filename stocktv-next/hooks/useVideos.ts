// Videos Hook - Based on React's hooks/useInfiniteScroll.js
// This hook fetches and manages video list with infinite scroll
// USES SERVICE LAYER - No direct DB calls!

'use client'

import { useState, useEffect, useCallback } from 'react'
import { videoService } from '@/services/videoService'
import type { VideoWithCompany } from '@/types'

const PAGINATION = {
    DEFAULT_PAGE_SIZE: 20,  // Increased to load all videos
    DEFAULT_PAGE: 1
}

/**
 * Custom hook for infinite scroll pagination
 * Based on React's useInfiniteScroll.js (102 lines)
 * @param userId - Current user ID for personalized feed (optional)
 * @returns videos, loading, loadingMore, error, hasMore, loadMore
 */
export function useVideos(userId?: string) {
    const [videos, setVideos] = useState<VideoWithCompany[]>([])
    const [loading, setLoading] = useState(true)
    const [loadingMore, setLoadingMore] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [page, setPage] = useState(PAGINATION.DEFAULT_PAGE)
    const [hasMore, setHasMore] = useState(true)

    // Load initial videos
    useEffect(() => {
        const fetchInitialVideos = async () => {
            try {
                setLoading(true)
                setPage(PAGINATION.DEFAULT_PAGE)
                const data = await videoService.getVideos(
                    userId,
                    PAGINATION.DEFAULT_PAGE,
                    PAGINATION.DEFAULT_PAGE_SIZE
                )
                setVideos(data)
                // If we got less than page size, no more videos
                setHasMore(data.length >= PAGINATION.DEFAULT_PAGE_SIZE)
                setError(null)
            } catch (err) {
                setError('Failed to load videos')
                console.error('Error fetching videos:', err)
            } finally {
                setLoading(false)
            }
        }

        fetchInitialVideos()
    }, [userId])


    // Load more videos
    const loadMore = useCallback(async () => {
        if (loadingMore || !hasMore) return

        try {
            setLoadingMore(true)
            const nextPage = page + 1
            const data = await videoService.getVideos(userId, nextPage, PAGINATION.DEFAULT_PAGE_SIZE)

            // Filter out duplicates by ID before appending
            let newVideosCount = 0
            setVideos(prev => {
                const existingIds = new Set(prev.map(v => v.id))
                const newVideos = data.filter(v => !existingIds.has(v.id))
                newVideosCount = newVideos.length
                return [...prev, ...newVideos]
            })

            // Only hasMore if we got new unique videos
            setHasMore(newVideosCount > 0 && data.length >= PAGINATION.DEFAULT_PAGE_SIZE)
            setPage(nextPage)
        } catch (err) {
            console.error('Error loading more videos:', err)
        } finally {
            setLoadingMore(false)
        }
    }, [userId, page, loadingMore, hasMore])

    // Detect scroll position for snap-scrolling feeds
    useEffect(() => {
        const checkPosition = () => {
            const feedElement = document.querySelector('.video-feed')
            if (!feedElement) return

            const videoCards = feedElement.querySelectorAll('.video-card')
            if (videoCards.length === 0) return

            // Find currently visible video
            let currentVideoIndex = 0
            videoCards.forEach((card, index) => {
                const rect = card.getBoundingClientRect()
                if (rect.top >= 0 && rect.top < window.innerHeight / 2) {
                    currentVideoIndex = index
                }
            })

            // Load more if near end
            const isNearEnd = currentVideoIndex >= videos.length - 2
            if (isNearEnd && hasMore && !loadingMore) {
                loadMore()
            }
        }

        checkPosition()
        const interval = setInterval(checkPosition, 500)

        return () => clearInterval(interval)
    }, [videos.length, hasMore, loadingMore]) // Removed loadMore from dependencies to prevent infinite loop

    return { videos, loading, loadingMore, error, hasMore, loadMore }
}
