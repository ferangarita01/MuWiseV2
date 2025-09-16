// src/lib/database/types.ts
import { User as FirebaseUser } from 'firebase/auth'
import { User as SupabaseUser, Session } from '@supabase/supabase-js'

// Tipos comunes para ambos sistemas
export interface AuthUser {
  id: string
  email: string
  name?: string
  profilePicture?: string
  phone?: string
  company?: string
  role?: string
  isEmailVerified?: boolean
  lastLogin?: Date
  preferences?: any
  stripeCustomerId?: string
  stripePriceId?: string
  stripeSubscriptionId?: string
  stripeSubscriptionStatus?: string
  createdAt?: Date
  updatedAt?: Date
}

export interface Agreement {
  id: string
  title: string
  songTitle?: string
  description?: string
  publicationDate?: Date
  lastModified: Date
  composers: any[]
  status: string
  type: string
  createdBy: string
  signers: Signer[]
  documentUrl?: string
  metadata: any
  expiresAt?: Date
  signedAt?: Date
  completedAt?: Date
  pdfUrl?: string
  createdAt: Date
  updatedAt: Date
}

export interface Signer {
  id: string
  userId?: string
  email: string
  name: string
  role: string
  status: string
  signedAt?: Date
  signatureData?: string
  order: number
}

// Interfaces para operaciones de base de datos
export interface DatabaseClient {
  auth: AuthClient
  db: DatabaseOperations
  storage: StorageClient
}

export interface AuthClient {
  // Autenticación
  signIn: (email: string, password: string) => Promise<AuthResult>
  signUp: (email: string, password: string, metadata?: any) => Promise<AuthResult>
  signOut: () => Promise<void>
  getCurrentUser: () => Promise<AuthUser | null>
  onAuthStateChanged: (callback: (user: AuthUser | null) => void) => () => void
  
  // Tokens
  getToken: () => Promise<string | null>
  refreshToken: () => Promise<string | null>
}

export interface AuthResult {
  user: AuthUser | null
  error: Error | null
  session?: any
}

export interface DatabaseOperations {
  // Usuarios
  createUser: (userData: Partial<AuthUser>) => Promise<AuthUser>
  getUser: (userId: string) => Promise<AuthUser | null>
  updateUser: (userId: string, userData: Partial<AuthUser>) => Promise<AuthUser>
  deleteUser: (userId: string) => Promise<void>
  
  // Acuerdos
  createAgreement: (agreementData: Partial<Agreement>) => Promise<Agreement>
  getAgreement: (agreementId: string) => Promise<Agreement | null>
  getAgreements: (userId: string, filters?: any) => Promise<Agreement[]>
  updateAgreement: (agreementId: string, agreementData: Partial<Agreement>) => Promise<Agreement>
  deleteAgreement: (agreementId: string) => Promise<void>
  
  // Firmantes
  updateSignerSignature: (agreementId: string, signerId: string, signatureData: string) => Promise<{ signedAt: string }>
  addSigner: (agreementId: string, signerData: Partial<Signer>) => Promise<Signer>
  removeSigner: (agreementId: string, signerId: string) => Promise<void>
}

export interface StorageClient {
  uploadFile: (bucket: string, path: string, file: File | Buffer, options?: any) => Promise<string>
  downloadFile: (bucket: string, path: string) => Promise<Blob>
  deleteFile: (bucket: string, path: string) => Promise<void>
  getPublicUrl: (bucket: string, path: string) => string
  getSignedUrl: (bucket: string, path: string, expiresIn?: number) => Promise<string>
}

// Tipos para operaciones específicas
export interface CreateAgreementData {
  title: string
  description?: string
  type: string
  signers: Omit<Signer, 'id' | 'status' | 'signedAt'>[]
  metadata: any
  expiresAt?: Date
}

export interface UpdateAgreementData {
  title?: string
  description?: string
  status?: string
  metadata?: any
  expiresAt?: Date
}

export interface SignAgreementData {
  signerId: string
  signatureData: string
  timestamp: Date
}

// Tipos para filtros y consultas
export interface AgreementFilters {
  status?: string
  type?: string
  createdBy?: string
  dateFrom?: Date
  dateTo?: Date
  search?: string
}

export interface PaginationOptions {
  page?: number
  limit?: number
  orderBy?: string
  orderDirection?: 'asc' | 'desc'
}

// Tipos para respuestas de API
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

// Tipos para eventos de autenticación
export interface AuthEvent {
  type: 'SIGNED_IN' | 'SIGNED_OUT' | 'TOKEN_REFRESHED' | 'USER_UPDATED'
  user: AuthUser | null
  session?: any
}

// Tipos para configuración de base de datos
export interface DatabaseConfig {
  url: string
  key: string
  serviceRoleKey?: string
  options?: any
}

// Tipos para migración
export interface MigrationResult {
  success: boolean
  migrated: number
  errors: string[]
  duration: number
}

// Tipos para estadísticas
export interface DatabaseStats {
  users: number
  agreements: number
  signedAgreements: number
  pendingAgreements: number
  storageUsed: number
  lastUpdated: Date
}
