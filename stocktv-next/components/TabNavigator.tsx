// Tab Navigator Component - Based on React's components/TabNavigator.js
// Manages navigation between Feed and Profile
// CLEAN: Uses CSS classes, no inline styles!

'use client'

import { useState } from 'react'
import VideoFeed from './VideoFeed'
import ProfileScreen from './ProfileScreen'
import '../app/tabNavigatorStyles.css'

/**
 * TabNavigator Component
 * Manages navigation between different app sections (Feed and Profile)
 * Based on React's TabNavigator pattern (56 lines - uses CSS!)
 */
export default function TabNavigator() {
    const [activeTab, setActiveTab] = useState<'feed' | 'profile'>('feed')

    return (
        <div className="tab-navigator">
            <div className="tab-content">
                {activeTab === 'feed' ? <VideoFeed /> : <ProfileScreen />}
            </div>

            <div className="tab-bar">
                <button
                    className={`tab-button ${activeTab === 'feed' ? 'active' : ''}`}
                    onClick={() => setActiveTab('feed')}
                >
                    <span className="tab-icon">🎬</span>
                    <span className="tab-label">Feed</span>
                </button>

                <button
                    className={`tab-button ${activeTab === 'profile' ? 'active' : ''}`}
                    onClick={() => setActiveTab('profile')}
                >
                    <span className="tab-icon">👤</span>
                    <span className="tab-label">Profile</span>
                </button>
            </div>
        </div>
    )
}
