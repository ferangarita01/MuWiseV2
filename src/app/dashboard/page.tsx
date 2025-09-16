
'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import {
  Plus,
  Search,
  X,
  Eye,
  EyeOff,
  Bookmark,
  BookmarkCheck,
  Rocket,
  Download,
  Clock,
  Globe,
  FileText,
  ShieldCheck,
} from 'lucide-react';
import { ContractCard } from '@/components/dashboard/agreements/contract-card';
import type { Contract } from '@/types/legacy';
import { QuickViewModal } from '@/components/dashboard/agreements/quick-view-modal';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { SuggestionDialog } from '@/components/dashboard/SuggestionDialog';
import { initialContractData } from '@/lib/initialData';


const categories = [
  "música", "licencias", "eventos", "distribución", "management", "colaboración"
];

export default function DashboardHomePage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [activeCategories, setActiveCategories] = useState<Set<string>>(new Set());
    const [contractData] = useState<Contract[]>(initialContractData); // Always use static data for templates
    const [filteredContracts, setFilteredContracts] = useState<Contract[]>(contractData);
    const [modalContract, setModalContract] = useState<Contract | null>(null);
    const [hiddenContractIds, setHiddenContractIds] = useState<Set<string>>(new Set());
    const [showHidden, setShowHidden] = useState(false);
    const [mounted, setMounted] = useState(false);
    const { toast } = useToast();

    useEffect(() => {
        setMounted(true);
    }, []);

    const updateHiddenContracts = useCallback(() => {
        if (!mounted) return;
        try {
            const hidden = JSON.parse(localStorage.getItem('hiddenContracts') || '[]');
            setHiddenContractIds(new Set(hidden));
        } catch (e) {
            console.error("Failed to parse hiddenContracts from localStorage", e);
        }
    }, [mounted]);

    useEffect(() => {
        if (!mounted) return;
        updateHiddenContracts();
        window.addEventListener('storage', updateHiddenContracts);
        return () => window.removeEventListener('storage', updateHiddenContracts);
    }, [updateHiddenContracts, mounted]);

    useEffect(() => {
        if (!mounted) return;
        try {
            const savedCategories = localStorage.getItem('activeCategories');
            if (savedCategories) {
                setActiveCategories(new Set(JSON.parse(savedCategories)));
            }
        } catch (e) {
            console.error("Failed to parse activeCategories from localStorage", e);
            setActiveCategories(new Set());
        }
    }, [mounted]);
    
    useEffect(() => {
        if (!mounted) return;
        const q = searchQuery.trim().toLowerCase();
        
        const filtered = contractData.filter(card => {
            const matchText = q === '' ||
                card.title.toLowerCase().includes(q) ||
                card.tags.toLowerCase().includes(q);

            const matchCats = activeCategories.size === 0 ||
                card.category.split(', ').some(c => activeCategories.has(c));

            const isHidden = hiddenContractIds.has(card.id);
            // Corrected logic: Show if `showHidden` is true, OR if the card is not hidden.
            const matchHidden = showHidden || !isHidden;
            
            return matchText && matchCats && matchHidden;
        });
        
        setFilteredContracts(filtered);
    }, [searchQuery, activeCategories, hiddenContractIds, showHidden, contractData, mounted]);
    
    useEffect(() => {
        if (!mounted) return;
        // Handle deep link to open modal
        const openModalFromHash = () => {
            const hash = window.location.hash.replace('#', '');
            if (hash) {
                const contract = contractData.find(c => c.id === hash);
                if (contract) {
                    setModalContract(contract);
                }
            }
        };

        openModalFromHash();
        window.addEventListener('hashchange', openModalFromHash, false);
        return () => window.removeEventListener('hashchange', openModalFromHash, false);
    }, [contractData, mounted]);

    const toggleCategory = (category: string) => {
        if (!mounted) return;
        const newCategories = new Set(activeCategories);
        if (newCategories.has(category)) {
            newCategories.delete(category);
        } else {
            newCategories.add(category);
        }
        setActiveCategories(newCategories);
        try {
            localStorage.setItem('activeCategories', JSON.stringify(Array.from(newCategories)));
        } catch (e) {
            console.error("Failed to save activeCategories to localStorage", e);
        }
    };

    const handleOpenModal = (contract: Contract) => {
        if (!mounted) return;
        setModalContract(contract);
        if (typeof window !== 'undefined') {
            window.location.hash = contract.id;
        }
    }

    const handleCloseModal = () => {
        if (!mounted) return;
        setModalContract(null);
        if (typeof window !== 'undefined') {
            history.pushState("", document.title, window.location.pathname + window.location.search);
        }
    };

    if (!mounted) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                    <p className="mt-2 text-sm text-muted-foreground">Loading Templates...</p>
                </div>
            </div>
        );
    }

    return (
        <>
        <div className="relative overflow-hidden">
             {/* Background accents */}
            <div className="pointer-events-none absolute inset-0">
                <div className="absolute -top-32 right-0 w-[620px] h-[620px] bg-gradient-to-br from-cyan-400/20 via-indigo-500/20 to-fuchsia-400/10 blur-3xl rounded-full"></div>
                <div className="absolute -bottom-24 -left-16 w-[520px] h-[520px] bg-gradient-to-tr from-sky-400/10 via-blue-500/10 to-indigo-500/10 blur-3xl rounded-full"></div>
            </div>

            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 relative">
                <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between gap-6">
                    <div>
                        <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight text-white">Biblioteca de Contratos</h1>
                        <p className="mt-3 text-base text-slate-300 max-w-2xl">Plantillas bilingües, listas para firmar. Optimiza tus acuerdos con tarjetas más claras, acciones directas y vista rápida.</p>
                    </div>
                     <div className="flex items-center gap-4">
                        <Button 
                          variant="outline" 
                          onClick={() => setShowHidden(prev => !prev)} 
                          className="px-3 h-10 rounded-md text-sm text-slate-300 hover:text-white/90 bg-white/5 border-white/10 hover:bg-white/10 transition flex items-center gap-2"
                          title={showHidden ? "Ocultar contratos escondidos" : "Mostrar contratos escondidos"}
                        >
                            {showHidden ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            {hiddenContractIds.size > 0 ? `${hiddenContractIds.size} ocultos` : '0 ocultos'}
                        </Button>
                        <SuggestionDialog />
                    </div>
                </div>

                {/* Controls */}
                <div className="mt-8 flex flex-col lg:flex-row gap-4 lg:items-center">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <input
                            id="searchInput"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Buscar por título, etiquetas o tipo…"
                            className="w-full h-11 pl-10 pr-12 rounded-md bg-white/5 border border-white/10 focus:border-white/20 outline-none text-base placeholder:text-slate-400 text-white transition"
                        />
                        {searchQuery && (
                            <button onClick={() => setSearchQuery('')} className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded hover:bg-white/5">
                                <X className="h-4 w-4 text-slate-400" />
                            </button>
                        )}
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {categories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => toggleCategory(cat)}
                                className={`chip px-3 h-9 rounded-md border text-sm font-medium transition capitalize ${activeCategories.has(cat) ? 'bg-white text-slate-900 border-transparent' : 'bg-white/5 border-white/10 text-slate-300 hover:text-white hover:border-white/20'}`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
        
        <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-20">
            <div id="cardsGrid" className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {filteredContracts.map(contract => (
                    <ContractCard 
                        key={contract.id} 
                        contract={contract} 
                        onQuickView={() => handleOpenModal(contract)} 
                        onHideToggle={updateHiddenContracts}
                    />
                ))}
            </div>

            {filteredContracts.length === 0 && (
                 <div id="emptyState">
                    <div className="mt-14 rounded-xl border border-white/10 bg-white/5 p-10 text-center">
                    <div className="mx-auto w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                        <Search className="h-5 w-5 text-slate-300" />
                    </div>
                    <h3 className="mt-4 text-2xl font-semibold tracking-tight">Sin resultados</h3>
                    <p className="mt-1 text-sm text-slate-400">Prueba con otro término o limpia los filtros.</p>
                    <div className="mt-4 flex items-center justify-center gap-2">
                        <button onClick={() => { setSearchQuery(''); setActiveCategories(new Set()) }} className="px-3 h-9 rounded-md bg-white text-slate-900 text-sm hover:bg-slate-100 transition">Limpiar todo</button>
                    </div>
                    </div>
                </div>
            )}
        </main>

        {modalContract && (
            <QuickViewModal contract={modalContract} onClose={handleCloseModal} />
        )}
        </>
    );
}

    

    
