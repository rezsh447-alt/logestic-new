import { ScrollView, Text, View, Pressable, FlatList } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useState } from "react";
import * as Haptics from "expo-haptics";

interface OrderItem {
  id: string;
  orderNumber: string;
  pickupLocation: string;
  deliveryLocation: string;
  customerName: string;
  status: "pending" | "accepted" | "picked_up" | "in_transit" | "delivered";
  estimatedEarnings: number;
  distance: number;
}

const MOCK_ORDERS: OrderItem[] = [
  {
    id: "1",
    orderNumber: "#FWD-2024-001",
    pickupLocation: "تهران، خیابان ولیعصر",
    deliveryLocation: "تهران، خیابان فردوسی",
    customerName: "علی احمدی",
    status: "pending",
    estimatedEarnings: 45000,
    distance: 5.2,
  },
  {
    id: "2",
    orderNumber: "#FWD-2024-002",
    pickupLocation: "تهران، خیابان انقلاب",
    deliveryLocation: "تهران، خیابان رسالت",
    customerName: "فاطمه محمدی",
    status: "pending",
    estimatedEarnings: 38000,
    distance: 4.1,
  },
  {
    id: "3",
    orderNumber: "#FWD-2024-003",
    pickupLocation: "تهران، خیابان شریازی",
    deliveryLocation: "تهران، خیابان ستارخان",
    customerName: "محمد علی",
    status: "accepted",
    estimatedEarnings: 52000,
    distance: 6.8,
  },
];

const STATUS_COLORS: Record<string, { bg: string; text: string; label: string }> = {
  pending: { bg: "#FEF3C7", text: "#D97706", label: "در انتظار" },
  accepted: { bg: "#DBEAFE", text: "#0066CC", label: "پذیرفته شده" },
  picked_up: { bg: "#E0E7FF", text: "#4F46E5", label: "برداشته شده" },
  in_transit: { bg: "#CCFBF1", text: "#0D9488", label: "در حال انتقال" },
  delivered: { bg: "#DCFCE7", text: "#22C55E", label: "تحویل شده" },
};

