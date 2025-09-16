// src/services/storageServiceUnified.ts
import { createDatabaseClient } from '@/lib/database/factory';

export class StorageServiceUnified {
  private storageClient: any;

  constructor() {
    const client = createDatabaseClient();
    this.storageClient = client.storage;
  }

  async uploadPdf(pdfBase64: string, agreementId: string): Promise<string> {
    const filePath = `agreements-pdf/${agreementId}-${Date.now()}.pdf`;
    const base64Data = pdfBase64.split(';base64,').pop();

    if (!base64Data) {
      throw new Error('Invalid base64 string for PDF upload.');
    }

    const buffer = Buffer.from(base64Data, 'base64');
    return this.storageClient.uploadFile('agreements', filePath, buffer, {
      contentType: 'application/pdf',
      public: true
    });
  }

  async uploadProfilePhoto(file: File, userId: string): Promise<{ downloadURL: string }> {
    const filePath = `profile-photos/${userId}/${file.name}`;
    const fileBuffer = Buffer.from(await file.arrayBuffer());

    const downloadURL = await this.storageClient.uploadFile('profile-photos', filePath, fileBuffer, {
      contentType: file.type,
      public: true
    });

    return { downloadURL };
  }

  async uploadDocument(file: File, folder: string, fileName?: string): Promise<{ downloadURL: string }> {
    const filePath = fileName || `${folder}/${Date.now()}-${file.name}`;
    const fileBuffer = Buffer.from(await file.arrayBuffer());

    const downloadURL = await this.storageClient.uploadFile(folder, filePath, fileBuffer, {
      contentType: file.type,
      public: true
    });

    return { downloadURL };
  }

  async deleteFile(bucket: string, filePath: string): Promise<void> {
    await this.storageClient.deleteFile(bucket, filePath);
  }

  async getPublicUrl(bucket: string, filePath: string): Promise<string> {
    return this.storageClient.getPublicUrl(bucket, filePath);
  }

  async getSignedUrl(bucket: string, filePath: string, expiresIn: number = 3600): Promise<string> {
    return this.storageClient.getSignedUrl(bucket, filePath, expiresIn);
  }

  async downloadFile(bucket: string, filePath: string): Promise<Blob> {
    return this.storageClient.downloadFile(bucket, filePath);
  }
}
