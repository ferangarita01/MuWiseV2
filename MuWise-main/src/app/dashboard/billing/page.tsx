
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useUserProfile } from '@/hooks/useUserProfile';
import { Loader2, Check } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { PricingCard } from '@/components/pricing-card';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';

// Define all plan details here to match the pricing page
const plans = {
  free: {
    name: 'Plan Gratis',
    description: 'Ideal para artistas emergentes que empiezan a gestionar sus primeros acuerdos.',
    price: '$0',
    priceSuffix: '/mes',
    features: [
      'Hasta 4 contratos gratis al mes',
      '4 Firmas digitales',
      '4 Invitación para firmar (El invitado debe crear cuenta para firmar)',
      'Soporte por email',
    ],
    cta: 'Tu Plan Actual',
    href: '#',
    priceId: 'free', 
  },
  creator: {
    name: 'Plan Creador',
    description: 'Para artistas y productores que necesitan más flexibilidad y herramientas.',
    price: '$7',
    priceSuffix: '/mes',
    features: [
      'Hasta 30 contratos al mes',
      '30 Firma digitales',
      '30 Invitaciones para Firmar acuerdos sin iniciar sesión.',
      'Integración con Spotify',
      'Soporte prioritario',
    ],
    cta: 'Elegir Creador',
    href: '/auth/signup',
    featured: true,
    priceId: 'creator_monthly', 
  },
  pro: {
    name: 'Plan Pro',
    description: 'Perfecto para profesionales, bandas y managers que gestionan múltiples proyectos.',
    price: '$15',
    priceSuffix: '/mes',
    features: [
      '160 Contratos',
      '160 Firma digital avanzada con API',
      'Integración con Spotify',
      'Agente IA Análisis legal',
      'Soporte chat + email',
    ],
    cta: 'Elegir Pro',
    href: '/auth/signup',
    priceId: 'pro_monthly',
  },
  enterprise: {
    name: 'Plan Empresarial',
    description: 'Diseñado para sellos y agencias con necesidades a gran escala.',
    price: 'Custom',
    priceSuffix: '',
    features: [
      'Todo del Pro + personalizaciones',
      'Integración API completa',
      'Soporte dedicado 24/7',
      'Consultoría legal incluida',
    ],
    cta: 'Contactar Ventas',
    href: 'mailto:sales@muwise.com',
    priceId: 'enterprise',
  },
};


export default function BillingPage() {
  const { userProfile, loading: profileLoading } = useUserProfile();
  const [isRedirecting, setIsRedirecting] = useState<string | null>(null);
  const { user, getToken } = useAuth();
  const { toast } = useToast();
  const router = useRouter();


  if (profileLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  const handlePlanClick = async (plan: { cta: string, priceId: string, href: string }) => {
    if (plan.priceId === 'free' || plan.priceId === 'enterprise' || disabled) return;

    if (!user) {
        router.push(plan.href);
        return;
    }
    
    setIsRedirecting(plan.priceId);

    try {
        const idToken = await getToken();
        if (!idToken) throw new Error("Authentication token not available.");

        const response = await fetch('/api/stripe/create-subscription', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${idToken}`,
            },
            body: JSON.stringify({ planId: plan.priceId }),
        });

        const session = await response.json();

        if (!response.ok || !session.url) {
            throw new Error(session.error || 'Failed to create payment session.');
        }

        window.location.href = session.url;

    } catch (error: any) {
        toast({
            variant: 'destructive',
            title: 'Error de Pago',
            description: error.message || 'No se pudo iniciar el proceso de pago. Inténtalo de nuevo.',
        });
        setIsRedirecting(null);
    }
  };

  const currentPriceId = userProfile?.stripePriceId;
  const currentPlanKey = Object.keys(plans).find(key => plans[key as keyof typeof plans].priceId === currentPriceId) || 'free';
  const currentPlan = plans[currentPlanKey as keyof typeof plans];
  const disabled = !!isRedirecting;


  return (
    <div className="space-y-8 p-4 md:p-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Facturación y Planes</h1>
        <p className="text-muted-foreground mt-2">Gestiona tu suscripción, métodos de pago y ve tu historial de facturación.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Tu Plan Actual</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col md:flex-row items-start justify-between gap-4 p-6 bg-secondary/50 rounded-lg">
          <div>
            <div className="flex items-center gap-3">
              <h3 className="text-xl font-semibold">{currentPlan.name}</h3>
              <Badge variant={currentPlanKey !== 'free' ? 'default' : 'outline'}>
                {currentPlanKey !== 'free' ? 'Activo' : 'Gratis'}
              </Badge>
            </div>
            <p className="text-muted-foreground mt-1">{currentPlan.description}</p>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold">{currentPlan.price}<span className="text-lg font-normal text-muted-foreground">{currentPlan.priceSuffix}</span></p>
            {currentPlanKey !== 'free' && (
               <p className="text-xs text-muted-foreground">Se renueva el: 1 de Enero, 2026</p>
            )}
          </div>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <PricingCard 
            {...plans.free}
            cta={currentPlanKey === 'free' ? 'Tu Plan Actual' : 'Cambiar a Gratis'}
            onCtaClick={() => currentPlanKey !== 'free' && alert('La funcionalidad para bajar de plan estará disponible pronto.')}
            disabled={currentPlanKey === 'free'}
          />
           <PricingCard 
            {...plans.creator}
            cta={currentPlanKey === 'creator' ? 'Tu Plan Actual' : 'Mejorar a Creador'}
            onCtaClick={() => handlePlanClick(plans.creator)}
            disabled={currentPlanKey === 'creator' || !!isRedirecting}
            isRedirecting={isRedirecting === 'creator_monthly'}
            featured={true}
          />
           <PricingCard 
            {...plans.pro}
            cta={currentPlanKey === 'pro' ? 'Tu Plan Actual' : 'Mejorar a Pro'}
            onCtaClick={() => handlePlanClick(plans.pro)}
            disabled={currentPlanKey === 'pro' || !!isRedirecting}
            isRedirecting={isRedirecting === 'pro_monthly'}
          />
           <PricingCard 
            {...plans.enterprise}
            onCtaClick={() => window.location.href = plans.enterprise.href}
            cta="Contactar Ventas"
            disabled={!!isRedirecting}
          />
      </div>
    </div>
  );
}
