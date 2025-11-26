import { getCurrentProvider } from '@/lib/supabase-server';
import { createClient } from '@/lib/supabase-server';
import { redirect } from 'next/navigation';

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
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">Analytics</h1>
        <p className="text-base lg:text-lg text-gray-600">Übersicht über Ihre Kurs-Performance</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md hover:scale-105 transition-all duration-200">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-cyan-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </div>
          </div>
          <div className="text-3xl lg:text-4xl font-bold text-gray-900 mb-1">
            {totalViews.toLocaleString()}
          </div>
          <div className="text-sm lg:text-base text-gray-600">Gesamt Aufrufe</div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md hover:scale-105 transition-all duration-200">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
              </svg>
            </div>
          </div>
          <div className="text-3xl lg:text-4xl font-bold text-gray-900 mb-1">
            {totalClicks.toLocaleString()}
          </div>
          <div className="text-sm lg:text-base text-gray-600">Gesamt Klicks</div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md hover:scale-105 transition-all duration-200">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
          </div>
          <div className="text-3xl lg:text-4xl font-bold text-gray-900 mb-1">
            {conversionRate}%
          </div>
          <div className="text-sm lg:text-base text-gray-600">Conversion Rate</div>
        </div>
      </div>

      {/* Top Courses */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow duration-300">
        <h2 className="text-lg lg:text-xl font-bold text-gray-900 mb-4">Top Kurse</h2>
        {courses && courses.length > 0 ? (
          <div className="space-y-4">
            {courses.slice(0, 5).map((course) => (
              <div key={course.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:translate-x-1 hover:shadow-sm transition-all duration-200">
                <div className="flex-1">
                  <h3 className="font-semibold text-base lg:text-lg text-gray-900">{course.title}</h3>
                </div>
                <div className="flex items-center gap-6 text-sm lg:text-base">
                  <div className="text-gray-600">
                    <span className="font-semibold text-gray-900">{course.view_count || 0}</span> Aufrufe
                  </div>
                  <div className="text-gray-600">
                    <span className="font-semibold text-gray-900">{course.click_count || 0}</span> Klicks
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-base lg:text-lg text-gray-600 text-center py-8">Noch keine Daten verfügbar</p>
        )}
      </div>
    </div>
  );
}
