'use client';

import { useRouter } from 'next/navigation';
import CourseForm from '@/components/provider/CourseForm';

export default function NewCourseForm({ provider = null }) {
  const router = useRouter();

  function handleSuccess() {
    router.push('/provider/dashboard/courses');
    router.refresh();
  }

  return <CourseForm onSuccess={handleSuccess} provider={provider} />;
}
