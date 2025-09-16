// src/actions/agreement/get.ts
'use server';

import { adminDb, adminAuth } from '@/lib/firebase-server';
import { Timestamp } from 'firebase-admin/firestore';
import type { Contract } from '@/types/legacy';
import { cookies } from 'next/headers';

const serializeTimestamps = (data: any): any => {
    if (data === null || typeof data !== 'object') {
        return data;
    }
    if (data instanceof Timestamp) {
        return data.toDate().toISOString();
    }
    if (Array.isArray(data)) {
        return data.map(item => serializeTimestamps(item));
    }
    const serializedData: any = {};
    for (const key in data) {
        serializedData[key] = serializeTimestamps(data[key]);
    }
    return serializedData;
};

interface GetAgreementsResult {
    status: 'success' | 'error';
    message?: string;
    data?: Contract[];
}

export async function getAgreementsForUser(): Promise<GetAgreementsResult> {
    const sessionCookie = cookies().get('session')?.value;
    if (!sessionCookie) {
        console.log("getAgreementsForUser: No session cookie found. User is not authenticated.");
        return { status: 'error', message: 'User not authenticated.' };
    }

    try {
        const decodedClaims = await adminAuth.verifySessionCookie(sessionCookie, true);
        const { uid: userId, email: userEmail } = decodedClaims;

        if (!userId || !userEmail) {
            return { status: 'error', message: 'Authentication token is invalid.' };
        }
        
        // Query for agreements where the user is a signer
        const signedAgreementsQuery = adminDb.collection('agreements').where('signerEmails', 'array-contains', userEmail);
        
        // Query for agreements where the user is the creator
        const createdAgreementsQuery = adminDb.collection('agreements').where('userId', '==', userId);

        const [signedSnapshot, createdSnapshot] = await Promise.all([
            signedAgreementsQuery.get(),
            createdAgreementsQuery.get()
        ]);

        const agreementsMap = new Map<string, Contract>();

        const processSnapshot = (snapshot: FirebaseFirestore.QuerySnapshot) => {
            snapshot.docs.forEach(doc => {
                if (!agreementsMap.has(doc.id)) {
                    const rawData = doc.data();
                    const serializedData = serializeTimestamps(rawData);
                    agreementsMap.set(doc.id, {
                        ...serializedData,
                        id: doc.id,
                    } as Contract);
                }
            });
        };

        processSnapshot(signedSnapshot);
        processSnapshot(createdSnapshot);
        
        const allAgreements = Array.from(agreementsMap.values());
        
        console.log(`getAgreementsForUser: Found ${allAgreements.length} total agreements for user ${userId}.`);
        return { status: 'success', data: allAgreements };

    } catch (error: any) {
        console.error("getAgreementsForUser: Failed to fetch agreements.", error);
        
        if (error.code === 'auth/session-cookie-expired' || error.code === 'auth/invalid-session-cookie') {
             return { status: 'error', message: 'Your session has expired. Please sign in again.' };
        }
        
        return { status: 'error', message: 'Failed to retrieve agreements due to a server error.' };
    }
}
