import React, { useState, useEffect } from 'react';
import { View, Text, Alert } from 'react-native';
import { accelerometer, setUpdateIntervalForType, SensorTypes } from "react-native-sensors";
import { map, filter } from "rxjs/operators";
import { showToast } from './Notification';
import { useNotificationsEnabled } from './NotificationsEnabledContext';

const StepCounter = () => {
    const [steps, setSteps] = useState(0);
    const { notificationsEnabled, setNotificationsEnabled } = useNotificationsEnabled();

    useEffect(() => {
        setUpdateIntervalForType(SensorTypes.accelerometer, 400); // 100ms

        const subscription = accelerometer
            .pipe(map(({ x, y, z }) => x + y + z), filter(speed => speed > 15))
            .subscribe({
                next: speed => {
                    setSteps(prevSteps => prevSteps + 1);
                },
                error: error => {
                    console.log(error);
                }
            });

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    if (steps == 20) {
        showToast('success', 'Gratulálok!', `Már ${steps} lépést megtettél, így tovább!`, 5000, notificationsEnabled);
    }
    
    if (steps == 100) {
        showToast('success', 'Gratulálok!', `Már ${steps} lépést megtettél, így tovább!`, 5000, notificationsEnabled);
    }

    return (
        <View style={{ height: 50, justifyContent: 'center', alignItems: 'center', flex: 1, marginBottom: 10, backgroundColor: '#0B0A0C' }}>
            <Text style={{ fontSize: 22, color: '#C5FE37', textAlign: 'center' }}>{steps} lépés</Text>
        </View>
    );
}

export default StepCounter;