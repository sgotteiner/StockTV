import { userActionTypes, initialUserState } from './userConstants';

// Reducer function
export function userReducer(state, action) {
  switch (action.type) {
    case userActionTypes.SET_USER:
      return {
        ...state,
        currentUser: action.payload,
        isAuthenticated: !!action.payload
      };
    case userActionTypes.LOGIN_START:
      return {
        ...state,
        loading: true,
        error: null
      };
    case userActionTypes.LOGIN_SUCCESS:
      return {
        ...state,
        currentUser: action.payload,
        isAuthenticated: true,
        loading: false
      };
    case userActionTypes.LOGIN_ERROR:
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    case userActionTypes.LOGOUT:
      return {
        ...initialUserState
      };
    case userActionTypes.UPDATE_PROFILE:
      return {
        ...state,
        currentUser: {
          ...state.currentUser,
          ...action.payload
        }
      };
    default:
      return state;
  }
}