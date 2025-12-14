import config from '../config';

const API_BASE_URL = config.API_BASE_URL + '/api';

/**
 * Upload a YouTube video
 */
export const uploadYouTubeVideo = async (youtubeUrl, companyId = null, userId) => {
    const response = await fetch(`${API_BASE_URL}/upload/youtube`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ youtubeUrl, companyId, userId }),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to upload video');
    }
    return await response.json();
};

/**
 * Upload a video file
 */
export const uploadVideoFile = async (file, companyId = null, userId) => {
    const formData = new FormData();
    formData.append('video', file);
    formData.append('companyId', companyId || '');
    formData.append('userId', userId);

    const response = await fetch(`${API_BASE_URL}/upload/file`, {
        method: 'POST',
        body: formData, // Don't set Content-Type, browser will set it with boundary
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to upload video file');
    }
    return await response.json();
};

/**
 * Upload a video from URL
 */
export const uploadVideoUrl = async (videoUrl, companyId = null, userId) => {
    const response = await fetch(`${API_BASE_URL}/upload/url`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ videoUrl, companyId, userId }),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to upload video from URL');
    }
    return await response.json();
};