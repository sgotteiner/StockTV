import path from 'path';
import { fileURLToPath } from 'url';
import { readJSON, writeJSON, generateId } from '../utils/fileIO.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataPath = path.join(__dirname, '../data/user_company_interactions.json');

/**
 * Company Interaction Storage Module
 * Handles user-company follow relationships
 */

// Helper: Read interactions
const readInteractions = () => readJSON(dataPath, { interactions: [] });

// Helper: Write interactions
const writeInteractions = (data) => writeJSON(dataPath, data);

// Helper: Find interaction
const findInteraction = (interactions, userId, companyId) =>
    interactions.find(i => i.user_id === userId && i.company_id === companyId);

/**
 * Follow a company
 */
export function followCompany(userId, companyId) {
    const data = readInteractions();
    const interactions = data.interactions || [];

    // Check if already following
    const existing = findInteraction(interactions, userId, companyId);
    if (existing) {
        return existing; // Already following
    }

    const newInteraction = {
        id: generateId('follow_'),
        user_id: userId,
        company_id: companyId,
        followed_at: new Date().toISOString()
    };

    interactions.push(newInteraction);
    writeInteractions({ interactions });

    return newInteraction;
}

/**
 * Unfollow a company
 */
export function unfollowCompany(userId, companyId) {
    const data = readInteractions();
    let interactions = data.interactions || [];

    // Remove the interaction
    interactions = interactions.filter(i => !(i.user_id === userId && i.company_id === companyId));

    writeInteractions({ interactions });
    return { success: true };
}

/**
 * Check if user follows a company
 */
export function isFollowingCompany(userId, companyId) {
    const data = readInteractions();
    const interactions = data.interactions || [];
    return !!findInteraction(interactions, userId, companyId);
}

/**
 * Get all companies a user follows
 */
export function getUserFollowedCompanies(userId) {
    const data = readInteractions();
    const interactions = data.interactions || [];
    return interactions
        .filter(i => i.user_id === userId)
        .map(i => ({ companyId: i.company_id, followedAt: i.followed_at }));
}

/**
 * Get follower count for a company
 */
export function getCompanyFollowerCount(companyId) {
    const data = readInteractions();
    const interactions = data.interactions || [];
    return interactions.filter(i => i.company_id === companyId).length;
}
