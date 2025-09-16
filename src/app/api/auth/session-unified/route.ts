// src/app/api/auth/session-unified/route.ts
import { createDatabaseClient } from '@/lib/database/factory';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 days

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { idToken } = body;

    if (!idToken) {
      return NextResponse.json({ 
        status: 'error', 
        message: 'ID token is required.' 
      }, { status: 400 });
    }

    const dbClient = createDatabaseClient();
    
    // For unified auth, we'll create a simple session token
    // In production, you might want to implement proper JWT verification
    const sessionToken = Buffer.from(JSON.stringify({
      token: idToken,
      timestamp: Date.now(),
      expires: Date.now() + expiresIn
    })).toString('base64');
    
    cookies().set('session', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: expiresIn,
      path: '/',
    });

    return NextResponse.json({ status: 'success' });

  } catch (error: any) {
    return NextResponse.json({ 
      status: 'error', 
      message: error.message || 'Failed to create session.', 
      errorCode: 'auth-error'
    }, { status: 401 });
  }
}

export async function GET() {
  try {
    const sessionCookie = cookies().get('session')?.value;
    if (!sessionCookie) {
      return NextResponse.json({ 
        status: 'error', 
        message: 'No session found' 
      }, { status: 401 });
    }

    // For unified auth, we'll decode the session token
    // In production, you might want to implement proper JWT verification
    const sessionData = JSON.parse(Buffer.from(sessionCookie, 'base64').toString());
    
    if (sessionData.expires < Date.now()) {
      cookies().delete('session');
      return NextResponse.json({ 
        status: 'error', 
        message: 'Session expired' 
      }, { status: 401 });
    }

    return NextResponse.json({ 
      status: 'success', 
      user: {
        uid: sessionData.token,
        email: sessionData.token,
        name: sessionData.token
      }
    });

  } catch (error) {
    cookies().delete('session');
    return NextResponse.json({ 
      status: 'error', 
      message: 'Invalid or expired session' 
    }, { status: 401 });
  }
}

export async function DELETE() {
  try {
    cookies().delete('session');
    return NextResponse.json({ status: 'success' });
  } catch (error) {
    return NextResponse.json({ 
      status: 'error', 
      message: 'Failed to delete session' 
    }, { status: 500 });
  }
}
