'use client';
import { useState } from 'react';
import { UserPlus, Plus, Loader2 } from 'lucide-react';
import type { Signer } from '@/types/legacy';
import { BadgeCheck, Clock4 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface SignersTableProps {
  signers: Signer[];
  onAddSigner: (signer: Omit<Signer, 'id'>) => Promise<void>; // Make it async
}

const getInitials = (name?: string | null) => {
    if (!name) return 'U';
    return name.split(' ').map((p:string) => p[0]).slice(0,2).join('').toUpperCase();
}

const StatusBadge = ({ signed }: { signed: boolean }) => {
  const isSigned = !!signed;
  return (
    <span className={cn(
      "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium",
      isSigned 
        ? "border-primary/35 bg-primary/10 text-primary" 
        : "border-accent/35 bg-accent/10 text-accent"
    )}>
       {isSigned ? (
        <BadgeCheck className="h-3.5 w-3.5" />
      ) : (
        <Clock4 className="h-3.5 w-3.5" />
      )}
      {isSigned ? 'Firmado' : 'Pendiente'}
    </span>
  )
}

export function SignersTable({ signers, onAddSigner }: SignersTableProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('Invitado');
  const { toast } = useToast();

  const allSigned = signers.every(s => s.signed);

  const handleConfirmAdd = async () => {
    if (!name.trim() || !email.trim()) {
      toast({
        title: 'Campos requeridos',
        description: 'Por favor, introduce un nombre y un correo electrónico.',
        variant: 'destructive',
      });
      return;
    }
    setIsSubmitting(true);
    // Llamar a la acción del servidor y pasar los datos del nuevo firmante.
    await onAddSigner({ name, email, role, signed: false });
    setIsSubmitting(false);

    // No actualices el estado localmente. La UI se actualizará
    // cuando los datos del servidor cambien gracias a `revalidatePath`.
    // Limpia el formulario después de un envío exitoso.
    setIsAdding(false);
    setName('');
    setEmail('');
    setRole('Invitado');
  };

  const handleCancelAdd = () => {
    setIsAdding(false);
    setName('');
    setEmail('');
    setRole('Invitado');
  };

  return (
    <div className="mb-6 rounded-lg border border-secondary bg-secondary ring-1 ring-white/5">
      <div className="flex items-center justify-between border-b border-secondary px-4 py-3">
        <h2 className="text-lg font-semibold tracking-tight text-foreground">
          Firmantes
        </h2>
        <div className="flex items-center gap-2">
          {allSigned && (
            <span
              className="rounded-full border border-primary/35 bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary"
            >
              Todos firmaron
            </span>
          )}
          <button
            onClick={() => setIsAdding(true)}
            disabled={isAdding}
            className="inline-flex items-center gap-1 rounded-md bg-primary px-2.5 py-1.5 text-xs font-medium text-primary-foreground transition-all hover:translate-y-px hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/10 disabled:opacity-50"
          >
            <UserPlus className="h-3.5 w-3.5" />
            Añadir firmante
          </button>
        </div>
      </div>

      {/* Add signer form (toggle) */}
      {isAdding && (
        <div className="border-b border-secondary px-4 py-4">
            <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      type="text"
                      placeholder="Nombre completo"
                      className="w-full rounded-md border border-secondary bg-background/50 px-3 py-2 text-sm text-foreground outline-none transition focus:ring-0 focus-visible:ring-2 focus-visible:ring-white/10"
                    />
                    <input
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      type="email"
                      placeholder="correo@ejemplo.com"
                      className="w-full rounded-md border border-secondary bg-background/50 px-3 py-2 text-sm text-foreground outline-none transition focus:ring-0 focus-visible:ring-2 focus-visible:ring-white/10"
                    />
                </div>
                <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full rounded-md border border-secondary bg-background/50 px-3 py-2 text-sm text-foreground outline-none transition focus:ring-0 focus-visible:ring-2 focus-visible:ring-white/10"
                  >
                    <option>Invitado</option>
                    <option>Testigo</option>
                    <option>Representante</option>
                    <option>Coordinación</option>
                    <option>Cliente</option>
                    <option>Artista</option>
                    <option>SongWriter</option>
                    <option>Singer</option>
                    <option>Contratante</option>
                </select>
                <div className="flex justify-end gap-2">
                  <button
                      onClick={handleCancelAdd}
                      disabled={isSubmitting}
                      className="inline-flex items-center justify-center gap-2 rounded-md border border-secondary bg-secondary px-3 py-2 text-sm font-medium text-foreground/80 transition-all hover:translate-y-px hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/10"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={handleConfirmAdd}
                      disabled={isSubmitting}
                      className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground transition-all hover:translate-y-px hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/10 w-28"
                    >
                      {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Plus className="h-4 w-4" /> Agregar</>}
                    </button>
                </div>
            </div>
        </div>
      )}

      <div id="signersList" className="divide-y divide-white/5">
        {signers.map(signer => (
          <div key={signer.id} className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-foreground/10 text-xs font-medium text-foreground/90">
                {getInitials(signer.name)}
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">
                  {signer.name} ({signer.role})
                </p>
                <p className="text-xs text-foreground/65">{signer.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <StatusBadge signed={!!signer.signed} />
              <span className="text-xs text-foreground/50">
                {signer.signedAt ? new Date(signer.signedAt).toLocaleDateString() : ''}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
