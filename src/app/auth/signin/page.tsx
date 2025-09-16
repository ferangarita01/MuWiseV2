
'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { useUnifiedAuth } from '@/hooks/use-unified-auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Zap, ShieldCheck, Mail, Lock, Eye, EyeOff, Info, ArrowRight, Loader2 } from 'lucide-react';

const GoogleIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 48 48" fill="none" {...props}>
        <path fill="#4285F4" d="M45.12 24.52c0-1.6-.14-3.15-.4-4.62H24v8.69h11.87c-.52 2.8-2.18 5.18-4.81 6.84v5.62h7.22c4.22-3.88 6.65-9.42 6.65-16.53z"></path>
        <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.91-5.79l-7.22-5.62c-2.13 1.44-4.86 2.3-7.69 2.3-5.88 0-10.86-3.98-12.64-9.31H4.09v5.81C8.17 42.66 15.61 48 24 48z"></path>
        <path fill="#FBBC05" d="M11.36 28.69c-.49-1.48-.77-3.05-.77-4.69s.28-3.21.77-4.69v-5.81H4.09C2.82 16.57 2 19.98 2 24c0 4.02.82 7.43 2.09 10.52l7.27-5.83z"></path>
        <path fill="#EA4335" d="M24 9.8c3.52 0 6.62 1.22 9.07 3.55l6.4-6.4C35.91 2.95 30.48 0 24 0 15.61 0 8.17 5.34 4.09 13.5l7.27 5.81c1.78-5.33 6.76-9.31 12.64-9.31z"></path>
    </svg>
);

const AppleIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path d="M12.015,2.2c-2.3,0-4.043,1.355-5.263,2.695C5.39,6.41,5.219,8.23,6.236,10.61c0.528,1.235,1.528,2.395,2.8,3.22 c0.675,0.44,1.459,0.78,2.2,0.78c0.273,0,0.54-0.034,0.799-0.09c0.961-0.23,1.961-0.81,2.8-1.57c-1.583-0.94-2.852-2.37-3.415-3.86 C11.23,8.71,11.021,8.25,11.021,7.775c0-1.845,1.4-3.52,1.434-3.565C12.383,4.28,12.348,4.27,12.314,4.265 c-1.125-0.34-2.312,0.48-2.93,0.48c-1.259,0-2.345-0.965-3.6-0.965c-2.235,0-4.025,1.755-4.025,4.365 c0,2.835,1.995,5.18,4.615,5.18c1.36,0,2.375-0.795,3.39-0.795c0.961,0,2.155,0.795,3.46,0.795 c2.723,0,4.425-2.52,4.425-5.06C18.067,5.55,15.659,2.2,12.015,2.2z M12.597,1.01c1.341-0.07,2.671,0.56,3.481,1.38 C16.653,1.69,15.15,0.56,13.29,0.5c-0.09,0-0.19,0-0.27,0.01C12.19,0.55,12.087,0.57,11.995,0.59 c-1.041,0.22-2.221,0.85-3.111,0.85c-1.285,0-2.585-0.8-4.015-0.8c-1.467,0-2.922,0.88-3.797,2.29c-1.63,2.62-0.89,6.59,1.13,8.88 c0.916,1.04,2.026,1.86,3.456,1.86c1.248,0,2.233-0.74,3.248-0.74c1.13,0,2.07,0.74,3.4,0.74c1.55,0,2.78-0.89,3.67-1.89 c0.67-0.75,1.14-1.65,1.37-2.61c-0.12,0.02-2.58,0.7-5.02-1.15c-1.46-1.1-2.33-2.67-2.73-4.14c-0.04-0.14-0.07-0.29-0.09-0.44 c-0.18-1.2,0.49-2.35,0.61-2.5c0.07-0.09,0.12-0.17,0.15-0.21c0.69-0.93,1.84-1.54,3.02-1.54c0.2,0,0.39,0.02,0.58,0.05 C15.937,2.44,14.437,1.09,12.597,1.01z"></path>
    </svg>
);


