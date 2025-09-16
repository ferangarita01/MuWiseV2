// src/actions/agreement/addSigner.ts
'use server';

import { revalidatePath } from 'next/cache';
import { adminDb } from '@/lib/firebase-server';
import { EmailService } from '@/services/emailService';
import { UsageService } from '@/services/usageService';
import type { Signer, User } from '@/types/legacy';
import crypto from 'crypto';

interface SignerData {
  name: string;
  email: string;
  role: string;
}

interface ActionResult {
  status: 'success' | 'error' | 'warning';
  message: string;
}

export const addSignerAction = async ({
  agreementId,
  signerData,
  agreementTitle,
}: {
  agreementId: string;
  signerData: SignerData;
  agreementTitle: string;
}): Promise<ActionResult> => {

  console.log("Executing addSigner with data:", { agreementId, signerData, agreementTitle });

  try {
    const { name, email, role } = signerData;
    if (!name || !email || !role) {
      throw new Error('Invalid signer data provided.');
    }

    const usageService = new UsageService();
    const emailService = new EmailService();

    // Check if the invited user exists and if they have capacity
    const userQuery = await adminDb.collection('users').where('email', '==', email).limit(1).get();
    let invitedUserId: string | null = null;
    if (!userQuery.empty) {
      invitedUserId = userQuery.docs[0].id;
      console.log(`[Usage Check] Checking if invited user ${email} (ID: ${invitedUserId}) can be added.`);
      const canBeAdded = await usageService.canUseAgreement(invitedUserId);
      if (!canBeAdded) {
        console.warn(`[Usage Denied] Invited user ${email} has reached their agreement limit.`);
        return {
          status: 'error',
          message: `El usuario ${email} ha alcanzado el límite de acuerdos de su plan y no puede ser añadido.`,
        };
      }
    }
    
    const agreementRef = adminDb.collection('agreements').doc(agreementId);
    let newSignerId: string | undefined;

    await adminDb.runTransaction(async (transaction) => {
        const agreementDoc = await transaction.get(agreementRef);
        if (!agreementDoc.exists) {
            throw new Error("Agreement not found.");
        }

        const agreement = agreementDoc.data();
        const existingSigners: Signer[] = agreement?.signers || [];
        
        if (existingSigners.some(s => s.email === email)) {
            throw new Error(`Signer with email ${email} already exists.`);
        }
        
        const signerToAdd: Omit<Signer, 'signedAt' | 'signature'> = {
          id: `signer-${crypto.randomBytes(8).toString('hex')}`,
          name,
          email,
          role,
          signed: false,
        };
        newSignerId = signerToAdd.id;

        const updatedSigners = [...existingSigners, signerToAdd];
        const updatedSignerEmails = updatedSigners.map(s => s.email);

        transaction.update(agreementRef, {
            signers: updatedSigners,
            signerEmails: updatedSignerEmails,
            lastModified: new Date().toISOString(),
        });
    });

    // Increment count for the invited user if they exist
    if (invitedUserId) {
        await usageService.incrementAgreementCount(invitedUserId);
        console.log(`[Usage Incremented] Agreement count for invited user ${email} (ID: ${invitedUserId}) has been incremented.`);
    }

    console.log(`Signer ${email} added to agreement ${agreementId}.`);

    if (newSignerId) {
       await emailService.sendSignatureRequest({
        name,
        email,
        agreementId,
        signerId: newSignerId,
        agreementTitle,
      });
      console.log(`Email sent to ${email}.`);
    } else {
      console.error(`Could not find new signer ID for email ${email} to send notification.`);
    }

    revalidatePath(`/dashboard/agreements/${agreementId}`);

    return {
      status: 'success',
      message: `Firmante ${name} ha sido añadido y notificado.`,
    };

  } catch (error: any) {
    console.error("Error in addSignerAction:", error);
    if(error.message.includes('already exists')) {
        return {
            status: 'warning',
            message: error.message,
        };
    }
    return {
      status: 'error',
      message: error.message || 'No se pudo añadir al firmante. Inténtalo de nuevo.',
    };
  }
};
