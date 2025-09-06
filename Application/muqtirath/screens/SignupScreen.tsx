
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
  Login: undefined;
  Onboarding :undefined;
};

export default function SignupScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const {login}= useContext(AuthContext);

  const handleSignup = async () => {
  if (!phone || !password || !confirmPassword) {
    Alert.alert("Missing fields", "All fields are required");
    return;
  }

  if (password !== confirmPassword) {
    Alert.alert("Password mismatch", "Passwords do not match");
    return;
  }

  try {
    const res = await fetch(`${backendUrl}/user/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phoneNumber: phone, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      if (data.status === 400) {
        Toast.show({ type: "error", text1: "User already exists" });
      } else {
        Toast.show({ type: "error", text1: data.message || "Signup failed" });
      }
      return;
    }

    // Store user and token in AsyncStorage
    if (data.user && data.token) {
      await AsyncStorage.setItem("user", JSON.stringify(data.user));
      await AsyncStorage.setItem("userToken", data.token);
      await login(data.token); // update auth context
    }

    Toast.show({
      type: "success",
      text1: "Account created successfully",
    });

    // Navigate to onboarding
    navigation.navigate("Onboarding");

  } catch (err) {
    console.error("Signup failed:", err);
    Alert.alert("Signup Failed", "Could not reach the server. Try again later.");
  }
};


  return (
    <View className="flex-1 bg-black justify-center items-center px-6">
      <View className="bg-zinc-50 w-full max-w-sm rounded-lg p-8 border border-neutral-300 shadow-md">
        <Text className="text-2xl font-bold text-center text-black mb-6">
          Create Account
        </Text>

        <TextInput
          placeholder="Phone Number"
          value={phone}
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
          className="mb-4 px-4 py-3 border border-neutral-300 rounded-lg text-black bg-white"
        />

        <TextInput
          placeholder="Confirm Password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
          className="mb-6 px-4 py-3 border border-neutral-300 rounded-lg text-black bg-white"
        />

        <TouchableOpacity
          onPress={handleSignup}
          className="bg-black px-4 py-3 rounded-lg items-center justify-center mb-6"
        >
          <Text className="text-white font-semibold text-base">Sign up</Text>
        </TouchableOpacity>

        <View className="mt-6 flex-row justify-center">
          <Text className="text-gray-600">Already have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate("Login")}>
            <Text className="text-blue-600 font-medium">Login</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
