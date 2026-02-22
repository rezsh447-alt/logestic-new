import AsyncStorage from '@react-native-async-storage/async-storage';
import { Package, PackageStats, PackageStatus } from '../types/package';

const PACKAGES_KEY = '@logestic_packages';

/**
 * Local storage service for package management
 */
export class PackageStorage {
  /**
   * Get all packages from storage
   */
  static async getAllPackages(): Promise<Package[]> {
    try {
      const data = await AsyncStorage.getItem(PACKAGES_KEY);
      if (!data) return [];
      const packages = JSON.parse(data);
      return Array.isArray(packages) ? packages : Object.values(packages);
    } catch (error) {
      console.error('Error getting packages:', error);
      return [];
    }
  }

  /**
   * Get a single package by tracking number
   */
  static async getPackage(trackingNumber: string): Promise<Package | null> {
    try {
      const packages = await this.getAllPackages();
      return packages.find((p) => p.trackingNumber === trackingNumber) || null;
    } catch (error) {
      console.error('Error getting package:', error);
      return null;
    }
  }

  /**
   * Add or update a package
   */
  static async savePackage(pkg: Package): Promise<void> {
    try {
      const packages = await this.getAllPackages();
      const index = packages.findIndex((p) => p.trackingNumber === pkg.trackingNumber);

      if (index >= 0) {
        packages[index] = { ...packages[index], ...pkg, updatedAt: Date.now() };
      } else {
        packages.push({
          ...pkg,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        });
      }

      await AsyncStorage.setItem(PACKAGES_KEY, JSON.stringify(packages));
    } catch (error) {
      console.error('Error saving package:', error);
      throw error;
    }
  }

  /**
   * Delete a package
   */
  static async deletePackage(trackingNumber: string): Promise<void> {
    try {
      const packages = await this.getAllPackages();
      const filtered = packages.filter((p) => p.trackingNumber !== trackingNumber);
      await AsyncStorage.setItem(PACKAGES_KEY, JSON.stringify(filtered));
    } catch (error) {
      console.error('Error deleting package:', error);
      throw error;
    }
  }

  /**
   * Update package status
   */
  static async updatePackageStatus(trackingNumber: string, status: PackageStatus): Promise<void> {
    try {
      const pkg = await this.getPackage(trackingNumber);
      if (pkg) {
        await this.savePackage({ ...pkg, status });
      }
    } catch (error) {
      console.error('Error updating package status:', error);
      throw error;
    }
  }

  /**
   * Get package statistics
   */
  static async getPackageStats(): Promise<PackageStats> {
    try {
      const packages = await this.getAllPackages();
      const delivered = packages.filter((p) => p.status === 'delivered').length;
      return {
        total: packages.length,
        delivered,
        pending: packages.length - delivered,
      };
    } catch (error) {
      console.error('Error getting package stats:', error);
      return { total: 0, delivered: 0, pending: 0 };
    }
  }

  /**
   * Search packages by tracking number or address
   */
  static async searchPackages(query: string): Promise<Package[]> {
    try {
      const packages = await this.getAllPackages();
      const lowerQuery = query.toLowerCase();
      return packages.filter(
        (p) =>
          p.trackingNumber.toLowerCase().includes(lowerQuery) ||
          p.address.toLowerCase().includes(lowerQuery)
      );
    } catch (error) {
      console.error('Error searching packages:', error);
      return [];
    }
  }

  /**
   * Filter packages by status
   */
  static async filterPackagesByStatus(status: PackageStatus | 'all'): Promise<Package[]> {
    try {
      const packages = await this.getAllPackages();
      if (status === 'all') return packages;
      return packages.filter((p) => p.status === status);
    } catch (error) {
      console.error('Error filtering packages:', error);
      return [];
    }
  }

  /**
   * Clear all packages (for testing/reset)
   */
  static async clearAllPackages(): Promise<void> {
    try {
      await AsyncStorage.removeItem(PACKAGES_KEY);
    } catch (error) {
      console.error('Error clearing packages:', error);
      throw error;
    }
  }

  /**
   * Get packages sorted by delivery order
   */
  static async getPackagesByOrder(): Promise<Package[]> {
    try {
      const packages = await this.getAllPackages();
      return packages
        .filter((p) => p.order !== undefined && p.order !== null)
        .sort((a, b) => (a.order || 0) - (b.order || 0));
    } catch (error) {
      console.error('Error getting packages by order:', error);
      return [];
    }
  }

  /**
   * Update multiple packages with new order
   */
  static async updatePackagesOrder(updates: Array<{ trackingNumber: string; order: number }>): Promise<void> {
    try {
      const packages = await this.getAllPackages();
      for (const update of updates) {
        const pkg = packages.find((p) => p.trackingNumber === update.trackingNumber);
        if (pkg) {
          pkg.order = update.order;
          pkg.updatedAt = Date.now();
        }
      }
      await AsyncStorage.setItem(PACKAGES_KEY, JSON.stringify(packages));
    } catch (error) {
      console.error('Error updating packages order:', error);
      throw error;
    }
  }
}
