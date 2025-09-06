
import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  TextInput,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { X } from "lucide-react-native";
import axios from "axios";

type Message = {
  id: string;
  text: string;
  sender: "user" | "bot";
};

type Props = {
    uri : string ;
  visible: boolean;
  onClose: () => void;
};

const ChatModal: React.FC<Props> = ({ visible, onClose , uri }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "0",
      text: "Hi! If you have any doubts, I can help you here.",
      sender: "bot",
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);

  const flatListRef = useRef<FlatList>(null);

  const sendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: "user",
    };
    setMessages((prev) => [...prev, userMessage]);
    setInputText("");
    setLoading(true);

    try {

      const response = await axios.post("http://10.0.16.175:8080/chat", {
        uri: "https://www.youtube.com/watch?v=YF2Fg_zdwcw",
        input: inputText,
      });

      let botText: string = response.data.answer || "Sorry, I couldn't find an answer.";

      // Formatting: **bold** → bold, \n → line break
      botText = botText.replace(/\*\*(.*?)\*\*/g, (_, p1) => `<b>${p1}</b>`);

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: botText,
        sender: "bot",
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      console.error(err);
      const errorMessage: Message = {
        id: (Date.now() + 2).toString(),
        text: "Error fetching answer. Try again.",
        sender: "bot",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  // Auto scroll to bottom on new messages
  useEffect(() => {
    flatListRef.current?.scrollToEnd({ animated: true });
  }, [messages, loading]);

  // Function to render formatted text
  const renderFormattedText = (text: string) => {
    const lines = text.split("\\n"); // split by newline
    return lines.map((line, idx) => {
      const parts = line.split(/(<b>.*?<\/b>)/g); // split by bold
      return (
        <Text key={idx} style={{ lineHeight: 20 }}>
          {parts.map((part, i) =>
            part.startsWith("<b>") && part.endsWith("</b>") ? (
              <Text key={i} style={{ fontWeight: "bold" }}>
                {part.replace(/<\/?b>/g, "")}
              </Text>
            ) : (
              <Text key={i}>{part}</Text>
            )
          )}
          {"\n"}
        </Text>
      );
    });
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View className="flex-1 bg-black/50 justify-end">
        <View className="bg-white h-3/4 rounded-t-lg p-4">
          {/* Header */}
          <View className="flex-row justify-between items-center mb-2">
            <Text className="text-lg font-bold">Ask Doubts</Text>
            <TouchableOpacity onPress={onClose}>
              <X size={24} color="black" />
            </TouchableOpacity>
          </View>

          {/* Messages */}
          <FlatList
            ref={flatListRef}
            data={messages}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View
                className={`py-2 px-3 my-1 rounded-lg max-w-3/4 ${
                  item.sender === "user" ? "bg-indigo-600 self-end" : "bg-gray-200 self-start"
                }`}
              >
                <Text
                  style={{ color: item.sender === "user" ? "white" : "black" }}
                >
                  {item.sender === "bot"
                    ? renderFormattedText(item.text)
                    : item.text}
                </Text>
              </View>
            )}
          />

          {loading && (
            <View className="py-2">
              <ActivityIndicator size="small" color="#4F46E5" />
            </View>
          )}

          {/* Input */}
          <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined}>
            <View className="flex-row text-black items-center border border-gray-300 rounded-md px-3 py-3 mt-2">
              <TextInput
                className="flex-1 text-black"
                placeholder="Type your doubt..."
                value={inputText}
                onChangeText={setInputText}
              />
              <TouchableOpacity
                onPress={sendMessage}
                className="ml-2 bg-indigo-900 rounded-md px-4 py-2"
              >
                <Text className="text-white font-semibold">Send</Text>
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </View>
      </View>
    </Modal>
  );
};

export default ChatModal;
