// src/app/api/sign/[token]/route.ts
import { NextResponse } from 'next/server';
import { verifySigningToken } from '@/lib/signing-links';
import { adminDb } from '@/lib/firebase-server';
import type { Signer } from '@/types/legacy';

/**
 * GET: Verifies a signing token for guests.
 * This is a secure, server-only endpoint.
 */
export async function GET(
  req: Request,
  { params }: { params: { token: string } }
) {
  try {
    const token = decodeURIComponent(params.token);
    
    // Use the centralized verification function from signing-links
    const payload = verifySigningToken(token);

    if (!payload) {
      return NextResponse.json(
        { valid: false, error: 'Enlace no válido o ha expirado.' },
        { status: 401 }
      );
    }
    
    // Check if the signer has already signed
    const agreementRef = adminDb.collection('agreements').doc(payload.agreementId);
    const doc = await agreementRef.get();
    if (doc.exists) {
        const signers = doc.data()?.signers || [];
        const signer = signers.find((s: Signer) => s.id === payload.signerId);
        if (signer?.signed) {
            return NextResponse.json(
              { valid: false, error: 'Este enlace ya ha sido utilizado para firmar.' },
              { status: 409 } // 409 Conflict
            );
        }
    }
    
    // On success, return the payload
    return NextResponse.json({ valid: true, payload });

  } catch (err: any) {
    console.error(`[API /sign/verify] JWT verification failed: ${err.message}`);
    return NextResponse.json(
      { valid: false, error: 'El enlace de firma no es válido o ha expirado.' },
      { status: 400 }
    );
  }
}
