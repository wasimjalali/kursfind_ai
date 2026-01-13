import { getCurrentProvider } from '@/lib/supabase-server';
import { createClient } from '@/lib/supabase-server';
import { redirect } from 'next/navigation';
import DashboardContent from './DashboardContent';

export const dynamic = 'force-dynamic';

export default async function ProviderDashboard() {
  const provider = await getCurrentProvider();
  
  if (!provider) {
    redirect('/provider/login');
  }
  
  const supabase = await createClient();

  // Get stats
  // Use TEXT provider_id for courses query (courses.provider_id is TEXT)
  const { data: courses } = await supabase
    .from('courses')
    .select('id, title, view_count, click_count, is_active, created_at')
    .eq('provider_id', provider.provider_id)
    .order('created_at', { ascending: false });

  const totalCourses = courses?.length || 0;
  const totalViews = courses?.reduce((sum, course) => sum + (course.view_count || 0), 0) || 0;
  const totalClicks = courses?.reduce((sum, course) => sum + (course.click_count || 0), 0) || 0;
  // Handle is_active as both boolean and string (database might store as TEXT 'true'/'false')
  const activeCourses = courses?.filter(c => c.is_active === true || c.is_active === 'true').length || 0;
  
  // Get recent courses for display (limit 5)
  const recentCourses = courses?.slice(0, 5) || [];

  const stats = {
    totalCourses,
    totalViews,
    totalClicks,
    activeCourses,
    recentCourses
  };

  return <DashboardContent provider={provider} courses={courses} stats={stats} />;
}
