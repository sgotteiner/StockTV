import React, { useState } from 'react';
import { useUser } from '../context/UserProvider';
import AuthForm from '../components/AuthForm';
import UserProfile from '../components/UserProfile';
import '../App.css';

/**
 * ProfileScreen Component
 * Manages authentication state and displays appropriate view
 */
function ProfileScreen() {
  const { currentUser, isAuthenticated, login, register, logout, loading } = useUser();
  const [isLoginView, setIsLoginView] = useState(true);
  const [error, setError] = useState('');

  const handleAuthSubmit = async (formData) => {
    setError('');

    if (isLoginView) {
      // Login
      const result = await login(formData.email, formData.password);
      if (!result.success) {
        setError(result.error || 'Login failed');
      }
    } else {
      // Register
      const result = await register(formData.email, formData.password, formData.name);
      if (!result.success) {
        setError(result.error || 'Registration failed');
      }
    }
  };

  // Show authentication form if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="profile-screen">
        <AuthForm
          onSubmit={handleAuthSubmit}
          isLoginView={isLoginView}
          setIsLoginView={setIsLoginView}
          loading={loading}
          error={error}
        />
      </div>
    );
  }

  // Show user profile if authenticated
  return <UserProfile user={currentUser} onLogout={logout} />;
}

export default ProfileScreen;