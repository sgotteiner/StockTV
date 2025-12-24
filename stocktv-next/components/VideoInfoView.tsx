'use client'

import type { Video } from '@/types'

interface VideoInfoViewProps {
    video: Video & {
        companies?: { name: string; website?: string }
        date?: string
        description?: string
    }
    likeCount: number
    onBack: () => void
}

/**
 * VideoInfoView Component
 * Displays detailed information about a video
 * Based on React's VideoInfoView.js (40 lines)
 */
export default function VideoInfoView({ video, likeCount, onBack }: VideoInfoViewProps) {
    const companyName = video.companies?.name || 'Unknown Company'

    return (
        <div className="video-info-container">
            <div className="video-info-content">
                <h2 className="video-title">{video.title}</h2>
                <p className="video-company">
                    Company: {companyName}
                </p>
                {video.date && (
                    <p className="video-date">Date: {video.date}</p>
                )}
                {video.description && (
                    <p className="video-description">{video.description}</p>
                )}
                <div className="like-stats">
                    <p>Likes: {likeCount}</p>
                </div>
                <button
                    className="back-to-video-btn"
                    onClick={onBack}
                >
                    ← Back to Video
                </button>
            </div>
        </div>
    )
}
