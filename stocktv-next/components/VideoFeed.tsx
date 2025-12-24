// Video Feed Component - Based on React's screens/FeedScreen.js
// UI-only component that uses useVideos hook for data
// CLEAN SEPARATION: UI here, data in hook, API in service

'use client'

import VideoCard from './VideoCard'
import { useVideos } from '@/hooks/useVideos'
import { useUser } from '@/context/UserProvider'
import '../app/feedStyles.css'
import '../app/loadingStates.css'

/**
 * VideoFeed Component
 * Displays personalized video feed
 * Based on React's FeedScreen pattern (52 lines)
 */
export default function VideoFeed() {
  const { currentUser } = useUser()
  // Pass userId for personalized feed (followed companies first)
  const { videos, loading, error } = useVideos(currentUser?.id)

  if (loading) {
    return (
      <div className="loading-container">
        Loading videos...
      </div>
    )
  }

  if (error) {
    return (
      <div className="error-container">
        {error}
      </div>
    )
  }

  if (videos.length === 0) {
    return (
      <div className="empty-container">
        No videos available
      </div>
    )
  }

  return (
    <div className="video-feed">
      {videos.map((video, index) => (
        <VideoCard
          key={video.id}
          video={video}
          isFirst={index === 0}
        />
      ))}
    </div>
  )
}
