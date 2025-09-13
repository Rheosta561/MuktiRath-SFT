import { 
  View,  ScrollView, Dimensions, TextInput, 
  Modal, Pressable, TouchableOpacity, Image, ActivityIndicator, RefreshControl 
} from 'react-native';
import React, { useEffect, useState } from 'react';
import NavLayout from '@/components/NavLayout';
import { Library, Search, X } from 'lucide-react-native';
import CourseDisplay from '@/components/PathShaala/CourseDisplay';
import CourseCard from '@/components/CourseCard';
import Constants from "expo-constants";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode';
import { Text } from '@/components/AutoTranslateText';

const { width } = Dimensions.get("window");
const backendUrl = Constants.expoConfig?.extra?.backendUrl;

// recommended courses (dummy)
const recommendedCourses = [
  {
    id: "R001",
    title: "Advanced JavaScript",
    description: "Deep dive into closures, async programming, and patterns.",
    imageUrl: "https://example.com/js-advanced-thumbnail.jpg",
    tags: ["JavaScript", "Advanced", "Programming"],
  },
  {
    id: "R002",
    title: "UI/UX Fundamentals",
    description: "Learn how to design beautiful and user-friendly apps.",
    imageUrl: "https://example.com/uiux-thumbnail.jpg",
    tags: ["Design", "UI/UX", "Beginner"],
  },
];

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

