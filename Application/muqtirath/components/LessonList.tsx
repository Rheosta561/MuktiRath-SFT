import React from "react";
import { View } from "react-native";
import LessonItem from "./LessonItem";

import { CourseContentItem } from "@/constants";

type Props = {
  lessons: CourseContentItem[];
  completedModules: string[];
  selectedLessonId: string;
  onSelect: (lesson: CourseContentItem) => void;
};

const LessonList: React.FC<Props> = ({
  lessons,
  completedModules,
  selectedLessonId,
  onSelect,
}) => {
  return (
    <View className="p-2">
      {lessons.map((lesson) => (
        <LessonItem
          key={lesson._id}
          lesson={lesson}
          isCompleted={completedModules.includes(lesson._id)}
          isActive={lesson._id === selectedLessonId}
          onPress={() => onSelect(lesson)}
        />
      ))}
    </View>
  );
};

export default LessonList;
