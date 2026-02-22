import { ScrollView, Text, View, Pressable, Image } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useState } from "react";

export default function ProfileScreen() {
  const colors = useColors();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  return (
    <ScreenContainer className="p-0">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="bg-background">
        {/* Header with Profile Picture */}
        <View className="bg-primary px-6 pt-6 pb-8">
          <View className="items-center mb-4">
            <View
              className="w-20 h-20 rounded-full items-center justify-center mb-4"
              style={{ backgroundColor: colors.surface }}
            >
              <IconSymbol name="person.fill" size={40} color={colors.primary} />
            </View>
            <Text className="text-white text-2xl font-bold">محمد علی رضایی</Text>
            <Text className="text-blue-100 text-sm mt-1">راننده حرفه‌ای</Text>
          </View>

          <View className="flex-row gap-3">
            <View className="flex-1 bg-blue-600 rounded-lg py-2 items-center">
              <Text className="text-white text-xs text-muted mb-1">امتیاز</Text>
              <Text className="text-white text-lg font-bold">۴.۸</Text>
            </View>
            <View className="flex-1 bg-blue-600 rounded-lg py-2 items-center">
              <Text className="text-white text-xs text-muted mb-1">سفارش‌ها</Text>
              <Text className="text-white text-lg font-bold">۱۲۳</Text>
            </View>
            <View className="flex-1 bg-blue-600 rounded-lg py-2 items-center">
              <Text className="text-white text-xs text-muted mb-1">عضویت</Text>
              <Text className="text-white text-lg font-bold">۸ ماه</Text>
            </View>
          </View>
        </View>

        {/* Profile Sections */}
        <View className="px-6 pt-6 gap-6 pb-8">
          {/* Personal Information */}
          <View
            className="rounded-2xl p-4 border"
            style={{
              backgroundColor: colors.surface,
              borderColor: colors.border,
            }}
          >
            <Text className="text-lg font-semibold text-foreground mb-4">اطلاعات شخصی</Text>

            <View className="gap-3">
              <View className="flex-row items-center justify-between pb-3 border-b" style={{ borderBottomColor: colors.border }}>
                <View className="flex-row items-center gap-2">
                  <IconSymbol name="phone.fill" size={16} color={colors.primary} />
                  <Text className="text-sm text-muted">شماره تماس</Text>
                </View>
                <Text className="text-sm font-semibold text-foreground">۰۹۱۲۳۴۵۶۷۸۹</Text>
              </View>

              <View className="flex-row items-center justify-between pb-3 border-b" style={{ borderBottomColor: colors.border }}>
                <View className="flex-row items-center gap-2">
                  <IconSymbol name="envelope.fill" size={16} color={colors.primary} />
                  <Text className="text-sm text-muted">ایمیل</Text>
                </View>
                <Text className="text-sm font-semibold text-foreground">user@forward.ir</Text>
              </View>

              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center gap-2">
                  <IconSymbol name="location.fill" size={16} color={colors.primary} />
                  <Text className="text-sm text-muted">شهر</Text>
                </View>
                <Text className="text-sm font-semibold text-foreground">تهران</Text>
              </View>
            </View>

            <Pressable
              style={({ pressed }) => [
                {
                  backgroundColor: colors.primary,
                  opacity: pressed ? 0.8 : 1,
                },
              ]}
              className="mt-4 py-2.5 rounded-lg items-center justify-center"
            >
              <Text className="text-white font-semibold text-sm">ویرایش اطلاعات</Text>
            </Pressable>
          </View>

          {/* Vehicle Information */}
          <View
            className="rounded-2xl p-4 border"
            style={{
              backgroundColor: colors.surface,
              borderColor: colors.border,
            }}
          >
            <Text className="text-lg font-semibold text-foreground mb-4">اطلاعات خودرو</Text>

            <View className="gap-3">
              <View className="flex-row items-center justify-between pb-3 border-b" style={{ borderBottomColor: colors.border }}>
                <View className="flex-row items-center gap-2">
                  <IconSymbol name="car.fill" size={16} color={colors.primary} />
                  <Text className="text-sm text-muted">نوع خودرو</Text>
                </View>
                <Text className="text-sm font-semibold text-foreground">ون</Text>
              </View>

              <View className="flex-row items-center justify-between pb-3 border-b" style={{ borderBottomColor: colors.border }}>
                <View className="flex-row items-center gap-2">
                  <IconSymbol name="info.circle.fill" size={16} color={colors.primary} />
                  <Text className="text-sm text-muted">پلاک</Text>
                </View>
                <Text className="text-sm font-semibold text-foreground">ب۱۲۳ب۱۲</Text>
              </View>

              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center gap-2">
                  <IconSymbol name="info.circle.fill" size={16} color={colors.primary} />
                  <Text className="text-sm text-muted">ظرفیت</Text>
                </View>
                <Text className="text-sm font-semibold text-foreground">۵۰۰ کیلوگرم</Text>
              </View>
            </View>

            <Pressable
              style={({ pressed }) => [
                {
                  backgroundColor: colors.primary,
                  opacity: pressed ? 0.8 : 1,
                },
              ]}
              className="mt-4 py-2.5 rounded-lg items-center justify-center"
            >
              <Text className="text-white font-semibold text-sm">مشاهده مستندات</Text>
            </Pressable>
          </View>

          {/* Settings */}
          <View
            className="rounded-2xl p-4 border"
            style={{
              backgroundColor: colors.surface,
              borderColor: colors.border,
            }}
          >
            <Text className="text-lg font-semibold text-foreground mb-4">تنظیمات</Text>

            <View className="gap-3">
              <Pressable
                className="flex-row items-center justify-between pb-3 border-b"
                style={{ borderBottomColor: colors.border }}
              >
                <View className="flex-row items-center gap-2">
                  <IconSymbol name="bell.fill" size={16} color={colors.primary} />
                  <Text className="text-sm text-foreground">اطلاعات‌رسانی</Text>
                </View>
                <View
                  className="w-12 h-6 rounded-full items-center justify-center"
                  style={{
                    backgroundColor: notificationsEnabled ? colors.success : colors.muted,
                  }}
                >
                  <View
                    className="w-5 h-5 rounded-full bg-white"
                    style={{
                      marginLeft: notificationsEnabled ? 3 : -3,
                    }}
                  />
                </View>
              </Pressable>

              <Pressable className="flex-row items-center justify-between pb-3 border-b" style={{ borderBottomColor: colors.border }}>
                <View className="flex-row items-center gap-2">
                  <IconSymbol name="gear" size={16} color={colors.primary} />
                  <Text className="text-sm text-foreground">زبان</Text>
                </View>
                <Text className="text-sm font-semibold text-muted">فارسی</Text>
              </Pressable>

              <Pressable className="flex-row items-center justify-between">
                <View className="flex-row items-center gap-2">
                  <IconSymbol name="eye.fill" size={16} color={colors.primary} />
                  <Text className="text-sm text-foreground">حالت تاریک</Text>
                </View>
                <Text className="text-sm font-semibold text-muted">خودکار</Text>
              </Pressable>
            </View>
          </View>

          {/* Bank Account */}
          <View
            className="rounded-2xl p-4 border"
            style={{
              backgroundColor: colors.surface,
              borderColor: colors.border,
            }}
          >
            <Text className="text-lg font-semibold text-foreground mb-4">حساب بانکی</Text>

            <View className="gap-3 mb-4">
              <View className="flex-row items-center justify-between pb-3 border-b" style={{ borderBottomColor: colors.border }}>
                <Text className="text-sm text-muted">نام صاحب حساب</Text>
                <Text className="text-sm font-semibold text-foreground">محمد علی رضایی</Text>
              </View>

              <View className="flex-row items-center justify-between pb-3 border-b" style={{ borderBottomColor: colors.border }}>
                <Text className="text-sm text-muted">بانک</Text>
                <Text className="text-sm font-semibold text-foreground">بانک ملی</Text>
              </View>

              <View className="flex-row items-center justify-between">
                <Text className="text-sm text-muted">شماره حساب</Text>
                <Text className="text-sm font-semibold text-foreground">۱۲۳۴۵۶۷۸۹</Text>
              </View>
            </View>

            <Pressable
              style={({ pressed }) => [
                {
                  backgroundColor: colors.primary,
                  opacity: pressed ? 0.8 : 1,
                },
              ]}
              className="py-2.5 rounded-lg items-center justify-center"
            >
              <Text className="text-white font-semibold text-sm">ویرایش حساب بانکی</Text>
            </Pressable>
          </View>

          {/* Logout */}
          <Pressable
            style={({ pressed }) => [
              {
                backgroundColor: colors.error,
                opacity: pressed ? 0.8 : 1,
              },
            ]}
            className="py-3 rounded-lg items-center justify-center"
          >
            <Text className="text-white font-semibold">خروج از حساب</Text>
          </Pressable>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
