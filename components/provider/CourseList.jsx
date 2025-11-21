'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function CourseList({ initialCourses }) {
  const router = useRouter();
  const [courses, setCourses] = useState(initialCourses);
  const [deleting, setDeleting] = useState(null);

  async function handleDelete(courseId) {
    if (!confirm('Möchten Sie diesen Kurs wirklich löschen?')) {
      return;
    }

    setDeleting(courseId);
    try {
      const response = await fetch(`/api/provider/courses?id=${courseId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Fehler beim Löschen');
      }

      // Remove from local state
      setCourses(courses.filter(c => c.id !== courseId));
      router.refresh();
    } catch (error) {
      console.error('Error deleting course:', error);
      alert('Fehler beim Löschen des Kurses');
    } finally {
      setDeleting(null);
    }
  }

  if (courses.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Noch keine Kurse</h2>
        <p className="text-gray-600 mb-6">Erstellen Sie Ihren ersten Kurs, um loszulegen.</p>
        <Link
          href="/provider/dashboard/courses/new"
          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-emerald-500 text-white rounded-lg font-semibold hover:shadow-lg transition-all"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Ersten Kurs erstellen
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {courses.map((course) => (
        <div key={course.id} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-lg font-bold text-gray-900">{course.title}</h3>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  course.is_active 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-gray-100 text-gray-700'
                }`}>
                  {course.is_active ? 'Aktiv' : 'Inaktiv'}
                </span>
              </div>
              <p className="text-gray-600 mb-4">{course.description?.substring(0, 150)}...</p>
              
              {/* Funding Types */}
              {course.funding_type && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {course.funding_type.split(',').map((type, index) => (
                    <span 
                      key={index}
                      className="px-3 py-1 bg-cyan-50 text-cyan-700 rounded-full text-xs font-semibold"
                    >
                      {type.trim()}
                    </span>
                  ))}
                </div>
              )}

              {/* Benefits */}
              {course.benefits && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {course.benefits.split(',').map((benefit, index) => (
                    <span 
                      key={index}
                      className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-semibold flex items-center gap-1"
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {benefit.trim()}
                    </span>
                  ))}
                </div>
              )}

              <div className="flex items-center gap-6 text-sm text-gray-600">
                <span className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  {course.views_count || 0} Aufrufe
                </span>
                <span className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                  </svg>
                  {course.clicks_count || 0} Klicks
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Link
                href={`/provider/dashboard/courses/${course.id}/edit`}
                className="px-4 py-2 text-cyan-600 hover:bg-cyan-50 rounded-lg font-semibold"
              >
                Bearbeiten
              </Link>
              <button
                onClick={() => handleDelete(course.id)}
                disabled={deleting === course.id}
                className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg font-semibold disabled:opacity-50"
              >
                {deleting === course.id ? 'Wird gelöscht...' : 'Löschen'}
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
