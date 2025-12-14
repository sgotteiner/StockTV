import React from 'react';
import { ROLES } from '../constants';
import '../App.css';

/**
 * ProfileView Component
 * Displays user profile information and action buttons
 */
const ProfileView = ({
    user,
    stats,
    onEditProfile,
    onUpload,
    onAdminPanel,
    onCompanyPanel,
    onLogout
}) => {
    const isAdmin = user?.role === ROLES.MASTER_ADMIN || user?.role === ROLES.ADMIN;
    const isCompany = user?.role === ROLES.COMPANY;

    return (
        <>
            {/* Header */}
            <div className="profile-header">
                <h2>{user?.name}</h2>
                <p className="user-email">@{user?.email?.split('@')[0]}</p>
                {user?.role && user.role !== ROLES.USER && (
                    <span className={`role-badge ${user.role}`}>{user.role}</span>
                )}
            </div>

            <div className="profile-content">
                {/* Stats Row */}
                <div className="profile-stats">
                    <div className="stat-item">
                        <span className="stat-number">{stats.liked}</span>
                        <span className="stat-label">Liked</span>
                    </div>
                    <div className="stat-item">
                        <span className="stat-number">{stats.saved}</span>
                        <span className="stat-label">Saved</span>
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

                {/* Action Buttons */}
                <div className="profile-actions">
                    <button className="action-button" onClick={onEditProfile}>
                        Edit Profile
                    </button>

                    {(isAdmin || isCompany) && (
                        <button className="action-button" onClick={onUpload}>
                            Upload Video
                        </button>
                    )}

                    {isAdmin && (
                        <button className="action-button" onClick={onAdminPanel}>
                            Admin Panel
                        </button>
                    )}

                    {isCompany && (
                        <button className="action-button" onClick={onCompanyPanel}>
                            Company Panel
                        </button>
                    )}

                    <button className="action-button">App Settings</button>
                    <button className="action-button logout-button" onClick={onLogout}>
                        Log Out
                    </button>
                </div>
            </div>
        </>
    );
};

export default ProfileView;
