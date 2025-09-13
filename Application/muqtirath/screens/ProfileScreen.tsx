import React, { useEffect, useState, useContext } from "react";
import { View, TextInput, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from "react-native";
import { Text } from "@/components/AutoTranslateText";
import { Picker } from "@react-native-picker/picker";
import Toast from "react-native-toast-message";
import Constants from "expo-constants";
import NavLayout from "@/components/NavLayout";
import * as Location from "expo-location";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AuthContext } from "@/Context/AuthContext";
import { jwtDecode } from "jwt-decode";

const backendUrl = Constants.expoConfig?.extra?.backendUrl;

const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

const mockProfile = {
  name: "Rani",
  bloodGroup: "Null",
  healthCondition: "Healthy",
  otherHealthCondition: "",
  interests: ["Sewing", ""],
  aspiration: "To learn and grow",
  shortStory: "",
  coordinates: { latitude: 28.6139, longitude: 77.209 },
};

const ProfileScreen = () => {
  const [profile, setProfile] = useState<any>(mockProfile);
  const [loading, setLoading] = useState(true);
  const { logout } = useContext(AuthContext);
  const [userId, setUserId] = useState<string | null>(null);

  // Load userId and fetch profile
  useEffect(() => {
   const loadProfile = async () => {
  try {
    const token = await AsyncStorage.getItem("userToken");
    if (token) {
      const decoded = jwtDecode<{ user: { _id: string } }>(token);
      const userId = decoded.user._id;
      console.log("Decoded userId:", userId);
      setUserId(userId);

      // Retrieve the profile from AsyncStorage
      const storedProfile = await AsyncStorage.getItem("userProfile");
      if (storedProfile) {
        const parsedProfile = JSON.parse(storedProfile);
        const profileId = parsedProfile._id;
        console.log("Profile ID from AsyncStorage:", profileId);

        const res = await fetch(`${backendUrl}/user/getProfile/${profileId}`);
        if (res.ok) {
          const data = await res.json();
          setProfile(data.profile);
        } else {
          console.warn("Failed to load profile from backend");
        }
      } else {
        console.warn("Profile not found in AsyncStorage");
      }
    }
  } catch (error) {
    console.error("Error loading profile:", error);
  } finally {
    setLoading(false);
  }
};


    loadProfile();
  }, []);

  // Real-time location watcher
  useEffect(() => {
    let subscription: any;

    const startWatching = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.warn("Permission denied for location");
        return;
      }

      subscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 2000,
          distanceInterval: 1,
        },
        (location) => {
          setProfile((prev: any) => ({
            ...prev,
            coordinates: {
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
            },
          }));
        }
      );
    };

    startWatching();
    return () => subscription && subscription.remove();
  }, []);

const handleSaveProfile = async () => {
  if (!profile.name || !profile.bloodGroup || !profile.healthCondition || !profile.aspiration) {
    Alert.alert("Missing Fields", "Please fill all required fields");
    return;
  }

  try {
    setLoading(true);
    const res = await fetch(`${backendUrl}/user/updateProfile`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...profile,
        interests: Array.isArray(profile.interests)
          ? profile.interests
          : typeof profile.interests === "string"
          ? profile.interests.split(",").map((i: string) => i.trim())
          : [],
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      Toast.show({
        type: "error",
        text1: data.error || data.message || "Failed to save profile",
      });
      return;
    }

    Toast.show({
      type: "success",
      text1: "Profile updated successfully!",
    });
  } catch (error) {
    console.error("Profile save failed:", error);
    Alert.alert("Error", "Could not reach server");
  } finally {
    setLoading(false);
  }
};


  if (loading) {
    return (
      <NavLayout>
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="black" />
        </View>
      </NavLayout>
    );
  }

  return (
    <NavLayout>
      <ScrollView className="p-4 pb-20">
        <Text className="text-xl font-bold mb-4">My Profile</Text>

        {/* Name */}
        <Text className="mb-2 font-semibold">Name</Text>
        <Text className="mb-4 px-4 py-3 border border-neutral-300 rounded-lg bg-neutral-100 text-black">
          {profile.name}
        </Text>

        {/* Blood Group */}
        <Text className="mb-2">Blood Group</Text>
        <View className="border border-neutral-300 rounded-lg mb-4">
          <Picker
            selectedValue={profile.bloodGroup}
            onValueChange={(val) => setProfile({ ...profile, bloodGroup: val })}
          >
            {bloodGroups.map((group) => (
              <Picker.Item key={group} label={group} value={group} />
            ))}
          </Picker>
        </View>

        {/* Health Condition */}
        <TextInput
          placeholder="Health Condition"
          value={profile.healthCondition}
          onChangeText={(val) => setProfile({ ...profile, healthCondition: val })}
          className="mb-4 px-4 py-3 border border-neutral-300 rounded-lg text-black bg-white"
        />

        {/* Other Health Condition */}
        <TextInput
          placeholder="Other Health Condition (Optional)"
          value={profile.otherHealthCondition}
          onChangeText={(val) => setProfile({ ...profile, otherHealthCondition: val })}
          className="mb-4 px-4 py-3 border border-neutral-300 rounded-lg text-black bg-white"
        />

        {/* Interests */}
        <TextInput
          placeholder="Interests (comma separated)"
          value={Array.isArray(profile.interests) ? profile.interests.join(", ") : profile.interests}
          onChangeText={(val) => setProfile({ ...profile, interests: val })}
          className="mb-4 px-4 py-3 border border-neutral-300 rounded-lg text-black bg-white"
        />

        {/* Aspiration */}
        <TextInput
          placeholder="Aspiration"
          value={profile.aspiration}
          onChangeText={(val) => setProfile({ ...profile, aspiration: val })}
          className="mb-4 px-4 py-3 border border-neutral-300 rounded-lg text-black bg-white"
        />

        {/* Short Story */}
        <TextInput
          placeholder="Short Story"
          value={profile.shortStory}
          onChangeText={(val) => setProfile({ ...profile, shortStory: val })}
          multiline
          numberOfLines={4}
          className="mb-4 px-4 py-3 border border-neutral-300 rounded-lg text-black bg-white"
        />

        {/* Save */}
        <TouchableOpacity
          onPress={handleSaveProfile}
          disabled={loading}
          className="bg-black px-4 py-3 rounded-lg items-center justify-center mb-4"
        >
          <Text className="text-white font-semibold text-base">
            {loading ? "Saving..." : "Save Changes"}
          </Text>
        </TouchableOpacity>

        {/* Logout */}
        <TouchableOpacity
          onPress={logout}
          className="bg-red-600 mb-32 px-4 py-3 rounded-lg items-center justify-center"
        >
          <Text className="text-white font-semibold text-base">Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </NavLayout>
  );
};

export default ProfileScreen;
