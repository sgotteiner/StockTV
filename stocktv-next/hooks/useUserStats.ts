// User Stats Hook - Based on React's hooks/useProfileStats.js
// This hook fetches and manages user profile statistics
// USES SERVICE LAYER - No direct DB calls!

'use client'

import { useState, useEffect } from 'react'
import { userService } from '@/services/userService'
import type { UserStats } from '@/types'

/**
 * Custom hook to fetch and manage user profile statistics
 * Based on React's useProfileStats pattern
 * @param userId - User ID
 * @returns stats, loading state
 */
export function useUserStats(userId: string | undefined) {
    const [stats, setStats] = useState<UserStats>({
        videosWatched: 0,
        liked: 0,
        saved: 0,
        following: 0
    })
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!userId) {
            setLoading(false)
            return
        }

        const fetchStats = async () => {
            try {
                setLoading(true)
                const data = await userService.fetchUserStats(userId)
                setStats(data)
            } catch (error) {
                console.error('Failed to fetch user stats:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchStats()
    }, [userId])

    return { stats, loading }
}
