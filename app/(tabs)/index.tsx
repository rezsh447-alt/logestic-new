import { ScrollView, Text, View, TouchableOpacity, Pressable } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useState, useEffect } from "react";
import * as Haptics from "expo-haptics";
import { useAuthContext } from "@/lib/auth-provider";
import { ForwardApi } from "@/lib/api/forward-api";

export default function HomeScreen() {
  const colors = useColors();
  const { driver } = useAuthContext();
  const [shiftActive, setShiftActive] = useState(false);
  const [stats, setStats] = useState({ deliveries: 0, earnings: 0, distance: 0 });

  useEffect(() => {
    fetchState();
  }, []);

  const fetchState = async () => {
    try {
      const state = await ForwardApi.getState();
      setShiftActive(state.isOnline || false);
      // Update other stats if available in state
    } catch (error) {
      console.error("Error fetching state:", error);
    }
  };

  const handleStartShift = async () => {
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      // await ForwardApi.updateStatus({ online: true });
      setShiftActive(true);
    } catch (error) {
      console.error("Error starting shift:", error);
    }
  };

  const handleEndShift = async () => {
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      // await ForwardApi.updateStatus({ online: false });
      setShiftActive(false);
    } catch (error) {
      console.error("Error ending shift:", error);
    }
  };

  return (
    <ScreenContainer className="p-0">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="bg-background">
        {/* Header */}
        <View className="bg-primary px-6 pt-6 pb-8">
          <Text className="text-white text-3xl font-bold mb-2">سلام، {driver?.firstName || 'راننده'}</Text>
          <Text className="text-blue-100">امروز یک روز خوب برای تحویل است!</Text>
        </View>

        {/* Main Content */}
        <View className="px-6 pt-6 gap-6 pb-8">
          {/* Shift Status Card */}
          <View
            className="rounded-2xl p-6 border"
            style={{
              backgroundColor: colors.surface,
              borderColor: colors.border,
            }}
          >
            <View className="flex-row items-center justify-between mb-4">
              <Text className="text-lg font-semibold text-foreground">وضعیت شیفت</Text>
              <View
                className={`px-3 py-1 rounded-full ${
                  shiftActive ? "bg-success" : "bg-muted"
                }`}
              >
                <Text className="text-white text-xs font-semibold">
                  {shiftActive ? "فعال" : "غیرفعال"}
                </Text>
              </View>
            </View>

            {shiftActive ? (
              <View className="gap-3">
                <View className="flex-row justify-between">
                  <View>
                    <Text className="text-muted text-sm mb-1">سفارش‌های تحویل شده</Text>
                    <Text className="text-2xl font-bold text-foreground">{stats.deliveries}</Text>
                  </View>
                  <View>
                    <Text className="text-muted text-sm mb-1">درآمد امروز</Text>
                    <Text className="text-2xl font-bold text-success">{stats.earnings.toLocaleString()}</Text>
                  </View>
                </View>
                <Pressable
                  onPress={handleEndShift}
                  style={({ pressed }) => [
                    {
                      backgroundColor: colors.error,
                      opacity: pressed ? 0.8 : 1,
                    },
                  ]}
                  className="py-3 rounded-lg items-center justify-center mt-2"
                >
                  <Text className="text-white font-semibold">پایان شیفت</Text>
                </Pressable>
              </View>
            ) : (
              <Pressable
                onPress={handleStartShift}
                style={({ pressed }) => [
                  {
                    backgroundColor: colors.primary,
                    opacity: pressed ? 0.8 : 1,
                  },
                ]}
                className="py-3 rounded-lg items-center justify-center"
              >
                <Text className="text-white font-semibold">شروع شیفت</Text>
              </Pressable>
            )}
          </View>

          {/* Quick Stats */}
          <View className="gap-3">
            <Text className="text-lg font-semibold text-foreground">آمار امروز</Text>
            <View className="flex-row gap-3">
              <View
                className="flex-1 rounded-xl p-4 items-center justify-center"
                style={{ backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1 }}
              >
                <IconSymbol name="map.fill" size={24} color={colors.primary} />
                <Text className="text-2xl font-bold text-foreground mt-2">۲۵</Text>
                <Text className="text-xs text-muted mt-1">کیلومتر</Text>
              </View>
              <View
                className="flex-1 rounded-xl p-4 items-center justify-center"
                style={{ backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1 }}
              >
                <IconSymbol name="clock.fill" size={24} color={colors.primary} />
                <Text className="text-2xl font-bold text-foreground mt-2">۴h</Text>
                <Text className="text-xs text-muted mt-1">زمان فعالیت</Text>
              </View>
              <View
                className="flex-1 rounded-xl p-4 items-center justify-center"
                style={{ backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1 }}
              >
                <IconSymbol name="star.fill" size={24} color={colors.warning} />
                <Text className="text-2xl font-bold text-foreground mt-2">{driver?.rating || '۵.۰'}</Text>
                <Text className="text-xs text-muted mt-1">امتیاز</Text>
              </View>
            </View>
          </View>

          {/* Current Delivery */}
          {shiftActive && (
            <View className="gap-3">
              <Text className="text-lg font-semibold text-foreground">سفارش فعال</Text>
              <View
                className="rounded-2xl p-4 border"
                style={{
                  backgroundColor: colors.surface,
                  borderColor: colors.primary,
                  borderWidth: 2,
                }}
              >
                <View className="flex-row items-start justify-between mb-4">
                  <View className="flex-1">
                    <Text className="text-sm text-muted mb-1">شماره سفارش</Text>
                    <Text className="text-lg font-bold text-foreground">#FWD-2024-001</Text>
                  </View>
                  <View className="bg-success px-3 py-1 rounded-full">
                    <Text className="text-white text-xs font-semibold">در حال انتقال</Text>
                  </View>
                </View>

                <View className="gap-3 mb-4">
                  <View className="flex-row items-center gap-3">
                    <View className="w-8 h-8 rounded-full bg-primary items-center justify-center">
                      <IconSymbol name="location.fill" size={16} color="white" />
                    </View>
                    <View className="flex-1">
                      <Text className="text-xs text-muted">مبدا</Text>
                      <Text className="text-sm font-semibold text-foreground">تهران، خیابان ولیعصر</Text>
                    </View>
                  </View>

                  <View className="h-8 items-center justify-center">
                    <View className="w-0.5 h-full bg-border" />
                  </View>

                  <View className="flex-row items-center gap-3">
                    <View className="w-8 h-8 rounded-full bg-success items-center justify-center">
                      <IconSymbol name="location.fill" size={16} color="white" />
                    </View>
                    <View className="flex-1">
                      <Text className="text-xs text-muted">مقصد</Text>
                      <Text className="text-sm font-semibold text-foreground">تهران، خیابان فردوسی</Text>
                    </View>
                  </View>
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
                    <Text className="text-white font-semibold text-sm">تحویل شده</Text>
                  </Pressable>
                </View>
              </View>
            </View>
          )}

          {/* Quick Actions */}
          <View className="gap-3">
            <Text className="text-lg font-semibold text-foreground">دسترسی سریع</Text>
            <View className="flex-row gap-3">
              <Pressable
                style={({ pressed }) => [
                  {
                    backgroundColor: colors.surface,
                    opacity: pressed ? 0.7 : 1,
                    flex: 1,
                  },
                ]}
                className="py-4 rounded-xl items-center justify-center border"
              >
                <IconSymbol name="list.bullet" size={24} color={colors.primary} />
                <Text className="text-xs text-foreground mt-2 font-semibold">سفارش‌ها</Text>
              </Pressable>
              <Pressable
                style={({ pressed }) => [
                  {
                    backgroundColor: colors.surface,
                    opacity: pressed ? 0.7 : 1,
                    flex: 1,
                  },
                ]}
                className="py-4 rounded-xl items-center justify-center border"
              >
                <IconSymbol name="dollarsign.circle.fill" size={24} color={colors.success} />
                <Text className="text-xs text-foreground mt-2 font-semibold">درآمد</Text>
              </Pressable>
              <Pressable
                style={({ pressed }) => [
                  {
                    backgroundColor: colors.surface,
                    opacity: pressed ? 0.7 : 1,
                    flex: 1,
                  },
                ]}
                className="py-4 rounded-xl items-center justify-center border"
              >
                <IconSymbol name="bell.fill" size={24} color={colors.warning} />
                <Text className="text-xs text-foreground mt-2 font-semibold">اطلاعات</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
