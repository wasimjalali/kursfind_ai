'use client';

import Link from 'next/link';
import SavedCourseCard from '@/components/student/SavedCourseCard';
import { useStudentLanguage } from '../StudentDashboardClient';

export default function SavedCoursesContent({ savedCourses }) {
  const { labels, lang } = useStudentLanguage();

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {labels.savedCourses.title} ❤️
          </h1>
          <p className="text-gray-600 mt-2">
            {labels.savedCourses.subtitle}
          </p>
        </div>
        <Link
          href="/courses"
          className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-emerald-500 text-white font-semibold rounded-lg hover:shadow-lg transition-shadow"
        >
          {labels.savedCourses.discoverNew}
        </Link>
      </div>

      {/* Stats */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
            <span className="text-2xl">❤️</span>
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">
              {savedCourses?.length || 0}
            </p>
            <p className="text-sm text-gray-600">{labels.savedCourses.title}</p>
          </div>
        </div>
      </div>

      {/* Saved Courses Grid */}
      {savedCourses && savedCourses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedCourses.map((saved) => (
            <SavedCourseCard key={saved.id} saved={saved} />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <div className="text-6xl mb-4">💔</div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            {labels.savedCourses.noSavedCourses}
          </h3>
          <p className="text-gray-600 mb-6">
            {labels.savedCourses.noSavedCoursesDesc}
          </p>
          <Link
            href="/courses"
            className="inline-block px-6 py-3 bg-gradient-to-r from-cyan-500 to-emerald-500 text-white font-semibold rounded-lg hover:shadow-lg transition-shadow"
          >
            {labels.common.discoverCourses}
          </Link>
        </div>
      )}

      {/* Tips Section */}
      {savedCourses && savedCourses.length > 0 && (
        <div className="bg-cyan-50 border border-cyan-200 rounded-xl p-6">
          <h3 className="text-lg font-bold text-cyan-900 mb-3">
            💡 {lang === 'de' ? 'Tipps für gespeicherte Kurse' : 'Tips for Saved Courses'}
          </h3>
          <ul className="space-y-2 text-sm text-cyan-800">
            <li className="flex items-start gap-2">
              <span className="text-cyan-500 mt-0.5">✓</span>
              <span>{lang === 'de' ? 'Fügen Sie Notizen hinzu, um sich wichtige Details zu merken' : 'Add notes to remember important details'}</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-cyan-500 mt-0.5">✓</span>
              <span>{lang === 'de' ? 'Bewerben Sie sich direkt aus Ihrer Favoritenliste' : 'Apply directly from your favorites list'}</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-cyan-500 mt-0.5">✓</span>
              <span>{lang === 'de' ? 'Überprüfen Sie regelmäßig Startdaten und Verfügbarkeit' : 'Regularly check start dates and availability'}</span>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}
