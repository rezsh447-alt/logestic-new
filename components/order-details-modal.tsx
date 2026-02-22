import { View, Text, Pressable, ScrollView, Modal } from "react-native";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";

interface OrderDetailsModalProps {
  visible: boolean;
  onClose: () => void;
  orderNumber: string;
  pickupLocation: string;
  deliveryLocation: string;
  customerName: string;
  customerPhone: string;
  estimatedEarnings: number;
  distance: number;
  weight: number;
  specialInstructions?: string;
}

export function OrderDetailsModal({
  visible,
  onClose,
  orderNumber,
  pickupLocation,
  deliveryLocation,
  customerName,
  customerPhone,
  estimatedEarnings,
  distance,
  weight,
  specialInstructions,
}: OrderDetailsModalProps) {
  const colors = useColors();

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/50">
        <View
          className="flex-1 mt-auto rounded-t-3xl"
          style={{ backgroundColor: colors.background }}
        >
          {/* Header */}
          <View className="flex-row items-center justify-between px-6 py-4 border-b" style={{ borderBottomColor: colors.border }}>
            <Text className="text-xl font-bold text-foreground">جزئیات سفارش</Text>
            <Pressable onPress={onClose} className="p-2">
              <IconSymbol name="xmark.circle.fill" size={24} color={colors.muted} />
            </Pressable>
          </View>

          {/* Content */}
          <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 100 }} className="flex-1">
            {/* Order Number */}
            <View className="mb-4">
              <Text className="text-sm text-muted mb-2">شماره سفارش</Text>
              <Text className="text-lg font-bold text-foreground">{orderNumber}</Text>
            </View>

            {/* Locations */}
            <View
              className="rounded-xl p-4 mb-4 border"
              style={{
                backgroundColor: colors.surface,
                borderColor: colors.border,
              }}
            >
              <Text className="font-semibold text-foreground mb-3">مسیر تحویل</Text>

              <View className="gap-3">
                <View className="flex-row items-start gap-3">
                  <View className="w-8 h-8 rounded-full bg-primary items-center justify-center mt-1">
                    <IconSymbol name="location.fill" size={14} color="white" />
                  </View>
                  <View className="flex-1">
                    <Text className="text-xs text-muted mb-1">مبدا</Text>
                    <Text className="text-sm font-semibold text-foreground">{pickupLocation}</Text>
                  </View>
                </View>

                <View className="h-8 items-center justify-center">
                  <View className="w-0.5 h-full bg-border" />
                </View>

                <View className="flex-row items-start gap-3">
                  <View className="w-8 h-8 rounded-full bg-success items-center justify-center mt-1">
                    <IconSymbol name="location.fill" size={14} color="white" />
                  </View>
                  <View className="flex-1">
                    <Text className="text-xs text-muted mb-1">مقصد</Text>
                    <Text className="text-sm font-semibold text-foreground">{deliveryLocation}</Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Customer Info */}
            <View
              className="rounded-xl p-4 mb-4 border"
              style={{
                backgroundColor: colors.surface,
                borderColor: colors.border,
              }}
            >
              <Text className="font-semibold text-foreground mb-3">اطلاعات مشتری</Text>

              <View className="gap-3">
                <View className="flex-row items-center justify-between">
                  <View className="flex-row items-center gap-2">
                    <IconSymbol name="person.fill" size={16} color={colors.primary} />
                    <Text className="text-sm text-muted">نام</Text>
                  </View>
                  <Text className="text-sm font-semibold text-foreground">{customerName}</Text>
                </View>

                <View className="flex-row items-center justify-between">
                  <View className="flex-row items-center gap-2">
                    <IconSymbol name="phone.fill" size={16} color={colors.primary} />
                    <Text className="text-sm text-muted">تماس</Text>
                  </View>
                  <Text className="text-sm font-semibold text-foreground">{customerPhone}</Text>
                </View>
              </View>
            </View>

            {/* Order Details */}
            <View
              className="rounded-xl p-4 mb-4 border"
              style={{
                backgroundColor: colors.surface,
                borderColor: colors.border,
              }}
            >
              <Text className="font-semibold text-foreground mb-3">جزئیات سفارش</Text>

              <View className="gap-3">
                <View className="flex-row items-center justify-between">
                  <View className="flex-row items-center gap-2">
                    <IconSymbol name="map.fill" size={16} color={colors.primary} />
                    <Text className="text-sm text-muted">فاصله</Text>
                  </View>
                  <Text className="text-sm font-semibold text-foreground">{distance} کیلومتر</Text>
                </View>

                <View className="flex-row items-center justify-between">
                  <View className="flex-row items-center gap-2">
                    <IconSymbol name="info.circle.fill" size={16} color={colors.primary} />
                    <Text className="text-sm text-muted">وزن</Text>
                  </View>
                  <Text className="text-sm font-semibold text-foreground">{weight} کیلوگرم</Text>
                </View>

                <View className="flex-row items-center justify-between">
                  <View className="flex-row items-center gap-2">
                    <IconSymbol name="dollarsign.circle.fill" size={16} color={colors.success} />
                    <Text className="text-sm text-muted">درآمد</Text>
                  </View>
                  <Text className="text-sm font-semibold text-success">
                    {estimatedEarnings.toLocaleString()} ریال
                  </Text>
                </View>
              </View>
            </View>

            {/* Special Instructions */}
            {specialInstructions && (
              <View
                className="rounded-xl p-4 mb-4 border"
                style={{
                  backgroundColor: colors.surface,
                  borderColor: colors.warning,
                  borderWidth: 1.5,
                }}
              >
                <View className="flex-row items-start gap-2 mb-2">
                  <IconSymbol name="exclamationmark.triangle.fill" size={16} color={colors.warning} />
                  <Text className="font-semibold text-foreground flex-1">توجهات خاص</Text>
                </View>
                <Text className="text-sm text-foreground leading-relaxed">{specialInstructions}</Text>
              </View>
            )}
          </ScrollView>

          {/* Action Buttons */}
          <View
            className="flex-row gap-3 px-6 py-4 border-t"
            style={{ borderTopColor: colors.border }}
          >
            <Pressable
              onPress={onClose}
              style={({ pressed }) => [
                {
                  backgroundColor: colors.surface,
                  opacity: pressed ? 0.7 : 1,
                  flex: 1,
                },
              ]}
              className="py-3 rounded-lg items-center justify-center border"
            >
              <Text className="text-foreground font-semibold">بستن</Text>
            </Pressable>

            <Pressable
              style={({ pressed }) => [
                {
                  backgroundColor: colors.primary,
                  opacity: pressed ? 0.8 : 1,
                  flex: 1,
                },
              ]}
              className="py-3 rounded-lg items-center justify-center"
            >
              <Text className="text-white font-semibold">قبول سفارش</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}
