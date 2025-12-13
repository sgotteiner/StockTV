import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataPath = path.join(__dirname, '../data/user_video_interactions.json');

// Read interactions
function readInteractions() {
    const data = fs.readFileSync(dataPath, 'utf8');
    return JSON.parse(data);
}

// Write interactions
function writeInteractions(data) {
    fs.writeFileSync(dataPath, JSON.stringify(data, null, 2), 'utf8');
}

// Generate unique ID
function generateId() {
    return `int_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// Get or create interaction record
function getOrCreateInteraction(userId, videoId) {
    const data = readInteractions();
    const interactions = data.interactions || [];

    let interaction = interactions.find(i =>
        i.user_id === userId && i.video_id === videoId
    );

    if (!interaction) {
        interaction = {
            id: generateId(),
            user_id: userId,
            video_id: videoId,
            liked: false,
            viewed_at: new Date().toISOString(),
            watch_percentage: 0,  // Track video watch progress (0-100)
            saved: false,  // Save for later functionality
            shared_with: []  // Array of user IDs that this was shared with
        };
        interactions.push(interaction);
        writeInteractions({ interactions });
        return interaction;
    }

    // Return a copy to ensure we're working with fresh data
    return { ...interaction };
}

// Record video view
export function recordView(userId, videoId, watchData) {
    const data = readInteractions();
    const interactions = data.interactions || [];

    let interaction = interactions.find(i =>
        i.user_id === userId && i.video_id === videoId
    );

    if (!interaction) {
        interaction = {
            id: generateId(),
            user_id: userId,
            video_id: videoId,
            liked: false,
            viewed_at: new Date().toISOString(),
            watch_percentage: 0,  // Track video watch progress (0-100)
            saved: false,  // Save for later functionality
            shared_with: []  // Array of user IDs that this was shared with
        };
        interactions.push(interaction);
    }

    writeInteractions({ interactions });
    return interaction;
}

// Get all interactions for a user
export function getUserInteractions(userId) {
    const data = readInteractions();
    const interactions = data.interactions || [];
    return interactions.filter(i => i.user_id === userId);
}

// Get viewed videos for a user
export function getViewedVideos(userId) {
    const interactions = getUserInteractions(userId);
    return interactions.map(i => i.video_id); // All interactions represent viewed videos
}

// Like a video
export function likeVideo(userId, videoId) {
    const data = readInteractions();
    const interactions = data.interactions || [];

    let interaction = interactions.find(i =>
        i.user_id === userId && i.video_id === videoId
    );

    if (!interaction) {
        // If no interaction exists, create one (user must have viewed to like)
        interaction = {
            id: generateId(),
            user_id: userId,
            video_id: videoId,
            liked: true,
            viewed_at: new Date().toISOString(),
            watch_percentage: 0,  // Track video watch progress (0-100)
            saved: false,  // Save for later functionality
            shared_with: []  // Array of user IDs that this was shared with
        };
        interactions.push(interaction);
    } else {
        // Update existing interaction
        interaction.liked = true;
    }

    writeInteractions({ interactions });
    return interaction;
}

// Unlike a video
export function unlikeVideo(userId, videoId) {
    const data = readInteractions();
    const interactions = data.interactions || [];

    let interaction = interactions.find(i =>
        i.user_id === userId && i.video_id === videoId
    );

    if (!interaction) {
        // If no interaction exists, create one with liked: false
        // This would be unusual (unliking without previous interaction), but handle gracefully
        interaction = {
            id: generateId(),
            user_id: userId,
            video_id: videoId,
            liked: false,
            // Don't set viewed_at here as it's not related to the unlike action
            watch_percentage: 0,  // Track video watch progress (0-100)
            saved: false,  // Save for later functionality
            shared_with: []  // Array of user IDs that this was shared with
        };
        interactions.push(interaction);
    } else {
        // Update existing interaction - only change the liked status
        interaction.liked = false;
    }

    writeInteractions({ interactions });
    return interaction;
}

// Get like count for a video
export function getVideoLikeCount(videoId) {
    const data = readInteractions();
    const interactions = data.interactions || [];
    const likedInteractions = interactions.filter(i => i.video_id === videoId && i.liked);
    return likedInteractions.length;
}

// Get user's liked videos
export function getUserLikedVideos(userId) {
    const data = readInteractions();
    const interactions = data.interactions || [];
    const userInteractions = interactions.filter(i => i.user_id === userId && i.liked);
    return userInteractions.map(i => ({
        videoId: i.video_id
    }));
}
