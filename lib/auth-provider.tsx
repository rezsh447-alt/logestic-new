import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Driver, DriverProfile } from '@/lib/types';
import { STORAGE_KEYS } from '@/constants/app-constants';

interface AuthContextType {
  driver: DriverProfile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (phoneNumber: string, otp: string) => Promise<void>;
  loginWithBiometric: () => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (driver: DriverProfile) => Promise<void>;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [driver, setDriver] = useState<DriverProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize auth state on app load
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        setIsLoading(true);
        const storedToken = await AsyncStorage.getItem(STORAGE_KEYS.DRIVER_TOKEN);
        const storedDriver = await AsyncStorage.getItem(STORAGE_KEYS.DRIVER_DATA);

        if (storedToken && storedDriver) {
          const driverData = JSON.parse(storedDriver);
          setDriver(driverData);
        }
      } catch (err) {
        console.error('Auth initialization error:', err);
        setError('خطا در بارگذاری اطلاعات');
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (phoneNumber: string, otp: string) => {
    try {
      setIsLoading(true);
      setError(null);

      // Simulate API call
      // In production, this would call your backend API
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Mock driver data
      const mockDriver: DriverProfile = {
        id: '1',
        phoneNumber,
        firstName: 'محمد',
        lastName: 'علی',
        email: 'driver@forward.ir',
        rating: 4.8,
        totalDeliveries: 123,
        joinedDate: '2024-01-15',
        isActive: true,
        biometricEnabled: false,
        profileImage: undefined,
        vehicleInfo: {
          id: '1',
          plateNumber: 'ب۱۲۳ب۱۲',
          vehicleType: 'van',
          capacity: 500,
          color: 'سفید',
          insuranceExpiry: '2025-12-31',
          registrationExpiry: '2025-12-31',
        },
        bankAccount: {
          accountHolder: 'محمد علی',
          accountNumber: '1234567890',
          bankName: 'بانک ملی',
        },
        documents: {
          licenseNumber: 'L123456789',
          licenseExpiry: '2026-12-31',
          licenseImage: '',
          insuranceImage: '',
          registrationImage: '',
          backgroundCheckStatus: 'approved',
        },
      };

      // Store token and driver data
      await AsyncStorage.setItem(STORAGE_KEYS.DRIVER_TOKEN, 'mock_token_' + Date.now());
      await AsyncStorage.setItem(STORAGE_KEYS.DRIVER_DATA, JSON.stringify(mockDriver));

      setDriver(mockDriver);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'خطا در ورود';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithBiometric = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Simulate biometric authentication
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const storedDriver = await AsyncStorage.getItem(STORAGE_KEYS.DRIVER_DATA);
      if (storedDriver) {
        const driverData = JSON.parse(storedDriver);
        setDriver(driverData);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'خطا در احراز هویت بیومتریک';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      await AsyncStorage.removeItem(STORAGE_KEYS.DRIVER_TOKEN);
      await AsyncStorage.removeItem(STORAGE_KEYS.DRIVER_DATA);
      setDriver(null);
      setError(null);
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (updatedDriver: DriverProfile) => {
    try {
      setIsLoading(true);
      setError(null);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      await AsyncStorage.setItem(STORAGE_KEYS.DRIVER_DATA, JSON.stringify(updatedDriver));
      setDriver(updatedDriver);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'خطا در بروزرسانی پروفایل';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        driver,
        isLoading,
        isAuthenticated: !!driver,
        login,
        loginWithBiometric,
        logout,
        updateProfile,
        error,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within AuthProvider');
  }
  return context;
}

export function useAuth() {
  const { driver, isAuthenticated, isLoading } = useAuthContext();
  return { driver, isAuthenticated, isLoading };
}
