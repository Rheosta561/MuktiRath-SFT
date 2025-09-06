import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { Calendar } from 'lucide-react-native'
import { AnimatedCircularProgress } from 'react-native-circular-progress'
import { format } from 'date-fns'
import { useNavigation } from '@react-navigation/native'

import { courseContent } from '@/constants'

type Props = {
  course: courseContent
  completedModules: string[]
  progress: {
    completed: number
    total: number
    percentage: number
  }
}

const CourseDisplay: React.FC<Props> = ({ course, completedModules, progress }) => {
  const navigation = useNavigation<any>()  // type safe if you use TS types for navigation

  // Use backend progress directly
  const completedModulesCount = completedModules.length
  const totalModules = course.content.length
  const progressPercentage = progress.percentage || 0

  // Format today's date
  const today = format(new Date(), "do MMMM | EEEE")

  return (
    <View className='h-56 w-full bg-white rounded-md p-2'>
      {/* Date */}
      <View className='h-10 flex w-full'>
        <View className='h-full w-1/2 items-center flex-row p-2 gap-2'>
          <Calendar size={20} color="black" />
          <Text className='text-black font-semibold text-sm'>{today}</Text>
        </View>
      </View>

      {/* Course Progress */}
      <View className="h-2/3 -mt-4 p-2 w-full flex gap-2 flex-row px-2">
        {/* Circular Progress Ring */}
        <View className="h-full w-1/3 justify-center items-center">
          <AnimatedCircularProgress
            size={90}
            width={8}
            fill={progressPercentage}
            tintColor="#2C2CA5"
            backgroundColor="#e5e7eb"
          >
            {(fill: number) => (
              <Text className="text-black font-semibold">
                {`${Math.round(fill)}%`}
              </Text>
            )}
          </AnimatedCircularProgress>
        </View>

        {/* Right side content */}
        <View className="h-full w-2/3 px-2 py-5">
          <Text className="text-black font-semibold text-base">{course.title}</Text>
          <Text className="text-gray-700 text-sm font-semibold">
            {completedModulesCount}/{totalModules} Modules Covered
          </Text>

          {/* Continue Button */}
          <TouchableOpacity
            className="mt-2 bg-indigo-800 rounded-md px-3 py-1 w-2/3 items-center"
            onPress={() =>
              navigation.navigate("CoursePlayer", {
                userCourse: {
                  _id: course.id, // use course._id from backend
                  completedModules,
                  course,
                  progress,
                  watchedTill: {},
                },
              })
            }
          >
            <Text className="text-white font-semibold text-sm">Continue</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Tags + Enrolled */}
      <View className="flex flex-row justify-between items-center px-2">
        <View className="flex flex-row flex-wrap gap-1">
          {course.tags.slice(0, 3).map((tag, idx) => (
            <View key={idx} className="bg-gray-200 rounded-md px-2 py-0.5">
              <Text className="text-xs text-gray-800">{tag}</Text>
            </View>
          ))}
          {course.tags.length > 3 && (
            <View className="bg-gray-300 rounded-md px-2 py-0.5">
              <Text className="text-xs text-gray-700">+{course.tags.length - 3}</Text>
            </View>
          )}
        </View>
        <Text className="text-gray-600 text-xs font-semibold">
          {course.enrolledStudents.toLocaleString()} enrolled
        </Text>
      </View>
    </View>
  )
}

export default CourseDisplay
