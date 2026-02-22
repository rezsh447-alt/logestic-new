import { ScrollView, Text, View, Pressable } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useState } from "react";

export default function TrackingScreen() {
  const colors = useColors();
  const [isTracking, setIsTracking] = useState(true);

  return (
    <ScreenContainer className="p-0">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="bg-background">
        {/* Header */}
        <View className="bg-primary px-6 pt-6 pb-4">
          <Text className="text-white text-3xl font-bold">ردیابی زنده</Text>
          <Text className="text-blue-100 text-sm mt-1">
            {isTracking ? "ردیابی فعال است" : "ردیابی غیرفعال"}
          </Text>
        </View>

        {/* Main Content */}
        <View className="px-6 pt-6 gap-6 pb-8">
          {/* Map Placeholder */}
          <View
            className="w-full h-64 rounded-2xl items-center justify-center border"
            style={{
              backgroundColor: colors.surface,
              borderColor: colors.border,
            }}
          >
            <IconSymbol name="map.fill" size={48} color={colors.muted} />
            <Text className="text-muted text-center mt-4 text-sm">
              نقشه در اینجا نمایش داده می‌شود
            </Text>
          </View>

          {/* Current Location Info */}
          <View
            className="rounded-2xl p-4 border"
            style={{
              backgroundColor: colors.surface,
              borderColor: colors.border,
            }}
          >
            <Text className="text-lg font-semibold text-foreground mb-4">موقعیت فعلی</Text>

            <View className="gap-3">
              <View className="flex-row items-center justify-between">
                <Text className="text-muted text-sm">عرض جغرافیایی</Text>
                <Text className="text-foreground font-semibold">35.7595°</Text>
              </View>
              <View className="flex-row items-center justify-between">
                <Text className="text-muted text-sm">طول جغرافیایی</Text>
                <Text className="text-foreground font-semibold">51.3801°</Text>
              </View>
              <View className="flex-row items-center justify-between">
                <Text className="text-muted text-sm">دقت</Text>
                <Text className="text-foreground font-semibold">±15 متر</Text>
              </View>
              <View className="flex-row items-center justify-between">
                <Text className="text-muted text-sm">سرعت</Text>
                <Text className="text-foreground font-semibold">32 کیلومتر بر ساعت</Text>
              </View>
            </View>
          </View>

          {/* Trip Statistics */}
          <View
            className="rounded-2xl p-4 border"
            style={{
              backgroundColor: colors.surface,
              borderColor: colors.border,
            }}
          >
            <Text className="text-lg font-semibold text-foreground mb-4">آمار سفر</Text>

            <View className="gap-3">
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center gap-2">
                  <IconSymbol name="map.fill" size={18} color={colors.primary} />
                  <Text className="text-muted text-sm">فاصله طی شده</Text>
                </View>
                <Text className="text-foreground font-semibold">12.5 کیلومتر</Text>
              </View>

              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center gap-2">
                  <IconSymbol name="clock.fill" size={18} color={colors.primary} />
                  <Text className="text-muted text-sm">زمان سفر</Text>
                </View>
                <Text className="text-foreground font-semibold">45 دقیقه</Text>
              </View>

              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center gap-2">
                  <IconSymbol name="location.fill" size={18} color={colors.primary} />
                  <Text className="text-muted text-sm">مقصد</Text>
                </View>
                <Text className="text-foreground font-semibold">2.3 کیلومتر</Text>
              </View>

              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center gap-2">
                  <IconSymbol name="clock.fill" size={18} color={colors.primary} />
                  <Text className="text-muted text-sm">زمان تخمینی</Text>
                </View>
                <Text className="text-foreground font-semibold">8 دقیقه</Text>
              </View>
            </View>
          </View>

          {/* Delivery Address */}
          <View
            className="rounded-2xl p-4 border"
            style={{
              backgroundColor: colors.surface,
              borderColor: colors.border,
            }}
          >
            <Text className="text-lg font-semibold text-foreground mb-4">آدرس تحویل</Text>

            <View className="gap-2 mb-4">
              <Text className="text-sm text-muted">خیابان فردوسی، تهران</Text>
              <Text className="text-sm text-foreground font-semibold">
                پلاک ۱۲۳، واحد ۵
              </Text>
            </View>

            <View className="flex-row gap-2">
              <Pressable
                style={({ pressed }) => [
                  {
                    backgroundColor: colors.primary,
                    opacity: pressed ? 0.8 : 1,
                    flex: 1,
                  },
                ]}
                className="py-2.5 rounded-lg items-center justify-center"
              >
                <IconSymbol name="map.fill" size={18} color="white" />
              </Pressable>
              <Pressable
                style={({ pressed }) => [
                  {
                    backgroundColor: colors.primary,
                    opacity: pressed ? 0.8 : 1,
                    flex: 1,
                  },
                ]}
                className="py-2.5 rounded-lg items-center justify-center"
              >
                <IconSymbol name="phone.fill" size={18} color="white" />
              </Pressable>
              <Pressable
                style={({ pressed }) => [
                  {
                    backgroundColor: colors.success,
                    opacity: pressed ? 0.8 : 1,
                    flex: 2,
                  },
                ]}
                className="py-2.5 rounded-lg items-center justify-center"
              >
                <Text className="text-white font-semibold text-sm">رسیده‌ام</Text>
              </Pressable>
            </View>
          </View>

          {/* Tracking Controls */}
          <View className="gap-2">
            <Pressable
              onPress={() => setIsTracking(!isTracking)}
              style={({ pressed }) => [
                {
                  backgroundColor: isTracking ? colors.error : colors.success,
                  opacity: pressed ? 0.8 : 1,
                },
              ]}
              className="py-3 rounded-lg items-center justify-center"
            >
              <Text className="text-white font-semibold">
                {isTracking ? "متوقف کردن ردیابی" : "شروع ردیابی"}
              </Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
