import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Image } from "react-native";
import { Compass, CompassIcon, HeartPlusIcon, Home, Library, Tv, User2Icon } from "lucide-react-native";

import HomeScreen from "@/screens/HomeScreen";
import ProfileScreen from "@/screens/ProfileScreen";
import CourseScreen from "@/screens/CourseScreen";
import MarketPlaceScreen from "@/screens/MarketPlaceScreen";
import DiscussionForumScreen from "@/screens/DiscussionForumScreen";



const Tab = createBottomTabNavigator();

export default function Tabs() {

  const profileImage = "https://i.pravatar.cc/100";

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: "#ffff",
          borderTopWidth: 1,
          borderColor: "#C0C0C0",
          borderWidth:1,
          marginBottom: 15,
          marginHorizontal: 10,
          borderRadius:10,
          
          height: 80,
          overflow: "hidden",
        },
        tabBarIcon: ({ focused }) => {
          // if (route.name === "Profile") {
          //   return (
          //     <Image
          //       source={{ uri: profileImage }}
          //       style={{
          //         width: 24,
          //         height: 24,
          //         marginTop:40,
          //         borderRadius: 14,
          //         borderWidth: focused ? 2 : 0,
          //         borderColor: "black",
          //       }}
          //     />
          //   );
          // }

          // if (route.name === "RavenCall") {
          //   return (
          //     <Image
          //       source={{uri : profileImage}}
          //       style={{
          //           marginTop:35,
          //         width: 30,
          //         height: 30,
          //         resizeMode: "cover",
          //       }}
          //     />
          //   );
          // }

          const icons: Record<string, React.ComponentType<{ color: string; size: number; strokeWidth: number }>> = {
            Home: Home,
            Udyog: Compass,
            Discussion : HeartPlusIcon,
            Learning : Library,
            Profile : User2Icon,
          };
          const IconComponent = icons[route.name] as React.ComponentType<{ color: string; size: number; strokeWidth: number; marginTop:number }> | undefined;
          return IconComponent ? (
            <IconComponent
              color="black"
              size={24}
              marginTop={35}
              strokeWidth={focused ? 2 : 1.5}
            />
          ) : null;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Learning" component={CourseScreen} />
      <Tab.Screen name="Discussion" component={DiscussionForumScreen} />
      <Tab.Screen name="Udyog" component={MarketPlaceScreen} />
      
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}
