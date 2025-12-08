import config from '../config';

export async function getVideos() {
    const backendUrl = config.API_BASE_URL + '/videos';
    const response = await fetch(backendUrl);
    if (!response.ok) {
        throw new Error('Failed to fetch videos');
    }
    return response.json();  // Returns [{id, title, company, date, file_path}]
}