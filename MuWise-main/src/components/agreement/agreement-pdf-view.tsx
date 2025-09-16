'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Download, ArrowLeft } from 'lucide-react';
import type { Contract } from '@/types/legacy';

interface AgreementPdfViewProps {
  agreement: Contract;
}

export default function AgreementPdfView({ agreement }: AgreementPdfViewProps) {
  const router = useRouter();

  if (!agreement.pdfUrl) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center py-20">
        <h1 className="text-xl font-bold">Error</h1>
        <p className="text-muted-foreground">No se encontró el documento PDF para este acuerdo.</p>
        <Button onClick={() => router.back()} className="mt-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-slate-800">
      <header className="flex items-center justify-between p-4 border-b border-white/10 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => router.push('/dashboard/agreements')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver a Mis Acuerdos
          </Button>
          <div>
            <h1 className="text-lg font-semibold text-white">{agreement.title}</h1>
            <p className="text-sm text-slate-400">Documento Finalizado</p>
          </div>
        </div>
        <a href={agreement.pdfUrl} download target="_blank" rel="noopener noreferrer">
          <Button>
            <Download className="mr-2 h-4 w-4" />
            Descargar PDF
          </Button>
        </a>
      </header>
      <div className="flex-1 w-full">
        <iframe
          src={agreement.pdfUrl}
          className="w-full h-full border-0"
          title={`Visor de PDF para ${agreement.title}`}
        >
        </iframe>
      </div>
    </div>
  );
}
