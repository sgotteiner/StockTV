'use client'

import { createContext, useContext, useState, useMemo, useCallback, ReactNode } from 'react'

interface MediaContextType {
    isMuted: boolean
    toggleMute: () => void
}

const MediaContext = createContext<MediaContextType | undefined>(undefined)

export function MediaProvider({ children }: { children: ReactNode }) {
    const [isMuted, setIsMuted] = useState(true)

    const toggleMute = useCallback(() => {
        setIsMuted(prev => !prev)
    }, [])

    const value = useMemo(() => ({ isMuted, toggleMute }), [isMuted, toggleMute])

    return (
        <MediaContext.Provider value={value}>
            {children}
        </MediaContext.Provider>
    )
}

export function useMedia() {
    const context = useContext(MediaContext)
    if (context === undefined) {
        throw new Error('useMedia must be used within MediaProvider')
    }
    return context
}
