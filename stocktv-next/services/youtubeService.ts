// YouTube Service - Handles YouTube video download and processing
// Extracted from API route for better separation of concerns

import { exec } from 'child_process'
import { promisify } from 'util'
import fs from 'fs/promises'
import path from 'path'
import { createAdminClient } from '@/lib/supabase'

const execAsync = promisify(exec)

/**
 * Generate a UUID v4 (compatible with all environments)
 */
function generateUUID(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        const r = Math.random() * 16 | 0
        const v = c === 'x' ? r : (r & 0x3 | 0x8)
        return v.toString(16)
    })
}

export const youtubeService = {
    /**
     * Validate YouTube URL format
     */
    validateUrl(url: string): boolean {
        const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com\/(watch\?v=|shorts\/)|youtu\.be\/)[a-zA-Z0-9_-]{11}(&.*)?$/
        return youtubeRegex.test(url)
    },

    /**
     * Download video from YouTube using yt-dlp
     * @returns Path to downloaded file
     */
    async downloadVideo(youtubeUrl: string): Promise<string> {
        // Create temp directory
        const tempDir = path.join(process.cwd(), 'temp')
        await fs.mkdir(tempDir, { recursive: true })

        // Download video using yt-dlp
        const outputPath = path.join(tempDir, `${Date.now()}.mp4`)
        const command = `yt-dlp -f "best[ext=mp4]" -o "${outputPath}" "${youtubeUrl}"`

        console.log('Executing yt-dlp command:', command)

        try {
            const { stdout, stderr } = await execAsync(command)
            console.log('yt-dlp stdout:', stdout)
            if (stderr) console.log('yt-dlp stderr:', stderr)
            return outputPath
        } catch (error: any) {
            console.error('yt-dlp execution error:', error)
            throw new Error(`Failed to download YouTube video: ${error.message}. Make sure yt-dlp is installed.`)
        }
    },

    /**
     * Upload video file to Supabase Storage
     * @returns Public URL of uploaded video
     */
    async uploadToStorage(filePath: string): Promise<{ videoId: string; publicUrl: string }> {
        console.log('Reading downloaded file from:', filePath)
        const fileBuffer = await fs.readFile(filePath)
        console.log('File read successfully, size:', fileBuffer.length, 'bytes')

        // Generate video ID and use as filename
        const videoId = generateUUID()
        const fileName = `${videoId}.mp4`
        const storagePath = `videos/${fileName}`

        // Upload to Supabase Storage
        console.log('Uploading to Supabase storage:', storagePath)
        const supabase = createAdminClient()
        const { error: uploadError } = await supabase.storage
            .from('videos')
            .upload(storagePath, fileBuffer, {
                contentType: 'video/mp4',
                cacheControl: '3600',
                upsert: false
            })

        if (uploadError) {
            console.error('Supabase upload error:', uploadError)
            throw new Error(`Failed to upload to storage: ${uploadError.message}`)
        }

        console.log('Upload to Supabase successful')

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
            .from('videos')
            .getPublicUrl(storagePath)

        console.log('Public URL:', publicUrl)

        return { videoId, publicUrl }
    },

    /**
     * Clean up temporary file
     */
    async cleanupTempFile(filePath: string): Promise<void> {
        console.log('Cleaning up temporary file:', filePath)
        await fs.unlink(filePath)
        console.log('Temporary file deleted.')
    }
}
