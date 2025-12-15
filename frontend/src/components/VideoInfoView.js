import React from 'react';
import { useCompanyName } from '../hooks/useCompanyName';
import '../App.css';

/**
 * VideoInfoView Component
 * Displays detailed information about a video
 * @param {Object} video - Video object with title, company_id, date
 * @param {number} likeCount - Number of likes for the video
 * @param {function} onBack - Callback function to return to video view
 */
const VideoInfoView = ({ video, likeCount, onBack }) => {
  const { companyName, loading } = useCompanyName(video.company_id);

  return (
    <div className="video-info-container">
      <div className="video-info-content">
        <h2 className="video-title">{video.title}</h2>
        <p className="video-company">
          Company: {loading ? 'Loading...' : companyName}
        </p>
        <p className="video-date">Date: {video.date}</p>
        {video.description && (
          <p className="video-description">{video.description}</p>
        )}
        <div className="like-stats">
          <p>Likes: {likeCount}</p>
        </div>
        <button
          className="back-to-video-btn"
          onClick={onBack}
        >
          ← Back to Video
        </button>
      </div>
    </div>
  );
};

export default VideoInfoView;