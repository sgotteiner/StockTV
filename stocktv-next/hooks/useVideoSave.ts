// Video Save Hook - Based on React's hooks/useVideoSave.js
// Manages video save/unsave and share functionality
// USES SERVICE LAYER

'use client'

import { useState, useEffect } from 'react'
import { interactionService } from '@/services/interactionService'
import type { Video, User } from '@/types'

/**
 * Custom hook for video save/unsave and share functionality
 * Based on React's useVideoSave.js (68 lines)
 */
export function useVideoSave(video: Video, currentUser: User | null) {
    const [isSaved, setIsSaved] = useState(false)
    const [message, setMessage] = useState('')

    // Fetch initial saved status
    useEffect(() => {
        const checkSavedStatus = async () => {
            if (!currentUser || !video) {
                setIsSaved(false)
                return
            }

            try {
                const { savedVideos } = await interactionService.getUserSavedVideos(currentUser.id)
                const saved = savedVideos.some(v => v.videoId === video.id)
                setIsSaved(saved)
            } catch (error) {
                console.error('Error checking saved status:', error)
                setIsSaved(false)
            }
        }

        checkSavedStatus()
    }, [video?.id, currentUser?.id])

    const toggleSave = async () => {
        if (!currentUser) {
            setMessage('Please log in to save videos')
            setTimeout(() => setMessage(''), 2000)
            return
        }

        try {
            if (isSaved) {
                await interactionService.unsaveVideo(video.id, currentUser.id)
                setIsSaved(false)
                setMessage('Video unsaved')
            } else {
                await interactionService.saveVideo(video.id, currentUser.id)
                setIsSaved(true)
                setMessage('Video saved!')
            }

            setTimeout(() => setMessage(''), 1500)
        } catch (error) {
            console.error('Error toggling save:', error)
            setMessage('Failed to save video')
            setTimeout(() => setMessage(''), 2000)
        }
    }

    const shareVideo = () => {
        // TODO: Implement real share functionality
        setMessage('Share feature coming soon!')
        setTimeout(() => setMessage(''), 2000)
    }

    return { isSaved, toggleSave, shareVideo, message }
}
