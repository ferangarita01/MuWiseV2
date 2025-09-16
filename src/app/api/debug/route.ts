
import { NextResponse } from 'next/server';

export async function GET() {
  // Check if running in a local development environment
  const isDevelopment = process.env.NODE_ENV === 'development' || 
                        process.env.FUNCTIONS_EMULATOR === 'true' ||
                        !process.env.K_SERVICE; // A common indicator for Cloud Run

  if (!isDevelopment) {
    return NextResponse.json({ error: 'Not available in production' }, { status: 404 });
  }

  return NextResponse.json({
    nodeEnv: process.env.NODE_ENV,
    isDevelopment: isDevelopment,
    hasFirebaseProjectId: !!process.env.FIREBASE_PROJECT_ID,
    hasFirebasePrivateKey: !!process.env.FIREBASE_PRIVATE_KEY,
    hasFirebaseClientEmail: !!process.env.FIREBASE_CLIENT_EMAIL,
    projectId: process.env.FIREBASE_PROJECT_ID || "Not Set",
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL || "Not Set",
    appHostingService: process.env.K_SERVICE || "Not in App Hosting",
  });
}
