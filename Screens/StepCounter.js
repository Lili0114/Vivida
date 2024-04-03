import React, { useState, useEffect } from 'react';
import { View, Text, Alert } from 'react-native';
import { accelerometer, setUpdateIntervalForType, SensorTypes } from "react-native-sensors";
import { map, filter } from "rxjs/operators";

const StepCounter = () => {
    const [steps, setSteps] = useState(0);

    useEffect(() => {
        setUpdateIntervalForType(SensorTypes.accelerometer, 400); // 100ms

        const subscription = accelerometer
            .pipe(map(({ x, y, z }) => x + y + z), filter(speed => speed > 15))
            .subscribe({
                next: speed => {
                    setSteps(prevSteps => prevSteps + 1);
                },
                error: error => {
                    console.log("The sensor is not available");
                }
            });

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    if (steps == 20) {
        Alert.alert("Gratulálok", "Már " + `${steps}` + " lépést megtettél, hajrá!", [
            {
                text: 'OK',
            }
        ]);
    }

    return (
        <View style={{ height: 200, alignItems: 'center', flex: 1, marginBottom: 20 }}>
            <Text style={{ fontSize: 22, color: 'white', fontWeight: 'bold', marginTop: 60, textAlign: 'center' }}>{steps} lépés</Text>
            <Text style={{ fontSize: 16, color: 'white', textAlign: 'center' }}>A mai nap megtett lépések száma</Text>
        </View>
    );
}

export default StepCounter;