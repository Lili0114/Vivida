import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, Pressable, Alert } from 'react-native';
import { TouchableOpacity, GestureHandlerRootView } from 'react-native-gesture-handler';
import { collection, addDoc } from "firebase/firestore";
import { db, auth } from '../Services/firebase';
import { showToast } from './Notification';
import { useNotificationsEnabled } from './NotificationsEnabledContext';

const Stopwatch = () => {
  const [running, setRunning] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const { notificationsEnabled, setNotificationsEnabled } = useNotificationsEnabled();

  useEffect(() => {
    let intervalId;

    if (running) {
      const startTime = Date.now() - elapsedTime;

      intervalId = setInterval(() => {
        const currentTime = Date.now();
        setElapsedTime(currentTime - startTime);
      }, 30);
    } else {
      clearInterval(intervalId);
    }

    return () => clearInterval(intervalId);
  }, [running, elapsedTime]);

  const handleStartStop = () => {
    setRunning(!running);
  };

  const handleReset = () => {
    setRunning(false);
    setElapsedTime(0);
  };

  const handleSave = async () => {
    const timeInMinutes = parseFloat((elapsedTime / (1000 * 60)).toFixed(1));
    
    const workoutsCollection = collection(db, 'workouts');
    const workoutSession = {
      user_id: auth.currentUser.uid,
      elapsed_minutes: timeInMinutes,
      date: new Date()
    };

    try {
      showToast('success', 'Edzés befejezve!', '', 4000, notificationsEnabled );
      await addDoc(workoutsCollection, workoutSession);
      setElapsedTime(0);
    } catch (error) {
      console.log(error);
    }

  };  

  const formatTime = () => {
    const hours = Math.floor(elapsedTime / (1000 * 60 * 60));
    const minutes = Math.floor((elapsedTime % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((elapsedTime % (1000 * 60)) / 1000);
    const millis = Math.floor((elapsedTime % 1000) / 10);
  
    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}.${pad(millis)}`;
  };
  
  const pad = (number) => {
    return number < 10 ? '0' + number : number;
  };


  return (
    <View style={styles.container}>
      <Text style={styles.timer}>{formatTime(elapsedTime)}</Text>
      <View style={styles.buttonContainer}>
        <GestureHandlerRootView>
        <View style={styles.buttonRow}>
          <Pressable style={styles.button} onPress={handleStartStop}>
            <Text style={styles.buttonText}>{running ? 'Megállít' : 'Indít'}</Text>
          </Pressable>
          <Pressable style={styles.button} onPress={handleReset}>
            <Text style={styles.buttonText}>Újraindít</Text>
          </Pressable>
          <Pressable style={styles.button} onPress={handleSave} disabled={running}>
            <Text style={styles.buttonText}>Befejez</Text>
          </Pressable>
        </View>
        </GestureHandlerRootView>
      </View>
    </View>
  );
};

export default Stopwatch;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0B0A0C'
  },
  timer: {
    color: '#FFF',
    fontSize: 64,
    fontWeight: '200',
    marginBottom: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    width: '90%',
    alignSelf: 'center',
  },
  button: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 40,
    borderWidth: 1,
    borderColor: '#C5FE37',
  },
  buttonText: {
    fontSize: 14,
    color: '#FFFFFF'
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    alignSelf: 'center',
  },

});