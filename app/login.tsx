import { ScrollView, Text, View, TextInput, Pressable, ActivityIndicator, Alert } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useState } from "react";
import * as Haptics from "expo-haptics";
import { useAuthContext } from "@/lib/auth-provider";
import { useRouter } from "expo-router";
import type { RelativePathString } from "expo-router";

export default function LoginScreen() {
  const colors = useColors();
  const router = useRouter();
  const { checkAccount, login, isLoading, error } = useAuthContext();

  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [localError, setLocalError] = useState<string | null>(null);

  const handlePhoneSubmit = async () => {
    setLocalError(null);

    // Validate phone number
    if (!phoneNumber || phoneNumber.length < 10) {
      setLocalError("لطفا شماره تماس معتبر وارد کنید");
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }

    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      await checkAccount(phoneNumber);
      setStep("otp");
    } catch (err) {
      setLocalError(error || "خطا در ارسال کد تایید");
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
  };

  const handleOtpSubmit = async () => {
    setLocalError(null);

    // Validate OTP
    if (!otp || otp.length !== 6) {
      setLocalError("لطفا کد تایید ۶ رقمی وارد کنید");
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }

    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      await login(phoneNumber, otp);
      router.replace("/(tabs)" as RelativePathString);
    } catch (err) {
      setLocalError(error || "خطا در ورود");
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
  };

  return (
    <ScreenContainer className="p-0">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="bg-background">
        {/* Header */}
        <View className="bg-primary px-6 pt-12 pb-8 items-center">
          <View className="w-16 h-16 rounded-full bg-white items-center justify-center mb-4">
            <IconSymbol name="car.fill" size={32} color="#0066CC" />
          </View>
          <Text className="text-white text-3xl font-bold">Forward</Text>
          <Text className="text-blue-100 text-sm mt-2">سیستم مدیریت رانندگان</Text>
        </View>

        {/* Main Content */}
        <View className="flex-1 px-6 pt-8 pb-8 justify-center">
          {step === "phone" ? (
            <View className="gap-6">
              <View>
                <Text className="text-2xl font-bold text-foreground mb-2">خوش آمدید</Text>
                <Text className="text-muted">شماره تماس خود را وارد کنید</Text>
              </View>

              {/* Phone Input */}
              <View>
                <Text className="text-sm font-semibold text-foreground mb-2">شماره تماس</Text>
                <View
                  className="flex-row items-center px-4 py-3 rounded-lg border"
                  style={{
                    backgroundColor: colors.surface,
                    borderColor: localError ? colors.error : colors.border,
                    borderWidth: 1.5,
                  }}
                >
                  <IconSymbol name="phone.fill" size={20} color={colors.primary} />
                  <TextInput
                    placeholder="۰۹۱۲۳۴۵۶۷۸۹"
                    placeholderTextColor={colors.muted}
                    value={phoneNumber}
                    onChangeText={setPhoneNumber}
                    keyboardType="phone-pad"
                    editable={!isLoading}
                    className="flex-1 ml-3 text-foreground text-base"
                    style={{ color: colors.foreground }}
                  />
                </View>
                {localError && (
                  <Text className="text-error text-xs mt-2">{localError}</Text>
                )}
              </View>

              {/* Info Box */}
              <View
                className="p-4 rounded-lg border"
                style={{
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                }}
              >
                <View className="flex-row gap-3">
                  <IconSymbol name="info.circle.fill" size={20} color={colors.primary} />
                  <Text className="flex-1 text-xs text-muted leading-relaxed">
                    کد تایید ۶ رقمی برای شماره تماس شما ارسال خواهد شد
                  </Text>
                </View>
              </View>

              {/* Submit Button */}
              <Pressable
                onPress={handlePhoneSubmit}
                disabled={isLoading || !phoneNumber}
                style={({ pressed }) => [
                  {
                    backgroundColor: colors.primary,
                    opacity: pressed && !isLoading ? 0.8 : isLoading || !phoneNumber ? 0.6 : 1,
                  },
                ]}
                className="py-3 rounded-lg items-center justify-center"
              >
                {isLoading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text className="text-white font-semibold">ادامه</Text>
                )}
              </Pressable>
            </View>
          ) : (
            <View className="gap-6">
              <View>
                <Pressable
                  onPress={() => {
                    setStep("phone");
                    setLocalError(null);
                  }}
                  className="flex-row items-center gap-2 mb-4"
                >
                  <IconSymbol name="arrow.left" size={20} color={colors.primary} />
                  <Text className="text-primary font-semibold">بازگشت</Text>
                </Pressable>

                <Text className="text-2xl font-bold text-foreground mb-2">کد تایید</Text>
                <Text className="text-muted">کد ۶ رقمی ارسال شده را وارد کنید</Text>
              </View>

              {/* OTP Input */}
              <View>
                <Text className="text-sm font-semibold text-foreground mb-2">کد تایید</Text>
                <View
                  className="flex-row items-center px-4 py-3 rounded-lg border"
                  style={{
                    backgroundColor: colors.surface,
                    borderColor: localError ? colors.error : colors.border,
                    borderWidth: 1.5,
                  }}
                >
                  <IconSymbol name="lock.fill" size={20} color={colors.primary} />
                  <TextInput
                    placeholder="۰۰۰۰۰۰"
                    placeholderTextColor={colors.muted}
                    value={otp}
                    onChangeText={setOtp}
                    keyboardType="number-pad"
                    maxLength={6}
                    editable={!isLoading}
                    className="flex-1 ml-3 text-foreground text-base tracking-widest"
                    style={{ color: colors.foreground }}
                  />
                </View>
                {localError && (
                  <Text className="text-error text-xs mt-2">{localError}</Text>
                )}
              </View>

              {/* Resend Code */}
              <View className="items-center">
                <Text className="text-muted text-sm">
                  کد دریافت نکردید؟{" "}
                  <Text className="text-primary font-semibold">دوباره ارسال کنید</Text>
                </Text>
              </View>

              {/* Submit Button */}
              <Pressable
                onPress={handleOtpSubmit}
                disabled={isLoading || otp.length !== 6}
                style={({ pressed }) => [
                  {
                    backgroundColor: colors.primary,
                    opacity: pressed && !isLoading ? 0.8 : isLoading || otp.length !== 6 ? 0.6 : 1,
                  },
                ]}
                className="py-3 rounded-lg items-center justify-center"
              >
                {isLoading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text className="text-white font-semibold">ورود</Text>
                )}
              </Pressable>
            </View>
          )}
        </View>

        {/* Footer */}
        <View className="px-6 pb-6 items-center">
          <Text className="text-xs text-muted text-center">
            با ورود، شما شرایط استفاده و سیاست حریم خصوصی را می‌پذیرید
          </Text>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
