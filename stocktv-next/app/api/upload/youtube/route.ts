// YouTube Upload API Route
// Handles YouTube video downloads using yt-dlp
// Based on React's backend/routes/upload.js YouTube endpoint
// REFACTORED: Now uses service layer for better separation of concerns

import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase'
import { youtubeService } from '@/services/youtubeService'
import { companyService } from '@/services/companyService'

export async function POST(request: NextRequest) {
    let tempFilePath: string | null = null

    try {
        const { youtubeUrl, companyName, userId } = await request.json()

        // Validate required fields
        if (!youtubeUrl || !companyName || !userId) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            )
        }

        // Validate YouTube URL
        if (!youtubeService.validateUrl(youtubeUrl)) {
            return NextResponse.json(
                { error: 'Invalid YouTube URL' },
                { status: 400 }
            )
        }

        // Download video from YouTube
        try {
            tempFilePath = await youtubeService.downloadVideo(youtubeUrl)
        } catch (error: any) {
            return NextResponse.json(
                { error: error.message },
                { status: 500 }
            )
        }

        // Upload to Supabase Storage
        let videoId: string
        let publicUrl: string
        try {
            const uploadResult = await youtubeService.uploadToStorage(tempFilePath)
            videoId = uploadResult.videoId
            publicUrl = uploadResult.publicUrl
        } catch (error: any) {
            // Clean up temp file on upload failure
            if (tempFilePath) {
                await youtubeService.cleanupTempFile(tempFilePath)
            }
            return NextResponse.json(
                { error: error.message },
                { status: 500 }
            )
        }

        // Get or create company
        let company: { id: string }
        try {
            company = await companyService.getOrCreateCompany(companyName)
        } catch (error: any) {
            // Clean up temp file on company creation failure
            if (tempFilePath) {
                await youtubeService.cleanupTempFile(tempFilePath)
            }
            return NextResponse.json(
                { error: error.message },
                { status: 500 }
            )
        }

        // Create video record in database
        console.log('Creating video record in database')
        const supabase = createAdminClient()
        const { data: video, error: dbError } = await supabase
            .from('videos')
            .insert({
                id: videoId,
                title: `YouTube Video ${Date.now()}`,
                file_path: publicUrl,
                company_id: company.id,
                uploaded_by: userId,
                created_at: new Date().toISOString()
            })
            .select()
            .single()

        // Clean up temp file (always, regardless of DB result)
        if (tempFilePath) {
            await youtubeService.cleanupTempFile(tempFilePath)
        }

        if (dbError) {
            console.error('Database insert error:', dbError)
            return NextResponse.json(
                { error: `Failed to create video record: ${dbError.message}` },
                { status: 500 }
            )
        }

        console.log('Video record created successfully:', video)
        return NextResponse.json({ success: true, video })

    } catch (error) {
        console.error('YouTube upload error:', error)

        // Clean up temp file on unexpected error
        if (tempFilePath) {
            try {
                await youtubeService.cleanupTempFile(tempFilePath)
            } catch (cleanupError) {
                console.error('Failed to cleanup temp file:', cleanupError)
            }
        }

        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Upload failed' },
            { status: 500 }
        )
    }
}
