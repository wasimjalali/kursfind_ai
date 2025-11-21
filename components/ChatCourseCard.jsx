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
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-md hover:shadow-xl hover:border-cyan-300 transition-all lg:flex lg:flex-row">
        
        {/* Image - full width on mobile, 1/3 on desktop */}
        {course.image_url && (
          <div className="w-full lg:w-1/3 aspect-video lg:aspect-auto bg-gradient-to-br from-cyan-100 to-emerald-100">
            <img 
              src={course.image_url} 
              alt={course.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        
        {/* Content - 2/3 on desktop */}
        <div className="p-4 lg:w-2/3 lg:p-5">
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
          <h3 className="text-lg font-semibold text-gray-900 mb-1 group-hover:text-cyan-600 transition-colors line-clamp-2">
            {course.title}
          </h3>

          {/* Subtitle/Description */}
          {course.description && (
            <p className="text-sm text-gray-600 mb-3 line-clamp-2">
              {course.description}
            </p>
          )}

          {/* Info badges - horizontal scroll on mobile */}
          <div className="flex gap-2 overflow-x-auto pb-1 mb-3 scrollbar-hide">
            {/* Location */}
            <span className="inline-flex items-center gap-1.5 bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 text-xs font-medium text-gray-700 whitespace-nowrap flex-shrink-0">
              📍 {course.location}
            </span>
            
            {/* Duration */}
            <span className="inline-flex items-center gap-1.5 bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 text-xs font-medium text-gray-700 whitespace-nowrap flex-shrink-0">
              ⏱️ {course.duration}
            </span>
            
            {/* Format */}
            <span className="inline-flex items-center gap-1.5 bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 text-xs font-medium text-gray-700 whitespace-nowrap flex-shrink-0">
              💻 Vollzeit
            </span>
          </div>

          {/* Button - Full width on mobile */}
          <button className="w-full lg:w-auto px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-emerald-500 text-white text-sm font-semibold rounded-lg hover:shadow-lg transition-all flex items-center justify-center gap-2">
            Details ansehen
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </Link>
  );
}
