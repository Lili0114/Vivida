import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, Pressable } from 'react-native';
import { TouchableOpacity, GestureHandlerRootView } from 'react-native-gesture-handler';

const Stopwatch = () => {
  const [running, setRunning] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);

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

  const handleSave = () => {
    const timeInMinutes = (elapsedTime / (1000 * 60)).toFixed(1); //egy tizedesre kerekítve (float elapsedTime)
    console.log('Elapsed time:', timeInMinutes, 'minute(s)');
    // todo: adatbázisba menteni
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
          <Pressable style={styles.button}>
            <Text style={styles.buttonText} onPress={handleStartStop}>{running ? 'Pause' : 'Start'}</Text>
          </Pressable>
          <Pressable style={styles.button}>
            <Text style={styles.buttonText} onPress={handleReset}>Reset</Text>
          </Pressable>
          <Pressable style={styles.button}>
            <Text style={styles.buttonText} onPress={handleSave} disabled={running}>Stop</Text>
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
  },
  timer: {
    color: '#000000',
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
    borderRadius: 20,
    backgroundColor: 'violet',
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