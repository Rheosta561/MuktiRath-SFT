
import React, { useContext, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Alert,
} from "react-native";
import Toast from "react-native-toast-message";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import Constants from "expo-constants";

import { AuthContext } from "@/Context/AuthContext";

const backendUrl = Constants.expoConfig?.extra?.backendUrl;
type RootStackParamList = {
  Main: undefined;
  Signup: undefined;

};

export default function LoginScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [phoneNumber, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useContext(AuthContext);
  console.log(backendUrl);

  const handlePhoneLogin = async () => {
  if (!phoneNumber || !password) {
    Alert.alert("Missing fields", "Phone and password are required");
    return;
  }

  try {
    const res = await fetch(`${backendUrl}/user/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phoneNumber, password }),
    });

    const data = await res.json();

    // Handle different error cases
    if (!res.ok) {
      if (data.status === 400) {
        Toast.show({ type: "error", text1: "User not found" });
      } else if (data.status === 401) {
        Toast.show({ type: "error", text1: "Incorrect password" });
      } else {
        Toast.show({ type: "error", text1: data.message || "Login failed" });
      }
      return;
    }

    // Successful login
    await AsyncStorage.setItem("user", JSON.stringify(data.user));
    await AsyncStorage.setItem("userToken", data.token);

    // Update auth context
    await login(data.token);

    Toast.show({
      type: "success",
      text1: `Welcome back, ${data.user.name || "User"}`,
    });

    navigation.navigate("Main");
  } catch (err) {
    console.error("Phone login failed:", err);
    Alert.alert("Login Failed", "Could not reach the server. Try again later.");
  }
};


  return (
    <View className="flex-1 bg-black justify-center items-center px-6">
      <View className="bg-zinc-50 w-full max-w-sm rounded-lg p-8 border border-neutral-300 shadow-md">
        <Text className="text-2xl font-bold text-center text-black mb-6">
          Welcome 
        </Text>

        <TextInput
          placeholder="Phone Number"
          value={phoneNumber}
          onChangeText={setPhone}
          keyboardType="phone-pad"
          autoCapitalize="none"
          className="mb-4 px-4 py-3 border border-neutral-300 rounded-lg text-black bg-white"
        />

        <TextInput
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          className="mb-6 px-4 py-3 border border-neutral-300 rounded-lg text-black bg-white"
        />

        <TouchableOpacity
          onPress={handlePhoneLogin}
          className="bg-black px-4 py-3 rounded-lg items-center justify-center mb-6"
        >
          <Text className="text-white font-semibold text-base">Sign in</Text>
        </TouchableOpacity>

        <View className="mt-6 flex-row justify-center">
          <Text className="text-gray-600">New here? </Text>
          <TouchableOpacity onPress={() => navigation.navigate("Signup")}>
            <Text className="text-blue-600 font-medium">Sign up now</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