export default function OrdersScreen() {
  const colors = useColors();
  const [orders, setOrders] = useState<OrderItem[]>(MOCK_ORDERS);
  const [selectedFilter, setSelectedFilter] = useState<"all" | "pending" | "accepted">("all");

  const filteredOrders =
    selectedFilter === "all"
      ? orders
      : orders.filter((o) => o.status === selectedFilter);

  const handleAcceptOrder = async (orderId: string) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setOrders(
      orders.map((o) =>
        o.id === orderId ? { ...o, status: "accepted" as const } : o
      )
    );
  };

  const renderOrderCard = ({ item }: { item: OrderItem }) => {
    const statusInfo = STATUS_COLORS[item.status];

    return (
      <View
        className="rounded-2xl p-4 mb-3 border"
        style={{
          backgroundColor: colors.surface,
          borderColor: colors.border,
        }}
      >
        <View className="flex-row items-start justify-between mb-3">
          <View className="flex-1">
            <Text className="text-sm text-muted mb-1">شماره سفارش</Text>
            <Text className="text-lg font-bold text-foreground">{item.orderNumber}</Text>
          </View>
          <View
            className="px-3 py-1 rounded-full"
            style={{ backgroundColor: statusInfo.bg }}
          >
            <Text style={{ color: statusInfo.text }} className="text-xs font-semibold">
              {statusInfo.label}
            </Text>
          </View>
        </View>

        <View className="gap-2 mb-4">
          <View className="flex-row items-center gap-2">
            <IconSymbol name="location.fill" size={16} color={colors.primary} />
            <Text className="text-sm text-foreground flex-1">{item.pickupLocation}</Text>
          </View>
          <View className="h-6 items-center justify-center">
            <View className="w-0.5 h-4 bg-border" />
          </View>
          <View className="flex-row items-center gap-2">
            <IconSymbol name="location.fill" size={16} color={colors.success} />
            <Text className="text-sm text-foreground flex-1">{item.deliveryLocation}</Text>
          </View>
        </View>

        <View className="flex-row items-center justify-between mb-4 pb-4 border-t" style={{ borderTopColor: colors.border }}>
          <View className="flex-1">
            <Text className="text-xs text-muted mb-1">مشتری</Text>
            <Text className="text-sm font-semibold text-foreground">{item.customerName}</Text>
          </View>
          <View className="flex-1 items-center">
            <Text className="text-xs text-muted mb-1">فاصله</Text>
            <Text className="text-sm font-semibold text-foreground">{item.distance} کیلومتر</Text>
          </View>
          <View className="flex-1 items-end">
            <Text className="text-xs text-muted mb-1">درآمد</Text>
            <Text className="text-sm font-semibold text-success">{item.estimatedEarnings.toLocaleString()} ریال</Text>
          </View>
        </View>

        {item.status === "pending" && (
          <View className="flex-row gap-2">
            <Pressable
              style={({ pressed }) => [
                {
                  backgroundColor: colors.error,
                  opacity: pressed ? 0.8 : 1,
                  flex: 1,
                },
              ]}
              className="py-2.5 rounded-lg items-center justify-center"
            >
              <Text className="text-white font-semibold text-sm">رد کردن</Text>
            </Pressable>
            <Pressable
              onPress={() => handleAcceptOrder(item.id)}
              style={({ pressed }) => [
                {
                  backgroundColor: colors.success,
                  opacity: pressed ? 0.8 : 1,
                  flex: 1,
                },
              ]}
              className="py-2.5 rounded-lg items-center justify-center"
            >
              <Text className="text-white font-semibold text-sm">قبول کردن</Text>
            </Pressable>
          </View>
        )}

        {item.status === "accepted" && (
          <Pressable
            style={({ pressed }) => [
              {
                backgroundColor: colors.primary,
                opacity: pressed ? 0.8 : 1,
              },
            ]}
            className="py-2.5 rounded-lg items-center justify-center"
          >
            <Text className="text-white font-semibold text-sm">مشاهده جزئیات</Text>
          </Pressable>
        )}
      </View>
    );
  };

  return (
    <ScreenContainer className="p-0">
      <View className="bg-background flex-1">
        {/* Header */}
        <View className="bg-primary px-6 pt-6 pb-4">
          <Text className="text-white text-3xl font-bold">سفارش‌ها</Text>
          <Text className="text-blue-100 text-sm mt-1">
            {filteredOrders.length} سفارش در انتظار
          </Text>
        </View>

        {/* Filter Tabs */}
        <View className="flex-row gap-2 px-6 py-4 border-b" style={{ borderBottomColor: colors.border }}>
          <Pressable
            onPress={() => setSelectedFilter("all")}
            style={({ pressed }) => [
              {
                backgroundColor:
                  selectedFilter === "all" ? colors.primary : colors.surface,
                opacity: pressed ? 0.8 : 1,
              },
            ]}
            className="px-4 py-2 rounded-full"
          >
            <Text
              className="font-semibold text-sm"
              style={{
                color: selectedFilter === "all" ? "white" : colors.foreground,
              }}
            >
              همه
            </Text>
          </Pressable>

          <Pressable
            onPress={() => setSelectedFilter("pending")}
            style={({ pressed }) => [
              {
                backgroundColor:
                  selectedFilter === "pending" ? colors.primary : colors.surface,
                opacity: pressed ? 0.8 : 1,
              },
            ]}
            className="px-4 py-2 rounded-full"
          >
            <Text
              className="font-semibold text-sm"
              style={{
                color: selectedFilter === "pending" ? "white" : colors.foreground,
              }}
            >
              در انتظار
            </Text>
          </Pressable>

          <Pressable
            onPress={() => setSelectedFilter("accepted")}
            style={({ pressed }) => [
              {
                backgroundColor:
                  selectedFilter === "accepted" ? colors.primary : colors.surface,
                opacity: pressed ? 0.8 : 1,
              },
            ]}
            className="px-4 py-2 rounded-full"
          >
            <Text
              className="font-semibold text-sm"
              style={{
                color: selectedFilter === "accepted" ? "white" : colors.foreground,
              }}
            >
              پذیرفته شده
            </Text>
          </Pressable>
        </View>

        {/* Orders List */}
        <FlatList
          data={filteredOrders}
          renderItem={renderOrderCard}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 16, paddingBottom: 80 }}
          scrollEnabled={true}
          ListEmptyComponent={
            <View className="items-center justify-center py-12">
              <IconSymbol name="inbox" size={48} color={colors.muted} />
              <Text className="text-muted text-center mt-4">سفارشی در دسترس نیست</Text>
            </View>
          }
        />
      </View>
    </ScreenContainer>
  );
}
