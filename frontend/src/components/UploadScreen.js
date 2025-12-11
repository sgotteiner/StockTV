import React, { useState, useEffect } from 'react';
import { useUser } from '../context/UserProvider';
import { uploadYouTubeVideo } from '../services/uploadApi';
import { fetchUsers } from '../services/adminApi'; // Reusing admin API to get company list
import '../styles/uploadStyles.css'; // Will create this stylesheet

const UploadScreen = ({ onBack }) => {
  const { currentUser } = useUser();
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [selectedCompany, setSelectedCompany] = useState('');
  const [companies, setCompanies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Load companies based on user role
  useEffect(() => {
    const loadCompanies = async () => {
      if (currentUser?.role === 'admin' || currentUser?.role === 'master_admin') {
        try {
          const users = await fetchUsers();
          // Get unique companies from user emails (domain part)
          const userCompanies = [...new Set(
            users
              .filter(user => user.role === 'company')
              .map(user => user.email.split('@')[1]?.split('.')[0] || 'unknown')
          )].map(company => ({
            id: company,
            name: company.charAt(0).toUpperCase() + company.slice(1)
          }));
          
          setCompanies(userCompanies);
          if (userCompanies.length > 0) {
            setSelectedCompany(userCompanies[0].id);
          }
        } catch (err) {
          console.error('Error loading companies:', err);
        }
      } else if (currentUser?.role === 'company') {
        // For company users, set their company to their user name
        const companyName = currentUser.name;
        setCompanies([{ id: companyName, name: companyName }]);
        setSelectedCompany(companyName);
      }
    };

    loadCompanies();
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
            <label htmlFor="companySelect">
              {isCompanyUser ? 'Your Company:' : 'Select Company:'}
            </label>
            {isCompanyUser ? (
              <div className="readonly-company">
                {selectedCompany ? selectedCompany.charAt(0).toUpperCase() + selectedCompany.slice(1) : 'Loading...'}
              </div>
            ) : (
              <select
                id="companySelect"
                value={selectedCompany}
                onChange={(e) => setSelectedCompany(e.target.value)}
                className="form-select"
                disabled={companies.length === 0}
              >
                {companies.map(company => (
                  <option key={company.id} value={company.id}>
                    {company.name}
                  </option>
                ))}
              </select>
            )}
            {companies.length === 0 && canSelectCompany && (
              <p className="no-companies-warning">No companies found. Create company accounts first.</p>
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