/**
 * @file common.types.ts
 * @description Core shared type contracts for EthioFarm Smart Farming System
 */

export type UserRole =
  | 'FARMER'
  | 'DEVELOPMENT_AGENT'
  | 'WOREDA_OFFICER'
  | 'ZONAL_OFFICER'
  | 'REGIONAL_OFFICER'
  | 'RESEARCHER'
  | 'ADMIN';

export interface UserProfile {
  id: string;
  fullName: string;
  phoneNumber?: string;
  email?: string;
  role: UserRole;
  regionId?: string;
  zoneId?: string;
  woredaId?: string;
  kebeleId?: string;
  preferredLang: 'en' | 'am' | 'om' | 'ti' | 'so';
}

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
  timestamp: string;
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
}

export type NetworkStatus = 'ONLINE' | 'OFFLINE' | 'SYNCING';
