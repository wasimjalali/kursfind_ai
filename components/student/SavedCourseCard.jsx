'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function SavedCourseCard({ saved }) {
  const router = useRouter();
  const [removing, setRemoving] = useState(false);
  const course = saved.courses;

  if (!course) return null;

  const handleRemove = async () => {
    if (!confirm('Möchten Sie diesen Kurs wirklich aus Ihren Favoriten entfernen?')) {
      return;
    }

    setRemoving(true);
    try {
      const response = await fetch('/api/student/saved-courses', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ courseId: course.id }),
      });

      if (response.ok) {
        router.refresh();
      } else {
        alert('Fehler beim Entfernen des Kurses');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Fehler beim Entfernen des Kurses');
    } finally {
      setRemoving(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
      {/* Course Image */}
      {course.image_url && (
        <div className="relative h-48 bg-gradient-to-br from-cyan-100 to-emerald-100">
          <img
            src={course.image_url}
            alt={course.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-3 right-3">
            <button
              onClick={handleRemove}
              disabled={removing}
              className="w-10 h-10 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors disabled:opacity-50"
              title="Aus Favoriten entfernen"
            >
              {removing ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Course Info */}
      <div className="p-5 space-y-3">
        {/* Category Badge */}
        {course.category && (
          <span className="inline-block px-3 py-1 bg-cyan-100 text-cyan-700 text-xs font-semibold rounded-full">
            {course.category}
          </span>
        )}

        {/* Title */}
        <h3 className="text-lg font-bold text-gray-900 line-clamp-2">
          {course.title}
        </h3>

        {/* Description */}
        <p className="text-sm text-gray-600 line-clamp-2">
          {course.description}
        </p>

        {/* Provider */}
        {course.providers && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            <span className="font-medium">{course.providers.company_name}</span>
          </div>
        )}

        {/* Course Details */}
        <div className="flex flex-wrap gap-3 pt-3 border-t border-gray-100">
          {course.location && (
            <div className="flex items-center gap-1 text-xs text-gray-600">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              </svg>
              {course.location}
            </div>
          )}
          {course.duration && (
            <div className="flex items-center gap-1 text-xs text-gray-600">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {course.duration}
            </div>
          )}
          {course.price && (
            <div className="flex items-center gap-1 text-xs font-semibold text-emerald-600">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {course.price}
            </div>
          )}
        </div>

        {/* Saved Date */}
        <p className="text-xs text-gray-500">
          Gespeichert am {new Date(saved.created_at).toLocaleDateString('de-DE')}
        </p>

        {/* Notes */}
        {saved.notes && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <p className="text-xs text-gray-700">
              <span className="font-semibold">Notiz:</span> {saved.notes}
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2 pt-3">
          <Link
            href={`/courses/${course.id}`}
            className="flex-1 py-2 bg-gradient-to-r from-cyan-500 to-emerald-500 text-white text-center font-semibold rounded-lg hover:shadow-lg transition-shadow text-sm"
          >
            Details ansehen
          </Link>
          <button
            onClick={handleRemove}
            disabled={removing}
            className="px-4 py-2 border-2 border-red-500 text-red-500 font-semibold rounded-lg hover:bg-red-50 transition-colors text-sm disabled:opacity-50"
          >
            {removing ? '...' : 'Entfernen'}
          </button>
        </div>
      </div>
    </div>
  );
}
