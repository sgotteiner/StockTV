import config from '../config';
const BASE_URL = config.API_BASE_URL + '/api';

/**
 * Authentication API functions
 */

export async function registerUser(email, password, name) {
  try {
    const response = await fetch(`${BASE_URL}/users/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password, name }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || `Registration failed: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error registering user:', error);
    throw error;
  }
}

export async function loginUser(email, password) {
  try {
    const response = await fetch(`${BASE_URL}/users/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || `Login failed: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error logging in user:', error);
    throw error;
  }
}