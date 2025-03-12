import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  Platform,
  StatusBar,
} from 'react-native';
import { getTimerRecords, clearTimerRecords, TimerRecord } from './utils/storage';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function History() {
  const [records, setRecords] = useState<TimerRecord[]>([]);

  const loadRecords = async () => {
    const timerRecords = await getTimerRecords();
    setRecords(timerRecords);
  };

  useEffect(() => {
    loadRecords();
  }, []);

  const formatTime = (seconds: string) => {
    const mins = Math.floor(parseInt(seconds) / 60);
    const secs = parseInt(seconds) % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleClearHistory = () => {
    Alert.alert(
      'Clear History',
      'Are you sure you want to clear all timer records?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: async () => {
            await clearTimerRecords();
            setRecords([]);
          },
        },
      ]
    );
  };

  const renderItem = ({ item }: { item: TimerRecord }) => (
    <View style={styles.recordItem}>
      <View style={styles.recordHeader}>
        <MaterialCommunityIcons name="timer-outline" size={20} color="#FF5252" />
        <Text style={styles.date}>{formatDate(item.date)}</Text>
      </View>
      <View style={styles.recordDetails}>
        <View style={styles.detailItem}>
          <Text style={styles.label}>Sets</Text>
          <View style={styles.valueContainer}>
            <MaterialCommunityIcons name="repeat" size={16} color="#666" />
            <Text style={styles.value}>{item.sets}</Text>
          </View>
        </View>
        <View style={styles.detailItem}>
          <Text style={styles.label}>Duration</Text>
          <View style={styles.valueContainer}>
            <MaterialCommunityIcons name="clock-outline" size={16} color="#666" />
            <Text style={styles.value}>{formatTime(item.setDuration)}</Text>
          </View>
        </View>
        <View style={styles.detailItem}>
          <Text style={styles.label}>Break</Text>
          <View style={styles.valueContainer}>
            <MaterialCommunityIcons name="coffee-outline" size={16} color="#666" />
            <Text style={styles.value}>{formatTime(item.breakTime)}</Text>
          </View>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Workout History</Text>
          {records.length > 0 && (
            <TouchableOpacity
              style={styles.clearButtonContainer}
              onPress={handleClearHistory}
            >
              <MaterialCommunityIcons name="delete-outline" size={20} color="#FF5252" />
              <Text style={styles.clearButton}>Clear All</Text>
            </TouchableOpacity>
          )}
        </View>
        {records.length === 0 ? (
          <View style={styles.emptyContainer}>
            <MaterialCommunityIcons name="timer-off-outline" size={80} color="#ccc" />
            <Text style={styles.emptyTitle}>No Workouts Yet</Text>
            <Text style={styles.emptyText}>
              Complete your first workout to see it here!
            </Text>
          </View>
        ) : (
          <FlatList
            data={records}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    backgroundColor: '#fff',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  clearButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  clearButton: {
    color: '#FF5252',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 4,
  },
  listContainer: {
    padding: 16,
  },
  recordItem: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  recordHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  date: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
  },
  recordDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailItem: {
    alignItems: 'center',
    flex: 1,
  },
  valueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  label: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  value: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginLeft: 4,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
  },
});

