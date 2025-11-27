import { getCurrentProvider } from '@/lib/supabase-server';
import { createClient } from '@/lib/supabase-server';
import { redirect, notFound } from 'next/navigation';
import Link from 'next/link';
import EditCourseForm from '@/components/provider/EditCourseForm';

export const dynamic = 'force-dynamic';

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
  
  if (!provider) {
    redirect('/provider/login');
  }

  const { id } = await params;

  // Get course
  const course = await getCourse(id, provider.provider_id || provider.id.toString());
  
  if (!course) {
    notFound();
  }
  
  // Security check: Ensure this course belongs to this provider
  const courseProviderId = course.provider_id?.toString();
  const currentProviderId = (provider.provider_id || provider.id)?.toString();
  
  if (courseProviderId !== currentProviderId) {
    notFound();
  }

  return (
    <div className="p-4 sm:p-8 -mx-4 sm:-mx-6">
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
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900">Kurs bearbeiten</h1>
          <p className="text-base lg:text-lg text-gray-600 mt-1">Aktualisieren Sie die Kursinformationen</p>
        </div>
        
        <EditCourseForm course={course} provider={provider} />
      </div>
    </div>
  );
}
