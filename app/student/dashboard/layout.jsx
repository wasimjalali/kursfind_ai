import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase-server';
import StudentDashboardClient from './StudentDashboardClient';

export default async function StudentDashboardLayout({ children }) {
  const supabase = await createClient();
  
  // Check authentication
  const { data: { user }, error } = await supabase.auth.getUser();
  
  if (error || !user) {
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

  return <StudentDashboardClient student={student}>{children}</StudentDashboardClient>;
}
