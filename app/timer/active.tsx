import React, { useState, useEffect } from 'react';
import { View, Text, Vibration, StyleSheet, Dimensions, TouchableOpacity, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Audio } from 'expo-av';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

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

  const handleReset = () => {
    Alert.alert(
      'Reset Timer',
      'Are you sure you want to reset the timer and return home?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: () => {
            // Stop any playing sounds
            if (breakStartSound) {
              breakStartSound.stopAsync();
            }
            if (breakEndSound) {
              breakEndSound.stopAsync();
            }
            // Navigate back to home
            router.replace('/');
          },
        },
      ]
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: isBreak ? '#4CAF50' : '#FF5252' }]}>
      <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
        <MaterialCommunityIcons name="restart" size={24} color="white" />
        <Text style={styles.resetText}>Reset</Text>
      </TouchableOpacity>

      {/* Progress Info */}
      <View style={styles.progressContainer}>
        <Text style={styles.title}>Set {currentSet} of {sets}</Text>
        <Text style={styles.subtitle}>
          {isBreak ? '🧘‍♂️ Break' : '💪 Workout'}
        </Text>
        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              {
                width: `${(timeLeft / (isBreak ? Number(breakTime) : Number(setDuration))) * 100}%`,
                backgroundColor: isBreak ? '#81C784' : '#FF8A80'
              }
            ]}
          />
        </View>
      </View>

      {/* Timer Display */}
      <View style={styles.timerContainer}>
        <Text style={styles.timerText}>{formatTime(timeLeft)}</Text>
        <Text style={styles.phaseText}>
          {isBreak ? '🧘‍♂️ Rest Time' : "💪 Let's Go!"}
        </Text>
      </View>

      {/* Time Info */}
      <View style={styles.timeInfoContainer}>
        <View style={styles.timeInfoBox}>
          <Text style={styles.timeInfoLabel}>Total Time</Text>
          <Text style={styles.timeInfoValue}>{formatTime(totalTimePassed)}</Text>
        </View>
        <View style={styles.timeInfoDivider} />
        <View style={styles.timeInfoBox}>
          <Text style={styles.timeInfoLabel}>Remaining</Text>
          <Text style={styles.timeInfoValue}>{formatTime(totalTimeLeft)}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 100,
  },
  progressContainer: {
    width: width * 0.9,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 15,
  },
  subtitle: {
    fontSize: 24,
    color: 'white',
    marginBottom: 15,
  },
  progressBar: {
    width: '100%',
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  timerContainer: {
    alignItems: 'center',
  },
  timerText: {
    fontSize: 80,
    fontWeight: 'bold',
    color: 'white',
    fontVariant: ['tabular-nums'],
  },
  phaseText: {
    fontSize: 24,
    color: 'white',
    marginTop: 10,
    fontWeight: '600',
  },
  timeInfoContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 15,
    padding: 20,
    width: width * 0.9,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  timeInfoBox: {
    alignItems: 'center',
    flex: 1,
  },
  timeInfoDivider: {
    width: 1,
    height: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    marginHorizontal: 15,
  },
  timeInfoLabel: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 16,
    marginBottom: 5,
  },
  timeInfoValue: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    fontVariant: ['tabular-nums'],
  },
  resetButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 8,
  },
  resetText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});

export default ActiveTimerScreen;