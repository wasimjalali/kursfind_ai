import { createClient } from '@/lib/supabase-server';
import Link from 'next/link';
import SavedCourseCard from '@/components/student/SavedCourseCard';

export default async function SavedCoursesPage() {
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

  // Get all saved courses with course details
  const { data: savedCourses } = await supabase
    .from('saved_courses')
    .select(`
      id,
      saved_at,
      notes,
      courses (
        id,
        title,
        slug,
        description,
        category,
        location,
        start_date,
        duration,
        price,
        image_url,
        providers (
          company_name,
          city
        )
      )
    `)
    .eq('student_id', student.id)
    .order('saved_at', { ascending: false });

  const handleRemove = async (savedId) => {
    'use server';
    // This will be handled by client-side component
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Gespeicherte Kurse ❤️
          </h1>
          <p className="text-gray-600 mt-2">
            Ihre Favoriten und interessanten Weiterbildungen
          </p>
        </div>
        <Link
          href="/courses"
          className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-emerald-500 text-white font-semibold rounded-lg hover:shadow-lg transition-shadow"
        >
          + Neue Kurse entdecken
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
            <p className="text-sm text-gray-600">Gespeicherte Kurse</p>
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
            Noch keine gespeicherten Kurse
          </h3>
          <p className="text-gray-600 mb-6">
            Durchsuchen Sie Kurse und speichern Sie Ihre Favoriten mit dem ❤️ Button
          </p>
          <Link
            href="/courses"
            className="inline-block px-6 py-3 bg-gradient-to-r from-cyan-500 to-emerald-500 text-white font-semibold rounded-lg hover:shadow-lg transition-shadow"
          >
            Kurse entdecken
          </Link>
        </div>
      )}

      {/* Tips Section */}
      {savedCourses && savedCourses.length > 0 && (
        <div className="bg-cyan-50 border border-cyan-200 rounded-xl p-6">
          <h3 className="text-lg font-bold text-cyan-900 mb-3">
            💡 Tipps für gespeicherte Kurse
          </h3>
          <ul className="space-y-2 text-sm text-cyan-800">
            <li className="flex items-start gap-2">
              <span className="text-cyan-500 mt-0.5">✓</span>
              <span>Fügen Sie Notizen hinzu, um sich wichtige Details zu merken</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-cyan-500 mt-0.5">✓</span>
              <span>Bewerben Sie sich direkt aus Ihrer Favoritenliste</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-cyan-500 mt-0.5">✓</span>
              <span>Überprüfen Sie regelmäßig Startdaten und Verfügbarkeit</span>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}
