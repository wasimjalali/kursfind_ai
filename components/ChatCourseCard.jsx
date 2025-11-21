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
      className="block group hover:scale-[1.02] transition-all duration-200"
    >
      <div className="bg-gradient-to-br from-white to-gray-50 border-2 border-gray-200 rounded-xl p-5 shadow-md hover:shadow-xl hover:border-cyan-300 transition-all">
        
        {/* Top: Provider + Funding badges */}
        <div className="flex items-center justify-between mb-3">
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
        <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-cyan-600 transition-colors line-clamp-2">
          {course.title}
        </h3>

        {/* Description */}
        {course.description && (
          <p className="text-sm text-gray-600 mb-4 line-clamp-2">
            {course.description}
          </p>
        )}

        {/* Meta Info Grid */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          {/* Location */}
          <div className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-lg p-2">
            <div className="text-xs text-gray-500 mb-0.5">Standort</div>
            <div className="text-xs font-semibold text-gray-900 truncate">
              {course.location}
            </div>
          </div>
          
          {/* Duration */}
          <div className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-lg p-2">
            <div className="text-xs text-gray-500 mb-0.5">Dauer</div>
            <div className="text-xs font-semibold text-gray-900 truncate">
              {course.duration}
            </div>
          </div>
          
          {/* Format */}
          <div className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-lg p-2">
            <div className="text-xs text-gray-500 mb-0.5">Format</div>
            <div className="text-xs font-semibold text-gray-900 truncate">
              Vollzeit
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="flex items-center justify-between">
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
    </Link>
  );
}
