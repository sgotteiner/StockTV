import React from 'react';
import '../App.css';

/**
 * UserProfile Component
 * Displays profile information for authenticated users
 */
const UserProfile = ({ user, onLogout }) => {
  return (
    <div className="profile-screen">
      <div className="profile-header">
        <h2>My Profile</h2>
      </div>
      <div className="profile-content">
        <div className="user-info-card">
          <div className="user-details">
            <h3>{user?.name}</h3>
            <p className="user-email">{user?.email}</p>
          </div>
          <button className="logout-button" onClick={onLogout}>
            Logout
          </button>
        </div>

        <div className="profile-actions">
          <div className="action-buttons">
            <button className="action-button">Edit Profile</button>
            <button className="action-button">Change Password</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;