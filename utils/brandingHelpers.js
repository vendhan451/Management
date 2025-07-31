// Branding Settings Helpers
export function getBrandingSettings() {
  return JSON.parse(localStorage.getItem('brandingSettings') || '{}');
}

export function saveBrandingSettings(settings) {
  localStorage.setItem('brandingSettings', JSON.stringify(settings));
  if (settings.primaryColor) {
    document.documentElement.style.setProperty('--primary-color', settings.primaryColor);
  }
  if (settings.secondaryColor) {
    document.documentElement.style.setProperty('--secondary-color', settings.secondaryColor);
  }
}
