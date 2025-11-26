import { getCurrentProvider } from '@/lib/supabase-server';
import { createClient } from '@/lib/supabase-server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import CoursesClient from './CoursesClient';

async function getProviderCourses(providerId) {
  try {
    const supabase = await createClient();
    
    // Query courses table
    // provider_id in your table is TEXT, so compare as text
    const { data, error } = await supabase
      .from('courses')
      .select('*')
      .eq('provider_id', providerId)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching courses:', error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error('Exception in getProviderCourses:', error);
    return [];
  }
}

export default async function CoursesPage() {
  // Get authenticated provider
  const provider = await getCurrentProvider();
  
  if (!provider) {
    redirect('/provider/login');
  }
  
  // Get courses - use provider.provider_id (the TEXT slug)
  const courses = await getProviderCourses(provider.provider_id || provider.id.toString());
  
  // Calculate stats
  const totalCourses = courses.length;
  const activeCourses = courses.filter(c => c.is_active).length;
  const totalViews = courses.reduce((sum, c) => sum + (c.view_count || 0), 0);
  
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900">Meine Kurse</h1>
            <p className="text-base lg:text-lg text-gray-600 mt-1">Verwalten Sie Ihre Kursangebote</p>
          </div>
          <Link
            href="/provider/dashboard/courses/new"
            className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-emerald-500 text-white rounded-lg font-semibold hover:shadow-lg transition-shadow text-base lg:text-lg"
          >
            + Neuen Kurs hinzufügen
          </Link>
        </div>

        {/* Client Component with interactive functionality */}
        <CoursesClient 
          courses={courses} 
          totalCourses={totalCourses}
          activeCourses={activeCourses}
          totalViews={totalViews}
        />
        
      </div>
    </div>
  );
}
