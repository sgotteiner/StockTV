'use client'

interface VideoInfoProps {
    title: string
    companyName?: string
}

export default function VideoInfo({ title, companyName }: VideoInfoProps) {
    return (
        <div className="video-info">
            <h3>{title}</h3>
            <p>🏢 {companyName}</p>
        </div>
    )
}
