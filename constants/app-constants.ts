/**
 * Application Constants
 */

export const APP_NAME = 'Forward';
export const APP_VERSION = '1.0.0';

// ============= API Configuration =============
export const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';
export const API_TIMEOUT = 30000; // 30 seconds

// ============= Storage Keys =============
export const STORAGE_KEYS = {
  DRIVER_TOKEN: '@forward_driver_token',
  DRIVER_DATA: '@forward_driver_data',
  SHIFT_DATA: '@forward_shift_data',
  BIOMETRIC_ENABLED: '@forward_biometric_enabled',
  LANGUAGE: '@forward_language',
  THEME: '@forward_theme',
  NOTIFICATION_PREFERENCES: '@forward_notification_prefs',
  CACHED_ORDERS: '@forward_cached_orders',
  LAST_LOCATION: '@forward_last_location',
};

// ============= Order Status =============
export const ORDER_STATUSES = {
  PENDING: 'pending',
  ASSIGNED: 'assigned',
  ACCEPTED: 'accepted',
  PICKED_UP: 'picked_up',
  IN_TRANSIT: 'in_transit',
  ARRIVED: 'arrived',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
  FAILED: 'failed',
} as const;

export const ORDER_STATUS_LABELS: Record<string, string> = {
  pending: 'در انتظار',
  assigned: 'تخصیص داده شده',
  accepted: 'پذیرفته شده',
  picked_up: 'برداشته شده',
  in_transit: 'در حال انتقال',
  arrived: 'رسیده',
  delivered: 'تحویل داده شده',
  cancelled: 'لغو شده',
  failed: 'ناموفق',
};

// ============= Vehicle Types =============
export const VEHICLE_TYPES = {
  MOTORCYCLE: 'motorcycle',
  CAR: 'car',
  VAN: 'van',
  TRUCK: 'truck',
} as const;

export const VEHICLE_TYPE_LABELS: Record<string, string> = {
  motorcycle: 'موتورسیکلت',
  car: 'خودروی سواری',
  van: 'ون',
  truck: 'کامیون',
};

// ============= Payment Methods =============
export const PAYMENT_METHODS = {
  CASH: 'cash',
  CARD: 'card',
  WALLET: 'wallet',
} as const;

export const PAYMENT_METHOD_LABELS: Record<string, string> = {
  cash: 'نقد',
  card: 'کارت بانکی',
  wallet: 'کیف پول',
};

// ============= Notification Types =============
export const NOTIFICATION_TYPES = {
  ORDER_ASSIGNED: 'order_assigned',
  ORDER_REMINDER: 'order_reminder',
  DELIVERY_COMPLETED: 'delivery_completed',
  PAYMENT_RECEIVED: 'payment_received',
  SYSTEM_ALERT: 'system_alert',
  SUPPORT_MESSAGE: 'support_message',
} as const;

// ============= Support Ticket Priority =============
export const TICKET_PRIORITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  URGENT: 'urgent',
} as const;

export const TICKET_PRIORITY_LABELS: Record<string, string> = {
  low: 'کم',
  medium: 'متوسط',
  high: 'بالا',
  urgent: 'فوری',
};

// ============= Geofence Settings =============
export const GEOFENCE_RADIUS = 100; // meters
export const LOCATION_UPDATE_INTERVAL = 10000; // 10 seconds
export const LOCATION_ACCURACY_THRESHOLD = 50; // meters

// ============= Earnings Configuration =============
export const EARNINGS_CONFIG = {
  BASE_RATE_PER_KM: 5000, // Rials
  BASE_RATE_PER_DELIVERY: 10000, // Rials
  SURGE_MULTIPLIER: 1.5,
  BONUS_THRESHOLD: 10, // deliveries
};

// ============= UI Configuration =============
export const TAB_BAR_HEIGHT = 56;
export const HEADER_HEIGHT = 56;
export const BUTTON_HEIGHT = 48;
export const CARD_PADDING = 12;
export const SCREEN_PADDING = 16;

// ============= Languages =============
export const LANGUAGES = {
  FA: 'fa',
  EN: 'en',
} as const;

export type Language = typeof LANGUAGES[keyof typeof LANGUAGES];

// ============= Themes =============
export const THEMES = {
  LIGHT: 'light',
  DARK: 'dark',
  AUTO: 'auto',
} as const;

export type Theme = typeof THEMES[keyof typeof THEMES];

// ============= Date Formats =============
export const DATE_FORMATS = {
  DISPLAY: 'dd/MM/yyyy',
  DISPLAY_WITH_TIME: 'dd/MM/yyyy HH:mm',
  API: 'yyyy-MM-dd',
  API_WITH_TIME: 'yyyy-MM-ddTHH:mm:ss',
} as const;

// ============= Validation Rules =============
export const VALIDATION = {
  PHONE_REGEX: /^(\+98|0)?9\d{9}$/,
  OTP_LENGTH: 6,
  PASSWORD_MIN_LENGTH: 8,
  PLATE_NUMBER_REGEX: /^[A-Z]{2}\d{3}[A-Z]{2}$/,
} as const;

// ============= Feature Flags =============
export const FEATURE_FLAGS = {
  ENABLE_BIOMETRIC: true,
  ENABLE_CHAT_SUPPORT: true,
  ENABLE_EARNINGS_EXPORT: true,
  ENABLE_OFFLINE_MODE: true,
  ENABLE_DARK_MODE: true,
} as const;
