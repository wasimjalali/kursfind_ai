import { getCurrentProvider, createClient } from '@/lib/supabase-server';
import { redirect } from 'next/navigation';
import ProfileContent from './ProfileContent';

export const dynamic = 'force-dynamic';

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

  // Get FAQs from provider_faqs table (separate from providers table)
  // Try both provider_id (text slug) and id (numeric) since table structure may vary
  const supabase = await createClient();
  let faqs = [];
  
  // First try with provider_id (text slug)
  const { data: faqsBySlug } = await supabase
    .from('provider_faqs')
    .select('id, question, answer, is_active, display_order')
    .eq('provider_id', provider.provider_id)
    .order('display_order', { ascending: true });
  
  if (faqsBySlug && faqsBySlug.length > 0) {
    faqs = faqsBySlug;
  } else {
    // Fallback: try with numeric id
    const { data: faqsById } = await supabase
      .from('provider_faqs')
      .select('id, question, answer, is_active, display_order')
      .eq('provider_id', provider.id)
      .order('display_order', { ascending: true });
    
    if (faqsById) {
      faqs = faqsById;
    }
  }
  
  console.log('[Profile] Provider:', provider.provider_id, 'ID:', provider.id, 'FAQs found:', faqs?.length || 0);

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
    // FAQs from provider_faqs table
    faq: faqs || [],
  };

  return <ProfileContent initialData={initialData} />;
}
