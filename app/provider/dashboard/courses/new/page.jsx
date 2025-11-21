import { getCurrentProvider } from '@/lib/supabase-server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import NewCourseForm from '@/components/provider/NewCourseForm';

export default async function NewCoursePage() {
  const provider = await getCurrentProvider();
  
  if (!provider) {
    redirect('/provider/login');
  }

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <Link
          href="/provider/dashboard/courses"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Zurück zu Meine Kurse
        </Link>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Neuen Kurs erstellen</h1>
        <p className="text-gray-600">Füllen Sie die Informationen aus, um einen neuen Kurs zu erstellen.</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-8">
        <NewCourseForm />
      </div>
    </div>
  );
}
