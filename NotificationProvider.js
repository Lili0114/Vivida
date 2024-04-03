// NotificationProvider.js
import React, { createContext, useState, useRef } from 'react';
import { Animated } from 'react-native';
import ToastNotification from './Notification';

export const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
    const [showNotification, setShowNotification] = useState(false);
    const fadeAnim = useRef(new Animated.Value(1)).current;

    const show = () => {
        setShowNotification(true);
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 2000,
            useNativeDriver: true
        }).start(() => {
            setTimeout(() => {
                Animated.timing(fadeAnim, {
                    toValue: 0,
                    duration: 2000,
                    useNativeDriver: true
                }).start(() => setShowNotification(false));
            }, 3000);
        });
    };

    return (
        <NotificationContext.Provider value={{ show }}>
            {children}
            {showNotification && <ToastNotification fadeAnim={fadeAnim} />}
        </NotificationContext.Provider>
    );
};