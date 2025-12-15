import path from 'path';
import { fileURLToPath } from 'url';
import { readJSON, writeJSON, generateId } from '../utils/fileIO.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataPath = path.join(__dirname, '../data/user_video_interactions.json');

/**
 * Interaction Storage Module
 * Handles all user-video interaction data (views, likes, saves, shares)
 */

// Helper: Read interactions
const readInteractions = () => readJSON(dataPath, { interactions: [] });

// Helper: Write interactions
const writeInteractions = (data) => writeJSON(dataPath, data);

// Helper: Create new interaction object
const createInteraction = (userId, videoId, liked = false) => ({
    id: generateId('int_'),
    user_id: userId,
    video_id: videoId,
    liked,
    viewed_at: new Date().toISOString(),
    watch_percentage: 0,
    saved: false,
    shared_with: []
});

// Helper: Find interaction
const findInteraction = (interactions, userId, videoId) =>
    interactions.find(i => i.user_id === userId && i.video_id === videoId);

/**
 * Record video view
 */
export function recordView(userId, videoId, watchData) {
    const data = readInteractions();
    const interactions = data.interactions || [];

    let interaction = findInteraction(interactions, userId, videoId);

    if (!interaction) {
        interaction = createInteraction(userId, videoId);
        interactions.push(interaction);
    }

    writeInteractions({ interactions });
    return interaction;
}

/**
 * Get all interactions for a user
 */
export function getUserInteractions(userId) {
    const data = readInteractions();
    return (data.interactions || []).filter(i => i.user_id === userId);
}

/**
 * Get viewed videos for a user
 */
export function getViewedVideos(userId) {
    return getUserInteractions(userId).map(i => i.video_id);
}

/**
 * Like a video
 */
export function likeVideo(userId, videoId) {
    const data = readInteractions();
    const interactions = data.interactions || [];

    let interaction = findInteraction(interactions, userId, videoId);

    if (!interaction) {
        interaction = createInteraction(userId, videoId, true);
        interactions.push(interaction);
    } else {
        interaction.liked = true;
    }

    writeInteractions({ interactions });
    return interaction;
}

/**
 * Unlike a video
 */
export function unlikeVideo(userId, videoId) {
    const data = readInteractions();
    const interactions = data.interactions || [];

    let interaction = findInteraction(interactions, userId, videoId);

    if (!interaction) {
        interaction = createInteraction(userId, videoId, false);
        interactions.push(interaction);
    } else {
        interaction.liked = false;
    }

    writeInteractions({ interactions });
    return interaction;
}

/**
 * Get like count for a video
 */
export function getVideoLikeCount(videoId) {
    const data = readInteractions();
    const interactions = data.interactions || [];
    return interactions.filter(i => i.video_id === videoId && i.liked).length;
}

/**
 * Get user's liked videos
 */
export function getUserLikedVideos(userId) {
    const data = readInteractions();
    const interactions = data.interactions || [];
    return interactions
        .filter(i => i.user_id === userId && i.liked)
        .map(i => ({ videoId: i.video_id }));
}

/**
 * Save a video
 */
export function saveVideo(userId, videoId) {
    const data = readInteractions();
    const interactions = data.interactions || [];

    let interaction = findInteraction(interactions, userId, videoId);

    if (!interaction) {
        interaction = createInteraction(userId, videoId);
        interaction.saved = true;
        interactions.push(interaction);
    } else {
        interaction.saved = true;
    }

    writeInteractions({ interactions });
    return interaction;
}

/**
 * Unsave a video
 */
export function unsaveVideo(userId, videoId) {
    const data = readInteractions();
    const interactions = data.interactions || [];

    let interaction = findInteraction(interactions, userId, videoId);

    if (!interaction) {
        interaction = createInteraction(userId, videoId);
        interaction.saved = false;
        interactions.push(interaction);
    } else {
        interaction.saved = false;
    }

    writeInteractions({ interactions });
    return interaction;
}

/**
 * Get user's saved videos
 */
export function getUserSavedVideos(userId) {
    const data = readInteractions();
    const interactions = data.interactions || [];
    return interactions
        .filter(i => i.user_id === userId && i.saved)
        .map(i => ({ video_id: i.video_id }));
}

