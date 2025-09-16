// src/services/unifiedAgreementService.ts
import { createDatabaseClient } from '@/lib/database/factory';
import { Agreement, Signer, CreateAgreementData, UpdateAgreementData } from '@/lib/database/types';

export class UnifiedAgreementService {
  private db = createDatabaseClient();

  /**
   * Crea un nuevo acuerdo
   */
  async createAgreement(agreementData: CreateAgreementData, creatorId: string): Promise<Agreement> {
    const newAgreement: Partial<Agreement> = {
      ...agreementData,
      createdBy: creatorId,
      status: 'draft',
      createdAt: new Date(),
      updatedAt: new Date(),
      lastModified: new Date()
    };

    return await this.db.db.createAgreement(newAgreement);
  }

  /**
   * Obtiene un acuerdo por ID
   */
  async getAgreement(agreementId: string): Promise<Agreement | null> {
    return await this.db.db.getAgreement(agreementId);
  }

  /**
   * Obtiene todos los acuerdos de un usuario
   */
  async getUserAgreements(userId: string, filters?: any): Promise<Agreement[]> {
    return await this.db.db.getAgreements(userId, filters);
  }

  /**
   * Actualiza un acuerdo
   */
  async updateAgreement(agreementId: string, agreementData: UpdateAgreementData): Promise<Agreement> {
    return await this.db.db.updateAgreement(agreementId, agreementData);
  }

  /**
   * Elimina un acuerdo
   */
  async deleteAgreement(agreementId: string): Promise<void> {
    return await this.db.db.deleteAgreement(agreementId);
  }

  /**
   * Actualiza la firma de un firmante
   */
  async updateSignerSignature(
    agreementId: string, 
    signerId: string, 
    signatureData: string
  ): Promise<{ signedAt: string }> {
    return await this.db.db.updateSignerSignature(agreementId, signerId, signatureData);
  }

  /**
   * Añade un firmante a un acuerdo
   */
  async addSigner(agreementId: string, signerData: Partial<Signer>): Promise<Signer> {
    return await this.db.db.addSigner(agreementId, signerData);
  }

  /**
   * Elimina un firmante de un acuerdo
   */
  async removeSigner(agreementId: string, signerId: string): Promise<void> {
    return await this.db.db.removeSigner(agreementId, signerId);
  }

  /**
   * Actualiza el estado de un acuerdo y opcionalmente sube un PDF
   */
  async updateAgreementStatus(
    agreementId: string, 
    status: string, 
    pdfBase64?: string
  ): Promise<{ pdfUrl?: string }> {
    let pdfUrl: string | undefined = undefined;

    if (status === 'completed' && pdfBase64) {
      pdfUrl = await this.uploadPdf(pdfBase64, agreementId);
    }

    const updateData: Partial<Agreement> = {
      status,
      updatedAt: new Date(),
      lastModified: new Date()
    };

    if (pdfUrl) {
      updateData.pdfUrl = pdfUrl;
    }

    await this.db.db.updateAgreement(agreementId, updateData);
    return { pdfUrl };
  }

  /**
   * Sube un PDF a storage
   */
  private async uploadPdf(pdfBase64: string, agreementId: string): Promise<string> {
    const fileName = `${agreementId}-${Date.now()}.pdf`;
    const base64Data = pdfBase64.split(';base64,').pop();

    if (!base64Data) {
      throw new Error('Invalid base64 string for PDF upload.');
    }

    const buffer = Buffer.from(base64Data, 'base64');
    return await this.db.storage.uploadFile('agreements-pdf', fileName, buffer, {
      contentType: 'application/pdf'
    });
  }

  /**
   * Obtiene estadísticas de acuerdos para un usuario
   */
  async getAgreementStats(userId: string): Promise<{
    total: number;
    draft: number;
    pending: number;
    signed: number;
    completed: number;
  }> {
    const agreements = await this.db.db.getAgreements(userId);
    
    return {
      total: agreements.length,
      draft: agreements.filter(a => a.status === 'draft').length,
      pending: agreements.filter(a => a.status === 'pending').length,
      signed: agreements.filter(a => a.status === 'signed').length,
      completed: agreements.filter(a => a.status === 'completed').length
    };
  }

  /**
   * Busca acuerdos por término de búsqueda
   */
  async searchAgreements(userId: string, searchTerm: string): Promise<Agreement[]> {
    const agreements = await this.db.db.getAgreements(userId, {
      search: searchTerm
    });
    
    return agreements;
  }

  /**
   * Obtiene acuerdos por estado
   */
  async getAgreementsByStatus(userId: string, status: string): Promise<Agreement[]> {
    return await this.db.db.getAgreements(userId, { status });
  }

  /**
   * Obtiene acuerdos por tipo
   */
  async getAgreementsByType(userId: string, type: string): Promise<Agreement[]> {
    return await this.db.db.getAgreements(userId, { type });
  }

  /**
   * Obtiene acuerdos por rango de fechas
   */
  async getAgreementsByDateRange(
    userId: string, 
    dateFrom: Date, 
    dateTo: Date
  ): Promise<Agreement[]> {
    return await this.db.db.getAgreements(userId, {
      dateFrom,
      dateTo
    });
  }

  /**
   * Duplica un acuerdo existente
   */
  async duplicateAgreement(agreementId: string, newTitle: string, creatorId: string): Promise<Agreement> {
    const originalAgreement = await this.getAgreement(agreementId);
    
    if (!originalAgreement) {
      throw new Error('Agreement not found');
    }

    const duplicatedData: CreateAgreementData = {
      title: newTitle,
      description: originalAgreement.description,
      type: originalAgreement.type,
      signers: originalAgreement.signers.map(signer => ({
        ...signer,
        id: `signer-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        status: 'pending',
        signedAt: undefined,
        signatureData: undefined
      })),
      metadata: originalAgreement.metadata,
      expiresAt: originalAgreement.expiresAt
    };

    return await this.createAgreement(duplicatedData, creatorId);
  }

  /**
   * Exporta un acuerdo como JSON
   */
  async exportAgreement(agreementId: string): Promise<string> {
    const agreement = await this.getAgreement(agreementId);
    
    if (!agreement) {
      throw new Error('Agreement not found');
    }

    return JSON.stringify(agreement, null, 2);
  }

  /**
   * Importa un acuerdo desde JSON
   */
  async importAgreement(jsonData: string, creatorId: string): Promise<Agreement> {
    try {
      const agreementData = JSON.parse(jsonData);
      
      const importedData: CreateAgreementData = {
        title: agreementData.title,
        description: agreementData.description,
        type: agreementData.type,
        signers: agreementData.signers || [],
        metadata: agreementData.metadata || {},
        expiresAt: agreementData.expiresAt ? new Date(agreementData.expiresAt) : undefined
      };

      return await this.createAgreement(importedData, creatorId);
    } catch (error) {
      throw new Error('Invalid JSON data for agreement import');
    }
  }
}

// Instancia singleton del servicio
export const unifiedAgreementService = new UnifiedAgreementService();
