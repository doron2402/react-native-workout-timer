import React, { useState, useEffect } from 'react';
import { View, Text, Vibration, StyleSheet } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Audio } from 'expo-av';
import BackButton from '../../components/BackButton';

const ActiveTimerScreen = () => {
  const router = useRouter();
  const { sets, setDuration, breakTime } = useLocalSearchParams();
  const [breakStartSound, setBreakStartSound] = useState<Audio.Sound | null>(null);
  const [breakEndSound, setBreakEndSound] = useState<Audio.Sound | null>(null);

  // Load sounds when component mounts
  useEffect(() => {
    const loadSounds = async () => {
      try {
        const { sound: startSound } = await Audio.Sound.createAsync(
          require('../../assets/sounds/break-start.mp3'),
          { shouldPlay: false }
        );
        setBreakStartSound(startSound);

        const { sound: endSound } = await Audio.Sound.createAsync(
          require('../../assets/sounds/break-end.mp3'),
          { shouldPlay: false }
        );
        setBreakEndSound(endSound);
      } catch (error) {
        console.error('Error loading sounds', error);
      }
    };

    loadSounds();

    // Cleanup sounds when component unmounts
    return () => {
      if (breakStartSound) {
        breakStartSound.unloadAsync();
      }
      if (breakEndSound) {
        breakEndSound.unloadAsync();
      }
    };
  }, []);

  const playBreakStartSound = async () => {
    try {
      if (breakStartSound) {
        await breakStartSound.replayAsync();
      }
    } catch (error) {
      console.error('Error playing break start sound', error);
    }
  };

  const playBreakEndSound = async () => {
    try {
      if (breakEndSound) {
        await breakEndSound.replayAsync();
      }
    } catch (error) {
      console.error('Error playing break end sound', error);
    }
  };

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
          router.replace('/timer/completion');
        } else {
          setIsBreak(false);
          setTimeLeft(Number(setDuration));
          setCurrentSet((prevSet) => prevSet + 1);
          playBreakEndSound(); // Play sound when break ends
          Vibration.vibrate();
        }
      } else {
        setIsBreak(true);
        setTimeLeft(Number(breakTime));
        playBreakStartSound(); // Play sound when break starts
        Vibration.vibrate();
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
        <Text style={styles.timeInfo}>Time Left: {Math.floor(totalTimeLeft / 60)}:{(totalTimeLeft % 60).toString().padStart(2, '0')}</Text>
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