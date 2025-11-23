const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://hpghtkarkhkiteivpxze.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhwZ2h0a2Fya2hraXRlaXZweHplIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMzOTI1NDIsImV4cCI6MjA3ODk2ODU0Mn0.fHYI3K5EZw_aaAvgbpbJZybK0ljkd7W3scZz1VErOeY'
);

(async () => {
  console.log('=== Testing Saved Courses Setup ===\n');
  
  // 1. Check saved_courses table structure
  console.log('1. Checking saved_courses table...');
  const { data: savedCourses, error: savedError } = await supabase
    .from('saved_courses')
    .select('*')
    .limit(5);
  
  if (savedError) {
    console.error('❌ Error:', savedError.message);
  } else {
    console.log(`✓ Found ${savedCourses.length} saved courses`);
    if (savedCourses.length > 0) {
      console.log('Sample saved course:', JSON.stringify(savedCourses[0], null, 2));
      console.log('Columns:', Object.keys(savedCourses[0]).join(', '));
    }
  }
  
  console.log('\n2. Testing join with courses...');
  const { data: joinedData, error: joinError } = await supabase
    .from('saved_courses')
    .select(`
      id,
      saved_at,
      student_id,
      course_id,
      courses (
        id,
        title,
        slug
      )
    `)
    .limit(1);
  
  if (joinError) {
    console.error('❌ Join error:', joinError.message);
  } else {
    console.log('✓ Join successful');
    if (joinedData && joinedData.length > 0) {
      console.log('Sample:', JSON.stringify(joinedData[0], null, 2));
    } else {
      console.log('No data returned');
    }
  }
  
  console.log('\n3. Checking students table...');
  const { data: students, error: studentsError } = await supabase
    .from('students')
    .select('id, email, first_name, last_name')
    .limit(3);
  
  if (studentsError) {
    console.error('❌ Error:', studentsError.message);
  } else {
    console.log(`✓ Found ${students.length} students`);
    if (students.length > 0) {
      console.log('Sample student:', JSON.stringify(students[0], null, 2));
    }
  }
  
  console.log('\n4. Checking if there are saved courses for student ID 1...');
  const { data: studentSaved, error: studentSavedError } = await supabase
    .from('saved_courses')
    .select('id, course_id, saved_at')
    .eq('student_id', 1);
  
  if (studentSavedError) {
    console.error('❌ Error:', studentSavedError.message);
  } else {
    console.log(`✓ Student 1 has ${studentSaved.length} saved courses`);
    if (studentSaved.length > 0) {
      console.log('Saved courses:', studentSaved);
    }
  }
  
  console.log('\n=== Test Complete ===');
})();
