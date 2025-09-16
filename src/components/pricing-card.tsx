
'use client';

import Link from 'next/link';
import { Button } from './ui/button';
import { Check, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useToast } from './hooks/use-toast';

interface PricingCardProps {
  name: string;
  description: string;
  price: string;
  priceSuffix: string;
  features: string[];
  cta: string;
  href: string;
  featured?: boolean;
  disabled?: boolean;
  priceId: string;
  isRedirecting?: boolean;
  onCtaClick: () => void;
}

export function PricingCard({
  name,
  description,
  price,
  priceSuffix,
  features,
  cta,
  href,
  featured = false,
  disabled = false,
  priceId,
  isRedirecting = false,
  onCtaClick,
}: PricingCardProps) {
  const { loading: authLoading } = useAuth();
  
  const renderButtonContent = () => {
    if (authLoading || isRedirecting) {
      return (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          {isRedirecting ? 'Redirigiendo...' : 'Verificando...'}
        </>
      );
    }
    return cta;
  };

  return (
    <div
      className={cn(
        'bg-gradient-to-br from-gray-900 to-black p-8 rounded-2xl border border-gray-800 hover:border-indigo-500/30 transition-all flex flex-col h-full relative',
        featured && 'border-indigo-500/30 hover:border-indigo-500/60 from-indigo-900/40'
      )}
    >
      {featured && (
        <div className="absolute top-0 right-8 bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-xs font-normal px-3 py-1 rounded-b-md">
          MÁS POPULAR
        </div>
      )}
      <div className="mb-8">
        <h3 className="text-xl font-normal mb-2">{name}</h3>
        <p className="text-gray-400 font-extralight text-sm mb-4 h-12">{description}</p>
        <div className="flex items-baseline">
          <span className="text-4xl font-light">{price}</span>
          <span className="text-gray-400 ml-2 font-extralight">{priceSuffix}</span>
        </div>
      </div>
      <ul className="space-y-3 mb-8 flex-grow">
        {features.map((feature) => (
          <li key={feature} className="flex items-start text-gray-300 font-extralight">
            <Check className="w-5 h-5 mr-2 text-indigo-400 flex-shrink-0 mt-1" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
      <Button
        onClick={onCtaClick}
        disabled={disabled || authLoading || isRedirecting}
        className={cn(
          'w-full bg-transparent border border-gray-700 rounded-md px-6 py-3 hover:bg-white/5 transition-all mt-auto',
          featured && 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-light hover:opacity-90 border-none'
        )}
      >
        {renderButtonContent()}
      </Button>
    </div>
  );
}
