import { AgreementService } from './agreementService';
import { UserService } from './userService';
import { EmailService } from './emailService';
import { SigningService } from './signingService';
import { UsageService } from './usageService'; // <-- AÑADIR NUEVO SERVICIO

// Singleton pattern para servicios
class ServiceContainer {
  private static instances: Map<string, any> = new Map();
  
  static getAgreementService(): AgreementService {
    if (!this.instances.has('agreement')) {
      this.instances.set('agreement', new AgreementService());
    }
    return this.instances.get('agreement');
  }
  
  static getUserService(): UserService {
    if (!this.instances.has('user')) {
      this.instances.set('user', new UserService());
    }
    return this.instances.get('user');
  }
  
  static getEmailService(): EmailService {
    if (!this.instances.has('email')) {
      this.instances.set('email', new EmailService());
    }
    return this.instances.get('email');
  }

  static getSigningService(): SigningService {
    if (!this.instances.has('signing')) {
      this.instances.set('signing', new SigningService());
    }
    return this.instances.get('signing');
  }

  static getUsageService(): UsageService { // <-- AÑADIR GETTER
    if (!this.instances.has('usage')) {
      this.instances.set('usage', new UsageService());
    }
    return this.instances.get('usage');
  }
  
  // Limpiar instancias (útil para testing)
  static clear(): void {
    this.instances.clear();
  }
}

export { ServiceContainer };
export * from './agreementService';
export * from './userService';
export * from './emailService';
export * from './signingService';
export * from './usageService'; // <-- EXPORTAR NUEVO SERVICIO
