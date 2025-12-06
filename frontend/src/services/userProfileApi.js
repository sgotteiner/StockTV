const BASE_URL = 'http://localhost:5000/api';

/**
 * User Profile API functions
 */

export async function getUserProfile(userId) {
  try {
    const response = await fetch(`${BASE_URL}/users/${userId}`);
    if (!response.ok) {
      throw new Error(`Failed to get user profile: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw error;
  }
}

export async function updateUserProfile(userId, profileData) {
  try {
    const response = await fetch(`${BASE_URL}/users/${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(profileData),
    });

    if (!response.ok) {
      throw new Error(`Failed to update profile: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
}