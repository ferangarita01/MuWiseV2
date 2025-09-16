
import type { Contract } from '@/lib/types';
import { FileText } from 'lucide-react';

export function DocumentHeader({ agreement }: { agreement: Contract }) {
  return (
    <div className="flex items-end justify-between">
      <div>
        <div className="mb-2 inline-flex items-center gap-2 rounded-full border px-2.5 py-1 text-[11px] font-medium border-foreground/15 text-foreground/80 bg-foreground/5">
          Contrato
        </div>
        <h1 className="text-2xl font-semibold tracking-tight md:text-3xl text-white">
          {agreement.title}
        </h1>
        <p className="mt-1 text-sm text-foreground/75">
          {agreement.shortDesc}
        </p>
      </div>
      <div className="hidden items-center gap-2 md:flex text-white/70">
        <FileText className="h-4 w-4" />
        <span className="text-xs font-medium">ID: {agreement.id}</span>
      </div>
    </div>
  );
}

    