// API service for user-video interactions (likes, views, etc.)
import config from '../config';
const BASE_URL = config.API_BASE_URL + '/api';

export async function getVideoLikes(videoId) {
  try {
    const response = await fetch(`${BASE_URL}/interactions/videos/${videoId}/likes`);
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
    const response = await fetch(`${BASE_URL}/interactions/videos/${videoId}/like`, {
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
    const response = await fetch(`${BASE_URL}/interactions/videos/${videoId}/like`, {
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
    const response = await fetch(`${BASE_URL}/interactions/users/${userId}/likes`);
    if (!response.ok) {
      throw new Error(`Failed to get user likes: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching user likes:', error);
    throw error;
  }
}

export async function recordVideoView(videoId, userId) {
  try {
    const response = await fetch(`${BASE_URL}/interactions/videos/${videoId}/views`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId }),
    });

    if (!response.ok) {
      throw new Error(`Failed to record view: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error recording video view:', error);
    throw error;
  }
}

export async function saveVideo(videoId, userId) {
  try {
    const response = await fetch(`${BASE_URL}/interactions/videos/${videoId}/save`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId }),
    });

    if (!response.ok) {
      throw new Error(`Failed to save video: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error saving video:', error);
    throw error;
  }
}

export async function unsaveVideo(videoId, userId) {
  try {
    const response = await fetch(`${BASE_URL}/interactions/videos/${videoId}/save`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId }),
    });

    if (!response.ok) {
      throw new Error(`Failed to unsave video: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error unsaving video:', error);
    throw error;
  }
}

export async function getUserSavedVideos(userId) {
  try {
    const response = await fetch(`${BASE_URL}/interactions/users/${userId}/saved`);
    if (!response.ok) {
      throw new Error(`Failed to get saved videos: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching saved videos:', error);
    throw error;
  }
}