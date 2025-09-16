// src/app/sign/[token]/GuestSignClient.tsx
"use client";

import React, { useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle, ShieldCheck, UserCheck, RotateCcw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { SignatureCanvas, SignatureCanvasHandle } from "@/components/signature-canvas";
import { useAuth } from "@/hooks/use-auth";

interface Props {
  token: string;
  agreementId: string;
  signerId: string;
  email: string;
}

export default function GuestSignClient({ token, email, agreementId, signerId }: Props) {
  const router = useRouter();
  const { toast } = useToast();
  const { user } = useAuth();

  const [status, setStatus] = useState<'ready' | 'success'>('ready'); 
  const [isSigning, setIsSigning] = useState(false);
  const [signature, setSignature] = useState<string | null>(null);
  const signatureRef = useRef<SignatureCanvasHandle>(null);

  const handleApplySignature = useCallback(async () => {
    if (!signature) {
      toast({
        title: "Firma requerida",
        description: "Por favor, dibuja tu firma antes de continuar.",
        variant: "destructive",
      });
      return;
    }
    
    setIsSigning(true);
    try {
      const res = await fetch(`/api/sign/${encodeURIComponent(token)}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ signatureDataUrl: signature }),
      });

      const result = await res.json();

      if (res.ok && result.status === "success") {
        toast({ title: "¡Éxito!", description: "Documento firmado correctamente." });
        setStatus("success");
      } else {
        throw new Error(result.message || "Error guardando la firma");
      }
    } catch (err: any) {
      toast({ title: "Error inesperado", description: err.message || "No fue posible enviar tu firma", variant: "destructive" });
      setIsSigning(false);
    }
  }, [signature, token, toast]);

  const renderContent = () => {
    switch (status) {
      case "success":
        return (
          <div className="text-center">
            <CheckCircle className="h-12 w-12 text-green-400 mb-4 mx-auto" />
            <h2 className="text-xl font-bold text-green-300 mb-2">Firma completada</h2>
            <p className="text-slate-400">Gracias. Tu firma ha sido registrada correctamente.</p>
             <Button onClick={() => router.push("/dashboard/agreements")} className="mt-6">Ir a mis acuerdos</Button>
          </div>
        );
      case "ready":
      default:
        return (
          <>
            <div className="text-center">
              <UserCheck className="mx-auto h-10 w-10 text-indigo-400 mb-4" />
              <h2 className="text-2xl font-bold mb-2">Solicitud de Firma</h2>
              <p className="text-slate-300 mb-6">Estás a punto de firmar un documento como {user?.displayName || email}.</p>
            </div>
            
             <div>
              <div className="flex justify-between items-center mb-2">
                 <label className="text-sm font-medium">
                  Dibuja tu firma en el recuadro
                </label>
                 <Button variant="ghost" size="sm" onClick={() => { signatureRef.current?.clear(); setSignature(null); }}>
                   <RotateCcw className="mr-2 h-3 w-3"/>
                  Limpiar
                </Button>
              </div>
              <SignatureCanvas ref={signatureRef} onSignatureEnd={setSignature} />
            </div>

            <Button onClick={handleApplySignature} disabled={isSigning || !signature} size="lg" className="w-full mt-6">
              {isSigning ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Procesando...
                </>
              ) : (
                <>
                  <CheckCircle className="mr-2 h-4 w-4" /> Firmar y Aceptar
                </>
              )}
            </Button>
            <p className="text-xs text-slate-500 mt-4 text-center flex items-center justify-center gap-1.5">
              <ShieldCheck className="h-3 w-3" /> Al firmar, aceptas su validez legal.
            </p>
          </>
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center p-4">
      <div className="w-full max-w-lg rounded-lg border border-white/10 bg-slate-800/50 p-8 shadow-2xl">
        {renderContent()}
      </div>
    </div>
  );
}
