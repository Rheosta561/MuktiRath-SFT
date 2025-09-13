import { View, Text, Pressable, Image } from 'react-native';
import React, { useState } from 'react';
import { LanguagesIcon, ChevronDown, ChevronUp, BellRing } from 'lucide-react-native';
import { useTranslation } from '@/Context/TranslatationContext';

interface LanguageOption {
  code: string;
  label: string;
}

// Indian languages + English as default
const languages: LanguageOption[] = [
  { code: 'en', label: 'English' },
  { code: 'hi', label: 'Hindi' },
  { code: 'bn', label: 'Bengali' },
  { code: 'ta', label: 'Tamil' },
  { code: 'te', label: 'Telugu' },
  { code: 'ml', label: 'Malayalam' },
  { code: 'mr', label: 'Marathi' },
];

const Navbar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { language, setLanguage } = useTranslation();

  const handleSelectLanguage = (langCode: string) => {
    setLanguage(langCode);
    setDropdownOpen(false);
  };

  // Default to English if language not set
  const selectedLanguage = languages.find((l) => l.code === language) || languages[0];

  return (
    <View className="w-full px-2 pt-1 flex-row items-center justify-between">
      <Image
        source={require('../assets/images/muqtirath.png')}
        className="w-24 h-12"
      />
      <View className="flex-row items-center gap-4 relative">
        {/* Language Dropdown */}
        <Pressable
          className="flex-row items-center gap-1 px-2 py-1 border rounded-md border-gray-300"
          onPress={() => setDropdownOpen(!dropdownOpen)}
        >
          <LanguagesIcon />
          <Text className="ml-1">{selectedLanguage.label}</Text>
          {dropdownOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </Pressable>

        {dropdownOpen && (
          <View className="absolute top-10 right-0 bg-white border border-gray-300 rounded-md w-32 z-50">
            {languages.map((lang) => (
              <Pressable
                key={lang.code}
                className="flex-row items-center px-3 py-2 active:bg-gray-100"
                onPress={() => handleSelectLanguage(lang.code)}
              >
                <Text className="text-sm">{lang.label}</Text>
              </Pressable>
            ))}
          </View>
        )}

        <Pressable>
          <BellRing size={22} />
        </Pressable>
      </View>
    </View>
  );
};

export default Navbar;
