import { createClient } from '@/lib/supabase-server';
import SavedCoursesContent from './SavedCoursesContent';

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

  // Get all saved courses - fetch separately without FK joins
  let savedCourses = [];
  let savedError = null;

  try {
    // First, get all saved course records for this student
    const { data: savedData, error: savedErr } = await supabase
      .from('saved_courses')
      .select('id, saved_at, notes, course_id')
      .eq('student_id', student.id)
      .order('saved_at', { ascending: false });

    console.log('Saved courses raw data:', { 
      count: savedData?.length, 
      error: savedErr?.message,
      sample: savedData?.[0] 
    });

    if (savedErr) {
      savedError = savedErr;
      console.error('Error fetching saved courses:', savedErr);
    } else if (savedData && savedData.length > 0) {
      // Get all course IDs
      const courseIds = savedData.map(s => s.course_id);
      
      // Fetch all courses separately
      const { data: coursesData, error: coursesErr } = await supabase
        .from('courses')
        .select('id, title, slug, description, category, location, start_date, duration, price, image_url, provider_id')
        .in('id', courseIds);

      console.log('Courses data:', { 
        count: coursesData?.length, 
        error: coursesErr?.message 
      });

      if (!coursesErr && coursesData && coursesData.length > 0) {
        // Get unique provider IDs
        const providerIds = [...new Set(coursesData.map(c => c.provider_id).filter(Boolean))];
        
        // Fetch all providers separately
        const { data: providersData } = await supabase
          .from('providers')
          .select('provider_id, company_name, city')
          .in('provider_id', providerIds);

        console.log('Providers data:', { 
          count: providersData?.length 
        });

        // Create a map of providers by provider_id
        const providersMap = {};
        if (providersData) {
          providersData.forEach(p => {
            providersMap[p.provider_id] = p;
          });
        }

        // Attach provider to each course
        const coursesWithProviders = coursesData.map(course => ({
          ...course,
          providers: providersMap[course.provider_id] || null
        }));

        // Merge saved_courses with courses
        savedCourses = savedData.map(saved => ({
          ...saved,
          courses: coursesWithProviders.find(c => c.id === saved.course_id) || null
        })).filter(saved => saved.courses !== null); // Remove entries where course wasn't found

      } else {
        savedError = coursesErr;
      }
    }
  } catch (error) {
    console.error('Error in saved courses fetch:', error);
    savedError = error;
  }

  // Debug logging
  console.log('Saved courses query:', {
    student_id: student.id,
    error: savedError,
    count: savedCourses?.length || 0,
    sample: savedCourses?.[0]
  });

  return <SavedCoursesContent savedCourses={savedCourses} />;
}
