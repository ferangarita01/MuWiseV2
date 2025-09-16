// src/actions/agreement/sign.ts
'use server';

import { ServiceContainer } from '@/services';
import { revalidatePath } from 'next/cache';

interface ActionResult {
  status: 'success' | 'error';
  message: string;
  data?: any;
}

export async function updateSignerSignatureAction({ 
  agreementId, 
  signerId, 
  signatureDataUrl 
}: { 
  agreementId: string; 
  signerId: string; 
  signatureDataUrl: string; 
}): Promise<ActionResult> {
  if (!agreementId || !signerId || !signatureDataUrl) {
    return { status: 'error', message: 'Missing required fields for updating signature.' };
  }

  try {
    // Usar el servicio dedicado en lugar de lógica directa
    const signingService = ServiceContainer.getSigningService();
    const result = await signingService.updateSignerSignature({
      agreementId,
      signerId,
      signatureDataUrl
    });
    
    // Revalidar rutas para actualizar cache
    revalidatePath(`/dashboard/agreements/${agreementId}`);
    revalidatePath('/dashboard/agreements');

    return {
      status: result.status,
      message: result.message,
      data: result.data
    };
  } catch (error: any) {
    console.error('Failed to update signature:', error);
    return { status: 'error', message: `Failed to update signature: ${error.message}` };
  }
}