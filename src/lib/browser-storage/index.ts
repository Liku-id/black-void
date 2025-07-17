/* eslint-disable @typescript-eslint/no-explicit-any */
type StorageType = 'localStorage' | 'sessionStorage';

const isClient = typeof window !== 'undefined';

// Helper to access storage safely
const getStorage = (type: StorageType) => (isClient ? window[type] : null);

// Set value in storage
const setStorage = (type: StorageType, key: string, value: any): void => {
  try {
    const storage = getStorage(type);
    if (storage) {
      const storedValue =
        typeof value === 'string' ? value : JSON.stringify(value);
      storage.setItem(key, storedValue);
    }
  } catch (error) {
    console.error(`Error setting ${key} in ${type}:`, error);
  }
};

// Get value from storage
const getStorageValue = <T>(
  type: StorageType,
  key: string,
  dataType?: string
): T | null => {
  try {
    const storage = getStorage(type);
    const value = storage?.getItem(key);

    if (!value) return null;

    if (dataType === 'string') {
      return value as unknown as T;
    }

    return JSON.parse(value) as T;
  } catch (error) {
    console.error(`Error getting ${key} from ${type}:`, error);
    return null;
  }
};

// Remove value from storage
const removeStorage = (type: StorageType, key: string): void => {
  try {
    const storage = getStorage(type);
    storage?.removeItem(key);
  } catch (error) {
    console.error(`Error removing ${key} from ${type}:`, error);
  }
};

export const setLocalStorage = (key: string, value: any): void =>
  setStorage('localStorage', key, value);

export const getLocalStorage = <T>(
  key: string,
  dataType: string = 'string'
): T | null => getStorageValue<T>('localStorage', key, dataType);

export const removeLocalStorage = (key: string): void =>
  removeStorage('localStorage', key);

export const setSessionStorage = (key: string, value: any): void =>
  setStorage('sessionStorage', key, value);

export const getSessionStorage = <T>(key: string): T | null =>
  getStorageValue<T>('sessionStorage', key, 'string');

export const removeSessionStorage = (key: string): void =>
  removeStorage('sessionStorage', key);
