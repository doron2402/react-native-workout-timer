import React, { useEffect } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BackButton from '../../components/BackButton';

const CompletionScreen = () => {
  const router = useRouter();
  const { sets, setDuration, breakTime } = useLocalSearchParams();

  const handleClose = () => {
    router.replace('/'); // Navigate back to home screen
  };

  // Function to save completed timer to AsyncStorage
  const saveToHistory = async () => {
    try {
      const newEntry = {
        number_of_sets: Number(sets),
        set_in_seconds: Number(setDuration),
        break_in_seconds: Number(breakTime),
        created_at: Date.now(),
      };

      const existingHistory = await AsyncStorage.getItem('timerHistory');
      const historyArray = existingHistory ? JSON.parse(existingHistory) : [];

      historyArray.push(newEntry);
      await AsyncStorage.setItem('timerHistory', JSON.stringify(historyArray));
    } catch (error) {
      console.error('Error saving history:', error);
    }
  };

  useEffect(() => {
    saveToHistory();
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: 'blue' }]}>
      <BackButton />
      <Text style={styles.timerText}>Set Completed!</Text>
      <Button title="Back to Timer" onPress={() => router.push('/timer/start')} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timerText: {
    fontSize: 50,
    fontWeight: 'bold',
    color: 'white',
  },
});

export default CompletionScreen;