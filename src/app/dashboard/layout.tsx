
'use client';

import * as React from 'react';
import { DashboardHeader } from '@/components/dashboard-header';
import { Sidebar, SidebarProvider, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarContent, SidebarHeader, SidebarInset } from '@/components/ui/sidebar';
import { Home, FileText, Settings, Music, CreditCard, Loader2 } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useUnifiedAuth } from '@/hooks/use-unified-auth';
import { useEffect } from 'react';


export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading } = useUnifiedAuth();

  // Redirect to signin if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/signin');
    }
  }, [user, loading, router]);

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render dashboard if not authenticated
  if (!user) {
    return null;
  }

  const menuItems = [
    { href: '/dashboard', label: 'Home', icon: Home },
    { href: '/dashboard/agreements', label: 'Agreements', icon: FileText },
    { href: '/dashboard/billing', label: 'Billing', icon: CreditCard },
  ]
  
  return (
    <SidebarProvider>
        <Sidebar collapsible="icon">
          <SidebarContent>
            <SidebarHeader>
                <div className="flex items-center gap-2 p-2 group-data-[collapsible=icon]:justify-center">
                  <Music className="w-6 h-6 text-primary" />
                  <span className="text-lg font-semibold group-data-[collapsible=icon]:hidden">Muwise</span>
                </div>
            </SidebarHeader>
            <SidebarMenu>
              {menuItems.map(item => (
                 <SidebarMenuItem key={item.href}>
                   <Link href={item.href}>
                    <SidebarMenuButton
                      isActive={pathname === item.href}
                      tooltip={item.label}
                    >
                      <item.icon />
                      <span>{item.label}</span>
                    </SidebarMenuButton>
                   </Link>
                 </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>
        </Sidebar>
        <SidebarInset>
          <DashboardHeader />
          <main className="flex-1 overflow-y-auto">
             {children}
          </main>
        </SidebarInset>
    </SidebarProvider>
  );
}
