import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  TextInput,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { Package, PackageStatus } from '@/lib/types/package';
import { PackageStorage } from '@/lib/storage/package-storage';
import { ThemedView } from '@/components/themed-view';
import { useColors } from '@/hooks/use-colors';

/**
 * Packages management screen with list, search, and filter functionality
 */
export default function PackagesScreen() {
  const router = useRouter();
  const colors = useColors();

  const [packages, setPackages] = useState<Package[]>([]);
  const [filteredPackages, setFilteredPackages] = useState<Package[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<PackageStatus | 'all'>('all');
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  /**
   * Load packages from storage
   */
  const loadPackages = useCallback(async () => {
    try {
      setIsLoading(true);
      const allPackages = await PackageStorage.getAllPackages();
      setPackages(allPackages);
      applyFilters(allPackages, searchQuery, filterStatus);
    } catch (error) {
      console.error('Error loading packages:', error);
      Alert.alert('خطا', 'خطایی در بارگذاری بسته‌ها رخ داد');
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery, filterStatus]);

  /**
   * Apply search and filter to packages
   */
  const applyFilters = (
    pkgs: Package[],
    query: string,
    status: PackageStatus | 'all'
  ) => {
    let filtered = pkgs;

    // Apply search filter
    if (query.trim()) {
      const lowerQuery = query.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.trackingNumber.toLowerCase().includes(lowerQuery) ||
          p.address.toLowerCase().includes(lowerQuery)
      );
    }

    // Apply status filter
    if (status !== 'all') {
      filtered = filtered.filter((p) => p.status === status);
    }

    setFilteredPackages(filtered);
  };

  /**
   * Handle search input change
   */
  const handleSearchChange = (text: string) => {
    setSearchQuery(text);
    applyFilters(packages, text, filterStatus);
  };

  /**
   * Handle status filter change
   */
  const handleStatusFilterChange = (status: PackageStatus | 'all') => {
    setFilterStatus(status);
    applyFilters(packages, searchQuery, status);
  };

  /**
   * Handle refresh
   */
  const handleRefresh = async () => {
    setRefreshing(true);
    await loadPackages();
    setRefreshing(false);
  };

  /**
   * Handle package deletion
   */
  const handleDeletePackage = (trackingNumber: string) => {
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
              await PackageStorage.deletePackage(trackingNumber);
              await loadPackages();
              Alert.alert('موفق', 'بسته با موفقیت حذف شد');
            } catch (error) {
              Alert.alert('خطا', 'خطایی در حذف بسته رخ داد');
            }
          },
        },
      ]
    );
  };

  /**
   * Refresh packages when screen is focused
   */
  useFocusEffect(
    useCallback(() => {
      loadPackages();
    }, [loadPackages])
  );

  /**
   * Render package item
   */
  const renderPackageItem = ({ item }: { item: Package }) => (
    <Pressable
      style={[styles.packageItem, { backgroundColor: colors.card }]}
      onPress={() =>
        router.push({
          pathname: '/package-details',
          params: { trackingNumber: item.trackingNumber },
        })
      }
    >
      <View style={styles.packageHeader}>
        <View style={styles.packageTitleContainer}>
          <Text style={[styles.packageTitle, { color: colors.text }]}>
            {item.order ? `#${item.order} - ` : ''}
            {item.trackingNumber}
          </Text>
          <Text style={[styles.packageAddress, { color: colors.textSecondary }]}>
            {item.address}
          </Text>
        </View>
        <View
          style={[
            styles.statusBadge,
            {
              backgroundColor:
                item.status === 'delivered' ? '#4CAF50' : '#FFC107',
            },
          ]}
        >
          <Text style={styles.statusText}>
            {item.status === 'delivered' ? 'تحویل شده' : 'در انتظار'}
          </Text>
        </View>
      </View>

      <View style={styles.packageFooter}>
        <Pressable
          style={[styles.actionButton, { backgroundColor: colors.primary }]}
          onPress={() =>
            router.push({
              pathname: '/package-details',
              params: { trackingNumber: item.trackingNumber },
            })
          }
        >
          <Text style={styles.actionButtonText}>جزئیات</Text>
        </Pressable>

        <Pressable
          style={[styles.actionButton, { backgroundColor: '#f44336' }]}
          onPress={() => handleDeletePackage(item.trackingNumber)}
        >
          <Text style={styles.actionButtonText}>حذف</Text>
        </Pressable>
      </View>
    </Pressable>
  );

  return (
    <ThemedView style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.primary }]}>
        <Text style={styles.headerTitle}>مدیریت بسته‌ها</Text>
      </View>

      {/* Search Bar */}
      <View style={[styles.searchContainer, { backgroundColor: colors.card }]}>
        <TextInput
          style={[styles.searchInput, { color: colors.text }]}
          placeholder="جستجو بر اساس شماره مرسوله یا آدرس"
          placeholderTextColor={colors.textSecondary}
          value={searchQuery}
          onChangeText={handleSearchChange}
        />
      </View>

      {/* Filter Buttons */}
      <View style={styles.filterContainer}>
        <Pressable
          style={[
            styles.filterButton,
            filterStatus === 'all' && styles.filterButtonActive,
            { backgroundColor: filterStatus === 'all' ? colors.primary : colors.card },
          ]}
          onPress={() => handleStatusFilterChange('all')}
        >
          <Text
            style={[
              styles.filterButtonText,
              { color: filterStatus === 'all' ? '#fff' : colors.text },
            ]}
          >
            همه
          </Text>
        </Pressable>

        <Pressable
          style={[
            styles.filterButton,
            filterStatus === 'pending' && styles.filterButtonActive,
            {
              backgroundColor: filterStatus === 'pending' ? colors.primary : colors.card,
            },
          ]}
          onPress={() => handleStatusFilterChange('pending')}
        >
          <Text
            style={[
              styles.filterButtonText,
              { color: filterStatus === 'pending' ? '#fff' : colors.text },
            ]}
          >
            در انتظار
          </Text>
        </Pressable>

        <Pressable
          style={[
            styles.filterButton,
            filterStatus === 'delivered' && styles.filterButtonActive,
            {
              backgroundColor:
                filterStatus === 'delivered' ? colors.primary : colors.card,
            },
          ]}
          onPress={() => handleStatusFilterChange('delivered')}
        >
          <Text
            style={[
              styles.filterButtonText,
              { color: filterStatus === 'delivered' ? '#fff' : colors.text },
            ]}
          >
            تحویل شده
          </Text>
        </Pressable>
      </View>

      {/* Package List */}
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : filteredPackages.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
            بسته‌ای یافت نشد
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredPackages}
          renderItem={renderPackageItem}
          keyExtractor={(item) => item.trackingNumber}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor={colors.primary}
            />
          }
          contentContainerStyle={styles.listContent}
        />
      )}

      {/* Add Package Button */}
      <Pressable
        style={[styles.fab, { backgroundColor: colors.primary }]}
        onPress={() => router.push('/add-package')}
      >
        <Text style={styles.fabText}>+</Text>
      </Pressable>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  searchContainer: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginHorizontal: 8,
    marginVertical: 8,
    borderRadius: 8,
  },
  searchInput: {
    fontSize: 14,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 8,
  },
  filterButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  filterButtonActive: {
    opacity: 1,
  },
  filterButtonText: {
    fontSize: 12,
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
  },
  listContent: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  packageItem: {
    marginVertical: 8,
    padding: 12,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  packageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  packageTitleContainer: {
    flex: 1,
  },
  packageTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  packageAddress: {
    fontSize: 12,
  },
  statusBadge: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
    marginLeft: 8,
  },
  statusText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#fff',
  },
  packageFooter: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 4,
    alignItems: 'center',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  fabText: {
    fontSize: 28,
    color: '#fff',
    fontWeight: 'bold',
  },
});
