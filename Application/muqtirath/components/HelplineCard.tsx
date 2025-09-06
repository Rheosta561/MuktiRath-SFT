import React from "react";
import { View, Text, TouchableOpacity, Linking } from "react-native";
import { Phone } from "lucide-react-native";

interface HelplineCardProps {
  title: string;
  description: string;
  phoneNumber: string;
}

const HelplineCard: React.FC<HelplineCardProps> = ({ title, description, phoneNumber }) => {
  const handleCall = () => {
    Linking.openURL(`tel:${phoneNumber}`);
  };

  return (
    <View className="bg-white rounded-md border border-gray-200   pb-6 p-4 m-2 ">
      <Text className="text-lg font-semibold text-gray-800">{title}</Text>
      <Text className="text-sm text-gray-600 mt-1">{description}</Text>

      <TouchableOpacity
        onPress={handleCall}
        className="flex-row items-center justify-center bg-pink-800 mt-2 mb-2 py-2 px-4 rounded-md"
      >
        <Phone color="white" size={18} />
        <Text className="text-white font-semibold ml-2">Call</Text>
      </TouchableOpacity>
    </View>
  );
};

export default HelplineCard;
