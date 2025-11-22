'use client';

import Link from 'next/link';

export default function ChatCourseCard({ course }) {
  
  const handleClick = () => {
    // Track click event
    console.log('Course clicked:', course.id, course.title);
    
    // You can send this to analytics later:
    // analytics.track('course_click', {
    //   course_id: course.id,
    //   course_title: course.title,
    //   source: 'ai_chat'
    // });
  };

  return (
    <Link 
      href={`/courses/${course.id}`}
      onClick={handleClick}
      className="block group hover:scale-[1.01] md:hover:scale-[1.02] transition-all duration-200"
    >
      <div className="bg-gradient-to-br from-white to-gray-50 border-2 border-gray-200 rounded-xl overflow-hidden shadow-md hover:shadow-xl hover:border-cyan-300 transition-all">
        
        {/* Mobile: Vertical layout, Desktop: Horizontal */}
        <div className="flex flex-col md:flex-row">
          
          {/* Image placeholder - mobile: full width top, desktop: left side */}
          {course.image_url && (
            <div className="w-full md:w-48 h-48 md:h-auto bg-gradient-to-br from-cyan-100 to-emerald-100 flex-shrink-0">
              <img 
                src={course.image_url} 
                alt={course.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          
          {/* Content */}
          <div className="flex-1 p-4 md:p-5">
            {/* Top: Provider + Funding badges */}
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="inline-flex items-center px-3 py-1 bg-gradient-to-r from-cyan-500 to-emerald-500 text-white text-xs font-semibold rounded-full">
                {course.provider}
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

            {/* Description */}
            {course.description && (
              <p className="text-sm text-gray-600 mb-3 md:mb-4 line-clamp-2">
                {course.description}
              </p>
            )}

            {/* Meta Info - Single row on mobile */}
            <div className="flex flex-wrap gap-2 mb-3 md:mb-4">
              {/* Location */}
              <div className="flex items-center gap-1.5 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-lg px-3 py-1.5">
                <svg className="w-3.5 h-3.5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="text-xs font-semibold text-gray-900">{course.location}</span>
              </div>
              
              {/* Duration */}
              <div className="flex items-center gap-1.5 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-lg px-3 py-1.5">
                <svg className="w-3.5 h-3.5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-xs font-semibold text-gray-900">{course.duration}</span>
              </div>
              
              {/* Format */}
              <div className="flex items-center gap-1.5 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-lg px-3 py-1.5">
                <svg className="w-3.5 h-3.5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span className="text-xs font-semibold text-gray-900">Vollzeit</span>
              </div>
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