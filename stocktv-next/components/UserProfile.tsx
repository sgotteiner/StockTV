// User Profile Component - Based on React's components/UserProfile.js
// Container for authenticated user profile display
// CLEAN SEPARATION: Orchestrates profile display, uses hooks for data

'use client'

import { useState } from 'react'
import { useUserStats } from '@/hooks/useUserStats'
import UploadScreen from './UploadScreen'
import AdminPanel from './AdminPanel'
import type { User } from '@/types'

interface UserProfileProps {
    user: User
    onLogout: () => void
}

/**
 * UserProfile Component
 * Main container for user profile functionality
 * Based on React's UserProfile pattern (87 lines)
 */
export default function UserProfile({ user, onLogout }: UserProfileProps) {
    const { stats, loading } = useUserStats(user.id)
    const [showUpload, setShowUpload] = useState(false)
    const [showAdmin, setShowAdmin] = useState(false)

    const canUpload = user.role === 'company' || user.role === 'admin' || user.role === 'master_admin'
    const isAdmin = user.role === 'admin' || user.role === 'master_admin'

    // Show admin panel if active (React pattern)
    if (showAdmin) {
        return <AdminPanel onBack={() => setShowAdmin(false)} />
    }

    // Show upload screen if active (React pattern)
    if (showUpload) {
        return <UploadScreen onBack={() => setShowUpload(false)} />
    }

    return (
        <div className="profile-container">
            <div className="profile-header">
                <div className="profile-avatar">
                    {user.name?.[0]?.toUpperCase() || user.email[0].toUpperCase()}
                </div>
                <h2>{user.name || 'User'}</h2>
                <p>{user.email}</p>
                {user.role && user.role !== 'user' && (
                    <span className={`role-badge ${user.role}`}>{user.role}</span>
                )}
            </div>

            {loading ? (
                <div className="loading-stats">Loading stats...</div>
            ) : (
                <div className="profile-stats">
                    <div className="stat">
                        <span className="stat-value">{stats.videosWatched}</span>
                        <span className="stat-label">Videos Watched</span>
                    </div>
                    <div className="stat">
                        <span className="stat-value">{stats.liked}</span>
                        <span className="stat-label">Liked</span>
                    </div>
                    <div className="stat">
                        <span className="stat-value">{stats.following}</span>
                        <span className="stat-label">Following</span>
                    </div>
                </div>
            )}

            <div className="profile-actions">
                {canUpload && (
                    <button onClick={() => setShowUpload(true)} className="action-button">
                        Upload Video
                    </button>
                )}
                {isAdmin && (
                    <button onClick={() => setShowAdmin(true)} className="action-button">
                        Admin Panel
                    </button>
                )}
                <button onClick={onLogout} className="logout-button">
                    Logout
                </button>
            </div>
        </div>
    )
}
