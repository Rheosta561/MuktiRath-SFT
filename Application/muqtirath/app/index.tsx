import "react-native-reanimated";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { NavigationContainer, NavigationIndependentTree } from "@react-navigation/native";
import { AuthProvider } from "@/Context/AuthContext";
import { TranslationProvider } from "@/Context/TranslatationContext";
import AppNavigator from "./navigation/AppNavigator";
import Toast from "react-native-toast-message";

export default function Index() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
        <NavigationIndependentTree>
          <NavigationContainer>
            <TranslationProvider>
              <AppNavigator />
            </TranslationProvider>
          </NavigationContainer>
        </NavigationIndependentTree>
      </AuthProvider>

      <Toast />
    </GestureHandlerRootView>
  );
}
