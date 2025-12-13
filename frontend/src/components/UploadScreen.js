import React, { useState, useEffect } from 'react';
import { useUser } from '../context/UserProvider';
import { uploadYouTubeVideo } from '../services/uploadApi';
import '../styles/uploadStyles.css'; // Will create this stylesheet

const UploadScreen = ({ onBack }) => {
  const { currentUser } = useUser();
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [selectedCompany, setSelectedCompany] = useState('');
  const [companies, setCompanies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Set company name based on user role
  useEffect(() => {
    if (currentUser?.role === 'company') {
      // For company users, set their company to their user name
      setSelectedCompany(currentUser.name);
    } else if (currentUser?.role === 'admin' || currentUser?.role === 'master_admin') {
      // For admin users, initialize with empty string since they'll type company name
      setSelectedCompany('');
    } else {
      // For any other case (like user role), also set to empty
      setSelectedCompany('');
    }
  }, [currentUser]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!youtubeUrl) {
      setError('Please enter a YouTube URL');
      return;
    }

    // Validate YouTube URL format (including Shorts)
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com\/(watch\?v=|shorts\/)|youtu\.be\/)[a-zA-Z0-9_-]{11}(&.*)?$/;
    if (!youtubeRegex.test(youtubeUrl)) {
      setError('Please enter a valid YouTube URL');
      return;
    }

    setIsLoading(true);
    setError('');
    setMessage('');

    try {
      const result = await uploadYouTubeVideo(youtubeUrl, selectedCompany, currentUser.id);
      setMessage('Video uploaded successfully!');
      setYoutubeUrl('');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Determine if user can select a company
  const canSelectCompany = currentUser?.role === 'admin' || currentUser?.role === 'master_admin';
  const isCompanyUser = currentUser?.role === 'company';

  return (
    <div className="upload-screen">
      <div className="profile-header">
        <h2>Upload Video</h2>
        <button onClick={onBack} className="action-button" style={{ marginTop: 0 }}>
          ← Back
        </button>
      </div>

      <form onSubmit={handleSubmit} className="upload-form">
        <div className="form-group">
          <label htmlFor="youtubeUrl">YouTube URL:</label>
          <input
            type="text"
            id="youtubeUrl"
            value={youtubeUrl}
            onChange={(e) => setYoutubeUrl(e.target.value)}
            placeholder="Paste YouTube video URL here..."
            className="form-input"
          />
        </div>

        {(canSelectCompany || isCompanyUser) && (
          <div className="form-group">
            <label htmlFor="companyInput">
              {isCompanyUser ? 'Your Company:' : 'Company Name:'}
            </label>
            {isCompanyUser ? (
              <div className="readonly-company">
                {selectedCompany ? selectedCompany.charAt(0).toUpperCase() + selectedCompany.slice(1) : 'Loading...'}
              </div>
            ) : (
              <input
                type="text"
                id="companyInput"
                value={selectedCompany}
                onChange={(e) => setSelectedCompany(e.target.value)}
                placeholder="Enter company name"
                className="form-input"
              />
            )}
          </div>
        )}

        {currentUser?.role === 'user' && (
          <div className="permission-denied">
            <p>You don't have permission to upload videos. Only company accounts and administrators can upload.</p>
          </div>
        )}

        {currentUser?.role !== 'user' && (
          <button 
            type="submit" 
            className="action-button submit-button"
            disabled={isLoading || currentUser?.role === 'user'}
          >
            {isLoading ? 'Uploading...' : 'Download & Upload Video'}
          </button>
        )}

        {message && (
          <div className="success-message">
            {message}
          </div>
        )}

        {error && (
          <div className="error-message">
            Error: {error}
          </div>
        )}
      </form>
    </div>
  );
};

export default UploadScreen;