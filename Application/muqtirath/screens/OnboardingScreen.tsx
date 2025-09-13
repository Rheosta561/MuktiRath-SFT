import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
} from "react-native";
import * as Location from "expo-location";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Picker } from "@react-native-picker/picker";
import { ArrowLeft, ArrowRight, Save } from "lucide-react-native";
import * as Progress from "react-native-progress";
import { useNavigation } from "expo-router";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import Constants from "expo-constants";
import Toast from "react-native-toast-message";
import { jwtDecode } from "jwt-decode";

// Constants
const interestsList = [
  "Marketing",
  "Language",
  "Spoken Skills",
  "Sewing",
  "Cooking",
  "Beauty",
  "Handicrafts",
  "Digital Literacy",
];
const stepImages = [
  "https://cdn-icons-png.flaticon.com/512/616/616408.png",
  "https://cdn-icons-png.flaticon.com/512/2966/2966486.png",
  "https://cdn-icons-png.flaticon.com/512/3468/3468086.png",
  "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
  "https://cdn-icons-png.flaticon.com/512/1006/1006543.png",
  "https://cdn-icons-png.flaticon.com/512/1828/1828640.png",
];
const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
const backendUrl = Constants.expoConfig?.extra?.backendUrl;

// Type definitions
interface Profile {
  name: string;
  bloodGroup: string;
  healthCondition: string;
  otherHealthCondition: string;
  interests: string[];
  aspiration: string;
  shortStory: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
}

type RootStackParamList = {
  Main: undefined;
  Login: undefined;
  Onboarding: undefined;
  Signup: undefined;
};

interface User {
  _id: string;
  phone: number;
  password: string;
  __v: number;
}

interface JwtPayloadWithUser {
  exp: number;
  iat: number;
  user: User;
}

