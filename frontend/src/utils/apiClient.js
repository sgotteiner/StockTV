/**
 * Shared API error handler
 * Provides consistent error handling across all API calls
 */

/**
 * Handle API fetch errors
 * @param {Response} response - Fetch response object
 * @param {string} context - Context for error message (e.g., 'fetching videos')
 * @throws {Error} Formatted error with context
 */
export async function handleAPIError(response, context = 'API request') {
    let errorMessage = `Failed ${context}: ${response.status}`;

    try {
        const errorData = await response.json();
        if (errorData.error) {
            errorMessage = errorData.error;
        } else if (errorData.message) {
            errorMessage = errorData.message;
        }
    } catch {
        // Response wasn't JSON, use status text
        errorMessage = `Failed ${context}: ${response.statusText || response.status}`;
    }

    throw new Error(errorMessage);
}

/**
 * Wrapper for fetch with error handling
 * @param {string} url - URL to fetch
 * @param {Object} options - Fetch options
 * @param {string} context - Context for error messages
 * @returns {Promise<any>} Parsed JSON response
 */
export async function apiFetch(url, options = {}, context = 'API request') {
    try {
        const response = await fetch(url, {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            ...options
        });

        if (!response.ok) {
            await handleAPIError(response, context);
        }

        return await response.json();
    } catch (error) {
        console.error(`Error ${context}:`, error);
        throw error;
    }
}
