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

const HeartIcon = ({ className, filled }: { className?: string; filled?: boolean }) => (
  <svg 
    className={className} 
    fill={filled ? "currentColor" : "none"} 
    stroke="currentColor" 
    viewBox="0 0 24 24"
  >
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
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
  // Enhanced fields for All Courses page
  price?: string | number;      // e.g., "4.200 €"
  providerLogoUrl?: string;     // URL for the circular logo
  isFavorite?: boolean;         // For the heart icon
  badges?: string[];            // Extra tags like "Laptop inclusive"
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
      <div className="group flex flex-col md:flex-row w-full bg-white rounded-xl border border-gray-100 shadow-md shadow-gray-200/50 overflow-hidden hover:shadow-lg hover:shadow-cyan-100/50 hover:border-cyan-200 hover:-translate-y-0.5 transition-all duration-300 mb-2">
        
        {/* RESPONSIVE IMAGE CONTAINER */}
        {/* Mobile: w-full aspect-video (16:9). Desktop: fixed width md:w-48, aspect-[4/3] */}
        <div className="relative shrink-0 w-full aspect-video md:w-48 md:aspect-[4/3] bg-gray-100">
          {imageUrl ? (
            <Image 
              src={imageUrl} 
              alt={course.title} 
              fill 
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <MonitorIcon className="w-8 h-8 opacity-20" />
            </div>
          )}
        </div>

        {/* 2. CONTENT AREA */}
        <div className="flex flex-col p-3 sm:p-4 grow justify-between min-w-0">
          <div className="relative">
            {/* Heart Icon - Top Right */}
            {course.isFavorite !== undefined && (
              <button 
                className="absolute top-0 right-0 p-1.5 rounded-full hover:bg-gray-100 transition-colors"
                aria-label={course.isFavorite ? "Remove from favorites" : "Add to favorites"}
                aria-pressed={course.isFavorite ? "true" : "false"}
              >
                <HeartIcon 
                  className="w-4 h-4 text-red-500 hover:scale-110 transition-transform" 
                  filled={course.isFavorite} 
                />
              </button>
            )}
            
            {/* Provider with Logo */}
            <div className="inline-flex items-center gap-2 px-2.5 sm:px-3 py-1 bg-gray-100 text-gray-700 text-xs font-semibold rounded-full mb-2">
              {course.providerLogoUrl && (
                <Image 
                  src={course.providerLogoUrl} 
                  alt={providerName}
                  width={16}
                  height={16}
                  className="w-4 h-4 rounded-full object-cover"
                />
              )}
              {providerName}
            </div>

            {/* Title */}
            <h3 className="font-bold text-gray-900 text-sm sm:text-base leading-snug mb-2 group-hover:text-cyan-600 transition-colors line-clamp-2">
              {course.title}
            </h3>

            {/* Enhanced Metadata Badges */}
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-3">
              {/* Location */}
              <span className="flex items-center gap-1 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-lg px-2 sm:px-3 py-1 sm:py-1.5">
                <MapPinIcon className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-gray-500" />
                <span className="text-xs font-semibold text-gray-900">{course.location}</span>
              </span>
              
              {/* Duration */}
              {course.duration && (
                <span className="flex items-center gap-1 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-lg px-2 sm:px-3 py-1 sm:py-1.5">
                  <ClockIcon className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-gray-500" />
                  <span className="text-xs font-semibold text-gray-900">{course.duration}</span>
                </span>
              )}
              
              {/* Language */}
              {course.language && (
                <span className="flex items-center gap-1 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-lg px-2 sm:px-3 py-1 sm:py-1.5">
                  <span className="text-xs">{getLanguageIcon(course.language)}</span>
                  <span className="text-xs font-semibold text-gray-900">{course.language}</span>
                </span>
              )}
              
              {/* Format */}
              {course.format && (
                <span className="flex items-center gap-1 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-lg px-2 sm:px-3 py-1 sm:py-1.5">
                  <span className="text-xs font-semibold text-gray-900">{course.format}</span>
                </span>
              )}
              
              {/* Laptop Included */}
              {hasLaptopIncluded && (
                <span className="flex items-center gap-1 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-lg px-2 sm:px-3 py-1 sm:py-1.5">
                  <span className="text-xs font-semibold text-gray-900">💻 Laptop</span>
                </span>
              )}
              
              {/* Start Date Badge */}
              {formatStartDate(course.start_date) && (
                <span className="flex items-center gap-1 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-lg px-2 sm:px-3 py-1 sm:py-1.5">
                  <span className="text-xs font-semibold text-gray-900">📅 {formatStartDate(course.start_date)}</span>
                </span>
              )}
            </div>
          </div>

          {/* Enhanced Metadata Row with Price */}
          <div className="w-full mt-auto flex items-center justify-between pt-2 border-t border-cyan-100">
            <div className="flex items-center gap-3 text-xs text-gray-600">
              {/* Price */}
              {course.price && (
                <span className="font-semibold text-gray-900">💶 {course.price}</span>
              )}
              {/* Start Date */}
              {formatStartDate(course.start_date) && (
                <span>📅 {formatStartDate(course.start_date)}</span>
              )}
              {/* Duration */}
              {course.duration && (
                <span>⏱ {course.duration}</span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs sm:text-sm font-semibold text-cyan-600 group-hover:text-emerald-600 transition-colors">
                Details ansehen
              </span>
              <ArrowRightIcon className="w-4 h-4 text-cyan-600 group-hover:text-emerald-600 group-hover:translate-x-1 transition-all" />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};
