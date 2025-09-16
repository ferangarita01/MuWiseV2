// src/app/api/auth/session/route.ts
import { adminAuth } from '@/lib/firebase-server';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { type FirebaseAuthError } from 'firebase-admin/auth';

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

    const sessionCookie = await adminAuth.createSessionCookie(idToken, { expiresIn });
    
    cookies().set('session', sessionCookie, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: expiresIn,
      path: '/',
    });

    return NextResponse.json({ status: 'success' });

  } catch (error) {
    const firebaseError = error as FirebaseAuthError;
    return NextResponse.json({ 
      status: 'error', 
      message: firebaseError.message || 'Failed to create session.', 
      errorCode: firebaseError.code || 'firebase-error'
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

    const decodedClaims = await adminAuth.verifySessionCookie(sessionCookie, true);

    return NextResponse.json({ 
      status: 'success', 
      user: {
        uid: decodedClaims.uid,
        email: decodedClaims.email,
        name: decodedClaims.name
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
