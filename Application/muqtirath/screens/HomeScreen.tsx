import { View, Text, ScrollView, Dimensions } from "react-native";
import React, { useRef, useState, useEffect } from "react";
import NavLayout from "@/components/NavLayout";
import PromoCard from "@/components/PromoCard";
import CourseCard from "@/components/CourseCard";
import HelplineCard from "@/components/HelplineCard";
import JobCard from "@/components/JobCard";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { width } = Dimensions.get("window");

const jobs = [
  {
    id: "job1",
    title: "Frontend Developer",
    company: "Tech Solutions Inc.",
    location: "Remote",
    description: "We are looking for a skilled frontend developer to join our team.",
    imageUrl: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=800&q=60",
    tags: ["Frontend", "React", "Remote"],
    salary: "$70,000 - $90,000",
  },
  {
    id: "job2",
    title: "Backend Developer",
    company: "Innovatech",
    location: "New York, NY",
    description: "Seeking an experienced backend developer with knowledge of Node.js and databases.",
    imageUrl: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=800&q=60",
    tags: ["Backend", "Node.js", "Databases"],
    salary: "$80,000 - $100,000",
  }
];

const promos = [
  {
    id: "promo1",
    imageUrl:
      "https://images.unsplash.com/photo-1532372722026-28ddb1b48daf?w=1200&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHBvb3IlMjB3b21hbnxlbnwwfHwwfHx8MA%3D%3D",
    title: "Empowering Help",
    description: "Aiming to support 1000+ women and dialy workers by 2026.",
    buttonText: "Learn More",
    buttonLink: "https://example.com",
  },
  {
    id: "promo2",
    imageUrl:
      "https://images.unsplash.com/photo-1520981269471-2935a5567932?w=1200&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fHBvb3IlMjB3b21hbnxlbnwwfHwwfHx8MA%3D%3D",
    title: "Stay Updated",
    description: "Get the latest news and updates from our platform.",
    buttonText: "Learn More",
    buttonLink: "https://example.com",
  },
];

const courses = [
  {
    id: "course1",
    title: "React Native for Beginners",
    description: "Learn the basics of React Native and build your first app.",
    imageUrl:
      "https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=800&q=60",
    tags: ["React Native", "Mobile Development", "JavaScript"],
  },
  {
    id: "course2",
    title: "Advanced JavaScript",
    description: "Deep dive into advanced concepts of JavaScript.",
    imageUrl:
      "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=60",
    tags: ["JavaScript", "Programming", "Web Development"],
  },
];

const helplines = [
  { id: "h1", title: "Emergency Services", description: "Call 911 for immediate assistance.", phoneNumber: "911" },
  { id: "h2", title: "Poison Control", description: "24/7 poison emergency help.", phoneNumber: "1-800-222-1222" },
  { id: "h3", title: "Domestic Violence", description: "Support for domestic violence victims.", phoneNumber: "1-800-799-7233" },
  { id: "h4", title: "Suicide Prevention", description: "Confidential support for suicidal thoughts.", phoneNumber: "1-800-273" },
];

