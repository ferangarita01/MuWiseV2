// src/services/userService.ts
import { adminStorage } from '@/lib/firebase-server';

export class UserService {
  async uploadProfilePhoto(file: File, userId: string): Promise<{ downloadURL: string }> {
    const bucket = adminStorage.bucket();
    const filePath = `profile-photos/${userId}/${file.name}`;
    const fileUpload = bucket.file(filePath);

    const fileBuffer = Buffer.from(await file.arrayBuffer());

    await fileUpload.save(fileBuffer, {
      metadata: {
        contentType: file.type,
      },
    });
    
    await fileUpload.makePublic();
    const downloadURL = fileUpload.publicUrl();

    return { downloadURL };
  }
}
