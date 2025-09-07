import SiteSettings from '../models/SiteSettings.js';

// Get all site settings
export const getSettings = async (req, res) => {
  try {
    const settings = await SiteSettings.getSettings();
    return res.status(200).json(settings);
  } catch (error) {
    console.error('Error fetching settings:', error);
    return res.status(500).json({ message: 'Failed to fetch settings', error: error.message });
  }
};

// Update site settings
export const updateSettings = async (req, res) => {
  try {
    const updatedSettings = await SiteSettings.updateSettings(req.body);
    return res.status(200).json(updatedSettings);
  } catch (error) {
    console.error('Error updating settings:', error);
    return res.status(500).json({ message: 'Failed to update settings', error: error.message });
  }
};

// Update service settings specifically
export const updateServiceSettings = async (req, res) => {
  try {
    const { showPrices, defaultPriceDisplay, maxServicesDisplay } = req.body;
    
    const settings = await SiteSettings.getSettings();
    settings.services = {
      ...settings.services,
      showPrices: showPrices !== undefined ? showPrices : settings.services.showPrices,
      defaultPriceDisplay: defaultPriceDisplay || settings.services.defaultPriceDisplay,
      maxServicesDisplay: maxServicesDisplay || settings.services.maxServicesDisplay
    };
    
    await settings.save();
    return res.status(200).json(settings);
  } catch (error) {
    console.error('Error updating service settings:', error);
    return res.status(500).json({ message: 'Failed to update service settings', error: error.message });
  }
};
