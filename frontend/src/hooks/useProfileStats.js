import { useState, useEffect } from 'react';
import * as interactionsApi from '../services/interactionsApi';
import * as companyFollowApi from '../services/companyFollowApi';
import * as companyApi from '../services/companyApi';

/**
 * Custom hook to fetch and manage user profile statistics
 * @param {string} userId - User ID
 * @returns {Object} { stats, loading, error }
 */
export function useProfileStats(userId, currentUser) {
    const [stats, setStats] = useState({
        liked: 0,
        saved: 0,
        following: 0,
        videos: 0
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!userId) {
            setLoading(false);
            return;
        }

        const fetchStats = async () => {
            try {
                setLoading(true);

                // Fetch liked videos
                const likedData = await interactionsApi.getUserLikedVideos(userId);

                // Fetch saved videos
                const savedData = await interactionsApi.getUserSavedVideos(userId);

                // Fetch following companies
                const followingData = await companyFollowApi.getUserFollowedCompanies(userId);

                // Fetch video count for company users
                let videoCount = 0;
                if (currentUser?.role === 'company' && currentUser?.name) {
                    try {
                        const company = await companyApi.getCompanyByName(currentUser.name);
                        if (company) {
                            const response = await fetch(`http://localhost:5000/api/companies/${company.id}/videos/count`);
                            const data = await response.json();
                            videoCount = data.count || 0;
                        }
                    } catch (err) {
                        console.error('Error fetching company video count:', err);
                    }
                }

                setStats({
                    liked: likedData.likedVideos ? likedData.likedVideos.length : 0,
                    saved: savedData.savedVideos ? savedData.savedVideos.length : 0,
                    following: followingData.companies ? followingData.companies.length : 0,
                    videos: videoCount
                });

                setError(null);
            } catch (err) {
                console.error('Failed to fetch user stats:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, [userId, currentUser]);

    return { stats, loading, error };
}
