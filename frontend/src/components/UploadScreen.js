import React from 'react';
import { useUser } from '../context/UserProvider';
import { useVideoUpload } from '../hooks/useVideoUpload';
import UploadForm from './UploadForm';
import '../styles/uploadStyles.css';

/**
 * UploadScreen Component
 * Container for video upload functionality
 */
const UploadScreen = ({ onBack }) => {
  const { currentUser } = useUser();
  const uploadState = useVideoUpload(currentUser);

  return (
    <div className="upload-screen">
      <div className="profile-header">
        <h2>Upload Video</h2>
        <button onClick={onBack} className="action-button" style={{ marginTop: 0 }}>
          ← Back
        </button>
      </div>

      <UploadForm
        {...uploadState}
        currentUser={currentUser}
        onSubmit={uploadState.handleSubmit}
      />
    </div>
  );
};

export default UploadScreen;