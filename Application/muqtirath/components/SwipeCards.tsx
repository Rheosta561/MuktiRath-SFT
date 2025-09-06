import { RefreshCw, Building2, Tag } from 'lucide-react-native'
import React, { useState } from 'react'
import { View, Text, Image, Dimensions, TouchableOpacity } from 'react-native'
import { PanGestureHandler } from 'react-native-gesture-handler'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  interpolate,
  Extrapolate,
  runOnJS,
} from 'react-native-reanimated'
import Toast from 'react-native-toast-message'
import axios from 'axios'

const { width } = Dimensions.get('window')

type CardType = {
  id: string
  type: 'job' | 'order'
  image: string
  title: string
  org?: string
  paycheck?: string
  tags?: string[]
  quantity?: string

  // backend-specific fields for orders
  organisationId?: string
  items?: { productId: string; quantity: number; price: number }[]
  totalAmount?: number
  paymentMethod?: 'wallet' | 'credit_card' | 'debit_card' | 'upi' | 'cod'
}

type Props = {
  data: CardType[]
  userId: string
  backendBaseUrl: string
}

const SWIPE_THRESHOLD = 150

const SwipeCards = ({ data, userId, backendBaseUrl }: Props) => {
  const [cards, setCards] = useState(data)
  const [allCards] = useState(data)
  const translateX = useSharedValue(0)

  const showToast = (action: 'accept' | 'reject', title: string) => {
    Toast.show({
      type: action === 'accept' ? 'success' : 'error',
      text1:
        action === 'accept'
          ? `✅ Accepted: ${title}`
          : `❌ Rejected: ${title}`,
      visibilityTime: 1500,
      position: 'top',
    })
  }

  const sendToBackend = async (card: CardType) => {
    try {
      const payload = { ...card } // send full card as payload
      const response = await axios.post(
        `${backendBaseUrl}/userMarket/${userId}/add`,
        {
          type: card.type,
          payload,
        }
      )
      console.log('Backend response:', response.data)
    } catch (err) {
      console.error('Error sending to backend:', err)
    }
  }

  const handleSwipe = (dir: 'left' | 'right') => {
    const swipedCard = cards[0]
    if (!swipedCard) return

    showToast(dir === 'right' ? 'accept' : 'reject', swipedCard.title)

    if (dir === 'right') {
      runOnJS(sendToBackend)(swipedCard)
    }

    setCards((prev) => prev.slice(1))
    translateX.value = 0
  }

  const cardStyle = useAnimatedStyle(() => {
    const rotate = interpolate(
      translateX.value,
      [-width / 2, 0, width / 2],
      [-15, 0, 15],
      Extrapolate.CLAMP
    )

    return {
      transform: [{ translateX: translateX.value }, { rotate: `${rotate}deg` }],
    }
  })

  const likeStyle = useAnimatedStyle(() => ({
    opacity: interpolate(translateX.value, [0, SWIPE_THRESHOLD], [0, 1], Extrapolate.CLAMP),
    transform: [{ scale: translateX.value > 0 ? 1 : 0.9 }],
  }))

  const nopeStyle = useAnimatedStyle(() => ({
    opacity: interpolate(translateX.value, [-SWIPE_THRESHOLD, 0], [1, 0], Extrapolate.CLAMP),
    transform: [{ scale: translateX.value < 0 ? 1 : 0.9 }],
  }))

  if (cards.length === 0) {
    return (
      <View className="w-[100%] h-[55%] bg-white rounded-md shadow-lg p-6 self-center mt-2 items-center justify-center">
        <View className="bg-gray-100 p-4 rounded-full mb-4">
          <Text className="text-3xl">📭</Text>
        </View>
        <Text className="text-xl font-semibold text-gray-800 mb-2">
          No more opportunities
        </Text>
        <Text className="text-gray-500 text-center mb-6">
          You’ve reached the end. Tap below to refresh and explore more jobs & orders.
        </Text>
        <TouchableOpacity
          className="flex-row items-center gap-2 bg-black px-5 py-3 rounded-md"
          onPress={() => setCards(allCards)}
          activeOpacity={0.8}
        >
          <RefreshCw color="white" size={20} />
          <Text className="text-white font-semibold text-base">Refresh</Text>
        </TouchableOpacity>
      </View>
    )
  }

  const current = cards[0]

  return (
    <PanGestureHandler
      onGestureEvent={(e: any) => {
        translateX.value = e.nativeEvent.translationX
      }}
      onEnded={(e: any) => {
        if (e.nativeEvent.translationX > SWIPE_THRESHOLD) {
          translateX.value = withTiming(width, { duration: 200 }, () =>
            runOnJS(handleSwipe)('right')
          )
        } else if (e.nativeEvent.translationX < -SWIPE_THRESHOLD) {
          translateX.value = withTiming(-width, { duration: 200 }, () =>
            runOnJS(handleSwipe)('left')
          )
        } else {
          translateX.value = withSpring(0)
        }
      }}
    >
      <Animated.View
        className="w-[100%] h-[53%] bg-white rounded-md shadow-lg p-4 self-center mt-2"
        style={cardStyle}
      >
        {/* Swipe labels */}
        <Animated.View
          style={likeStyle}
          className="absolute top-6 left-6 px-4 py-2 border-2 border-green-500 rounded-lg"
        >
          <Text className="text-green-800 font-bold text-lg">ACCEPT</Text>
        </Animated.View>
        <Animated.View
          style={nopeStyle}
          className="absolute top-6 right-6 px-4 py-2 border-2 border-red-500 rounded-lg"
        >
          <Text className="text-red-800 font-bold text-lg">REJECT</Text>
        </Animated.View>

        {/* Card Image */}
        <Image
          source={{ uri: current.image }}
          className="w-full h-48 rounded-md mb-4"
          resizeMode="cover"
        />

        {/* Card Content */}
        {current.type === 'job' ? (
          <View>
            <Text className="text-xl font-bold">{current.title}</Text>
            <View className="flex-row items-center mt-1">
              <Building2 size={16} color="#4B5563" />
              <Text className="text-gray-600 ml-1">{current.org}</Text>
            </View>
            <Text className="text-green-900 font-semibold mt-1">{current.paycheck}</Text>
            <View className="flex-row flex-wrap mt-2">
              {current.tags?.map((tag) => (
                <View
                  key={tag}
                  className="flex-row items-center mr-2 mb-2 px-2 py-1 bg-gray-200 rounded-md"
                >
                  <Tag size={14} color="#4B5563" />
                  <Text className="ml-1 text-sm text-gray-700">{tag}</Text>
                </View>
              ))}
            </View>
          </View>
        ) : (
          <View>
            <Text className="text-xl font-bold">{current.title}</Text>
            <View className="flex-row items-center mt-1">
              <Building2 size={16} color="#4B5563" />
              <Text className="text-gray-600 ml-1">{current.org}</Text>
            </View>
            <Text className="text-gray-700 mt-1">
              Quantity: <Text className="font-semibold">{current.quantity}</Text>
            </Text>
            <View className="flex-row flex-wrap mt-2">
              {current.tags?.map((tag) => (
                <View
                  key={tag}
                  className="flex-row items-center mr-2 mb-2 px-2 py-1 bg-gray-200 rounded-md"
                >
                  <Tag size={14} color="#4B5563" />
                  <Text className="ml-1 text-sm text-gray-700">{tag}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Action buttons */}
        <View className="flex-row justify-between mt-2">
          <TouchableOpacity
            className="flex-1 mr-2 bg-red-100 py-2 rounded-md items-center"
            onPress={() => handleSwipe('left')}
          >
            <Text className="text-red-600 font-semibold">Reject</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="flex-1 ml-2 bg-green-100 py-2 rounded-md items-center"
            onPress={() => handleSwipe('right')}
          >
            <Text className="text-green-600 font-semibold">
              {current.type === 'job' ? 'Apply' : 'Accept'}
            </Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </PanGestureHandler>
  )
}

export default SwipeCards
