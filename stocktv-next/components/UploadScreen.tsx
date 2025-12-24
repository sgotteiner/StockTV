// Upload Screen Component - Based on React's components/UploadScreen.js
// Container for video upload functionality
// CLEAN: Orchestrates upload UI, uses hook for logic

'use client'

import { useUser } from '@/context/UserProvider'
import { useVideoUpload } from '@/hooks/useVideoUpload'
import UploadForm from './UploadForm'
import '../app/uploadStyles.css'

interface UploadScreenProps {
    onBack: () => void
}

/**
 * UploadScreen Component
 * Based on React's UploadScreen.js (33 lines)
 */
export default function UploadScreen({ onBack }: UploadScreenProps) {
    const { currentUser } = useUser()
    const uploadState = useVideoUpload(currentUser)

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
    )
}
