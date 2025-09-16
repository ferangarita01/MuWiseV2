// src/services/userServiceUnified.ts
import { createDatabaseClient } from '@/lib/database/factory';
import { StorageServiceUnified } from './storageServiceUnified';

export class UserServiceUnified {
  private dbClient: any;
  private storageService: StorageServiceUnified;

  constructor() {
    const client = createDatabaseClient();
    this.dbClient = client.db;
    this.storageService = new StorageServiceUnified();
  }

  async uploadProfilePhoto(file: File, userId: string): Promise<{ downloadURL: string }> {
    return this.storageService.uploadProfilePhoto(file, userId);
  }

  async createUser(userData: any): Promise<any> {
    return this.dbClient.createUser(userData);
  }

  async getUser(userId: string): Promise<any> {
    return this.dbClient.getUser(userId);
  }

  async updateUser(userId: string, userData: any): Promise<any> {
    return this.dbClient.updateUser(userId, userData);
  }

  async deleteUser(userId: string): Promise<void> {
    return this.dbClient.deleteUser(userId);
  }

  async updateProfile(userId: string, profileData: any): Promise<any> {
    return this.dbClient.updateUser(userId, profileData);
  }

  async getProfile(userId: string): Promise<any> {
    return this.dbClient.getUser(userId);
  }
}
