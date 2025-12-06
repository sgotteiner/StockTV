import { listVideos } from '../storage/localStorage.js';

export function getVideos() {
    // Minimal abstraction: can be swapped later
    return listVideos();
}