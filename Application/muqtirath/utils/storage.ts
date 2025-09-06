
import AsyncStorage from "@react-native-async-storage/async-storage";
import { UserProfile } from "@/constants";

const PROFILE_KEY = "user_profile";

export const saveProfile = async (profile: UserProfile) => {
  await AsyncStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
};

export const getProfile = async (): Promise<UserProfile | null> => {
  const data = await AsyncStorage.getItem(PROFILE_KEY);
  return data ? JSON.parse(data) : null;
};
