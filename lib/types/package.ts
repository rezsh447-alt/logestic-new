/**
 * Package Management Types
 */

export type PackageStatus = 'pending' | 'delivered';

export interface Package {
  trackingNumber: string;
  address: string;
  lat?: number;
  lng?: number;
  status: PackageStatus;
  order?: number;
  createdAt: number;
  updatedAt: number;
}

export interface PackageLocation {
  lat: number;
  lng: number;
  address: string;
}

export interface RouteOptimizationResult {
  trackingNumber: string;
  order: number;
  lat: number;
  lng: number;
}

export interface PackageStats {
  total: number;
  delivered: number;
  pending: number;
}
