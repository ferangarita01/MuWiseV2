// src/lib/signing-links.ts
import jwt from 'jsonwebtoken';

// Define a consistent structure for the token payload
export interface SigningTokenPayload {
  agreementId: string;
  signerId: string;
  email: string;
  purpose: 'user-signing' | 'guest-signing';
}

/**
 * Generates a secure JWT for a signing link.
 * @param payload - The data to include in the token.
 * @returns The generated JSON Web Token.
 */
export function generateSigningToken(payload: SigningTokenPayload): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    console.error("CRITICAL: JWT_SECRET is not defined.");
    throw new Error("Cannot generate signing links without a JWT secret.");
  }
  return jwt.sign(payload, secret, { expiresIn: '7d' });
}

/**
 * Verifies a signing token and returns its payload.
 * @param token - The JWT to verify.
 * @returns The decoded payload if the token is valid, otherwise null.
 */
export function verifySigningToken(token: string): SigningTokenPayload | null {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    console.error("CRITICAL: JWT_SECRET is not defined for verification.");
    return null;
  }
  try {
    // This will throw an error if the token is invalid or expired
    const decoded = jwt.verify(token, secret);
    return decoded as SigningTokenPayload;
  } catch (error) {
    console.error("Token verification failed:", error);
    return null;
  }
}
