import React, { useState, useEffect } from 'react';
import { useUser } from '../context/UserProvider';
import { getCompanyByName, updateCompanyWebsite } from '../services/companyApi';
import { ROLES } from '../constants';
import '../App.css';

/**
 * CompanyPanel Component
 * Allows company users to manage their company information
 */
const CompanyPanel = ({ onBack }) => {
    const { currentUser } = useUser();
    const [company, setCompany] = useState(null);
    const [website, setWebsite] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    // Fetch company data
    useEffect(() => {
        const fetchCompany = async () => {
            try {
                setIsLoading(true);
                // For company users, fetch by their name (which is the company name)
                const response = await getCompanyByName(currentUser.name);
                if (response) {
                    setCompany(response);
                    setWebsite(response.website || '');
                }
            } catch (err) {
                setError('Failed to load company data');
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };

        if (currentUser?.role === ROLES.COMPANY) {
            fetchCompany();
        }
    }, [currentUser]);

    const handleSaveWebsite = async (e) => {
        e.preventDefault();

        if (!company) return;

        setIsSaving(true);
        setError('');
        setMessage('');

        try {
            await updateCompanyWebsite(company.id, website);
            setMessage('Website updated successfully!');
            setTimeout(() => setMessage(''), 3000);
        } catch (err) {
            setError('Failed to update website');
            console.error(err);
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return <div className="loading">Loading company data...</div>;
    }

    return (
        <div className="admin-panel">
            <div className="profile-header">
                <h2>Company Panel</h2>
                <button onClick={onBack} className="action-button" style={{ marginTop: 0 }}>
                    ← Back
                </button>
            </div>

            <div className="admin-content">
                <div className="company-info">
                    <h3>{company?.name || currentUser.name}</h3>
                    <p className="company-id">ID: {company?.id || 'N/A'}</p>
                </div>

                <form onSubmit={handleSaveWebsite} className="company-form">
                    <div className="form-group">
                        <label htmlFor="website">Company Website:</label>
                        <input
                            type="url"
                            id="website"
                            value={website}
                            onChange={(e) => setWebsite(e.target.value)}
                            placeholder="https://example.com"
                            className="form-input"
                            disabled={isSaving}
                        />
                        <small style={{ color: '#666', fontSize: '12px' }}>
                            Enter your company's website URL (optional)
                        </small>
                    </div>

                    <button
                        type="submit"
                        className="action-button"
                        disabled={isSaving}
                    >
                        {isSaving ? 'Saving...' : 'Save Website'}
                    </button>

                    {message && (
                        <div className="success-message" style={{ marginTop: '10px' }}>
                            {message}
                        </div>
                    )}

                    {error && (
                        <div className="error-message" style={{ marginTop: '10px' }}>
                            {error}
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
};

export default CompanyPanel;
