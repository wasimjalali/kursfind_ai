'use client';

import { useState } from 'react';
import ProviderSidebar from '@/components/provider/ProviderSidebar';
import ProviderHeader from '@/components/provider/ProviderHeader';

export default function ProviderDashboardClient({ provider, children, demoBanner }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header - Full Width, Sticky */}
      <ProviderHeader provider={provider} sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      
      {/* Demo Mode Banner */}
      {demoBanner}
      
      <div className="flex">
        {/* Sidebar - Below Header, Toggleable */}
        <ProviderSidebar isOpen={sidebarOpen} />
        
        {/* Main Content */}
        <main className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-0'}`}>
          <div className="p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

