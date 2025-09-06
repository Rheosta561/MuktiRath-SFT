import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { UserCourseResponse } from "@/constants";
export type RootStackParamList = {
  Main: undefined;
  Login: undefined;
  Signup: undefined;
  Onboarding: undefined;
  CourseScreen: undefined;
  CoursePlayer: { userCourse: UserCourseResponse }; // 👈 NEW screen
};

const Stack = createNativeStackNavigator<RootStackParamList>();
import HomeScreen from "@/screens/HomeScreen";
import Tabs from "./tabs";
import { AuthContext } from "@/Context/AuthContext";
import { useContext } from "react";

import { ActivityIndicator , View } from "react-native";
import LoginScreen from "@/screens/LoginScreen";
import OnboardingScreen from "@/screens/OnboardingScreen";
import SignupScreen from "@/screens/SignupScreen";
import CoursePlayerScreen from "@/screens/CoursePlayerScreen";
import WalletScreen from "@/screens/WalletScreen";
import MyOrdersScreen from "@/screens/MyOrdersScreen";






export default function AppNavigator() {
  const { loading, isAuthenticated } = useContext(AuthContext);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {isAuthenticated ? (
        <>
          <Stack.Screen name="Main" component={Tabs} />
          <Stack.Screen name="CoursePlayer" component={CoursePlayerScreen} />
          <Stack.Screen name="Wallet" component = {WalletScreen}/>
          <Stack.Screen name="MyOrders" component = {MyOrdersScreen}/>
        </>
      ) : (
        <>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Signup" component={SignupScreen} />
         
        </>
      )}
       <Stack.Screen name="Onboarding" component={OnboardingScreen} />
    </Stack.Navigator>
  );
}

