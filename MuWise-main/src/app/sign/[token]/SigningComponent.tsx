"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Loader2, AlertTriangle, CheckCircle, ShieldCheck, UserCheck } from "lucide-react";
import { SignatureCanvas, SignatureCanvasHandle } from "@/components/signature-canvas";
import { useToast } from "@/hooks/use-toast";

interface SigningComponentProps {
  token: string;
  agreementId: string;
  signerId: string;
  email: string;
}

export default function SigningComponent({
  token,
  agreementId,
  signerId,
  email,
}: SigningComponentProps) {
  const router = useRouter();
  const { toast } = useToast();
  
  const [status, setStatus] = useState<'ready' | 'success'>('ready');
  const [isSigning, setIsSigning] = useState(false);
  const [signature, setSignature] = useState<string | null>(null);
  const signatureRef = useRef<SignatureCanvasHandle>(null);

  const handleApplySignature = async () => {
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
        body: JSON.stringify({
          signatureDataUrl: signature,
        }),
      });

      const result = await res.json();

      if (res.ok && result.status === "success") {
        toast({ 
          title: "¡Éxito!", 
          description: "El documento ha sido firmado correctamente." 
        });
        setStatus("success");
        
        setTimeout(() => {
          router.push("/dashboard/agreements");
        }, 3000);
      } else {
        toast({ 
          title: "Error", 
          description: result.message || "Hubo un problema guardando tu firma", 
          variant: "destructive" 
        });
        setIsSigning(false);
      }
    } catch (err: any) {
      console.error("Error applying signature:", err);
      toast({ 
        title: "Error inesperado", 
        description: "No fue posible enviar tu firma", 
        variant: "destructive" 
      });
      setIsSigning(false);
    }
  };

  const renderContent = () => {
    switch (status) {
      case "success":
        return (
          <div className="text-center">
            <CheckCircle className="h-12 w-12 text-green-400 mb-4 mx-auto" />
            <h2 className="text-xl font-bold text-green-300 mb-2">Firma Completada</h2>
            <p className="text-slate-400 mb-4">
              Gracias. Tu firma ha sido registrada correctamente.
            </p>
            <p className="text-xs text-slate-500">
              Serás redirigido automáticamente en unos segundos...
            </p>
          </div>
        );
      case "ready":
        return (
          <>
            <div className="text-center">
              <UserCheck className="mx-auto h-10 w-10 text-indigo-400 mb-4" />
              <h2 className="text-2xl font-bold mb-2">Solicitud de Firma</h2>
              <p className="text-slate-300 mb-6">
                Estás a punto de firmar un documento.
              </p>
            </div>

            <div className="bg-slate-700/50 rounded-md p-4 mb-6 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Firmante:</span>
                <span className="font-medium text-slate-200">{email}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Documento:</span>
                <span className="font-medium text-slate-200">{agreementId}</span>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">
                Dibuja tu firma en el recuadro
              </label>
              <SignatureCanvas ref={signatureRef} onSignatureEnd={setSignature} />
              <div className="flex justify-end mt-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    signatureRef.current?.clear();
                    setSignature(null);
                  }}
                >
                  Limpiar
                </Button>
              </div>
            </div>

            <Button
              onClick={handleApplySignature}
              disabled={isSigning || !signature}
              size="lg"
              className="w-full mt-6"
            >
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
              <ShieldCheck className="h-3 w-3" /> Al firmar, aceptas que tu firma
              electrónica es legalmente vinculante.
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