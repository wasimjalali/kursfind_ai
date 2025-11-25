import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase-server';
import ProfileClient from './ProfileClient';

export default async function StudentProfilePage() {
  const supabase = await createClient();
  
  // Get current user
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    redirect('/student/login');
  }
  
  // Get student profile
  const { data: student } = await supabase
    .from('students')
    .select('*')
    .eq('auth_user_id', user.id)
    .single();
  
  if (!student) {
    redirect('/student/login');
  }

  return <ProfileClient initialStudent={student} authUserId={user.id} />;
}
