// src/actions/agreement/update.ts
'use server';

import { ServiceContainer } from '@/services';
import { revalidatePath } from 'next/cache';
import { adminDb } from '@/lib/firebase-server';
import type { Contract } from '@/types/legacy';


interface ActionResult {
  status: 'success' | 'error';
  message: string;
  data?: any;
}

export async function updateAgreementAction(agreementId: string, agreementData: Partial<Omit<Contract, 'id'>>): Promise<ActionResult> {
  if (!agreementId) {
    return { status: 'error', message: 'Agreement ID is required.' };
  }

  try {
    const agreementRef = adminDb.collection('agreements').doc(agreementId);
    
    const dataToUpdate = {
      ...agreementData,
      lastModified: new Date().toISOString(),
    };
    
    await agreementRef.update(dataToUpdate);
    
    revalidatePath(`/dashboard/agreements/${agreementId}`);
    revalidatePath('/dashboard/agreements');

    return {
      status: 'success',
      message: 'Draft saved successfully.',
    };
  } catch (error: any) {
    console.error('Failed to update agreement draft:', error);
    return { status: 'error', message: `Failed to save draft: ${error.message}` };
  }
}

export async function updateAgreementStatusAction(
  agreementId: string, 
  status: string, 
  pdfBase64?: string
): Promise<ActionResult> {
  if (!agreementId || !status) {
    return { status: 'error', message: 'Missing agreement ID or status.' };
  }

  try {
    const agreementService = ServiceContainer.getAgreementService();
    
    const result = await agreementService.updateStatus(agreementId, status, pdfBase64);

    revalidatePath(`/dashboard/agreements/${agreementId}`);
    revalidatePath('/dashboard/agreements');

    return {
      status: 'success',
      message: 'Agreement status updated successfully.',
      data: result,
    };
  } catch (error: any) {
    console.error('Failed to update agreement status:', error);
    return { status: 'error', message: `Failed to update status: ${error.message}` };
  }
}
