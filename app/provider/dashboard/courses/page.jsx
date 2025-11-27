import { getCurrentProvider } from '@/lib/supabase-server';
import { createClient } from '@/lib/supabase-server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import CoursesClient from './CoursesClient';

export const dynamic = 'force-dynamic';

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
  // Handle is_active as both boolean and string (database might store as TEXT 'true'/'false')
  const totalCourses = courses.length;
  const activeCourses = courses.filter(c => c.is_active === true || c.is_active === 'true').length;
  const totalViews = courses.reduce((sum, c) => sum + (c.view_count || 0), 0);
  
  return (
    <div>
      <div className="max-w-7xl mx-auto">
        {/* Header - Mobile Optimized */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">Meine Kurse</h1>
            <p className="text-sm sm:text-base lg:text-lg text-gray-600 mt-1">Verwalten Sie Ihre Kursangebote</p>
          </div>
          <Link
            href="/provider/dashboard/courses/new"
            className="w-full sm:w-auto text-center px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-cyan-500 to-emerald-500 text-white rounded-lg font-semibold hover:shadow-lg transition-shadow text-sm sm:text-base"
          >
            + Neuen Kurs
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
