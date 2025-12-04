// Client-side localStorage utilities for saving user data

import { GlitchConfig } from '@/types/glitch';

const STORAGE_KEYS = {
  SAVED_PRESETS: 'kaleid_saved_presets',
  RECENT_CONFIGS: 'kaleid_recent_configs',
  USER_SETTINGS: 'kaleid_user_settings',
};

interface SavedPreset {
  id: string;
  name: string;
  config: GlitchConfig;
  createdAt: number;
  thumbnail?: string;
}

// Save a preset to localStorage
export function savePreset(name: string, config: GlitchConfig, thumbnail?: string): SavedPreset {
  const presets = getSavedPresets();
  const newPreset: SavedPreset = {
    id: `preset_${Date.now()}`,
    name,
    config,
    createdAt: Date.now(),
    thumbnail,
  };
  
  presets.unshift(newPreset);
  
  // Limit to 50 saved presets
  const limitedPresets = presets.slice(0, 50);
  localStorage.setItem(STORAGE_KEYS.SAVED_PRESETS, JSON.stringify(limitedPresets));
  
  return newPreset;
}

// Get all saved presets
export function getSavedPresets(): SavedPreset[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.SAVED_PRESETS);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error reading saved presets:', error);
    return [];
  }
}

// Delete a preset
export function deletePreset(id: string): void {
  const presets = getSavedPresets();
  const filtered = presets.filter(p => p.id !== id);
  localStorage.setItem(STORAGE_KEYS.SAVED_PRESETS, JSON.stringify(filtered));
}

// Update a preset
export function updatePreset(id: string, updates: Partial<SavedPreset>): void {
  const presets = getSavedPresets();
  const updated = presets.map(p => 
    p.id === id ? { ...p, ...updates } : p
  );
  localStorage.setItem(STORAGE_KEYS.SAVED_PRESETS, JSON.stringify(updated));
}

// Save recent config to history
export function saveRecentConfig(config: GlitchConfig): void {
  const recent = getRecentConfigs();
  recent.unshift({ config, timestamp: Date.now() });
  
  // Limit to 10 recent configs
  const limitedRecent = recent.slice(0, 10);
  localStorage.setItem(STORAGE_KEYS.RECENT_CONFIGS, JSON.stringify(limitedRecent));
}

// Get recent configs
export function getRecentConfigs(): Array<{ config: GlitchConfig; timestamp: number }> {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.RECENT_CONFIGS);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error reading recent configs:', error);
    return [];
  }
}

// Export all data for backup
export function exportAllData(): string {
  const data = {
    presets: getSavedPresets(),
    recent: getRecentConfigs(),
    version: '1.0',
    exportedAt: Date.now(),
  };
  return JSON.stringify(data, null, 2);
}

// Import data from backup
export function importData(jsonString: string): boolean {
  try {
    const data = JSON.parse(jsonString);
    if (data.presets) {
      localStorage.setItem(STORAGE_KEYS.SAVED_PRESETS, JSON.stringify(data.presets));
    }
    if (data.recent) {
      localStorage.setItem(STORAGE_KEYS.RECENT_CONFIGS, JSON.stringify(data.recent));
    }
    return true;
  } catch (error) {
    console.error('Error importing data:', error);
    return false;
  }
}

// Clear all saved data
export function clearAllData(): void {
  localStorage.removeItem(STORAGE_KEYS.SAVED_PRESETS);
  localStorage.removeItem(STORAGE_KEYS.RECENT_CONFIGS);
  localStorage.removeItem(STORAGE_KEYS.USER_SETTINGS);
}
