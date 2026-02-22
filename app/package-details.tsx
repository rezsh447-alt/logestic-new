import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Alert,
  ActivityIndicator,
  ScrollView,
  Linking,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Package } from '@/lib/types/package';
import { PackageStorage } from '@/lib/storage/package-storage';
import { ThemedView } from '@/components/themed-view';
import { useColors } from '@/hooks/use-colors';

/**
 * Package details screen
 */
export default function PackageDetailsScreen() {
  const router = useRouter();
  const colors = useColors();
  const { trackingNumber } = useLocalSearchParams<{ trackingNumber: string }>();

  const [pkg, setPkg] = useState<Package | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  /**
   * Load package details
   */
  useEffect(() => {
    loadPackageDetails();
  }, [trackingNumber]);

  const loadPackageDetails = async () => {
    try {
      if (!trackingNumber) {
        Alert.alert('خطا', 'شماره مرسوله مشخص نشده است');
        router.back();
        return;
      }

      setIsLoading(true);
      const packageData = await PackageStorage.getPackage(trackingNumber);

      if (packageData) {
        setPkg(packageData);
      } else {
        Alert.alert('خطا', 'بسته‌ای یافت نشد');
        router.back();
      }
    } catch (error) {
      console.error('Error loading package:', error);
      Alert.alert('خطا', 'خطایی در بارگذاری بسته رخ داد');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Toggle package status
   */
  const handleToggleStatus = async () => {
    if (!pkg) return;

    try {
      setIsUpdating(true);
      const newStatus = pkg.status === 'pending' ? 'delivered' : 'pending';
      await PackageStorage.updatePackageStatus(pkg.trackingNumber, newStatus);

      setPkg({ ...pkg, status: newStatus });
      Alert.alert(
        'موفق',
        `وضعیت بسته به "${newStatus === 'delivered' ? 'تحویل شده' : 'در انتظار'}" تغییر یافت`
      );
    } catch (error) {
      console.error('Error updating status:', error);
      Alert.alert('خطا', 'خطایی در تغییر وضعیت رخ داد');
    } finally {
      setIsUpdating(false);
    }
  };

  /**
   * Open location in maps
   */
  const handleOpenLocation = () => {
    if (!pkg || !pkg.lat || !pkg.lng) {
      Alert.alert('خطا', 'مختصات جغرافیایی برای این بسته موجود نیست');
      return;
    }

    const url = `https://maps.google.com/?q=${pkg.lat},${pkg.lng}`;
    Linking.openURL(url).catch(() => {
      Alert.alert('خطا', 'نتوانست نقشه را باز کند');
    });
  };

  /**
   * Handle delete package
   */
  const handleDeletePackage = () => {
    if (!pkg) return;

    Alert.alert(
      'حذف بسته',
      'آیا مطمئن هستید که می‌خواهید این بسته را حذف کنید؟',
      [
        { text: 'لغو', style: 'cancel' },
        {
          text: 'حذف',
          style: 'destructive',
          onPress: async () => {
            try {
              await PackageStorage.deletePackage(pkg.trackingNumber);
              Alert.alert('موفق', 'بسته با موفقیت حذف شد', [
                {
                  text: 'بازگشت',
                  onPress: () => router.back(),
                },
              ]);
            } catch (error) {
              Alert.alert('خطا', 'خطایی در حذف بسته رخ داد');
            }
          },
        },
      ]
    );
  };

  if (isLoading) {
    return (
      <ThemedView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </ThemedView>
    );
  }

  if (!pkg) {
    return (
      <ThemedView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={[styles.errorText, { color: colors.text }]}>
            بسته‌ای یافت نشد
          </Text>
        </View>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.primary }]}>
        <Pressable onPress={() => router.back()}>
          <Text style={styles.backButton}>←</Text>
        </Pressable>
        <Text style={styles.headerTitle}>جزئیات بسته</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        {/* Status Card */}
        <View
          style={[
            styles.statusCard,
            {
              backgroundColor:
                pkg.status === 'delivered'
                  ? 'rgba(76, 175, 80, 0.1)'
                  : 'rgba(255, 193, 7, 0.1)',
            },
          ]}
        >
          <Text
            style={[
              styles.statusLabel,
              {
                color: pkg.status === 'delivered' ? '#4CAF50' : '#FFC107',
              },
            ]}
          >
            وضعیت: {pkg.status === 'delivered' ? 'تحویل شده' : 'در انتظار'}
          </Text>
        </View>

        {/* Details Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            اطلاعات بسته
          </Text>

          <View style={[styles.detailRow, { borderBottomColor: colors.border }]}>
            <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>
              شماره مرسوله:
            </Text>
            <Text style={[styles.detailValue, { color: colors.text }]}>
              {pkg.trackingNumber}
            </Text>
          </View>

          <View style={[styles.detailRow, { borderBottomColor: colors.border }]}>
            <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>
              آدرس:
            </Text>
            <Text style={[styles.detailValue, { color: colors.text }]}>
              {pkg.address}
            </Text>
          </View>

          {pkg.order !== undefined && pkg.order !== null && (
            <View style={[styles.detailRow, { borderBottomColor: colors.border }]}>
              <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>
                ترتیب تحویل:
              </Text>
              <Text style={[styles.detailValue, { color: colors.text }]}>
                #{pkg.order}
              </Text>
            </View>
          )}

          {pkg.lat !== undefined && pkg.lng !== undefined && (
            <View style={[styles.detailRow, { borderBottomColor: colors.border }]}>
              <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>
                مختصات:
              </Text>
              <Text style={[styles.detailValue, { color: colors.text }]}>
                {pkg.lat.toFixed(4)}, {pkg.lng.toFixed(4)}
              </Text>
            </View>
          )}
        </View>

        {/* Timestamps Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            تاریخ‌ها
          </Text>

          <View style={[styles.detailRow, { borderBottomColor: colors.border }]}>
            <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>
              ایجاد شده:
            </Text>
            <Text style={[styles.detailValue, { color: colors.text }]}>
              {new Date(pkg.createdAt).toLocaleString('fa-IR')}
            </Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>
              آخرین تغییر:
            </Text>
            <Text style={[styles.detailValue, { color: colors.text }]}>
              {new Date(pkg.updatedAt).toLocaleString('fa-IR')}
            </Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionContainer}>
          {pkg.lat !== undefined && pkg.lng !== undefined && (
            <Pressable
              style={[styles.actionButton, { backgroundColor: '#2196F3' }]}
              onPress={handleOpenLocation}
            >
              <Text style={styles.actionButtonText}>📍 نشان دادن در نقشه</Text>
            </Pressable>
          )}

          <Pressable
            style={[
              styles.actionButton,
              {
                backgroundColor:
                  pkg.status === 'delivered' ? '#FF9800' : '#4CAF50',
              },
            ]}
            onPress={handleToggleStatus}
            disabled={isUpdating}
          >
            {isUpdating ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.actionButtonText}>
                {pkg.status === 'delivered'
                  ? '↩️ بازگشت به در انتظار'
                  : '✓ تحویل شد'}
              </Text>
            )}
          </Pressable>

          <Pressable
            style={[styles.actionButton, { backgroundColor: '#f44336' }]}
            onPress={handleDeletePackage}
          >
            <Text style={styles.actionButtonText}>🗑️ حذف</Text>
          </Pressable>
        </View>
      </ScrollView>
    </ThemedView>
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
    paddingVertical: 16,
    paddingBottom: 32,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
  },
  statusCard: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 20,
  },
  statusLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  detailLabel: {
    fontSize: 13,
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'right',
  },
  actionContainer: {
    gap: 12,
    marginTop: 20,
  },
  actionButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
});
