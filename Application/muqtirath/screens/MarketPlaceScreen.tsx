import { View, ScrollView, Dimensions } from 'react-native'
import { Text } from '@/components/AutoTranslateText'
import React, { useRef, useState, useEffect } from 'react'
import NavLayout from '@/components/NavLayout'
import MarketplaceNavbar from '@/components/MarketplaceNavbar'
import PromoCard from '@/components/PromoCard'
import SwipeCards from '@/components/SwipeCards'
import AsyncStorage from '@react-native-async-storage/async-storage'
import Constants from 'expo-constants'
import axios from 'axios'

const { width } = Dimensions.get('window')
const backendUrl = Constants.expoConfig?.extra?.backendUrl

const promos = [
  {
    id: 'promo1',
    imageUrl:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTLx_PhrZEa81NhAqE9EeY0CH_sJG1dn6eGNg&s',
    title: 'Empowering Skills',



    
    description: 'Helping marginalized communities gain new skills for sustainable livelihoods.',
  },
  {
    id: 'promo2',
    imageUrl:
      'https://pmay-urban.gov.in/uploads/galleryphoto/Anita%20Dakar_State%20Name-%20Meghalaya_City%20Name-Nongpoh.jpeg',
    title: 'Inclusive Opportunities',
    description: 'Providing training, support, and access to resources for every community member.',
  },
]

const MarketPlaceScreen = () => {
  const scrollRef = useRef<ScrollView>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const [userId, setUserId] = useState<string | null>(null)
  const [cards, setCards] = useState<any[]>([]) // cards from orders API

  // Fetch userId from AsyncStorage
  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken')
        if (token) {
          const parsed = JSON.parse(atob(token.split('.')[1]))
          setUserId(parsed.user._id)
        }
      } catch (err) {
        console.error('Failed to get userId:', err)
      }
    }
    fetchUserId()
  }, [])

  // Fetch orders from backend and map to card format
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get(`${backendUrl}/orders/allOrders`)
        const orders = res.data.orders || []

        // Map orders to swipeable cards
        const mappedCards = orders.flatMap((order: any) =>
          order.items.map((item: any) => ({
            id: item._id,
            type: 'order' as const,
            image: item.productId.imageUrl,
            title: item.productId.name,
            org: order.organisationId?.name,
            quantity: `${item.quantity} units`,
            tags: item.productId.tags,
            totalAmount: order.totalAmount,
            paymentMethod: order.paymentMethod,
            organisationId: order.organisationId?._id,
            organistationName: order.organisationId?.name,
            items: [
              {
                productId: item.productId._id,
                quantity: item.quantity,
                price: item.price,
              },
            ],
          }))
        )

        setCards(mappedCards)
      } catch (err) {
        console.error('Failed to fetch orders:', err)
      }
    }
    fetchOrders()
  }, [])

  // Promo auto-scroll
  useEffect(() => {
    const interval = setInterval(() => {
      let nextIndex = (activeIndex + 1) % promos.length
      scrollRef.current?.scrollTo({ x: nextIndex * width, animated: true })
      setActiveIndex(nextIndex)
    }, 3000)
    return () => clearInterval(interval)
  }, [activeIndex])

  const handleScroll = (event: any) => {
    const slide = Math.round(event.nativeEvent.contentOffset.x / width)
    setActiveIndex(slide)
  }

  return (
    <View className="flex-1 bg-white">
      <NavLayout>
        <MarketplaceNavbar />

        {/* Promo Section */}
        <View className="rounded-md overflow-hidden p-2 bg-[#f5f5f5] -mt-4 relative">
          <ScrollView
            ref={scrollRef}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={handleScroll}
            scrollEventThrottle={20}
          >
            {promos.map((promo) => (
              <View key={promo.id} style={{ width }} className="h-fit">
                <PromoCard
                  {...promo}
                  buttonText="Learn More"
                  buttonLink="https://example.com"
                />
              </View>
            ))}
          </ScrollView>

          {/* Pagination Dots */}
          <View className="absolute bottom-5 left-0 right-0 flex-row justify-center items-center">
            {promos.map((_, index) => (
              <View
                key={index}
                className={`h-2 w-2 mx-1 rounded-full ${
                  index === activeIndex ? 'bg-white' : 'bg-gray-500'
                }`}
              />
            ))}
          </View>
        </View>

        {/* Instructions */}
        <View className="px-4 mt-2">
          <Text className="text-sm font-semibold text-gray-800 text-center">
            Swipe right to accept, swipe left to reject.
          </Text>
          <Text className="text-xs text-gray-500 text-center mt-1">
            Browse through bulk orders easily.
          </Text>
        </View>

        {/* Swipeable Cards Section */}
        {userId && cards.length > 0 && (
          <SwipeCards data={cards} userId={userId} backendBaseUrl={backendUrl!} />
        )}
      </NavLayout>
    </View>
  )
}

export default MarketPlaceScreen
