import "react-native-reanimated";



import { Text, View } from "react-native";
import AppNavigator from "./navigation/AppNavigator";
import { AuthContext, AuthProvider } from "@/Context/AuthContext";
import { NavigationContainer, NavigationIndependentTree } from "@react-navigation/native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Toast from "react-native-toast-message";
 
export default function Index() {
  return (
    <GestureHandlerRootView style={{flex:1}}>
   

    
    <AuthProvider>
<NavigationIndependentTree>
<NavigationContainer>
              <AppNavigator />
                 <Toast/>
</NavigationContainer>
</NavigationIndependentTree>


      

    </AuthProvider>
    </GestureHandlerRootView>




  
  );
}