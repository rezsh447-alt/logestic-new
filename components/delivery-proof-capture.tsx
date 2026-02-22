import { View, Text, Pressable, ScrollView, Image } from "react-native";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";
import { useState } from "react";
import * as Haptics from "expo-haptics";

interface DeliveryProofCaptureProps {
  onComplete: (proof: { photos: string[]; notes: string; signature?: string }) => void;
  orderNumber: string;
}

export function DeliveryProofCapture({
  onComplete,
  orderNumber,
}: DeliveryProofCaptureProps) {
  const colors = useColors();
  const [step, setStep] = useState<"photo" | "notes" | "signature">("photo");
  const [photos, setPhotos] = useState<string[]>([]);
  const [notes, setNotes] = useState("");

  const handleAddPhoto = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    // In production, this would open camera
    setPhotos([...photos, `photo_${Date.now()}`]);
  };

  const handleNext = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    if (step === "photo" && photos.length > 0) {
      setStep("notes");
    } else if (step === "notes") {
      setStep("signature");
    } else if (step === "signature") {
      onComplete({ photos, notes });
    }
  };

  return (
    <View className="flex-1 bg-background">
      {/* Header */}
      <View className="bg-primary px-6 pt-6 pb-4">
        <Text className="text-white text-2xl font-bold">تأیید تحویل</Text>
        <Text className="text-blue-100 text-sm mt-1">{orderNumber}</Text>
      </View>

      {/* Content */}
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 100 }}>
        {step === "photo" && (
          <View className="gap-4">
            <View>
              <Text className="text-lg font-semibold text-foreground mb-2">عکس تحویل</Text>
              <Text className="text-sm text-muted">
                حداقل یک عکس از محل تحویل را بگیرید
              </Text>
            </View>

            {photos.length > 0 && (
              <View className="gap-2">
                {photos.map((photo, index) => (
                  <View
                    key={index}
                    className="w-full h-40 rounded-lg bg-surface border items-center justify-center"
                    style={{ borderColor: colors.border }}
                  >
                    <View className="items-center gap-2">
                      <IconSymbol name="camera.fill" size={32} color={colors.primary} />
                      <Text className="text-xs text-muted">عکس {index + 1}</Text>
                    </View>
                  </View>
                ))}
              </View>
            )}

            <Pressable
              onPress={handleAddPhoto}
              style={({ pressed }) => [
                {
                  backgroundColor: colors.surface,
                  opacity: pressed ? 0.7 : 1,
                },
              ]}
              className="py-4 rounded-lg items-center justify-center border-2"
            >
              <IconSymbol name="camera.fill" size={24} color={colors.primary} />
              <Text className="text-primary font-semibold mt-2">
                {photos.length > 0 ? "افزودن عکس بیشتر" : "گرفتن عکس"}
              </Text>
            </Pressable>
          </View>
        )}

        {step === "notes" && (
          <View className="gap-4">
            <View>
              <Text className="text-lg font-semibold text-foreground mb-2">یادداشت‌ها</Text>
              <Text className="text-sm text-muted">
                هر یادداشت یا مشاهده‌ای را اضافه کنید (اختیاری)
              </Text>
            </View>

            <View
              className="rounded-lg p-4 border min-h-32"
              style={{
                backgroundColor: colors.surface,
                borderColor: colors.border,
              }}
            >
              {/* Text input placeholder */}
              <Text className="text-foreground text-sm">
                {notes || "یادداشت خود را اینجا بنویسید..."}
              </Text>
            </View>

            <View className="gap-2">
              <Text className="text-xs text-muted">مثال‌ها:</Text>
              <View className="gap-1">
                <Text className="text-xs text-muted">• درب بسته بود، در صندوق گذاشتم</Text>
                <Text className="text-xs text-muted">• مشتری حاضر نبود، همسایه تحویل داد</Text>
                <Text className="text-xs text-muted">• بسته‌ای خراب بود</Text>
              </View>
            </View>
          </View>
        )}

        {step === "signature" && (
          <View className="gap-4">
            <View>
              <Text className="text-lg font-semibold text-foreground mb-2">امضای مشتری</Text>
              <Text className="text-sm text-muted">
                امضای الکترونیکی مشتری (اختیاری)
              </Text>
            </View>

            <View
              className="w-full h-48 rounded-lg border-2 items-center justify-center"
              style={{
                backgroundColor: colors.surface,
                borderColor: colors.border,
                borderStyle: "dashed",
              }}
            >
              <View className="items-center gap-2">
                <IconSymbol name="signature" size={32} color={colors.muted} />
                <Text className="text-sm text-muted">امضا اینجا</Text>
              </View>
            </View>

            <View
              className="p-4 rounded-lg border"
              style={{
                backgroundColor: colors.surface,
                borderColor: colors.border,
              }}
            >
              <View className="flex-row items-start gap-2">
                <IconSymbol name="info.circle.fill" size={16} color={colors.primary} />
                <Text className="flex-1 text-xs text-muted leading-relaxed">
                  امضای مشتری برای تأیید تحویل ضروری نیست، اما می‌تواند مفید باشد
                </Text>
              </View>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Action Buttons */}
      <View className="flex-row gap-3 px-6 py-4 border-t" style={{ borderTopColor: colors.border }}>
        <Pressable
          onPress={() => {
            if (step === "photo") {
              // Go back
            } else if (step === "notes") {
              setStep("photo");
            } else {
              setStep("notes");
            }
          }}
          style={({ pressed }) => [
            {
              backgroundColor: colors.surface,
              opacity: pressed ? 0.7 : 1,
              flex: 1,
            },
          ]}
          className="py-3 rounded-lg items-center justify-center border"
        >
          <Text className="text-foreground font-semibold">بازگشت</Text>
        </Pressable>

        <Pressable
          onPress={handleNext}
          disabled={step === "photo" && photos.length === 0}
          style={({ pressed }) => [
            {
              backgroundColor: colors.primary,
              opacity: pressed ? 0.8 : step === "photo" && photos.length === 0 ? 0.5 : 1,
              flex: 1,
            },
          ]}
          className="py-3 rounded-lg items-center justify-center"
        >
          <Text className="text-white font-semibold">
            {step === "signature" ? "تکمیل" : "ادامه"}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
