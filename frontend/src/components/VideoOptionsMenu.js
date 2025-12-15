import React from 'react';
import { useVideoSave } from '../hooks/useVideoSave';
import { useCompanyFollow } from '../hooks/useCompanyFollow';
import '../styles/videoOptionsStyles.css';

/**
 * VideoOptionsMenu Component
 * Displays a menu of actions for a video (save, follow company, share, etc.)
 * PURE UI - All business logic in hooks
 */
const VideoOptionsMenu = ({ video, currentUser, onClose }) => {
    // Use custom hooks for ALL business logic
    const { isSaved, toggleSave, shareVideo, message: saveMessage } = useVideoSave(video, currentUser);
    const {
        isFollowing,
        toggleFollow,
        goToWebsite,
        companyName,
        companyWebsite,
        loading,
        message: followMessage
    } = useCompanyFollow(video.company_id, currentUser);

    // Combined message from both hooks
    const message = saveMessage || followMessage;

    // Handler wrappers that call hook functions
    const handleSave = async () => {
        await toggleSave();
    };

    const handleFollow = async () => {
        await toggleFollow();
    };

    const handleGoToWebsite = () => {
        const result = goToWebsite();
        if (result.success) {
            onClose();
        }
    };

    const handleShare = () => {
        shareVideo();
    };

    const options = [
        {
            id: 'save',
            label: isSaved ? 'Unsave Video' : 'Save Video',
            icon: isSaved ? '✓' : '🔖',
            action: handleSave,
            show: true
        },
        {
            id: 'follow',
            label: isFollowing ? `Unfollow ${companyName}` : `Follow ${companyName}`,
            icon: isFollowing ? '✓' : '➕',
            action: handleFollow,
            show: !loading && companyName
        },
        {
            id: 'website',
            label: 'Go to Website',
            icon: '🌐',
            action: handleGoToWebsite,
            show: !loading && companyWebsite
        },
        {
            id: 'share',
            label: 'Share Video',
            icon: '📤',
            action: handleShare,
            show: true
        }
    ];

    return (
        <div className="video-options-overlay" onClick={onClose}>
            <div className="video-options-menu" onClick={(e) => e.stopPropagation()}>
                <div className="options-header">
                    <h3>Options</h3>
                    <button className="close-button" onClick={onClose}>✕</button>
                </div>

                {message && (
                    <div className="options-message">
                        {message}
                    </div>
                )}

                <div className="options-list">
                    {options.filter(opt => opt.show).map(option => (
                        <button
                            key={option.id}
                            className="option-item"
                            onClick={option.action}
                        >
                            <span className="option-icon">{option.icon}</span>
                            <span className="option-label">{option.label}</span>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default VideoOptionsMenu;
