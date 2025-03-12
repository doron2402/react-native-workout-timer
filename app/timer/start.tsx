import React, { useState } from 'react';
import { View, Text, StyleSheet, Platform, TouchableOpacity, Modal } from 'react-native';
import { useRouter } from 'expo-router';
import { Picker } from '@react-native-picker/picker';
import BackButton from '../../components/BackButton';

const TimerStartScreen = () => {
  const router = useRouter();
  const [sets, setSets] = useState('1');
  const [setDuration, setSetDuration] = useState('30');
  const [breakTime, setBreakTime] = useState('15');
  const [showSetsPicker, setShowSetsPicker] = useState(false);
  const [showSetDurationPicker, setShowSetDurationPicker] = useState(false);
  const [showBreakTimePicker, setShowBreakTimePicker] = useState(false);

  // Generate array of numbers from 1 to 20 for sets
  const setsOptions = Array.from({ length: 20 }, (_, i) => (i + 1).toString());

  // Generate time options from 15 seconds to 5 minutes (300 seconds) in 15-second intervals
  const timeOptions = Array.from({ length: 20 }, (_, i) => ((i + 1) * 15).toString());

  const formatTimeDisplay = (seconds: string) => {
    const secondsNum = parseInt(seconds, 10);
    const minutes = Math.floor(secondsNum / 60);
    const remainingSeconds = secondsNum % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const renderSetsPicker = () => {
    if (Platform.OS === 'ios') {
      return (
        <Modal
          animationType="slide"
          transparent={true}
          visible={showSetsPicker}
          onRequestClose={() => setShowSetsPicker(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Number of Sets</Text>
              <Picker
                selectedValue={sets}
                onValueChange={(itemValue: string) => setSets(itemValue)}
                style={styles.picker}
              >
                {setsOptions.map((num) => (
                  <Picker.Item key={num} label={num} value={num} />
                ))}
              </Picker>
              <TouchableOpacity
                style={styles.doneButton}
                onPress={() => setShowSetsPicker(false)}
              >
                <Text style={styles.doneButtonText}>Done</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      );
    }

    return showSetsPicker && (
      <Picker
        selectedValue={sets}
        onValueChange={(itemValue: string) => {
          setSets(itemValue);
          setShowSetsPicker(false);
        }}
        style={styles.picker}
      >
        {setsOptions.map((num) => (
          <Picker.Item key={num} label={num} value={num} />
        ))}
      </Picker>
    );
  };

  const renderTimePicker = (
    value: string,
    onChange: (seconds: string) => void,
    show: boolean,
    setShow: (show: boolean) => void,
    label: string
  ) => {
    if (Platform.OS === 'ios') {
      return (
        <Modal
          animationType="slide"
          transparent={true}
          visible={show}
          onRequestClose={() => setShow(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>{label}</Text>
              <Picker
                selectedValue={value}
                onValueChange={(itemValue: string) => onChange(itemValue)}
                style={styles.picker}
              >
                {timeOptions.map((seconds) => (
                  <Picker.Item
                    key={seconds}
                    label={formatTimeDisplay(seconds)}
                    value={seconds}
                  />
                ))}
              </Picker>
              <TouchableOpacity
                style={styles.doneButton}
                onPress={() => setShow(false)}
              >
                <Text style={styles.doneButtonText}>Done</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      );
    }

    return show && (
      <Picker
        selectedValue={value}
        onValueChange={(itemValue: string) => {
          onChange(itemValue);
          setShow(false);
        }}
        style={styles.picker}
      >
        {timeOptions.map((seconds) => (
          <Picker.Item
            key={seconds}
            label={formatTimeDisplay(seconds)}
            value={seconds}
          />
        ))}
      </Picker>
    );
  };

  return (
    <View style={styles.container}>
      <BackButton color="black" />
      <Text style={styles.title}>Set Your Timer</Text>

      <Text style={styles.label}>Number of Sets:</Text>
      <TouchableOpacity
        style={styles.timeButton}
        onPress={() => setShowSetsPicker(true)}
      >
        <Text style={styles.timeButtonText}>{sets} sets</Text>
      </TouchableOpacity>

      <Text style={styles.label}>Set Duration:</Text>
      <TouchableOpacity
        style={styles.timeButton}
        onPress={() => setShowSetDurationPicker(true)}
      >
        <Text style={styles.timeButtonText}>{formatTimeDisplay(setDuration)}</Text>
      </TouchableOpacity>

      <Text style={styles.label}>Break Time:</Text>
      <TouchableOpacity
        style={styles.timeButton}
        onPress={() => setShowBreakTimePicker(true)}
      >
        <Text style={styles.timeButtonText}>{formatTimeDisplay(breakTime)}</Text>
      </TouchableOpacity>

      {renderSetsPicker()}

      {renderTimePicker(
        setDuration,
        setSetDuration,
        showSetDurationPicker,
        setShowSetDurationPicker,
        'Set Duration'
      )}

      {renderTimePicker(
        breakTime,
        setBreakTime,
        showBreakTimePicker,
        setShowBreakTimePicker,
        'Break Time'
      )}

      <TouchableOpacity
        style={styles.startButton}
        onPress={() => router.push({
          pathname: '/timer/active',
          params: {
            sets,
            setDuration,
            breakTime
          }
        })}
      >
        <Text style={styles.startButtonText}>Start Timer</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    alignSelf: 'flex-start',
    marginLeft: '10%',
  },
  timeButton: {
    backgroundColor: '#f0f0f0',
    padding: 15,
    borderRadius: 8,
    width: '80%',
    marginBottom: 20,
  },
  timeButtonText: {
    fontSize: 18,
    textAlign: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  picker: {
    width: '100%',
    height: 200,
  },
  doneButton: {
    marginTop: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#007AFF',
    borderRadius: 8,
  },
  doneButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  startButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 8,
    width: '80%',
    marginTop: 20,
  },
  startButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default TimerStartScreen;