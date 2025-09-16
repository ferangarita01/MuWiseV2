// Exportar todos los tipos
export * from './common';
export * from './user';
export * from './agreement';

// Re-exportar tipos comunes para fácil acceso
export type { 
  BaseEntity, 
  ApiResponse, 
  PaginationParams,
  Status 
} from './common';

export type { 
  User, 
  UserRole, 
  UserProfile, 
  CreateUserData, 
  UpdateUserData 
} from './user';

export type { 
  Agreement, 
  AgreementStatus, 
  AgreementType, 
  Signer, 
  CreateAgreementData, 
  UpdateAgreementData 
} from './agreement';