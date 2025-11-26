'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function CoursesClient({ courses: initialCourses, totalCourses, activeCourses, totalViews }) {
  const router = useRouter();
  const [courses, setCourses] = useState(initialCourses);
  const [deletingId, setDeletingId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState(null);

  const handleDeleteClick = (course) => {
    setCourseToDelete(course);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!courseToDelete) return;
    
    setDeletingId(courseToDelete.id);
    
    try {
      const response = await fetch(`/api/provider/courses?id=${courseToDelete.id}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Fehler beim Löschen');
      }

      // Remove course from local state
      setCourses(prev => prev.filter(c => c.id !== courseToDelete.id));
      
      // Refresh the page to update stats
      router.refresh();
      
    } catch (error) {
      console.error('Error deleting course:', error);
      alert(error.message || 'Fehler beim Löschen des Kurses');
    } finally {
      setDeletingId(null);
      setShowDeleteModal(false);
      setCourseToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
    setCourseToDelete(null);
  };

  return (
    <>
      {/* Stats Cards - Mobile Optimized */}
      <div className="grid grid-cols-3 gap-3 sm:gap-6 mb-6">
        <div className="bg-white rounded-xl shadow-sm border p-3 sm:p-6">
          <p className="text-xs sm:text-sm text-gray-600 mb-1 sm:mb-2">Gesamt</p>
          <p className="text-xl sm:text-3xl lg:text-4xl font-bold text-gray-900">{courses.length}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border p-3 sm:p-6">
          <p className="text-xs sm:text-sm text-gray-600 mb-1 sm:mb-2">Aktiv</p>
          <p className="text-xl sm:text-3xl lg:text-4xl font-bold text-green-600">
            {courses.filter(c => c.is_active === true || c.is_active === 'true').length}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border p-3 sm:p-6">
          <p className="text-xs sm:text-sm text-gray-600 mb-1 sm:mb-2">Aufrufe</p>
          <p className="text-xl sm:text-3xl lg:text-4xl font-bold text-cyan-600">
            {courses.reduce((sum, c) => sum + (c.view_count || 0), 0)}
          </p>
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
          {/* Scrollable table container for mobile */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap">Kurs</th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap">Dauer</th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap hidden sm:table-cell">Ort</th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap hidden md:table-cell">Start</th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap hidden md:table-cell">Status</th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap hidden lg:table-cell">Aufrufe</th>
                  <th className="px-4 sm:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase whitespace-nowrap">Aktionen</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {courses.map((course) => (
                  <tr key={course.id} className="hover:bg-gray-50">
                    <td className="px-4 sm:px-6 py-4">
                      <div className="flex items-center gap-2 sm:gap-3">
                        {course.image_url ? (
                          <img
                            src={course.image_url}
                            alt={course.title}
                            className="w-12 h-12 sm:w-16 sm:h-16 object-cover rounded-lg border flex-shrink-0"
                          />
                        ) : (
                          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 rounded-lg border flex items-center justify-center flex-shrink-0">
                            <svg className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                          </div>
                        )}
                        <div className="min-w-0">
                          <p className="font-medium text-sm sm:text-base text-gray-900 line-clamp-2">{course.title}</p>
                          <p className="text-xs sm:text-sm text-gray-500 line-clamp-1 hidden sm:block">{course.description}</p>
                          {/* Show status on mobile inline */}
                          <span className={`inline-block mt-1 md:hidden px-2 py-0.5 rounded-full text-xs font-medium ${
                            (course.is_active === true || course.is_active === 'true') ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                          }`}>
                            {(course.is_active === true || course.is_active === 'true') ? 'Aktiv' : 'Inaktiv'}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 py-4 text-xs sm:text-sm text-gray-900 whitespace-nowrap">{course.duration || '-'}</td>
                    <td className="px-4 sm:px-6 py-4 text-xs sm:text-sm text-gray-900 whitespace-nowrap hidden sm:table-cell">{course.location || '-'}</td>
                    <td className="px-4 sm:px-6 py-4 text-xs sm:text-sm text-gray-900 whitespace-nowrap hidden md:table-cell">
                      {course.start_date ? new Date(course.start_date).toLocaleDateString('de-DE') : '-'}
                    </td>
                    <td className="px-4 sm:px-6 py-4 hidden md:table-cell">
                      <span className={`px-2 sm:px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                        (course.is_active === true || course.is_active === 'true') ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                      }`}>
                        {(course.is_active === true || course.is_active === 'true') ? 'Aktiv' : 'Inaktiv'}
                      </span>
                    </td>
                    <td className="px-4 sm:px-6 py-4 text-xs sm:text-sm text-gray-900 hidden lg:table-cell">{course.view_count || 0}</td>
                    <td className="px-4 sm:px-6 py-4 text-right text-xs sm:text-sm font-medium whitespace-nowrap">
                      <Link
                        href={`/provider/dashboard/courses/${course.id}/edit`}
                        className="text-cyan-600 hover:text-cyan-700 mr-2 sm:mr-4"
                      >
                        ✏️ <span className="hidden sm:inline">Bearbeiten</span>
                      </Link>
                      <button 
                        onClick={() => handleDeleteClick(course)}
                        disabled={deletingId === course.id}
                        className="text-red-600 hover:text-red-700 disabled:opacity-50"
                      >
                        🗑️ <span className="hidden sm:inline">{deletingId === course.id ? 'Löschen...' : 'Löschen'}</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && courseToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Kurs löschen?</h3>
                <p className="text-gray-600 text-sm">Diese Aktion kann nicht rückgängig gemacht werden.</p>
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <p className="font-medium text-gray-900">{courseToDelete.title}</p>
              <p className="text-sm text-gray-500 mt-1">
                {courseToDelete.view_count || 0} Aufrufe • {(courseToDelete.is_active === true || courseToDelete.is_active === 'true') ? 'Aktiv' : 'Inaktiv'}
              </p>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={handleDeleteCancel}
                className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              >
                Abbrechen
              </button>
              <button
                onClick={handleDeleteConfirm}
                disabled={deletingId}
                className="flex-1 px-4 py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {deletingId ? 'Löschen...' : 'Löschen'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

