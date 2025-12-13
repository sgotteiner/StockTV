import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataPath = path.join(__dirname, '../data/companies.json');

// Read companies
function readCompanies() {
    const data = fs.readFileSync(dataPath, 'utf8');
    return JSON.parse(data);
}

// Write companies
function writeCompanies(data) {
    fs.writeFileSync(dataPath, JSON.stringify(data, null, 2), 'utf8');
}

// Get all companies
export function getAllCompanies() {
    const data = readCompanies();
    return data.companies || [];
}

// Get company by ID
export function getCompanyById(id) {
    const companies = getAllCompanies();
    return companies.find(c => c.id === id);
}

// Get company by name
export function getCompanyByName(name) {
    const companies = getAllCompanies();
    return companies.find(c => c.name.toLowerCase() === name.toLowerCase());
}

// Create new company
export function createCompany(name) {
    const data = readCompanies();
    const companies = data.companies || [];

    // Check if company already exists
    const existing = companies.find(c => c.name.toLowerCase() === name.toLowerCase());
    if (existing) {
        return existing;
    }

    // Generate random hash ID (like videos and users)
    const id = Math.random().toString(36).substring(2, 10);

    const newCompany = {
        id,
        name: name.charAt(0).toUpperCase() + name.slice(1),
        created_at: new Date().toISOString()
    };

    companies.push(newCompany);
    writeCompanies({ companies });

    return newCompany;
}
