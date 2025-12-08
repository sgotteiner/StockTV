import React from 'react';
import '../App.css';

/**
 * UserProfile Component
 * Displays profile information for authenticated users
 */
const UserProfile = ({ user, onLogout }) => {
  // Get initials for avatar
  const initials = user?.name
    ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2)
    : 'U';

  return (
    <div className="profile-screen">
      {/* Header with Avatar and User Info */}
      <div className="profile-header">
        <h2>{user?.name}</h2>
        <p className="user-email">@{user?.email?.split('@')[0]}</p>
      </div>

      <div className="profile-content">
        {/* Mock Stats Row for "Premium" feel */}
        <div className="profile-stats">
          <div className="stat-item">
            <span className="stat-number">12</span>
            <span className="stat-label">Liked</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">5</span>
            <span className="stat-label">Following</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">0</span>
            <span className="stat-label">Videos</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="profile-actions">
          <button className="action-button">Edit Profile</button>
          <button className="action-button">App Settings</button>
          <button className="action-button logout-button" onClick={onLogout}>
            Log Out
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;