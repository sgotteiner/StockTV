import config from '../config';
const API_BASE_URL = config.API_BASE_URL + '/api';

/**
 * Fetch all users (Admin only)
 */
export const fetchUsers = async () => {
    const response = await fetch(`${API_BASE_URL}/admin/users`);
    if (!response.ok) {
        throw new Error('Failed to fetch users');
    }
    return await response.json();
};

/**
 * Update user role (Admin only)
 * @param {string} userId
 * @param {string} role
 */
export const updateUserRole = async (userId, role) => {
    const response = await fetch(`${API_BASE_URL}/admin/users/${userId}/role`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ role }),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update role');
    }
    return await response.json();
};
