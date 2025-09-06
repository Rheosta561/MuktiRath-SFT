import { View, Text, Pressable } from 'react-native'
import React from 'react'
import { Image } from 'react-native';
import { Bell, BellDotIcon, BellElectricIcon, BellIcon, BellRing, LanguagesIcon } from 'lucide-react-native';

const Navbar = () => {
  return (
    <View className='w-full px-2 pt-1 flex flex-row items-center justify-between'>
      <Image
        source={require('../assets/images/muqtirath.png')}
        style={{ width: 100, height: 50 }}
      />
      <View className='flex flex-row items-center gap-6'>
         <Pressable>
            <LanguagesIcon/>
        </Pressable>
        <Pressable>
            <BellRing size={22}/>
        </Pressable>
       
      </View>
    </View>
  )
}

export default Navbar