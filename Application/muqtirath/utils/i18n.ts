// utils/i18n.ts
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';
import AsyncStorage from '@react-native-async-storage/async-storage';

const defaultLanguage = Localization.getLocales()[0]?.languageCode || 'en';

i18n.use(initReactI18next).init({
  resources: {}, // start with empty translations
  lng: defaultLanguage, // default language
  fallbackLng: 'en', // fallback if something goes wrong
  interpolation: {
    escapeValue: false,
  },
});

// Function to save chosen language
const saveLanguage = async (lang: string) => {
  await AsyncStorage.setItem('appLanguage', lang);
};

// Function to load language on app start
const loadLanguage = async () => {
  const lang = await AsyncStorage.getItem('appLanguage');
  if (lang) {
    i18n.changeLanguage(lang);
  }
};

export { i18n, saveLanguage, loadLanguage };
