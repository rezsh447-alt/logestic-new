import { useState, useCallback, useEffect, useRef } from 'react';
import { Location, TrackingData, RoutePoint } from '@/lib/types';
import { LOCATION_UPDATE_INTERVAL, GEOFENCE_RADIUS } from '@/constants/app-constants';

interface LocationState {
  currentLocation: Location | null;
  isTracking: boolean;
  isLoading: boolean;
  error: string | null;
  trackingHistory: Location[];
}

export function useLocationTracking() {
  const [state, setState] = useState<LocationState>({
    currentLocation: null,
    isTracking: false,
    isLoading: false,
    error: null,
    trackingHistory: [],
  });

  const trackingIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startTracking = useCallback(async () => {
    try {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));

      // Simulate getting initial location
      await new Promise((resolve) => setTimeout(resolve, 500));

      const initialLocation: Location = {
        id: `loc_${Date.now()}`,
        address: 'تهران، خیابان ولیعصر',
        latitude: 35.7595,
        longitude: 51.3801,
        city: 'تهران',
        postalCode: '1234567890',
      };

      setState((prev) => ({
        ...prev,
        currentLocation: initialLocation,
        isTracking: true,
        trackingHistory: [initialLocation],
        isLoading: false,
      }));

      // Start periodic location updates
      trackingIntervalRef.current = setInterval(() => {
        setState((prev) => {
          if (!prev.currentLocation) return prev;

          // Simulate location update with small random changes
          const newLocation: Location = {
            ...prev.currentLocation,
            id: `loc_${Date.now()}`,
            latitude: prev.currentLocation.latitude + (Math.random() - 0.5) * 0.001,
            longitude: prev.currentLocation.longitude + (Math.random() - 0.5) * 0.001,
          };

          return {
            ...prev,
            currentLocation: newLocation,
            trackingHistory: [...prev.trackingHistory, newLocation].slice(-100), // Keep last 100 locations
          };
        });
      }, LOCATION_UPDATE_INTERVAL);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'خطا در شروع ردیابی';
      setState((prev) => ({ ...prev, error: errorMessage, isLoading: false }));
    }
  }, []);

  const stopTracking = useCallback(() => {
    if (trackingIntervalRef.current) {
      clearInterval(trackingIntervalRef.current);
      trackingIntervalRef.current = null;
    }

    setState((prev) => ({
      ...prev,
      isTracking: false,
    }));
  }, []);

  const calculateDistance = useCallback((
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number => {
    const R = 6371; // Earth's radius in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }, []);

  const checkGeofence = useCallback(
    (targetLocation: Location): boolean => {
      if (!state.currentLocation) return false;

      const distance = calculateDistance(
        state.currentLocation.latitude,
        state.currentLocation.longitude,
        targetLocation.latitude,
        targetLocation.longitude
      );

      return distance * 1000 <= GEOFENCE_RADIUS; // Convert km to meters
    },
    [state.currentLocation, calculateDistance]
  );

  const getTotalDistance = useCallback((): number => {
    if (state.trackingHistory.length < 2) return 0;

    let total = 0;
    for (let i = 1; i < state.trackingHistory.length; i++) {
      const distance = calculateDistance(
        state.trackingHistory[i - 1].latitude,
        state.trackingHistory[i - 1].longitude,
        state.trackingHistory[i].latitude,
        state.trackingHistory[i].longitude
      );
      total += distance;
    }

    return total;
  }, [state.trackingHistory, calculateDistance]);

  const getTrackingData = useCallback(
    (orderId: string, driverId: string, eta?: string): TrackingData | null => {
      if (!state.currentLocation) return null;

      const route: RoutePoint[] = state.trackingHistory.map((loc) => ({
        latitude: loc.latitude,
        longitude: loc.longitude,
        timestamp: new Date().toISOString(),
        speed: Math.random() * 60,
      }));

      return {
        orderId,
        driverId,
        currentLocation: state.currentLocation,
        route,
        eta: eta || new Date(Date.now() + 15 * 60000).toISOString(),
        distanceRemaining: 2.5,
        estimatedTimeRemaining: 15,
        speed: Math.random() * 60,
        heading: Math.random() * 360,
        accuracy: 15,
        timestamp: new Date().toISOString(),
      };
    },
    [state.currentLocation, state.trackingHistory]
  );

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (trackingIntervalRef.current) {
        clearInterval(trackingIntervalRef.current);
      }
    };
  }, []);

  return {
    ...state,
    startTracking,
    stopTracking,
    checkGeofence,
    getTotalDistance,
    getTrackingData,
    calculateDistance,
  };
}
