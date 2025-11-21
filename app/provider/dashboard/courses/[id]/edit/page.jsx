import { getCurrentProvider } from '@/lib/supabase-server';
import { createClient } from '@/lib/supabase-server';
import { redirect, notFound } from 'next/navigation';
import Link from 'next/link';
import EditCourseForm from '@/components/provider/EditCourseForm';

async function getCourse(id, providerId) {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('courses')
    .select('*')
    .eq('id', id)
    .eq('provider_id', providerId)
    .single();
  
  if (error || !data) {
    return null;
  }
  
  return data;
}

export default async function EditCoursePage({ params }) {
  const provider = await getCurrentProvider();
  
  // ADD DEBUG LOGS
  console.log('Edit page - Provider:', provider ? 'Found' : 'NOT FOUND')
  if (provider) {
    console.log('Provider ID:', provider.id)
    console.log('Provider slug:', provider.provider_id)
  }
  
  // DEMO MODE: Use demo provider if not authenticated
  const demoProvider = {
    id: 1,
    provider_id: 'bildungszentrum-koeln',
    company_name: 'Bildungszentrum Köln'
  };
  
  const activeProvider = provider || demoProvider;
  
  console.log('Active Provider:', activeProvider.provider_id || activeProvider.id)

  const { id } = await params;
  
  console.log('Editing course ID:', id)

  // Get course
  const course = await getCourse(id, activeProvider.provider_id || activeProvider.id.toString());

  // ADD DEBUG LOG
  console.log('Edit page - Course:', course ? 'Found' : 'NOT FOUND')
  
  if (!course) {
    console.log('Course not found for id:', id)
    notFound();
  }
  
  // Security check: Ensure this course belongs to this provider
  const courseProviderId = course.provider_id?.toString();
  const currentProviderId = (activeProvider.provider_id || activeProvider.id)?.toString();
  
  if (courseProviderId !== currentProviderId) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Link
            href="/provider/dashboard/courses"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Zurück zu Meine Kurse
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Kurs bearbeiten</h1>
          <p className="text-gray-600 mt-1">Aktualisieren Sie die Kursinformationen</p>
        </div>
        
        <EditCourseForm course={course} />
      </div>
    </div>
  );
}
