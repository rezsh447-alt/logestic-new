import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  Alert,
  ActivityIndicator,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Package } from '@/lib/types/package';
import { PackageStorage } from '@/lib/storage/package-storage';
import { LocationService } from '@/lib/services/location-service';
import { ThemedView } from '@/components/themed-view';
import { useColors } from '@/hooks/use-colors';

/**
 * Screen for adding new packages
 */
export default function AddPackageScreen() {
  const router = useRouter();
  const colors = useColors();

  const [trackingNumber, setTrackingNumber] = useState('');
  const [address, setAddress] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Handle add package
   */
  const handleAddPackage = async () => {
    try {
      // Validate inputs
      if (!trackingNumber.trim()) {
        Alert.alert('خطا', 'لطفاً شماره مرسوله را وارد کنید');
        return;
      }

      if (!address.trim()) {
        Alert.alert('خطا', 'لطفاً آدرس را وارد کنید');
        return;
      }

      setIsLoading(true);

      // Check if package already exists
      const existingPackage = await PackageStorage.getPackage(trackingNumber);
      if (existingPackage) {
        Alert.alert('خطا', 'این شماره مرسوله قبلاً ثبت شده است');
        setIsLoading(false);
        return;
      }

      // Get location from address
      const location = await LocationService.getLocationFromAddress(address);

      // Create new package
      const newPackage: Package = {
        trackingNumber: trackingNumber.trim(),
        address: LocationService.normalizeAddress(address),
        lat: location?.lat,
        lng: location?.lng,
        status: 'pending',
        order: undefined,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };

      // Save to storage
      await PackageStorage.savePackage(newPackage);

      Alert.alert('موفق', 'بسته با موفقیت اضافه شد', [
        {
          text: 'بازگشت',
          onPress: () => {
            router.back();
          },
        },
      ]);

      // Clear form
      setTrackingNumber('');
      setAddress('');
    } catch (error) {
      console.error('Error adding package:', error);
      Alert.alert('خطا', 'خطایی در اضافه کردن بسته رخ داد');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ThemedView style={styles.container}>
        {/* Header */}
        <View style={[styles.header, { backgroundColor: colors.primary }]}>
          <Pressable onPress={() => router.back()}>
            <Text style={styles.backButton}>←</Text>
          </Pressable>
          <Text style={styles.headerTitle}>افزودن بسته جدید</Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView
          style={styles.content}
          contentContainerStyle={styles.contentContainer}
          keyboardShouldPersistTaps="handled"
        >
          {/* Tracking Number Input */}
          <View style={styles.formGroup}>
            <Text style={[styles.label, { color: colors.text }]}>
              شماره مرسوله *
            </Text>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: colors.card,
                  color: colors.text,
                  borderColor: colors.border,
                },
              ]}
              placeholder="مثال: TRK123456789"
              placeholderTextColor={colors.textSecondary}
              value={trackingNumber}
              onChangeText={setTrackingNumber}
              editable={!isLoading}
            />
          </View>

          {/* Address Input */}
          <View style={styles.formGroup}>
            <Text style={[styles.label, { color: colors.text }]}>
              آدرس *
            </Text>
            <TextInput
              style={[
                styles.input,
                styles.multilineInput,
                {
                  backgroundColor: colors.card,
                  color: colors.text,
                  borderColor: colors.border,
                },
              ]}
              placeholder="مثال: تهران، خیابان ولیعصر، پلاک 123"
              placeholderTextColor={colors.textSecondary}
              value={address}
              onChangeText={setAddress}
              multiline
              numberOfLines={4}
              editable={!isLoading}
              textAlignVertical="top"
            />
          </View>

          {/* Info Text */}
          <View style={styles.infoContainer}>
            <Text style={[styles.infoText, { color: colors.textSecondary }]}>
              ℹ️ آدرس به صورت خودکار به مختصات جغرافیایی تبدیل خواهد شد
            </Text>
          </View>

          {/* Action Buttons */}
          <View style={styles.buttonContainer}>
            <Pressable
              style={[
                styles.button,
                styles.cancelButton,
                { backgroundColor: colors.card },
              ]}
              onPress={() => router.back()}
              disabled={isLoading}
            >
              <Text style={[styles.buttonText, { color: colors.text }]}>
                لغو
              </Text>
            </Pressable>

            <Pressable
              style={[
                styles.button,
                styles.submitButton,
                { backgroundColor: colors.primary },
                isLoading && styles.buttonDisabled,
              ]}
              onPress={handleAddPackage}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>افزودن</Text>
              )}
            </Pressable>
          </View>
        </ScrollView>
      </ThemedView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  backButton: {
    fontSize: 24,
    color: '#fff',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
  },
  multilineInput: {
    minHeight: 100,
    paddingTop: 12,
  },
  infoContainer: {
    backgroundColor: 'rgba(33, 150, 243, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 6,
    marginBottom: 20,
  },
  infoText: {
    fontSize: 12,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    borderWidth: 1,
    borderColor: '#ccc',
  },
  submitButton: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
  },
});
