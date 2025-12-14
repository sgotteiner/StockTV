import config from '../config';

const BASE_URL = config.API_BASE_URL + '/api/companies';

/**
 * Company API Service
 * Handles all company-related API calls
 */

/**
 * Get all companies
 */
export async function getAllCompanies() {
    try {
        const response = await fetch(BASE_URL);
        if (!response.ok) {
            throw new Error(`Failed to fetch companies: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching companies:', error);
        throw error;
    }
}

/**
 * Get company by ID
 */
export async function getCompanyById(companyId) {
    try {
        const response = await fetch(`${BASE_URL}/${companyId}`);
        if (!response.ok) {
            throw new Error(`Failed to fetch company: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching company:', error);
        throw error;
    }
}

/**
 * Get company by name
 */
export async function getCompanyByName(companyName) {
    try {
        const response = await fetch(`${BASE_URL}/name/${encodeURIComponent(companyName)}`);
        if (!response.ok) {
            throw new Error(`Failed to fetch company: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching company:', error);
        throw error;
    }
}

/**
 * Update company website
 */
export async function updateCompanyWebsite(companyId, website) {
    try {
        const response = await fetch(`${BASE_URL}/${companyId}/website`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ website })
        });

        if (!response.ok) {
            throw new Error(`Failed to update company website: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error updating company website:', error);
        throw error;
    }
}
