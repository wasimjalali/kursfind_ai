import { getCurrentProvider } from '@/lib/supabase-server';
import { createClient } from '@/lib/supabase-server';
import Link from 'next/link';
import { redirect } from 'next/navigation';

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

  return (
    <div className="space-y-4 sm:space-y-6 -mt-3 sm:-mt-4">
      {/* Welcome Message - Mobile Optimized */}
      <div className="bg-gradient-to-r from-cyan-500 to-emerald-500 text-white rounded-xl sm:rounded-2xl p-4 sm:p-8 shadow-lg">
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-1 sm:mb-2">
          Willkommen, {provider?.company_name}!
        </h2>
        <p className="text-cyan-50 text-sm sm:text-base lg:text-lg">
          Hier ist eine Übersicht über Ihre Kurse und Performance.
        </p>
      </div>

      {/* Stats Grid - Mobile Optimized 2x2 */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
        
        {/* Total Courses */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 shadow-sm hover:shadow-md transition-all duration-200">
          <div className="flex items-center justify-between mb-2 sm:mb-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-cyan-100 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
          </div>
          <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-1">
            {totalCourses}
          </div>
          <div className="text-xs sm:text-sm text-gray-600">
            Kurse
          </div>
        </div>

        {/* Total Views */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 shadow-sm hover:shadow-md transition-all duration-200">
          <div className="flex items-center justify-between mb-2 sm:mb-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </div>
          </div>
          <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-1">
            {totalViews.toLocaleString()}
          </div>
          <div className="text-xs sm:text-sm text-gray-600">
            Aufrufe
          </div>
        </div>

        {/* Total Clicks */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 shadow-sm hover:shadow-md transition-all duration-200">
          <div className="flex items-center justify-between mb-2 sm:mb-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
              </svg>
            </div>
          </div>
          <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-1">
            {totalClicks.toLocaleString()}
          </div>
          <div className="text-xs sm:text-sm text-gray-600">
            Klicks
          </div>
        </div>

        {/* Active Courses */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 shadow-sm hover:shadow-md transition-all duration-200">
          <div className="flex items-center justify-between mb-2 sm:mb-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-1">
            {activeCourses}
          </div>
          <div className="text-xs sm:text-sm text-gray-600">
            Aktive Kurse
          </div>
        </div>
      </div>

      {/* Recent Courses - Mobile Optimized */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300">
        <div className="p-4 sm:p-6 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <h3 className="text-base sm:text-lg lg:text-xl font-bold text-gray-900">
              Ihre neuesten Kurse
            </h3>
            <Link 
              href="/provider/dashboard/courses/new"
              className="w-full sm:w-auto text-center px-4 py-2 bg-gradient-to-r from-cyan-500 to-emerald-500 text-white rounded-lg font-semibold hover:shadow-lg transition-all duration-200 text-sm"
            >
              + Neuer Kurs
            </Link>
          </div>
        </div>

        {totalCourses === 0 ? (
          <div className="p-8 sm:p-12 text-center">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h4 className="text-base sm:text-lg lg:text-xl font-bold text-gray-900 mb-2">
              Noch keine Kurse
            </h4>
            <p className="text-sm sm:text-base text-gray-600 mb-6">
              Erstellen Sie Ihren ersten Kurs, um loszulegen.
            </p>
            <Link
              href="/provider/dashboard/courses/new"
              className="inline-flex items-center gap-2 px-5 py-2.5 sm:px-6 sm:py-3 bg-gradient-to-r from-cyan-500 to-emerald-500 text-white rounded-lg font-semibold hover:shadow-lg transition-all text-sm sm:text-base"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Ersten Kurs erstellen
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {recentCourses.map((course) => (
              <Link
                key={course.id}
                href={`/provider/dashboard/courses/${course.id}/edit`}
                className="block p-4 sm:p-6 hover:bg-gray-50 transition-all duration-200"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1 sm:mb-2">
                      <h4 className="font-semibold text-sm sm:text-base lg:text-lg text-gray-900 truncate">
                        {course.title}
                      </h4>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold flex-shrink-0 ${
                        (course.is_active === true || course.is_active === 'true')
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-gray-100 text-gray-700'
                      }`}>
                        {(course.is_active === true || course.is_active === 'true') ? 'Aktiv' : 'Inaktiv'}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 sm:gap-4 text-xs sm:text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        {course.view_count || 0}
                      </span>
                      <span className="flex items-center gap-1">
                        <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                        </svg>
                        {course.click_count || 0}
                      </span>
                    </div>
                  </div>
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
