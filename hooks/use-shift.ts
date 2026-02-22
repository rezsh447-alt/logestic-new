import { useState, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Shift } from '@/lib/types';
import { STORAGE_KEYS } from '@/constants/app-constants';

interface ShiftState {
  currentShift: Shift | null;
  isLoading: boolean;
  error: string | null;
}

export function useShift() {
  const [state, setState] = useState<ShiftState>({
    currentShift: null,
    isLoading: false,
    error: null,
  });

  const startShift = useCallback(async (driverId: string) => {
    try {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const newShift: Shift = {
        id: `shift_${Date.now()}`,
        driverId,
        startTime: new Date().toISOString(),
        status: 'active',
        totalDeliveries: 0,
        totalEarnings: 0,
        totalDistance: 0,
        totalTime: 0,
        orders: [],
      };

      await AsyncStorage.setItem(STORAGE_KEYS.SHIFT_DATA, JSON.stringify(newShift));
      setState((prev) => ({ ...prev, currentShift: newShift, isLoading: false }));

      return newShift;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'خطا در شروع شیفت';
      setState((prev) => ({ ...prev, error: errorMessage, isLoading: false }));
      throw err;
    }
  }, []);

  const endShift = useCallback(async () => {
    try {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));

      if (!state.currentShift) {
        throw new Error('هیچ شیفت فعالی وجود ندارد');
      }

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const completedShift: Shift = {
        ...state.currentShift,
        endTime: new Date().toISOString(),
        status: 'completed',
      };

      await AsyncStorage.removeItem(STORAGE_KEYS.SHIFT_DATA);
      setState((prev) => ({ ...prev, currentShift: null, isLoading: false }));

      return completedShift;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'خطا در پایان شیفت';
      setState((prev) => ({ ...prev, error: errorMessage, isLoading: false }));
      throw err;
    }
  }, [state.currentShift]);

  const updateShiftStats = useCallback(
    async (stats: {
      totalDeliveries?: number;
      totalEarnings?: number;
      totalDistance?: number;
      totalTime?: number;
    }) => {
      try {
        if (!state.currentShift) {
          throw new Error('هیچ شیفت فعالی وجود ندارد');
        }

        const updatedShift: Shift = {
          ...state.currentShift,
          totalDeliveries: stats.totalDeliveries ?? state.currentShift.totalDeliveries,
          totalEarnings: stats.totalEarnings ?? state.currentShift.totalEarnings,
          totalDistance: stats.totalDistance ?? state.currentShift.totalDistance,
          totalTime: stats.totalTime ?? state.currentShift.totalTime,
        };

        await AsyncStorage.setItem(STORAGE_KEYS.SHIFT_DATA, JSON.stringify(updatedShift));
        setState((prev) => ({ ...prev, currentShift: updatedShift }));

        return updatedShift;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'خطا در بروزرسانی آمار شیفت';
        setState((prev) => ({ ...prev, error: errorMessage }));
        throw err;
      }
    },
    [state.currentShift]
  );

  const loadShift = useCallback(async () => {
    try {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));

      const storedShift = await AsyncStorage.getItem(STORAGE_KEYS.SHIFT_DATA);
      if (storedShift) {
        const shift = JSON.parse(storedShift);
        setState((prev) => ({ ...prev, currentShift: shift, isLoading: false }));
      } else {
        setState((prev) => ({ ...prev, currentShift: null, isLoading: false }));
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'خطا در بارگذاری شیفت';
      setState((prev) => ({ ...prev, error: errorMessage, isLoading: false }));
    }
  }, []);

  return {
    ...state,
    startShift,
    endShift,
    updateShiftStats,
    loadShift,
  };
}
