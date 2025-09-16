// src/services/signingService.ts
import { adminDb } from '@/lib/firebase-server';
import type { Signer } from '@/types/legacy';

export interface UpdateSignatureParams {
  agreementId: string;
  signerId: string;
  signatureDataUrl: string;
}

export interface UpdateSignatureResult {
  status: 'success' | 'error';
  message: string;
  data?: {
    signedAt: string;
  };
}

export class SigningService {
  /**
   * Actualiza la firma de un firmante específico en un acuerdo
   */
  async updateSignerSignature({
    agreementId,
    signerId,
    signatureDataUrl
  }: UpdateSignatureParams): Promise<UpdateSignatureResult> {
    if (!agreementId || !signerId || !signatureDataUrl) {
      return { 
        status: 'error', 
        message: 'Missing required fields for updating signature.' 
      };
    }

    try {
      const agreementRef = adminDb.collection('agreements').doc(agreementId);
      const agreementDoc = await agreementRef.get();

      if (!agreementDoc.exists) {
        return { 
          status: 'error', 
          message: 'Agreement not found.' 
        };
      }

      const agreementData = agreementDoc.data();
      const signers = agreementData?.signers || [];
      
      const signerIndex = signers.findIndex((s: Signer) => s.id === signerId);

      if (signerIndex === -1) {
        return { 
          status: 'error', 
          message: 'Signer not found in this agreement.' 
        };
      }

      // Actualizar datos del firmante
      const signedAt = new Date().toISOString();
      signers[signerIndex].signed = true;
      signers[signerIndex].signedAt = signedAt;
      signers[signerIndex].signature = signatureDataUrl;

      // Guardar en Firestore
      await agreementRef.update({ 
        signers,
        lastModified: new Date().toISOString(),
      });

      return {
        status: 'success',
        message: 'Signature updated successfully.',
        data: { signedAt }
      };

    } catch (error: any) {
      console.error('SigningService: Failed to update signature:', error);
      return { 
        status: 'error', 
        message: `Failed to update signature: ${error.message}` 
      };
    }
  }

  /**
   * Verifica si un firmante ya ha firmado un acuerdo
   */
  async isSignerAlreadySigned(agreementId: string, signerId: string): Promise<boolean> {
    try {
      const agreementRef = adminDb.collection('agreements').doc(agreementId);
      const agreementDoc = await agreementRef.get();

      if (!agreementDoc.exists) {
        return false;
      }

      const agreementData = agreementDoc.data();
      const signers = agreementData?.signers || [];
      
      const signer = signers.find((s: Signer) => s.id === signerId);
      return signer?.signed === true;

    } catch (error) {
      console.error('SigningService: Failed to check signer status:', error);
      return false;
    }
  }

  /**
   * Obtiene información de un firmante específico
   */
  async getSignerInfo(agreementId: string, signerId: string): Promise<Signer | null> {
    try {
      const agreementRef = adminDb.collection('agreements').doc(agreementId);
      const agreementDoc = await agreementRef.get();

      if (!agreementDoc.exists) {
        return null;
      }

      const agreementData = agreementDoc.data();
      const signers = agreementData?.signers || [];
      
      return signers.find((s: Signer) => s.id === signerId) || null;

    } catch (error) {
      console.error('SigningService: Failed to get signer info:', error);
      return null;
    }
  }
}

// Instancia singleton
export const signingService = new SigningService();