function SignInPageComponent() {
  const { toast } = useToast();
  const { signIn, user, loading, provider } = useUnifiedAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  
  useEffect(() => {
    const reason = searchParams.get('reason');
    if (reason === 'guest_sign') {
      setInfo('Por favor, inicia sesión o crea una cuenta para continuar con la firma del documento.');
    }
    const errorParam = searchParams.get('error');
    if (errorParam === 'invalid_token') {
      const message = searchParams.get('message') || 'El enlace de firma no es válido o ha expirado.';
      setError(message);
    }
  }, [searchParams]);

  const handleSuccessfulLogin = useCallback((user: any) => {
    // Check for a pending signing token after successful login
    const pendingToken = localStorage.getItem('pendingSignToken');
    if (pendingToken) {
      localStorage.removeItem('pendingSignToken'); // Clean up immediately
      // Redirect to the user-specific signing page, which requires authentication
      router.push(`/sign?token=${pendingToken}`);
    } else {
      // Standard redirect to dashboard
      router.push('/dashboard');
    }
  }, [router]);

  // Redirect if user is already authenticated
  useEffect(() => {
    if (user && !loading) {
      handleSuccessfulLogin(user);
    }
  }, [user, loading, handleSuccessfulLogin]);

  const handleGoogleSignIn = async () => {
    if (isSubmitting || isGoogleLoading) return;
    setIsGoogleLoading(true);
    setError('');

    try {
      // TODO: Implement Google sign-in for unified auth
      toast({ 
        title: 'Coming Soon!', 
        description: `Google sign-in with ${provider} will be available soon.` 
      });
    } catch (err) {
      console.error('Unexpected error:', err);
      setError('An unexpected error occurred. Please try again.');
      toast({ variant: 'destructive', title: 'Error', description: 'An unexpected error occurred.' });
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast({ variant: 'destructive', title: 'Missing fields', description: 'Please enter both email and password.' });
      return;
    }
    setIsSubmitting(true);
    setError('');
    
    try {
      const result = await signIn(email, password);
      if (result.success) {
        toast({ 
          title: 'Signed in successfully!', 
          description: `Welcome back! Using ${provider} authentication.` 
        });
        // handleSuccessfulLogin will be called by the useEffect when user state updates
      } else {
        toast({ 
          variant: 'destructive', 
          title: 'Sign-in failed.', 
          description: result.error || 'Invalid email or password. Please check your credentials.' 
        });
        setError(result.error || 'Invalid email or password. Please check your credentials.');
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      const description = 'An unexpected error occurred. Please try again.';
      toast({ variant: 'destructive', title: 'Error', description });
      setError(description);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-white tracking-tight mb-1">Muwise</h1>
        <p className="text-sm text-gray-300">Sign in to your workspace</p>
        <div className="flex items-center justify-center gap-2 mt-3 text-xs text-gray-400">
            <ShieldCheck className="w-4 h-4 text-gray-500" />
            <span>Protected Session</span>
            <span className="text-gray-500">•</span>
            <span className="text-purple-400 capitalize">{provider}</span>
        </div>
      </div>

      <div id="login-box" className="bg-[#1C1C2E] rounded-2xl shadow-2xl p-8 border border-white/10">
        {info && (
          <div className="mb-4 p-3 bg-blue-900/50 border border-blue-500/30 rounded-lg text-blue-300 text-sm text-center flex items-center gap-2">
              <Info className="w-4 h-4 flex-shrink-0" />
              <span>{info}</span>
          </div>
        )}
        {error && (
            <div className="mb-4 p-3 bg-red-900/50 border border-red-500/30 rounded-lg text-red-300 text-sm text-center">
                {error}
            </div>
        )}
        <form onSubmit={handleEmailSignIn} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email">Email address <span className="text-red-400">*</span></Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                type="email"
                id="email"
                name="email"
                required
                className="w-full pl-10 pr-4 py-2 bg-[#2a2a3e] border border-[#3e3e5b] rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-white placeholder-gray-400"
                placeholder="emma.chen@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password">Password <span className="text-red-400">*</span></Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                required
                className="w-full pl-10 pr-10 py-2 bg-[#2a2a3e] border border-[#3e3e5b] rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-white placeholder-gray-400"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />
              <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Checkbox id="remember-me" className="w-4 h-4 text-purple-600 bg-gray-700 border-gray-600 rounded focus:ring-purple-500" />
              <Label htmlFor="remember-me" className="ml-2 text-sm text-gray-300 font-normal">Remember me</Label>
            </div>
            <Link href="#" className="text-sm text-purple-400 hover:text-purple-300 hover:underline">
              Forgot password?
            </Link>
          </div>
          
          <Button type="submit" className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-2.5 px-4 rounded-lg font-semibold hover:from-purple-500 hover:to-indigo-500 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed" disabled={isSubmitting || isGoogleLoading}>
            {isSubmitting ? <Loader2 className="animate-spin" /> : <>Sign in securely <ArrowRight className="w-4 h-4" /></>}
          </Button>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-[#3e3e5b]"></div></div>
            <div className="relative flex justify-center text-sm"><span className="px-3 bg-[#1C1C2E] text-gray-400">Or continue with</span></div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Button variant="outline" type="button" onClick={() => toast({ title: 'Coming Soon!', description: 'Apple sign-in will be available in a future update.'})} className="flex items-center justify-center py-2.5 border border-[#3e3e5b] rounded-lg bg-[#2a2a3e] hover:bg-[#3e3e5b] text-white">
              <AppleIcon className="w-5 h-5 mr-2" />
              Apple
            </Button>
            <Button variant="outline" type="button" onClick={handleGoogleSignIn} className="flex items-center justify-center py-2.5 border border-[#3e3e5b] rounded-lg bg-[#2a2a3e] hover:bg-[#3e3e5b] text-white" disabled={isSubmitting || isGoogleLoading}>
               {isGoogleLoading ? <Loader2 className="animate-spin w-5 h-5 mr-2" /> : <GoogleIcon className="w-5 h-5 mr-2" />}
              Google
            </Button>
          </div>
        </form>
      </div>
      
      <div className="text-center mt-8">
        <p className="text-sm text-gray-400">
          Don't have an account?{' '}
          <Link href="/auth/signup" className="text-purple-400 font-medium hover:text-purple-300 hover:underline">
            Start your free trial
          </Link>
        </p>
      </div>
    </>
  );
}

export default function SignInPage() {
  return (
    <Suspense fallback={
        <div className="flex items-center justify-center h-full">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
    }>
      <SignInPageComponent />
    </Suspense>
  );
}
