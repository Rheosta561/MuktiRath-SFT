// hooks/useSpeechToText.ts
import { useState, useEffect } from "react";
import Voice, {
  SpeechResultsEvent,
  SpeechStartEvent,
} from "@react-native-voice/voice";

export const useSpeechToText = () => {
  const [started, setStarted] = useState(false);
  const [results, setResults] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Voice.onSpeechStart = (_e: SpeechStartEvent) => setStarted(true);
    Voice.onSpeechResults = (e: SpeechResultsEvent) =>
      setResults(e.value ?? []);
    Voice.onSpeechError = (e) => setError(e.error?.message ?? "Unknown error");

    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  const startRecording = async () => {
    try {
      await Voice.start("en-US");
      setResults([]);
      setError(null);
    } catch (e) {
      console.error("Error starting voice recognition", e);
    }
  };

  const stopRecording = async () => {
    try {
      await Voice.stop();
      setStarted(false);
    } catch (e) {
      console.error("Error stopping voice recognition", e);
    }
  };

  return { started, results, error, startRecording, stopRecording };
};
