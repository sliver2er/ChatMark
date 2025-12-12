import { ChatMarkSettings, DEFAULT_SETTINGS } from "@/types";

const SETTINGS_STORAGE_KEY = 'chatmark.settings';

/**
 * Get settings from storage
 */
export async function getSettings(): Promise<ChatMarkSettings> {
  return new Promise((resolve) => {
    chrome.storage.local.get([SETTINGS_STORAGE_KEY], (result) => {
      const settings = result[SETTINGS_STORAGE_KEY] || DEFAULT_SETTINGS;
      resolve(settings);
    });
  });
}

/**
 * Update settings in storage
 */
export async function updateSettings(settings: Partial<ChatMarkSettings>): Promise<ChatMarkSettings> {
  return new Promise((resolve) => {
    // Get current settings first
    chrome.storage.local.get([SETTINGS_STORAGE_KEY], (result) => {
      const currentSettings = result[SETTINGS_STORAGE_KEY] || DEFAULT_SETTINGS;
      const newSettings = { ...currentSettings, ...settings };

      chrome.storage.local.set({ [SETTINGS_STORAGE_KEY]: newSettings }, () => {
        resolve(newSettings);
      });
    });
  });
}
