import React, { useEffect, useState } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  FlatList,
  ActivityIndicator,
} from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import axios from 'axios'
import {
  ArrowLeft,
  CheckCircle,
  XCircle,
  Package,
  Building2,
} from 'lucide-react-native'
import { useNavigation } from '@react-navigation/native'
import Constants from 'expo-constants'
import {jwtDecode} from 'jwt-decode'

type Organisation = {
  id: string
  name: string
  number?: string
}

type OrderItem = {
  productId: {
    _id: string
    name: string
    imageUrl: string
    price: number
  }
  quantity: number
  price: number
}

type OrderType = {
  id: string
  title: string
  image: string
  items: OrderItem[]
  totalAmount: number
  paymentMethod: string
  organisation?: Organisation
  status: 'pending' | 'completed' | 'rejected'
}

interface User {
  _id: string
  phone?: number
  password?: string
}

interface JwtPayloadWithUser {
  exp: number
  iat: number
  user: User
}

const backendUrl = Constants.expoConfig?.extra?.backendUrl

const MyOrdersScreen = () => {
  const navigation = useNavigation()
  const [activeTab, setActiveTab] = useState<'pending' | 'completed' | 'rejected'>('pending')
  const [orders, setOrders] = useState<OrderType[]>([])
  const [loading, setLoading] = useState(true)
  const [userId, setUserId] = useState<string | null>(null)

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        // ✅ Get token and decode userId
        const token = await AsyncStorage.getItem('userToken')
        if (!token) {
          console.warn('User token not found in AsyncStorage')
          setLoading(false)
          return
        }

        const decoded = jwtDecode<JwtPayloadWithUser>(token)
        const uid = decoded.user._id
        setUserId(uid)

        // Fetch orders
        const response = await axios.get(`${backendUrl}/userMarket/${uid}/getMyOrder`)

        const formattedOrders: OrderType[] = response.data.orders.map((order: any) => ({
          id: order._id,
          title: `Order: ${order.items.length} item(s)`,
          image: order.items[0]?.productId?.imageUrl || 'https://via.placeholder.com/150',
          items: order.items,
          totalAmount: order.totalAmount,
          paymentMethod: order.paymentMethod,
          organisation: {
            id: order.organisationId || '',
            name: order.organisation?.name || 'Unknown',
            number: order.organisation?.number || '',
          },
          status: order.status || 'pending',
        }))

        console.log(formattedOrders);

        setOrders(formattedOrders)
      } catch (err) {
        console.error('Error fetching orders:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [])

  // Accept / Reject order
  const updateOrderStatus = async (id: string, status: 'completed' | 'rejected') => {
  if (!userId) return
  try {
    const order = orders.find((o) => o.id === id)
    if (!order) return


    const endpoint = status === 'completed' ? 'accept' : 'reject'

    await axios.put(`${backendUrl}/orders/${order.id}/${endpoint}`, {
      type: 'order',
      payload: { id: order.id },
    })

    // update local state
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)))
  } catch (err) {
    console.error('Error updating order status:', err)
  }
}


  const handleAccept = (id: string) => updateOrderStatus(id, 'completed')
  const handleReject = (id: string) => updateOrderStatus(id, 'rejected')

  const filteredOrders = orders.filter((order) => order.status === activeTab)

  const renderOrder = ({ item }: { item: OrderType }) => (
    <View className="bg-white shadow-md rounded-md p-4 mb-4">
      <View className="flex-row items-center">
        <Image
          source={{ uri: item.image }}
          className="w-16 h-16 rounded-md"
          resizeMode="cover"
        />
        <View className="ml-4 flex-1">
          <Text className="text-lg font-semibold text-gray-800">{item.title}</Text>
          <Text className="text-sm text-gray-500">
            Total: ₹{item.totalAmount} • Payment: {item.paymentMethod}
          </Text>
          {item.organisation && (
            <View className="flex-row items-center mt-1">
              <Building2 size={16} color="#4B5563" />
              <Text className="ml-1 text-gray-700 font-medium">{item.organisation.name}</Text>
            </View>
          )}
          {item.organisation?.number && (
            <Text className="text-xs text-gray-500">Contact: {item.organisation.number}</Text>
          )}
        </View>
      </View>

      {item.status === 'pending' && (
        <View className="flex-row justify-end gap-3 mt-4">
          <TouchableOpacity
            onPress={() => handleAccept(item.id)}
            className="flex-row items-center bg-green-600 px-3 py-2 rounded-md"
          >
            <CheckCircle size={20} color="#fff" />
            <Text className="ml-1 text-white font-medium">Accept</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleReject(item.id)}
            className="flex-row items-center bg-red-600 px-3 py-2 rounded-md"
          >
            <XCircle size={20} color="#fff" />
            <Text className="ml-1 text-white font-medium">Reject</Text>
          </TouchableOpacity>
        </View>
      )}

      {item.status === 'completed' && (
        <Text className="mt-3 text-green-600 font-medium">✅ Completed</Text>
      )}

      {item.status === 'rejected' && (
        <Text className="mt-3 text-red-600 font-medium">❌ Rejected</Text>
      )}
    </View>
  )

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color="#111" />
        <Text className="mt-2 text-gray-700">Loading orders...</Text>
      </View>
    )
  }

  return (
    <View className="flex-1 bg-gray-100 p-6 pt-16">
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        className="flex-row items-center mb-6"
      >
        <ArrowLeft size={28} color="#111" />
        <Text className="ml-2 text-lg font-medium text-gray-800">Back</Text>
      </TouchableOpacity>

      <Text className="text-2xl font-bold text-gray-800 mb-6">My Orders</Text>

      <View className="flex-row mb-6 justify-around">
        {(['pending', 'completed', 'rejected'] as const).map((tab) => (
          <TouchableOpacity
            key={tab}
            onPress={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-md ${
              activeTab === tab ? 'bg-zinc-900' : 'bg-white'
            }`}
          >
            <Text
              className={`text-sm font-medium ${
                activeTab === tab ? 'text-white' : 'text-gray-800'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {filteredOrders.length > 0 ? (
        <FlatList
          data={filteredOrders}
          renderItem={renderOrder}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View className="flex-1 items-center justify-center">
          <Package size={64} color="#9ca3af" />
          <Text className="text-gray-500 mt-2">No {activeTab} orders</Text>
        </View>
      )}
    </View>
  )
}

export default MyOrdersScreen
