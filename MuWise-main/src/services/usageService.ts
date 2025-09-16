// src/services/usageService.ts
import { adminDb } from '@/lib/firebase-server';
import type { User } from '@/types/legacy';
import { FieldValue } from 'firebase-admin/firestore';

const PLAN_LIMITS = {
  free: 15,
  creator: 200,
  pro: Infinity, // Pro plan has no limit for now
};

export class UsageService {
  /**
   * Checks if a user can create or be added to a new agreement based on their plan.
   * @param userId The ID of the user to check.
   * @returns A promise that resolves to true if the user can use an agreement, false otherwise.
   */
  async canUseAgreement(userId: string): Promise<boolean> {
    const userDocRef = adminDb.collection('users').doc(userId);
    const userDoc = await userDocRef.get();

    if (!userDoc.exists) {
      // If user doesn't have a profile, assume they are on the free plan.
      return true; 
    }

    const userData = userDoc.data() as User;
    const plan = userData.planId || 'free';
    const currentCount = userData.agreementCount || 0;
    const limit = PLAN_LIMITS[plan] || 0;

    return currentCount < limit;
  }

  /**
   * Increments the agreement count for a given user.
   * @param userId The ID of the user whose count should be incremented.
   * @returns A promise that resolves when the count is updated.
   */
  async incrementAgreementCount(userId: string): Promise<void> {
    const userDocRef = adminDb.collection('users').doc(userId);
    
    // Atomically increment the counter.
    // This is safer than reading the value and then writing it back.
    await userDocRef.update({
      agreementCount: FieldValue.increment(1)
    });
  }

  /**
   * Gets the current agreement count for a user.
   * @param userId The ID of the user.
   * @returns A promise that resolves to the user's current agreement count.
   */
  async getAgreementCount(userId: string): Promise<number> {
    const userDocRef = adminDb.collection('users').doc(userId);
    const userDoc = await userDocRef.get();

    if (!userDoc.exists) {
      return 0;
    }

    const userData = userDoc.data() as User;
    return userData.agreementCount || 0;
  }
}
