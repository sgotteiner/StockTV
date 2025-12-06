export async function getVideos() {
    const response = await fetch('http://localhost:5000/videos');
    if (!response.ok) {
        throw new Error('Failed to fetch videos');
    }
    return response.json();  // Returns [{id, title, company, date, file_path}]
}