import { BaseEntity, Status } from './common';
import { User } from './user'; // Assuming User might be needed elsewhere in Agreement context
import { Timestamp } from 'firebase-admin/firestore'; // Import Timestamp
import type { Composer } from './legacy'; // Import Composer from legacy.ts
export type { Composer }; // Export Composer
export interface Agreement extends BaseEntity {
  // BaseEntity already provides id, createdAt, updatedAt
  title: string;
  songTitle: string; // Based on your Firestore data
  description?: string;
  publicationDate?: Timestamp; // Assuming this is stored as Timestamp
  lastModified?: Timestamp; // Add lastModified field
  composers: Composer[]; // Add composers field
  status: AgreementStatus;
  type: AgreementType;
  createdBy: string;
  signers: Signer[];
  documentUrl?: string;
  metadata: AgreementMetadata;
  expiresAt?: Date;
  signedAt?: Timestamp; // Assuming this might be stored as Timestamp
  completedAt?: Timestamp; // Assuming this might be stored as Timestamp
}

export type AgreementStatus = 
  | 'draft' 
  | 'pending' 
  | 'in_progress' 
  | 'signed' 
  | 'completed' 
  | 'expired' 
  | 'cancelled';

export type AgreementType = 
  | 'dj_service' 
  | 'venue_rental' 
  | 'equipment_rental' 
  | 'service_contract' 
  | 'custom';

export interface Signer {
  id: string;
  userId?: string;
  email: string;
  name: string;
  role: SignerRole;
  status: SignerStatus;
  signedAt?: Timestamp; // Assuming this might be stored as Timestamp
  signatureData?: string;
  order: number;
}

export type SignerRole = 'client' | 'contractor' | 'witness' | 'approver';
export type SignerStatus = 'pending' | 'signed' | 'declined';

export interface AgreementMetadata {
  totalAmount?: number;
  currency?: string;
  eventDate?: Timestamp; // Assuming this might be stored as Timestamp
  location?: string;
  duration?: number;
  equipment?: string[];
  specialRequirements?: string;
  paymentTerms?: PaymentTerms;
}
export interface PaymentTerms {
  // Assuming PaymentTerms might contain date fields stored as Timestamps
  amount: number;
  currency: string;
  dueDate?: Date;
  installments?: PaymentInstallment[];
  method?: 'cash' | 'card' | 'transfer' | 'check';
}

export interface PaymentInstallment {
  amount: number;
  dueDate: Timestamp; // Assuming this might be stored as Timestamp
  description?: string;
  paid: boolean;
}

export interface CreateAgreementData {
  title: string;
  description?: string;
  type: AgreementType;
  signers: Omit<Signer, 'id' | 'status' | 'signedAt'>[];
  metadata: AgreementMetadata;
  expiresAt?: Timestamp; // Assuming consistency with Agreement interface
}

export interface UpdateAgreementData {
  title?: string;
  description?: string;
  status?: AgreementStatus;
  metadata?: Partial<AgreementMetadata>;
  expiresAt?: Timestamp; // Assuming consistency with Agreement interface
}

export interface SignAgreementData {
  signerId: string;
  signatureData: string;
  timestamp: Timestamp; // Assuming consistency with other date fields
}