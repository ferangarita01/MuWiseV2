
'use client';
import { ArrowLeft, Share2 } from 'lucide-react';

export function AgreementHeader() {
  return (
    <header className="mb-6 flex items-center justify-between rounded-xl border border-secondary bg-secondary/60 px-3 py-3 backdrop-blur">
      <div className="flex items-center gap-4">
        <button
          id="backBtn"
          className="inline-flex items-center gap-2 rounded-md border border-secondary bg-secondary px-3 py-2 text-sm font-medium text-foreground transition-all hover:translate-y-px hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/10"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver
        </button>
        <div className="hidden items-center gap-2 sm:flex">
          <div className="flex h-7 w-7 items-center justify-center rounded-md border border-secondary bg-foreground/5 text-[11px] font-medium tracking-tight text-foreground/80">
            SC
          </div>
          <div className="hidden sm:block text-foreground/30">/</div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-foreground/70">Acuerdos</span>
            <div className="hidden sm:block text-foreground/30">/</div>
            <span className="text-sm font-medium tracking-tight text-foreground">
              Service Contract for DJs
            </span>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2 sm:gap-3">
        <button
          id="shareBtn"
          className="hidden sm:inline-flex items-center gap-2 rounded-md border border-secondary bg-foreground/5 px-3 py-2 text-sm font-medium text-foreground/90 transition-all hover:translate-y-px hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/10"
        >
          <Share2 className="h-4 w-4" />
          Compartir enlace
        </button>
        <span
          id="statusBadge"
          className="inline-flex items-center gap-2 rounded-full border border-accent/35 bg-accent/10 px-3 py-1.5 text-xs font-medium text-accent"
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60"></span>
            <span className="relative inline-flex h-2 w-2 rounded-full bg-accent"></span>
          </span>
          En progreso
        </span>
      </div>
    </header>
  );
}
