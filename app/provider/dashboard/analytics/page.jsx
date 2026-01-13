import { getCurrentProvider } from '@/lib/supabase-server';
import { createClient } from '@/lib/supabase-server';
import { redirect } from 'next/navigation';
import AnalyticsContent from './AnalyticsContent';

export const dynamic = 'force-dynamic';

export default async function AnalyticsPage() {
  const provider = await getCurrentProvider();
  
  if (!provider) {
    redirect('/provider/login');
  }

  const supabase = await createClient();

  // Get all courses for this provider
  // Use TEXT provider_id for courses query (courses.provider_id is TEXT)
  const { data: courses } = await supabase
    .from('courses')
    .select('id, title, view_count, click_count')
    .eq('provider_id', provider.provider_id)
    .order('view_count', { ascending: false });

  const totalViews = courses?.reduce((sum, course) => sum + (course.view_count || 0), 0) || 0;
  const totalClicks = courses?.reduce((sum, course) => sum + (course.click_count || 0), 0) || 0;
  const conversionRate = totalViews > 0 ? ((totalClicks / totalViews) * 100).toFixed(2) : 0;

  return (
    <AnalyticsContent 
      totalViews={totalViews}
      totalClicks={totalClicks}
      conversionRate={conversionRate}
      courses={courses}
    />
  );
}
