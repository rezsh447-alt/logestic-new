import { ScrollView, Text, View, Pressable, FlatList } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useState, useEffect } from "react";
import { ForwardApi } from "@/lib/api/forward-api";
import { ActivityIndicator } from "react-native";

interface EarningRecord {
  id: string;
  date: string;
  amount: number;
  deliveries: number;
  distance: number;
  time: number;
}

const MOCK_EARNINGS: EarningRecord[] = [
  {
    id: "1",
    date: "امروز",
    amount: 240000,
    deliveries: 8,
    distance: 25.5,
    time: 240,
  },
  {
    id: "2",
    date: "دیروز",
    amount: 195000,
    deliveries: 6,
    distance: 18.2,
    time: 180,
  },
  {
    id: "3",
    date: "۲۷ بهمن",
    amount: 280000,
    deliveries: 9,
    distance: 31.0,
    time: 270,
  },
  {
    id: "4",
    date: "۲۶ بهمن",
    amount: 165000,
    deliveries: 5,
    distance: 14.5,
    time: 150,
  },
];

export default function EarningsScreen() {
  const colors = useColors();
  const [period, setPeriod] = useState<"daily" | "weekly" | "monthly">("daily");
  const [earnings, setEarnings] = useState<EarningRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchEarnings();
  }, []);

  const fetchEarnings = async () => {
    try {
      setIsLoading(true);
      const response = await ForwardApi.getSalaryList();
      // Map real data to EarningRecord interface
      const mappedEarnings: EarningRecord[] = (response.items || []).map((item: any) => ({
        id: item.id.toString(),
        date: item.datePersian || item.date,
        amount: item.amount || 0,
        deliveries: item.deliveryCount || 0,
        distance: item.distance || 0,
        time: item.duration || 0,
      }));
      setEarnings(mappedEarnings);
    } catch (error) {
      console.error("Error fetching earnings:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const totalEarnings = earnings.reduce((sum, e) => sum + e.amount, 0);
  const totalDeliveries = earnings.reduce((sum, e) => sum + e.deliveries, 0);
  const totalDistance = earnings.reduce((sum, e) => sum + e.distance, 0);
  const averagePerDelivery = totalDeliveries > 0 ? Math.round(totalEarnings / totalDeliveries) : 0;

  const renderEarningCard = ({ item }: { item: EarningRecord }) => (
    <Pressable
      style={({ pressed }) => [
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
          opacity: pressed ? 0.7 : 1,
        },
      ]}
      className="rounded-2xl p-4 mb-3 border"
    >
      <View className="flex-row items-center justify-between mb-3">
        <View>
          <Text className="text-sm text-muted mb-1">تاریخ</Text>
          <Text className="text-lg font-bold text-foreground">{item.date}</Text>
        </View>
        <View className="items-end">
          <Text className="text-sm text-muted mb-1">درآمد</Text>
          <Text className="text-lg font-bold text-success">
            {item.amount.toLocaleString()}
          </Text>
        </View>
      </View>

      <View className="flex-row items-center justify-between pt-3 border-t" style={{ borderTopColor: colors.border }}>
        <View className="flex-row items-center gap-1">
          <IconSymbol name="checkmark.circle.fill" size={14} color={colors.success} />
          <Text className="text-xs text-muted">{item.deliveries} تحویل</Text>
        </View>
        <View className="flex-row items-center gap-1">
          <IconSymbol name="map.fill" size={14} color={colors.primary} />
          <Text className="text-xs text-muted">{item.distance} کیلومتر</Text>
        </View>
        <View className="flex-row items-center gap-1">
          <IconSymbol name="clock.fill" size={14} color={colors.warning} />
          <Text className="text-xs text-muted">{item.time} دقیقه</Text>
        </View>
      </View>
    </Pressable>
  );

  return (
    <ScreenContainer className="p-0">
      <View className="bg-background flex-1">
        {/* Header */}
        <View className="bg-primary px-6 pt-6 pb-4">
          <Text className="text-white text-3xl font-bold">درآمد</Text>
          <Text className="text-blue-100 text-sm mt-1">خلاصه درآمد شما</Text>
        </View>

        {/* Summary Cards */}
        <View className="px-6 pt-6 gap-4">
          <View className="flex-row gap-3">
            <View
              className="flex-1 rounded-xl p-4 border"
              style={{
                backgroundColor: colors.surface,
                borderColor: colors.border,
              }}
            >
              <View className="flex-row items-center justify-between mb-2">
                <Text className="text-xs text-muted">کل درآمد</Text>
                <IconSymbol name="dollarsign.circle.fill" size={18} color={colors.success} />
              </View>
              <Text className="text-xl font-bold text-success">
                {totalEarnings.toLocaleString()}
              </Text>
              <Text className="text-xs text-muted mt-2">۴ روز</Text>
            </View>

            <View
              className="flex-1 rounded-xl p-4 border"
              style={{
                backgroundColor: colors.surface,
                borderColor: colors.border,
              }}
            >
              <View className="flex-row items-center justify-between mb-2">
                <Text className="text-xs text-muted">تحویل‌ها</Text>
                <IconSymbol name="checkmark.circle.fill" size={18} color={colors.primary} />
              </View>
              <Text className="text-xl font-bold text-foreground">
                {totalDeliveries}
              </Text>
              <Text className="text-xs text-muted mt-2">سفارش</Text>
            </View>
          </View>

          <View className="flex-row gap-3">
            <View
              className="flex-1 rounded-xl p-4 border"
              style={{
                backgroundColor: colors.surface,
                borderColor: colors.border,
              }}
            >
              <View className="flex-row items-center justify-between mb-2">
                <Text className="text-xs text-muted">فاصله</Text>
                <IconSymbol name="map.fill" size={18} color={colors.warning} />
              </View>
              <Text className="text-xl font-bold text-foreground">
                {totalDistance.toFixed(1)}
              </Text>
              <Text className="text-xs text-muted mt-2">کیلومتر</Text>
            </View>

            <View
              className="flex-1 rounded-xl p-4 border"
              style={{
                backgroundColor: colors.surface,
                borderColor: colors.border,
              }}
            >
              <View className="flex-row items-center justify-between mb-2">
                <Text className="text-xs text-muted">میانگین</Text>
                <IconSymbol name="chart.bar.fill" size={18} color={colors.primary} />
              </View>
              <Text className="text-xl font-bold text-foreground">
                {averagePerDelivery.toLocaleString()}
              </Text>
              <Text className="text-xs text-muted mt-2">هر تحویل</Text>
            </View>
          </View>
        </View>

        {/* Period Filter */}
        <View className="flex-row gap-2 px-6 py-4 border-b" style={{ borderBottomColor: colors.border }}>
          <Pressable
            onPress={() => setPeriod("daily")}
            style={({ pressed }) => [
              {
                backgroundColor: period === "daily" ? colors.primary : colors.surface,
                opacity: pressed ? 0.8 : 1,
              },
            ]}
            className="px-4 py-2 rounded-full"
          >
            <Text
              className="font-semibold text-sm"
              style={{
                color: period === "daily" ? "white" : colors.foreground,
              }}
            >
              روزانه
            </Text>
          </Pressable>

          <Pressable
            onPress={() => setPeriod("weekly")}
            style={({ pressed }) => [
              {
                backgroundColor: period === "weekly" ? colors.primary : colors.surface,
                opacity: pressed ? 0.8 : 1,
              },
            ]}
            className="px-4 py-2 rounded-full"
          >
            <Text
              className="font-semibold text-sm"
              style={{
                color: period === "weekly" ? "white" : colors.foreground,
              }}
            >
              هفتگی
            </Text>
          </Pressable>

          <Pressable
            onPress={() => setPeriod("monthly")}
            style={({ pressed }) => [
              {
                backgroundColor: period === "monthly" ? colors.primary : colors.surface,
                opacity: pressed ? 0.8 : 1,
              },
            ]}
            className="px-4 py-2 rounded-full"
          >
            <Text
              className="font-semibold text-sm"
              style={{
                color: period === "monthly" ? "white" : colors.foreground,
              }}
            >
              ماهانه
            </Text>
          </Pressable>
        </View>

        {/* Earnings History */}
        {isLoading ? (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        ) : (
          <FlatList
            data={earnings}
            renderItem={renderEarningCard}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ padding: 16, paddingBottom: 80 }}
            scrollEnabled={true}
            onRefresh={fetchEarnings}
            refreshing={isLoading}
          />
        )}
      </View>
    </ScreenContainer>
  );
}
