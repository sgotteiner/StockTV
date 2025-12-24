'use client'

import type { User } from '@/types'
import SourceSelector from './SourceSelector'

interface UploadFormProps {
    uploadSource: 'youtube' | 'file' | 'url'
    setUploadSource: (source: 'youtube' | 'file' | 'url') => void
    youtubeUrl: string
    setYoutubeUrl: (url: string) => void
    videoFile: File | null
    setVideoFile: (file: File | null) => void
    videoUrl: string
    setVideoUrl: (url: string) => void
    selectedCompany: string
    setSelectedCompany: (company: string) => void
    currentUser: User | null
    isLoading: boolean
    message: string
    error: string
    onSubmit: () => void
}

export default function UploadForm({
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
}: UploadFormProps) {
    const canSelectCompany = currentUser?.role === 'admin' || currentUser?.role === 'master_admin'
    const isCompanyUser = currentUser?.role === 'company'

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        onSubmit()
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) setVideoFile(file)
    }

    return (
        <form onSubmit={handleFormSubmit} className="upload-form">
            <SourceSelector
                uploadSource={uploadSource}
                setUploadSource={setUploadSource}
                isLoading={isLoading}
            />

            {uploadSource === 'youtube' && (
                <div className="form-group">
                    <label htmlFor="youtubeUrl">YouTube URL:</label>
                    <input
                        type="url"
                        id="youtubeUrl"
                        value={youtubeUrl}
                        onChange={(e) => setYoutubeUrl(e.target.value)}
                        placeholder="https://www.youtube.com/watch?v=..."
                        className="form-input"
                        disabled={isLoading}
                        required
                    />
                </div>
            )}

            {uploadSource === 'file' && (
                <div className="form-group">
                    <label htmlFor="videoFile">Video File:</label>
                    <input
                        type="file"
                        id="videoFile"
                        onChange={handleFileChange}
                        accept="video/*"
                        className="form-input"
                        disabled={isLoading}
                        required
                    />
                    {videoFile && <p className="file-name">Selected: {videoFile.name}</p>}
                </div>
            )}

            {uploadSource === 'url' && (
                <div className="form-group">
                    <label htmlFor="videoUrl">Video URL:</label>
                    <input
                        type="url"
                        id="videoUrl"
                        value={videoUrl}
                        onChange={(e) => setVideoUrl(e.target.value)}
                        placeholder="https://example.com/video.mp4"
                        className="form-input"
                        disabled={isLoading}
                        required
                    />
                </div>
            )}

            {canSelectCompany && (
                <div className="form-group">
                    <label htmlFor="company">Company:</label>
                    <input
                        type="text"
                        id="company"
                        value={selectedCompany}
                        onChange={(e) => setSelectedCompany(e.target.value)}
                        placeholder="Enter company name"
                        className="form-input"
                        disabled={isLoading}
                        required
                    />
                </div>
            )}

            {isCompanyUser && (
                <p className="info-text">Uploading as: {currentUser?.name}</p>
            )}

            <button type="submit" className="submit-button" disabled={isLoading}>
                {isLoading ? 'Uploading...' : 'Upload Video'}
            </button>

            {error && <div className="error-message">{error}</div>}
            {message && <div className="success-message">{message}</div>}
        </form>
    )
}
