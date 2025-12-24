'use client'

interface VideoControlsProps {
    likeCount: number
    isLiked: boolean
    isMuted: boolean
    onLike: () => void
    onMute: () => void
    onOptions: () => void
}

export default function VideoControls({
    likeCount,
    isLiked,
    isMuted,
    onLike,
    onMute,
    onOptions
}: VideoControlsProps) {
    const handleClick = (e: React.MouseEvent, callback: () => void) => {
        e.stopPropagation()
        callback()
    }

    return (
        <div className="video-controls">
            <button
                className="control-button"
                onClick={(e) => handleClick(e, onLike)}
            >
                <div className={`control-icon ${isLiked ? 'liked' : ''}`}>
                    {isLiked ? '♥' : '♡'}
                </div>
                <span className="control-text">{likeCount}</span>
            </button>

            <button
                className="control-button"
                onClick={(e) => handleClick(e, onMute)}
            >
                <div className="control-icon">
                    {isMuted ? '🔇' : '🔊'}
                </div>
            </button>

            <button
                className="control-button"
                onClick={(e) => handleClick(e, onOptions)}
            >
                <div className="control-icon">⋮</div>
            </button>
        </div>
    )
}
