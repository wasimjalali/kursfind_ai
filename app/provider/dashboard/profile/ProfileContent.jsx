'use client';

import { usePortalLanguage } from '../ProviderDashboardClient';
import ProfileForm from '@/components/provider/ProfileForm';

export default function ProfileContent({ initialData }) {
  const { labels } = usePortalLanguage();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">{labels.profile.title}</h1>
        <p className="text-base lg:text-lg text-gray-600">{labels.profile.subtitle}</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-8">
        <ProfileForm initialData={initialData} labels={labels} />
      </div>
    </div>
  );
}
