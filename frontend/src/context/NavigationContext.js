import React, { createContext, useContext, useState } from 'react';

const NavigationContext = createContext(null);

export const NavigationProvider = ({ children }) => {
    const [activeTab, setActiveTab] = useState('feed');

    return (
        <NavigationContext.Provider value={{ activeTab, setActiveTab }}>
            {children}
        </NavigationContext.Provider>
    );
};

export const useNavigation = () => {
    const context = useContext(NavigationContext);
    if (!context) {
        throw new Error('useNavigation must be used within a NavigationProvider');
    }
    return context;
};
