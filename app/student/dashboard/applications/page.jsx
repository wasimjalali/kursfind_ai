'use client'; // Enable client-side animations

import { createClient } from '@/lib/supabase-browser';
import Link from 'next/link';
import { useEffect, useState } from 'react';

// FEATURE FLAG: Enable/disable animations
const ENABLE_ANIMATIONS = true; // Set to false to disable all animations

export default function ApplicationsPage() {
  const [applications, setApplications] = useState([]);
  const [student, setStudent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [animateIn, setAnimateIn] = useState(false);

  useEffect(() => {
    async function loadData() {
      const supabase = createClient();
  
  // Get current user
  const { data: { user } } = await supabase.auth.getUser();
  
  console.log('Student user:', user)
  
  // Get student profile or use mock data
      let studentData = null;
  
  if (user) {
        const { data } = await supabase
      .from('students')
      .select('*')
      .eq('auth_user_id', user.id)
      .single();
        studentData = data;
        console.log('Student data:', studentData)
  }
  
  // Use mock student data if no real student found
      if (!studentData) {
        studentData = {
      id: 1,
      email: 'demo@student.de',
      first_name: 'Demo',
      last_name: 'Student',
    };
  }

      setStudent(studentData);

  // Get all applications
  console.log('Fetching applications for student_id:', studentData.id)
const { data: applicationsData, error: appError } = await supabase
    .from('applications')
    .select('*')
        .eq('student_id', studentData.id)
    .order('applied_at', { ascending: false });
  
  console.log('Applications data:', applicationsData)
  console.log('Applications error:', appError)
  
  // Get course and provider details separately if we have applications
  if (applicationsData && applicationsData.length > 0) {
    const courseIds = [...new Set(applicationsData.map(app => app.course_id).filter(Boolean))]
    const providerIds = [...new Set(applicationsData.map(app => app.provider_id).filter(Boolean))]
    
    const { data: coursesData } = await supabase
      .from('courses')
      .select('id, title, description, category, location, start_date, duration, image_url')
      .in('id', courseIds)
    
    const { data: providersData } = await supabase
      .from('providers')
      .select('id, company_name, email, phone, city')
      .in('id', providerIds)
    
    // Merge data
    applicationsData.forEach(app => {
      app.courses = coursesData?.find(c => c.id === app.course_id)
      app.providers = providersData?.find(p => p.id === app.provider_id)
    })
  }

      setApplications(applicationsData || []);
      setIsLoading(false);
      
      // Trigger entrance animations after data loads
      if (ENABLE_ANIMATIONS) {
        setTimeout(() => setAnimateIn(true), 50);
      } else {
        setAnimateIn(true);
      }
    }

    loadData();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'new':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'contacted':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'converted':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'new':
        return 'Neu';
      case 'contacted':
        return 'Kontaktiert';
      case 'converted':
        return 'Angenommen';
      case 'rejected':
        return 'Abgelehnt';
      default:
        return status;
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'new':
        return '🆕';
      case 'contacted':
        return '📞';
      case 'converted':
        return '✅';
      case 'rejected':
        return '❌';
      default:
        return '📄';
    }
  };

  // Count by status
  const pendingCount = applications?.filter(a => a.status === 'new').length || 0;
  const acceptedCount = applications?.filter(a => a.status === 'converted').length || 0;
  const rejectedCount = applications?.filter(a => a.status === 'rejected').length || 0;

  if (isLoading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Lade Bewerbungen...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
      <style jsx>{`
        /* ═══════════════════════════════════════════════════════════
           ANIMATION STYLES - Applications Dashboard
           Feature Flag: ENABLE_ANIMATIONS
           ═══════════════════════════════════════════════════════════ */

        /* Entrance animation for header - Fade in from top */
        @keyframes slideInFromTop {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Entrance animation for cards - Fade in and scale */
        @keyframes fadeInScale {
          from {
            opacity: 0;
            transform: scale(0.95) translateY(10px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        /* Staggered entrance for list items */
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Pulse animation for status icons */
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.8;
            transform: scale(1.05);
          }
        }

        /* Glow effect for hover states */
        @keyframes glow {
          0%, 100% {
            box-shadow: 0 0 5px rgba(6, 182, 212, 0.3);
          }
          50% {
            box-shadow: 0 0 20px rgba(6, 182, 212, 0.5);
          }
        }

        /* Apply animations when enabled */
        .animate-header {
          animation: slideInFromTop 0.4s ease-out;
        }

        .animate-stat-card {
          animation: fadeInScale 0.5s ease-out;
        }

        .animate-application-card {
          animation: fadeInUp 0.5s ease-out;
        }

        /* Stagger delays for stat cards */
        .animate-stat-card:nth-child(1) { animation-delay: 0.1s; opacity: 0; animation-fill-mode: forwards; }
        .animate-stat-card:nth-child(2) { animation-delay: 0.2s; opacity: 0; animation-fill-mode: forwards; }
        .animate-stat-card:nth-child(3) { animation-delay: 0.3s; opacity: 0; animation-fill-mode: forwards; }
        .animate-stat-card:nth-child(4) { animation-delay: 0.4s; opacity: 0; animation-fill-mode: forwards; }

        /* Stagger delays for application cards */
        .animate-application-card:nth-child(1) { animation-delay: 0.5s; opacity: 0; animation-fill-mode: forwards; }
        .animate-application-card:nth-child(2) { animation-delay: 0.6s; opacity: 0; animation-fill-mode: forwards; }
        .animate-application-card:nth-child(3) { animation-delay: 0.7s; opacity: 0; animation-fill-mode: forwards; }
        .animate-application-card:nth-child(4) { animation-delay: 0.8s; opacity: 0; animation-fill-mode: forwards; }
        .animate-application-card:nth-child(n+5) { animation-delay: 0.9s; opacity: 0; animation-fill-mode: forwards; }

        /* Hover effects for interactive elements */
        .hover-lift {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .hover-lift:hover {
          transform: translateY(-4px) scale(1.01);
          box-shadow: 0 12px 24px -10px rgba(0, 0, 0, 0.15);
        }

        .hover-glow:hover {
          animation: glow 2s ease-in-out infinite;
        }

        /* Status icon pulse */
        .status-icon-pulse {
          animation: pulse 2s ease-in-out infinite;
        }

        /* Button hover effects */
        .btn-hover {
          transition: all 0.2s ease-in-out;
        }

        .btn-hover:hover {
          transform: scale(1.05);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }

        .btn-hover:active {
          transform: scale(0.98);
        }

        /* Reduced motion support - Accessibility */
        @media (prefers-reduced-motion: reduce) {
          .animate-header,
          .animate-stat-card,
          .animate-application-card,
          .hover-lift,
          .status-icon-pulse,
          .btn-hover {
            animation: none !important;
            transition: none !important;
          }
          
          .hover-lift:hover {
            transform: none;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          }
        }
      `}</style>

      {/* Header - Mobile Optimized */}
      <div className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 ${animateIn && ENABLE_ANIMATIONS ? 'animate-header' : ''}`}>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Meine Bewerbungen 📝
          </h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1 sm:mt-2">
            Verwalten und verfolgen Sie Ihre Kursbewerbungen
          </p>
        </div>
        <Link
          href="/courses"
          className="w-full sm:w-auto text-center px-6 py-3 bg-gradient-to-r from-cyan-500 to-emerald-500 text-white font-semibold rounded-lg hover:shadow-lg transition-all btn-hover"
        >
          + Neue Bewerbung
        </Link>
      </div>

      {/* Stats Cards - Mobile Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-6">
        <div className={`bg-white rounded-xl shadow-md border border-gray-100 p-4 sm:p-6 hover-lift ${animateIn && ENABLE_ANIMATIONS ? 'animate-stat-card' : ''}`}>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <p className="text-xs sm:text-sm text-gray-600 mb-1">Gesamt</p>
              <p className="text-2xl sm:text-3xl font-bold text-gray-900">{applications?.length || 0}</p>
            </div>
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <span className="text-xl sm:text-2xl">📝</span>
            </div>
          </div>
        </div>

        <div className={`bg-white rounded-xl shadow-md border border-gray-100 p-4 sm:p-6 hover-lift ${animateIn && ENABLE_ANIMATIONS ? 'animate-stat-card' : ''}`}>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <p className="text-xs sm:text-sm text-gray-600 mb-1">Ausstehend</p>
              <p className="text-2xl sm:text-3xl font-bold text-yellow-600">{pendingCount}</p>
            </div>
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
              <span className="text-xl sm:text-2xl status-icon-pulse">⏳</span>
            </div>
          </div>
        </div>

        <div className={`bg-white rounded-xl shadow-md border border-gray-100 p-4 sm:p-6 hover-lift ${animateIn && ENABLE_ANIMATIONS ? 'animate-stat-card' : ''}`}>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <p className="text-xs sm:text-sm text-gray-600 mb-1">Angenommen</p>
              <p className="text-2xl sm:text-3xl font-bold text-green-600">{acceptedCount}</p>
            </div>
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <span className="text-xl sm:text-2xl">✅</span>
            </div>
          </div>
        </div>

        <div className={`bg-white rounded-xl shadow-md border border-gray-100 p-4 sm:p-6 hover-lift ${animateIn && ENABLE_ANIMATIONS ? 'animate-stat-card' : ''}`}>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <p className="text-xs sm:text-sm text-gray-600 mb-1">Abgelehnt</p>
              <p className="text-2xl sm:text-3xl font-bold text-red-600">{rejectedCount}</p>
            </div>
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-red-100 rounded-xl flex items-center justify-center">
              <span className="text-xl sm:text-2xl">❌</span>
            </div>
          </div>
        </div>
      </div>

      {/* Applications Grid - Card Layout like Saved Courses */}
      {applications && applications.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {applications.map((application, index) => {
            const course = application.courses;
            const provider = application.providers;
            
            return (
              <div
                key={application.id}
                className={`bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow group ${animateIn && ENABLE_ANIMATIONS ? 'animate-application-card' : ''}`}
              >
                {/* Course Image with Status Badge */}
                <div className="relative h-40 sm:h-48 bg-gradient-to-br from-cyan-100 to-emerald-100">
                  {course?.image_url ? (
                    <img
                      src={course.image_url}
                      alt={course.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-5xl">📚</span>
                    </div>
                  )}
                  {/* Status Badge - Top Right */}
                  <div className="absolute top-3 right-3">
                    <span className={`px-3 py-1.5 rounded-full text-xs font-bold shadow-lg ${getStatusColor(application.status)}`}>
                      {getStatusIcon(application.status)} {getStatusText(application.status)}
                    </span>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-4 sm:p-5 space-y-3">
                  {/* Category Badge */}
                  {course?.category && (
                    <span className="inline-block px-3 py-1 bg-cyan-100 text-cyan-700 text-xs font-semibold rounded-full">
                      {course.category}
                    </span>
                  )}

                  {/* Title */}
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 line-clamp-2">
                    {course?.title || 'Kurs nicht gefunden'}
                  </h3>

                  {/* Provider */}
                  {provider && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <span>📍</span>
                      <span className="font-medium">{provider.company_name}</span>
                      {provider.city && <span>• {provider.city}</span>}
                    </div>
                  )}

                  {/* Course Details */}
                  <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-100">
                    {course?.location && (
                      <div className="flex items-center gap-1 text-xs text-gray-600">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        </svg>
                        {course.location}
                      </div>
                    )}
                    {course?.start_date && (
                      <div className="flex items-center gap-1 text-xs text-gray-600">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        Start: {new Date(course.start_date).toLocaleDateString('de-DE')}
                      </div>
                    )}
                  </div>

                  {/* Message Preview */}
                  {application.message && (
                    <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                      <p className="text-xs font-semibold text-gray-700 mb-1">💬 Ihre Nachricht:</p>
                      <p className="text-xs text-gray-600 line-clamp-2">{application.message}</p>
                    </div>
                  )}

                  {/* Dates */}
                  <p className="text-xs text-gray-500">
                    Eingereicht: {application.created_at ? new Date(application.created_at).toLocaleDateString('de-DE') : 'Invalid Date'}
                    {application.updated_at && application.updated_at !== application.created_at && (
                      <span> • Aktualisiert: {new Date(application.updated_at).toLocaleDateString('de-DE')}</span>
                    )}
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="px-4 sm:px-5 pb-4 sm:pb-5">
                  <div className="flex gap-2 pt-3 border-t border-gray-100">
                    <Link
                      href={`/courses/${course?.id}`}
                      className="flex-1 py-2.5 bg-gradient-to-r from-cyan-500 to-emerald-500 text-white text-center font-semibold rounded-lg hover:shadow-lg transition-shadow text-sm"
                    >
                      Kurs ansehen
                    </Link>
                    {provider?.email && (
                      <a
                        href={`mailto:${provider.email}`}
                        className="px-4 py-2.5 border-2 border-gray-300 text-gray-600 font-semibold rounded-lg hover:bg-gray-50 transition-colors text-sm"
                        title="Anbieter kontaktieren"
                      >
                        ✉️
                      </a>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Empty State */
        <div className={`bg-white rounded-xl shadow-md border border-gray-100 p-8 sm:p-12 text-center ${animateIn && ENABLE_ANIMATIONS ? 'animate-stat-card' : ''}`}>
          <div className="text-5xl sm:text-6xl mb-4">📝</div>
          <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">
            Noch keine Bewerbungen
          </h3>
          <p className="text-sm sm:text-base text-gray-600 mb-6">
            Durchsuchen Sie Kurse und bewerben Sie sich für Weiterbildungen
          </p>
          <Link
            href="/courses"
            className="inline-block px-6 py-3 bg-gradient-to-r from-cyan-500 to-emerald-500 text-white font-semibold rounded-lg hover:shadow-lg transition-all btn-hover"
          >
            Kurse durchsuchen
          </Link>
        </div>
      )}
    </div>
  );
}
