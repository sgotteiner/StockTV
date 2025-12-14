import express from 'express';
import * as companyStorage from '../storage/companyStorage.js';

const router = express.Router();

/**
 * Company Routes
 * Handles company data operations
 */

// Get all companies
router.get('/', async (req, res) => {
    try {
        const companies = companyStorage.getAllCompanies();
        res.json({ companies });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get company by name (must be before /:id to avoid collision)
router.get('/name/:name', async (req, res) => {
    try {
        const company = companyStorage.getCompanyByName(req.params.name);
        if (!company) {
            return res.status(404).json({ error: 'Company not found' });
        }
        res.json(company);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get company video count (must be before /:id to avoid collision)
router.get('/:id/videos/count', async (req, res) => {
    try {
        const count = companyStorage.getCompanyVideoCount(req.params.id);
        res.json({ count });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get company by ID
router.get('/:id', async (req, res) => {
    try {
        const company = companyStorage.getCompanyById(req.params.id);
        if (!company) {
            return res.status(404).json({ error: 'Company not found' });
        }
        res.json(company);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update company website
router.put('/:id/website', async (req, res) => {
    try {
        const { website } = req.body;
        const company = companyStorage.updateCompanyWebsite(req.params.id, website);
        res.json({ success: true, company });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

export default router;

