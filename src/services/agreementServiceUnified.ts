// src/services/agreementServiceUnified.ts
import { createDatabaseClient } from '@/lib/database/factory';
import { StorageServiceUnified } from './storageServiceUnified';

export class AgreementServiceUnified {
  private dbClient: any;
  private storageService: StorageServiceUnified;

  constructor() {
    const client = createDatabaseClient();
    this.dbClient = client.db;
    this.storageService = new StorageServiceUnified();
  }

  async updateSignerSignature({
    agreementId,
    signerId,
    signatureDataUrl
  }: {
    agreementId: string;
    signerId: string;
    signatureDataUrl: string;
  }): Promise<{ signedAt: string }> {
    const agreementRef = this.dbClient.getCollection('agreements').doc(agreementId);
    const agreementDoc = await agreementRef.get();

    if (!agreementDoc) {
      throw new Error('Agreement not found.');
    }

    const agreementData = agreementDoc;
    const signers = agreementData?.signers || [];
    
    const signerIndex = signers.findIndex((s: any) => s.id === signerId);

    if (signerIndex === -1) {
      throw new Error('Signer not found in this agreement.');
    }

    const signedAt = new Date().toISOString();
    signers[signerIndex].signed = true;
    signers[signerIndex].signedAt = signedAt;
    signers[signerIndex].signature = signatureDataUrl;

    await agreementRef.update({ 
      signers,
      lastModified: new Date().toISOString(),
    });

    return { signedAt };
  }

  async updateStatus(agreementId: string, status: string, pdfBase64?: string): Promise<{ pdfUrl?: string }> {
    const agreementRef = this.dbClient.getCollection('agreements').doc(agreementId);
    
    let pdfUrl: string | undefined = undefined;

    if (status === 'Completado' && pdfBase64) {
      pdfUrl = await this.uploadPdf(pdfBase64, agreementId);
    }

    const updateData: any = {
      status: status,
      lastModified: new Date().toISOString(),
    };

    if (pdfUrl) {
      updateData.pdfUrl = pdfUrl;
    }

    await agreementRef.update(updateData);

    return { pdfUrl };
  }

  private async uploadPdf(pdfBase64: string, agreementId: string): Promise<string> {
    return this.storageService.uploadPdf(pdfBase64, agreementId);
  }

  async getAgreement(agreementId: string): Promise<any> {
    const agreementRef = this.dbClient.getCollection('agreements').doc(agreementId);
    const agreementDoc = await agreementRef.get();

    if (!agreementDoc) {
      throw new Error('Agreement not found.');
    }

    return {
      ...agreementDoc,
      id: agreementId,
    };
  }

  async deleteAgreement(agreementId: string): Promise<void> {
    const agreementRef = this.dbClient.getCollection('agreements').doc(agreementId);
    await agreementRef.delete();
  }

  async addSigner(agreementId: string, signerData: any): Promise<void> {
    const agreementRef = this.dbClient.getCollection('agreements').doc(agreementId);
    const agreementDoc = await agreementRef.get();

    if (!agreementDoc) {
      throw new Error('Agreement not found.');
    }

    const agreementData = agreementDoc;
    const signers = agreementData?.signers || [];
    const signerEmails = agreementData?.signerEmails || [];

    // Add new signer
    signers.push(signerData);
    
    // Update signer emails if not already present
    if (!signerEmails.includes(signerData.email)) {
      signerEmails.push(signerData.email);
    }

    await agreementRef.update({
      signers,
      signerEmails,
      lastModified: new Date().toISOString(),
    });
  }
}
