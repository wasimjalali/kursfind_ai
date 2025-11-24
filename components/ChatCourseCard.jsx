'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function ChatCourseCard({ course, showRecommendedBadge = false }) {
  const [imageError, setImageError] = useState(false);
  
  const handleClick = () => {
    // Track click event
    console.log('Course clicked:', course.id, course.title);
  };

  // Handle providers as array or object (from Supabase JOIN)
  const provider = Array.isArray(course.providers) ? course.providers[0] : course.providers;
  const providerName = provider?.company_name || provider?.name || course.provider || 'Anbieter';
  const providerLogo = provider?.logo_url || course.provider_logo_url;

  // Get course image with fallback to provider logo
  const getCourseImage = () => {
    // Check if course.image_url exists and is not empty
    if (course.image_url && course.image_url.trim() !== '' && !imageError) {
      return course.image_url;
    }
    // Fallback to provider logo
    if (providerLogo && providerLogo.trim() !== '') {
      return providerLogo;
    }
    return null;
  };

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

  const imageUrl = getCourseImage();

  return (
    <Link 
      href={`/courses/${course.id}`}
      onClick={handleClick}
      className="block group hover:scale-[1.01] md:hover:scale-[1.02] transition-all duration-200"
    >
      <div className="bg-gradient-to-br from-white to-gray-50 border-2 border-gray-200 rounded-xl overflow-hidden shadow-md hover:shadow-xl hover:border-cyan-300 transition-all relative">
        
        {/* AI Recommended Badge - Top Left Corner */}
        {showRecommendedBadge && (
          <div className="absolute top-3 left-3 z-20 bg-gradient-to-r from-yellow-400 to-amber-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg flex items-center gap-1">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            Top-Wahl
          </div>
        )}
        
        {/* Provider Logo Badge - Top Right Corner of entire card (Desktop only) */}
        {providerLogo && providerLogo.trim() !== '' && (
          <div className="hidden md:flex absolute top-3 right-3 z-10 w-20 h-20 bg-white rounded-xl p-2 shadow-lg border-2 border-gray-200 items-center justify-center">
            <img 
              src={providerLogo} 
              alt={providerName}
              className="w-full h-full object-contain"
              onError={(e) => {
                // Hide logo if it fails to load
                e.target.style.display = 'none';
              }}
            />
          </div>
        )}
        
        {/* Mobile: Vertical layout, Desktop: Horizontal */}
        <div className="flex flex-col md:flex-row">
          
          {/* Image with fallback - mobile: full width top, desktop: left side */}
          {imageUrl ? (
            <div className="w-full md:w-48 h-48 md:h-auto bg-gradient-to-br from-cyan-100 to-emerald-100 flex-shrink-0 relative">
              <img 
                src={imageUrl} 
                alt={course.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  // If course image fails, try provider logo
                  if (providerLogo && providerLogo.trim() !== '' && e.target.src !== providerLogo) {
                    e.target.src = providerLogo;
                  } else {
                    setImageError(true);
                  }
                }}
              />
              {/* Provider Logo Badge - Top Right Corner of image (Mobile only) */}
              {providerLogo && providerLogo.trim() !== '' && (
                <div className="md:hidden absolute top-3 right-3 z-10 w-16 h-16 bg-white rounded-xl p-2 shadow-lg border-2 border-gray-200 flex items-center justify-center">
                  <img 
                    src={providerLogo} 
                    alt={providerName}
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      // Hide logo if it fails to load
                      e.target.style.display = 'none';
                    }}
                  />
                </div>
              )}
            </div>
          ) : (
            <div className="w-full md:w-48 h-48 md:h-auto bg-gradient-to-br from-cyan-100 to-emerald-100 flex-shrink-0 flex items-center justify-center relative">
              {/* Placeholder if no course image and no provider logo */}
              {!providerLogo && (
                <svg className="w-16 h-16 text-cyan-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              )}
              {/* Provider Logo Badge - Top Right Corner of placeholder (Mobile only) */}
              {providerLogo && providerLogo.trim() !== '' && (
                <div className="md:hidden absolute top-3 right-3 z-10 w-16 h-16 bg-white rounded-xl p-2 shadow-lg border-2 border-gray-200 flex items-center justify-center">
                  <img 
                    src={providerLogo} 
                    alt={providerName}
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      // Hide logo if it fails to load
                      e.target.style.display = 'none';
                    }}
                  />
                </div>
              )}
            </div>
          )}
          
          {/* Content */}
          <div className="flex-1 p-4 md:p-5">
            {/* Top: Provider + Funding badges */}
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="inline-flex items-center px-3 py-1 bg-gradient-to-r from-cyan-500 to-emerald-500 text-white text-xs font-semibold rounded-full">
                {providerName}
              </span>
              {course.funding_type && (
                <span className="inline-flex items-center px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-full border border-emerald-200">
                  {course.funding_type}
                </span>
              )}
            </div>

            {/* Title */}
            <h3 className="text-base md:text-lg font-bold text-gray-900 mb-2 group-hover:text-cyan-600 transition-colors line-clamp-2">
              {course.title}
            </h3>

            {/* Subtitle */}
            {course.subtitle && (
              <p className="text-sm text-gray-600 mb-3 md:mb-4 line-clamp-2">
                {course.subtitle}
              </p>
            )}

            {/* Duration Info - Combined format: "12 Wochen Vollzeit | 480 UE" */}
            {(course.duration || course.duration_hours) && (
              <div className="flex items-center gap-1.5 mb-3 text-xs font-semibold text-gray-700">
                {course.duration && course.duration_hours ? (
                  <span>{course.duration} | {course.duration_hours}</span>
                ) : (
                  <span>{course.duration || course.duration_hours}</span>
                )}
              </div>
            )}

            {/* Meta Info - Location, Format, Language */}
            <div className="flex flex-wrap gap-2 mb-3 md:mb-4">
              {/* Location */}
              {course.location && (
                <div className="flex items-center gap-1.5 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-lg px-3 py-1.5">
                  <svg className="w-3.5 h-3.5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="text-xs font-semibold text-gray-900">{course.location}</span>
                </div>
              )}
              
              {/* Format */}
              {course.format && (
                <div className="flex items-center gap-1.5 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-lg px-3 py-1.5">
                  <svg className="w-3.5 h-3.5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span className="text-xs font-semibold text-gray-900">{course.format}</span>
                </div>
              )}
              
              {/* Language */}
              {course.language && (
                <div className="flex items-center gap-1.5 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-lg px-3 py-1.5">
                  <span className="text-xs">{getLanguageIcon(course.language)}</span>
                  <span className="text-xs font-semibold text-gray-900">{course.language}</span>
                </div>
              )}
            </div>

            {/* CTA - Larger touch target on mobile */}
            <div className="flex items-center justify-between pt-2 border-t border-gray-200">
              <span className="text-sm font-semibold text-cyan-600 group-hover:text-emerald-600 transition-colors">
                Details ansehen
              </span>
              <svg 
                className="w-5 h-5 text-cyan-600 group-hover:text-emerald-600 group-hover:translate-x-1 transition-all" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}