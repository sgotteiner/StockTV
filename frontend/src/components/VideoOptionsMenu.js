import React, { useState, useEffect } from 'react';
import { getCompanyByName } from '../services/companyApi';
import { saveVideo, unsaveVideo } from '../services/interactionsApi';
import { followCompany, unfollowCompany, isFollowingCompany } from '../services/companyFollowApi';
import '../App.css';

/**
 * VideoOptionsMenu Component
 * Modular options menu for video actions
 * Easily extensible for future options
 */
const VideoOptionsMenu = ({ video, onClose, currentUser }) => {
    const [message, setMessage] = useState('');
    const [companyWebsite, setCompanyWebsite] = useState(null);
    const [companyData, setCompanyData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isSaved, setIsSaved] = useState(false);
    const [isFollowing, setIsFollowing] = useState(false);

    // Fetch company data and check follow status
    useEffect(() => {
        const fetchData = async () => {
            if (video.company) {
                try {
                    const company = await getCompanyByName(video.company);
                    setCompanyWebsite(company.website);
                    setCompanyData(company);

                    // Check if following
                    if (currentUser) {
                        const followStatus = await isFollowingCompany(company.id, currentUser.id);
                        setIsFollowing(followStatus.isFollowing);
                    }
                } catch (error) {
                    console.error('Error fetching company:', error);
                    setCompanyData(null);
                    setCompanyWebsite(null);
                } finally {
                    setLoading(false);
                }
            } else {
                setLoading(false);
            }
        };

        fetchData();
    }, [video.company, currentUser]);

    // Check if video is saved
    useEffect(() => {
        // TODO: Add API endpoint to check if video is saved
        // For now, we'll just track it locally after save/unsave
        setIsSaved(false);
    }, [video.id, currentUser]);

    const handleToggleSave = async () => {
        if (!currentUser) {
            setMessage('Please log in to save videos');
            setTimeout(() => setMessage(''), 2000);
            return;
        }

        try {
            if (isSaved) {
                await unsaveVideo(video.id, currentUser.id);
                setIsSaved(false);
                setMessage('Video unsaved!');
            } else {
                await saveVideo(video.id, currentUser.id);
                setIsSaved(true);
                setMessage('Video saved!');
            }
            setTimeout(() => {
                setMessage('');
            }, 1500);
        } catch (error) {
            setMessage('Failed to update save status');
            setTimeout(() => setMessage(''), 2000);
        }
    };

    const handleGoToWebsite = () => {
        if (companyWebsite) {
            window.open(companyWebsite, '_blank');
            onClose();
        } else {
            setMessage('No website available for this company');
            setTimeout(() => setMessage(''), 2000);
        }
    };

    const handleToggleFollow = async () => {
        if (!currentUser) {
            setMessage('Please log in to follow companies');
            setTimeout(() => setMessage(''), 2000);
            return;
        }

        if (!companyData) {
            setMessage('Company information not available');
            setTimeout(() => setMessage(''), 2000);
            return;
        }

        try {
            if (isFollowing) {
                await unfollowCompany(companyData.id, currentUser.id);
                setIsFollowing(false);
                setMessage(`Unfollowed ${video.company}`);
            } else {
                await followCompany(companyData.id, currentUser.id);
                setIsFollowing(true);
                setMessage(`Now following ${video.company}!`);
            }
            setTimeout(() => {
                setMessage('');
            }, 1500);
        } catch (error) {
            setMessage('Failed to update follow status');
            setTimeout(() => setMessage(''), 2000);
        }
    };

    const handleShare = () => {
        // TODO: Implement share functionality
        setMessage('Share feature coming soon!');
        setTimeout(() => setMessage(''), 2000);
    };

    const options = [
        {
            id: 'save',
            label: isSaved ? 'Unsave Video' : 'Save Video',
            icon: isSaved ? '✓' : '🔖',
            action: handleToggleSave,
            show: !!currentUser // Only show if logged in
        },
        {
            id: 'follow',
            label: isFollowing ? `Unfollow ${video.company}` : `Follow ${video.company || 'Company'}`,
            icon: isFollowing ? '✓' : '➕',
            action: handleToggleFollow,
            show: !!currentUser && !!video.company // Only show if logged in and has company
        },
        {
            id: 'website',
            label: 'Go to Website',
            icon: '🌐',
            action: handleGoToWebsite,
            show: true // Always show
        },
        {
            id: 'share',
            label: 'Share Video',
            icon: '📤',
            action: handleShare,
            show: true // Always show
        }
    ];

    return (
        <div className="video-options-overlay" onClick={onClose}>
            <div className="video-options-menu" onClick={(e) => e.stopPropagation()}>
                <div className="options-header">
                    <h3>Options</h3>
                    <button className="close-button" onClick={onClose}>✕</button>
                </div>

                {loading ? (
                    <div style={{ padding: '20px', textAlign: 'center', color: '#888' }}>
                        Loading...
                    </div>
                ) : (
                    <div className="options-list">
                        {options
                            .filter(option => option.show)
                            .map(option => (
                                <button
                                    key={option.id}
                                    className="option-item"
                                    onClick={option.action}
                                >
                                    <span className="option-icon">{option.icon}</span>
                                    <span className="option-label">{option.label}</span>
                                </button>
                            ))
                        }
                    </div>
                )}

                {message && (
                    <div className="option-message">{message}</div>
                )}
            </div>
        </div>
    );
};

export default VideoOptionsMenu;
