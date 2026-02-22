/**
 * Core type definitions for Forward Driver App
 */

// ============= Authentication =============
export interface Driver {
  id: string;
  phoneNumber: string;
  firstName: string;
  lastName: string;
  email?: string;
  profileImage?: string;
  rating: number;
  totalDeliveries: number;
  joinedDate: string;
  isActive: boolean;
  biometricEnabled: boolean;
}

export interface DriverProfile extends Driver {
  vehicleInfo: VehicleInfo;
  bankAccount: BankAccount;
  documents: DriverDocuments;
  emergencyContact?: EmergencyContact;
}

export interface VehicleInfo {
  id: string;
  plateNumber: string;
  vehicleType: 'motorcycle' | 'car' | 'van' | 'truck';
  capacity: number; // kg
  color: string;
  insuranceExpiry: string;
  registrationExpiry: string;
}

export interface BankAccount {
  accountHolder: string;
  accountNumber: string;
  bankName: string;
  IBAN?: string;
}

export interface DriverDocuments {
  licenseNumber: string;
  licenseExpiry: string;
  licenseImage: string;
  insuranceImage: string;
  registrationImage: string;
  backgroundCheckStatus: 'pending' | 'approved' | 'rejected';
}

export interface EmergencyContact {
  name: string;
  phoneNumber: string;
  relationship: string;
}

// ============= Orders & Deliveries =============
export interface Order {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  pickupLocation: Location;
  deliveryLocation: Location;
  sender: Contact;
  receiver: Contact;
  items: OrderItem[];
  totalWeight: number; // kg
  totalValue: number;
  specialInstructions?: string;
  paymentMethod: 'cash' | 'card' | 'wallet';
  paymentStatus: 'pending' | 'paid' | 'failed';
  createdAt: string;
  scheduledPickupTime?: string;
  scheduledDeliveryTime?: string;
  assignedDriverId?: string;
  acceptedAt?: string;
  pickedUpAt?: string;
  deliveredAt?: string;
  estimatedEarnings: number;
}

export type OrderStatus = 'pending' | 'assigned' | 'accepted' | 'picked_up' | 'in_transit' | 'arrived' | 'delivered' | 'cancelled' | 'failed';

export interface OrderItem {
  id: string;
  description: string;
  quantity: number;
  weight: number;
  value: number;
  fragile: boolean;
}

export interface Location {
  id: string;
  address: string;
  latitude: number;
  longitude: number;
  city: string;
  postalCode: string;
  notes?: string;
}

export interface Contact {
  name: string;
  phoneNumber: string;
  email?: string;
}

// ============= Tracking & Navigation =============
export interface TrackingData {
  orderId: string;
  driverId: string;
  currentLocation: Location;
  route: RoutePoint[];
  eta: string;
  distanceRemaining: number; // km
  estimatedTimeRemaining: number; // minutes
  speed: number; // km/h
  heading: number; // degrees
  accuracy: number; // meters
  timestamp: string;
}

export interface RoutePoint {
  latitude: number;
  longitude: number;
  timestamp: string;
  speed: number;
}

export interface DeliveryProof {
  orderId: string;
  driverId: string;
  pickupPhotos: string[];
  deliveryPhotos: string[];
  customerSignature?: string;
  notes: string;
  proofTime: string;
  coordinates: Location;
}

// ============= Earnings & Reports =============
export interface Earnings {
  date: string;
  totalEarnings: number;
  totalDeliveries: number;
  totalDistance: number; // km
  totalTime: number; // minutes
  orders: EarningsOrder[];
}

export interface EarningsOrder {
  orderId: string;
  orderNumber: string;
  amount: number;
  distance: number;
  time: number;
  status: OrderStatus;
}

export interface EarningsReport {
  period: 'daily' | 'weekly' | 'monthly';
  startDate: string;
  endDate: string;
  totalEarnings: number;
  totalDeliveries: number;
  totalDistance: number;
  averageEarningsPerDelivery: number;
  averageEarningsPerKm: number;
  dailyBreakdown: Earnings[];
}

// ============= Shift Management =============
export interface Shift {
  id: string;
  driverId: string;
  startTime: string;
  endTime?: string;
  status: 'active' | 'completed' | 'cancelled';
  totalDeliveries: number;
  totalEarnings: number;
  totalDistance: number;
  totalTime: number;
  orders: Order[];
}

// ============= Support & Communication =============
export interface ChatMessage {
  id: string;
  conversationId: string;
  senderId: string;
  senderType: 'driver' | 'support';
  message: string;
  attachments?: string[];
  timestamp: string;
  read: boolean;
}

export interface SupportTicket {
  id: string;
  ticketNumber: string;
  driverId: string;
  subject: string;
  description: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category: string;
  messages: ChatMessage[];
  createdAt: string;
  resolvedAt?: string;
}

// ============= Notifications =============
export interface Notification {
  id: string;
  driverId: string;
  type: NotificationType;
  title: string;
  message: string;
  data?: Record<string, any>;
  read: boolean;
  timestamp: string;
  actionUrl?: string;
}

export type NotificationType = 'order_assigned' | 'order_reminder' | 'delivery_completed' | 'payment_received' | 'system_alert' | 'support_message';

// ============= API Response Wrappers =============
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}
