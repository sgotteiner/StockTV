import { getAllVideos } from '../storage/videoStorage.js';

export function getVideos() {
    // Service layer abstraction for video retrieval
    // Can add business logic here if needed (filtering, sorting, etc.)
    return getAllVideos();
}