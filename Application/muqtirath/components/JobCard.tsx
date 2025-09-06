import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { MapPin, Briefcase, Building2 } from "lucide-react-native";

type JobCardProps = {
  title: string;
  organisation: string;
  imageUrl: string;
  tags: string[];
  salary: string;
  location: string;
  onApply: () => void;
};

const JobCard: React.FC<JobCardProps> = ({
  title,
  organisation,
  imageUrl,
  tags,
  salary,
  location,
  onApply,
}) => {
  return (
    <View className="bg-white rounded-md shadow-md  overflow-hidden">
      {/* Job Image with overlay button */}
      <View className="relative">
        <Image
          source={{ uri: imageUrl }}
          className="w-full h-40"
          resizeMode="cover"
        />
        <TouchableOpacity
          onPress={onApply}
          className="absolute bottom-2 right-2 bg-zinc-50 px-4 py-2 rounded-md"
        >
          <Text className="text-zinc-950 font-semibold text-sm">Apply</Text>
        </TouchableOpacity>
      </View>

      {/* Job Details */}
      <View className="p-4">
        {/* Title */}
        <Text className="text-lg font-bold">{title}</Text>

        {/* Organisation */}
        <View className="flex-row items-center mb-2">
          <Building2 size={16} color="gray" />
          <Text className="ml-2 text-gray-600 text-sm">{organisation}</Text>
        </View>

        {/* Tags */}
        <View className="flex-row flex-wrap mb-2">
          {tags.map((tag, idx) => (
            <View
              key={idx}
              className="bg-gray-100 px-3 py-1 rounded-md mr-2 mb-2"
            >
              <Text className="text-gray-600 text-sm">{tag}</Text>
            </View>
          ))}
        </View>

        {/* Salary & Location */}
        <View className="flex-row justify-between items-center">
          <View className="flex-row items-center">
            <Briefcase size={18} color="black" />
            <Text className="ml-2 font-medium">{salary}</Text>
          </View>
          <View className="flex-row items-center">
            <MapPin size={18} color="gray" />
            <Text className="ml-1 text-gray-600">{location}</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default JobCard;
