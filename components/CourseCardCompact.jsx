'use client';

import Link from 'next/link';

export default function CourseCardCompact({ course }) {
  // Handle providers as array or object (from Supabase JOIN)
  const provider = Array.isArray(course.providers) ? course.providers[0] : course.providers;
  const providerName = provider?.company_name || provider?.name || course.provider || 'Anbieter';
  const providerLogo = provider?.logo_url || course.provider_logo_url;

  // Get language icon
  const getLanguageIcon = (lang) => {
    if (!lang) return '🌐';
    const langLower = lang.toLowerCase();
    if (langLower.includes('deutsch') || langLower.includes('german')) return '🇩🇪';
    if (langLower.includes('english') || langLower.includes('englisch')) return '🇬🇧';
    if (langLower.includes('französisch') || langLower.includes('french')) return '🇫🇷';
    if (langLower.includes('spanisch') || langLower.includes('spanish')) return '🇪🇸';
    return '🌐';
  };

  // Format price
  const formatPrice = (price) => {
    if (!price || price === 0 || price === '0') return 'Kostenlos';
    return `${price}€`;
  };

  return (
    <Link 
      href={`/courses/${course.id}`}
      className="block p-3 border border-gray-200 rounded-lg hover:border-cyan-500 hover:shadow-md transition-all bg-white"
    >
      <div className="flex gap-3">
        {/* Provider Logo */}
        {providerLogo && providerLogo.trim() !== '' && (
          <div className="flex-shrink-0 w-12 h-12 bg-white rounded-lg p-1 border border-gray-200 flex items-center justify-center">
            <img 
              src={providerLogo} 
              alt={providerName}
              className="w-full h-full object-contain rounded-lg"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.parentNode.style.display = 'none';
              }}
            />
          </div>
        )}
        
        <div className="flex-1 min-w-0">
          {/* Title */}
          <h3 className="font-semibold text-sm text-gray-900 mb-1 line-clamp-2">
            {course.title}
          </h3>
          
          {/* Provider Name */}
          <p className="text-xs text-gray-600 mb-2">{providerName}</p>
          
          {/* Key Info */}
          <div className="flex flex-wrap gap-2 text-xs text-gray-500">
            {course.duration && (
              <span className="flex items-center gap-1">
                <span>⏱️</span>
                <span className="truncate max-w-[100px]">{course.duration}</span>
              </span>
            )}
            {course.format && (
              <span className="flex items-center gap-1">
                <span>💻</span>
                <span>{course.format}</span>
              </span>
            )}
            {course.funding_types && Array.isArray(course.funding_types) && course.funding_types.length > 0 && (
              <span className="text-emerald-600 font-medium">✓ Förderbar</span>
            )}
            {course.language && (
              <span className="flex items-center gap-1">
                <span>{getLanguageIcon(course.language)}</span>
                <span className="truncate max-w-[80px]">{course.language}</span>
              </span>
            )}
          </div>
        </div>
        
        {/* Price */}
        <div className="flex-shrink-0 text-right">
          <p className="font-semibold text-cyan-600 text-sm">
            {formatPrice(course.price)}
          </p>
          {course.location && (
            <p className="text-xs text-gray-500 mt-1">{course.location}</p>
          )}
        </div>
      </div>
    </Link>
  );
}

