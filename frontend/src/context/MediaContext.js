import React, { createContext, useContext, useState } from 'react';

const MediaContext = createContext(null);

export const MediaProvider = ({ children }) => {
    const [isMuted, setIsMuted] = useState(true); // Default to muted for browser policy

    const toggleMute = () => {
        setIsMuted(prev => !prev);
    };

    return (
        <MediaContext.Provider value={{ isMuted, setIsMuted, toggleMute }}>
            {children}
        </MediaContext.Provider>
    );
};

export const useMedia = () => {
    const context = useContext(MediaContext);
    if (!context) {
        throw new Error('useMedia must be used within a MediaProvider');
    }
    return context;
};
