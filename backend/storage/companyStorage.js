import path from 'path';
import { fileURLToPath } from 'url';
import { readJSON, writeJSON, generateId } from '../utils/fileIO.js';
import { getAllVideos } from './videoStorage.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataPath = path.join(__dirname, '../data/companies.json');

/**
 * Company Storage Module
 * Handles company data and operations
 */

// Helper: Read companies
const readCompanies = () => readJSON(dataPath, { companies: [] });

// Helper: Write companies
const writeCompanies = (data) => writeJSON(dataPath, data);

/**
 * Get all companies
 */
export function getAllCompanies() {
    const data = readCompanies();
    return data.companies || [];
}

/**
 * Get company by ID
 */
export function getCompanyById(id) {
    const companies = getAllCompanies();
    return companies.find(c => c.id === id);
}

/**
 * Get company by name
 */
export function getCompanyByName(name) {
    const companies = getAllCompanies();
    return companies.find(c => c.name.toLowerCase() === name.toLowerCase());
}

/**
 * Create new company
 */
export function createCompany(name, website = '') {
    const data = readCompanies();
    const companies = data.companies || [];

    // Check if company already exists
    const existing = companies.find(c => c.name.toLowerCase() === name.toLowerCase());
    if (existing) {
        return existing;
    }

    const newCompany = {
        id: generateId('comp_'),
        name: name.charAt(0).toUpperCase() + name.slice(1),
        website: website || '',
        created_at: new Date().toISOString()
    };

    companies.push(newCompany);
    writeCompanies({ companies });

    return newCompany;
}

/**
 * Update company website
 */
export function updateCompanyWebsite(companyId, website) {
    const data = readCompanies();
    const companies = data.companies || [];

    const company = companies.find(c => c.id === companyId);
    if (!company) {
        throw new Error('Company not found');
    }

    company.website = website;
    writeCompanies({ companies });

    return company;
}

/**
 * Update company by name (for backward compatibility)
 */
export function updateCompanyByName(companyName, updates) {
    const data = readCompanies();
    const companies = data.companies || [];

    const company = companies.find(c => c.name.toLowerCase() === companyName.toLowerCase());
    if (!company) {
        throw new Error('Company not found');
    }

    Object.assign(company, updates);
    writeCompanies({ companies });

    return company;
}

/**
 * Get company video count
 */
export function getCompanyVideoCount(companyId) {
    const videos = getAllVideos();
    return videos.filter(v => v.company_id === companyId).length;
}
