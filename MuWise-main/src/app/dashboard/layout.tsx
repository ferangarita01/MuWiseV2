
'use client';

import * as React from 'react';
import { DashboardHeader } from '@/components/dashboard-header';
import { Sidebar, SidebarProvider, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarContent, SidebarHeader, SidebarInset } from '@/components/ui/sidebar';
import { Home, FileText, Settings, Music, CreditCard } from 'lucide-react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';


export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

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
