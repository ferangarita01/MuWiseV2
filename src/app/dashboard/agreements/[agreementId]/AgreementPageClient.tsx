// /src/app/dashboard/agreements/[agreementId]/AgreementPageClient.tsx
'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AgreementHeader } from '@/components/agreement/agreement-header';
import { AgreementActions } from '@/components/agreement/agreement-actions';
import { SignersTable } from '@/components/agreement/signers-table';
import { useToast } from '@/hooks/use-toast';
import type { Contract, Signer } from '@/types/legacy';
import { DocumentHeader } from '@/components/document-header';
import { LegalTerms } from '@/components/legal-terms';
import { useUserProfile } from '@/hooks/useUserProfile';
import { Loader2, Save, Send } from 'lucide-react';
import { updateAgreementAction, updateAgreementStatusAction } from '@/actions/agreement/update';
import { updateSignerSignatureAction } from '@/actions/agreement/sign';
import { addSignerAction } from '@/actions/agreement/addSigner';
import { generateSplitPDF, type SplitSheetData, type ComposerData } from '@/utils/splitPdf';

interface AgreementPageClientProps {
  agreement: Contract;
}

// Function to map your Contract data to SplitSheetData
const mapAgreementToSplitSheetData = (agreement: Contract): SplitSheetData => {
  const composers: ComposerData[] = (agreement.signers || []).map(signer => ({
    name: signer.name || 'N/A',
    id: signer.id,
    percentage: '50', // This needs to be calculated or stored in your signer object
    address: 'N/A', // You need to add this to your Signer or UserProfile type
    phone: 'N/A',   // You need to add this to your Signer or UserProfile type
    email: signer.email || 'N/A',
    publisher: 'Self-Published', // This could come from UserProfile
    society: 'ASCAP', // This could come from UserProfile
    ipi: 'N/A', // This could come from UserProfile
    signature: signer.signature,
  }));

  return {
    songTitle: agreement.title || 'Untitled Song',
    publicationDate: new Date().toLocaleDateString(), // Or use a date from the agreement
    performers: composers.map(c => c.name).join(', '),
    duration: '3:30', // This needs to be stored in your agreement
    composers: composers,
  };
};

