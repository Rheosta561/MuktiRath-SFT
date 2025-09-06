import React, { useEffect, useState, useContext } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert } from "react-native";
import { Picker } from "@react-native-picker/picker";
import Toast from "react-native-toast-message";
import Constants from "expo-constants";
import NavLayout from "@/components/NavLayout";
import * as Location from "expo-location";
import { AuthContext } from "@/Context/AuthContext";

const backendUrl = Constants.expoConfig?.extra?.backendUrl;

const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

//  fallback mock profile (if API or user data unavailable)
const mockProfile = {
  name: "Guest User",
  bloodGroup: "O+",
  healthCondition: "Healthy",
  otherHealthCondition: "",
  interests: ["Reading", "Traveling"],
  aspiration: "To learn and grow",
  shortStory: "This is a mock profile for demo purposes.",
  coordinates: { latitude: 28.6139, longitude: 77.209 }, // Default Delhi coords
};

const ProfileScreen = () => {
  const [profile, setProfile] = useState<any>(mockProfile);
  const [loading, setLoading] = useState(false);
  const { logout } = useContext(AuthContext); //  get logout function

  // realtime location updater
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
      const res = await fetch(`${backendUrl}/profile/update`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...profile,
          interests: profile.interests?.split(",").map((i: string) => i.trim()), // format interests
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

  return (
    <NavLayout>
      <ScrollView className="p-4 pb-20">
        <Text className="text-xl font-bold mb-4">My Profile</Text>

        {/* Name - only display, not editable */}
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

        {/*  Logout Button */}
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
