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
      <div className="group relative">
        {/* Gradient Glow Effect */}
        <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-400 via-emerald-400 to-cyan-400 rounded-xl blur opacity-30 motion-safe:animate-gradient-xy"></div>
        <div className="group flex flex-col sm:flex-row w-full bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 mb-2 min-h-[140px] sm:min-h-[160px] relative">
        
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
        </div>

        {/* 2. CONTENT AREA */}
        <div className="flex flex-col p-3 sm:p-4 grow justify-between min-w-0">
          <div>
            {/* Provider */}
            <div className="inline-flex items-center px-2.5 sm:px-3 py-1 bg-gray-100 text-gray-700 text-xs font-semibold rounded-full mb-2">
              {providerName}
            </div>

            {/* Title */}
            <h3 className="font-bold text-gray-900 text-sm sm:text-base leading-snug mb-2 group-hover:text-cyan-600 transition-colors line-clamp-2">
              {course.title}
            </h3>

            {/* Metadata Badges */}
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
                <span className="bg-gradient-to-r from-cyan-50 to-emerald-50 border border-cyan-200 text-cyan-700 rounded-lg px-2 sm:px-3 py-1 sm:py-1.5 text-xs font-semibold">
                  {course.format}
                </span>
              )}
              
              {/* Laptop Included */}
              {hasLaptopIncluded && (
                <span className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 text-blue-700 rounded-lg px-2 sm:px-3 py-1 sm:py-1.5 text-xs font-semibold">
                  💻 Laptop
                </span>
              )}
              
              {/* Start Date Badge */}
              {formatStartDate(course.start_date) && (
                <span className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 text-amber-700 rounded-lg px-2 sm:px-3 py-1 sm:py-1.5 text-xs font-semibold">
                  📅 {formatStartDate(course.start_date)}
                </span>
              )}
            </div>
          </div>

          {/* CTA Button */}
          <div className="w-full mt-auto flex items-center justify-between pt-2 border-t border-cyan-100">
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
