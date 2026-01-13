'use client';

import { useState, useEffect } from 'react';
import studentLabels from './student-labels';

const LANG_STORAGE_KEY = 'kursfind_student_lang';

/**
 * Custom hook for managing student language preference with localStorage persistence.
 * This hook ensures language preference is synchronized across all student pages
 * (Dashboard, AI Search, etc.) and persists through page refreshes and navigation.
 */
export function useStudentLang() {
  const [lang, setLangState] = useState('de');
  const [isLoaded, setIsLoaded] = useState(false);

  // Load language from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedLang = localStorage.getItem(LANG_STORAGE_KEY);
      if (savedLang === 'en' || savedLang === 'de') {
        setLangState(savedLang);
      }
      setIsLoaded(true);
    }
  }, []);

  // Listen for language changes from other tabs/windows or components
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleStorageChange = (e) => {
      if (e.key === LANG_STORAGE_KEY && (e.newValue === 'en' || e.newValue === 'de')) {
        setLangState(e.newValue);
      }
    };

    // Custom event for same-tab synchronization
    const handleLangChange = (e) => {
      if (e.detail === 'en' || e.detail === 'de') {
        setLangState(e.detail);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('kursfind-lang-change', handleLangChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('kursfind-lang-change', handleLangChange);
    };
  }, []);

  // Setter that persists to localStorage and dispatches event for synchronization
  const setLang = (newLang) => {
    if (newLang !== 'en' && newLang !== 'de') return;
    
    setLangState(newLang);
    
    if (typeof window !== 'undefined') {
      localStorage.setItem(LANG_STORAGE_KEY, newLang);
      // Dispatch custom event for same-tab synchronization
      window.dispatchEvent(new CustomEvent('kursfind-lang-change', { detail: newLang }));
    }
  };

  const labels = studentLabels[lang] || studentLabels.de;

  return { lang, setLang, labels, isLoaded };
}

export default useStudentLang;
