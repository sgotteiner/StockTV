import config from '../config';

const BASE_URL = config.API_BASE_URL + '/api/follows';

/**
 * Follow a company
 */
export async function followCompany(companyId, userId) {
    try {
        const response = await fetch(`${BASE_URL}/companies/${companyId}/follow`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId }),
        });

        if (!response.ok) {
            throw new Error(`Failed to follow company: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error following company:', error);
        throw error;
    }
}

/**
 * Unfollow a company
 */
export async function unfollowCompany(companyId, userId) {
    try {
        const response = await fetch(`${BASE_URL}/companies/${companyId}/follow`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId }),
        });

        if (!response.ok) {
            throw new Error(`Failed to unfollow company: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error unfollowing company:', error);
        throw error;
    }
}

/**
 * Check if user follows a company
 */
export async function isFollowingCompany(companyId, userId) {
    try {
        const response = await fetch(`${BASE_URL}/companies/${companyId}/following/${userId}`);

        if (!response.ok) {
            throw new Error(`Failed to check follow status: ${response.status}`);
        }

        const data = await response.json();
        return data.isFollowing;
    } catch (error) {
        console.error('Error checking follow status:', error);
        throw error;
    }
}

/**
 * Get user's followed companies
 */
export async function getUserFollowedCompanies(userId) {
    try {
        const response = await fetch(`${BASE_URL}/users/${userId}/following`);

        if (!response.ok) {
            throw new Error(`Failed to get followed companies: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error getting followed companies:', error);
        throw error;
    }
}
