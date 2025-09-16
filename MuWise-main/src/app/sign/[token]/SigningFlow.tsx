// src/app/sign/[token]/SigningFlow.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useAuth } from '@/hooks/use-auth';
import GuestSignClient from './GuestSignClient';
import { verifySigningToken, type SigningTokenPayload } from '@/lib/signing-links';
import { useToast } from '@/hooks/use-toast';

interface SigningFlowProps {
  token: string;
}

export default function SigningFlow({ token }: SigningFlowProps) {
  const router = useRouter();
  const { toast } = useToast();
  const { user, loading: authLoading } = useAuth();
  
  const [status, setStatus] = useState<'loading' | 'validating' | 'ready' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [payload, setPayload] = useState<SigningTokenPayload | null>(null);

  useEffect(() => {
    if (authLoading) return;

    const validateToken = async () => {
        try {
            const res = await fetch(`/api/sign/${encodeURIComponent(token)}`);
            const json = await res.json();

            if (!res.ok || !json.valid) {
              throw new Error(json.error || 'Enlace no válido o ha expirado.');
            }
            return json.payload as SigningTokenPayload;

        } catch (err: any) {
            toast({
                variant: 'destructive',
                title: 'Error de Validación',
                description: err.message || 'El enlace de firma no es válido o ha expirado.',
            });
            setStatus('error');
            setErrorMessage(err.message || 'El enlace de firma no es válido o ha expirado.');
            return null;
        }
    }

    const processSigningFlow = async () => {
        const verifiedPayload = await validateToken();
        if (!verifiedPayload) {
            // Error status is already set by validateToken
            return;
        }
        
        if (!user) {
            // User is not logged in, store token and redirect to sign-in
            localStorage.setItem('pendingSignToken', token);
            router.push(`/auth/signin?reason=guest_sign`);
            return;
        }

        // User is logged in, verify email match
        if (verifiedPayload.email.toLowerCase() !== user.email?.toLowerCase()) {
            const errorMsg = `Este enlace es para ${verifiedPayload.email}, pero has iniciado sesión como ${user.email}. Por favor, inicia sesión con la cuenta correcta.`;
            setErrorMessage(errorMsg);
            setStatus('error');
            toast({ variant: 'destructive', title: 'Cuenta Incorrecta', description: errorMsg });
            return;
        }
        
        // Everything is correct, prepare the signing UI
        setPayload(verifiedPayload);
        setStatus('ready');
    };

    processSigningFlow();

  }, [token, user, authLoading, router, toast]);

  if (status === 'loading' || status === 'validating') {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-4">
        <Loader2 className="h-10 w-10 animate-spin text-indigo-400 mb-4" />
        <p className="text-lg">
          {status === 'loading' ? 'Verificando sesión...' : 'Validando enlace de firma...'}
        </p>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-4 text-center">
        <div className="w-full max-w-md rounded-lg border border-red-500/30 bg-red-900/20 p-8 shadow-2xl">
          <AlertTriangle className="h-12 w-12 text-red-400 mb-4 mx-auto" />
          <h2 className="text-xl font-bold text-red-300 mb-2">Error de Enlace</h2>
          <p className="text-slate-300">{errorMessage}</p>
          <Button asChild className="mt-6">
            <Link href="/">Volver a la página principal</Link>
          </Button>
        </div>
      </div>
    );
  }

  if (status === "ready" && payload) {
    return (
        <GuestSignClient
          token={token}
          agreementId={payload.agreementId}
          signerId={payload.signerId}
          email={payload.email}
      />
    );
  }

  return null;
}
