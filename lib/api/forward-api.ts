import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '@/constants/app-constants';

const BASE_URL = 'https://service.forward-co.com';
const USER_AGENT = 'Dart/3.5 (dart:io)';

export const CDN_URL = 'https://cdn.forward-co.com/orderPicture';
export const SOCKET_URL = 'https://realtime.forward-co.com/hubs/plan';
export const MAP_TILE_URL = 'https://vt.parsimap.com/comapi.svc/tile/parsimap/{x}/{y}/{z}.png?token=ee9e06b3-dcaa-4a45-a60c-21ae72dca0bb';

async function getAuthToken() {
  return await AsyncStorage.getItem(STORAGE_KEYS.DRIVER_TOKEN);
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = await getAuthToken();
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'User-Agent': USER_AGENT,
    ...((options.headers as Record<string, string>) || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const url = endpoint.startsWith('http') ? endpoint : `${BASE_URL}${endpoint}`;
  
  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Request failed with status ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`API Request Error (${endpoint}):`, error);
    throw error;
  }
}

export const ForwardApi = {
  // Auth
  checkAccount: (mobile: string) => 
    request<{ smsCodeKey: string }>('/gateway/identity/checkAccountCourier', {
      method: 'POST',
      body: JSON.stringify({ mobile }),
    }),

  login: (mobile: string, smsCode: string, smsCodeKey: string) => 
    request<{ access: string; refresh: string }>('/gateway/identity/loginCourier', {
      method: 'POST',
      body: JSON.stringify({ mobile, smsCode, smsCodeKey }),
    }),

  getUserInfo: () => 
    request<any>('/gateway/identity/getUserInfo'),

  // Config & State
  getConfig: () => 
    request<any>('/gateway/config/GetCourierConfig'),

  getState: () => 
    request<any>('/gateway/operation/courier/config/GetState'),

  // Cluster / Orders
  getClusterOverview: () => 
    request<any>('/gateway/operation/courier/cluster/GetClusterOverview'),

  getClusterPreview: () => 
    request<any>('/gateway/operation/courier/cluster/GetClusterPreview'),

  getClusterPickup: () => 
    request<any>('/gateway/operation/courier/cluster/getClusterPickup'),

  saveClusterPickup: (data: any) => 
    request<any>('/gateway/operation/courier/cluster/SaveClusterPickup', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  saveClusterFinish: (data: any) => 
    request<any>('/gateway/operation/courier/cluster/SaveClusterFinish', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // Visit & Scan
  getVisitInfoFull: (params: any) => {
    const query = new URLSearchParams(params).toString();
    return request<any>(`/gateway/operation/courier/visit/GetVisitInfoFull?${query}`);
  },

  getScanCode: (params: any) => {
    const query = new URLSearchParams(params).toString();
    return request<any>(`/gateway/operation/courier/scanCode/getScanCode?${query}`);
  },

  saveScanCode: (data: any) => 
    request<any>('/gateway/operation/courier/scanCode/saveScanCode', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // Notifications
  getNotifications: () => 
    request<any>('/gateway/notification/courier/notif/getCourierNotifList'),

  setFCMToken: (token: string) => 
    request<any>('/gateway/notification/courier/token/setFCM', {
      method: 'POST',
      body: JSON.stringify({ token }),
    }),

  // Financial
  getWalletTransactions: () => 
    request<any>('/gateway/financial/payment/GetWalletTransListByUser'),

  getSalaryList: () => 
    request<any>('/gateway/operation/courier/finance/getSalaryList'),

  // Calendar
  getCalendar: () => 
    request<any>('/gateway/operation/courier/calendar/getCalendar'),

  saveCalendar: (data: any) => 
    request<any>('/gateway/operation/courier/calendar/SaveCalendar', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // Geo & Location
  getDirection: (params: any) => {
    const query = new URLSearchParams(params).toString();
    return request<any>(`/gateway/geo/map/getDirection?${query}`);
  },

  sendLocation: (data: any) => 
    request<any>('/gateway/realtime/location/SendCourierLocation', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};