const CourseScreen = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCourse, setSelectedCourse] = useState<any>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [allCourses, setAllCourses] = useState<any[]>([]);
  const [myCoursesEnrolled, setMyCoursesEnrolled] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [enrolling, setEnrolling] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [profileId, setProfileId] = useState<string | null>(null);

  // Fetch enrolled courses
  const fetchMyCourses = async (uid: string) => {
    try {
      console.log("Fetching my courses for user:", uid);
      const resMy = await fetch(`${backendUrl}/course/user/${uid}`);
      if (resMy.ok) {
        const myCoursesData = await resMy.json();
        setMyCoursesEnrolled(myCoursesData || []);
      }
    } catch (err) {
      console.error("Error fetching my courses:", err);
    }
  };

  // Fetch all courses
  const fetchAllCourses = async () => {
    try {
      const resAll = await fetch(`${backendUrl}/course`);
      if (resAll.ok) {
        const dataAll = await resAll.json();
        setAllCourses(dataAll.data || []);
      }
    } catch (err) {
      console.error("Error fetching all courses:", err);
    }
  };

  // Refresh handler
  const onRefresh = async () => {
    setRefreshing(true);
    try {
      if (userId) {
        await fetchMyCourses(userId);
      }
      await fetchAllCourses();
    } catch (err) {
      console.error("Refresh error:", err);
    } finally {
      setRefreshing(false);
    }
  };

  // Initial data fetching
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const token = await AsyncStorage.getItem('userToken');
        if (token) {
          const decodedData = jwtDecode<JwtPayloadWithUser>(token);
          setUserId(decodedData.user._id);

          const storedProfile = await AsyncStorage.getItem('userProfile');
          if (storedProfile) {
            const parsedProfile = JSON.parse(storedProfile);
            setProfileId(parsedProfile._id);
          }
        }
        await fetchAllCourses();
        if (userId) {
          await fetchMyCourses(userId);
        }
      } catch (err) {
        console.error("Failed to fetch courses:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [userId]);

  const handleScroll = (event: any) => {
    const scrollX = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollX / width);
    setActiveIndex(index);
  };

  const filteredCourses = allCourses.filter((course) =>
    course.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleEnroll = async (courseId: string) => {
    if (!profileId || !userId) {
      alert("Profile not found");
      return;
    }

    try {
      setEnrolling(true);
      const res = await fetch(`${backendUrl}/course/join`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profileId, courseId }),
      });
      console.log("Enroll response status:", res);


      const data = await res.json();
      if (res.ok) {
        alert(data.message);
        await fetchMyCourses(userId);
        setModalVisible(false);
      } else {
        alert(data.message || "Failed to enroll");
      }
    } catch (err) {
      console.error("Enroll error:", err);
      alert("Error enrolling in course");
    } finally {
      setEnrolling(false);
    }
  };

  return (
    <View className="h-full">
      <NavLayout>
        {/* Header */}
        <View className="px-4 flex flex-row items-end">
          <Library size={44} color="black" />
          <Text className="font-medium text-2xl ml-2">PathShaala</Text>
        </View>

        <ScrollView
          className="mt-2"
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {/* Enrolled Courses Section */}
          <View className="h-fit p-2 border rounded-md border-gray-200">
            {loading ? (
              <ActivityIndicator size="large" className="mt-8" color="black" />
            ) : myCoursesEnrolled.length > 0 ? (
              <>
                <ScrollView
                  horizontal
                  pagingEnabled
                  showsHorizontalScrollIndicator={false}
                  onScroll={handleScroll}
                  scrollEventThrottle={16}
                >
                  {myCoursesEnrolled.map((course) => (
                    <View key={course._id} style={{ width: width * 0.88 }}>
                      <CourseDisplay
                        key={course._id}
                        course={course.course}
                        completedModules={course.completedModules}
                        progress={course.progress}
                      />
                    </View>
                  ))}
                </ScrollView>

                {/* Pagination Dots */}
                <View className="flex flex-row justify-center mt-2">
                  {myCoursesEnrolled.map((_, index) => (
                    <View
                      key={index}
                      className={`h-2 w-2 rounded-full mx-1 ${
                        index === activeIndex ? "bg-black" : "bg-gray-300"
                      }`}
                    />
                  ))}
                </View>
              </>
            ) : (
              <View className="w-full h-32 justify-center items-center">
                <Text className="text-gray-500 text-center">
                  No courses enrolled right now
                </Text>
              </View>
            )}
          </View>

          {/* Search Section */}
          <View className="mt-4 px-2">
            <View className="flex flex-row items-center border border-gray-400 rounded-md px-3 py-2">
              <Search size={20} color="gray" />
              <TextInput
                placeholder="Search for your course"
                value={searchQuery}
                onChangeText={setSearchQuery}
                className="ml-2 flex-1 text-base"
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity onPress={() => setSearchQuery("")}>
                  <X size={20} color="gray" />
                </TouchableOpacity>
              )}
            </View>

            {searchQuery.length > 0 && (
              <View className="bg-white border border-gray-200 rounded-md mt-2">
                {filteredCourses.length > 0 ? (
                  filteredCourses.map((course) => (
                    <Pressable
                      key={course._id}
                      onPress={() => {
                        setSelectedCourse(course);
                        setModalVisible(true);
                      }}
                      className="px-3 py-2 border-b border-gray-200"
                    >
                      <Text className="font-medium">{course.title}</Text>
                      <Text className="text-xs text-gray-500">{course.organisation}</Text>
                    </Pressable>
                  ))
                ) : (
                  <Text className="px-3 py-2 text-gray-500">No results found</Text>
                )}
              </View>
            )}
          </View>

          {/* Recommended Section */}
          <View className="mt-6 px-2 mb-60">
            <Text className="text-lg font-semibold mb-3">Recommended For You</Text>

            <View className="flex flex-col gap-4">
              {allCourses
                .filter(
                  (course) =>
                    !myCoursesEnrolled.some((uc) => uc.course._id === course._id)
                )
                .map((course) => (
                  <CourseCard
                    key={course._id}
                    {...course}
                    enroll={() => handleEnroll(course._id)}
                  />
                ))}
            </View>
          </View>
        </ScrollView>
      </NavLayout>

      {/* Course Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View className="flex-1 bg-black/50 justify-center items-center">
          <View className="bg-white rounded-md p-5 w-11/12">
            {selectedCourse && (
              <>
                <Image
                  source={{ uri: selectedCourse.imageUrl }}
                  style={{ width: "100%", height: 160, borderRadius: 8 }}
                  resizeMode="cover"
                />
                <Text className="text-xl font-semibold mt-3">
                  {selectedCourse.title}
                </Text>
                <Text className="text-gray-600 mt-1">
                  {selectedCourse.organisation}
                </Text>
                <Text className="text-gray-600 mt-1">
                  {selectedCourse.description}
                </Text>

                <View className="flex flex-row flex-wrap mt-2">
                  {selectedCourse.tags?.map((tag: string, idx: number) => (
                    <View
                      key={idx}
                      className="bg-gray-200 px-2 py-1 rounded-full mr-2 mb-2"
                    >
                      <Text className="text-xs text-gray-700">#{tag}</Text>
                    </View>
                  ))}
                </View>

                <Text className="mt-2 text-sm text-gray-500">
                  ⭐ {selectedCourse.rating} | {selectedCourse.enrolledStudents} students
                </Text>

                <Pressable
                  onPress={() => handleEnroll(selectedCourse._id)}
                  className="mt-4 bg-black py-2 px-4 rounded-md flex-row justify-center items-center"
                  disabled={enrolling}
                >
                  {enrolling ? (
                    <ActivityIndicator size="small" color="white" />
                  ) : (
                    <Text className="text-white text-center">Enroll</Text>
                  )}
                </Pressable>

                <Pressable
                  onPress={() => setModalVisible(false)}
                  className="mt-2 border border-gray-300 py-2 px-4 rounded-md"
                >
                  <Text className="text-center">Close</Text>
                </Pressable>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default CourseScreen;
