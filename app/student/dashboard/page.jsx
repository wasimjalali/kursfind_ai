import { createClient } from '@/lib/supabase-server';
import Link from 'next/link';

export default async function StudentDashboardPage() {
  const supabase = await createClient();
  
  // Get current user
  const { data: { user } } = await supabase.auth.getUser();
  
  // Get student profile or use mock data
  let student = null;
  
  if (user) {
    const { data: studentData } = await supabase
      .from('students')
      .select('*')
      .eq('auth_user_id', user.id)
      .single();
    student = studentData;
  }
  
  // Use mock student data if no real student found
  if (!student) {
    student = {
      id: 1,
      email: 'demo@student.de',
      first_name: 'Demo',
      last_name: 'Student',
      phone: '+49 123 456789'
    };
  }

  // Count saved courses - only count those with valid course references
  const { data: savedCoursesWithCourses } = await supabase
    .from('saved_courses')
    .select('id, course_id')
    .eq('student_id', student.id);

  // Get course IDs and verify they exist
  let savedCount = 0;
  if (savedCoursesWithCourses && savedCoursesWithCourses.length > 0) {
    const courseIds = savedCoursesWithCourses.map(s => s.course_id);
    const { data: existingCourses } = await supabase
      .from('courses')
      .select('id')
      .in('id', courseIds);
    
    // Only count saved courses where the course still exists
    savedCount = existingCourses?.length || 0;
  }

  // Count applications
  const { count: applicationsCount } = await supabase
    .from('applications')
    .select('*', { count: 'exact', head: true })
    .eq('student_id', student.id);

  // Get latest saved courses (last 3) - only those with valid courses
  const { data: savedData } = await supabase
    .from('saved_courses')
    .select('id, saved_at, course_id')
    .eq('student_id', student.id)
    .order('saved_at', { ascending: false });

  let recentSaved = [];
  if (savedData && savedData.length > 0) {
    const courseIds = savedData.map(s => s.course_id);
    const { data: coursesData } = await supabase
      .from('courses')
      .select('id, title, slug, description, start_date, duration')
      .in('id', courseIds);

    // Merge and filter, then take first 3
    if (coursesData) {
      recentSaved = savedData
        .map(saved => ({
          ...saved,
          courses: coursesData.find(c => c.id === saved.course_id)
        }))
        .filter(saved => saved.courses)
        .slice(0, 3);
    }
  }

  // Get latest applications (last 3)
  const { data: recentApplications } = await supabase
    .from('applications')
    .select(`
      *,
      courses (
        id,
        title
      ),
      providers (
        company_name
      )
    `)
    .eq('student_id', student.id)
    .order('created_at', { ascending: false })
    .limit(3);

  // Get latest application status
  const latestApplication = recentApplications?.[0];

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'accepted':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pending':
        return 'Ausstehend';
      case 'accepted':
        return 'Angenommen';
      case 'rejected':
        return 'Abgelehnt';
      default:
        return status;
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-cyan-500 to-emerald-500 rounded-2xl p-8 text-white">
        <h1 className="text-2xl md:text-3xl font-bold mb-2 text-center md:text-left px-4 md:px-0">
          Hallo, {student.first_name}! 🎓
        </h1>
        <p className="text-cyan-50 text-base md:text-lg text-center md:text-left px-4 md:px-0">
          Bereit für Ihre nächste Weiterbildung? Entdecken Sie neue Kurse und verfolgen Sie Ihre Bewerbungen.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Saved Courses */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md hover:scale-105 transition-all duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Gespeicherte Kurse</p>
              <p className="text-3xl font-bold text-gray-900">{savedCount || 0}</p>
            </div>
            <div className="w-12 h-12 bg-cyan-100 rounded-xl flex items-center justify-center">
              <span className="text-2xl">❤️</span>
            </div>
          </div>
          <Link
            href="/student/dashboard/saved"
            className="text-sm text-cyan-600 hover:text-cyan-700 mt-4 inline-block hover:translate-x-1 transition-transform duration-200"
          >
            Alle anzeigen →
          </Link>
        </div>

        {/* Applications */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md hover:scale-105 transition-all duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Bewerbungen</p>
              <p className="text-3xl font-bold text-gray-900">{applicationsCount || 0}</p>
            </div>
            <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
              <span className="text-2xl">📝</span>
            </div>
          </div>
          <Link
            href="/student/dashboard/applications"
            className="text-sm text-emerald-600 hover:text-emerald-700 mt-4 inline-block hover:translate-x-1 transition-transform duration-200"
          >
            Alle anzeigen →
          </Link>
        </div>

        {/* Latest Status */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md hover:scale-105 transition-all duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Letzter Status</p>
              {latestApplication ? (
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(latestApplication.status)}`}>
                  {getStatusText(latestApplication.status)}
                </span>
              ) : (
                <p className="text-gray-400 text-sm mt-2">Keine Bewerbungen</p>
              )}
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <span className="text-2xl">📊</span>
            </div>
          </div>
          {latestApplication && (
            <p className="text-xs text-gray-500 mt-3">
              {latestApplication.courses?.title}
            </p>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-300">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Schnellaktionen</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href="/courses"
            className="flex items-center space-x-3 p-4 border-2 border-cyan-200 rounded-lg hover:bg-cyan-50 hover:scale-105 transition-all duration-200 group"
          >
            <span className="text-2xl">🔍</span>
            <div>
              <p className="font-semibold text-gray-900 group-hover:text-cyan-600">Kurse durchsuchen</p>
              <p className="text-xs text-gray-600">Finden Sie Ihre Weiterbildung</p>
            </div>
          </Link>

          <Link
            href="/student/dashboard/saved"
            className="flex items-center space-x-3 p-4 border-2 border-emerald-200 rounded-lg hover:bg-emerald-50 hover:scale-105 transition-all duration-200 group"
          >
            <span className="text-2xl">❤️</span>
            <div>
              <p className="font-semibold text-gray-900 group-hover:text-emerald-600">Gespeicherte ansehen</p>
              <p className="text-xs text-gray-600">Ihre Favoriten verwalten</p>
            </div>
          </Link>

          <Link
            href="/student/dashboard/applications"
            className="flex items-center space-x-3 p-4 border-2 border-purple-200 rounded-lg hover:bg-purple-50 hover:scale-105 transition-all duration-200 group"
          >
            <span className="text-2xl">📝</span>
            <div>
              <p className="font-semibold text-gray-900 group-hover:text-purple-600">Bewerbungen ansehen</p>
              <p className="text-xs text-gray-600">Status verfolgen</p>
            </div>
          </Link>
        </div>
      </div>

      {/* Recent Saved Courses */}
      {recentSaved && recentSaved.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-300">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">Zuletzt gespeichert</h2>
            <Link
              href="/student/dashboard/saved"
              className="text-sm text-cyan-600 hover:text-cyan-700 hover:translate-x-1 transition-transform duration-200"
            >
              Alle anzeigen →
            </Link>
          </div>
          <div className="space-y-3">
            {recentSaved.map((saved) => (
              <Link
                key={saved.id}
                href={`/kurse/${saved.courses.slug || saved.courses.id}`}
                className="block p-4 border border-gray-200 rounded-lg hover:border-cyan-300 hover:bg-cyan-50/50 hover:shadow-sm transition-all duration-200"
              >
                <h3 className="font-semibold text-gray-900 mb-1">
                  {saved.courses.title}
                </h3>
                <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                  {saved.courses.description}
                </p>
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  {saved.courses.start_date && (
                    <span>📅 {new Date(saved.courses.start_date).toLocaleDateString('de-DE')}</span>
                  )}
                  {saved.courses.duration && (
                    <span>⏱️ {saved.courses.duration}</span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Recent Applications */}
      {recentApplications && recentApplications.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-300">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">Letzte Bewerbungen</h2>
            <Link
              href="/student/dashboard/applications"
              className="text-sm text-emerald-600 hover:text-emerald-700 hover:translate-x-1 transition-transform duration-200"
            >
              Alle anzeigen →
            </Link>
          </div>
          <div className="space-y-3">
            {recentApplications.map((application) => (
              <div
                key={application.id}
                className="p-4 border border-gray-200 rounded-lg hover:border-emerald-300 hover:shadow-sm transition-all duration-200"
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {application.courses?.title}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {application.providers?.company_name}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(application.status)}`}>
                    {getStatusText(application.status)}
                  </span>
                </div>
                <p className="text-xs text-gray-500">
                  Eingereicht am {new Date(application.created_at).toLocaleDateString('de-DE')}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty States */}
      {(!recentSaved || recentSaved.length === 0) && (!recentApplications || recentApplications.length === 0) && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <div className="text-6xl mb-4">🎯</div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            Starten Sie Ihre Weiterbildungsreise
          </h3>
          <p className="text-gray-600 mb-6">
            Durchsuchen Sie Kurse, speichern Sie Ihre Favoriten und bewerben Sie sich für Weiterbildungen.
          </p>
          <Link
            href="/courses"
            className="inline-block px-6 py-3 bg-gradient-to-r from-cyan-500 to-emerald-500 text-white font-semibold rounded-lg hover:shadow-lg transition-shadow"
          >
            Kurse entdecken
          </Link>
        </div>
      )}
    </div>
  );
}
