// utils/translationLoader.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import { i18n } from './i18n';
import { translateText } from './translate';

const TRANSLATION_STORAGE_KEY = 'translations';

export const loadTranslations = async (targetLang: string, texts: string[]) => {
  try {
    const stored = await AsyncStorage.getItem(TRANSLATION_STORAGE_KEY);
    const cache = stored ? JSON.parse(stored) : {};

    if (!cache[targetLang]) {
      cache[targetLang] = {};
    }

    for (const text of texts) {
      if (!cache[targetLang][text]) {
        const translated = await translateText(text, targetLang);
        cache[targetLang][text] = translated;
      }
    }

    await AsyncStorage.setItem(TRANSLATION_STORAGE_KEY, JSON.stringify(cache));

    i18n.addResources(targetLang, 'translation', cache[targetLang]);
    i18n.changeLanguage(targetLang);

  } catch (error) {
    console.error('Error loading translations:', error);
  }
};
