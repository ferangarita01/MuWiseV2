// src/actions/user/profile-unified.ts
'use server';

import { ServiceContainer } from '@/services';
import { createDatabaseClient } from '@/lib/database/factory';
import { revalidatePath } from 'next/cache';
import type { UserProfile } from "@/types/user";

interface ActionResult {
  status: 'success' | 'error';
  message: string;
  data?: any;
}

export async function updateUserProfileUnified(profileData: Partial<UserProfile>, userId: string) {
  if (!userId) {
    return { success: false, message: 'User not authenticated.' };
  }

  try {
    const dbClient = createDatabaseClient();
    await dbClient.db.updateUser(userId, profileData);
    
    revalidatePath('/dashboard/account/profile');
    
    return { success: true, message: 'Perfil actualizado exitosamente.' };
  } catch (error) {
    console.error("Failed to update user profile:", error);
    return { success: false, message: 'Error al actualizar el perfil.' };
  }
}

export async function uploadProfilePhotoActionUnified(formData: FormData): Promise<ActionResult> {
  const file = formData.get('profilePhoto') as File;
  const userId = formData.get('userId') as string;

  if (!file || !userId) {
    return { status: 'error', message: 'No file or user ID provided.' };
  }

  try {
    const userService = ServiceContainer.getUserService();
    const result = await userService.uploadProfilePhoto(file, userId);

    revalidatePath('/dashboard/profile');

    return { 
      status: 'success', 
      message: 'Photo uploaded successfully.',
      data: result 
    };
  } catch (error: any) {
    console.error('Upload failed:', error);
    return { status: 'error', message: `Upload failed: ${error.message}` };
  }
}

export async function getUserProfileUnified(userId: string): Promise<ActionResult> {
  if (!userId) {
    return { status: 'error', message: 'User not authenticated.' };
  }

  try {
    const dbClient = createDatabaseClient();
    const userDoc = await dbClient.db.getUser(userId);

    if (!userDoc) {
      return { status: 'error', message: 'User profile not found.' };
    }

    return { 
      status: 'success', 
      message: 'Profile retrieved successfully.',
      data: userDoc 
    };
  } catch (error: any) {
    console.error('Failed to get user profile:', error);
    return { status: 'error', message: 'Failed to retrieve profile.' };
  }
}
