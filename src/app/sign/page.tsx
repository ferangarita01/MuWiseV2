// src/app/sign/page.tsx
"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, AlertTriangle, ArrowLeft } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import GuestSignClient from "./[token]/GuestSignClient";
import { Button } from "@/components/ui/button";

function SignPageComponent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const { user, loading: authLoading } = useAuth();
  
  const [status, setStatus] = useState<"loading" | "validating" | "ready" | "error">("loading");
  const [error, setError] = useState<string | null>(null);
  const [payload, setPayload] = useState<any>(null);

  useEffect(() => {
    if (authLoading) {
      setStatus("loading");
      return;
    }

    if (!user) {
      // This should ideally not happen if the login flow works correctly,
      // but it's a good safeguard.
      if (token) {
        localStorage.setItem("pendingSignToken", token);
      }
      router.push("/auth/signin");
      return;
    }
    
    if (!token) {
      setError("No se ha proporcionado un token de firma.");
      setStatus("error");
      return;
    }
    
    setStatus("validating");

    const verify = async () => {
      try {
        const res = await fetch(`/api/sign/${encodeURIComponent(token)}`);
        const json = await res.json();

        if (!res.ok || !json.valid) {
          throw new Error(json.error || "El enlace no es válido o ha expirado.");
        }

        if (json.payload.email.toLowerCase() !== user.email?.toLowerCase()) {
          throw new Error(`Este enlace es para ${json.payload.email}, pero has iniciado sesión como ${user.email}. Por favor, inicia sesión con la cuenta correcta.`);
        }

        setPayload(json.payload);
        setStatus("ready");
      } catch (err: any) {
        setError(err.message);
        setStatus("error");
      }
    };
    
    verify();

  }, [token, user, authLoading, router]);

  if (status === "loading" || status === "validating") {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-4">
        <Loader2 className="h-10 w-10 animate-spin text-indigo-400 mb-4" />
        <p className="text-lg">{status === 'loading' ? 'Verificando sesión...' : 'Validando enlace de firma...'}</p>
      </div>
    );
  }

  if (status === "error") {
    return (
       <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-4 text-center">
        <div className="w-full max-w-md rounded-lg border border-red-500/30 bg-red-900/20 p-8 shadow-2xl">
          <AlertTriangle className="h-12 w-12 text-red-400 mb-4 mx-auto" />
          <h2 className="text-xl font-bold text-red-300 mb-2">Error de Validación</h2>
          <p className="text-slate-300">{error}</p>
          <Button onClick={() => router.push('/dashboard/agreements')} className="mt-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver a mis acuerdos
          </Button>
        </div>
      </div>
    );
  }

  if (status === "ready" && payload) {
    return (
        <GuestSignClient
          token={token!}
          agreementId={payload.agreementId}
          signerId={payload.signerId}
          email={payload.email}
      />
    );
  }

  return null;
}

export default function SignPageWrapper() {
  return (
    <Suspense fallback={<div className="flex justify-center items-center h-screen"><Loader2 className="h-8 w-8 animate-spin" /></div>}>
      <SignPageComponent />
    </Suspense>
  );
}
