import { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Driver } from '@/lib/types';

interface AuthContextType {
  driver: Driver | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (phoneNumber: string, otp: string) => Promise<void>;
  loginWithBiometric: () => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (driver: Driver) => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

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
