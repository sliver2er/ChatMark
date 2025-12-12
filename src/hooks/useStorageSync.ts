import { useEffect, useCallback } from "react";

interface StorageSyncOptions {
  keyPattern: string;
  onChanged: (newValue: any) => void;
}

/**
 * Hook to sync component state with chrome.storage changes
 * Listens for storage changes matching the key pattern and triggers callback
 */
export const useStorageSync = ({ keyPattern, onChanged }: StorageSyncOptions) => {
  const handleStorageChange = useCallback(
    (changes: { [key: string]: chrome.storage.StorageChange }, areaName: string) => {
      // Only listen to local storage changes
      if (areaName !== "local") return;

      // Check if any changed key matches our pattern
      for (const key in changes) {
        if (key.includes(keyPattern)) {
          const newValue = changes[key].newValue;
          onChanged(newValue);
        }
      }
    },
    [keyPattern, onChanged]
  );

  useEffect(() => {
    chrome.storage.onChanged.addListener(handleStorageChange);

    return () => {
      chrome.storage.onChanged.removeListener(handleStorageChange);
    };
  }, [handleStorageChange]);
};
