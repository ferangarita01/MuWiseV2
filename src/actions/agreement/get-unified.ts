// src/actions/agreement/get-unified.ts
'use server';

import { createDatabaseClient } from '@/lib/database/factory';
import type { Contract } from '@/types/legacy';
import { cookies } from 'next/headers';

interface GetAgreementsResult {
    status: 'success' | 'error';
    message?: string;
    data?: Contract[];
}

export async function getAgreementsForUserUnified(): Promise<GetAgreementsResult> {
    const sessionCookie = cookies().get('session')?.value;
    if (!sessionCookie) {
        console.log("getAgreementsForUser: No session cookie found. User is not authenticated.");
        return { status: 'error', message: 'User not authenticated.' };
    }

    try {
        const dbClient = createDatabaseClient();
        
        // For unified auth, we need to get user info from the session
        // This is a simplified approach - in production you might want to verify the session differently
        const userId = sessionCookie; // This is simplified - you might need to decode the session
        
        if (!userId) {
            return { status: 'error', message: 'Authentication token is invalid.' };
        }
        
        // Get agreements using unified database client
        const allAgreements = await dbClient.db.getAgreements(userId);

        // Convert to Contract format if needed
        const contracts = allAgreements.map(agreement => ({
            ...agreement,
            id: agreement.id,
        } as Contract));
        
        console.log(`getAgreementsForUser: Found ${contracts.length} total agreements for user ${userId}.`);
        return { status: 'success', data: contracts };

    } catch (error: any) {
        console.error("getAgreementsForUser: Failed to fetch agreements.", error);
        
        if (error.code === 'auth/session-cookie-expired' || error.code === 'auth/invalid-session-cookie') {
             return { status: 'error', message: 'Your session has expired. Please sign in again.' };
        }
        
        return { status: 'error', message: 'Failed to retrieve agreements due to a server error.' };
    }
}
