import React, { useState, useEffect } from 'react';
import { View, Text, Vibration, StyleSheet } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import BackButton from '../../components/BackButton';

const ActiveTimerScreen = () => {
  const router = useRouter();
  const { sets, setDuration, breakTime } = useLocalSearchParams();

  const [currentSet, setCurrentSet] = useState(1);
  const [timeLeft, setTimeLeft] = useState(Number(setDuration));
  const [isBreak, setIsBreak] = useState(false);

  // Calculate total workout time
  const totalTime = Number(sets) * (Number(setDuration) + Number(breakTime)) - Number(breakTime);
  const timePassedInCurrentPhase = isBreak ?
    Number(breakTime) - timeLeft :
    Number(setDuration) - timeLeft;
  const completedPhasesTime = (currentSet - 1) * (Number(setDuration) + Number(breakTime)) +
    (isBreak ? Number(setDuration) : 0);
  const totalTimePassed = completedPhasesTime + timePassedInCurrentPhase;
  const totalTimeLeft = totalTime - totalTimePassed;

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      if (isBreak) {
        if (currentSet >= Number(sets)) {
          router.replace('/timer/completion'); // Move to completion screen
        } else {
          setIsBreak(false);
          setTimeLeft(Number(setDuration));
          setCurrentSet((prevSet) => prevSet + 1);
        }
      } else {
        setIsBreak(true);
        setTimeLeft(Number(breakTime));
        Vibration.vibrate(); // Vibrate when entering break time
      }
    }
  }, [timeLeft, isBreak, currentSet]);

  return (
    <View style={[styles.container, { backgroundColor: isBreak ? 'green' : 'red' }]}>
      <BackButton />
      <Text style={styles.title}>Set {currentSet} of {sets}</Text>
      <Text style={styles.timerText}>{timeLeft}</Text>
      <Text style={styles.subtitle}>{isBreak ? 'Rest Time' : "It's Workout Time! Keep Pushing"}</Text>
      <View style={styles.timeInfoContainer}>
        <Text style={styles.timeInfo}>Time Passed: {Math.floor(totalTimePassed / 60)}:{(totalTimePassed % 60).toString().padStart(2, '0')}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  timerText: {
    fontSize: 50,
    fontWeight: 'bold',
    color: 'white',
  },
  subtitle: {
    fontSize: 18,
    color: 'white',
    marginTop: 10,
  },
  timeInfoContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  timeInfo: {
    fontSize: 16,
    color: 'white',
    marginVertical: 5,
  },
});

export default ActiveTimerScreen;