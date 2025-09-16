// src/components/agreement/agreement-actions.tsx
'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import {
  Clock,
  PenLine,
  Download,
  BadgeCheck,
  ChevronDown,
  Pencil,
  Undo2,
  Trash2,
  Check,
  Send,
  Link2,
  Loader2,
  RotateCcw,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { SignatureCanvas, SignatureCanvasHandle } from '@/components/signature-canvas';
import type { Contract, Signer, User } from '@/types/legacy';
import { addSignerAction } from '@/actions/agreement/addSigner';

interface AgreementActionsProps {
  agreement: Contract;
  signers: Signer[];
  currentUser: User | null;
  onApplySignature: (signerId: string, signatureDataUrl: string) => void;
  onDownloadPDF: () => void;
}

export function AgreementActions({ agreement, signers, currentUser, onApplySignature, onDownloadPDF }: AgreementActionsProps) {
  const { toast } = useToast();
  const signatureRef = useRef<SignatureCanvasHandle>(null);
  
  const [selectedSigner, setSelectedSigner] = useState<string | null>(null);
  const [signature, setSignature] = useState<string | null>(null);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isSending, setIsSending] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [penColor, setPenColor] = useState('#0f172a'); // default black
  const [penWeight, setPenWeight] = useState(2.2); // default normal
  
  useEffect(() => {
    // Auto-select the current user if they are in the signers list
    if (currentUser) {
      const userAsSigner = signers.find(signer => signer.email === currentUser.email);
      if (userAsSigner) {
        setSelectedSigner(userAsSigner.id);
      }
    }
  }, [currentUser, signers]);
  
  const isSignButtonDisabled = !selectedSigner || !signature || !termsAccepted;

  useEffect(() => {
    const calculateProgress = () => {
      const stepsCompleted = [selectedSigner, signature, termsAccepted].filter(Boolean).length;
      setProgress(Math.round((stepsCompleted / 3) * 100));
    };
    calculateProgress();
  }, [selectedSigner, signature, termsAccepted]);


  const handleSignatureEnd = (signatureData: string | null) => {
    setSignature(signatureData);
  };

  const handleTermsToggle = () => {
    setTermsAccepted(!termsAccepted);
  };

  const handleSignerSelect = (signerId: string) => {
    setSelectedSigner(signerId);
    setIsMenuOpen(false);
  };

  const handleApplySignature = () => {
    if (isSignButtonDisabled) {
      toast({
        title: 'Faltan datos',
        description: 'Por favor, completa todos los pasos del flujo de firma.',
        variant: 'destructive'
      });
      return;
    }
    
    onApplySignature(selectedSigner!, signature!);

    // Reset the signing panel
    signatureRef.current?.clear();
    setTermsAccepted(false);
    setSelectedSigner(null);
    setSignature(null);
    setProgress(0);
  };

  const handleRequestSignature = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast({ title: "Email requerido", description: "Por favor ingresa un email.", variant: "destructive" });
      return;
    }
    setIsSending(true);

    const result = await addSignerAction({
      agreementId: agreement.id,
      signerData: { name: 'Nuevo Firmante', email: email, role: 'Invitado', signed: false },
      agreementTitle: agreement.title,
    });

    if (result.status === 'success' || result.status === 'warning') {
      toast({ title: result.status === 'success' ? 'Solicitud Enviada' : 'Solicitud Reenviada', description: result.message });
      setEmail('');
    } else {
      toast({ title: 'Error', description: result.message, variant: 'destructive' });
    }

    setIsSending(false);
  };
  
  return (
    <aside className="lg:col-span-4 lg:sticky lg:top-6">
      <div className="space-y-6">
        {/* Actions */}
        <div className="rounded-xl border border-secondary bg-secondary p-4 shadow-sm ring-1 ring-white/5">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-base font-semibold tracking-tight text-foreground">
              Acciones
            </h3>
            <div className="inline-flex items-center gap-1 text-[11px] text-foreground/60">
              <Clock className="h-3.5 w-3.5" />
              <span id="autosaveIndicator">Auto-guardado</span>
            </div>
          </div>
          <div className="space-y-2">
            <button
              onClick={handleApplySignature}
              disabled={isSignButtonDisabled}
              className="group inline-flex w-full items-center justify-center gap-2 rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground shadow-sm transition-all hover:translate-y-px hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/10"
            >
              <PenLine className="h-4 w-4" />
              Firmar documento
            </button>
            <button
              id="downloadBtn"
              onClick={onDownloadPDF}
              className="inline-flex w-full items-center justify-center gap-2 rounded-md border border-secondary bg-secondary px-4 py-2.5 text-sm font-medium text-foreground transition-all hover:translate-y-px hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/10"
            >
              <Download className="h-4 w-4" />
              Descargar PDF
            </button>
            <button
              className="inline-flex w-full cursor-not-allowed items-center justify-center gap-2 rounded-md border border-secondary bg-foreground/5 px-4 py-2.5 text-sm font-medium text-foreground/45"
              disabled
            >
              <BadgeCheck className="h-4 w-4" />
              Certificado digital (pronto)
            </button>
          </div>
        </div>

        {/* Guided Flow */}
        <div className="rounded-xl border border-secondary bg-secondary p-4 shadow-sm ring-1 ring-white/5">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-base font-semibold tracking-tight text-foreground">
              Flujo de firma
            </h3>
            <span
              className="text-xs font-medium text-foreground/75"
            >
              {progress}%
            </span>
          </div>
          <div className="mb-4 h-1.5 w-full overflow-hidden rounded-full bg-foreground/10">
            <div
              className="h-1.5 rounded-full bg-primary transition-all"
              style={{ width: `${progress}%` }}
            ></div>
          </div>

          {/* Step 1: Select Signer */}
          <div className="mb-4">
            <div className="mb-2 flex items-center gap-2">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-foreground/10 text-xs font-medium text-foreground/80">
                1
              </span>
              <span className="text-sm font-medium text-foreground">
                Selecciona quién firma
              </span>
            </div>
            {/* Custom dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="inline-flex w-full items-center justify-between gap-2 rounded-md border border-secondary bg-secondary px-3 py-2 text-sm font-medium text-foreground transition-all hover:translate-y-px hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/10"
              >
                <span className="flex items-center gap-2">
                  <span
                    className="flex h-5 w-5 items-center justify-center rounded-full bg-foreground/10 text-[10px] font-medium text-foreground/90"
                  >
                    {selectedSigner ? (signers.find(s => s.id === selectedSigner)?.name.charAt(0) || '?') : '?'}
                  </span>
                  <span>{selectedSigner ? signers.find(s => s.id === selectedSigner)?.name : 'Seleccionar firmante'}</span>
                </span>
                <ChevronDown className={`h-4 w-4 transition-transform ${isMenuOpen ? 'rotate-180' : ''}`} />
              </button>
              {isMenuOpen && (
                 <div className="absolute z-20 mt-2 w-full overflow-hidden rounded-md border border-secondary bg-background shadow-lg ring-1 ring-white/5">
                   {signers.map(signer => (
                     <button
                       key={signer.id}
                       onClick={() => handleSignerSelect(signer.id)}
                       className="flex w-full items-center justify-between gap-2 px-3 py-2 text-left text-sm text-foreground transition hover:brightness-110"
                     >
                       <span className="flex items-center gap-2">{signer.name} ({signer.role})</span>
                       <span className={`text-[10px] ${signer.signed ? 'text-primary' : 'text-accent'}`}>{signer.signed ? 'Firmado' : 'Pendiente'}</span>
                     </button>
                   ))}
                 </div>
              )}
            </div>
          </div>

          {/* Step 2: SignatureCanvas */}
          <div className="mb-4">
            <div className="mb-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-foreground/10 text-xs font-medium text-foreground/80">2</span>
                <span className="text-sm font-medium text-foreground">Dibuja tu firma</span>
              </div>
                <button
                    type="button"
                    className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs text-foreground/70 transition-colors hover:text-foreground"
                    onClick={() => signatureRef.current?.clear()}
                >
                    <RotateCcw className="h-3 w-3" /> Limpiar
                </button>
            </div>
             <SignatureCanvas ref={signatureRef} onSignatureEnd={handleSignatureEnd} color={penColor} weight={penWeight} />

            {/* Brush Controls */}
            <div className="mt-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <button type='button' onClick={() => setPenColor('#0f172a')} className={`h-6 w-6 rounded-full bg-[#0f172a] ${penColor === '#0f172a' ? 'ring-2 ring-primary ring-offset-2 ring-offset-secondary' : ''}`}></button>
                    <button type='button' onClick={() => setPenColor('#2563eb')} className={`h-6 w-6 rounded-full bg-[#2563eb] ${penColor === '#2563eb' ? 'ring-2 ring-primary ring-offset-2 ring-offset-secondary' : ''}`}></button>
                    <button type='button' onClick={() => setPenColor('#7c3aed')} className={`h-6 w-6 rounded-full bg-[#7c3aed] ${penColor === '#7c3aed' ? 'ring-2 ring-primary ring-offset-2 ring-offset-secondary' : ''}`}></button>
                </div>
                 <div className="flex items-center gap-1 rounded-md border border-foreground/10 bg-foreground/5 p-0.5">
                    <button type='button' onClick={() => setPenWeight(1.6)} className={`rounded-sm px-2 py-1 text-xs transition-colors ${penWeight === 1.6 ? 'bg-primary text-primary-foreground' : 'text-foreground/70 hover:bg-foreground/10'}`}>Fino</button>
                    <button type='button' onClick={() => setPenWeight(2.2)} className={`rounded-sm px-2 py-1 text-xs transition-colors ${penWeight === 2.2 ? 'bg-primary text-primary-foreground' : 'text-foreground/70 hover:bg-foreground/10'}`}>Normal</button>
                    <button type='button' onClick={() => setPenWeight(3.2)} className={`rounded-sm px-2 py-1 text-xs transition-colors ${penWeight === 3.2 ? 'bg-primary text-primary-foreground' : 'text-foreground/70 hover:bg-foreground/10'}`}>Grueso</button>
                </div>
            </div>
          </div>

          {/* Step 3: Terms */}
          <div className="mb-4">
            <div className="mb-2 flex items-center gap-2">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-foreground/10 text-xs font-medium text-foreground/80">
                3
              </span>
              <span className="text-sm font-medium text-foreground">
                Acepta los términos
              </span>
            </div>
            {/* Custom checkbox */}
            <button
              onClick={handleTermsToggle}
              type="button"
              className="group inline-flex w-full items-start gap-3 rounded-md border border-secondary bg-secondary p-3 text-left transition hover:translate-y-px hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/10"
            >
              <span className={`mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-md border transition ${termsAccepted ? 'bg-primary border-primary' : 'border-foreground/25 bg-secondary'}`}>
                {termsAccepted && <Check className="h-4 w-4 text-primary-foreground"/>}
              </span>
              <span className="text-sm text-foreground/85">
                He leído y acepto los términos legales del acuerdo y autorizo
                el uso de mi firma electrónica.
              </span>
            </button>
          </div>

          <div className="rounded-md bg-foreground/5 p-3 text-xs text-foreground/65">
            Completa los 3 pasos para habilitar “Firmar documento”.
          </div>
        </div>

        {/* Request Signatures */}
        <div className="rounded-xl border border-secondary bg-secondary p-4 shadow-sm ring-1 ring-white/5">
          <h3 className="mb-3 text-base font-semibold tracking-tight text-foreground">
            Solicitar firmas
          </h3>
          <form onSubmit={handleRequestSignature} className="space-y-2">
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              placeholder="recipient@example.com"
              className="w-full rounded-md border border-secondary bg-background/50 px-3 py-2 text-sm text-foreground placeholder-slate-400/70 outline-none ring-0 transition focus:ring-0 focus-visible:ring-2 focus-visible:ring-white/10"
              required
            />
            <div className="grid grid-cols-1 gap-2">
              <button
                type="submit"
                disabled={isSending}
                className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-accent px-4 py-2.5 text-sm font-medium text-accent-foreground shadow-sm transition hover:translate-y-px hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/10 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
                {isSending ? 'Enviando...' : 'Enviar solicitud'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </aside>
  );
}
