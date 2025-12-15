import { useState, useEffect } from 'react';
import { getCompanyById } from '../services/companyApi';

/**
 * Custom hook to fetch company name from company_id
 * @param {string} companyId - Company ID
 * @returns {Object} { companyName, loading, error }
 */
export function useCompanyName(companyId) {
    const [companyName, setCompanyName] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!companyId) {
            setCompanyName('Unknown Company');
            setLoading(false);
            return;
        }

        const fetchCompany = async () => {
            try {
                setLoading(true);
                const company = await getCompanyById(companyId);
                setCompanyName(company?.name || 'Unknown Company');
            } catch (err) {
                console.error('Error fetching company:', err);
                setCompanyName('Unknown Company');
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchCompany();
    }, [companyId]);

    return { companyName, loading, error };
}
