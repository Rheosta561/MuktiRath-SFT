import { View, ScrollView, Dimensions } from "react-native";
import { Text } from "@/components/AutoTranslateText";
import React, { useRef, useState, useEffect } from "react";
import NavLayout from "@/components/NavLayout";
import PromoCard from "@/components/PromoCard";
import CourseCard from "@/components/CourseCard";
import HelplineCard from "@/components/HelplineCard";
import JobCard from "@/components/JobCard";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";
import { JwtPayloadWithUser ,User } from "@/constants";
import Constants from "expo-constants";


const { width } = Dimensions.get("window");


const jobs = [
  {
    id: "job1",
    title: "Data Entry Associate",
    company: "Community Support Network",
    location: "Remote / Local Centers",
    description: "Assist with entering data for community development projects. Training provided for beginners.",
    imageUrl: "data:image/jpeg;base64,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",
    tags: ["Data Entry", "Remote", "Training Provided"],
    salary: "Commision Based Earning",
  },
  {
    id: "job2",
    title: "Handicraft Seller",
    company: "EmpowerArtisans",
    location: "Local Market / Online",
    description: "Sell handmade products such as baskets, textiles, and eco-friendly goods. Support provided for e-commerce platforms.",
    imageUrl: "https://www.indiafilings.com/learn/wp-content/uploads/2019/04/India-Handmade-Bazaar.jpg",
    tags: ["Handicraft", "Sales", "Entrepreneurship"],
    salary: "Commission-based earnings",
  },
  {
    id: "job3",
    title: "Digital Marketing Assistant",
    company: "Inclusive Growth Hub",
    location: "Remote",
    description: "Help create and manage social media content for community initiatives. Training on digital tools available.",
    imageUrl: "https://images.unsplash.com/photo-1556761175-4b46a572b786?auto=format&fit=crop&w=800&q=60",
    tags: ["Marketing", "Social Media", "Remote Work"],
    salary: "Commision Based Earning",
  },
  {
    id: "job4",
    title: "Local Health Worker",
    company: "CareConnect",
    location: "Community Clinics",
    description: "Provide basic health services and education in underserved areas. Training and certification provided.",
    imageUrl: "data:image/jpeg;base64,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",
    tags: ["Healthcare", "Community Support", "Training Provided"],
    salary: "Commission based earning",
  },
  {
    id: "job5",
    title: "Language Tutor",
    company: "Bright Futures Academy",
    location: "Online / Community Centers",
    description: "Teach basic language skills to children and adults in marginalized communities. Flexible hours and teaching support available.",
    imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRHbSBTsfA-_u1SpNs3WuGIviJxI6E7nIKzrQ&s",
    tags: ["Education", "Language", "Remote"],
    salary: "Commision based earning",
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
    title: "Handicraft and Textile Making",
    description: "Learn the art of creating handmade crafts, textiles, and eco-friendly products to start your own small business.",
    imageUrl: "https://www.ibef.org/uploads/blog/blog_30-3-2021_handicrafts.jpg",
    tags: ["Crafts", "Textiles", "Entrepreneurship"],
  },
  {
    id: "course2",
    title: "Nutrition and Home Gardening",
    description: "Gain practical knowledge on nutrition and home gardening to improve family health and self-sustenance.",
    imageUrl: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&w=800&q=60",
    tags: ["Nutrition", "Gardening", "Health"],
  },
  {
    id: "course3",
    title: "Digital Literacy and Online Selling",
    description: "Learn to use smartphones, social media, and e-commerce platforms to expand your business and access new markets.",
    imageUrl: "https://static.wixstatic.com/media/9b101f_b89c35af73cd472e944803abcc0f583e~mv2.jpg/v1/fill/w_568,h_378,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/9b101f_b89c35af73cd472e944803abcc0f583e~mv2.jpg",
    tags: ["Digital Literacy", "Online Selling", "Skills Development"],
  },
  {
    id: "course4",
    title: "Financial Management for Women Entrepreneurs",
    description: "Understand budgeting, savings, and micro-financing to effectively manage and grow small enterprises.",
    imageUrl: "https://tavaga.com/blog/wp-content/uploads/2022/05/Banner-6.png",
    tags: ["Finance", "Entrepreneurship", "Empowerment"],
  }
];


const helplines = [
  { id: "h1", title: "Emergency Services", description: "Call 112 for immediate assistance.", phoneNumber: "911" },
  { id: "h2", title: "Poison Control", description: "24/7 poison emergency help.", phoneNumber: "1-800-222-1222" },
  { id: "h3", title: "Domestic Violence", description: "Support for domestic violence victims.", phoneNumber: "1-800-799-7233" },
  { id: "h4", title: "Suicide Prevention", description: "Confidential support for suicidal thoughts.", phoneNumber: "1-800-273" },
];

const HomeScreen = () => {
  const scrollRef = useRef<ScrollView>(null);
  const backendUrl = Constants.expoConfig?.extra?.backendUrl;
  const [activeIndex, setActiveIndex] = useState(0);

  const [userId , setUserId]= useState<String>('');


  const courseScrollRef = useRef<ScrollView>(null);
  const [activeCourseIndex, setActiveCourseIndex] = useState(0);

  const helplineScrollRef = useRef<ScrollView>(null);
  const [activeHelplineIndex, setActiveHelplineIndex] = useState(0);

  const jobScrollRef = useRef<ScrollView>(null);
  const [activeJobIndex, setActiveJobIndex] = useState(0);

  // fetching the profile initially 
useEffect(() => {
  const getProfile = async () => {
    try {
        const token = await AsyncStorage.getItem('userToken');
        if (token) {
          const decodedData = jwtDecode<JwtPayloadWithUser>(token);
          setUserId(decodedData.user._id);
}
      const storedProfile = await AsyncStorage.getItem('userProfile');
      if (storedProfile) {
        const profile = JSON.parse(storedProfile);
        const profileId = profile._id;

        if(profile.interests.length===0){
          // fetching the profile from backend 
          try {
            const res = await fetch(`${backendUrl}/user/getProfile/${profileId}`);
            const data = await res.json();
            if (res.ok) {
              await AsyncStorage.setItem('userProfile', JSON.stringify(data.profile));
              console.log('Profile fetched and stored:', data.profile);
            } else {
              console.log('Failed to fetch profile:', data.message);
            }
            
          } catch (error) {
            console.error('Error fetching profile:', error);
            
          }

        }
      } else {
        console.log("No profile found in AsyncStorage");
      }
    } catch (error) {
      console.error('Something went wrong while fetching profile', error);
    }
  };

  getProfile();
}, []);

  


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
