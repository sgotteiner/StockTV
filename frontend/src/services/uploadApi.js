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