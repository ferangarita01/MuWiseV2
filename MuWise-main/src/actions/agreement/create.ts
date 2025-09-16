// src/actions/agreement/create.ts
'use server';

import { adminDb } from '@/lib/firebase-server';
import type { Contract, Signer, User } from '@/types/legacy';
import { revalidatePath } from 'next/cache';
import { ServiceContainer } from '@/services';
import crypto from 'crypto';

interface ActionResult {
  status: 'success' | 'error';
  message: string;
  data?: {
    agreementId: string;
  };
}

export async function createAgreementAction(
  agreementData: Omit<Contract, 'id' | 'createdAt' | 'userId' | 'signers' | 'signerEmails'>,
  creatorId: string
): Promise<ActionResult> {
  
  if (!creatorId) {
    return { status: 'error', message: 'User must be authenticated to create an agreement.' };
  }

  try {
    const usageService = ServiceContainer.getUsageService();
    console.log(`[Usage Check] Checking if user ${creatorId} can create a new agreement.`);
    const canCreate = await usageService.canUseAgreement(creatorId);

    if (!canCreate) {
      console.warn(`[Usage Denied] User ${creatorId} has reached their agreement limit.`);
      return { 
        status: 'error', 
        message: 'Has alcanzado el límite de acuerdos para tu plan. Por favor, considera mejorar tu suscripción.' 
      };
    }

    const userDoc = await adminDb.collection('users').doc(creatorId).get();
    if (!userDoc.exists) {
        return { status: 'error', message: 'Creator profile not found.' };
    }
    const creatorData = userDoc.data() as User;

    // Automatically create the first signer from the creator's profile
    const creatorSigner: Signer = {
      id: `signer-${Date.now()}-${crypto.randomBytes(4).toString('hex')}`,
      name: creatorData?.displayName || 'Creator',
      email: creatorData?.email || '',
      role: 'Creator', // Default role for the creator
      signed: false,
    };

    const initialSigners = [creatorSigner];
    const signerEmails = Array.from(new Set(initialSigners.map(s => s.email).filter(Boolean)));

    const newAgreement: Omit<Contract, 'id'> = {
      ...agreementData,
      userId: creatorId,
      signers: initialSigners,
      signerEmails: signerEmails,
      createdAt: new Date().toISOString(),
      lastModified: new Date().toISOString(),
      status: 'Borrador',
    };

    const docRef = await adminDb.collection('agreements').add(newAgreement);
    
    await usageService.incrementAgreementCount(creatorId);
    console.log(`[Usage Incremented] Agreement count for creator ${creatorId} has been incremented.`);

    revalidatePath('/dashboard/agreements');

    return {
      status: 'success',
      message: 'Agreement created successfully as a draft.',
      data: {
        agreementId: docRef.id,
      },
    };
  } catch (error: any) {
    console.error('Failed to create agreement:', error);
    return {
      status: 'error',
      message: `Failed to create agreement: ${error.message}`,
    };
  }
}
