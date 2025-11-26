import { getCurrentProvider } from '@/lib/supabase-server';
import { redirect } from 'next/navigation';
import ProfileForm from '@/components/provider/ProfileForm';

export default async function ProfilePage() {
  const provider = await getCurrentProvider();
  
  if (!provider) {
    redirect('/provider/login');
  }

  // Parse certifications from comma-separated string to array
  const parseCertifications = (certString) => {
    if (!certString) return [];
    if (Array.isArray(certString)) return certString;
    return certString.split(',').map(c => c.trim()).filter(Boolean);
  };

  const initialData = {
    company_name: provider.company_name || '',
    contact_name: provider.contact_name || '',
    email: provider.email || '',
    phone: provider.phone || '',
    website: provider.website || '',
    description: provider.description || '',
    street: provider.street || '',
    city: provider.city || '',
    postal_code: provider.postal_code || '',
    logo_url: provider.logo_url || '',
    // Database column is "Certification" (singular, capital C), parse as comma-separated string
    certifications: parseCertifications(provider.Certification || provider.certifications),
    faq: provider.faq || [],
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
