import { ScrollView, Text, View, Pressable, FlatList, TextInput } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useState } from "react";

interface ChatMessage {
  id: string;
  sender: "driver" | "support";
  message: string;
  timestamp: string;
}

const MOCK_MESSAGES: ChatMessage[] = [
  {
    id: "1",
    sender: "support",
    message: "سلام! چطور می‌تونم کمکتون کنم؟",
    timestamp: "14:30",
  },
  {
    id: "2",
    sender: "driver",
    message: "مشکلی با پرداخت دارم",
    timestamp: "14:31",
  },
  {
    id: "3",
    sender: "support",
    message: "متأسفانه شنیدم. لطفا جزئیات بیشتر بگویید",
    timestamp: "14:32",
  },
  {
    id: "4",
    sender: "driver",
    message: "درآمد دیروز هنوز واریز نشده",
    timestamp: "14:33",
  },
];

export default function SupportScreen() {
  const colors = useColors();
  const [messages, setMessages] = useState<ChatMessage[]>(MOCK_MESSAGES);
  const [inputText, setInputText] = useState("");

  const handleSendMessage = () => {
    if (!inputText.trim()) return;

    const newMessage: ChatMessage = {
      id: `msg_${Date.now()}`,
      sender: "driver",
      message: inputText,
      timestamp: new Date().toLocaleTimeString("fa-IR", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages([...messages, newMessage]);
    setInputText("");

    // Simulate support response
    setTimeout(() => {
      const response: ChatMessage = {
        id: `msg_${Date.now()}`,
        sender: "support",
        message: "متشکریم برای پیام شما. ما بررسی خواهیم کرد.",
        timestamp: new Date().toLocaleTimeString("fa-IR", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      setMessages((prev) => [...prev, response]);
    }, 1000);
  };

  const renderMessage = ({ item }: { item: ChatMessage }) => (
    <View
      className={`flex-row mb-3 ${item.sender === "driver" ? "justify-end" : "justify-start"}`}
    >
      <View
        className={`max-w-xs rounded-2xl px-4 py-2 ${
          item.sender === "driver"
            ? "bg-primary"
            : "bg-surface border"
        }`}
        style={
          item.sender === "driver"
            ? {}
            : { borderColor: colors.border }
        }
      >
        <Text
          className={`text-sm ${
            item.sender === "driver" ? "text-white" : "text-foreground"
          }`}
        >
          {item.message}
        </Text>
        <Text
          className={`text-xs mt-1 ${
            item.sender === "driver" ? "text-blue-100" : "text-muted"
          }`}
        >
          {item.timestamp}
        </Text>
      </View>
    </View>
  );

  return (
    <ScreenContainer className="p-0">
      <View className="flex-1 bg-background">
        {/* Header */}
        <View className="bg-primary px-6 pt-6 pb-4 flex-row items-center justify-between">
          <View>
            <Text className="text-white text-2xl font-bold">پشتیبانی</Text>
            <Text className="text-blue-100 text-sm mt-1">تیم پشتیبانی آنلاین</Text>
          </View>
          <View className="w-10 h-10 rounded-full bg-white/20 items-center justify-center">
            <View className="w-3 h-3 rounded-full bg-green-400" />
          </View>
        </View>

        {/* Messages */}
        <FlatList
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 16 }}
          scrollEnabled={true}
          inverted={false}
        />

        {/* Input Area */}
        <View
          className="flex-row items-center gap-2 px-4 py-4 border-t"
          style={{ borderTopColor: colors.border }}
        >
          <Pressable
            style={({ pressed }) => [
              {
                opacity: pressed ? 0.7 : 1,
              },
            ]}
            className="p-2"
          >
            <IconSymbol name="plus.circle.fill" size={24} color={colors.primary} />
          </Pressable>

          <View
            className="flex-1 flex-row items-center px-3 py-2 rounded-full border"
            style={{
              backgroundColor: colors.surface,
              borderColor: colors.border,
            }}
          >
            <TextInput
              placeholder="پیام خود را بنویسید..."
              placeholderTextColor={colors.muted}
              value={inputText}
              onChangeText={setInputText}
              className="flex-1 text-foreground text-sm"
              style={{ color: colors.foreground }}
              multiline
              maxLength={500}
            />
          </View>

          <Pressable
            onPress={handleSendMessage}
            disabled={!inputText.trim()}
            style={({ pressed }) => [
              {
                opacity: pressed && inputText.trim() ? 0.7 : !inputText.trim() ? 0.5 : 1,
              },
            ]}
            className="p-2"
          >
            <IconSymbol
              name="paperplane.fill"
              size={24}
              color={inputText.trim() ? colors.primary : colors.muted}
            />
          </Pressable>
        </View>
      </View>
    </ScreenContainer>
  );
}
