'use client'

interface SourceSelectorProps {
    uploadSource: 'youtube' | 'file' | 'url'
    setUploadSource: (source: 'youtube' | 'file' | 'url') => void
    isLoading: boolean
}

export default function SourceSelector({ uploadSource, setUploadSource, isLoading }: SourceSelectorProps) {
    return (
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
    )
}
