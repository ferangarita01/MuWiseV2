
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
    DialogClose
} from "@/components/ui/dialog"
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Lightbulb, Send } from 'lucide-react';

export function SuggestionDialog() {
    const { toast } = useToast();
    const [comment, setComment] = useState('');

    const handleSubmit = () => {
        if(comment.trim().length > 0) {
            toast({
                title: 'Sugerencia enviada',
                description: '¡Gracias por tu feedback! Lo tendremos en cuenta para futuras actualizaciones.',
            });
            setComment('');
            return true; // Indicate success to close dialog
        } else {
             toast({
                variant: 'destructive',
                title: 'Campo vacío',
                description: 'Por favor, escribe tu sugerencia antes de enviarla.',
            });
            return false; // Indicate failure, don't close
        }
    }
    
    return (
       <Dialog>
            <DialogTrigger asChild>
                <div className="text-right">
                    <button className="px-4 h-10 rounded-md text-sm bg-white text-slate-900 hover:bg-slate-100 transition flex items-center gap-2">
                        <Lightbulb className="h-4 w-4" /> sugiereme algo
                    </button>
                    <p className="text-xs text-slate-400 mt-1">¿qué contrato necesitas en MuWise?</p>
                </div>
            </DialogTrigger>
            <DialogContent aria-describedby="suggestion-dialog-description">
                <DialogHeader>
                    <DialogTitle>Solicita un Contrato</DialogTitle>
                    <DialogDescription id="suggestion-dialog-description">
                        ¿No encuentras la plantilla que necesitas? Dinos qué contrato te gustaría que añadiéramos a nuestra biblioteca.
                    </DialogDescription>
                </DialogHeader>
                <Textarea 
                    placeholder="Describe el tipo de contrato que necesitas, por ejemplo: 'Contrato de licencia para samples' o 'Acuerdo de banda'..." 
                    rows={5}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                />
                <DialogFooter>
                    <DialogClose asChild>
                       <Button type="button" variant="secondary">Cancelar</Button>
                    </DialogClose>
                     <Button onClick={() => {
                        if(handleSubmit()) {
                           // Manually close dialog on success
                           // This is a bit of a workaround because DialogClose closes regardless
                           document.querySelector('[data-radix-dialog-close]')?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
                        }
                     }}>
                        <Send className="mr-2 h-4 w-4" />
                        Enviar sugerencia
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