export default function AgreementPageClient({ agreement: initialAgreement }: AgreementPageClientProps) {
  const router = useRouter();
  const { toast } = useToast();
  const { userProfile, loading: profileLoading } = useUserProfile();

  const [agreement, setAgreement] = useState(initialAgreement);
  const [isFinalizing, setIsFinalizing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Derived state to check if all signers have signed
  const allSigned = agreement.signers?.every(s => s.signed) ?? false;

  useEffect(() => {
    setAgreement(initialAgreement);
  }, [initialAgreement]);

  const handleDownloadPDF = async () => {
    if (!agreement) {
        toast({ title: "Error", description: "Agreement data not loaded.", variant: "destructive" });
        return;
    }

    // If the agreement is completed and has a PDF URL, open it directly
    if (agreement.status === 'Completado' && agreement.pdfUrl) {
        window.open(agreement.pdfUrl, '_blank');
        return;
    }

    // Otherwise, generate the PDF on the fly
    try {
        toast({ title: "Generando PDF...", description: "Tu borrador de PDF se abrirá en una nueva pestaña en breve." });
        const splitSheetData = mapAgreementToSplitSheetData(agreement);
        await generateSplitPDF(splitSheetData, 'open');
    } catch (error) {
        console.error("PDF Generation Error:", error);
        toast({ title: "Error", description: "No se pudo generar el PDF.", variant: "destructive" });
    }
};

  const handleAddSigner = async (newSigner: Omit<Signer, 'id'>) => {
    if (!agreement) {
      toast({ title: "Error", description: "No se puede añadir firmante sin datos de acuerdo.", variant: "destructive" });
      return;
    }
  
    // La llamada a la acción ahora es más simple
    const result = await addSignerAction({
      agreementId: agreement.id,
      signerData: newSigner,
      agreementTitle: agreement.title,
    });
  
    if (result.status === 'success') {
      toast({
        title: 'Firmante Añadido',
        description: `${newSigner.name} ha sido añadido y notificado.`,
      });
      router.refresh(); // Refresca los datos del servidor para obtener la nueva lista de firmantes
    } else {
      toast({
        title: 'Error al Añadir Firmante',
        description: result.message,
        variant: 'destructive',
      });
    }
  };

  const handleApplySignature = async (signerId: string, signatureDataUrl: string) => {
    if (!agreement) return;

    // Optimistically update the UI
    const updatedSigners = (agreement.signers || []).map(signer =>
        signer.id === signerId
            ? { ...signer, signed: true, signature: signatureDataUrl, signedAt: new Date().toISOString() }
            : signer
    );
    const updatedAgreement = { ...agreement, signers: updatedSigners };
    setAgreement(updatedAgreement);

    try {
        const result = await updateSignerSignatureAction({
            agreementId: agreement.id,
            signerId,
            signatureDataUrl,
        });

        if (result.status === 'success') {
            toast({
                title: 'Firma Aplicada',
                description: 'Tu firma ha sido guardada correctamente.',
            });
            
            // Re-check if all have signed after successful server update
            const allHaveSigned = updatedAgreement.signers.every(s => s.signed);
            if (allHaveSigned) {
                // Optionally trigger finalization automatically or just enable the button
                toast({ title: '¡Todos han firmado!', description: 'El documento está listo para ser finalizado.' });
            }
             router.refresh();
        } else {
            throw new Error(result.message);
        }
    } catch (error) {
        toast({
            title: 'Error al aplicar firma',
            description: (error as Error).message,
            variant: 'destructive',
        });
        // Revert optimistic update on failure by re-fetching or using initial props
        setAgreement(initialAgreement);
    }
};

  const handleSaveDraft = useCallback(async () => {
    setIsSaving(true);
    toast({
      title: 'Guardando borrador...',
      description: 'Por favor, espera un momento.',
    });
  
    const { id, ...agreementData } = agreement;
  
    const result = await updateAgreementAction(id, agreementData);
  
    if (result.status === 'success') {
      toast({
        title: 'Borrador Guardado',
        description: 'Tus cambios han sido guardados correctamente.',
      });
      router.push('/dashboard/agreements');
    } else {
      toast({
        title: 'Error al Guardar',
        description: result.message,
        variant: 'destructive',
      });
    }
    setIsSaving(false);
  }, [agreement, toast, router]);

  const handleFinalizeDocument = useCallback(async (currentAgreement: Contract) => {
    if (!currentAgreement) return;
    setIsFinalizing(true);
    toast({ title: 'Finalizando...', description: 'Todos los firmantes han completado el acuerdo. Generando el PDF final.' });

    try {
        const splitSheetData = mapAgreementToSplitSheetData(currentAgreement);
        const pdfBase64 = await generateSplitPDF(splitSheetData, 'getBase64');

        if (!pdfBase64) {
            throw new Error('Failed to generate PDF base64 data.');
        }

        const result = await updateAgreementStatusAction(currentAgreement.id, 'Completado', pdfBase64);

        if (result.status === 'success') {
            setAgreement(prev => ({ ...prev!, status: 'Completado', pdfUrl: result.data.pdfUrl } as Contract));
            toast({
                title: 'Documento Finalizado',
                description: 'El acuerdo ha sido completado y el PDF ha sido guardado.',
            });
            router.refresh();
        } else {
            throw new Error(result.message);
        }
    } catch (error: any) {
        toast({
            title: 'Error al finalizar',
            description: error.message || 'Ocurrió un error inesperado.',
            variant: 'destructive',
        });
    } finally {
        setIsFinalizing(false);
    }
}, [toast, router]);


  if (profileLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-primary mb-4" />
        <h1 className="text-xl font-bold">Cargando acuerdo...</h1>
        <p className="text-muted-foreground">Obteniendo los detalles del acuerdo y firmantes.</p>
      </div>
    );
  }

  const signers: Signer[] = agreement.signers || [];


  return (
    <div className="relative mx-auto max-w-7xl px-4 py-6">
      <div className="pointer-events-none fixed inset-0" aria-hidden="true">
        <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-primary/5 blur-3xl"></div>
        <div className="absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-accent/5 blur-3xl"></div>
      </div>

      <AgreementHeader />

      <main className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <section id="documentColumn" className="lg:col-span-8">
          <div className="rounded-xl border bg-secondary shadow-sm ring-1 ring-white/5">
            <div className="overflow-hidden rounded-t-xl">
              <div className="relative">
                <img src={agreement.image} alt={agreement.title} data-ai-hint="agreement header" className="h-40 w-full object-cover sm:h-44 md:h-48" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/20 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <DocumentHeader agreement={agreement} />
                </div>
              </div>
            </div>
            <div id="doc-scroll" className="max-h-[72vh] overflow-auto px-6 pb-6">
              <article id="doc-wrapper" className="mx-auto max-w-3xl">
                <SignersTable signers={signers} onAddSigner={handleAddSigner} />

                <div className="leading-relaxed rounded-lg border border-secondary bg-background/50 ring-1 ring-white/5 p-5 mt-6">
                  <div className="mx-auto max-w-3xl rounded-md bg-white text-slate-900 shadow-lg ring-1 ring-inset ring-slate-900/5 p-6 space-y-6">
                    <p className="text-sm leading-6 text-slate-700">{agreement.desc}</p>
                    <LegalTerms />

                    <div className="rounded-md bg-slate-50 p-4 text-xs leading-6 ring-1 ring-inset ring-slate-200 text-slate-700">
                      <p>Al firmar, confirmas que has leído y aceptas los términos de uso, política de privacidad y reconoces que tu firma electrónica es legalmente vinculante. Conserva una copia para tus registros.</p>
                    </div>
                    <section>
                      <h3 className="mb-3 text-base font-medium text-slate-900">Firmas</h3>
                      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        {signers.map(signer => (
                          <div key={signer.id} className="rounded-lg border border-slate-200 bg-white p-4">
                            <p className="mb-2 text-xs font-medium text-slate-500">Firma de {signer.role}</p>
                            <div className="flex h-28 items-center justify-center rounded-md border-2 border-dashed border-slate-200 bg-white">
                              {signer.signature ? (
                                <img src={signer.signature} alt={`Firma de ${signer.name}`} className="max-h-24" />
                              ) : (
                                <span className="text-xs text-slate-400">Pendiente de firma</span>
                              )}
                            </div>
                            <div className="mt-3 flex items-center justify-between text-[11px] text-slate-500">
                              <span>Nombre: {signer.name}</span>
                              <span>{signer.signedAt ? new Date(signer.signedAt).toLocaleDateString() : ''}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </section>
                  </div>
                </div>

              </article>
            </div>
          </div>
          <div className="mt-4 flex justify-end gap-3">
            <button
              onClick={handleSaveDraft}
              disabled={isFinalizing || isSaving}
              className="inline-flex items-center justify-center gap-2 rounded-md border border-secondary bg-foreground/5 px-4 py-2.5 text-sm font-medium text-foreground/90 transition hover:translate-y-px hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/10"
            >
              {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              {isSaving ? 'Guardando...' : 'Guardar Borrador'}
            </button>
            <button
              onClick={() => handleFinalizeDocument(agreement)}
              disabled={isFinalizing || isSaving || !allSigned}
              className="group inline-flex items-center justify-center gap-2 rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground shadow-sm transition-all hover:translate-y-px hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/10"
            >
              {isFinalizing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              {isFinalizing ? 'Finalizando...' : 'Finalizar Documento'}
            </button>
          </div>
        </section>

        <AgreementActions
          agreement={agreement}
          signers={signers}
          currentUser={userProfile}
          onApplySignature={handleApplySignature}
          onDownloadPDF={handleDownloadPDF}
        />
      </main>
    </div>
  );
}
