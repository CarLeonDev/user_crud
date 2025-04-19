"use client";

import { useEffect, useState } from "react";

/**
 * A custom React hook for managing state in localStorage with synchronization across tabs/windows.
 * This hook provides a way to persist and sync data across browser tabs using localStorage.
 *
 * @template T - The type of the value to be stored in localStorage
 * @param {string} key - The key under which the value will be stored in localStorage
 * @param {T} value - The initial value to store. If no value exists in localStorage, this will be used.
 * @returns {[T, (newValue: T) => void]} A tuple containing:
 *   - The current stored value
 *   - A function to update the stored value
 */
export const useLocalStorage = <T>(
  key: string,
  value: T
): [T, (newValue: T) => void] => {
  // Initialize state with value from localStorage or fallback to provided value
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const stored = window.localStorage.getItem(key);
      return stored ? (JSON.parse(stored) as T) : value;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      // Fallback to provided value if localStorage is not available
      return value;
    }
  });

  /**
   * Updates the stored value in localStorage and triggers a storage event
   * @param {T} newValue - The new value to store. If null or undefined, the key will be removed.
   */
  const setValue = (newValue: T) => {
    try {
      if (newValue === null || newValue === undefined) {
        // Remove the key if the new value is null or undefined
        window.localStorage.removeItem(key);
        dispatchEvent(new StorageEvent("storage", { key }));
        return;
      }

      // Store the new value and trigger a storage event
      window.localStorage.setItem(key, JSON.stringify(newValue));
      dispatchEvent(new StorageEvent("storage", { key }));
    } catch (err) {
      console.error(err);
    }
  };

  /**
   * Handles storage events from other tabs/windows
   * @param {StorageEvent} e - The storage event object
   */
  const handleStorage = (e: StorageEvent) => {
    // Only update if the event is for our key
    if (e.key !== key) return;

    const stored = window.localStorage.getItem(key);
    setStoredValue(stored ? (JSON.parse(stored) as T) : value);
  };

  // Set up storage event listener for cross-tab synchronization
  useEffect(() => {
    window.addEventListener("storage", handleStorage);

    return () => window.removeEventListener("storage", handleStorage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return [storedValue, setValue] as const;
};
