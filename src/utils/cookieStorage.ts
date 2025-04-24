import { ProduceItem } from '../types';

// Cookie name for storing produce data
const PRODUCE_COOKIE_NAME = 'kisaan_produce_data';

/**
 * Loads produce data from cookies or returns the default data if no cookie exists
 * @param defaultData Default produce data to use if no cookie exists
 * @returns Array of ProduceItem objects
 */
export const initializeProduceData = (defaultData: ProduceItem[]): ProduceItem[] => {
  try {
    const cookieData = getCookie(PRODUCE_COOKIE_NAME);
    if (cookieData) {
      return JSON.parse(cookieData);
    }
    // If no cookie exists, save the default data to cookie and return it
    saveProduceToCookie(defaultData);
    return defaultData;
  } catch (error) {
    console.error("Error loading produce data from cookies:", error);
    return defaultData;
  }
};

/**
 * Save produce data to a cookie
 * @param produceData Array of ProduceItem objects to save
 */
export const saveProduceToCookie = (produceData: ProduceItem[]): void => {
  try {
    const serializedData = JSON.stringify(produceData);
    setCookie(PRODUCE_COOKIE_NAME, serializedData, 30); // Store for 30 days
  } catch (error) {
    console.error("Error saving produce data to cookies:", error);
  }
};

/**
 * Add a single produce item to the cookie storage
 * @param produceItem ProduceItem to add
 */
export const addProduceToCookie = (produceItem: ProduceItem): void => {
  try {
    const existingData = initializeProduceData([]);
    const updatedData = [...existingData, produceItem];
    saveProduceToCookie(updatedData);
  } catch (error) {
    console.error("Error adding produce item to cookies:", error);
  }
};

/**
 * Set a cookie with the specified name, value, and expiration days
 */
function setCookie(name: string, value: string, days: number): void {
  const date = new Date();
  date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
  const expires = `expires=${date.toUTCString()}`;
  document.cookie = `${name}=${value};${expires};path=/`;
}

/**
 * Get a cookie value by its name
 */
function getCookie(name: string): string | null {
  const cookieName = `${name}=`;
  const cookies = document.cookie.split(';');
  
  for (let i = 0; i < cookies.length; i++) {
    let cookie = cookies[i].trim();
    if (cookie.indexOf(cookieName) === 0) {
      return cookie.substring(cookieName.length, cookie.length);
    }
  }
  
  return null;
}