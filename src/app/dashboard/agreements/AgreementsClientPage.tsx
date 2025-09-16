
'use client';

import { useState, useEffect, useCallback } from 'react';
import { Search, X, Loader2 } from 'lucide-react';
import { AgreementCard } from '@/components/dashboard/agreements/agreement-card';
import type { Contract } from '@/types/legacy';
import { useToast } from '@/hooks/use-toast';
import { getAgreementsForUser } from '@/actions/agreement/get';
import { useAuth } from '@/hooks/use-auth';

const categories = ["Todos", "Guardados", "Completado", "Borrador", "Pendiente"];

export default function AgreementsClientPage() {
    const { toast } = useToast();
    const { user, loading: authLoading } = useAuth();
    const [searchQuery, setSearchQuery] = useState('');
    const [activeCategories, setActiveCategories] = useState<Set<string>>(new Set(['Todos']));
    const [allContracts, setAllContracts] = useState<Contract[]>([]);
    const [filteredContracts, setFilteredContracts] = useState<Contract[]>([]);
    const [bookmarkedIds, setBookmarkedIds] = useState<Set<string>>(new Set());
    const [isLoading, setIsLoading] = useState(true);

    const fetchAgreements = useCallback(async () => {
        if (!user) {
            setIsLoading(false);
            return;
        };

        setIsLoading(true);
        const result = await getAgreementsForUser();
        if (result.status === 'success' && result.data) {
            setAllContracts(result.data);
        } else {
            toast({
                title: "Error al cargar acuerdos",
                description: result.message || "No se pudieron obtener los acuerdos.",
                variant: "destructive",
            });
        }
        setIsLoading(false);
    }, [toast, user]);
    
    useEffect(() => {
        if (!authLoading) {
            fetchAgreements();
        }
        try {
            const savedBookmarks = localStorage.getItem('bookmarks');
            if (savedBookmarks) {
                setBookmarkedIds(new Set(JSON.parse(savedBookmarks)));
            }
        } catch(e) {
            console.error("Failed to parse bookmarks from localStorage", e);
        }
    }, [authLoading, fetchAgreements]);

    const updateBookmarks = useCallback(() => {
        if (typeof window === 'undefined') return;
        try {
            const saved = JSON.parse(localStorage.getItem('bookmarks') || '[]');
            setBookmarkedIds(new Set(saved));
        } catch (e) {
            console.error("Failed to parse bookmarks from localStorage", e);
        }
    }, []);
    
    const handleDeleteContract = (contractId: string) => {
        setAllContracts(prev => prev.filter(c => c.id !== contractId));
        toast({
            title: 'Contrato eliminado',
            description: 'El borrador ha sido eliminado de tu vista.',
        });
    };

    useEffect(() => {
        const q = searchQuery.trim().toLowerCase();
        
        const filtered = allContracts.filter(card => {
            // Search query filter
            const matchText = q === '' ||
                (card.title && card.title.toLowerCase().includes(q)) ||
                (card.tags && card.tags.toLowerCase().includes(q));

            // Category filter
            const isTodosActive = activeCategories.has('Todos');
            if (isTodosActive) {
                return matchText; // If 'Todos' is selected, show all that match search
            }

            if (activeCategories.size === 0) {
                 return matchText; // Also show all if no categories are selected
            }

            // complex category logic
            const isBookmarked = bookmarkedIds.has(card.id);
            const hasGuardados = activeCategories.has('Guardados');
            const hasStatus = activeCategories.has(card.status);

            let matchCats = false;
            if (hasGuardados && hasStatus) {
                matchCats = isBookmarked; // If both, bookmark takes precedence
            } else if (hasGuardados) {
                matchCats = isBookmarked;
            } else if (activeCategories.size > 0) {
                matchCats = hasStatus;
            }
            
            return matchText && matchCats;
        });

        const sorted = [...filtered].sort((a, b) => {
            const aIsBookmarked = bookmarkedIds.has(a.id);
            const bIsBookmarked = bookmarkedIds.has(b.id);
            if (aIsBookmarked !== bIsBookmarked) {
                return aIsBookmarked ? -1 : 1;
            }
            const dateA = new Date(a.lastModified || a.createdAt || 0).getTime();
            const dateB = new Date(b.lastModified || b.createdAt || 0).getTime();
            return dateB - dateA;
        });
        
        setFilteredContracts(sorted);
    }, [searchQuery, activeCategories, bookmarkedIds, allContracts]);
    
    const toggleCategory = (category: string) => {
        const newCategories = new Set(activeCategories);

        if (category === 'Todos') {
            newCategories.clear();
            newCategories.add('Todos');
        } else {
            newCategories.delete('Todos');
            if (newCategories.has(category)) {
                newCategories.delete(category);
            } else {
                newCategories.add(category);
            }
            if (newCategories.size === 0) {
              newCategories.add('Todos');
            }
        }
        setActiveCategories(newCategories);
    };

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
                        <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight text-white">Mis Acuerdos</h1>
                        <p className="mt-3 text-base text-slate-300 max-w-2xl">Gestiona tus contratos finalizados, borradores y acuerdos pendientes de firma.</p>
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
                            placeholder="Buscar por título, estado o tipo…"
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
                                className={`chip px-3 h-9 rounded-md bg-white/5 border border-white/10 text-sm text-slate-300 hover:text-white hover:border-white/20 transition capitalize ${activeCategories.has(cat) ? 'ring-1 ring-white/30 bg-white/10 text-white' : ''}`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
        
        <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-20">
            {isLoading || authLoading ? (
                <div className="flex flex-col items-center justify-center text-center py-20">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <p className="mt-4 text-muted-foreground">Cargando tus acuerdos...</p>
                </div>
            ) : filteredContracts.length > 0 ? (
                <div id="cardsGrid" className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {filteredContracts.map(agreement => (
                        <AgreementCard
                            key={agreement.id} 
                            agreement={agreement} 
                            onBookmarkToggle={updateBookmarks} 
                            onDelete={handleDeleteContract}
                        />
                    ))}
                </div>
            ) : (
                <div id="emptyState">
                    <div className="mt-14 rounded-xl border border-white/10 bg-white/5 p-10 text-center">
                        <div className="mx-auto w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                            <Search className="h-5 w-5 text-slate-300" />
                        </div>
                        <h3 className="mt-4 text-2xl font-semibold tracking-tight">Sin resultados</h3>
                        <p className="mt-1 text-sm text-slate-400">
                            {allContracts.length === 0 
                                ? "No tienes ningún acuerdo todavía. ¡Crea uno desde la página principal!" 
                                : "No se encontraron acuerdos que coincidan con tu búsqueda o filtros."}
                        </p>
                    </div>
                </div>
            )}
        </main>
        </>
    );
}
