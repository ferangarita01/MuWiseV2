import { BaseEntity } from './common';

export interface User extends BaseEntity {
  email: string;
  name: string;
  profilePicture?: string;
  phone?: string;
  company?: string;
  role: UserRole;
  isEmailVerified: boolean;
  lastLogin?: Date;
  preferences: UserPreferences;
  stripeCustomerId?: string;
  stripePriceId?: string;
  stripeSubscriptionId?: string;
  stripeSubscriptionStatus?: string;
}

export type UserRole = 'admin' | 'user' | 'client';

export interface UserPreferences {
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
  theme: 'light' | 'dark' | 'system';
  language: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  address?: Address;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface CreateUserData {
  email: string;
  name: string;
  password: string;
  company?: string;
  phone?: string;
}

export interface UpdateUserData {
  name?: string;
  phone?: string;
  company?: string;
  profilePicture?: string;
  preferences?: Partial<UserPreferences>;
}
