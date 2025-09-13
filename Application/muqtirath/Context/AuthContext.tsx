import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { set } from "date-fns";
import { SocketHandler } from "@/handlers/SocketHandler";
import { useNavigation } from "expo-router";

export const AuthContext = createContext<{
  userToken: string | null;
  login: (token: string) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
  isAuthenticated : boolean;
}>({
  userToken: null,
  login: async () => {},
  logout: async () => {},
  loading: true,
  isAuthenticated : false,
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userToken, setUserToken] = useState<string | null>(null);
  const navigation = useNavigation();

  const [loading, setLoading] = useState<boolean>(true);
  const [isAuthenticated , setisAuthenticated] = useState<boolean>(false);

  // checking the  token on app start
  useEffect(() => {
    const loadToken = async () => {
      try {
        const token = await AsyncStorage.getItem("userToken");
        if (token) {
          setUserToken(token);
        setisAuthenticated(true);
        }
      } catch (err) {
        console.log("Error loading token", err);

      } finally {
        setLoading(false);
      }
    };
    loadToken();
  }, []);

  const login = async (token : string) => {
    setUserToken(token);
    setisAuthenticated(true);

    await AsyncStorage.setItem("userToken", token);


  };

  const logout = async () => {
    setUserToken(null);
    setisAuthenticated(false);
    console.log("Logging out");
    console.log(AsyncStorage.getAllKeys());
    navigation.navigate("Signup" as never);


    await AsyncStorage.removeItem("userToken");
    await AsyncStorage.removeItem("user");
    await AsyncStorage.removeItem("userProfile");
    await AsyncStorage.clear();
    console.log("Logged out and cleared AsyncStorage");
  };

  return (
    <AuthContext.Provider value={{ userToken, login, logout, loading  , isAuthenticated}}>
      {children}
      {isAuthenticated && userToken && <SocketHandler userToken={userToken} />}
    </AuthContext.Provider>
  );
};
