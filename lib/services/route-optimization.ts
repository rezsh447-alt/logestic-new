import { Package, RouteOptimizationResult } from '../types/package';
import { LocationService } from './location-service';

/**
 * Service for route optimization using nearest neighbor algorithm
 */
export class RouteOptimizationService {
  /**
   * Optimize delivery route using nearest neighbor algorithm
   * Finds the nearest unvisited package from current location
   */
  static async optimizeRoute(
    packages: Package[],
    currentLat: number,
    currentLng: number
  ): Promise<RouteOptimizationResult[]> {
    try {
      // Filter packages with valid coordinates
      const validPackages = packages.filter((p) => p.lat !== undefined && p.lng !== undefined);

      if (validPackages.length === 0) {
        return [];
      }

      const results: RouteOptimizationResult[] = [];
      const visited = new Set<string>();
      let currentLocation = { lat: currentLat, lng: currentLng };
      let order = 1;

      // Nearest neighbor algorithm
      while (visited.size < validPackages.length) {
        let nearestPackage: Package | null = null;
        let minDistance = Infinity;

        for (const pkg of validPackages) {
          if (!visited.has(pkg.trackingNumber) && pkg.lat !== undefined && pkg.lng !== undefined) {
            const distance = LocationService.calculateDistance(
              currentLocation.lat,
              currentLocation.lng,
              pkg.lat,
              pkg.lng
            );

            if (distance < minDistance) {
              minDistance = distance;
              nearestPackage = pkg;
            }
          }
        }

        if (nearestPackage && nearestPackage.lat !== undefined && nearestPackage.lng !== undefined) {
          visited.add(nearestPackage.trackingNumber);
          results.push({
            trackingNumber: nearestPackage.trackingNumber,
            order,
            lat: nearestPackage.lat,
            lng: nearestPackage.lng,
          });

          currentLocation = {
            lat: nearestPackage.lat,
            lng: nearestPackage.lng,
          };
          order++;
        } else {
          break;
        }
      }

      return results;
    } catch (error) {
      console.error('Error optimizing route:', error);
      return [];
    }
  }

  /**
   * Calculate total route distance
   */
  static calculateTotalDistance(
    startLat: number,
    startLng: number,
    packages: RouteOptimizationResult[]
  ): number {
    let totalDistance = 0;
    let currentLat = startLat;
    let currentLng = startLng;

    for (const pkg of packages) {
      totalDistance += LocationService.calculateDistance(currentLat, currentLng, pkg.lat, pkg.lng);
      currentLat = pkg.lat;
      currentLng = pkg.lng;
    }

    return totalDistance;
  }

  /**
   * Get estimated delivery time based on average speed
   * Assumes average speed of 30 km/h in urban areas
   */
  static getEstimatedDeliveryTime(totalDistance: number, averageSpeedKmh: number = 30): number {
    // Returns time in minutes
    return Math.ceil((totalDistance / averageSpeedKmh) * 60);
  }

  /**
   * Cluster packages by proximity (optional advanced optimization)
   * Groups packages that are close to each other
   */
  static clusterPackages(packages: Package[], clusterRadiusKm: number = 2): Package[][] {
    try {
      const clusters: Package[][] = [];
      const visited = new Set<string>();

      for (const pkg of packages) {
        if (visited.has(pkg.trackingNumber) || pkg.lat === undefined || pkg.lng === undefined) {
          continue;
        }

        const cluster: Package[] = [pkg];
        visited.add(pkg.trackingNumber);

        for (const otherPkg of packages) {
          if (
            !visited.has(otherPkg.trackingNumber) &&
            otherPkg.lat !== undefined &&
            otherPkg.lng !== undefined
          ) {
            const distance = LocationService.calculateDistance(
              pkg.lat,
              pkg.lng,
              otherPkg.lat,
              otherPkg.lng
            );

            if (distance <= clusterRadiusKm) {
              cluster.push(otherPkg);
              visited.add(otherPkg.trackingNumber);
            }
          }
        }

        clusters.push(cluster);
      }

      return clusters;
    } catch (error) {
      console.error('Error clustering packages:', error);
      return [];
    }
  }
}
