import { View, Text } from 'react-native'
import React, { useEffect } from 'react'
import io from 'socket.io-client';
import Constants from 'expo-constants';
import { jwtDecode } from 'jwt-decode';

type JwtPayload = {
    id: string ;
    // add other properties if needed
};

export const useSocket = (userToken : string | null)=>{
    if (!userToken) return;
    const decoded = jwtDecode<JwtPayload>(userToken);
    const userId : string = decoded.id;
    const backendUrl : string = Constants.expoConfig?.extra?.backendUrl || "http://localhost:3000";
    useEffect(() => {
        if(!userId) return;

        console.log("Socket initialized for user:", userId);
        const socket = io(backendUrl, {
            transports: ['websocket'],
        });

        socket.on('connect', ()=>{
            console.log('Socket connected:', socket.id);
            socket.emit('userOnline',  userId );

        });


    
      return () => {
        if (socket) {
        console.log('Disconnecting socket:', socket.id);
        socket.disconnect();
        console.log('Socket disconnected');
      }

      }
    }, [userId])
    
}