'use client';

import Link from 'next/link';
import { useStudentLanguage } from './StudentDashboardClient';

export default function DashboardContent({ 
  student, 
  savedCount, 
  applicationsCount, 
  recentSaved, 
  recentApplications, 
  latestApplication 
}) {
  const { labels, lang } = useStudentLanguage();

  const getStatusColor = (status) => {
    switch (status) {
      case 'new':
      case 'pending':
        return 'bg-blue-100 text-blue-800';
      case 'contacted':
        return 'bg-yellow-100 text-yellow-800';
      case 'converted':
      case 'accepted':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    const statusLabels = labels.applications?.status || {};
    switch (status) {
      case 'new':
        return statusLabels.new || 'Neu';
      case 'pending':
        return statusLabels.pending || 'Ausstehend';
      case 'contacted':
        return statusLabels.contacted || 'Kontaktiert';
      case 'converted':
      case 'accepted':
        return statusLabels.accepted || 'Angenommen';
      case 'rejected':
        return statusLabels.rejected || 'Abgelehnt';
      default:
        return status || statusLabels.new || 'Neu';
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-cyan-500 to-emerald-500 rounded-2xl p-8 text-white">
        <h1 className="text-2xl md:text-3xl font-bold mb-2 text-center md:text-left px-4 md:px-0">
          {labels.dashboard.greeting}, {student.first_name}! 🎓
        </h1>
        <p className="text-cyan-50 text-base md:text-lg text-center md:text-left px-4 md:px-0">
          {labels.dashboard.subtitle}
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Saved Courses */}
        <Link href="/student/dashboard/saved" className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md hover:scale-105 transition-all duration-200 cursor-pointer block">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">{labels.dashboard.savedCourses}</p>
              <p className="text-3xl font-bold text-gray-900">{savedCount || 0}</p>
            </div>
            <div className="w-12 h-12 bg-cyan-100 rounded-xl flex items-center justify-center">
              <span className="text-2xl">❤️</span>
            </div>
          </div>
          <span className="text-sm text-cyan-600 mt-4 inline-block">
            {labels.common.viewAll}
          </span>
        </Link>

        {/* Applications */}
        <Link href="/student/dashboard/applications" className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md hover:scale-105 transition-all duration-200 cursor-pointer block">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">{labels.dashboard.applications}</p>
              <p className="text-3xl font-bold text-gray-900">{applicationsCount || 0}</p>
            </div>
            <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
              <span className="text-2xl">📝</span>
            </div>
          </div>
          <span className="text-sm text-emerald-600 mt-4 inline-block">
            {labels.common.viewAll}
          </span>
        </Link>

        {/* Latest Status */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md hover:scale-105 transition-all duration-200 cursor-pointer">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">{labels.dashboard.lastStatus}</p>
              {latestApplication ? (
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(latestApplication.status)}`}>
                  {getStatusText(latestApplication.status)}
                </span>
              ) : (
                <p className="text-gray-400 text-sm mt-2">{labels.dashboard.noApplications}</p>
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
        <h2 className="text-xl font-bold text-gray-900 mb-4">{labels.dashboard.quickActions}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href="/courses"
            className="flex items-center space-x-3 p-4 border-2 border-cyan-200 rounded-lg hover:bg-cyan-50 hover:scale-105 transition-all duration-200 group"
          >
            <span className="text-2xl">🔍</span>
            <div>
              <p className="font-semibold text-gray-900 group-hover:text-cyan-600">{labels.dashboard.searchCourses}</p>
              <p className="text-xs text-gray-600">{labels.dashboard.searchCoursesDesc}</p>
            </div>
          </Link>

          <Link
            href="/student/dashboard/saved"
            className="flex items-center space-x-3 p-4 border-2 border-emerald-200 rounded-lg hover:bg-emerald-50 hover:scale-105 transition-all duration-200 group"
          >
            <span className="text-2xl">❤️</span>
            <div>
              <p className="font-semibold text-gray-900 group-hover:text-emerald-600">{labels.dashboard.viewSaved}</p>
              <p className="text-xs text-gray-600">{labels.dashboard.viewSavedDesc}</p>
            </div>
          </Link>

          <Link
            href="/student/dashboard/applications"
            className="flex items-center space-x-3 p-4 border-2 border-purple-200 rounded-lg hover:bg-purple-50 hover:scale-105 transition-all duration-200 group"
          >
            <span className="text-2xl">📝</span>
            <div>
              <p className="font-semibold text-gray-900 group-hover:text-purple-600">{labels.dashboard.viewApplications}</p>
              <p className="text-xs text-gray-600">{labels.dashboard.viewApplicationsDesc}</p>
            </div>
          </Link>
        </div>
      </div>

      {/* Recent Saved Courses */}
      {recentSaved && recentSaved.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-300">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">
              {lang === 'de' ? 'Zuletzt gespeichert' : 'Recently Saved'}
            </h2>
            <Link
              href="/student/dashboard/saved"
              className="text-sm text-cyan-600 hover:text-cyan-700 hover:translate-x-1 transition-transform duration-200"
            >
              {labels.common.viewAll}
            </Link>
          </div>
          <div className="space-y-3">
            {recentSaved.map((saved) => (
              <Link
                key={saved.id}
                href={`/courses/${saved.courses.id}`}
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
                    <span>📅 {new Date(saved.courses.start_date).toLocaleDateString(lang === 'de' ? 'de-DE' : 'en-US')}</span>
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
            <h2 className="text-xl font-bold text-gray-900">
              {lang === 'de' ? 'Letzte Bewerbungen' : 'Recent Applications'}
            </h2>
            <Link
              href="/student/dashboard/applications"
              className="text-sm text-emerald-600 hover:text-emerald-700 hover:translate-x-1 transition-transform duration-200"
            >
              {labels.common.viewAll}
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
                  {lang === 'de' ? 'Eingereicht am' : 'Submitted on'} {new Date(application.created_at).toLocaleDateString(lang === 'de' ? 'de-DE' : 'en-US')}
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
            {labels.dashboard.startJourney}
          </h3>
          <p className="text-gray-600 mb-6">
            {labels.dashboard.startJourneyDesc}
          </p>
          <Link
            href="/courses"
            className="inline-block px-6 py-3 bg-gradient-to-r from-cyan-500 to-emerald-500 text-white font-semibold rounded-lg hover:shadow-lg transition-shadow"
          >
            {labels.common.discoverCourses}
          </Link>
        </div>
      )}
    </div>
  );
}
