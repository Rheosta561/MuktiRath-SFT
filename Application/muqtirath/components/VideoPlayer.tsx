import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import YoutubePlayer from "react-native-youtube-iframe";
import { CourseContentItem } from "@/constants";
import { Maximize } from "lucide-react-native"; // ✅ import icon

type Props = {
  lesson: CourseContentItem;
  onFullScreen?: () => void; 
};

const getYouTubeId = (url: string) => {
  const match = url.match(/(?:v=|youtu\.be\/)([^&#]+)/);
  return match ? match[1] : url;
};



const VideoPlayer: React.FC<Props> = ({ lesson, onFullScreen }) => {
  console.log(lesson.videoUrl);
  return (
    <View className="w-full bg-black relative">
      {/* YouTube player */}
      <YoutubePlayer
        height={230}
        play={true}
        videoId={getYouTubeId(lesson.videoUrl)}
      />

      {/* Lesson info */}
      <View className="p-2 bg-white">
        <Text className="text-base font-semibold">{lesson.title}</Text>
        <Text className="text-gray-600 text-sm">{lesson.duration}</Text>
      </View>

      {/* Fullscreen toggle */}
      {onFullScreen && (
        <TouchableOpacity
          onPress={onFullScreen}
          className="absolute bottom-3 right-3 p-2 bg-black/50 rounded-full"
        >
          <Maximize size={20} color="white" />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default VideoPlayer;
