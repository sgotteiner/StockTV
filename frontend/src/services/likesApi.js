// API service for likes functionality
const BASE_URL = 'http://localhost:5000/api';

export async function getVideoLikes(videoId) {
  try {
    const response = await fetch(`${BASE_URL}/likes/videos/${videoId}/likes`);
    if (!response.ok) {
      throw new Error(`Failed to get likes: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching video likes:', error);
    throw error;
  }
}

export async function likeVideo(videoId, userId) {
  try {
    const response = await fetch(`${BASE_URL}/likes/videos/${videoId}/like`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId }),
    });

    if (!response.ok) {
      throw new Error(`Failed to like video: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error liking video:', error);
    throw error;
  }
}

export async function unlikeVideo(videoId, userId) {
  try {
    const response = await fetch(`${BASE_URL}/likes/videos/${videoId}/like`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId }),
    });

    if (!response.ok) {
      throw new Error(`Failed to unlike video: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error unliking video:', error);
    throw error;
  }
}

export async function getUserLikedVideos(userId) {
  try {
    const response = await fetch(`${BASE_URL}/likes/users/${userId}/likes`);
    if (!response.ok) {
      throw new Error(`Failed to get user likes: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching user likes:', error);
    throw error;
  }
}