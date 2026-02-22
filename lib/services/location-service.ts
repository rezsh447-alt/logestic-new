import * as Location from 'expo-location';
import { PackageLocation } from '../types/package';

/**
 * Service for location and geocoding operations
 */
export class LocationService {
  /**
   * Get current device location
   */
  static async getCurrentLocation(): Promise<{ latitude: number; longitude: number } | null> {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.error('Location permission denied');
        return null;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      return {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };
    } catch (error) {
      console.error('Error getting current location:', error);
      return null;
    }
  }

  /**
   * Normalize address string
   */
  static normalizeAddress(input: string): string {
    let addr = input;
    addr = addr.replace(/\s+/g, ' '); // Replace multiple spaces with single space
    addr = addr.replace(/[(),.\-]/g, ' '); // Remove special characters
    return addr.trim();
  }

  /**
   * Get coordinates from address using Neshan API
   * Note: Requires NESHAN_API_KEY environment variable
   */
  static async getLocationFromAddress(address: string): Promise<PackageLocation | null> {
    try {
      const normalizedAddress = this.normalizeAddress(address);
      const apiKey = process.env.EXPO_PUBLIC_NESHAN_API_KEY;

      if (!apiKey) {
        console.warn('Neshan API key not configured');
        // Return mock coordinates for development
        return {
          lat: 35.6892,
          lng: 51.389,
          address: normalizedAddress,
        };
      }

      const url = `https://api.neshan.org/v4/geocoding?address=${encodeURIComponent(normalizedAddress)}`;
      const response = await fetch(url, {
        headers: {
          'Api-Key': apiKey,
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.location) {
          return {
            lat: data.location.y,
            lng: data.location.x,
            address: normalizedAddress,
          };
        }
      }

      return null;
    } catch (error) {
      console.error('Error getting location from address:', error);
      return null;
    }
  }

  /**
   * Calculate distance between two coordinates (Haversine formula)
   */
  static calculateDistance(
    lat1: number,
    lng1: number,
    lat2: number,
    lng2: number
  ): number {
    const R = 6371; // Earth's radius in km
    const dLat = this.toRad(lat2 - lat1);
    const dLng = this.toRad(lng2 - lng1);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRad(lat1)) *
        Math.cos(this.toRad(lat2)) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  /**
   * Convert degrees to radians
   */
  private static toRad(deg: number): number {
    return deg * (Math.PI / 180);
  }

  /**
   * Get reverse geocoding (coordinates to address)
   */
  static async getAddressFromCoordinates(lat: number, lng: number): Promise<string | null> {
    try {
      const results = await Location.reverseGeocodeAsync({ latitude: lat, longitude: lng });
      if (results.length > 0) {
        const result = results[0];
        return `${result.street || ''} ${result.city || ''} ${result.region || ''}`.trim();
      }
      return null;
    } catch (error) {
      console.error('Error getting address from coordinates:', error);
      return null;
    }
  }
}
