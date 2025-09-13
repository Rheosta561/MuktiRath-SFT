import { View, TouchableOpacity, Image } from 'react-native'
import { Text } from '@/components/AutoTranslateText'
import React from 'react'
import { Wallet, ShoppingBag } from 'lucide-react-native'
import { useNavigation } from '@react-navigation/native'

const MarketplaceNavbar = () => {
  const iconSize = 24
  const navigation = useNavigation()

  return (
    <View className="flex-row items-center justify-between w-full -mt-6">
      {/* Logo */}
      <Image
        source={require('../assets/images/udyog.png')}
        className="w-24 h-24"
        resizeMode="contain"
      />

      {/* Right Side Buttons */}
      <View className="flex-row items-center gap-3">
        <TouchableOpacity
          className="flex-row items-center gap-2 border border-zinc-600 bg-white rounded-md px-3 py-1"
          onPress={() => navigation.navigate('MyOrders')}
        >
          <ShoppingBag size={iconSize} color="#000" />
          <Text className="text-base font-semibold text-gray-800">My Orders</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="rounded-md border-zinc-600 bg-white p-2"
          onPress={() => navigation.navigate('Wallet')}
        >
          <Wallet size={iconSize + 4} color="#000" />
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default MarketplaceNavbar
