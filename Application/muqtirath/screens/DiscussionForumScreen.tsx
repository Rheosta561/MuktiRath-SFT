// screens/DiscussionForumScreen.tsx
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Group, Users, Wheat, WheatIcon } from 'lucide-react-native'; 
import NavLayout from '@/components/NavLayout';

const DiscussionForumScreen = () => {
  const navigation = useNavigation<any>();

  return (

        <NavLayout>
                <View className='h-screen   flex items-center justify-center '>
                    <View className="flex-1 justify-center h-full w-full  rounded-md items-center bg-white px-4">
      {/* Welcome Message */}

      <Text className="text-2xl font-bold text-gray-900 text-center mb-4">
        Welcome to the Discussion Forum!
      </Text>
      <Text className="text-gray-700 text-center mb-6">
        Join fellow learners, ask questions, and share knowledge.
      </Text>

      {/* WhatsApp Icon */}
      <Users size={48} color="#25D366" className="mb-6" />

      {/* Button to Join Forum */}
      <TouchableOpacity
        onPress={() => navigation.navigate('JoinForum')} 
        className="bg-indigo-800 px-6 py-3 rounded-md"
      >
        <Text className="text-white font-semibold text-lg">
          Join Discussion Forum
        </Text>
      </TouchableOpacity>
    </View>

                </View>
        
    </NavLayout>

    
  );
};

export default DiscussionForumScreen;
