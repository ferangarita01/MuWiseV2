
'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { useUnifiedAuth } from '@/hooks/use-unified-auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Zap, ShieldCheck, User, Mail, Lock, Eye, EyeOff, ArrowRight, Loader2, Info, Chrome } from 'lucide-react';


export default function SignUpPage() {
  const { toast } = useToast();
  const { signUp, user, loading, provider } = useUnifiedAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mounted, setMounted] = useState(false);

   useEffect(() => {
    setMounted(true);
  }, []);

   useEffect(() => {
    if (!mounted) return;
    // This is to apply animations after mount
    const floatingElement = document.querySelector('.floating');
    if (floatingElement) {
        (floatingElement as HTMLElement).style.animationDelay = '0s';
    }
  }, [mounted]);

  const handleSuccessfulSignUp = useCallback((user: any) => {
    const pendingToken = localStorage.getItem('pendingSignToken');
    if (pendingToken) {
      localStorage.removeItem('pendingSignToken'); // Clean up immediately
      // Redirect to the user-specific signing page
      router.push(`/sign?token=${pendingToken}`);
    } else {
      // Standard redirect to dashboard
      router.push('/dashboard');
    }
  }, [router]);

  // Redirect if user is already authenticated
  useEffect(() => {
    if (user && !loading) {
      handleSuccessfulSignUp(user);
    }
  }, [user, loading, handleSuccessfulSignUp]);

  if (!mounted) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }
  const handleGoogleSignUp = async () => {
    try {
      // TODO: Implement Google sign-up for unified auth
      toast({ 
        title: 'Coming Soon!', 
        description: `Google sign-up with ${provider} will be available soon.` 
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: 'There was a problem with your Google sign-up attempt.',
      });
      console.error(error);
    }
  };

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || !fullName) {
      toast({
        variant: 'destructive',
        title: 'Missing fields',
        description: 'Please fill in all required fields.',
      });
      return;
    }
     if (password.length < 8) {
      toast({
        variant: 'destructive',
        title: 'Password too short',
        description: 'Password must be at least 8 characters long.',
      });
      return;
    }
    
    setIsSubmitting(true);
    try {
      const result = await signUp(email, password, { name: fullName });
      if (result.success) {
        toast({
          title: 'Account created!',
          description: `Welcome to Muwise! Using ${provider} authentication.`,
        });
        // handleSuccessfulSignUp will be called by the useEffect when user state updates
      } else {
        if (result.error?.includes('already') || result.error?.includes('exists')) {
          toast({
            variant: 'destructive',
            title: 'Email Already Registered',
            description: (
              <>
                An account with this email already exists.{' '}
                <Link href="/auth/signin" className="underline font-bold">
                  Sign in instead
                </Link>
                .
              </>
            ),
          });
        } else {
          toast({
            variant: 'destructive',
            title: 'Sign up failed.',
            description: result.error || 'An unexpected error occurred. Please try again.',
          });
        }
      }
    } catch (error) {
      console.error('Sign up error:', error);
      toast({
        variant: 'destructive',
        title: 'Sign up failed.',
        description: 'An unexpected error occurred. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="text-center mb-8 fade-in floating" style={{ animationDelay: '0.5s' }}>
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl mb-4 shadow-xl glow relative overflow-hidden">
          <Zap className="w-8 h-8 text-white relative z-10" />
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 opacity-20"></div>
        </div>
        <h1 className="text-2xl font-bold text-white tracking-tight mb-1">Create your Muwise Account</h1>
        <p className="text-sm text-gray-300">Join the future of music rights management</p>
         <div className="flex items-center justify-center gap-2 mt-3">
            <div className="security-indicator">
                <ShieldCheck className="w-3 h-3 text-green-400" />
                <span>Start your 14-day free trial</span>
            </div>
            <span className="text-gray-500">•</span>
            <span className="text-purple-400 capitalize text-xs">{provider}</span>
        </div>
      </div>

      <div id="login-box" className="bg-gray-800/95 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/10 p-6 slide-up relative overflow-hidden" style={{ animationDelay: '0.2s' }}>
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/10 via-transparent to-purple-600/10 pointer-events-none"></div>
        
        <form onSubmit={handleEmailSignUp} className="space-y-6 relative z-10 mt-4">
           <div className="space-y-2">
            <Label htmlFor="fullName" className="block text-sm font-medium text-gray-200">Full Name <span className="text-xs text-red-400">*</span></Label>
            <div className="relative">
              <Input
                type="text"
                id="fullName"
                name="fullName"
                required
                className="input-focus w-full px-4 py-3 pl-12 border border-white/10 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all duration-300 bg-gray-700 focus:bg-gray-600 hover:border-white/20 text-white placeholder-gray-300"
                placeholder="Emma Chen"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                autoComplete="name"
              />
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300" />
            </div>
          </div>
          
           <div className="space-y-2">
            <Label htmlFor="email" className="block text-sm font-medium text-gray-200">Email address <span className="text-xs text-red-400">*</span></Label>
            <div className="relative">
              <Input
                type="email"
                id="email"
                name="email"
                required
                className="input-focus w-full px-4 py-3 pl-12 border border-white/10 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all duration-300 bg-gray-700 focus:bg-gray-600 hover:border-white/20 text-white placeholder-gray-300"
                placeholder="emma.chen@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300" />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password">Password <span className="text-xs text-red-400">*</span></Label>
            <div className="relative">
              <Input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                required
                className="input-focus w-full px-4 py-3 pl-12 pr-12 border border-white/10 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all duration-300 bg-gray-700 focus:bg-gray-600 hover:border-white/20 text-white placeholder-gray-300"
                placeholder="8+ characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
              />
               <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300" />
              <button type="button" className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 hover:text-white" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <Button type="submit" className="ripple w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 px-4 rounded-xl font-medium hover:from-indigo-500 hover:to-purple-500 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed" disabled={isSubmitting}>
             {isSubmitting ? <Loader2 className="animate-spin" /> : <>Create Account <ArrowRight className="w-4 h-4" /></>}
          </Button>

           <div className="flex items-center gap-2 text-xs text-gray-300 bg-gray-700/50 p-3 rounded-lg border border-white/10">
            <Info className="w-4 h-4 text-indigo-400 flex-shrink-0" />
            <span>By signing up, you agree to our Terms of Service and Privacy Policy.</span>
          </div>

           <div className="relative">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/10"></div></div>
                <div className="relative flex justify-center text-sm"><span className="px-3 bg-gray-800 text-gray-300 font-medium">Or continue with</span></div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Button type="button" variant="outline" className="ripple flex items-center justify-center px-4 py-3 border border-white/10 rounded-xl hover:bg-gray-700 transition-all duration-200 hover:border-white/10 hover:-translate-y-0.5 hover:shadow-md group">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-gray-200 group-hover:text-white transition-colors"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path><path d="M9 18c-4.51 2-5-2-7-2"></path></svg>
                  <span className="ml-2 text-sm font-medium text-gray-200 group-hover:text-white transition-colors">GitHub</span>
              </Button>
               <Button onClick={handleGoogleSignUp} type="button" variant="outline" className="ripple flex items-center justify-center px-4 py-3 border border-white/10 rounded-xl hover:bg-gray-700 transition-all duration-200 hover:border-white/10 hover:-translate-y-0.5 hover:shadow-md group">
                  <Chrome className="w-5 h-5 text-gray-200 group-hover:text-indigo-400 transition-colors" />
                  <span className="ml-2 text-sm font-medium text-gray-200 group-hover:text-indigo-400 transition-colors">Google</span>
              </Button>
            </div>
        </form>
      </div>

      <div className="text-center mt-6 fade-in" style={{ animationDelay: '0.4s' }}>
        <p className="text-sm text-gray-300">
          Already have an account?{' '}
          <Link href="/auth/signin" className="text-indigo-400 font-medium hover:text-indigo-300 transition-colors hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </>
  );
}
