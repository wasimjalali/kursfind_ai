'use client';

import Link from 'next/link';
import { useStudentLanguage } from '@/lib/useStudentLanguage';

export default function ChatHistoryHeader() {
  const { labels } = useStudentLanguage();

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
          {labels?.chatHistory?.title || 'Chat-Verlauf'} 💬
        </h1>
        <p className="text-sm sm:text-base text-gray-600 mt-1 sm:mt-2">
          {labels?.chatHistory?.subtitle || 'Ihre Konversationen mit dem KI-Kursberater'}
        </p>
      </div>
      <Link
        href="/suchen"
        className="w-full sm:w-auto text-center px-6 py-3 bg-gradient-to-r from-cyan-500 to-emerald-500 text-white font-semibold rounded-lg hover:shadow-lg transition-shadow"
      >
        {labels?.common?.newSearch || '+ Neue Suche'}
      </Link>
    </div>
  );
}
