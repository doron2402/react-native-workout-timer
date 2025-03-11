import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import BackButton from '../../components/BackButton';

const TimerStartScreen = () => {
  const router = useRouter();
  const [sets, setSets] = useState('1');
  const [setDuration, setSetDuration] = useState('30');
  const [breakTime, setBreakTime] = useState('15');

  const handleSetChange = (value: string) => {
    // Remove non-numeric characters
    const numericValue = value.replace(/[^0-9]/g, '');
    // Ensure value is at least 1
    const finalValue = numericValue === '' ? '1' : Math.max(1, parseInt(numericValue)).toString();
    setSets(finalValue);
  };

  const handleDurationChange = (value: string) => {
    // Remove non-numeric characters
    const numericValue = value.replace(/[^0-9]/g, '');
    // Ensure value is at least 1 and at most 3600 (1 hour)
    const finalValue = numericValue === '' ? '1' : Math.min(3600, Math.max(1, parseInt(numericValue))).toString();
    setSetDuration(finalValue);
  };

  const handleBreakChange = (value: string) => {
    // Remove non-numeric characters
    const numericValue = value.replace(/[^0-9]/g, '');
    // Ensure value is at least 0 and at most 3600 (1 hour)
    const finalValue = numericValue === '' ? '0' : Math.min(3600, Math.max(0, parseInt(numericValue))).toString();
    setBreakTime(finalValue);
  };

  return (
    <View style={styles.container}>
      <BackButton color="black" />
      <Text style={styles.title}>Set Your Timer</Text>

      <Text>Number of Sets:</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={sets}
        onChangeText={handleSetChange}
        placeholder="Minimum 1 set"
      />

      <Text>Set Duration (seconds):</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={setDuration}
        onChangeText={handleDurationChange}
        placeholder="1-3600 seconds"
      />

      <Text>Break Time (seconds):</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={breakTime}
        onChangeText={handleBreakChange}
        placeholder="0-3600 seconds"
      />

      <Button
        title="Start Timer"
        onPress={() => router.push({
          pathname: '/timer/active',
          params: { sets, setDuration, breakTime }
        })}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    padding: 10,
    marginVertical: 10,
    width: '80%',
    textAlign: 'center',
  },
});

export default TimerStartScreen;