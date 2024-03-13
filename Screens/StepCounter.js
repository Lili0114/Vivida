import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import {
    accelerometer,
    setUpdateIntervalForType,
    SensorTypes
} from "react-native-sensors";
import { map, filter } from "rxjs/operators";

const StepCounter = () => {
    const [steps, setSteps] = useState(0);

    useEffect(() => {
        setUpdateIntervalForType(SensorTypes.accelerometer, 400); // defaults to 100ms

        const subscription = accelerometer
            .pipe(map(({ x, y, z }) => x + y + z), filter(speed => speed > 20))
            .subscribe(
                speed => {
                    console.log(`You moved your phone with ${speed}`);
                    setSteps(prevSteps => prevSteps + 1);
                },
                error => {
                    console.log("The sensor is not available");
                }
            );

        return () => {
            // If it's the last subscription to accelerometer it will stop polling in the native API
            subscription.unsubscribe();
        };
    }, []);

    return (
        <View style={{ height: 200, alignItems: 'center', flex: 1, marginBottom: 30 }}>
            <Text style={{ fontSize: 22, color: 'white', fontWeight: 'bold', marginTop: 60, textAlign: 'center' }}>Lépésszámláló</Text>
            <Text style={{ fontSize: 16, color: 'white', textAlign: 'center' }}>{steps} lépés</Text>
        </View>
    );
}

export default StepCounter;