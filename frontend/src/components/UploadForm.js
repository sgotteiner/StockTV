import React from 'react';
import { ROLES } from '../constants';

/**
 * UploadForm Component
 * Multi-source video upload form (YouTube, File, URL)
 */
const UploadForm = ({
    uploadSource,
    setUploadSource,
    youtubeUrl,
    setYoutubeUrl,
    videoFile,
    setVideoFile,
    videoUrl,
    setVideoUrl,
    selectedCompany,
    setSelectedCompany,
    currentUser,
    isLoading,
    message,
    error,
    onSubmit
}) => {
    const canSelectCompany = currentUser?.role === ROLES.ADMIN || currentUser?.role === ROLES.MASTER_ADMIN;
    const isCompanyUser = currentUser?.role === ROLES.COMPANY;
    const isRegularUser = currentUser?.role === ROLES.USER;

    const handleFormSubmit = (e) => {
        e.preventDefault();
        onSubmit();
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setVideoFile(file);
        }
    };

    return (
        <form onSubmit={handleFormSubmit} className="upload-form">
            {/* Upload Source Selector */}
            <div className="form-group">
                <label>Upload Source:</label>
                <div className="source-selector">
                    <button
                        type="button"
                        className={`source-button ${uploadSource === 'youtube' ? 'active' : ''}`}
                        onClick={() => setUploadSource('youtube')}
                        disabled={isLoading}
                    >
                        📺 YouTube
                    </button>
                    <button
                        type="button"
                        className={`source-button ${uploadSource === 'file' ? 'active' : ''}`}
                        onClick={() => setUploadSource('file')}
                        disabled={isLoading}
                    >
                        📁 File
                    </button>
                    <button
                        type="button"
                        className={`source-button ${uploadSource === 'url' ? 'active' : ''}`}
                        onClick={() => setUploadSource('url')}
                        disabled={isLoading}
                    >
                        🔗 URL
                    </button>
                </div>
            </div>

            {/* YouTube URL Input */}
            {uploadSource === 'youtube' && (
                <div className="form-group">
                    <label htmlFor="youtubeUrl">YouTube URL:</label>
                    <input
                        type="text"
                        id="youtubeUrl"
                        value={youtubeUrl}
                        onChange={(e) => setYoutubeUrl(e.target.value)}
                        placeholder="Paste YouTube video URL here..."
                        className="form-input"
                        disabled={isLoading}
                    />
                </div>
            )}

            {/* File Upload Input */}
            {uploadSource === 'file' && (
                <div className="form-group">
                    <label htmlFor="videoFile">Video File:</label>
                    <input
                        type="file"
                        id="videoFile"
                        accept="video/mp4,video/webm,video/ogg,video/quicktime"
                        onChange={handleFileChange}
                        className="form-input"
                        disabled={isLoading}
                    />
                    {videoFile && (
                        <small style={{ color: '#666', marginTop: '5px', display: 'block' }}>
                            Selected: {videoFile.name} ({(videoFile.size / 1024 / 1024).toFixed(2)} MB)
                        </small>
                    )}
                    <small style={{ color: '#666', fontSize: '12px', marginTop: '5px', display: 'block' }}>
                        Supported formats: MP4, WebM, OGG, MOV (Max 100MB)
                    </small>
                </div>
            )}

            {/* Video URL Input */}
            {uploadSource === 'url' && (
                <div className="form-group">
                    <label htmlFor="videoUrl">Video URL:</label>
                    <input
                        type="text"
                        id="videoUrl"
                        value={videoUrl}
                        onChange={(e) => setVideoUrl(e.target.value)}
                        placeholder="https://example.com/video.mp4"
                        className="form-input"
                        disabled={isLoading}
                    />
                    <small style={{ color: '#666', fontSize: '12px', marginTop: '5px', display: 'block' }}>
                        Direct link to video file (must end with .mp4, .webm, .ogg, or .mov)
                    </small>
                </div>
            )}

            {/* Company Selection */}
            {(canSelectCompany || isCompanyUser) && (
                <div className="form-group">
                    <label htmlFor="companyInput">
                        {isCompanyUser ? 'Your Company:' : 'Company Name:'}
                    </label>
                    {isCompanyUser ? (
                        <div className="readonly-company">
                            {selectedCompany ?
                                selectedCompany.charAt(0).toUpperCase() + selectedCompany.slice(1) :
                                'Loading...'
                            }
                        </div>
                    ) : (
                        <input
                            type="text"
                            id="companyInput"
                            value={selectedCompany}
                            onChange={(e) => setSelectedCompany(e.target.value)}
                            placeholder="Enter company name"
                            className="form-input"
                            disabled={isLoading}
                        />
                    )}
                </div>
            )}

            {/* Permission Denied Message */}
            {isRegularUser && (
                <div className="permission-denied">
                    <p>You don't have permission to upload videos. Only company accounts and administrators can upload.</p>
                </div>
            )}

            {/* Submit Button */}
            {!isRegularUser && (
                <button
                    type="submit"
                    className="action-button submit-button"
                    disabled={isLoading}
                >
                    {isLoading ? 'Uploading...' : 'Upload Video'}
                </button>
            )}

            {/* Messages */}
            {message && (
                <div className="success-message">{message}</div>
            )}

            {error && (
                <div className="error-message">Error: {error}</div>
            )}
        </form>
    );
};

export default UploadForm;
