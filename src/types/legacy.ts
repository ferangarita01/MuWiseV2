// ================================================
// TIPOS PRINCIPALES DE LA APLICACIÓN MUSICAL
// ================================================

// ===== SIGNER =====
// Represents a person who needs to sign a document.
export interface Signer {
  id: string;
  name: string;
  email: string;
  role: string;
  signed: boolean;
  signedAt?: string; // ISO date string
  signature?: string; // Data URL of the signature image
}


// ===== USUARIO =====
export interface User {
  uid: string;
  displayName: string;
  email: string;
  createdAt: string;
  photoURL?: string;
  
  // Campos profesionales de la industria musical
  artistName?: string;       // Nombre artístico
  primaryRole?: string;      // "Composer", "Producer", etc.
  genres?: string[] | string; // ["Pop", "Electronic", "Hip-Hop"] or "Pop, Electronic"
  publisher?: string;        // Editorial musical
  proSociety?: 'none' | 'ascap' | 'bmi' | 'sesac' | 'other';
  ipiNumber?: string;        // International Publishers Index
  phone?: string;
  locationCountry?: string;
  locationState?: string;
  locationCity?: string;
  experienceLevel?: 'beginner' | 'intermediate' | 'professional';
  bio?: string;
  website?: string;
  stripeCustomerId?: string;
  stripePriceId?: string;
  stripeSubscriptionId?: string;
  stripeSubscriptionStatus?: string;
  planId?: 'free' | 'creator' | 'pro'; // ID del plan del usuario
  agreementCount?: number; // Contador de acuerdos
};

// ===== AGREEMENT =====
export interface Agreement {
  id: string;
  name: string;
  status: string; // Example status
  songTitle: string;
  userId: string; // Add userId to the agreement
}

// ===== COMPOSER (in an agreement) =====
export interface Composer {
  id: string;
  name: string;
  email: string;
  role: string;
  share: number;
  publisher: string;
  ipiNumber: string;
  isRegisteredUser: boolean;
  documentId: string; // ID for ID document
  signature?: string; // Data URL of the signature image
  signedAt?: string; // ISO date string
}

// ===== AGREEMENT =====
export type AgreementStatus = 'draft' | 'pending' | 'signed' | 'archived';

export interface Agreement {
  id: string;
  songTitle: string;
  composers: Composer[];
  publicationDate: string; // ISO date string
  createdAt: string; // ISO date string
  lastModified: string; // ISO date string
  status: AgreementStatus;
  ownerId: string; // UID of the user who created it
  // Additional metadata
  isrc?: string;
  iswc?: string;
}


// ===== CONTRACT / TEMPLATE (for library view) =====
export type ContractStatus = "Gratis" | "Pro" | "Completado" | "Borrador" | "Pendiente";
export interface Contract {
    id: string;
    title: string;
    tags: string;
    category: string;
    type: "Plantilla" | "Contrato";
    status: ContractStatus;
    mins?: string;
    filetypes?: string;
    verified?: boolean;
    image: string;
    desc: string;
    shortDesc: string;
    content?: string; // <-- NUEVO CAMPO PARA EL CUERPO DEL ACUERDO
    userId?: string;
    signers?: Signer[];
    createdAt: string;
    lastModified?: string;
    pdfUrl?: string; // <-- AÑADIDO PARA GUARDAR LA URL DEL PDF
};

// ================================================
// TIPOS DE UTILIDAD
// ================================================

// ===== CREDENCIALES DE AUTENTICACIÓN =====
export type EmailPasswordCredentials = {
  email: string;
  password: string;
};

// ===== DETALLES DE REGISTRO =====
export type SignUpDetails = {
  fullName: string;
  email: string;
  password: string;
  artistName?: string;
  primaryRole?: string;
  genres?: string;
  publisher?: string;
  proSociety?: string;
  ipiNumber?: string;
};

// ===== ESTADO DE ACCIÓN =====
export type ActionState = {
  status: 'idle' | 'success' | 'error';
  message: string;
  data?: any;
};

// ================================================
// FUNCIONES DE VALIDACIÓN (OPCIONAL)
// ================================================

// ===== VALIDADORES =====
export const isValidUser = (data: any): data is User => {
  return typeof data === 'object' &&
         typeof data.uid === 'string' &&
         typeof data.displayName === 'string' &&
         typeof data.email === 'string' &&
         typeof data.createdAt === 'string';
};

export const isValidAgreement = (data: any): data is Agreement => {
    return typeof data === 'object' &&
           typeof data.id === 'string' &&
           typeof data.songTitle === 'string' &&
           Array.isArray(data.composers) &&
           data.composers.every(isValidComposer);
};

export const isValidComposer = (data: any): data is Composer => {
    return typeof data === 'object' &&
           typeof data.id === 'string' &&
           typeof data.name === 'string' &&
           typeof data.role === 'string' &&
           typeof data.share === 'number';
};
