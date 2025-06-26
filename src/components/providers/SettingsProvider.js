import React, { createContext, useState, useEffect } from "react";
import SettingsService from "../../services/SettingsService";

export const SettingsContext = createContext();

export const SettingsProvider = ({ children }) => {
  // Initialize state from localStorage
  const [settings, setSettings] = useState(() => {
    return SettingsService.getAllSettings();
  });

  // Listen for settings changes from other components
  useEffect(() => {
    const handleSettingChange = (event) => {
      const { key, value } = event.detail;
      setSettings(prevSettings => ({
        ...prevSettings,
        [key]: value
      }));
    };

    window.addEventListener('lp_setting_changed', handleSettingChange);
    return () => {
      window.removeEventListener('lp_setting_changed', handleSettingChange);
    };
  }, []);

  // Create a function to update a setting
  const updateSetting = (key, value) => {
    SettingsService.setSetting(key, value);
    // State will be updated by the event listener
  };

  // Create specific getters/setters for commonly used settings
  const mimic = settings.mimic || false;
  const changeMimic = (value) => updateSetting('mimic', value);

  const showTags = settings.tags !== undefined ? settings.tags : true;
  const toggleTags = (value) => updateSetting('tags', value);

  const showAvatars = settings.avatars !== undefined ? settings.avatars : true;
  const toggleAvatars = (value) => updateSetting('avatars', value);

  return (
    <SettingsContext.Provider value={{
      // General settings access
      settings,
      updateSetting,

      // Specific settings with dedicated getters/setters
      mimic,
      changeMimic,
      showTags,
      toggleTags,
      showAvatars,
      toggleAvatars
    }}>
      {children}
    </SettingsContext.Provider>
  );
};