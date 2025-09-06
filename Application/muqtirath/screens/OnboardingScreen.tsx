import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Image, Linking } from "react-native";
import * as Location from "expo-location";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";
import Toast from "react-native-toast-message";
import { useNavigation } from "expo-router";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Phone } from "lucide-react-native";
import { jwtDecode } from "jwt-decode";

const backendUrl = Constants.expoConfig?.extra?.backendUrl;

type RootStackParamList = {
  Main: undefined;
  Login: undefined;
  Onboarding: undefined;
  Signup: undefined;
};

interface JwtPayloadWithUser {
  exp: number;
  iat: number;
  user: { _id: string; phone: number; password: string; __v: number };
}

export default function VolunteerScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [userId, setUserId] = useState<string>();
  const [coordinates, setCoordinates] = useState<{ latitude: number; longitude: number }>({
    latitude: 0,
    longitude: 0,
  });

  // Fetch location and userId on mount
  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.log("Permission denied");
        return;
      }

      const token = await AsyncStorage.getItem("userToken");
      if (token) {
        const decoded = jwtDecode<JwtPayloadWithUser>(token);
        setUserId(decoded.user._id);
      }

      const location = await Location.getCurrentPositionAsync({});
      setCoordinates({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
    })();
  }, []);

  // Save profile automatically once we have userId and coordinates
  useEffect(() => {
    if (userId && coordinates.latitude && coordinates.longitude) {
      saveProfile();
    }
  }, [userId, coordinates]);

  const saveProfile = async () => {
    try {
      const payload = { userId, coordinates };
      const res = await fetch(`${backendUrl}/user/createProfile`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      console.log(data)

      if (!res.ok) {
        Toast.show({ type: "error", text1: "Error", text2: data.message || "Failed to create profile" });
        return;
      }

      await AsyncStorage.setItem("userProfile", JSON.stringify(data.profile));

      Toast.show({ type: "success", text1: "Success", text2: "Profile created successfully!" });
    } catch (err) {
      console.error(err);
      Toast.show({ type: "error", text1: "Error", text2: "Something went wrong" });
    }
  };

  // Call volunteer button
  const callVolunteer = async () => {
    try {
      const res = await fetch(`${backendUrl}/volunteer/call`, { method: "POST" });
      const data = await res.json();

      if (!res.ok) {
        Toast.show({ type: "error", text1: "Error", text2: data.message || "Failed to call volunteer" });
        return;
      }

      Toast.show({ type: "success", text1: "Success", text2: data.message || "Volunteer has been notified!" });
    } catch (err) {
      console.error(err);
      Toast.show({ type: "error", text1: "Error", text2: "Something went wrong" });
    }
  };

  return (
    <View className="flex-1 bg-zinc-50 items-center justify-center px-5 py-10">
      <View className="w-full max-w-md border border-zinc-400 shadow-md rounded-md bg-white p-6 items-center">
        {/* Logo */}
        <View className="items-center mb-8">
          <Image
            source={require("../assets/images/muqtirath.png")}
            style={{ width: 150, height: 75 }}
            resizeMode="contain"
          />
        </View>

        {/* Call Volunteer Button */}
        <TouchableOpacity
          onPress={callVolunteer}
          className="flex-row items-center bg-green-600 px-6 py-4 rounded-md"
        >
          <Phone color="white" size={24} />
          <Text className="text-white font-semibold text-lg ml-3">Call Volunteer</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
