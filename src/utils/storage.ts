import { ProduceItem } from '../types';

// Storage key for produce data in localStorage
const PRODUCE_STORAGE_KEY = 'kisaan_produce_data';

/**
 * Loads produce data from localStorage or returns the default data if no data exists
 * @param defaultData Default produce data to use if no stored data exists
 * @returns Array of ProduceItem objects
 */
export const initializeProduceData = (defaultData: ProduceItem[]): ProduceItem[] => {
  try {
    const storedData = localStorage.getItem(PRODUCE_STORAGE_KEY);
    if (storedData) {
      return JSON.parse(storedData);
    }
    // If no stored data exists, save the default data and return it
    saveProduceData(defaultData);
    return defaultData;
  } catch (error) {
    console.error("Error loading produce data from localStorage:", error);
    return defaultData;
  }
};

/**
 * Save produce data to localStorage
 * @param items Array of ProduceItem objects to save
 */
export const saveProduceData = (items: ProduceItem[]): void => {
  try {
    const serializedData = JSON.stringify(items);
    localStorage.setItem(PRODUCE_STORAGE_KEY, serializedData);
  } catch (error) {
    console.error("Error saving produce data to localStorage:", error);
  }
};

/**
 * Add a single produce item to the storage
 * @param produceItem ProduceItem to add
 */
export const addProduceToStorage = (produceItem: ProduceItem): void => {
  try {
    const existingData = initializeProduceData([]);
    const updatedData = [...existingData, produceItem];
    saveProduceData(updatedData);
  } catch (error) {
    console.error("Error adding produce item to localStorage:", error);
  }
};