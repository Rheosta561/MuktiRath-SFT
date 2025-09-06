import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { set } from "date-fns";
import { SocketHandler } from "@/handlers/SocketHandler";

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
    await AsyncStorage.removeItem("userToken");
    await AsyncStorage.removeItem('userProfile');
  };

  return (
    <AuthContext.Provider value={{ userToken, login, logout, loading  , isAuthenticated}}>
      {children}
      {isAuthenticated && userToken && <SocketHandler userToken={userToken} />}
    </AuthContext.Provider>
  );
};
