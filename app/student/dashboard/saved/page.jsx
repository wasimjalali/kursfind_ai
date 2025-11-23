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
  let savedCourses = null;
  let savedError = null;

  // Try with foreign key join first
  const { data: savedCoursesData, error: savedCoursesError } = await supabase
    .from('saved_courses')
    .select(`
      id,
      saved_at,
      notes,
      course_id,
      courses!saved_courses_course_id_fkey (
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

  if (savedCoursesError) {
    // If FK join fails, try without FK name
    console.warn('FK join failed, trying without FK name:', savedCoursesError.message);
    const { data: savedCoursesData2, error: savedCoursesError2 } = await supabase
      .from('saved_courses')
      .select(`
        id,
        saved_at,
        notes,
        course_id,
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

    if (savedCoursesError2) {
      // If that also fails, fetch separately
      console.warn('Join failed, fetching separately:', savedCoursesError2.message);
      const { data: savedData, error: savedErr } = await supabase
        .from('saved_courses')
        .select('id, saved_at, notes, course_id')
        .eq('student_id', student.id)
        .order('saved_at', { ascending: false });

      if (!savedErr && savedData && savedData.length > 0) {
        const courseIds = savedData.map(s => s.course_id);
        const { data: coursesData, error: coursesErr } = await supabase
          .from('courses')
          .select(`
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
          `)
          .in('id', courseIds);

        if (!coursesErr && coursesData) {
          // Normalize providers (handle array vs object) and fetch separately if needed
          const coursesWithProviders = await Promise.all(
            coursesData.map(async (course) => {
              // Normalize providers to single object
              let provider = null;
              if (course.providers) {
                provider = Array.isArray(course.providers) ? course.providers[0] : course.providers;
              } else if (course.provider_id) {
                // Fetch provider separately if join failed
                const { data: providerData } = await supabase
                  .from('providers')
                  .select('company_name, city')
                  .eq('provider_id', course.provider_id)
                  .single();
                provider = providerData;
              }
              
              return {
                ...course,
                providers: provider
              };
            })
          );
          
          // Merge saved_courses with courses
          savedCourses = savedData.map(saved => ({
            ...saved,
            courses: coursesWithProviders.find(c => c.id === saved.course_id)
          }));
        } else {
          savedError = coursesErr;
        }
      } else {
        savedCourses = savedData || [];
        savedError = savedErr;
      }
    } else {
      // Normalize providers (handle array vs object)
      savedCourses = savedCoursesData2?.map(saved => ({
        ...saved,
        courses: saved.courses ? {
          ...saved.courses,
          providers: Array.isArray(saved.courses.providers) 
            ? saved.courses.providers[0] 
            : saved.courses.providers
        } : null
      }));
    }
  } else {
    // Normalize providers (handle array vs object)
    savedCourses = savedCoursesData?.map(saved => ({
      ...saved,
      courses: saved.courses ? {
        ...saved.courses,
        providers: Array.isArray(saved.courses.providers) 
          ? saved.courses.providers[0] 
          : saved.courses.providers
      } : null
    }));
  }

  // Debug logging
  console.log('Saved courses query:', {
    student_id: student.id,
    error: savedError,
    count: savedCourses?.length || 0,
    sample: savedCourses?.[0]
  });

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