const HomeScreen = () => {
  const scrollRef = useRef<ScrollView>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const courseScrollRef = useRef<ScrollView>(null);
  const [activeCourseIndex, setActiveCourseIndex] = useState(0);

  const helplineScrollRef = useRef<ScrollView>(null);
  const [activeHelplineIndex, setActiveHelplineIndex] = useState(0);

  const jobScrollRef = useRef<ScrollView>(null);
  const [activeJobIndex, setActiveJobIndex] = useState(0);



  // Auto-scroll effect for promos
  useEffect(() => {
    const interval = setInterval(() => {
      let nextIndex = (activeIndex + 1) % promos.length;
      scrollRef.current?.scrollTo({
        x: nextIndex * width,
        animated: true,
      });
      setActiveIndex(nextIndex);
    }, 3000);
    return () => clearInterval(interval);
  }, [activeIndex]);

  const handleScroll = (event: any) => {
    const slide = Math.round(event.nativeEvent.contentOffset.x / width);
    setActiveIndex(slide);
  };

  const handleCourseScroll = (event: any) => {
    const slide = Math.round(event.nativeEvent.contentOffset.x / width);
    setActiveCourseIndex(slide);
  };

  const handleHelplineScroll = (event: any) => {
    const slide = Math.round(event.nativeEvent.contentOffset.x / (0.92 * width));
    setActiveHelplineIndex(slide);
  };

  const handleJobScroll = (event: any) => {
    const slide = Math.round(event.nativeEvent.contentOffset.x / width);
    setActiveJobIndex(slide);
  };

  return (
    <View className="flex-1">
      <NavLayout>
        <ScrollView style={{ height: "93%" }}>
          {/* Promo Section */}
          <View className="rounded-md overflow-hidden px-2 pt-2 bg-[#bab4b45a] mt-4 relative">
            <ScrollView
              ref={scrollRef}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              onScroll={handleScroll}
              scrollEventThrottle={20}
            >
              {promos.map((promo) => (
                <View key={promo.id} style={{ width }} className="h-fit">
                  <PromoCard {...promo} />
                </View>
              ))}
            </ScrollView>

            {/* Promo Pagination Dots */}
            <View className="absolute bottom-4 left-0 right-0 flex-row justify-center items-center">
              {promos.map((_, index) => (
                <View
                  key={index}
                  className={`h-2 w-2 mx-1 rounded-full ${
                    index === activeIndex ? "bg-white" : "bg-gray-500"
                  }`}
                />
              ))}
            </View>
          </View>

          {/* Courses */}
          <Text className="mt-4 font-semibold px-2 text-lg">HandPicked Courses for You</Text>
          <Text className="text-gray-600 px-2 text-xs">
            Based on your profile and area of interests we have curated these courses for you.
          </Text>

          <View className="mt-2 relative bg-zinc-200 rounded-md">
            <ScrollView
              ref={courseScrollRef}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              onScroll={handleCourseScroll}
              scrollEventThrottle={20}
            >
              {courses.map((course) => (
                <View key={course.id} style={{ width }} className="p-2">
                  <CourseCard {...course} />
                </View>
              ))}
            </ScrollView>

            {/* Course Pagination Dots */}
            <View className="absolute bottom-4 left-0 right-0 flex-row justify-center items-center">
              {courses.map((_, index) => (
                <View
                  key={index}
                  className={`h-2 w-2 mx-1 rounded-full ${
                    index === activeCourseIndex ? "bg-white" : "bg-gray-400"
                  }`}
                />
              ))}
            </View>
          </View>

          {/* Helplines */}
          <Text className="mt-4 font-semibold px-2 text-lg">Important Helplines</Text>
          <Text className="text-gray-600 px-2 text-xs">
            Here are some important helpline numbers you might need.
          </Text>

          <View className="mt-4 bg-zinc-200 rounded-md relative">
            <ScrollView
              ref={helplineScrollRef}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              onScroll={handleHelplineScroll}
              scrollEventThrottle={20}
              className="py-1"
            >
              {helplines.map((line) => (
                <View key={line.id} style={{ width: 0.92 * width }}>
                  <HelplineCard {...line} />
                </View>
              ))}
            </ScrollView>

            {/* Helpline Pagination Dots */}
            <View className="absolute bottom-6 left-0 right-0 flex-row justify-center items-center">
              {helplines.map((_, index) => (
                <View
                  key={index}
                  className={`h-2 w-2 mx-1 rounded-full ${
                    index === activeHelplineIndex ? "bg-pink-900" : "bg-gray-400"
                  }`}
                />
              ))}
            </View>
          </View>

          {/* Jobs */}
          <Text className="mt-4 font-semibold text-lg px-2">Featured Jobs</Text>
          <Text className="text-gray-600 px-2 text-xs mb-2">
            Explore job opportunities tailored for you.
          </Text>

          <View className="p-2 bg-zinc-200 rounded-md relative">
            <ScrollView
              ref={jobScrollRef}
              horizontal
              pagingEnabled


              showsHorizontalScrollIndicator={false}
              onScroll={handleJobScroll}
              scrollEventThrottle={20}
            >
              {jobs.map((job) => (
                <View key={job.id} style={{ width: width*0.92 }} className="pr-2">
                  <JobCard
                    organisation={job.company}
                    {...job}
                    onApply={() => console.log(`Apply clicked for ${job.title}`)}
                  />
                </View>
              ))}
            </ScrollView>


            <View className="absolute bottom-4 left-0 right-0 flex-row justify-center items-center">
              {jobs.map((_, index) => (
                <View
                  key={index}
                  className={`h-2 w-2 mx-1 rounded-full ${
                    index === activeJobIndex ? "bg-pink-900" : "bg-gray-400"
                  }`}
                />
              ))}
            </View>
          </View>
        </ScrollView>
      </NavLayout>
    </View>
  );
};

export default HomeScreen;
