// src/actions/user/profile.ts
'use server';

import { ServiceContainer } from '@/services';
import { adminDb } from "@/lib/firebase-server";
import { revalidatePath } from 'next/cache';
import type { UserProfile } from "@/types/user";

interface ActionResult {
  status: 'success' | 'error';
  message: string;
  data?: any;
}

export async function updateUserProfile(profileData: Partial<UserProfile>, userId: string) {
  if (!userId) {
    return { success: false, message: 'User not authenticated.' };
  }

  try {
    const userRef = adminDb.collection('users').doc(userId);
    await userRef.update(profileData);
    
    revalidatePath('/dashboard/account/profile');
    
    return { success: true, message: 'Perfil actualizado exitosamente.' };
  } catch (error) {
    console.error("Failed to update user profile:", error);
    return { success: false, message: 'Error al actualizar el perfil.' };
  }
}

export async function uploadProfilePhotoAction(formData: FormData): Promise<ActionResult> {
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
