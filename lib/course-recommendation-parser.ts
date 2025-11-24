/**
 * Course Recommendation Parser - ENHANCED VERSION
 * 
 * Extracts course references from AI assistant messages with:
 * - Precise badge logic (only explicitly recommended courses)
 * - Ranking extraction (Top 1, Top 2, etc.)
 * - Multi-language support (German/English)
 * - Context-aware recommendation detection
 * - Proximity-based keyword matching
 * 
 * Feature Flags: SMART_CARD_ORDERING, SHOW_RECOMMENDATION_BADGE
 */

export interface CourseReference {
  courseId: string;
  position: number; // Position in text (for ordering)
  context: string; // Surrounding text (±50 chars)
  isRecommended: boolean; // Explicitly recommended
  badgeType: 'top-wahl' | 'empfehlung' | 'alternative' | null; // Badge strength
  ranking: number | null; // Extracted ranking (1, 2, 3...)
  isDuplicate: boolean; // Shown in previous messages
}

/**
 * Badge types with priority (higher = stronger)
 */
const BADGE_PRIORITIES = {
  'top-wahl': 3,
  'empfehlung': 2,
  'alternative': 1,
  null: 0
};

/**
 * ENHANCED: Multi-language recommendation patterns with badge types
 */
const RECOMMENDATION_PATTERNS = [
  // TOP-WAHL (Strongest)
  { pattern: 'top recommendation', badge: 'top-wahl' as const, lang: 'en' },
  { pattern: 'top-wahl', badge: 'top-wahl' as const, lang: 'de' },
  { pattern: 'beste wahl', badge: 'top-wahl' as const, lang: 'de' },
  { pattern: 'top choice', badge: 'top-wahl' as const, lang: 'en' },
  { pattern: 'best option', badge: 'top-wahl' as const, lang: 'en' },
  { pattern: 'first choice', badge: 'top-wahl' as const, lang: 'en' },
  { pattern: 'beste option', badge: 'top-wahl' as const, lang: 'de' },
  { pattern: 'definitely the', badge: 'top-wahl' as const, lang: 'en' },
  
  // EMPFEHLUNG (Strong)
  { pattern: 'empfehle', badge: 'empfehlung' as const, lang: 'de' },
  { pattern: 'empfehlung', badge: 'empfehlung' as const, lang: 'de' },
  { pattern: 'recommend', badge: 'empfehlung' as const, lang: 'en' },
  { pattern: 'perfekt für', badge: 'empfehlung' as const, lang: 'de' },
  { pattern: 'ideal für', badge: 'empfehlung' as const, lang: 'de' },
  { pattern: 'perfect for', badge: 'empfehlung' as const, lang: 'en' },
  { pattern: 'ideal for', badge: 'empfehlung' as const, lang: 'en' },
  { pattern: 'besonders gut', badge: 'empfehlung' as const, lang: 'de' },
  
  // ALTERNATIVE (Moderate)
  { pattern: 'alternative', badge: 'alternative' as const, lang: 'both' },
  { pattern: 'auch gut', badge: 'alternative' as const, lang: 'de' },
  { pattern: 'weitere option', badge: 'alternative' as const, lang: 'de' },
  { pattern: 'another option', badge: 'alternative' as const, lang: 'en' },
  { pattern: 'passend', badge: 'alternative' as const, lang: 'de' },
  { pattern: 'geeignet', badge: 'alternative' as const, lang: 'de' }
];

/**
 * ENHANCED: Ranking extraction patterns
 */
const RANKING_PATTERNS = [
  /(?:top|erste|first)\s*(?:wahl|choice|option)?[\s:]*(\d+)/i,
  /(?:position|rang|rank)[\s:]*(\d+)/i,
  /^(\d+)[\.)\s]/m, // "1. Course name" or "1) Course name"
  /🥇.*?(\d+)/i, // Emoji rankings
  /🥈.*?(\d+)/i,
  /🥉.*?(\d+)/i,
  /nummer[\s:]*(\d+)/i,
  /number[\s:]*(\d+)/i
];

/**
 * ENHANCED: Extract course references with precise badge logic
 */
