
'use client';

import { useEffect } from 'react';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    // dynamically add lucide icons script
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/lucide@latest/dist/umd/lucide.js';
    script.async = true;
    document.body.appendChild(script);

    // after script is loaded, create icons
    script.onload = () => {
      if ((window as any).lucide) {
        (window as any).lucide.createIcons();
      }
    };
    
    return () => {
      // Clean up the script when the component unmounts
      const existingScript = document.querySelector('script[src="https://unpkg.com/lucide@latest/dist/umd/lucide.js"]');
      if (existingScript) {
        document.body.removeChild(existingScript);
      }
    }
  }, []);

  return (
    <div 
      className="font-inter bg-gray-950 min-h-screen flex items-center justify-center antialiased"
      suppressHydrationWarning={true}
    >
      <div 
        className="login-container w-full max-w-md px-6 z-10"
        id="login-container"
      >
        {children}
      </div>
    </div>
  );
}
