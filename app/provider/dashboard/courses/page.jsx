import { getCurrentProvider } from '@/lib/supabase-server';
import { createClient } from '@/lib/supabase-server';
import { redirect } from 'next/navigation';
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
    <CoursesClient 
      courses={courses} 
      totalCourses={totalCourses}
      activeCourses={activeCourses}
      totalViews={totalViews}
    />
  );
}
