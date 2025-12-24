// User Service - Based on React's hooks/useProfileStats.js pattern
// This service handles user-related data operations

import { createAdminClient } from '@/lib/supabase'
import type { UserStats } from '@/types'

export const userService = {
    /**
     * Fetch user statistics
     * Based on React's useProfileStats hook logic
     */
    async fetchUserStats(userId: string): Promise<UserStats> {
        const supabase = createAdminClient()

        // Get liked videos count
        const { count: likedCount } = await supabase
            .from('user_video_interactions')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', userId)
            .eq('liked', true)

        // Get saved videos count
        const { count: savedCount } = await supabase
            .from('user_video_interactions')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', userId)
            .eq('saved', true)

        // Get following companies count
        const { data, error } = await supabase
            .from('user_company_interactions')
            .select('company_id')
            .eq('user_id', userId)

        if (error) throw error
        const followingCount = data?.length || 0

        // Get videos watched count
        const { count: watchedCount } = await supabase
            .from('user_video_interactions')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', userId)

        return {
            videosWatched: watchedCount || 0,
            liked: likedCount || 0,
            saved: savedCount || 0,
            following: followingCount || 0
        }
    }
}
