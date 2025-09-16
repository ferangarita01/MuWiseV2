// src/app/api/health/route.ts
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const health = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      provider: process.env.USE_SUPABASE === 'true' ? 'supabase' : 'firebase',
      version: process.env.npm_package_version || '1.0.0',
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      env: {
        hasFirebase: !!(process.env.NEXT_PUBLIC_FIREBASE_API_KEY),
        hasSupabase: !!(process.env.NEXT_PUBLIC_SUPABASE_URL),
        hasResend: !!(process.env.RESEND_API_KEY),
        hasStripe: !!(process.env.STRIPE_SECRET_KEY),
      }
    };

    return NextResponse.json(health);
  } catch (error: any) {
    return NextResponse.json({
      status: 'unhealthy',
      error: error.message,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