export default function OnboardingScreen() {
  const [step, setStep] = useState(0);
  const [profile, setProfile] = useState<Profile>({
    name: "",
    bloodGroup: "",
    healthCondition: "",
    otherHealthCondition: "",
    interests: [],
    aspiration: "",
    shortStory: "",
    coordinates: {
      latitude: 0,
      longitude: 0,
    },
  });
  const [userId, setUserId] = useState<string | null>(null);
  const [otherDisease, setOtherDisease] = useState("");
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  // Fetch location
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.log("Permission denied");
        return;
      }
      let location = await Location.getCurrentPositionAsync({});
      setProfile((prev) => ({
        ...prev,
        coordinates: {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        },
      }));
    })();
  }, []);

  // Fetch userId from AsyncStorage
  useEffect(() => {
    (async () => {
      try {
        const token = await AsyncStorage.getItem("userToken");
        if (token) {
          const decoded = jwtDecode<JwtPayloadWithUser>(token);
          setUserId(decoded.user._id);
        }
      } catch (err) {
        console.error("Error decoding token:", err);
      }
    })();
  }, []);

  // Save profile to backend
  const saveProfile = async () => {
    if (!profile.name) {
      Toast.show({ type: "error", text1: "Validation Error", text2: "Name is required!" });
      return;
    }
    if (!profile.bloodGroup) {
      Toast.show({ type: "error", text1: "Validation Error", text2: "Please select your blood group!" });
      return;
    }
    if (!profile.aspiration) {
      Toast.show({ type: "error", text1: "Validation Error", text2: "Please enter your aspiration!" });
      return;
    }
    if (profile.healthCondition.toLowerCase() === "other" && !profile.otherHealthCondition) {
      Toast.show({ type: "error", text1: "Validation Error", text2: "Please specify your health condition!" });
      return;
    }

    try {
      if (!userId) {
        Toast.show({ type: "error", text1: "Error", text2: "User not authenticated!" });
        return;
      }

      const payload = {
        ...profile,
        userId, // include userId in the payload
      };

      if (payload.healthCondition.toLowerCase() === "other") {
        payload.otherHealthCondition = payload.otherHealthCondition || payload.healthCondition;
      }

      const res = await fetch(`${backendUrl}/user/createProfile`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const text = await res.text();
      console.log(text);
      let data;
      try {
        data = JSON.parse(text);
      } catch (e) {
        console.error("Response not JSON:", text);
        Toast.show({ type: "error", text1: "Server Error", text2: "Invalid response from server" });
        return;
      }

      if (!res.ok) {
        console.error("Failed to create profile:", data);
        Toast.show({ type: "error", text1: "Error", text2: data.message || "Failed to create profile" });
        return;
      }

      await AsyncStorage.setItem("userProfile", JSON.stringify(data.profile));
      Toast.show({ type: "success", text1: "Success", text2: "Profile created successfully!" });
      navigation.navigate("Main");
    } catch (err) {
      console.error("Error saving profile:", err);
      Toast.show({ type: "error", text1: "Error", text2: "Something went wrong" });
    }
  };

  const totalSteps = 6;
  const progress = (step + 1) / totalSteps;

  return (
    <View className="flex-1 bg-zinc-50 items-center justify-center px-5 py-10">
      <View className="w-full max-w-md border border-zinc-400 shadow-md rounded-md bg-white p-6">
        <View className="items-center mb-6">
          <Image
            source={require("../assets/images/muqtirath.png")}
            style={{ width: 100, height: 50 }}
            resizeMode="contain"
          />
        </View>

        <View className="items-center mb-6">
          <Progress.Bar progress={progress} width={250} height={10} color="#521094" unfilledColor="#e5e7eb" borderWidth={0} />
          <Text className="mt-2 text-sm text-gray-500">Step {step + 1} of {totalSteps}</Text>
        </View>

        <View className="items-center mb-6">
          <Image
            source={{ uri: stepImages[step] }}
            className="w-28 h-28 rounded-full"
            resizeMode="contain"
          />
        </View>

        <View>
          {step === 0 && (
            <View>
              <Text className="text-lg font-semibold text-gray-800 mb-3 text-center">Enter Your Name</Text>
              <TextInput
                placeholder="Full Name"
                value={profile.name}
                onChangeText={(text) => setProfile({ ...profile, name: text })}
                className="border border-gray-300 rounded-lg p-3 mb-3"
              />
            </View>
          )}
          {step === 1 && (
            <View>
              <Text className="text-lg font-semibold text-gray-800 mb-3 text-center">Select Blood Group</Text>
              <View className="border border-gray-300 rounded-lg">
                <Picker
                  selectedValue={profile.bloodGroup}
                  onValueChange={(value) => setProfile({ ...profile, bloodGroup: value })}
                >
                  {bloodGroups.map((bg) => (
                    <Picker.Item key={bg} label={bg} value={bg} />
                  ))}
                </Picker>
              </View>
            </View>
          )}
          {step === 2 && (
            <View>
              <Text className="text-lg font-semibold text-gray-800 mb-3 text-center">Any Health Disease?</Text>
              <TextInput
                placeholder="e.g., Diabetes, Asthma, Other"
                value={profile.healthCondition}
                onChangeText={(text) => setProfile({ ...profile, healthCondition: text })}
                className="border border-gray-300 rounded-lg p-3 mb-3"
              />
              {profile.healthCondition.toLowerCase() === "other" && (
                <TextInput
                  placeholder="Please specify"
                  value={otherDisease}
                  onChangeText={(text) => {
                    setOtherDisease(text);
                    setProfile({ ...profile, healthCondition: text });
                  }}
                  className="border border-gray-300 rounded-lg p-3"
                />
              )}
            </View>
          )}
          {step === 3 && (
            <View>
              <Text className="text-lg font-semibold text-gray-800 mb-3 text-center">Select Interests</Text>
              <FlatList
                data={interestsList}
                keyExtractor={(item) => item}
                numColumns={2}
                columnWrapperStyle={{ justifyContent: "space-between" }}
                renderItem={({ item }) => {
                  const isSelected = profile.interests.includes(item);
                  return (
                    <TouchableOpacity
                      onPress={() => {
                        const newInterests = isSelected
                          ? profile.interests.filter((i) => i !== item)
                          : [...profile.interests, item];
                        setProfile({ ...profile, interests: newInterests });
                      }}
                      className={`w-[48%] m-1 p-4 rounded-md items-center justify-center ${isSelected ? "bg-pink-900 border" : "bg-zinc-400 border-zinc-300"}`}
                    >
                      <Text className="text-white font-medium text-center">{item}</Text>
                    </TouchableOpacity>
                  );
                }}
              />
            </View>
          )}
          {step === 4 && (
            <View>
              <Text className="text-lg font-semibold text-gray-800 mb-3 text-center">What is your aspiration?</Text>
              <TextInput
                placeholder="e.g., Start a small business"
                value={profile.aspiration}
                onChangeText={(text) => setProfile({ ...profile, aspiration: text })}
                className="border border-gray-300 rounded-lg p-3 text-center"
              />
            </View>
          )}
          {step === 5 && (
            <View>
              <Text className="text-lg font-semibold text-gray-800 mb-3 text-center">Tell us your story</Text>
              <TextInput
                placeholder="Type your story here"
                value={profile.shortStory}
                onChangeText={(text) => setProfile({ ...profile, shortStory: text })}
                multiline
                className="border border-gray-300 rounded-lg p-3 min-h-[100px]"
              />
            </View>
          )}
          {step === 6 && (
            <View className="items-center">
              <Text className="text-lg font-semibold mb-3">Review & Save</Text>
              <TouchableOpacity onPress={saveProfile} className="flex-row items-center bg-blue-600 px-5 py-3 rounded-lg">
                <Save color="white" size={20} />
                <Text className="text-white ml-2 font-medium">Save Profile</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        <View className="flex-row justify-between mt-8">
          {step > 0 && (
            <TouchableOpacity onPress={() => setStep(step - 1)} className="p-3">
              <ArrowLeft size={28} color="black" />
            </TouchableOpacity>
          )}
          {step < totalSteps && (
            <TouchableOpacity onPress={() => setStep(step + 1)} className="p-3">
              <ArrowRight size={28} color="black" />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
}
