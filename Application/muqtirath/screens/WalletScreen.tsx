import { View, Text, TouchableOpacity, FlatList } from 'react-native'
import React, { useState } from 'react'
import { ArrowLeft, ArrowDownCircle } from 'lucide-react-native'
import { useNavigation } from '@react-navigation/native'

const WalletScreen = () => {
  const [balance] = useState(2500) // Example balance
  const navigation = useNavigation()

  // Example credited transactions
  const transactions = [
    { id: '1', amount: 500, date: '2025-09-01' },
    { id: '2', amount: 1000, date: '2025-08-28' },
    { id: '3', amount: 200, date: '2025-08-20' },
  ]

  const renderTransaction = ({ item }: any) => (
    <View className="flex-row items-center justify-between bg-white shadow-sm rounded-md p-4 mb-3">
      <View className="flex-row items-center">
        <ArrowDownCircle size={28} color="#16a34a" />
        <View className="ml-3">
          <Text className="text-base font-semibold text-gray-800">
            Credited ₹{item.amount}
          </Text>
          <Text className="text-sm text-gray-500">{item.date}</Text>
        </View>
      </View>
      <Text className="text-green-600 font-semibold">+ ₹{item.amount}</Text>
    </View>
  )

  return (
    <View className="flex-1 bg-gray-100 p-6 pt-16">
      {/* Back Button */}
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        className="flex-row items-center mb-6"
      >
        <ArrowLeft size={28} color="#111" />
        <Text className="ml-2 text-lg font-medium text-gray-800">Back</Text>
      </TouchableOpacity>

      {/* Wallet Title */}
      <Text className="text-2xl font-bold text-gray-800 mb-8">My Wallet</Text>

      {/* Balance Card */}
      <View className="bg-white shadow-md rounded-md p-6 mb-6">
        <Text className="text-lg text-gray-500">Current Balance</Text>
        <Text className="text-5xl font-extrabold text-gray-900 mt-2">
          ₹ {balance.toLocaleString()}
        </Text>
      </View>

      {/* Transactions */}
      <Text className="text-lg font-semibold text-gray-800 mb-4">
        Recent Transactions
      </Text>
      <FlatList
        data={transactions}
        renderItem={renderTransaction}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
      />
    </View>
  )
}

export default WalletScreen
