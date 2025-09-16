// src/services/serviceFactory.ts
import { createDatabaseClient } from '@/lib/database/factory';
import { AgreementService } from './agreementService';
import { AgreementServiceUnified } from './agreementServiceUnified';
import { UserService } from './userService';

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
    // UserService can be extended to support unified auth in the future
    return new UserService();
  }

  public getDatabaseClient() {
    return this.dbClient;
  }
}