export function extractCourseReferences(
  messageContent: string,
  availableCourses: any[],
  previouslyShownCourseIds: string[] = []
): CourseReference[] {
  if (!messageContent || !availableCourses || availableCourses.length === 0) {
    return [];
  }

  const references: CourseReference[] = [];
  const lowerContent = messageContent.toLowerCase();

  availableCourses.forEach((course) => {
    if (!course) return;

    const courseTitle = course.title?.toLowerCase() || '';
    const courseSlug = course.slug?.toLowerCase() || '';
    const courseId = course.id?.toString() || '';

    // Check if course title is mentioned in the message
    if (courseTitle && lowerContent.includes(courseTitle)) {
      const position = lowerContent.indexOf(courseTitle);
      
      // Get context (±75 chars for better proximity detection)
      const contextStart = Math.max(0, position - 75);
      const contextEnd = Math.min(lowerContent.length, position + courseTitle.length + 75);
      const context = messageContent.substring(contextStart, contextEnd);
      const contextLower = context.toLowerCase();

      // ENHANCED: Check badge type with proximity (within ±75 chars)
      let badgeType: 'top-wahl' | 'empfehlung' | 'alternative' | null = null;
      let maxPriority = 0;

      for (const { pattern, badge } of RECOMMENDATION_PATTERNS) {
        if (contextLower.includes(pattern)) {
          const priority = BADGE_PRIORITIES[badge];
          if (priority > maxPriority) {
            badgeType = badge;
            maxPriority = priority;
          }
        }
      }

      // ENHANCED: Extract ranking
      let ranking: number | null = null;
      for (const regex of RANKING_PATTERNS) {
        const match = context.match(regex);
        if (match && match[1]) {
          ranking = parseInt(match[1], 10);
          break;
        }
      }

      // Check if duplicate
      const isDuplicate = previouslyShownCourseIds.includes(courseId);

      references.push({
        courseId,
        position,
        context,
        isRecommended: badgeType !== null,
        badgeType,
        ranking,
        isDuplicate
      });

      console.log('🔍 Course reference found:', {
        title: course.title,
        badgeType,
        ranking,
        isDuplicate,
        contextSnippet: context.substring(0, 100)
      });
    }
    // Also check for slug mentions (e.g., in links)
    else if (courseSlug && lowerContent.includes(courseSlug)) {
      const position = lowerContent.indexOf(courseSlug);
      const isDuplicate = previouslyShownCourseIds.includes(courseId);

      references.push({
        courseId,
        position,
        context: '',
        isRecommended: false,
        badgeType: null,
        ranking: null,
        isDuplicate
      });
    }
  });

  // Sort by ranking first, then position
  references.sort((a, b) => {
    // Ranked items come first
    if (a.ranking && !b.ranking) return -1;
    if (!a.ranking && b.ranking) return 1;
    if (a.ranking && b.ranking) return a.ranking - b.ranking;
    
    // Then by position in text
    return a.position - b.position;
  });

  return references;
}

/**
 * ENHANCED: Reorder courses with ranking support
 */
export function orderCoursesByRecommendation(
  courses: any[],
  messageContent: string,
  previouslyShownCourseIds: string[] = []
): any[] {
  if (!messageContent || !courses || courses.length === 0) {
    return courses;
  }

  const references = extractCourseReferences(messageContent, courses, previouslyShownCourseIds);

  if (references.length === 0) {
    // No specific mentions, return original order
    console.log('📋 No course mentions found, using original order');
    return courses;
  }

  // Create a map of courseId -> reference
  const referenceMap = new Map(
    references.map(ref => [ref.courseId, ref])
  );

  // Separate courses into mentioned and not mentioned
  const mentionedCourses: any[] = [];
  const unmentionedCourses: any[] = [];

  courses.forEach(course => {
    const courseId = course.id?.toString() || '';
    if (referenceMap.has(courseId)) {
      mentionedCourses.push(course);
    } else {
      unmentionedCourses.push(course);
    }
  });

  // Sort mentioned courses by ranking > recommendation > position
  mentionedCourses.sort((a, b) => {
    const refA = referenceMap.get(a.id?.toString() || '');
    const refB = referenceMap.get(b.id?.toString() || '');
    
    // First: Ranked courses
    if (refA?.ranking && !refB?.ranking) return -1;
    if (!refA?.ranking && refB?.ranking) return 1;
    if (refA?.ranking && refB?.ranking) {
      return refA.ranking - refB.ranking;
    }
    
    // Second: Recommended courses
    const priorityA = BADGE_PRIORITIES[refA?.badgeType || null];
    const priorityB = BADGE_PRIORITIES[refB?.badgeType || null];
    if (priorityA !== priorityB) {
      return priorityB - priorityA; // Higher priority first
    }
    
    // Third: Position in text
    return (refA?.position || 0) - (refB?.position || 0);
  });

  console.log('🎯 Smart ordering applied:', {
    mentioned: mentionedCourses.length,
    unmentioned: unmentionedCourses.length,
    order: mentionedCourses.map(c => ({
      id: c.id,
      title: c.title?.substring(0, 30),
      ref: referenceMap.get(c.id?.toString() || '')
    }))
  });

  // Return mentioned courses first, then unmentioned
  return [...mentionedCourses, ...unmentionedCourses];
}

