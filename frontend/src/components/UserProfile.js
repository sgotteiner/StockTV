import React, { useState, useEffect } from 'react';
import * as likesApi from '../services/likesApi';
import * as userProfileApi from '../services/userProfileApi';
import { useUser } from '../context/UserProvider';
import UploadScreen from './UploadScreen';
import AdminPanel from './AdminPanel';
import '../App.css';

/**
 * UserProfile Component
 * Displays profile information for authenticated users
 */

/**
 * UserProfile Component
 * Displays profile information for authenticated users
 */
const UserProfile = ({ user, onLogout }) => {
  const { updateProfile } = useUser(); // Get update function from context
  const [stats, setStats] = useState({ liked: 0, following: 0, videos: 0 });
  const [isEditing, setIsEditing] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false); // New state for Admin Panel
  const [showUpload, setShowUpload] = useState(false); // New state for Upload Screen
  const [editForm, setEditForm] = useState({ name: '', email: '' });
  const [isLoading, setIsLoading] = useState(false);

  // ... (useEffects remain same)

  // Initialize form with User data
  useEffect(() => {
    if (user) {
      setEditForm({ name: user.name || '', email: user.email || '' });
    }
  }, [user]);

  // Fetch real stats
  useEffect(() => {
    const fetchStats = async () => {
      if (user?.id) {
        try {
          const likedData = await likesApi.getUserLikedVideos(user.id);
          setStats(prev => ({
            ...prev,
            liked: likedData.likedVideos ? likedData.likedVideos.length : 0
          }));
        } catch (error) {
          console.error("Failed to fetch user stats", error);
        }
      }
    };
    fetchStats();
  }, [user]);

  const handleUpdateProfile = async (e) => {
    // ... (same implementation)
    e.preventDefault();
    setIsLoading(true);
    try {
      const result = await updateProfile(editForm);
      if (result.success) {
        setIsEditing(false);
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      alert("Failed to update profile: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const isAdmin = user?.role === 'master_admin' || user?.role === 'admin';
  const isCompany = user?.role === 'company';

  if (showAdmin) {
    return <AdminPanel onBack={() => setShowAdmin(false)} />;
  }

  if (showUpload) {
    return <UploadScreen onBack={() => setShowUpload(false)} />;
  }

  return (
    <div className="profile-screen">
      {!isEditing ? (
        <>
          {/* Header */}
          <div className="profile-header">
            <h2>{user?.name}</h2>
            <p className="user-email">@{user?.email?.split('@')[0]}</p>
            {user?.role && user.role !== 'user' && (
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
              <button
                className="action-button"
                onClick={() => setIsEditing(true)}
              >
                Edit Profile
              </button>

              {(isAdmin || isCompany) && (
                <button
                  className="action-button"
                  onClick={() => setShowUpload(true)}
                >
                  Upload Video
                </button>
              )}

              {isAdmin && (
                <button
                  className="action-button"
                  onClick={() => setShowAdmin(true)}
                >
                  Admin Panel
                </button>
              )}

              <button className="action-button">App Settings</button>
              <button className="action-button logout-button" onClick={onLogout}>
                Log Out
              </button>
            </div>
          </div>
        </>
      ) : (
        /* Edit Mode */
        <div className="auth-container">
          {/* ... (same form) */}
          <div className="auth-form">
            <h2>Edit Profile</h2>
            <form onSubmit={handleUpdateProfile}>
              <div className="form-group">
                <label>Name</label>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  disabled={isLoading}
                />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  value={editForm.email}
                  onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                  disabled={isLoading}
                />
              </div>

              <div className="profile-actions" style={{ marginTop: '4vh' }}>
                <button type="submit" className="auth-button" disabled={isLoading}>
                  {isLoading ? 'Saving...' : 'Save Changes'}
                </button>
                <button
                  type="button"
                  className="action-button"
                  style={{ marginTop: '0', border: 'none', background: 'transparent' }}
                  onClick={() => setIsEditing(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;