import { useContext } from 'react';
import { SettingsContext } from '../components/providers/SettingsProvider';
import SettingsService from '../services/SettingsService';

/**
 * Custom hook for accessing and modifying application settings
 */
export const useSettings = () => {
  const context = useContext(SettingsContext);

  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }

  // Add direct access to SettingsService for components that can't access context
  return {
    ...context,

    // Additional utility functions
    getSetting: SettingsService.getSetting,
    setSetting: SettingsService.setSetting,
    getAllSettings: SettingsService.getAllSettings,
    resetSettings: SettingsService.resetSettings
  };
};