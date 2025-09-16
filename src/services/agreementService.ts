// src/services/agreementService.ts
import { adminDb, adminStorage } from '@/lib/firebase-server';

export class AgreementService {
  async updateSignerSignature({
    agreementId,
    signerId,
    signatureDataUrl
  }: {
    agreementId: string;
    signerId: string;
    signatureDataUrl: string;
  }): Promise<{ signedAt: string }> {
    const agreementRef = adminDb.collection('agreements').doc(agreementId);
    const agreementDoc = await agreementRef.get();

    if (!agreementDoc.exists) {
      throw new Error('Agreement not found.');
    }

    const agreementData = agreementDoc.data();
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
    const agreementRef = adminDb.collection('agreements').doc(agreementId);
    
    let pdfUrl: string | undefined = undefined;

    if (status === 'Completado' && pdfBase64) {
      pdfUrl = await this.uploadPdf(pdfBase64, agreementId);
    }
    
    const updateData: { status: string; lastModified: string; pdfUrl?: string } = {
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
    const filePath = `agreements-pdf/${agreementId}-${Date.now()}.pdf`;
    const file = adminStorage.file(filePath);

    const base64Data = pdfBase64.split(';base64,').pop();

    if (!base64Data) {
      throw new Error('Invalid base64 string for PDF upload.');
    }
    
    const buffer = Buffer.from(base64Data, 'base64');

    await file.save(buffer, {
      metadata: { contentType: 'application/pdf' },
      public: true,
    });
    
    return file.publicUrl();
  }
}
