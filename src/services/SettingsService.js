/**
 * Settings Service - Manages application settings in localStorage
 */
const SettingsService = {
  /**
   * Get the value of a specific setting
   * @param {string} key - The setting key
   * @param {any} defaultValue - Default value if setting doesn't exist
   * @return {any} The setting value
   */
  getSetting(key, defaultValue = null) {
    let settings = localStorage.getItem("lp_settings");

    if (settings) {
      settings = JSON.parse(settings);
      return key in settings ? settings[key] : defaultValue;
    }

    return defaultValue;
  },

  /**
   * Set a specific setting value
   * @param {string} key - The setting key
   * @param {any} value - The value to store
   */
  setSetting(key, value) {
    let settings = localStorage.getItem("lp_settings");

    if (settings) {
      settings = JSON.parse(settings);
      settings[key] = value;
    } else {
      settings = { [key]: value };
    }

    localStorage.setItem("lp_settings", JSON.stringify(settings));

    // Dispatch a custom event so components can react to setting changes
    window.dispatchEvent(new CustomEvent('lp_setting_changed', {
      detail: { key, value }
    }));
  },

  /**
   * Get all settings
   * @return {Object} All settings
   */
  getAllSettings() {
    const settings = localStorage.getItem("lp_settings");
    return settings ? JSON.parse(settings) : {};
  },

  /**
   * Reset all settings to their default values
   * @param {Object} defaultSettings - Optional default settings to use
   */
  resetSettings(defaultSettings = {}) {
    localStorage.setItem("lp_settings", JSON.stringify(defaultSettings));
    window.dispatchEvent(new CustomEvent('lp_settings_reset', {
      detail: { settings: defaultSettings }
    }));
  }
};

export default SettingsService;