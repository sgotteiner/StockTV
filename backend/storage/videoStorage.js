import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';
import { getVideoTitle, getCompanyFromFilename, getFileModifiedDate } from '../utils/videoFileUtils.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dataDir = path.join(__dirname, '../data');
const videosFilePath = path.join(dataDir, 'videos.json');
const videosDir = path.resolve(__dirname, '../../videos');

// Ensure data directory exists
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
}

// Initial check for videos file
if (!fs.existsSync(videosFilePath)) {
    fs.writeFileSync(videosFilePath, JSON.stringify([]));
}

function readVideosData() {
    try {
        const data = fs.readFileSync(videosFilePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading videos.json:', error);
        return [];
    }
}

function writeVideosData(videos) {
    try {
        fs.writeFileSync(videosFilePath, JSON.stringify(videos, null, 2));
    } catch (error) {
        console.error('Error writing videos.json:', error);
    }
}

/**
 * Syncs the filesystem videos with the JSON database.
 * Preserves metadata in JSON if file still exists.
 * Adds new files to JSON.
 */
export function getAllVideos() {
    // 1. Get current files from disk
    if (!fs.existsSync(videosDir)) {
        console.warn('Videos directory does not exist. Creating it...');
        fs.mkdirSync(videosDir, { recursive: true });
    }

    const files = fs.readdirSync(videosDir);
    const videoFiles = files.filter(file =>
        ['.mp4', '.mov', '.avi', '.webm'].some(ext => file.toLowerCase().endsWith(ext))
    );

    // 2. Get current DB data
    let dbVideos = readVideosData();
    let hasChanges = false;

    // 3. Map disk files to DB entries
    const currentVideos = videoFiles.map(filename => {
        // Generate stable ID based on filename
        const id = crypto.createHash('md5').update(filename).digest('hex').substring(0, 8);
        const relativePath = filename; // Store only filename in DB

        // Check if exists in DB
        const existingEntry = dbVideos.find(v => v.id === id);

        if (existingEntry) {
            // Return existing entry + current absolute path context (if needed)
            // We iterate over this to ensure we return what's actually on disk
            return {
                ...existingEntry,
                filename: relativePath // Ensure filename is fresh
            };
        } else {
            // New video found! Create entry
            hasChanges = true;
            return {
                id,
                filename: relativePath,
                title: getVideoTitle(filename),
                company: getCompanyFromFilename(filename),
                date: getFileModifiedDate(path.join(videosDir, filename)),
                description: '', // Editable field
                tags: [] // Editable field
            };
        }
    });

    // 4. Save if we discovered new videos
    // Note: This logic implicitly "removes" videos from DB if they are not on disk 
    // because we map from `videoFiles`. If you want to keep history of deleted videos, logic differs.
    // For now, we sync DB to Disk.
    if (hasChanges || currentVideos.length !== dbVideos.length) {
        writeVideosData(currentVideos);
    }

    // 5. Return prepared data with full URLs
    // Using a configurable backend URL - defaulting to localhost:5000
    const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:5000';

    return currentVideos.map(v => ({
        ...v,
        file_path: `${BACKEND_URL}/videos/${encodeURIComponent(v.filename)}`
    }));
}

export function getVideoById(id) {
    const videos = getAllVideos();
    return videos.find(v => v.id === id);
}

export function addVideo(videoData) {
    const videos = readVideosData();

    // Generate a unique ID based on filename
    const id = crypto.createHash('md5').update(videoData.filename).digest('hex').substring(0, 8);

    // Ensure the video doesn't already exist
    const existingVideo = videos.find(v => v.id === id);
    if (existingVideo) {
        // If it exists, update it instead
        return updateVideoMetadata(id, videoData);
    }

    const newVideo = {
        id,
        ...videoData
    };

    videos.push(newVideo);
    writeVideosData(videos);
    return newVideo;
}

export function updateVideoMetadata(id, metadata) {
    const videos = readVideosData();
    const index = videos.findIndex(v => v.id === id);

    if (index !== -1) {
        videos[index] = { ...videos[index], ...metadata };
        writeVideosData(videos);
        return videos[index];
    }
    return null;
}
