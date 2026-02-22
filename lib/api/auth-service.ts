import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '@/constants/app-constants';
import { ForwardApi } from './forward-api';

export const AuthService = {
  async checkAccount(mobile: string) {
    try {
      const response = await ForwardApi.checkAccount(mobile);
      // Store smsCodeKey for the next step
      if (response.smsCodeKey) {
        await AsyncStorage.setItem('temp_sms_code_key', response.smsCodeKey);
      }
      return response;
    } catch (error) {
      console.error('Check account error:', error);
      throw error;
    }
  },

  async login(mobile: string, smsCode: string) {
    try {
      const smsCodeKey = await AsyncStorage.getItem('temp_sms_code_key');
      if (!smsCodeKey) {
        throw new Error('SMS code key not found. Please request a code first.');
      }

      const response = await ForwardApi.login(mobile, smsCode, smsCodeKey);
      
      if (response.access) {
        await AsyncStorage.setItem(STORAGE_KEYS.DRIVER_TOKEN, response.access);
        // Optionally store refresh token if needed
        if (response.refresh) {
          await AsyncStorage.setItem('refresh_token', response.refresh);
        }
        
        // Fetch and store user info
        const userInfo = await ForwardApi.getUserInfo();
        await AsyncStorage.setItem(STORAGE_KEYS.DRIVER_DATA, JSON.stringify(userInfo));
        
        // Clean up
        await AsyncStorage.removeItem('temp_sms_code_key');
        
        return { token: response.access, user: userInfo };
      } else {
        throw new Error('Login failed: No access token received');
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  async logout() {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.DRIVER_TOKEN);
      await AsyncStorage.removeItem(STORAGE_KEYS.DRIVER_DATA);
      await AsyncStorage.removeItem('refresh_token');
    } catch (error) {
      console.error('Logout error:', error);
    }
  },

  async isAuthenticated() {
    const token = await AsyncStorage.getItem(STORAGE_KEYS.DRIVER_TOKEN);
    return !!token;
  },

  async getUserData() {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.DRIVER_DATA);
    return data ? JSON.parse(data) : null;
  }
};
