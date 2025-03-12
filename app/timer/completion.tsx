import React, { useEffect } from 'react';
import { View, Text, Button, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { saveTimerRecord } from '../utils/storage';

const CompletionScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams<{
    sets: string;
    setDuration: string;
    breakTime: string;
  }>();

  useEffect(() => {
    // Save the completed timer record
    saveTimerRecord({
      sets: params.sets,
      setDuration: params.setDuration,
      breakTime: params.breakTime,
    });
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: 'blue' }]}>
      <Text style={styles.timerText}>Set Completed!</Text>
      <TouchableOpacity
        style={[styles.button, styles.backToHome]}
        onPress={() => router.replace('/')}
      >
        <Text style={styles.buttonText}>Back to Home</Text>
      </TouchableOpacity>
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
  button: {
    backgroundColor: '#FF5252',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  backToHome: {
    padding: 30
  }
});

export default CompletionScreen;