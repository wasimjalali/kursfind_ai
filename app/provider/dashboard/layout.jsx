import { getCurrentProvider } from '@/lib/supabase-server';
import ProviderDashboardClient from './ProviderDashboardClient';
import { redirect } from 'next/navigation';

export default async function DashboardLayout({ children }) {
  const provider = await getCurrentProvider();
  
  // DEMO MODE: Bypass authentication temporarily
  const demoProvider = {
    id: 1,
    provider_id: 'bildungszentrum-koeln',
    company_name: 'Bildungszentrum Köln',
    email: 'demo@bildungszentrum-koeln.de',
    contact_name: 'Demo Provider',
    phone: '+49 221 123456'
  };
  
  // Use demo provider if not authenticated
  const activeProvider = provider || demoProvider;
  
  // Comment out redirect for demo
  // if (!provider) {
  //   redirect('/provider/login');
  // }

  const demoBanner = !provider ? (
    <div className="bg-yellow-500 text-white px-6 py-3 text-center font-medium">
      🎭 DEMO MODE - Sie sind als Demo-Provider angemeldet (Bildungszentrum Köln)
    </div>
  ) : null;

  return (
    <ProviderDashboardClient provider={activeProvider} demoBanner={demoBanner}>
      {children}
    </ProviderDashboardClient>
  );
}
