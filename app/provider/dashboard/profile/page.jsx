import { getCurrentProvider } from '@/lib/supabase-server';
import { redirect } from 'next/navigation';
import ProfileForm from '@/components/provider/ProfileForm';

export default async function ProfilePage() {
  const provider = await getCurrentProvider();
  
  // DEMO MODE: Use demo provider if not authenticated
  const demoProvider = {
    id: 1,
    provider_id: 'bildungszentrum-koeln',
    company_name: 'Bildungszentrum Köln',
    contact_name: 'Demo Provider',
    email: 'demo@bildungszentrum-koeln.de',
    phone: '+49 221 123456',
    website: 'https://bildungszentrum-koeln.de',
    description: 'Demo Bildungszentrum für Weiterbildung',
    street: 'Beispielstraße 123',
    city: 'Köln',
    postal_code: '50667',
    logo_url: ''
  };
  
  const activeProvider = provider || demoProvider;

  const initialData = {
    company_name: activeProvider.company_name || '',
    contact_name: activeProvider.contact_name || '',
    email: activeProvider.email || '',
    phone: activeProvider.phone || '',
    website: activeProvider.website || '',
    description: activeProvider.description || '',
    street: activeProvider.street || '',
    city: activeProvider.city || '',
    postal_code: activeProvider.postal_code || '',
    logo_url: activeProvider.logo_url || '',
    certifications: activeProvider.certifications || [],
    faq: activeProvider.faq || [],
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">Profil bearbeiten</h1>
        <p className="text-base lg:text-lg text-gray-600">Verwalten Sie Ihre Unternehmensinformationen</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-8">
        <ProfileForm initialData={initialData} />
      </div>
    </div>
  );
}
