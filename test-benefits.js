const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://hpghtkarkhkiteivpxze.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhwZ2h0a2Fya2hraXRlaXZweHplIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMzOTI1NDIsImV4cCI6MjA3ODk2ODU0Mn0.fHYI3K5EZw_aaAvgbpbJZybK0ljkd7W3scZz1VErOeY'
);

(async () => {
  console.log('Fetching courses with benefits...\n');
  
  const { data, error } = await supabase
    .from('courses')
    .select('id, title, slug, benefits, status')
    .limit(10);
  
  if (error) {
    console.error('Error:', error);
    return;
  }
  
  console.log('Total courses found:', data.length);
  console.log('\n--- Course Benefits Data ---\n');
  
  data.forEach(course => {
    console.log(`ID: ${course.id}`);
    console.log(`Title: ${course.title}`);
    console.log(`Slug: ${course.slug || 'N/A'}`);
    console.log(`Status: ${course.status}`);
    console.log(`Benefits: ${course.benefits || 'NULL/EMPTY'}`);
    console.log('---\n');
  });
})();
