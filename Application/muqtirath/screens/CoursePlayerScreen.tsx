import React, { useState, useEffect } from "react";
import {
  View,

  ScrollView,
  TouchableOpacity,
  useWindowDimensions,
} from "react-native";
import VideoPlayer from "@/components/VideoPlayer";
import LessonList from "@/components/LessonList";
import { UserCourseResponse, CourseContentItem } from "@/constants";
import { RouteProp, useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "@/constants";
import { ArrowLeft, MessageCircleCodeIcon, MessageCircleQuestion } from "lucide-react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";
import Constants from "expo-constants";
import ChatModal from "@/components/ChatModal";
import { Text } from "@/components/AutoTranslateText";
const backendUrl = Constants.expoConfig?.extra?.backendUrl;

type CoursePlayerRouteProp = RouteProp<RootStackParamList, "CoursePlayer">;

type Props = {
  route: CoursePlayerRouteProp;
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



const CoursePlayerScreen: React.FC<Props> = ({ route }) => {
  const navigation = useNavigation();
  const { userCourse } = route.params;
  const { course, progress } = userCourse;

  const [userId, setUserId] = useState<string | null>(null);
  const [selectedLesson, setSelectedLesson] = useState<CourseContentItem>(
    course.content[0]
  );
  const [completedModules, setCompletedModules] = useState<string[]>(
    userCourse.completedModules
  );
  const [currentProgress, setCurrentProgress] = useState(progress);

  // Chat modal state
  const [chatVisible, setChatVisible] = useState(false);

  // Get userId from AsyncStorage
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = await AsyncStorage.getItem("userToken");
        if (token) {
          const decoded = jwtDecode<JwtPayloadWithUser>(token);
          setUserId(decoded.user._id);
        }
      } catch (err) {
        console.error("Error decoding token:", err);
      }
    };
    fetchUser();
  }, []);

  const handleLessonSelect = async (lesson: CourseContentItem) => {
    setSelectedLesson(lesson);

    if (!userId) {
      console.error("UserId not found");
      return;
    }

    try {
      const res = await axios.post(`${backendUrl}/course/mark-lesson`, {
        userId,
        courseId: course._id,
        contentId: lesson._id,
      });

      if (res.data.success) {
        setCompletedModules(res.data.data.completedModules);
        setCurrentProgress(res.data.data.progress);
      }
    } catch (err) {
      console.error("Error marking lesson complete:", err);
    }
  };

  return (
    <View className="flex-1 bg-white pt-8">
      {/* Header */}
      <View className="flex-row items-center p-4 border-b border-gray-200 bg-white">
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="flex-row items-center border p-2 rounded-md border-gray-700"
        >
          <ArrowLeft size={22} width={30} color="#111" />
          <Text className="ml-2 text-base font-semibold text-gray-800">
            Back to Pathshaala
          </Text>
        </TouchableOpacity>
      </View>

      {/* Video Player */}
      <VideoPlayer lesson={selectedLesson} />

      {/* Course Info */}
      <View className="p-4 border-b border-gray-200 bg-white">
        <Text className="text-xl font-bold text-gray-900">{course.title}</Text>
        <Text className="text-gray-600 text-sm">{course.organisation}</Text>
        <Text className="text-xs text-gray-500 mt-1">
          {currentProgress.completed}/{currentProgress.total} lessons completed •{" "}
          {currentProgress.percentage.toFixed(0)}%
        </Text>
      </View>

      {/* Lesson List */}
      <ScrollView className="flex-1 bg-gray-50">
        <LessonList
          lessons={course.content}
          completedModules={completedModules}
          onSelect={handleLessonSelect}
          selectedLessonId={selectedLesson._id}
        />
      </ScrollView>

      {/* Chat Button */}
      <TouchableOpacity
  onPress={() => setChatVisible(true)}
  className="absolute bottom-6 right-6 bg-pink-950 rounded-md px-4 py-3 flex-row items-center shadow-lg"
>

  <MessageCircleQuestion size={24} color="white" />
  <Text className="text-white font-bold ml-2">Ask Doubts</Text>
</TouchableOpacity>

      {/* Chat Modal */}
      <ChatModal uri={selectedLesson.videoUrl} visible={chatVisible} onClose={() => setChatVisible(false)} />
    </View>
  );
};

export default CoursePlayerScreen;

