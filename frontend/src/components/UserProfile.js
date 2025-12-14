import React, { useState, useEffect } from 'react';
import { useUser } from '../context/UserProvider';
import { useProfileStats } from '../hooks/useProfileStats';
import ProfileView from './ProfileView';
import ProfileEdit from './ProfileEdit';
import UploadScreen from './UploadScreen';
import AdminPanel from './AdminPanel';
import CompanyPanel from './CompanyPanel';
import '../App.css';

/**
 * UserProfile Component
 * Main container for user profile functionality
 */
const UserProfile = ({ user, onLogout }) => {
  const { updateProfile } = useUser();
  const { stats } = useProfileStats(user?.id, user);

  const [isEditing, setIsEditing] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const [showCompany, setShowCompany] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const [editForm, setEditForm] = useState({ name: '', email: '' });
  const [isLoading, setIsLoading] = useState(false);

  // Initialize form with user data
  useEffect(() => {
    if (user) {
      setEditForm({ name: user.name || '', email: user.email || '' });
    }
  }, [user]);

  const handleSaveProfile = async () => {
    setIsLoading(true);
    try {
      const result = await updateProfile(editForm);
      if (result.success) {
        setIsEditing(false);
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      alert('Failed to update profile: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Show different screens based on state
  if (showAdmin) {
    return <AdminPanel onBack={() => setShowAdmin(false)} />;
  }

  if (showCompany) {
    return <CompanyPanel onBack={() => setShowCompany(false)} />;
  }

  if (showUpload) {
    return <UploadScreen onBack={() => setShowUpload(false)} />;
  }

  return (
    <div className="profile-screen">
      {isEditing ? (
        <ProfileEdit
          editForm={editForm}
          setEditForm={setEditForm}
          onSave={handleSaveProfile}
          onCancel={() => setIsEditing(false)}
          isLoading={isLoading}
        />
      ) : (
        <ProfileView
          user={user}
          stats={stats}
          onEditProfile={() => setIsEditing(true)}
          onUpload={() => setShowUpload(true)}
          onAdminPanel={() => setShowAdmin(true)}
          onCompanyPanel={() => setShowCompany(true)}
          onLogout={onLogout}
        />
      )}
    </div>
  );
};

export default UserProfile;