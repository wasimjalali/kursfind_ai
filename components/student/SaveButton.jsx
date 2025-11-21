'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export default function SaveButton({ courseId, size = 'md', variant = 'icon' }) {
  const [isSaved, setIsSaved] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    checkIfSaved();
  }, [courseId]);

  const checkIfSaved = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      setIsAuthenticated(false);
      return;
    }

    setIsAuthenticated(true);

    // Get student id
    const { data: student } = await supabase
      .from('students')
      .select('id')
      .eq('auth_user_id', user.id)
      .single();

    if (!student) return;

    // Check if course is saved
    const { data } = await supabase
      .from('saved_courses')
      .select('id')
      .eq('student_id', student.id)
      .eq('course_id', courseId)
      .single();

    setIsSaved(!!data);
  };

  const toggleSave = async () => {
    if (!isAuthenticated) {
      // Redirect to signup
      window.location.href = '/student/signup';
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/student/saved-courses', {
        method: isSaved ? 'DELETE' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ courseId }),
      });

      if (response.ok) {
        setIsSaved(!isSaved);
      }
    } catch (error) {
      console.error('Save error:', error);
    } finally {
      setLoading(false);
    }
  };

  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
  };

  // Icon-only variant (original)
  if (variant === 'icon') {
    return (
      <button
        onClick={toggleSave}
        disabled={loading}
        className={`${sizeClasses[size]} rounded-full flex items-center justify-center ${
          isSaved
            ? 'bg-red-500 text-white'
            : 'bg-white text-gray-400 border-2 border-gray-300 hover:text-red-500 hover:border-red-500'
        } transition-all hover:scale-110 active:scale-95 disabled:opacity-50`}
        title={isSaved ? 'Aus Favoriten entfernen' : 'Zu Favoriten hinzufügen'}
      >
        <svg className="w-5 h-5" fill={isSaved ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      </button>
    );
  }

  // Full button variant with text and heart icon
  return (
    <button
      onClick={toggleSave}
      disabled={loading}
      className={`w-full py-3 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${
        isSaved
          ? 'bg-red-500 text-white border-2 border-red-500 hover:bg-red-600'
          : 'border-2 border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-red-500 hover:text-red-500'
      } disabled:opacity-50`}
    >
      <svg 
        className="w-5 h-5" 
        fill={isSaved ? 'currentColor' : 'none'} 
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={2} 
          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" 
        />
      </svg>
      {loading ? 'Wird gespeichert...' : isSaved ? 'Gespeichert ❤️' : 'Kurs speichern'}
    </button>
  );
}
