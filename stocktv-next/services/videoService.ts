// Video Service - Based on React's services/api.js
// This service handles video fetching operations

import { createAdminClient } from '@/lib/supabase'
import type { VideoWithCompany } from '@/types'

export const videoService = {
    /**
     * Get videos with smart feed algorithm
     * Priority: 1) Last view time, 2) Video recency, 3) Company follow status
     * 
     * Scoring system:
     * - Never viewed: 1000 pts
     * - Viewed >7 days ago: 700 pts
     * - Viewed >3 days ago: 500 pts
     * - Viewed >1 day ago: 300 pts
     * - Viewed today: 100 pts
     * 
     * - Posted today: 100 pts
     * - Posted this week: 70 pts
     * - Posted this month: 40 pts
     * - Older: 10 pts
     * 
     * - Followed company: 10 pts
     * - Not followed: 0 pts
     */
    async getVideos(userId?: string, page = 1, limit = 10): Promise<VideoWithCompany[]> {
        const supabase = createAdminClient()
        const offset = (page - 1) * limit

        if (userId) {
            // Smart feed with scoring for logged-in users
            const { data, error } = await supabase.rpc('get_smart_feed', {
                p_user_id: userId,
                p_limit: limit,
                p_offset: offset
            })

            if (error) {
                console.error('Smart feed error:', error)
                // Fallback to simple query
                return this.getVideos(undefined, page, limit)
            }

            return data as VideoWithCompany[]
        }

        // Simple chronological feed for anonymous users
        const { data, error } = await supabase
            .from('videos')
            .select(`
                *,
                companies (
                    id,
                    name,
                    website
                )
            `)
            .order('created_at', { ascending: false })
            .range(offset, offset + limit - 1)

        if (error) {
            throw new Error('Failed to fetch videos')
        }

        console.log('📊 Database returned videos:', data.map(v => ({
            id: v.id,
            title: v.title,
            file_path: v.file_path
        })))

        return data as VideoWithCompany[]
    },

    /**
     * Get a single video by ID
     */
    async getVideoById(videoId: string): Promise<VideoWithCompany | null> {
        const supabase = createAdminClient()

        const { data, error } = await supabase
            .from('videos')
            .select(`
                *,
                companies (
                    id,
                    name,
                    website
                )
            `)
            .eq('id', videoId)
            .single()

        if (error) {
            console.error('Error fetching video:', error)
            return null
        }

        return data as VideoWithCompany
    }
}
