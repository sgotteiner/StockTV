import React from 'react';
import '../App.css';

/**
 * ProfileStats Component
 * Displays user statistics (likes, following, videos)
 */
const ProfileStats = ({ stats }) => {
    return (
        <div className="profile-stats">
            <div className="stat-item">
                <span className="stat-number">{stats.liked}</span>
                <span className="stat-label">Liked</span>
            </div>
            <div className="stat-item">
                <span className="stat-number">{stats.following}</span>
                <span className="stat-label">Following</span>
            </div>
            <div className="stat-item">
                <span className="stat-number">{stats.videos}</span>
                <span className="stat-label">Videos</span>
            </div>
        </div>
    );
};

export default ProfileStats;
