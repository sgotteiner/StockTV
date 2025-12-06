import React, { useContext, useReducer } from 'react';
import { loginUser, registerUser } from '../services/authApi';
import { getUserProfile, updateUserProfile } from '../services/userProfileApi';
import UserContext from './UserContext';
import { initialUserState, userActionTypes } from './userConstants';
import { userReducer } from './userReducer';

// UserProvider component
export function UserProvider({ children }) {
  const [state, dispatch] = useReducer(userReducer, initialUserState);

  // Function to login user
  const login = async (email, password) => {
    dispatch({ type: userActionTypes.LOGIN_START });

    try {
      const response = await loginUser(email, password);
      const userData = response.user;

      dispatch({ type: userActionTypes.LOGIN_SUCCESS, payload: userData });
      // Store user ID in local storage to persist across browser sessions
      localStorage.setItem('currentUserId', userData.id);
      return { success: true, user: userData };
    } catch (error) {
      dispatch({ type: userActionTypes.LOGIN_ERROR, payload: error.message });
      return { success: false, error: error.message };
    }
  };

  // Function to register user
  const register = async (email, password, name) => {
    dispatch({ type: userActionTypes.LOGIN_START });

    try {
      const response = await registerUser(email, password, name);
      const userData = response.user;

      dispatch({ type: userActionTypes.LOGIN_SUCCESS, payload: userData });
      // Store user ID in local storage to persist across browser sessions
      localStorage.setItem('currentUserId', userData.id);
      return { success: true, user: userData };
    } catch (error) {
      dispatch({ type: userActionTypes.LOGIN_ERROR, payload: error.message });
      return { success: false, error: error.message };
    }
  };

  // Function to logout user
  const logout = () => {
    dispatch({ type: userActionTypes.LOGOUT });
    localStorage.removeItem('currentUserId');
  };

  // Function to update profile
  const updateProfile = async (profileData) => {
    if (!state.currentUser) return;

    try {
      const response = await updateUserProfile(state.currentUser.id, profileData);
      const updatedUser = response.user;

      dispatch({ type: userActionTypes.UPDATE_PROFILE, payload: updatedUser });
      return { success: true, user: updatedUser };
    } catch (error) {
      dispatch({ type: userActionTypes.LOGIN_ERROR, payload: error.message });
      return { success: false, error: error.message };
    }
  };

  // Load user profile from backend on app start
  React.useEffect(() => {
    const initializeUserSession = async () => {
      const currentUserId = localStorage.getItem('currentUserId');
      if (currentUserId) {
        try {
          const response = await getUserProfile(currentUserId);
          dispatch({ type: userActionTypes.SET_USER, payload: response.user });
        } catch (error) {
          console.error('Failed to restore user session:', error);
          // Clear the stored user ID if profile fetch fails
          localStorage.removeItem('currentUserId');
        }
      }
    };

    initializeUserSession();
  }, []);

  const value = {
    ...state,
    login,
    register,
    logout,
    updateProfile
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
}

// Custom hook to use the UserContext
export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}