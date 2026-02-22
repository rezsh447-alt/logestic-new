import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { PackageStats } from '@/lib/types/package';
import { PackageStorage } from '@/lib/storage/package-storage';
import { useColors } from '@/hooks/use-colors';

interface PackageStatsProps {
  refreshTrigger?: number;
}

/**
 * Package statistics counter component
 */
export const PackageStatsComponent: React.FC<PackageStatsProps> = ({ refreshTrigger }) => {
  const colors = useColors();
  const [stats, setStats] = useState<PackageStats>({
    total: 0,
    delivered: 0,
    pending: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  /**
   * Load package statistics
   */
  const loadStats = async () => {
    try {
      setIsLoading(true);
      const packageStats = await PackageStorage.getPackageStats();
      setStats(packageStats);
    } catch (error) {
      console.error('Error loading package stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Load stats on mount and when refresh trigger changes
   */
  useEffect(() => {
    loadStats();
  }, [refreshTrigger]);

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="small" color={colors.primary} />
      </View>
    );
  }

  const deliveryPercentage =
    stats.total > 0 ? Math.round((stats.delivered / stats.total) * 100) : 0;

  return (
    <View style={[styles.container, { backgroundColor: colors.card }]}>
      {/* Total Packages */}
      <View style={styles.statItem}>
        <Text style={[styles.statValue, { color: colors.primary }]}>
          {stats.total}
        </Text>
        <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
          کل بسته‌ها
        </Text>
      </View>

      {/* Delivered Packages */}
      <View style={styles.divider} />
      <View style={styles.statItem}>
        <Text style={[styles.statValue, { color: '#4CAF50' }]}>
          {stats.delivered}
        </Text>
        <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
          تحویل شده
        </Text>
      </View>

      {/* Pending Packages */}
      <View style={styles.divider} />
      <View style={styles.statItem}>
        <Text style={[styles.statValue, { color: '#FFC107' }]}>
          {stats.pending}
        </Text>
        <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
          در انتظار
        </Text>
      </View>

      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <View style={styles.progressLabel}>
          <Text style={[styles.progressText, { color: colors.textSecondary }]}>
            درصد تحویل
          </Text>
          <Text style={[styles.progressPercentage, { color: colors.primary }]}>
            {deliveryPercentage}%
          </Text>
        </View>
        <View
          style={[
            styles.progressBar,
            { backgroundColor: colors.border },
          ]}
        >
          <View
            style={[
              styles.progressFill,
              {
                width: `${deliveryPercentage}%`,
                backgroundColor: '#4CAF50',
              },
            ]}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginHorizontal: 12,
    marginVertical: 8,
  },
  statItem: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    marginVertical: 8,
  },
  progressContainer: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.1)',
  },
  progressLabel: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressText: {
    fontSize: 12,
    fontWeight: '500',
  },
  progressPercentage: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  progressBar: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
});
