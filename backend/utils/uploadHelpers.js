import { getUserById } from '../storage/userStorage.js';
import { getCompanyByName, createCompany } from '../storage/companyStorage.js';
import { addVideo } from '../storage/videoStorage.js';

/**
 * Upload Helper Functions
 * Reusable logic for video upload operations
 */

/**
 * Validate upload request
 * @param {string} userId - User ID
 * @param {string} companyNameOrId - Company name or ID
 * @returns {Object} { user, isValid, error }
 */
export function validateUploadRequest(userId, companyNameOrId) {
    const user = getUserById(userId);

    if (!user) {
        return { user: null, isValid: false, error: 'User not found' };
    }

    if (!companyNameOrId) {
        return { user, isValid: false, error: 'Company name is required' };
    }

    return { user, isValid: true, error: null };
}

/**
 * Get or create company
 * @param {string} companyNameOrId - Company name or ID
 * @returns {Object} Company object
 */
export function getOrCreateCompany(companyNameOrId) {
    let company = getCompanyByName(companyNameOrId);

    if (!company) {
        company = createCompany(companyNameOrId);
    }

    return company;
}

/**
 * Create video record in database
 * @param {Object} videoData - Video metadata
 * @param {Object} company - Company object
 * @param {string} userId - User ID
 * @returns {Object} Created video object
 */
export function createVideoRecord(videoData, company, userId) {
    const { filename, title, description, tags = [] } = videoData;

    return addVideo({
        filename,
        title,
        company_id: company.id,
        date: new Date().toISOString().split('T')[0],
        description: description || '',
        uploader: userId,
        tags
    });
}

/**
 * Extract title from filename
 * @param {string} filename - Filename with extension
 * @returns {string} Title without extension
 */
export function extractTitleFromFilename(filename) {
    const lastDotIndex = filename.lastIndexOf('.');
    return lastDotIndex > 0 ? filename.substring(0, lastDotIndex) : filename;
}

/**
 * Extract title from URL path
 * @param {string} url - Full URL
 * @returns {string} Title extracted from URL
 */
export function extractTitleFromUrl(url) {
    try {
        const urlObj = new URL(url);
        const pathname = urlObj.pathname;
        const filename = pathname.split('/').pop();
        return extractTitleFromFilename(filename) || 'Video from URL';
    } catch {
        return 'Video from URL';
    }
}
