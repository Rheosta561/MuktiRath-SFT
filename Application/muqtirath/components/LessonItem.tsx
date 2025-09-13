import React from "react";
import { View,  Image, TouchableOpacity } from "react-native";
import { Text } from "@/components/AutoTranslateText";
import { CheckCircle } from "lucide-react-native";

import { CourseContentItem } from "@/constants";

type Props = {
  lesson: CourseContentItem;
  isCompleted: boolean;
  isActive: boolean;
  onPress: () => void;
};

const LessonItem: React.FC<Props> = ({
  lesson,
  isCompleted,
  isActive,
  onPress,
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      className={`flex-row items-center p-2 rounded-md mb-2 ${
        isActive ? "bg-indigo-100" : "bg-white"
      }`}
    >
      <Image
        source={{ uri: lesson.thumbnailUrl }}
        className="w-20 h-14 rounded-md mr-3"
      />
      <View className="flex-1">
        <Text
          className={`font-semibold ${isActive ? "text-indigo-900" : "text-black"}`}
          numberOfLines={1}
        >
          {lesson.title}
        </Text>
        <Text className="text-xs text-gray-600">{lesson.duration}</Text>
      </View>
      {isCompleted && <CheckCircle size={20} color="green" />}
    </TouchableOpacity>
  );
};

export default LessonItem;
