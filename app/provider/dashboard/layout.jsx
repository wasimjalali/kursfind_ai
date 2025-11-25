import { getCurrentProvider } from '@/lib/supabase-server';
import ProviderDashboardClient from './ProviderDashboardClient';
import { redirect } from 'next/navigation';

export default async function DashboardLayout({ children }) {
  const provider = await getCurrentProvider();
  
  if (!provider) {
    redirect('/provider/login');
  }

  return (
    <ProviderDashboardClient provider={provider}>
      {children}
    </ProviderDashboardClient>
  );
}
