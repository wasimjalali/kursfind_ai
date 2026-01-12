import React from 'react';
import Image from 'next/image';

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

const ExternalLinkIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
  </svg>
);

// Adjust this interface to match your exact existing Course type
interface Course {
  id: string;
  title: string;
  provider: string;
  imageUrl?: string;
  location: string;
  duration: string;
  format: string; // e.g. "Online", "Vollzeit"
  tags?: string[];
  link: string;
  isPromoted?: boolean; // For "Top-Wahl" etc.
}

interface CourseCardProps {
  course: Course;
}

export const CourseCardCompact: React.FC<CourseCardProps> = ({ course }) => {
  return (
    <div className="group flex flex-col md:flex-row w-full bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300">
      
      {/* 1. IMAGE SECTION (Left on Desktop, Top on Mobile) */}
      <div className="relative h-32 md:h-auto md:w-48 shrink-0 bg-gray-100">
        {course.imageUrl ? (
          <Image 
            src={course.imageUrl} 
            alt={course.title} 
            fill 
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <MonitorIcon className="w-8 h-8 opacity-20" />
          </div>
        )}

        {/* Badges Overlay (Top Left) */}
        {(course.tags && course.tags.length > 0) && (
          <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
            {course.isPromoted && (
              <span className="bg-gradient-to-r from-amber-400 to-orange-400 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm">
                Top-Wahl
              </span>
            )}
            {course.tags.includes('Bildungsgutschein') && (
              <span className="bg-emerald-500 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm flex items-center gap-1">
                ✓ 100% Gefördert
              </span>
            )}
          </div>
        )}
      </div>

      {/* 2. CONTENT SECTION (Right on Desktop, Bottom on Mobile) */}
      <div className="flex flex-col p-4 grow justify-between">
        <div>
          {/* Provider Name (Subtle Trust Signal) */}
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
              {course.provider}
            </span>
          </div>

          {/* Title */}
          <h3 className="font-bold text-gray-900 leading-snug mb-2 group-hover:text-cyan-600 transition-colors line-clamp-2">
            {course.title}
          </h3>

          {/* Compact Metadata Row */}
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-600 mb-3">
            <span className="flex items-center gap-1 bg-gray-50 px-1.5 py-0.5 rounded">
              <MapPinIcon className="w-3 h-3 text-cyan-500" />
              {course.location}
            </span>
            <span className="text-gray-300">•</span>
            <span className="flex items-center gap-1 bg-gray-50 px-1.5 py-0.5 rounded">
              <ClockIcon className="w-3 h-3 text-cyan-500" />
              {course.duration}
            </span>
            <span className="text-gray-300">•</span>
            <span className="flex items-center gap-1 bg-gray-50 px-1.5 py-0.5 rounded">
              <MonitorIcon className="w-3 h-3 text-cyan-500" />
              {course.format}
            </span>
          </div>
        </div>

        {/* 3. ACTION BUTTON (High CTR) */}
        <a 
          href={course.link} 
          target="_blank" 
          rel="noopener noreferrer"
          className="w-full mt-auto flex items-center justify-center gap-2 bg-cyan-50 text-cyan-700 hover:bg-cyan-100 active:bg-cyan-200 font-medium py-2 rounded-lg transition-colors text-sm"
        >
          Zum Kurs
          <ExternalLinkIcon className="w-3 h-3" />
        </a>
      </div>
    </div>
  );
};
