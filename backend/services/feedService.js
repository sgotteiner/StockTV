import { getAllVideos } from '../storage/videoStorage.js';
import { getUserInteractions } from '../storage/interactionStorage.js';
import { getUserFollowedCompanies } from '../storage/companyFollowStorage.js';
import { PAGINATION } from '../config/constants.js';

/**
 * Get personalized feed for a user
 * Algorithm:
 * 1. Unwatched videos from FOLLOWED companies (sorted by created_at DESC - newest first)
 * 2. Unwatched videos from OTHER companies (sorted by created_at DESC - newest first)
 * 3. Watched videos (sorted by viewed_at ASC - oldest first, encourages scrolling to unwatched)
 * 
 * @param {string} userId - User ID (optional, if null returns all videos by created_at)
 * @param {number} page - Page number (1-indexed, default: 1)
 * @param {number} limit - Videos per page (default from constants)
 * @returns {Object} { videos: Array, pagination: { page, limit, total, totalPages, hasMore } }
 */
export function getPersonalizedFeed(userId, page = PAGINATION.DEFAULT_PAGE, limit = PAGINATION.DEFAULT_PAGE_SIZE) {
    const allVideos = getAllVideos();

    // If no user, just return all videos sorted by newest
    if (!userId) {
        const sortedVideos = allVideos.sort((a, b) =>
            new Date(b.created_at || 0) - new Date(a.created_at || 0)
        );
        return paginateResults(sortedVideos, page, limit);
    }

    // Get user's interactions and followed companies
    const userInteractions = getUserInteractions(userId);
    const followedCompanies = getUserFollowedCompanies(userId);

    // Create a set of followed company IDs for quick lookup
    const followedCompanyIds = new Set(followedCompanies.map(fc => fc.companyId));

    // Create a map of video_id -> interaction for quick lookup
    const interactionMap = new Map();
    userInteractions.forEach(interaction => {
        interactionMap.set(interaction.video_id, interaction);
    });

    // Separate videos into categories
    const unwatchedFollowed = [];
    const unwatchedOther = [];
    const watchedVideos = [];

    allVideos.forEach(video => {
        const interaction = interactionMap.get(video.id);
        const isFollowed = followedCompanyIds.has(video.company_id);

        if (interaction) {
            // Video has been watched
            watchedVideos.push({
                ...video,
                viewed_at: interaction.viewed_at,
                liked: interaction.liked
            });
        } else {
            // Video hasn't been watched - prioritize by follow status
            if (isFollowed) {
                unwatchedFollowed.push(video);
            } else {
                unwatchedOther.push(video);
            }
        }
    });

    // Sort all categories by created_at (newest first)
    unwatchedFollowed.sort((a, b) =>
        new Date(b.created_at || 0) - new Date(a.created_at || 0)
    );

    unwatchedOther.sort((a, b) =>
        new Date(b.created_at || 0) - new Date(a.created_at || 0)
    );

    // Sort watched videos by viewed_at (oldest first - encourages scrolling to unwatched)
    watchedVideos.sort((a, b) =>
        new Date(a.viewed_at || 0) - new Date(b.viewed_at || 0)
    );

    // Combine: followed unwatched first, then other unwatched, then watched
    const combinedFeed = [...unwatchedFollowed, ...unwatchedOther, ...watchedVideos];

    return paginateResults(combinedFeed, page, limit);
}

/**
 * Helper function to paginate an array of videos
 * @param {Array} videos - Full array of videos
 * @param {number} page - Page number (1-indexed)
 * @param {number} limit - Items per page
 * @returns {Object} Paginated result with metadata
 */
function paginateResults(videos, page, limit) {
    const total = videos.length;
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;

    const paginatedVideos = videos.slice(startIndex, endIndex);

    return {
        videos: paginatedVideos,
        pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total,
            totalPages,
            hasMore: page < totalPages
        }
    };
}
