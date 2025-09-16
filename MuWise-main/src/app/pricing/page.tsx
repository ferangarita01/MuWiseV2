
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Sheet, SheetClose, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Music, Menu, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { PricingCard } from '@/components/pricing-card';

const freePlanFeatures = [
  'Hasta 4 contratos gratis al mes',
  '4 Firmas digitales',
  '4 Invitación para firmar (El invitado debe crear cuenta para firmar)',
  'Soporte por email',
];

const creatorPlanFeatures = [
  'Hasta 30 contratos al mes',
  '30 Firma digitales',
  '30 Invitaciones para Firmar acuerdos sin iniciar sesión.',
  'Integración con Spotify',
  'Soporte prioritario',
];

const proPlanFeatures = [
  '160 Contratos',
  '160 Firma digital avanzada con API',
  'Integración con Spotify',
  'Agente IA Análisis legal',
  'Soporte chat + email',
];

const enterprisePlanFeatures = [
  'Todo del Pro + personalizaciones',
  'Integración API completa',
  'Soporte dedicado 24/7',
  'Consultoría legal incluida',
];

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  const navLinks = [
    { href: "/#caracteristicas", label: "Características" },
    { href: "/#como-funciona", label: "Cómo funciona" },
    { href: "/#testimonios", label: "Testimonios" },
    { href: "/#precios", label: "Precios" },
  ];

  const getPrice = (monthly: number, yearly: number) => {
    return billingCycle === 'monthly' ? `$${monthly}` : `$${yearly}`;
  };
  
  const getPriceSuffix = () => {
    return billingCycle === 'monthly' ? '/mes' : '/año';
  };

  const getPlanId = (baseId: string) => {
    return billingCycle === 'monthly' ? `${baseId}_monthly` : `${baseId}_annual`;
  }

  const plans = {
    free: {
      name: 'Plan Gratis',
      description: 'Ideal para artistas emergentes que empiezan a gestionar sus primeros acuerdos.',
      price: '$0',
      priceSuffix: '/mes',
      features: freePlanFeatures,
      cta: 'Empezar ahora',
      href: '/auth/signup',
      priceId: 'free',
    },
    creator: {
      name: 'Plan Creador',
      description: 'Para artistas y productores que necesitan más flexibilidad y herramientas.',
      price: getPrice(7, 70), // Assuming $70/year
      priceSuffix: getPriceSuffix(),
      features: creatorPlanFeatures,
      cta: 'Elegir Creador',
      href: '/auth/signup',
      featured: true,
      priceId: getPlanId('creator'),
    },
    pro: {
      name: 'Plan Pro',
      description: 'Perfecto para profesionales, bandas y managers que gestionan múltiples proyectos.',
      price: getPrice(15, 150), // Assuming $150/year
      priceSuffix: getPriceSuffix(),
      features: proPlanFeatures,
      cta: 'Elegir Pro',
      href: '/auth/signup',
      priceId: getPlanId('pro'),
    },
    enterprise: {
      name: 'Plan Empresarial',
      description: 'Diseñado para sellos y agencias con necesidades a gran escala.',
      price: 'Custom',
      priceSuffix: '',
      features: enterprisePlanFeatures,
      cta: 'Contactar Ventas',
      href: 'mailto:sales@muwise.com',
      priceId: 'enterprise',
    },
  };

  return (
    <div className="bg-black text-white antialiased">
       <header className="sticky top-0 z-30 backdrop-blur-md bg-black/20 border-b border-white/5">
        <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <Music className="w-6 h-6 text-indigo-400" />
            <span className="text-slate-100 text-lg font-semibold tracking-tight">Muwise</span>
          </Link>
          <nav className="hidden md:flex items-center gap-8 text-sm">
            {navLinks.map(link => (
              <Link key={link.href} href={link.href} className="text-slate-300 hover:text-white transition-colors">{link.label}</Link>
            ))}
          </nav>
           <div className="flex items-center gap-3">
            <Button variant="outline" className="hidden sm:inline-flex h-9 px-4 rounded-md text-slate-200 bg-white/5 hover:bg-white/10 border border-white/10" asChild>
                <Link href="/auth/signin">Iniciar sesión</Link>
            </Button>
             <Button className="inline-flex h-9 px-4 rounded-md text-sm text-white bg-gradient-to-r from-indigo-500 to-cyan-500 hover:from-indigo-400 hover:to-cyan-400 shadow-lg shadow-indigo-600/20" asChild>
                <Link href="/auth/signup">Probar gratis</Link>
            </Button>
            <div className="md:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon"><Menu /></Button>
                </SheetTrigger>
                <SheetContent className="bg-[#0b0f1a] border-white/10">
                   <nav className="flex flex-col gap-6 p-6 text-lg font-medium">
                      {navLinks.map(link => (
                          <SheetClose asChild key={link.href}>
                              <Link href={link.href} className="text-slate-300 hover:text-white transition-colors">{link.label}</Link>
                          </SheetClose>
                      ))}
                  </nav>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </header>

      <main>
        <section className="py-24 bg-black relative overflow-hidden">
          <div className="absolute top-40 left-20 w-96 h-96 bg-indigo-900/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-900/20 rounded-full blur-3xl"></div>
          
          <div className="container mx-auto px-6 relative z-10">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-light tracking-tight mb-4">
                Simple, transparent <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">pricing</span>
              </h2>
              <p className="text-gray-300 text-xl max-w-2xl mx-auto font-extralight">
                Elige el plan perfecto para tus necesidades sin cargos ocultos ni compromisos a largo plazo.
              </p>
            </div>
            
            <div className="flex justify-center items-center mb-12">
              <span className={cn('text-gray-400 mr-3', billingCycle === 'monthly' && 'text-white font-medium')}>Mensual</span>
              <Switch
                checked={billingCycle === 'yearly'}
                onCheckedChange={(checked) => setBillingCycle(checked ? 'yearly' : 'monthly')}
                id="toggle"
              />
              <span className={cn('text-gray-400 ml-3', billingCycle === 'yearly' && 'text-white font-medium')}>Anual <span className="text-xs text-indigo-400">(Ahorra ~17%)</span></span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
              <PricingCard {...plans.free} />
              <PricingCard {...plans.creator} />
              <PricingCard {...plans.pro} />
              <PricingCard {...plans.enterprise} />
            </div>
            
             <div id="comparison" className="mt-24 max-w-5xl mx-auto">
              <h3 className="text-3xl font-light mb-8 text-center">Tabla Comparativa</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr>
                      <th className="py-4 font-normal text-lg">Características</th>
                      <th className="py-4 font-normal text-center">Gratis</th>
                      <th className="py-4 font-normal text-center">Creador</th>
                      <th className="py-4 font-normal text-center">Pro</th>
                      <th className="py-4 font-normal text-center">Empresarial</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-gray-800">
                      <td className="py-3 text-gray-300 font-extralight">Contratos por mes</td>
                      <td className="py-3 text-center">4</td>
                      <td className="py-3 text-center">30</td>
                      <td className="py-3 text-center">160</td>
                      <td className="py-3 text-center">Ilimitados</td>
                    </tr>
                    <tr className="border-b border-gray-800">
                      <td className="py-3 text-gray-300 font-extralight">Firmas digitales</td>
                      <td className="py-3 text-center">4</td>
                      <td className="py-3 text-center">30</td>
                      <td className="py-3 text-center">160</td>
                      <td className="py-3 text-center">Ilimitadas</td>
                    </tr>
                     <tr className="border-b border-gray-800">
                      <td className="py-3 text-gray-300 font-extralight">Firma sin registro de invitado</td>
                      <td className="py-3 text-center text-red-500">&ndash;</td>
                      <td className="py-3 text-center text-indigo-400"><Check /></td>
                      <td className="py-3 text-center text-indigo-400"><Check /></td>
                      <td className="py-3 text-center text-indigo-400"><Check /></td>
                    </tr>
                    <tr className="border-b border-gray-800">
                      <td className="py-3 text-gray-300 font-extralight">Integración con Spotify</td>
                      <td className="py-3 text-center text-red-500">&ndash;</td>
                      <td className="py-3 text-center text-indigo-400"><Check /></td>
                      <td className="py-3 text-center text-indigo-400"><Check /></td>
                      <td className="py-3 text-center text-indigo-400"><Check /></td>
                    </tr>
                    <tr className="border-b border-gray-800">
                      <td className="py-3 text-gray-300 font-extralight">Agente IA Análisis legal</td>
                       <td className="py-3 text-center text-red-500">&ndash;</td>
                       <td className="py-3 text-center text-red-500">&ndash;</td>
                      <td className="py-3 text-center text-indigo-400"><Check /></td>
                      <td className="py-3 text-center text-indigo-400"><Check /></td>
                    </tr>
                     <tr className="border-b border-gray-800">
                      <td className="py-3 text-gray-300 font-extralight">Integración API</td>
                       <td className="py-3 text-center text-red-500">&ndash;</td>
                       <td className="py-3 text-center text-red-500">&ndash;</td>
                      <td className="py-3 text-center text-indigo-400"><Check /></td>
                      <td className="py-3 text-center text-indigo-400"><Check /></td>
                    </tr>
                    <tr className="border-b border-gray-800">
                      <td className="py-3 text-gray-300 font-extralight">Soporte</td>
                      <td className="py-3 text-center">Email</td>
                      <td className="py-3 text-center">Prioritario</td>
                      <td className="py-3 text-center">Chat + Email</td>
                      <td className="py-3 text-center">Dedicado 24/7</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="mt-24 max-w-3xl mx-auto">
              <h3 className="text-2xl font-light mb-8 text-center">Preguntas Frecuentes</h3>
              <div className="space-y-6">
                <div className="border-b border-gray-800 pb-6">
                  <h4 className="text-lg font-normal mb-2">¿Puedo cambiar de plan más adelante?</h4>
                  <p className="text-gray-400 font-extralight">Sí, puedes mejorar o reducir tu plan en cualquier momento. Los cambios se reflejarán en tu próximo ciclo de facturación.</p>
                </div>
                <div className="border-b border-gray-800 pb-6">
                  <h4 className="text-lg font-normal mb-2">¿Qué métodos de pago aceptan?</h4>
                  <p className="text-gray-400 font-extralight">Aceptamos todas las principales tarjetas de crédito. Para planes anuales empresariales, también admitimos transferencias bancarias.</p>
                </div>
                 <div className="border-b border-gray-800 pb-6">
                  <h4 className="text-lg font-normal mb-2">¿Cómo funciona la firma de invitados sin registro?</h4>
                  <p className="text-gray-400 font-extralight">En los planes Creador y superiores, puedes enviar un enlace de firma único a los colaboradores. Podrán firmar el documento directamente desde su correo electrónico sin necesidad de crear una cuenta en Muwise, agilizando el proceso.</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
