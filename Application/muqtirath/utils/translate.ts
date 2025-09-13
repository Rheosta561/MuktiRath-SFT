// utils/translate.ts
import { GoogleGenAI } from "@google/genai";
import Constants from "expo-constants";

const ai = new GoogleGenAI({
  apiKey: Constants.expoConfig?.extra?.GEMINI_API_KEY, // keep secret, use server-side if possible
});

/**
 * Translate text using Gemini AI
 * @param text - the text to translate
 * @param targetLang - target language code (e.g., "hi", "ta", "en")
 */
export const translateText = async (text: string, targetLang: string): Promise<string> => {
  try {
    const prompt = `Translate the following text to ${targetLang}. Return only the translated text with no quotes, no explanation, no extra formatting.\n\n${text}`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash", // or gemini-1.5-flash
      contents: prompt,
    });

    if (response.text) {
      return response.text.trim();
    } else {
      console.error("Gemini translation returned empty text:", response);
      return text;
    }
  } catch (error) {
    console.error("Gemini translation failed:", error);
    return text;
  }
};
