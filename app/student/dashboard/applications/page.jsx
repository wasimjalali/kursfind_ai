import { createClient } from '@/lib/supabase-server';
import Link from 'next/link';

export default async function ApplicationsPage() {
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
    };
  }

  // Get all applications with course and provider details
  const { data: applications } = await supabase
    .from('applications')
    .select(`
      id,
      status,
      created_at,
      updated_at,
      message,
      courses (
        id,
        title,
        description,
        category,
        location,
        start_date,
        duration,
        image_url
      ),
      providers (
        id,
        company_name,
        email,
        phone,
        city
      )
    `)
    .eq('student_id', student.id)
    .order('created_at', { ascending: false });

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'accepted':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
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

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return '⏳';
      case 'accepted':
        return '✅';
      case 'rejected':
        return '❌';
      default:
        return '📄';
    }
  };

  // Count by status
  const pendingCount = applications?.filter(a => a.status === 'pending').length || 0;
  const acceptedCount = applications?.filter(a => a.status === 'accepted').length || 0;
  const rejectedCount = applications?.filter(a => a.status === 'rejected').length || 0;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Meine Bewerbungen 📝
          </h1>
          <p className="text-gray-600 mt-2">
            Verwalten und verfolgen Sie Ihre Kursbewerbungen
          </p>
        </div>
        <Link
          href="/courses"
          className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-emerald-500 text-white font-semibold rounded-lg hover:shadow-lg transition-all duration-200 hover:scale-105"
        >
          + Neue Bewerbung
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-200 hover:scale-[1.02]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Gesamt</p>
              <p className="text-3xl font-bold text-gray-900">{applications?.length || 0}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center transition-transform duration-200 hover:scale-110">
              <span className="text-2xl">📝</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-200 hover:scale-[1.02]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Ausstehend</p>
              <p className="text-3xl font-bold text-yellow-600">{pendingCount}</p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center transition-transform duration-200 hover:scale-110">
              <span className="text-2xl">⏳</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-200 hover:scale-[1.02]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Angenommen</p>
              <p className="text-3xl font-bold text-green-600">{acceptedCount}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center transition-transform duration-200 hover:scale-110">
              <span className="text-2xl">✅</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-200 hover:scale-[1.02]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Abgelehnt</p>
              <p className="text-3xl font-bold text-red-600">{rejectedCount}</p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center transition-transform duration-200 hover:scale-110">
              <span className="text-2xl">❌</span>
            </div>
          </div>
        </div>
      </div>

      {/* Applications List */}
      {applications && applications.length > 0 ? (
        <div className="space-y-4">
          {applications.map((application) => {
            const course = application.courses;
            const provider = application.providers;
            
            return (
              <div
                key={application.id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-all duration-200 hover:scale-[1.01]"
              >
                <div className="flex items-start justify-between gap-6">
                  {/* Course Image */}
                  <div className="flex-shrink-0 overflow-hidden rounded-lg">
                    {course?.image_url ? (
                      <img
                        src={course.image_url}
                        alt={course.title}
                        className="w-32 h-32 rounded-lg object-cover transition-transform duration-300 hover:scale-110"
                      />
                    ) : (
                      <div className="w-32 h-32 rounded-lg bg-gradient-to-br from-cyan-100 to-emerald-100 flex items-center justify-center transition-all duration-300 hover:from-cyan-200 hover:to-emerald-200">
                        <span className="text-4xl">📚</span>
                      </div>
                    )}
                  </div>

                  {/* Application Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-1 hover:text-cyan-600 transition-colors duration-200">
                          {course?.title || 'Kurs nicht gefunden'}
                        </h3>
                        {provider && (
                          <p className="text-sm text-gray-600 hover:text-gray-800 transition-colors duration-200">
                            📍 {provider.company_name} • {provider.city}
                          </p>
                        )}
                      </div>
                      <span className={`px-4 py-2 rounded-full text-sm font-semibold border transition-all duration-200 ${getStatusColor(application.status)}`}>
                        {getStatusIcon(application.status)} {getStatusText(application.status)}
                      </span>
                    </div>

                    {course?.description && (
                      <p className="text-gray-600 mb-3 line-clamp-2">
                        {course.description}
                      </p>
                    )}

                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-3">
                      {course?.category && (
                        <span className="px-3 py-1 bg-cyan-100 text-cyan-700 rounded-full font-semibold">
                          {course.category}
                        </span>
                      )}
                      {course?.location && (
                        <span className="flex items-center gap-1">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          </svg>
                          {course.location}
                        </span>
                      )}
                      {course?.start_date && (
                        <span className="flex items-center gap-1">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          Start: {new Date(course.start_date).toLocaleDateString('de-DE')}
                        </span>
                      )}
                    </div>

                    {application.message && (
                      <div className="bg-gray-50 rounded-lg p-3 mb-3">
                        <p className="text-xs font-semibold text-gray-700 mb-1">💬 Ihre Nachricht:</p>
                        <p className="text-sm text-gray-600">{application.message}</p>
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <div className="text-xs text-gray-400">
                        Eingereicht: {new Date(application.created_at).toLocaleDateString('de-DE', { 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                        {application.updated_at !== application.created_at && (
                          <span className="ml-2">
                            • Aktualisiert: {new Date(application.updated_at).toLocaleDateString('de-DE')}
                          </span>
                        )}
                      </div>

                      <div className="flex gap-2">
                        <Link
                          href={`/courses/${course?.id}`}
                          className="px-4 py-2 text-sm font-semibold text-cyan-600 hover:text-cyan-700 border border-cyan-300 rounded-lg hover:bg-cyan-50 transition-all duration-200 hover:shadow-md"
                        >
                          Kurs ansehen
                        </Link>
                        {provider?.email && (
                          <a
                            href={`mailto:${provider.email}`}
                            className="px-4 py-2 text-sm font-semibold text-gray-600 hover:text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all duration-200 hover:shadow-md"
                          >
                            Anbieter kontaktieren
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Empty State */
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <div className="text-6xl mb-4">📝</div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            Noch keine Bewerbungen
          </h3>
          <p className="text-gray-600 mb-6">
            Durchsuchen Sie Kurse und bewerben Sie sich für Weiterbildungen
          </p>
          <Link
            href="/courses"
            className="inline-block px-6 py-3 bg-gradient-to-r from-cyan-500 to-emerald-500 text-white font-semibold rounded-lg hover:shadow-lg transition-all duration-200 hover:scale-105"
          >
            Kurse durchsuchen
          </Link>
        </div>
      )}
    </div>
  );
}
