// src/lib/migration/migrationTools.ts
import { createDatabaseClient } from '@/lib/database/factory';
import { adminDb, adminStorage } from '@/lib/firebase-server';
import { supabase } from '@/lib/supabase-client';

export interface MigrationStats {
  users: number;
  agreements: number;
  files: number;
  errors: string[];
  duration: number;
}

export class MigrationTools {
  private sourceDb: any;
  private targetDb: any;
  private sourceStorage: any;
  private targetStorage: any;

  constructor() {
    // Source: Firebase (always)
    this.sourceDb = adminDb;
    this.sourceStorage = adminStorage;

    // Target: Supabase (when migrating)
    this.targetDb = supabase;
    this.targetStorage = supabase.storage;
  }

  async migrateUsers(): Promise<{ migrated: number; errors: string[] }> {
    const errors: string[] = [];
    let migrated = 0;

    try {
      console.log('🔄 Starting user migration...');
      
      const usersSnapshot = await this.sourceDb.collection('users').get();
      
      for (const doc of usersSnapshot.docs) {
        try {
          const userData = doc.data();
          
          // Transform Firebase user data to Supabase format
          const transformedUser = {
            id: doc.id,
            email: userData.email,
            name: userData.displayName || userData.name,
            profile_picture: userData.photoURL,
            phone: userData.phoneNumber,
            company: userData.company,
            role: userData.role || 'user',
            is_email_verified: userData.emailVerified || false,
            last_login: userData.lastLoginAt ? new Date(userData.lastLoginAt).toISOString() : null,
            preferences: userData.preferences || {},
            stripe_customer_id: userData.stripeCustomerId,
            stripe_price_id: userData.stripePriceId,
            stripe_subscription_id: userData.stripeSubscriptionId,
            stripe_subscription_status: userData.stripeSubscriptionStatus,
            created_at: userData.createdAt ? new Date(userData.createdAt).toISOString() : new Date().toISOString(),
            updated_at: new Date().toISOString()
          };

          // Insert into Supabase
          const { error } = await this.targetDb
            .from('users')
            .upsert(transformedUser);

          if (error) {
            errors.push(`User ${doc.id}: ${error.message}`);
          } else {
            migrated++;
            console.log(`✅ Migrated user: ${userData.email}`);
          }
        } catch (error: any) {
          errors.push(`User ${doc.id}: ${error.message}`);
        }
      }

      console.log(`✅ User migration completed: ${migrated} users migrated`);
      return { migrated, errors };
    } catch (error: any) {
      errors.push(`User migration failed: ${error.message}`);
      return { migrated, errors };
    }
  }

  async migrateAgreements(): Promise<{ migrated: number; errors: string[] }> {
    const errors: string[] = [];
    let migrated = 0;

    try {
      console.log('🔄 Starting agreement migration...');
      
      const agreementsSnapshot = await this.sourceDb.collection('agreements').get();
      
      for (const doc of agreementsSnapshot.docs) {
        try {
          const agreementData = doc.data();
          
          // Transform Firebase agreement data to Supabase format
          const transformedAgreement = {
            id: doc.id,
            title: agreementData.title,
            song_title: agreementData.songTitle,
            description: agreementData.description,
            publication_date: agreementData.publicationDate ? new Date(agreementData.publicationDate).toISOString() : null,
            last_modified: agreementData.lastModified ? new Date(agreementData.lastModified).toISOString() : new Date().toISOString(),
            composers: agreementData.composers || [],
            status: agreementData.status || 'Borrador',
            type: agreementData.type || 'Agreement',
            created_by: agreementData.userId,
            signers: agreementData.signers || [],
            document_url: agreementData.documentUrl,
            metadata: agreementData.metadata || {},
            expires_at: agreementData.expiresAt ? new Date(agreementData.expiresAt).toISOString() : null,
            signed_at: agreementData.signedAt ? new Date(agreementData.signedAt).toISOString() : null,
            completed_at: agreementData.completedAt ? new Date(agreementData.completedAt).toISOString() : null,
            pdf_url: agreementData.pdfUrl,
            created_at: agreementData.createdAt ? new Date(agreementData.createdAt).toISOString() : new Date().toISOString(),
            updated_at: new Date().toISOString()
          };

          // Insert into Supabase
          const { error } = await this.targetDb
            .from('agreements')
            .upsert(transformedAgreement);

          if (error) {
            errors.push(`Agreement ${doc.id}: ${error.message}`);
          } else {
            migrated++;
            console.log(`✅ Migrated agreement: ${agreementData.title}`);
          }
        } catch (error: any) {
          errors.push(`Agreement ${doc.id}: ${error.message}`);
        }
      }

      console.log(`✅ Agreement migration completed: ${migrated} agreements migrated`);
      return { migrated, errors };
    } catch (error: any) {
      errors.push(`Agreement migration failed: ${error.message}`);
      return { migrated, errors };
    }
  }

  async migrateFiles(): Promise<{ migrated: number; errors: string[] }> {
    const errors: string[] = [];
    let migrated = 0;

    try {
      console.log('🔄 Starting file migration...');
      
      // This is a simplified version - in production you'd want to list all files
      // and migrate them one by one
      console.log('⚠️ File migration requires manual implementation based on your specific file structure');
      
      return { migrated, errors };
    } catch (error: any) {
      errors.push(`File migration failed: ${error.message}`);
      return { migrated, errors };
    }
  }

  async runFullMigration(): Promise<MigrationStats> {
    const startTime = Date.now();
    const errors: string[] = [];

    console.log('🚀 Starting full migration from Firebase to Supabase...');

    try {
      // Migrate users
      const userResult = await this.migrateUsers();
      errors.push(...userResult.errors);

      // Migrate agreements
      const agreementResult = await this.migrateAgreements();
      errors.push(...agreementResult.errors);

      // Migrate files
      const fileResult = await this.migrateFiles();
      errors.push(...fileResult.errors);

      const duration = Date.now() - startTime;

      const stats: MigrationStats = {
        users: userResult.migrated,
        agreements: agreementResult.migrated,
        files: fileResult.migrated,
        errors,
        duration
      };

      console.log('✅ Migration completed!');
      console.log(`📊 Stats:`, stats);

      return stats;
    } catch (error: any) {
      const duration = Date.now() - startTime;
      errors.push(`Full migration failed: ${error.message}`);

      return {
        users: 0,
        agreements: 0,
        files: 0,
        errors,
        duration
      };
    }
  }

  async validateMigration(): Promise<{ valid: boolean; issues: string[] }> {
    const issues: string[] = [];

    try {
      // Compare user counts
      const firebaseUsers = await this.sourceDb.collection('users').get();
      const { data: supabaseUsers } = await this.targetDb.from('users').select('id');

      if (firebaseUsers.size !== supabaseUsers?.length) {
        issues.push(`User count mismatch: Firebase ${firebaseUsers.size}, Supabase ${supabaseUsers?.length}`);
      }

      // Compare agreement counts
      const firebaseAgreements = await this.sourceDb.collection('agreements').get();
      const { data: supabaseAgreements } = await this.targetDb.from('agreements').select('id');

      if (firebaseAgreements.size !== supabaseAgreements?.length) {
        issues.push(`Agreement count mismatch: Firebase ${firebaseAgreements.size}, Supabase ${supabaseAgreements?.length}`);
      }

      return {
        valid: issues.length === 0,
        issues
      };
    } catch (error: any) {
      issues.push(`Validation failed: ${error.message}`);
      return { valid: false, issues };
    }
  }
}
