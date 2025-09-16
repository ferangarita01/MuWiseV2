
'use client';

import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';
import Link from 'next/link';
import {
  Music,
  ShieldCheck,
  FolderCog,
  BarChart3,
  Check,
  CreditCard,
  Sparkles,
  Zap,
  Calendar,
  Twitter,
  Github,
  Mail,
  Menu,
} from 'lucide-react';
import { Sheet, SheetClose, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/skeleton';

// Dynamic import for the chart component to ensure it only renders on the client side

const SignaturesChart = dynamic(() => import('@/components/signatures-chart'), {
  ssr: false,
  loading: () => <Skeleton className="h-full w-full" />,
});


const ParallaxBackground = () => {
   const blobARef = useRef<HTMLDivElement>(null);
   const blobBRef = useRef<HTMLDivElement>(null);
   const [isMounted, setIsMounted] = useState(false);

   useEffect(() => {
    setIsMounted(true);
   }, []);

   useEffect(() => {
    if (!isMounted) return;

    const handleScroll = () => {
      const y = window.scrollY;
      
      if (blobARef.current) {
          const t = y * 0.06;
          blobARef.current.style.transform = `translateY(${t}px) rotate(${t * 0.08}deg)`;
      }
      if (blobBRef.current) {
          const t = y * 0.06;
          blobBRef.current.style.transform = `translateY(${t * -0.6}px) rotate(${t * -0.06}deg)`;
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    
    return () => {
        window.removeEventListener('scroll', handleScroll);
    };
  }, [isMounted]);

  return (
     <div className="fixed inset-0 -z-10 pointer-events-none">
      <div ref={blobARef} className="parallax absolute -top-32 -left-20 h-[42rem] w-[42rem] rounded-full blur-3xl opacity-40" style={{background: 'radial-gradient(60% 60% at 50% 50%, #7c3aed 0%, #1e3a8a 40%, transparent 70%)', filter: 'blur(64px)'}}></div>
      <div ref={blobBRef} className="parallax absolute top-24 right-[-8rem] h-[36rem] w-[36rem] rounded-full blur-3xl opacity-40" style={{background: 'radial-gradient(60% 60% at 50% 50%, #06b6d4 0%, #2563eb 45%, transparent 75%)', filter: 'blur(72px)'}}></div>
      <div className="absolute inset-0 opacity-[0.06] [background-image:linear-gradient(to_right,rgba(255,255,255,.12)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,.12)_1px,transparent_1px)] [background-size:56px_56px]"></div>
      <div className="absolute inset-0 opacity-[0.04] mix-blend-overlay" style={{backgroundImage:"url('https://firebasestorage.googleapis.com/v0/b/new-prototype-rmkd6.firebasestorage.app/o/img_bg.avif?alt=media&token=42db5a3d-4c15-4721-8255-b472e3452445')"}} data-ai-hint="music production"></div>
    </div>
  )
}

export default function LandingPage() {
   const navLinks = [
    { href: "#caracteristicas", label: "Características" },
    { href: "#como-funciona", label: "Cómo funciona" },
    { href: "#testimonios", label: "Testimonios" },
    { href: "#precios", label: "Precios" },
  ];

  return (
    <>
      <ParallaxBackground />

      <header className="sticky top-0 z-30 backdrop-blur-md bg-black/20 border-b border-white/5">
        <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
          <Link href="#" className="flex items-center gap-3">
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
        <section className="relative">
          <div className="mx-auto max-w-7xl px-6 pt-20 pb-10 md:pt-28 md:pb-16">
            <div className="mx-auto max-w-3xl text-center">
              <h1 className="text-4xl md:text-6xl font-semibold tracking-tight text-white">
                Firma acuerdos musicales en segundos
              </h1>
              <p className="mt-5 text-base md:text-lg text-slate-300">
                Digitaliza y asegura tus contratos con validez legal. Gestiona regalías, colabora en tiempo real y mantén todo bajo control.
              </p>
              <div className="mt-8 flex items-center justify-center gap-4">
                <Button size="lg" className="bg-gradient-to-r from-indigo-500 to-fuchsia-500 hover:from-indigo-400 hover:to-fuchsia-400" asChild>
                   <Link href="/auth/signup">
                    <Zap className="w-4 h-4 mr-2" /> Empezar ahora
                  </Link>
                </Button>
              </div>
            </div>

            <div className="mt-14 md:mt-16">
              <div className="mx-auto max-w-5xl">
                <div className="relative rounded-xl p-[2px] bg-gradient-to-r from-fuchsia-500 via-indigo-500 to-cyan-500 shadow-2xl shadow-indigo-900/30">
                  <div className="rounded-[0.7rem] bg-[#0c1220]">
                    <div className="p-3 border-b border-white/5 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="h-3 w-3 rounded-full bg-red-400/80"></span>
                        <span className="h-3 w-3 rounded-full bg-yellow-400/80"></span>
                        <span className="h-3 w-3 rounded-full bg-green-400/80"></span>
                      </div>
                      <div className="text-xs text-slate-400">Muwise — Dashboard</div>
                      <div className="w-16"></div>
                    </div>
                    <Image alt="Vista previa del producto" className="w-full rounded-b-[0.7rem] object-cover" width={1920} height={1080} src="https://firebasestorage.googleapis.com/v0/b/new-prototype-rmkd6.firebasestorage.app/o/Muwisehome.png?alt=media&token=9910c928-ae8a-4d3b-9b13-1d623e8f9bdf" data-ai-hint="app dashboard" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="caracteristicas" className="relative py-16 md:py-24">
          <div className="mx-auto max-w-7xl px-6">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-white">Características clave</h2>
              <p className="mt-4 text-slate-300">Todo lo que necesitas para acuerdos claros, rápidos y medibles.</p>
            </div>
            <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
               <Card className="group rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 p-6 transition">
                <div className="flex items-center justify-between">
                  <ShieldCheck className="w-6 h-6 text-indigo-400" />
                  <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">Legal</span>
                </div>
                <h3 className="mt-4 text-lg font-semibold tracking-tight text-white">Firma rápida y segura</h3>
                <p className="mt-2 text-sm text-slate-300">Envío y firma con validez legal y auditoría de eventos.</p>
              </Card>
               <Card className="group rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 p-6 transition">
                <FolderCog className="w-6 h-6 text-cyan-400" />
                <h3 className="mt-4 text-lg font-semibold tracking-tight text-white">Gestión automática</h3>
                <p className="mt-2 text-sm text-slate-300">Plantillas, recordatorios y organización centralizada.</p>
              </Card>
              <Card className="group rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 p-6 transition">
                <Music className="w-6 h-6 text-fuchsia-400" />
                <h3 className="mt-4 text-lg font-semibold tracking-tight text-white">Integración musical</h3>
                <p className="mt-2 text-sm text-slate-300">Conecta con plataformas y catálogos para datos fiables.</p>
              </Card>
              <Card className="group rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 p-6 transition">
                 <div className="flex items-center gap-2">
                  <BarChart3 className="w-6 h-6 text-emerald-400" />
                  <span className="text-xs text-emerald-300/90">Live</span>
                </div>
                <h3 className="mt-4 text-lg font-semibold tracking-tight text-white">Seguimiento y reportes</h3>
                <p className="mt-2 text-sm text-slate-300">Visualiza el estado y el impacto de cada acuerdo.</p>
              </Card>
            </div>
            
             <div className="mt-10 grid lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 rounded-xl border border-white/10 bg-white/5 p-6">
                    <div className="flex items-center justify-between">
                    <div>
                        <h4 className="text-base md:text-lg font-semibold tracking-tight text-white">Actividad de firmas</h4>
                        <p className="text-sm text-slate-400">Últimos 30 días</p>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-300">
                        <span className="inline-flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-indigo-400"></span> Firmas</span>
                        <span className="inline-flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-400"></span> Completadas</span>
                    </div>
                    </div>
                    <div className="mt-4 relative h-56 rounded-lg bg-[#0c1220] border border-white/5 overflow-hidden">
                        <div className="absolute inset-0 p-3">
                           <SignaturesChart />
                        </div>
                    </div>
                </div>
                <div className="rounded-xl border border-white/10 bg-gradient-to-b from-white/5 to-white/[0.03] p-6">
                    <h4 className="text-base md:text-lg font-semibold tracking-tight text-white">Resumen</h4>
                    <div className="mt-4 grid grid-cols-2 gap-4">
                    <div className="rounded-lg bg-white/5 border border-white/10 p-4">
                        <div className="text-xs text-slate-400">Enviados</div>
                        <div className="mt-1 text-2xl font-semibold tracking-tight text-white">124</div>
                    </div>
                    <div className="rounded-lg bg-white/5 border border-white/10 p-4">
                        <div className="text-xs text-slate-400">Firmados</div>
                        <div className="mt-1 text-2xl font-semibold tracking-tight text-white">98</div>
                    </div>
                    <div className="rounded-lg bg-white/5 border border-white/10 p-4">
                        <div className="text-xs text-slate-400">Tiempo medio</div>
                        <div className="mt-1 text-2xl font-semibold tracking-tight text-white">6h</div>
                    </div>
                    <div className="rounded-lg bg-white/5 border border-white/10 p-4">
                        <div className="text-xs text-slate-400">Tasa de éxito</div>
                        <div className="mt-1 text-2xl font-semibold tracking-tight text-white">79%</div>
                    </div>
                    </div>
                </div>
            </div>
          </div>
        </section>
        
        <section id="como-funciona" className="relative py-16 md:py-24">
            <div className="mx-auto max-w-7xl px-6">
                <div className="mx-auto max-w-2xl text-center">
                    <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-white">¿Cómo funciona?</h2>
                    <p className="mt-4 text-slate-300">Tres pasos para cerrar acuerdos sin fricción.</p>
                </div>
                <div className="mt-12 grid gap-6 md:grid-cols-3">
                    <Card className="rounded-xl border border-white/10 bg-white/5 overflow-hidden">
                        <div className="aspect-[16/10] bg-[#0c1220]">
                            <Image className="h-full w-full object-cover" src="https://firebasestorage.googleapis.com/v0/b/new-prototype-rmkd6.firebasestorage.app/o/muwise01.png?alt=media&token=078276a6-1535-42a1-b606-f11b70050e01" alt="Editor" width={1200} height={750} data-ai-hint="code editor" />
                        </div>
                        <div className="p-6">
                            <h3 className="text-lg font-semibold tracking-tight text-white">1. Crea el acuerdo</h3>
                            <p className="mt-2 text-sm text-slate-300">Usa plantillas o sube tu documento. Define roles, splits y vigencias.</p>
                        </div>
                    </Card>
                    <Card className="rounded-xl border border-white/10 bg-white/5 overflow-hidden">
                        <div className="aspect-[16/10] bg-[#0c1220]">
                            <Image className="h-full w-full object-cover" src="https://firebasestorage.googleapis.com/v0/b/new-prototype-rmkd6.firebasestorage.app/o/muwise02.png?alt=media&token=6d59b871-1fc2-4d3e-a4e6-35bd0d478abc" alt="Firma digital" width={1200} height={750} data-ai-hint="digital signature" />
                        </div>
                        <div className="p-6">
                            <h3 className="text-lg font-semibold tracking-tight text-white">2. Firma digitalmente</h3>
                            <p className="mt-2 text-sm text-slate-300">Invita a colaboradores y firma desde cualquier dispositivo.</p>
                        </div>
                    </Card>
                    <Card className="rounded-xl border border-white/10 bg-white/5 overflow-hidden">
                        <div className="aspect-[16/10] bg-[#0c1220]">              
                        <Image className="h-full w-full object-cover" src="https://firebasestorage.googleapis.com/v0/b/new-prototype-rmkd6.firebasestorage.app/o/muwise0.png?alt=media&token=bddbeac0-2cea-47e0-8e7f-e62cb4eb89ff" alt="Compartir" width={1200} height={750} data-ai-hint="sharing document" priority />
                        </div>
                        <div className="p-6">
                            <h3 className="text-lg font-semibold tracking-tight text-white">3. Guarda y comparte</h3>
                            <p className="mt-2 text-sm text-slate-300">Tu acuerdo queda organizado, versionado y listo para auditar.</p>
                        </div>
                    </Card>
                </div>
            </div>
        </section>

        <section id="testimonios" className="relative py-16 md:py-24">
            <div className="mx-auto max-w-6xl px-6">
                <div className="mx-auto max-w-2xl text-center">
                    <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-white">Lo que dicen nuestros usuarios</h2>
                    <p className="mt-4 text-slate-300">Artistas, sellos y managers confían en nosotros.</p>
                </div>
                <div className="mt-12 grid gap-6 md:grid-cols-3">
                    <Card className="rounded-xl border border-white/10 bg-white/5 p-6">
                        <div className="flex items-center gap-3">
                            <Image className="h-10 w-10 rounded-full object-cover" src="https://firebasestorage.googleapis.com/v0/b/new-prototype-rmkd6.firebasestorage.app/o/jarp.png?alt=media&token=2e5a85d1-a68b-4b6c-bf55-e9642823bbee" alt="Avatar de Jarp" width={40} height={40} data-ai-hint="male producer" />
                            <div>
                                <div className="text-sm font-semibold tracking-tight text-white">Jarp "Sin Fallar Una Pista"</div>
                                <div className="text-xs text-slate-400">productor musical</div>
                            </div>
                        </div>
                        <p className="mt-4 text-sm text-slate-300">“Muwise transformó la forma en que gestiono colaboraciones. Es rápido, claro y profesional.”</p>
                    </Card>
                    <Card className="rounded-xl border border-white/10 bg-white/5 p-6">
                        <div className="flex items-center gap-3">
                            <Image className="h-10 w-10 rounded-full object-cover" src="https://firebasestorage.googleapis.com/v0/b/new-prototype-rmkd6.firebasestorage.app/o/jean.png?alt=media&token=0abf7c51-8d81-4acb-8f7f-09ac7e828896" alt="Avatar de DjMuller" width={40} height={40} data-ai-hint="male dj" />
                            <div>
                                <div className="text-sm font-semibold tracking-tight text-white">DjMuller "MagicMusic"</div>
                                <div className="text-xs text-slate-400">Djs & Productor</div>
                            </div>
                        </div>
                        <p className="mt-4 text-sm text-slate-300">“Firmo contratos en y control total de versiones y permisos.”</p>
                    </Card>
                    <Card className="rounded-xl border border-white/10 bg-white/5 p-6">
                         <div className="flex items-center gap-3">
                            <Image className="h-10 w-10 rounded-full object-cover" src="https://firebasestorage.googleapis.com/v0/b/new-prototype-rmkd6.firebasestorage.app/o/Olffer.png?alt=media&token=0331c617-2c9e-4895-912f-f1de67fcf7b7" alt="Avatar de Olffer Angarita" width={40} height={40} data-ai-hint="male manager" />
                            <div>
                                <div className="text-sm font-semibold tracking-tight text-white">Olffer Angarita</div>
                                <div className="text-xs text-slate-400">Legal Manager</div>
                            </div>
                        </div>
                        <p className="mt-4 text-sm text-slate-300">“Manejo todos los contratos de mis artistas en Muwise, Datos claros para decidir rápido.”</p>
                    </Card>
                </div>
            </div>
        </section>

        <section id="precios" className="relative py-16 md:py-24">
            <div className="mx-auto max-w-6xl px-6">
                <div className="rounded-2xl border border-white/10 bg-gradient-to-r from-indigo-500/10 via-fuchsia-500/10 to-cyan-500/10 p-8 md:p-12 overflow-hidden">
                <div className="grid md:grid-cols-2 gap-8 items-center">
                    <div>
                    <h3 className="text-2xl md:text-3xl font-semibold tracking-tight text-white">Tu música, tus reglas, tus contratos.</h3>
                    <p className="mt-3 text-slate-300">Planes flexibles para equipos de cualquier tamaño. Cancela cuando quieras.</p>
                    <div className="mt-6 flex flex-col sm:flex-row gap-3">
                        <Button asChild className="bg-gradient-to-r from-indigo-500 to-cyan-500 hover:from-indigo-400 hover:to-cyan-400">
                             <Link href="/pricing">
                                <CreditCard className="w-4 h-4 mr-2" /> Ver planes
                            </Link>
                        </Button>
                         <Button variant="outline" className="border-white/10 bg-white/5 hover:bg-white/10 text-slate-200" asChild>
                            <Link href="/pricing#comparison">
                                <Sparkles className="w-4 h-4 mr-2" /> Calcular ahorro
                            </Link>
                        </Button>
                    </div>
                    </div>
                    <Card className="rounded-xl border border-white/10 bg-white/5 p-6">
                    <div className="flex items-start justify-between">
                        <div>
                        <div className="text-sm text-slate-400">Desde</div>
                        <div className="text-3xl font-semibold tracking-tight text-white">~$12<span className="text-base text-slate-400">/mes</span></div>
                         <p className="text-xs text-slate-400 mt-1">facturado anualmente ($149/año)</p>
                        </div>
                        <span className="text-xs px-2 py-1 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">-30% anual</span>
                    </div>
                    <ul className="mt-6 space-y-3 text-sm text-slate-300">
                        <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> Contratos ilimitados</li>
                        <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> Firma digital avanzada con API</li>
                        <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> Integraciones completas con Spotify, YouTube, DistroKid</li>
                        <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> Reportes avanzados y exportación</li>
                        <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> Soporte chat + email</li>
                    </ul>
                    </Card>
                </div>
                </div>
            </div>
        </section>
      </main>

       <footer id="cta" className="relative border-t border-white/10">
        <div className="mx-auto max-w-7xl px-6 py-12 md:py-16">
            <div className="grid md:grid-cols-5 gap-8">
            <div className="md:col-span-2">
                <Link href="#" className="flex items-center gap-3">
                <Music className="w-6 h-6 text-indigo-400" />
                <span className="text-slate-100 text-lg font-semibold tracking-tight">Muwise</span>
                </Link>
                <p className="mt-4 text-sm text-slate-400">Gestión de acuerdos musicales simplificada.</p>
                <div className="mt-4 flex items-center gap-3 text-slate-400">
                <Link className="hover:text-white" href="#" aria-label="X"><Twitter className="w-4 h-4" /></Link>
                <Link className="hover:text-white" href="#" aria-label="GitHub"><Github className="w-4 h-4" /></Link>
                <Link className="hover:text-white" href="#" aria-label="Mail"><Mail className="w-4 h-4" /></Link>
                </div>
            </div>
            <div>
                <div className="text-sm font-semibold tracking-tight text-white">Producto</div>
                <ul className="mt-3 space-y-2 text-sm text-slate-300">
                <li><Link className="hover:text-white" href="#caracteristicas">Características</Link></li>
                <li><Link className="hover:text-white" href="#precios">Precios</Link></li>
                <li><Link className="hover:text-white" href="#como-funciona">Guías</Link></li>
                </ul>
            </div>
            <div>
                <div className="text-sm font-semibold tracking-tight text-white">Compañía</div>
                <ul className="mt-3 space-y-2 text-sm text-slate-300">
                <li><Link className="hover:text-white" href="#">Sobre nosotros</Link></li>
                <li><Link className="hover:text-white" href="#">Contacto</Link></li>
                <li><Link className="hover:text-white" href="#">Blog</Link></li>
                </ul>
            </div>
            <div>
                <div className="text-sm font-semibold tracking-tight text-white">Legal</div>
                <ul className="mt-3 space-y-2 text-sm text-slate-300">
                <li><Link className="hover:text-white" href="#">Política de Privacidad</Link></li>
                <li><Link className="hover:text-white" href="#">Términos de Servicio</Link></li>
                </ul>
            </div>
            </div>
            <div className="mt-10 border-t border-white/10 pt-6 text-xs text-slate-500">
            © {new Date().getFullYear()} Muwise. Todos los derechos reservados.
            </div>
        </div>
        </footer>
    </>
  );
}

    