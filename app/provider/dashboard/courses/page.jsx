import { getCurrentProvider } from '@/lib/supabase-server';
import { createClient } from '@/lib/supabase-server';
import { redirect } from 'next/navigation';
import Link from 'next/link';

async function getProviderCourses(providerId) {
  try {
  const supabase = await createClient();
  
  // Query courses table
  // provider_id in your table is TEXT, so compare as text
  const { data, error } = await supabase
    .from('courses')
    .select('*')
    .eq('provider_id', providerId)
      .order('created_at', { ascending: false});
  
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
  
  // DEMO MODE: Use demo provider if not authenticated
  const demoProvider = {
    id: 1,
    provider_id: 'bildungszentrum-koeln',
    company_name: 'Bildungszentrum Köln'
  };
  
  const activeProvider = provider || demoProvider;
  
  // Get courses - use provider.provider_id (the TEXT slug)
  const courses = await getProviderCourses(activeProvider.provider_id || activeProvider.id.toString());
  
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

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <p className="text-sm lg:text-base text-gray-600 mb-2">Gesamt Kurse</p>
            <p className="text-3xl lg:text-4xl font-bold text-gray-900">{totalCourses}</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <p className="text-sm lg:text-base text-gray-600 mb-2">Aktive Kurse</p>
            <p className="text-3xl lg:text-4xl font-bold text-green-600">{activeCourses}</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <p className="text-sm lg:text-base text-gray-600 mb-2">Gesamt Aufrufe</p>
            <p className="text-3xl lg:text-4xl font-bold text-cyan-600">{totalViews}</p>
          </div>
        </div>

        {/* Courses Table or Empty State */}
        {courses.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border p-12 text-center">
            <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            <h3 className="text-xl lg:text-2xl font-semibold text-gray-900 mb-2">Noch keine Kurse</h3>
            <p className="text-base lg:text-lg text-gray-600 mb-6">Erstellen Sie Ihren ersten Kurs, um loszulegen.</p>
            <Link
              href="/provider/dashboard/courses/new"
              className="inline-block px-6 py-3 bg-gradient-to-r from-cyan-500 to-emerald-500 text-white rounded-lg font-semibold text-base lg:text-lg"
            >
              Ersten Kurs erstellen
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs lg:text-sm font-medium text-gray-500 uppercase">Kurs</th>
                  <th className="px-6 py-3 text-left text-xs lg:text-sm font-medium text-gray-500 uppercase">Dauer</th>
                  <th className="px-6 py-3 text-left text-xs lg:text-sm font-medium text-gray-500 uppercase">Ort</th>
                  <th className="px-6 py-3 text-left text-xs lg:text-sm font-medium text-gray-500 uppercase">Start</th>
                  <th className="px-6 py-3 text-left text-xs lg:text-sm font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs lg:text-sm font-medium text-gray-500 uppercase">Aufrufe</th>
                  <th className="px-6 py-3 text-right text-xs lg:text-sm font-medium text-gray-500 uppercase">Aktionen</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {courses.map((course) => (
                  <tr key={course.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {course.image_url ? (
                          <img
                            src={course.image_url}
                            alt={course.title}
                            className="w-16 h-16 object-cover rounded-lg border"
                          />
                        ) : (
                          <div className="w-16 h-16 bg-gray-100 rounded-lg border flex items-center justify-center">
                            <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                          </div>
                        )}
                        <div>
                          <p className="font-medium text-base lg:text-lg text-gray-900">{course.title}</p>
                          <p className="text-sm lg:text-base text-gray-500 line-clamp-1">{course.description}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm lg:text-base text-gray-900">{course.duration || '-'}</td>
                    <td className="px-6 py-4 text-sm lg:text-base text-gray-900">{course.location || '-'}</td>
                    <td className="px-6 py-4 text-sm lg:text-base text-gray-900">
                      {course.start_date ? new Date(course.start_date).toLocaleDateString('de-DE') : '-'}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs lg:text-sm font-medium ${
                        course.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                      }`}>
                        {course.is_active ? 'Aktiv' : 'Inaktiv'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm lg:text-base text-gray-900">{course.view_count || 0}</td>
                    <td className="px-6 py-4 text-right text-sm lg:text-base font-medium">
                      <Link
                        href={`/provider/dashboard/courses/${course.id}/edit`}
                        className="text-cyan-600 hover:text-cyan-700 mr-4"
                      >
                        Bearbeiten
                      </Link>
                      <button className="text-red-600 hover:text-red-700">
                        Löschen
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        
      </div>
    </div>
  );
}
