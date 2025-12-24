// Interaction Service - Based on React's services/interactionsApi.js
// This service handles all video interaction operations (likes, views, saves)

import { createAdminClient } from '@/lib/supabase'
import type { LikeResult, UserLikesResponse, UserSavesResponse } from '@/types'

export const interactionService = {
    /**
     * Get total like count for a video
     * Based on React's getVideoLikes()
     */
    async getVideoLikes(videoId: string): Promise<number> {
        const supabase = createAdminClient()

        const { count, error } = await supabase
            .from('user_video_interactions')
            .select('*', { count: 'exact', head: true })
            .eq('video_id', videoId)
            .eq('liked', true)

        if (error) {
            console.error('Error fetching video likes:', error)
            return 0
        }

        return count || 0
    },

    /**
     * Get all videos liked by a user
     * Based on React's getUserLikedVideos()
     */
    async getUserLikedVideos(userId: string): Promise<UserLikesResponse> {
        const supabase = createAdminClient()

        const { data, error } = await supabase
            .from('user_video_interactions')
            .select('video_id, liked')
            .eq('user_id', userId)
            .eq('liked', true)

        if (error) {
            console.error('Error fetching user likes:', error)
            return { likedVideos: [] }
        }

        return {
            likedVideos: (data || [])
                .filter(item => item.video_id !== null)
                .map(item => ({ videoId: item.video_id as string }))
        }
    },

    /**
     * Like a video
     * Based on React's likeVideo()
     */
    async likeVideo(videoId: string, userId: string): Promise<LikeResult> {
        const supabase = createAdminClient()

        // Generate unique ID for new interactions
        const interactionId = `${userId}_${videoId}`

        const { error } = await supabase
            .from('user_video_interactions')
            .upsert({
                id: interactionId,
                user_id: userId,
                video_id: videoId,
                liked: true,
                viewed_at: new Date().toISOString()
            }, {
                onConflict: 'user_id,video_id'
            })

        if (error) {
            throw new Error(`Failed to like video: ${error.message}`)
        }

        const likeCount = await this.getVideoLikes(videoId)
        return { likeCount }
    },

    /**
     * Unlike a video
     * Based on React's unlikeVideo()
     */
    async unlikeVideo(videoId: string, userId: string): Promise<LikeResult> {
        const supabase = createAdminClient()

        const { error } = await supabase
            .from('user_video_interactions')
            .update({ liked: false })
            .eq('user_id', userId)
            .eq('video_id', videoId)

        if (error) {
            throw new Error(`Failed to unlike video: ${error.message}`)
        }

        const likeCount = await this.getVideoLikes(videoId)
        return { likeCount }
    },

    /**
     * Record a video view
     * Based on React's recordVideoView()
     */
    async recordVideoView(videoId: string, userId: string) {
        const supabase = createAdminClient()

        // Generate unique ID for new interactions
        const interactionId = `${userId}_${videoId}`

        const { error } = await supabase
            .from('user_video_interactions')
            .upsert({
                id: interactionId,
                user_id: userId,
                video_id: videoId,
                viewed_at: new Date().toISOString()
            }, {
                onConflict: 'user_id,video_id'
            })

        if (error) {
            throw new Error(`Failed to record view: ${error.message}`)
        }

        return { success: true }
    },

    /**
     * Save a video
     * Based on React's saveVideo()
     */
    async saveVideo(videoId: string, userId: string) {
        const supabase = createAdminClient()

        // Generate unique ID for new interactions
        const interactionId = `${userId}_${videoId}`

        const { error } = await supabase
            .from('user_video_interactions')
            .upsert({
                id: interactionId,
                user_id: userId,
                video_id: videoId,
                saved: true
            }, {
                onConflict: 'user_id,video_id'
            })

        if (error) {
            throw new Error(`Failed to save video: ${error.message}`)
        }

        return { success: true }
    },

    /**
     * Unsave a video
     * Based on React's unsaveVideo()
     */
    async unsaveVideo(videoId: string, userId: string) {
        const supabase = createAdminClient()

        const { error } = await supabase
            .from('user_video_interactions')
            .update({ saved: false })
            .eq('user_id', userId)
            .eq('video_id', videoId)

        if (error) {
            throw new Error(`Failed to unsave video: ${error.message}`)
        }

        return { success: true }
    },

    /**
     * Get all videos saved by a user
     * Based on React's getUserSavedVideos()
     */
    async getUserSavedVideos(userId: string): Promise<UserSavesResponse> {
        const supabase = createAdminClient()

        const { data, error } = await supabase
            .from('user_video_interactions')
            .select('video_id')
            .eq('user_id', userId)
            .eq('saved', true)

        if (error) {
            console.error('Error fetching saved videos:', error)
            return { savedVideos: [] }
        }

        return {
            savedVideos: (data || [])
                .filter(item => item.video_id !== null)
                .map(item => ({ videoId: item.video_id as string }))
        }
    }
}
