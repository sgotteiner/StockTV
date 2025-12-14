import path from 'path';
import { fileURLToPath } from 'url';
import { readJSON, writeJSON, generateId } from '../utils/fileIO.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataPath = path.join(__dirname, '../data/user_company_follows.json');

/**
 * Company Follow Storage Module
 * Handles user-company follow relationships
 */

// Helper: Read follows
const readFollows = () => readJSON(dataPath, { follows: [] });

// Helper: Write follows
const writeFollows = (data) => writeJSON(dataPath, data);

// Helper: Find follow
const findFollow = (follows, userId, companyId) =>
    follows.find(f => f.user_id === userId && f.company_id === companyId);

/**
 * Follow a company
 */
export function followCompany(userId, companyId) {
    const data = readFollows();
    const follows = data.follows || [];

    // Check if already following
    const existing = findFollow(follows, userId, companyId);
    if (existing) {
        return existing; // Already following
    }

    const newFollow = {
        id: generateId('follow_'),
        user_id: userId,
        company_id: companyId,
        followed_at: new Date().toISOString()
    };

    follows.push(newFollow);
    writeFollows({ follows });

    return newFollow;
}

/**
 * Unfollow a company
 */
export function unfollowCompany(userId, companyId) {
    const data = readFollows();
    let follows = data.follows || [];

    // Remove the follow
    follows = follows.filter(f => !(f.user_id === userId && f.company_id === companyId));

    writeFollows({ follows });
    return { success: true };
}

/**
 * Check if user follows a company
 */
export function isFollowingCompany(userId, companyId) {
    const data = readFollows();
    const follows = data.follows || [];
    return !!findFollow(follows, userId, companyId);
}

/**
 * Get all companies a user follows
 */
export function getUserFollowedCompanies(userId) {
    const data = readFollows();
    const follows = data.follows || [];
    return follows
        .filter(f => f.user_id === userId)
        .map(f => ({ companyId: f.company_id, followedAt: f.followed_at }));
}

/**
 * Get follower count for a company
 */
export function getCompanyFollowerCount(companyId) {
    const data = readFollows();
    const follows = data.follows || [];
    return follows.filter(f => f.company_id === companyId).length;
}