/**
 * ENHANCED: Check if course should be displayed (stricter logic)
 */
export function shouldDisplayCourse(
  course: any,
  messageContent: string,
  showAllByDefault: boolean = true
): boolean {
  if (!messageContent || showAllByDefault) {
    return true;
  }

  const lowerContent = messageContent.toLowerCase();
  const courseTitle = course.title?.toLowerCase() || '';
  const courseSlug = course.slug?.toLowerCase() || '';

  // Check if course is mentioned by title or slug
  return (
    (courseTitle && lowerContent.includes(courseTitle)) ||
    (courseSlug && lowerContent.includes(courseSlug))
  );
}

/**
 * ENHANCED: Add recommendation context with badge type and ranking
 */
export function enhanceCourseWithRecommendationContext(
  course: any,
  messageContent: string,
  previouslyShownCourseIds: string[] = []
): any {
  if (!messageContent) {
    return course;
  }

  const references = extractCourseReferences(messageContent, [course], previouslyShownCourseIds);
  
  if (references.length > 0) {
    const ref = references[0];
    return {
      ...course,
      _isRecommended: ref.isRecommended,
      _badgeType: ref.badgeType,
      _ranking: ref.ranking,
      _isDuplicate: ref.isDuplicate,
      _recommendationContext: ref.context
    };
  }

  return course;
}

/**
 * ENHANCED: Extract courses mentioned in follow-up messages
 * This handles cases like "show me that course again" or "tell me more about X"
 */
export function extractCoursesFromFollowUp(
  messageContent: string,
  allAvailableCourses: any[],
  conversationHistory: any[] = []
): any[] {
  if (!messageContent || !allAvailableCourses || allAvailableCourses.length === 0) {
    return [];
  }

  const lowerContent = messageContent.toLowerCase();
  const matchedCourses: any[] = [];

  // Patterns indicating follow-up about specific courses
  const followUpPatterns = [
    'zeig',
    'show',
    'details',
    'mehr',
    'more',
    'apply',
    'bewerben',
    'dieser kurs',
    'this course',
    'that course',
    'der kurs',
    'den kurs'
  ];

  const isFollowUp = followUpPatterns.some(pattern => lowerContent.includes(pattern));

  if (isFollowUp) {
    // Extract course titles mentioned
    for (const course of allAvailableCourses) {
      const courseTitle = course.title?.toLowerCase() || '';
      if (courseTitle && lowerContent.includes(courseTitle)) {
        matchedCourses.push(course);
      }
    }

    console.log('🔄 Follow-up detected, matched courses:', matchedCourses.length);
  }

  return matchedCourses;
}

/**
 * Get badge label for display
 */
export function getBadgeLabel(badgeType: 'top-wahl' | 'empfehlung' | 'alternative' | null, language: 'de' | 'en' = 'de'): string {
  if (!badgeType) return '';
  
  const labels = {
    'top-wahl': { de: 'Top-Wahl', en: 'Top Choice' },
    'empfehlung': { de: 'Empfohlen', en: 'Recommended' },
    'alternative': { de: 'Alternative', en: 'Alternative' }
  };
  
  return labels[badgeType][language];
}
