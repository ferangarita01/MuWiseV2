
'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import {
  X,
  Check,
  Rocket,
  Download,
  Link as LinkIcon,
  Clock,
  Globe,
  FileText,
  ShieldCheck,
} from 'lucide-react';
import type { Contract } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

interface QuickViewModalProps {
    contract: Contract;
    onClose: () => void;
}

export function QuickViewModal({ contract, onClose }: QuickViewModalProps) {
    const { toast } = useToast();
    const router = useRouter();

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };

        document.body.classList.add('overflow-hidden');
        window.addEventListener('keydown', handleKeyDown);

        return () => {
            document.body.classList.remove('overflow-hidden');
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [onClose]);
    
    const handleDownload = (e: React.MouseEvent) => {
        e.stopPropagation();
        toast({ title: `Descargando: ${contract.title}` });
    };

    const handleCopyLink = async (e: React.MouseEvent) => {
        e.stopPropagation();
        if (typeof window === 'undefined') return;
        
        try {
          const url = new URL(window.location.href);
          url.hash = contract.id;
          await navigator.clipboard.writeText(url.toString());
          toast({ title: 'Enlace copiado al portapapeles' });
        } catch {
          toast({ variant: 'destructive', title: 'No se pudo copiar el enlace' });
        }
    };
    
    const handleUse = (e: React.MouseEvent) => {
        e.stopPropagation();
        router.push(`/dashboard/agreements/${contract.id}`);
        onClose(); // Close modal on navigation
    }

    return (
        <div id="quickModal" className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm" onClick={onClose}></div>
            <div className="relative mx-auto max-w-3xl w-full px-4 sm:px-6 lg:px-8 py-12">
                <div className="rounded-2xl overflow-hidden border border-white/10 bg-slate-900 shadow-2xl">
                    <div className="flex flex-col md:flex-row">
                        <div className="md:w-5/12 relative">
                            <div className="h-56 md:h-full overflow-hidden">
                                <Image id="modalImage" src={contract.image} alt={contract.title} width={500} height={600} className="h-full w-full object-cover" data-ai-hint="agreement details"/>
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent"></div>
                            </div>
                            <div className="absolute left-4 top-4 flex items-center gap-2">
                                <span className="px-2.5 h-7 inline-flex items-center rounded-full text-[12px] bg-white/90 text-slate-900 font-medium">{contract.type}</span>
                                <span className={`px-2.5 h-7 inline-flex items-center rounded-full text-[12px] font-medium ${contract.status === 'Gratis' ? 'bg-emerald-400/90 text-emerald-950' : 'bg-indigo-400/90 text-indigo-950'}`}>{contract.status}</span>
                            </div>
                        </div>
                        <div className="md:w-7/12 p-6">
                            <div className="flex items-start justify-between gap-2">
                                <h3 className="text-2xl font-semibold tracking-tight text-white">{contract.title}</h3>
                                <button onClick={onClose} className="p-2 rounded-md hover:bg-white/5">
                                    <X className="h-5 w-5 text-slate-300" />
                                </button>
                            </div>
                            <p className="mt-2 text-sm text-slate-300">{contract.desc}</p>

                            <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
                                <div className="flex items-center gap-2 text-slate-300"><Clock className="h-4 w-4" /><span>{contract.mins} min</span></div>
                                <div className="flex items-center gap-2 text-slate-300"><FileText className="h-4 w-4" /><span>{contract.filetypes}</span></div>
                                <div className="flex items-center gap-2 text-slate-300"><Globe className="h-4 w-4" /><span>EN/ES</span></div>
                                {contract.verified && <div className="flex items-center gap-2 text-emerald-300"><ShieldCheck className="h-4 w-4" /><span>Revisado por abogado</span></div>}
                            </div>

                            <div className="mt-6">
                                <h4 className="text-base font-medium tracking-tight text-white/90">Incluye</h4>
                                <ul className="mt-2 space-y-1.5 text-sm text-slate-300">
                                    <li className="flex items-start gap-2"><Check className="h-4 w-4 text-emerald-400 mt-0.5 shrink-0" /> Cláusulas de propiedad intelectual y créditos</li>
                                    <li className="flex items-start gap-2"><Check className="h-4 w-4 text-emerald-400 mt-0.5 shrink-0" /> Campos editables y comentarios internos</li>
                                    <li className="flex items-start gap-2"><Check className="h-4 w-4 text-emerald-400 mt-0.5 shrink-0" /> Versiones en PDF y DOCX</li>
                                </ul>
                            </div>

                            <div className="mt-6 flex flex-wrap items-center gap-2">
                                <button onClick={handleUse} className="px-4 h-10 rounded-md bg-white text-slate-900 text-sm hover:bg-slate-100 transition flex items-center gap-2">
                                    <Rocket className="h-4 w-4" /> Usar ahora
                                </button>
                                <button onClick={handleDownload} className="px-4 h-10 rounded-md bg-white/5 border border-white/10 text-sm text-slate-300 hover:text-white hover:border-white/20 transition flex items-center gap-2">
                                    <Download className="h-4 w-4" /> Descargar
                                </button>
                                <button onClick={handleCopyLink} className="px-4 h-10 rounded-md bg-white/5 border border-white/10 text-sm text-slate-300 hover:text-white hover:border-white/20 transition flex items-center gap-2">
                                    <LinkIcon className="h-4 w-4" /> Copiar enlace
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
