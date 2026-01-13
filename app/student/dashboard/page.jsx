import { createClient } from '@/lib/supabase-server';
import DashboardContent from './DashboardContent';

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

  return (
    <DashboardContent 
      student={student}
      savedCount={savedCount}
      applicationsCount={applicationsCount}
      recentSaved={recentSaved}
      recentApplications={recentApplications}
      latestApplication={latestApplication}
    />
  );
}
