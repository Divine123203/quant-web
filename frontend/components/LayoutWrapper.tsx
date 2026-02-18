'use client';

import { usePathname } from 'next/navigation';
import AppSidebar from '@/components/AppSidebar';
import { Activity, Loader2, RefreshCw } from 'lucide-react';

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname === '/login';

  if (isLoginPage) {
    return <>{children}</>;
  }

  return (
    <div className="flex bg-background h-screen overflow-hidden">
      {/* Sidebar Navigation */}
      <AppSidebar />

      {/* Main Content Area */}
      <main className="relative flex-1 overflow-y-auto overflow-x-hidden md:ml-64 bg-background/50 isolate">
        {/* Gradient Background Effect */}
        <div className="fixed inset-0 -z-10 h-full w-full bg-background [background:radial-gradient(125%_125%_at_50%_10%,#000_40%,#63e_100%)] opacity-20 pointer-events-none" />

        <div className="container mx-auto px-4 py-8 md:px-8 max-w-7xl">
          {children}
        </div>

        <footer className="mt-auto py-8 text-center text-sm text-muted-foreground/60 border-t border-white/5">
          <div className="flex flex-col items-center gap-2">
            <p>&copy; 2026 QuantBet AI. System v1.0.0-alpha</p>
            <div className="py-2 px-4 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-500/80 text-xs font-medium max-w-md">
              ⚠ DISCLAIMER: For statistical analysis only. No guarantee of winnings. Not financial advice.
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
