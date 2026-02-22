import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Driver, DriverProfile } from '@/lib/types';
import { STORAGE_KEYS } from '@/constants/app-constants';
import { AuthService } from '@/lib/api/auth-service';
import { ForwardApi } from '@/lib/api/forward-api';

interface AuthContextType {
  smsCodeKey: string | null;
  checkAccount: (phoneNumber: string) => Promise<void>;
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
  const [smsCodeKey, setSmsCodeKey] = useState<string | null>(null);

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

  const checkAccount = async (phoneNumber: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await AuthService.checkAccount(phoneNumber);
      setSmsCodeKey(response.smsCodeKey);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'خطا در بررسی حساب';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (phoneNumber: string, otp: string) => {
    try {
      setIsLoading(true);
      setError(null);

      const { user } = await AuthService.login(phoneNumber, otp);
      
      // Map real user info to DriverProfile if needed
      const driverProfile: DriverProfile = {
        id: user.id || '1',
        phoneNumber: user.mobile || phoneNumber,
        firstName: user.name || '',
        lastName: user.family || '',
        email: '',
        rating: 5.0,
        totalDeliveries: 0,
        joinedDate: new Date().toISOString(),
        isActive: true,
        biometricEnabled: false,
        vehicleInfo: {
          id: '1',
          plateNumber: '',
          vehicleType: 'van',
          capacity: 0,
          color: '',
          insuranceExpiry: '',
          registrationExpiry: '',
        },
        bankAccount: {
          accountHolder: `${user.name} ${user.family}`,
          accountNumber: '',
          bankName: '',
        },
        documents: {
          licenseNumber: '',
          licenseExpiry: '',
          licenseImage: '',
          insuranceImage: '',
          registrationImage: '',
          backgroundCheckStatus: 'approved',
        },
      };

      setDriver(driverProfile);
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
      await AuthService.logout();
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
        smsCodeKey,
        checkAccount,
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
