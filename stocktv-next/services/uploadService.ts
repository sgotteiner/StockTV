// Upload Service - Based on React's services/uploadApi.js
// Handles video uploads to Supabase Storage
// Supports YouTube URLs, file uploads, and direct video URLs
// REFACTORED: Uses shared service methods

import { createAdminClient } from '@/lib/supabase'
import { companyService } from './companyService'

/**
 * Generate a UUID v4 (browser-compatible)
 */
function generateUUID(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        const r = Math.random() * 16 | 0
        const v = c === 'x' ? r : (r & 0x3 | 0x8)
        return v.toString(16)
    })
}

/**
 * Upload file/blob to Supabase Storage and create database record
 * Shared logic for file and URL uploads
 */
async function uploadToStorageAndCreateRecord(
    fileOrBlob: File | Blob,
    title: string,
    companyName: string,
    userId: string
) {
    const supabase = createAdminClient()

    // Generate video ID first
    const videoId = generateUUID()
    const fileName = `${videoId}.mp4`
    const filePath = `videos/${fileName}`

    // Upload to Supabase Storage with ID as filename
    const { error: uploadError } = await supabase.storage
        .from('videos')
        .upload(filePath, fileOrBlob, {
            cacheControl: '3600',
            upsert: false
        })

    if (uploadError) {
        throw new Error(`Failed to upload video file: ${uploadError.message}`)
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
        .from('videos')
        .getPublicUrl(filePath)

    // Get or create company (using shared service)
    const company = await companyService.getOrCreateCompany(companyName)

    // Create video record in database with pre-generated ID
    const { data: video, error: dbError } = await supabase
        .from('videos')
        .insert({
            id: videoId,
            title,
            file_path: publicUrl,
            company_id: company.id,
            uploaded_by: userId,
            created_at: new Date().toISOString()
        })
        .select()
        .single()

    if (dbError) {
        // Clean up uploaded file if database insert fails
        await supabase.storage.from('videos').remove([filePath])
        throw new Error(`Failed to create video record: ${dbError.message}`)
    }

    return { success: true, video }
}

export const uploadService = {
    /**
     * Upload a video file to Supabase Storage
     * Based on React's uploadVideoFile()
     */
    async uploadVideoFile(file: File, companyName: string, userId: string) {
        const title = file.name.replace(/\.[^/.]+$/, '') // Remove extension for title
        return uploadToStorageAndCreateRecord(file, title, companyName, userId)
    },

    /**
     * Upload a video from YouTube URL
     * Based on React's uploadYouTubeVideo()
     * Uses Next.js API route to handle YouTube download
     */
    async uploadFromYouTube(youtubeUrl: string, companyName: string, userId: string) {
        // Call Next.js API route to handle YouTube download
        const response = await fetch('/api/upload/youtube', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ youtubeUrl, companyName, userId }),
        })

        if (!response.ok) {
            const errorData = await response.json()
            throw new Error(errorData.error || 'Failed to upload YouTube video')
        }

        return await response.json()
    },

    /**
     * Upload a video from direct URL
     * Based on React's uploadVideoUrl()
     */
    async uploadFromUrl(videoUrl: string, companyName: string, userId: string) {
        // Fetch video from URL
        const response = await fetch(videoUrl)
        if (!response.ok) {
            throw new Error('Failed to fetch video from URL')
        }

        const blob = await response.blob()

        // Get original name for title
        const urlParts = videoUrl.split('/')
        const originalName = urlParts[urlParts.length - 1].split('?')[0]
        const title = originalName.replace(/\.[^/.]+$/, '') // Remove extension

        return uploadToStorageAndCreateRecord(blob, title, companyName, userId)
    },
}
