import { View, Text } from 'react-native'
import React from 'react'
import Navbar from './Navbar'

const NavLayout = ({children}: {children:React.ReactNode}) => {
  return (
    <View className='p-4 mt-6 '>

        <Navbar/>
        <View >
          {children}
        </View>
    </View>
  )
}

export default NavLayout