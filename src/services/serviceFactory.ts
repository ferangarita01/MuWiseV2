// src/services/serviceFactory.ts
import { createDatabaseClient } from '@/lib/database/factory';
import { AgreementService } from './agreementService';
import { AgreementServiceUnified } from './agreementServiceUnified';
import { UserService } from './userService';
import { UserServiceUnified } from './userServiceUnified';
import { StorageServiceUnified } from './storageServiceUnified';

export class ServiceFactory {
  private static instance: ServiceFactory;
  private dbClient: any;

  private constructor() {
    this.dbClient = createDatabaseClient();
  }

  public static getInstance(): ServiceFactory {
    if (!ServiceFactory.instance) {
      ServiceFactory.instance = new ServiceFactory();
    }
    return ServiceFactory.instance;
  }

  public getAgreementService() {
    const useSupabase = process.env.USE_SUPABASE === 'true';
    
    if (useSupabase) {
      console.log("[Service Factory] Using Unified Agreement Service");
      return new AgreementServiceUnified();
    } else {
      console.log("[Service Factory] Using Firebase Agreement Service");
      return new AgreementService();
    }
  }

  public getUserService() {
    const useSupabase = process.env.USE_SUPABASE === 'true';
    
    if (useSupabase) {
      console.log("[Service Factory] Using Unified User Service");
      return new UserServiceUnified();
    } else {
      console.log("[Service Factory] Using Firebase User Service");
      return new UserService();
    }
  }

  public getStorageService() {
    console.log("[Service Factory] Using Unified Storage Service");
    return new StorageServiceUnified();
  }

  public getDatabaseClient() {
    return this.dbClient;
  }
}
