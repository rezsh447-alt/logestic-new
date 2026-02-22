import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Alert,
  ActivityIndicator,
  ScrollView,
  FlatList,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Package, RouteOptimizationResult } from '@/lib/types/package';
import { PackageStorage } from '@/lib/storage/package-storage';
import { LocationService } from '@/lib/services/location-service';
import { RouteOptimizationService } from '@/lib/services/route-optimization';
import { ThemedView } from '@/components/themed-view';
import { useColors } from '@/hooks/use-colors';

/**
 * Route optimization screen
 */
export default function RouteOptimizationScreen() {
  const router = useRouter();
  const colors = useColors();

  const [packages, setPackages] = useState<Package[]>([]);
  const [optimizedRoute, setOptimizedRoute] = useState<RouteOptimizationResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [totalDistance, setTotalDistance] = useState(0);
  const [estimatedTime, setEstimatedTime] = useState(0);

  /**
   * Load packages on screen focus
   */
  useEffect(() => {
    loadPackages();
  }, []);

  /**
   * Load packages from storage
   */
  const loadPackages = async () => {
    try {
      setIsLoading(true);
      const allPackages = await PackageStorage.getAllPackages();
      // Filter only pending packages
      const pendingPackages = allPackages.filter((p) => p.status === 'pending');
      setPackages(pendingPackages);
    } catch (error) {
      console.error('Error loading packages:', error);
      Alert.alert('خطا', 'خطایی در بارگذاری بسته‌ها رخ داد');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Handle route optimization
   */
  const handleOptimizeRoute = async () => {
    try {
      if (packages.length === 0) {
        Alert.alert('خطا', 'بسته‌ای برای بهینه‌سازی موجود نیست');
        return;
      }

      setIsOptimizing(true);

      // Get current location
      const currentLocation = await LocationService.getCurrentLocation();
      if (!currentLocation) {
        Alert.alert('خطا', 'نتوانست موقعیت فعلی را دریافت کند');
        setIsOptimizing(false);
        return;
      }

      // Optimize route
      const optimized = await RouteOptimizationService.optimizeRoute(
        packages,
        currentLocation.latitude,
        currentLocation.longitude
      );

      if (optimized.length === 0) {
        Alert.alert('خطا', 'نتوانست مسیر را بهینه‌سازی کند');
        setIsOptimizing(false);
        return;
      }

      setOptimizedRoute(optimized);

      // Calculate total distance
      const distance = RouteOptimizationService.calculateTotalDistance(
        currentLocation.latitude,
        currentLocation.longitude,
        optimized
      );
      setTotalDistance(distance);

      // Calculate estimated time
      const time = RouteOptimizationService.getEstimatedDeliveryTime(distance);
      setEstimatedTime(time);

      // Save optimized order to storage
      const updates = optimized.map((item) => ({
        trackingNumber: item.trackingNumber,
        order: item.order,
      }));
      await PackageStorage.updatePackagesOrder(updates);

      Alert.alert(
        'موفق',
        `مسیر بهینه‌سازی شد\nتعداد بسته‌ها: ${optimized.length}\nفاصله کل: ${distance.toFixed(2)} کیلومتر\nزمان تخمینی: ${time} دقیقه`
      );
    } catch (error) {
      console.error('Error optimizing route:', error);
      Alert.alert('خطا', 'خطایی در بهینه‌سازی مسیر رخ داد');
    } finally {
      setIsOptimizing(false);
    }
  };

  /**
   * Render optimized route item
   */
  const renderRouteItem = ({ item, index }: { item: RouteOptimizationResult; index: number }) => (
    <Pressable
      style={[styles.routeItem, { backgroundColor: colors.card }]}
      onPress={() =>
        router.push({
          pathname: '/package-details',
          params: { trackingNumber: item.trackingNumber },
        })
      }
    >
      <View style={[styles.orderBadge, { backgroundColor: colors.primary }]}>
        <Text style={styles.orderText}>#{item.order}</Text>
      </View>
      <View style={styles.routeItemContent}>
        <Text style={[styles.routeItemTitle, { color: colors.text }]}>
          {item.trackingNumber}
        </Text>
        <Text style={[styles.routeItemCoords, { color: colors.textSecondary }]}>
          {item.lat.toFixed(4)}, {item.lng.toFixed(4)}
        </Text>
      </View>
      <Text style={[styles.routeItemArrow, { color: colors.textSecondary }]}>
        →
      </Text>
    </Pressable>
  );

  if (isLoading) {
    return (
      <ThemedView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
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
        <Text style={styles.headerTitle}>بهینه‌سازی مسیر</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        {/* Info Card */}
        <View style={[styles.infoCard, { backgroundColor: colors.card }]}>
          <Text style={[styles.infoTitle, { color: colors.text }]}>
            بسته‌های در انتظار
          </Text>
          <Text style={[styles.infoValue, { color: colors.primary }]}>
            {packages.length}
          </Text>
        </View>

        {/* Optimization Results */}
        {optimizedRoute.length > 0 && (
          <>
            {/* Statistics */}
            <View style={styles.statsContainer}>
              <View style={[styles.statCard, { backgroundColor: colors.card }]}>
                <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
                  فاصله کل
                </Text>
                <Text style={[styles.statValue, { color: colors.primary }]}>
                  {totalDistance.toFixed(2)} کیلومتر
                </Text>
              </View>

              <View style={[styles.statCard, { backgroundColor: colors.card }]}>
                <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
                  زمان تخمینی
                </Text>
                <Text style={[styles.statValue, { color: colors.primary }]}>
                  {estimatedTime} دقیقه
                </Text>
              </View>
            </View>

            {/* Optimized Route List */}
            <View style={styles.routeSection}>
              <Text style={[styles.routeTitle, { color: colors.text }]}>
                ترتیب تحویل
              </Text>
              <FlatList
                data={optimizedRoute}
                renderItem={renderRouteItem}
                keyExtractor={(item) => item.trackingNumber}
                scrollEnabled={false}
                ItemSeparatorComponent={() => (
                  <View style={[styles.separator, { backgroundColor: colors.border }]} />
                )}
              />
            </View>
          </>
        )}

        {/* Empty State */}
        {packages.length === 0 && optimizedRoute.length === 0 && (
          <View style={styles.emptyContainer}>
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
              بسته‌ای برای بهینه‌سازی موجود نیست
            </Text>
          </View>
        )}

        {/* Optimize Button */}
        <Pressable
          style={[
            styles.optimizeButton,
            { backgroundColor: colors.primary },
            isOptimizing && styles.buttonDisabled,
          ]}
          onPress={handleOptimizeRoute}
          disabled={isOptimizing || packages.length === 0}
        >
          {isOptimizing ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.optimizeButtonText}>
              🚀 بهینه‌سازی مسیر
            </Text>
          )}
        </Pressable>

        {/* Refresh Button */}
        <Pressable
          style={[
            styles.refreshButton,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
          onPress={loadPackages}
        >
          <Text style={[styles.refreshButtonText, { color: colors.text }]}>
            🔄 بازخوانی
          </Text>
        </Pressable>
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
  infoCard: {
    paddingHorizontal: 16,
    paddingVertical: 20,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
  },
  infoValue: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  routeSection: {
    marginBottom: 20,
  },
  routeTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  routeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 8,
  },
  orderBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  orderText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  routeItemContent: {
    flex: 1,
  },
  routeItemTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  routeItemCoords: {
    fontSize: 11,
  },
  routeItemArrow: {
    fontSize: 18,
    marginLeft: 8,
  },
  separator: {
    height: 1,
    marginVertical: 8,
  },
  emptyContainer: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
  },
  optimizeButton: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  optimizeButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  refreshButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  refreshButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
});
