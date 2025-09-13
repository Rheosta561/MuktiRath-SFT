import { View,  Pressable } from "react-native";
import { Text } from "@/components/AutoTranslateText";
import React, { useState } from "react";
import { courseCardProps } from "@/constants";
import { Lightbulb, MoreVertical } from "lucide-react-native";
import { ImageBackground } from "react-native";

const CourseCard = (course: courseCardProps) => {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <View className="h-56 w-full rounded-md bg-zinc-50 ">
      <View className="flex flex-row h-1/4  px-2 justify-between items-center">
        <View className="flex flex-row items-center h-full w-2/3 gap-3">
          <Lightbulb size={28} color="black" />
          <Text
            className="text-black font-semibold text-sm flex-shrink"
            numberOfLines={1}
          >
            {course.title}
          </Text>
        </View>

        {/* Menu Button */}
        <Pressable
          className="px-2 py-1 rounded-md"
          onPress={() => setShowMenu(!showMenu)}
        >
          <MoreVertical size={20} color="black" />
        </Pressable>
      </View>

      {/* Dropdown Menu */}
      {showMenu && (
        <View className="absolute top-12 right-4 bg-white shadow-lg rounded-md p-2 z-10">
          <Pressable
            onPress={course.enroll}
          >
            <Text className="text-black text-sm">Enroll</Text>
          </Pressable>
        </View>
      )}
      <ImageBackground
        source={{ uri: course.imageUrl }} 
        className="h-3/4 px-2 pt-1 rounded-b-md overflow-hidden"
        resizeMode="cover"
      >
        <View className="absolute inset-0 bg-black/30" />

        {/* Content Overlay */}
        <View className="flex-1 absolute bottom-4 left-2 p-2">
         <Text 
  className="text-white font-normal text-sm" 
  numberOfLines={2}  
  ellipsizeMode="tail" 
>
  {course.description}
</Text>
          <View className="flex-row flex-wrap gap-2 mt-1">
            {course.tags.slice(0, 3).map((tag, index) => (
              <Text
                key={index}
                className="bg-zinc-50 text-black px-2 py-1 font-semibold rounded-md text-xs"
              >
                {tag}
              </Text>
            ))}

            {course.tags.length > 3 && (
              <Text className="bg-zinc-200 text-black px-2 py-1 font-semibold rounded-md text-xs">
                +{course.tags.length - 3} more
              </Text>
            )}
          </View>
        </View>
      </ImageBackground>
    </View>
  );
};

export default CourseCard;
