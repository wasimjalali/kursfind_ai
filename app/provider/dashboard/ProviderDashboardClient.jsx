'use client';

import { useState } from 'react';
import ProviderSidebar from '@/components/provider/ProviderSidebar';
import ProviderHeader from '@/components/provider/ProviderHeader';

export default function ProviderDashboardClient({ provider, children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header - Full Width, Sticky */}
      <ProviderHeader provider={provider} sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      
      {/* Sidebar - Overlay, no dark background */}
      <ProviderSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      {/* Main Content - Fixed header offset + 4-5px top padding */}
      <main className="w-full pt-[64px] sm:pt-[78px]">
        <div className="px-4 sm:px-6 pb-4 sm:pb-6">
          {children}
        </div>
      </main>
    </div>
  );
}

