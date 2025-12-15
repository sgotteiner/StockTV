import { useState, useEffect } from 'react';
import { followCompany, unfollowCompany, isFollowingCompany } from '../services/companyFollowApi';
import { getCompanyById } from '../services/companyApi';

/**
 * Custom hook for company follow/unfollow functionality
 * @param {string} companyId - Company ID
 * @param {Object} currentUser - Current user object
 * @returns {Object} { isFollowing, toggleFollow, goToWebsite, companyData, companyName, companyWebsite, loading, message }
 */
export function useCompanyFollow(companyId, currentUser) {
    const [isFollowing, setIsFollowing] = useState(false);
    const [companyData, setCompanyData] = useState(null);
    const [companyName, setCompanyName] = useState('');
    const [companyWebsite, setCompanyWebsite] = useState(null);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');

    // Fetch company data and follow status
    useEffect(() => {
        const fetchCompanyData = async () => {
            if (!companyId) {
                setLoading(false);
                return;
            }

            try {
                const company = await getCompanyById(companyId);
                setCompanyData(company);
                setCompanyName(company?.name || 'Unknown Company');
                setCompanyWebsite(company?.website || null);

                if (currentUser && company) {
                    const following = await isFollowingCompany(company.id, currentUser.id);
                    setIsFollowing(following);
                } else {
                    setIsFollowing(false);
                }
            } catch (error) {
                console.error('Error fetching company:', error);
                setCompanyData(null);
                setCompanyName('Unknown Company');
                setCompanyWebsite(null);
                setIsFollowing(false);
            } finally {
                setLoading(false);
            }
        };

        fetchCompanyData();
    }, [companyId, currentUser?.id]);

    const toggleFollow = async () => {
        if (!currentUser) {
            setMessage('Please log in to follow companies');
            setTimeout(() => setMessage(''), 2000);
            return;
        }

        if (!companyData) {
            setMessage('Company not found');
            setTimeout(() => setMessage(''), 2000);
            return;
        }

        try {
            if (isFollowing) {
                await unfollowCompany(companyData.id, currentUser.id);
                setIsFollowing(false);
                setMessage(`Unfollowed ${companyData.name}`);
            } else {
                await followCompany(companyData.id, currentUser.id);
                setIsFollowing(true);
                setMessage(`Following ${companyData.name}!`);
            }

            setTimeout(() => setMessage(''), 1500);
        } catch (error) {
            console.error('Error toggling follow:', error);
            setMessage('Failed to update follow status');
            setTimeout(() => setMessage(''), 2000);
        }
    };

    const goToWebsite = () => {
        if (companyWebsite) {
            window.open(companyWebsite, '_blank', 'noopener,noreferrer');
            return { success: true };
        } else {
            setMessage('Website not available');
            setTimeout(() => setMessage(''), 2000);
            return { success: false };
        }
    };

    return {
        isFollowing,
        toggleFollow,
        goToWebsite,
        companyData,
        companyName,
        companyWebsite,
        loading,
        message
    };
}
