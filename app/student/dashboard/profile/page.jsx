import { createClient } from '@/lib/supabase-server';
import ProfileClient from './ProfileClient';

export default async function StudentProfilePage() {
  const supabase = await createClient();
  
  // Get current user
  const { data: { user } } = await supabase.auth.getUser();
  
  // Get student profile or use mock data
  let student = null;
  let authUserId = null;
  
  if (user) {
    authUserId = user.id;
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
      phone: '+49 123 456789',
      avatar_url: null
    };
    authUserId = 'demo-user-id';
  }

  return <ProfileClient initialStudent={student} authUserId={authUserId} />;
}
