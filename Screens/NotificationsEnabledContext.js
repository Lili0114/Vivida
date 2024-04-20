import React, { createContext, useState, useContext } from 'react';

const NotificationsEnabledContext = createContext();

export function NotificationsEnabledProvider({ children }) {
    const [notificationsEnabled, setNotificationsEnabled] = useState(false);

    return (
        <NotificationsEnabledContext.Provider value={{ notificationsEnabled, setNotificationsEnabled }}>
            {children}
        </NotificationsEnabledContext.Provider>
    );
}

export function useNotificationsEnabled() {
    const context = useContext(NotificationsEnabledContext);
    if (context === undefined) {
        throw new Error('useNotificationsEnabled must be used within a NotificationsEnabledProvider');
    }
    return context;
}