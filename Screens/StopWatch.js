import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

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
    const timeInMinutes = Math.ceil(elapsedTime / (1000 * 60)); //kerekítés
    console.log('Elapsed time:', timeInMinutes, 'minutes');
    // todo: adatbázisba menteni
  };

  return (
    <View style={styles.container}>
      <Text style={styles.timer}>{formatTime(elapsedTime)}</Text>
      <View style={styles.buttonContainer}>
        <Button title={running ? 'Stop' : 'Start'} onPress={handleStartStop} />
        <Button title="Reset" onPress={handleReset} />
        <Button title="Save" onPress={handleSave} />
      </View>
    </View>
  );
};

const formatTime = (milliseconds) => {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const millis = Math.floor((milliseconds % 1000) / 10);

  return `${pad(minutes)}:${pad(seconds)}.${pad(millis)}`;
};

const pad = (number) => {
  return number < 10 ? '0' + number : number;
};

export default Stopwatch;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timer: {
    fontSize: 24,
    marginBottom: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '80%',
  },
});