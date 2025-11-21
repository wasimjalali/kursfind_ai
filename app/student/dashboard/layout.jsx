import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase-server';
import StudentSidebar from '@/components/student/StudentSidebar';
import StudentHeader from '@/components/student/StudentHeader';

export default async function StudentDashboardLayout({ children }) {
  const supabase = await createClient();
  
  // TEMPORARY: Auth disabled for testing
  // TODO: Re-enable authentication after login is fixed
  
  // Check authentication
  const { data: { user }, error } = await supabase.auth.getUser();
  
  // Temporarily commented out for testing
  // if (error || !user) {
  //   redirect('/student/login');
  // }

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

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Sidebar */}
      <StudentSidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <StudentHeader student={student} />

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
