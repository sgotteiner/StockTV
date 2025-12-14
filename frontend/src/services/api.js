import config from '../config';
import { PAGINATION } from '../constants';

export async function getVideos(userId = null, page = PAGINATION.DEFAULT_PAGE, limit = PAGINATION.DEFAULT_PAGE_SIZE) {
    let backendUrl = config.API_BASE_URL + '/videos';

    // Build query params
    const params = new URLSearchParams();
    if (userId) {
        params.append('userId', userId);
    }
    params.append('page', page);
    params.append('limit', limit);

    backendUrl += `?${params.toString()}`;

    const response = await fetch(backendUrl);
    if (!response.ok) {
        throw new Error('Failed to fetch videos');
    }
    return response.json();  // Returns { videos: [...], pagination: {...} }
}