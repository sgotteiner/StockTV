// Video Upload Hook - Based on React's hooks/useVideoUpload.js
// Manages upload state and validation for multiple upload sources
// USES SERVICE LAYER

'use client'

import { useState, useEffect } from 'react'
import { uploadService } from '@/services/uploadService'
import type { User } from '@/types'

type UploadSource = 'youtube' | 'file' | 'url'

/**
 * Custom hook for video upload logic
 * Based on React's useVideoUpload.js (149 lines)
 */
export function useVideoUpload(currentUser: User | null) {
    const [uploadSource, setUploadSource] = useState<UploadSource>('file') // Changed default from youtube to file
    const [youtubeUrl, setYoutubeUrl] = useState('')
    const [videoFile, setVideoFile] = useState<File | null>(null)
    const [videoUrl, setVideoUrl] = useState('')
    const [selectedCompany, setSelectedCompany] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [message, setMessage] = useState('')
    const [error, setError] = useState('')

    // Set company based on user role (React pattern)
    useEffect(() => {
        if (currentUser?.role === 'company') {
            setSelectedCompany(currentUser.name || '')
        } else {
            setSelectedCompany('')
        }
    }, [currentUser])

    const validateYouTubeUrl = (url: string): string | null => {
        if (!url) return 'Please enter a YouTube URL'
        const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com\/(watch\?v=|shorts\/)|youtu\.be\/)[a-zA-Z0-9_-]{11}(&.*)?$/
        if (!youtubeRegex.test(url)) {
            return 'Please enter a valid YouTube URL'
        }
        return null
    }

    const validateVideoFile = (file: File | null): string | null => {
        if (!file) return 'Please select a video file'

        const validTypes = ['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime']
        if (!validTypes.includes(file.type)) {
            return 'Please select a valid video file (MP4, WebM, OGG, MOV)'
        }

        // 100MB limit
        const maxSize = 100 * 1024 * 1024
        if (file.size > maxSize) {
            return 'File size must be less than 100MB'
        }

        return null
    }

    const validateVideoUrl = (url: string): string | null => {
        if (!url) return 'Please enter a video URL'

        try {
            new URL(url)
            // Check if URL ends with video extension
            const videoExtensions = ['.mp4', '.webm', '.ogg', '.mov']
            const hasVideoExtension = videoExtensions.some(ext => url.toLowerCase().includes(ext))

            if (!hasVideoExtension) {
                return 'URL must point to a video file (mp4, webm, ogg, mov)'
            }

            return null
        } catch {
            return 'Please enter a valid URL'
        }
    }

    const handleSubmit = async (): Promise<boolean> => {
        setError('')
        setMessage('')
        setIsLoading(true)

        try {
            if (!currentUser) {
                setError('Please log in to upload videos')
                setIsLoading(false)
                return false
            }

            if (!selectedCompany) {
                setError('Please enter a company name')
                setIsLoading(false)
                return false
            }

            switch (uploadSource) {
                case 'youtube':
                    const youtubeError = validateYouTubeUrl(youtubeUrl)
                    if (youtubeError) {
                        setError(youtubeError)
                        setIsLoading(false)
                        return false
                    }
                    await uploadService.uploadFromYouTube(youtubeUrl, selectedCompany, currentUser.id)
                    setYoutubeUrl('')
                    break

                case 'file':
                    const fileError = validateVideoFile(videoFile)
                    if (fileError) {
                        setError(fileError)
                        setIsLoading(false)
                        return false
                    }
                    await uploadService.uploadVideoFile(videoFile!, selectedCompany, currentUser.id)
                    setVideoFile(null)
                    break

                case 'url':
                    const urlError = validateVideoUrl(videoUrl)
                    if (urlError) {
                        setError(urlError)
                        setIsLoading(false)
                        return false
                    }
                    await uploadService.uploadFromUrl(videoUrl, selectedCompany, currentUser.id)
                    setVideoUrl('')
                    break

                default:
                    throw new Error('Invalid upload source')
            }

            setMessage('Video uploaded successfully!')
            return true
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Upload failed')
            return false
        } finally {
            setIsLoading(false)
        }
    }

    return {
        uploadSource,
        setUploadSource,
        youtubeUrl,
        setYoutubeUrl,
        videoFile,
        setVideoFile,
        videoUrl,
        setVideoUrl,
        selectedCompany,
        setSelectedCompany,
        isLoading,
        message,
        error,
        handleSubmit
    }
}
