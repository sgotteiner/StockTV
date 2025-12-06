// Define initial state
export const initialUserState = {
  currentUser: null,
  isAuthenticated: false,
  loading: false,
  error: null
};

// Define reducer actions
export const userActionTypes = {
  SET_USER: 'SET_USER',
  LOGIN_START: 'LOGIN_START',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGIN_ERROR: 'LOGIN_ERROR',
  LOGOUT: 'LOGOUT',
  UPDATE_PROFILE: 'UPDATE_PROFILE'
};