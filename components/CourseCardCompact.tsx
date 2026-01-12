import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

// Inline SVG Icons (matching your project's pattern)
const MapPinIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const ClockIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const MonitorIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

const ArrowRightIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  </svg>
);

// Course interface matching the database schema
interface Course {
  id: string;
  title: string;
  subtitle?: string;
  image_url?: string;
  location: string;
  duration?: string;
  duration_hours?: string;
  format?: string;
  language?: string;
  funding_type?: string;
  tags?: string[];
  providers?: any; // Nested provider object from Supabase JOIN
  provider?: string; // Fallback provider name
  is_featured?: boolean; // For "Top-Wahl" etc.
  benefits?: string; // Text field containing benefits like "Laptop included"
  start_date?: string; // Next available start date
}

interface CourseCardProps {
  course: Course;
}

export const CourseCardCompact: React.FC<CourseCardProps> = ({ course }) => {
  // Handle providers as array or object (from Supabase JOIN)
  const provider = Array.isArray(course.providers) ? course.providers[0] : course.providers;
  const providerName = provider?.company_name || provider?.name || course.provider || 'Anbieter';
  
  // Get course image with fallback to provider logo
  const getCourseImage = () => {
    // Check if course.image_url exists and is not empty
    if (course.image_url && course.image_url.trim() !== '') {
      return course.image_url;
    }
    // Fallback to provider logo
    if (provider?.logo_url && provider.logo_url.trim() !== '') {
      return provider.logo_url;
    }
    return null;
  };

  const imageUrl = getCourseImage();

  // Check if laptop is included in benefits
  const hasLaptopIncluded = course.benefits && 
    (course.benefits.toLowerCase().includes('laptop') || 
     course.benefits.toLowerCase().includes('laptop included') ||
     course.benefits.toLowerCase().includes('laptop inklusive'));

  // Get language icon
  const getLanguageIcon = (lang?: string) => {
    if (!lang) return '🌐';
    const langLower = lang.toLowerCase();
    if (langLower.includes('deutsch') || langLower.includes('german')) return '🇩🇪';
    if (langLower.includes('english') || langLower.includes('englisch')) return '🇬🇧';
    if (langLower.includes('französisch') || langLower.includes('french')) return '🇫🇷';
    if (langLower.includes('spanisch') || langLower.includes('spanish')) return '🇪🇸';
    return '🌐';
  };

  // Format start date
  const formatStartDate = (dateString?: string) => {
    if (!dateString) return null;
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('de-DE', { 
        day: 'numeric', 
        month: 'short', 
        year: 'numeric' 
      });
    } catch {
      return dateString;
    }
  };

  return (
    <Link 
      href={`/courses/${course.id}`}
      className="group block"
    >
      <div className="group flex flex-col sm:flex-row w-full bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-300 mb-2">
        
        {/* 1. IMAGE THUMBNAIL */}
        {/* Desktop: Fixed width (w-40). Mobile: Full width, fixed height (h-32) */}
        <div className="relative h-32 w-full sm:h-auto sm:w-40 shrink-0 bg-gray-100">
          {imageUrl ? (
            <Image 
              src={imageUrl} 
              alt={course.title} 
              fill 
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <MonitorIcon className="w-8 h-8 opacity-20" />
            </div>
          )}

          {/* Badges (Overlaid to save space) */}
          <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
            {course.is_featured && (
              <span className="bg-amber-400 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm">
                Top-Wahl
              </span>
            )}
            {course.funding_type && (
              <span className="bg-emerald-500 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm">
                {course.funding_type}
              </span>
            )}
            {hasLaptopIncluded && (
              <span className="bg-blue-500 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm">
                💻 Laptop
              </span>
            )}
          </div>
        </div>

        {/* 2. CONTENT AREA */}
        <div className="flex flex-col p-3 sm:p-4 grow justify-between min-w-0">
          <div>
            {/* Provider */}
            <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1 truncate">
              {providerName}
            </div>

            {/* Title */}
            <h3 className="font-bold text-gray-900 text-sm sm:text-base leading-snug mb-2 group-hover:text-cyan-600 transition-colors line-clamp-2">
              {course.title}
            </h3>

            {/* Subtitle if available */}
            {course.subtitle && (
              <p className="text-xs text-gray-600 mb-2 line-clamp-2">
                {course.subtitle}
              </p>
            )}

            {/* Metadata (Single Row) */}
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-600 mb-3">
              <span className="flex items-center gap-1 bg-gray-50 px-1.5 py-0.5 rounded whitespace-nowrap">
                <MapPinIcon className="w-3 h-3 text-cyan-500" />
                {course.location}
              </span>
              <span className="text-gray-300">•</span>
              <span className="flex items-center gap-1 bg-gray-50 px-1.5 py-0.5 rounded whitespace-nowrap">
                <ClockIcon className="w-3 h-3 text-cyan-500" />
                {course.duration || course.duration_hours}
              </span>
              <span className="text-gray-300">•</span>
              <span className="flex items-center gap-1 bg-gray-50 px-1.5 py-0.5 rounded whitespace-nowrap">
                <span className="text-xs">{getLanguageIcon(course.language)}</span>
                {course.language}
              </span>
            </div>
          </div>

          {/* CTA Button */}
          <div className="w-full mt-auto flex items-center justify-between pt-2 border-t border-gray-100">
            <div className="flex items-center gap-2">
              <span className="text-xs sm:text-sm font-semibold text-cyan-600 group-hover:text-emerald-600 transition-colors">
                Details ansehen
              </span>
              {formatStartDate(course.start_date) && (
                <>
                  <span className="text-gray-300">•</span>
                  <span className="text-xs text-gray-600 font-medium">
                    Start: {formatStartDate(course.start_date)}
                  </span>
                </>
              )}
            </div>
            <ArrowRightIcon className="w-4 h-4 text-cyan-600 group-hover:text-emerald-600 group-hover:translate-x-1 transition-all" />
          </div>
        </div>
      </div>
    </Link>
  );
};
