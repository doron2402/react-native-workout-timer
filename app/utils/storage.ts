import AsyncStorage from '@react-native-async-storage/async-storage';

export interface TimerRecord {
  id: string;
  setDuration: string;
  breakTime: string;
  sets: string;
  date: string;
}

const STORAGE_KEY = '@timer_records';

export const saveTimerRecord = async (record: Omit<TimerRecord, 'id' | 'date'>) => {
  try {
    // Get existing records
    const existingRecords = await getTimerRecords();

    // Create new record with id and date
    const newRecord: TimerRecord = {
      ...record,
      id: Date.now().toString(),
      date: new Date().toISOString(),
    };

    // Add new record to the beginning of the array
    const updatedRecords = [newRecord, ...existingRecords];

    // Save to storage
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedRecords));

    return newRecord;
  } catch (error) {
    console.error('Error saving timer record:', error);
    throw error;
  }
};

export const getTimerRecords = async (): Promise<TimerRecord[]> => {
  try {
    const records = await AsyncStorage.getItem(STORAGE_KEY);
    return records ? JSON.parse(records) : [];
  } catch (error) {
    console.error('Error getting timer records:', error);
    return [];
  }
};

export const clearTimerRecords = async () => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing timer records:', error);
    throw error;
  }
};