import { View,  ImageBackground, TouchableOpacity } from "react-native";
import { Text } from "@/components/AutoTranslateText";
import React from "react";
import { promoCardProps } from "@/constants";

const PromoCard = ({ imageUrl, title, description }: promoCardProps) => {
  return (
    <View className="rounded-md h-48 w-full overflow-hidden mb-2">
      {/* Background Image */}
      <ImageBackground
        source={{ uri: imageUrl }}
        className="w-full h-full justify-between p-4 pt-6"
        imageStyle={{ resizeMode: "cover" }}
      >
        {/* Dark Overlay */}
        <View className="absolute inset-0 bg-black/40" />

        {/* Title + Description */}
        <View>
          <Text
            className="text-white text-2xl mt-4 mx-2 font-semibold drop-shadow-md"
            numberOfLines={2}
            ellipsizeMode="tail"
          >
            {title}
          </Text>
          <Text className="text-white text-sm mx-2 mt-1 drop-shadow-md w-3/4">
            {description}
          </Text>
        </View>

        {/* Button */}
        <TouchableOpacity className="rounded-xl self-start mx-2">
          <Text className="text-white text-xs underline">Learn More</Text>
        </TouchableOpacity>
      </ImageBackground>
    </View>
  );
};

export default PromoCard;
