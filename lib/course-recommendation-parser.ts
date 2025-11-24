/**
 * Course Recommendation Parser - PRECISION VERSION
 * 
 * CRITICAL RULES:
 * 1. Only ONE "Top-Wahl" badge per message (nearest to "top" phrases)
 * 2. Other courses get "Empfohlen" or "Alternative" badges
 * 3. Re-evaluate badges on every render
 * 4. "Zuvor gezeigt" positioning based on badge presence
 * 
 * Feature Flags: SMART_CARD_ORDERING, STRICT_BADGE_ASSIGNMENT
 */

export interface CourseReference {
  courseId: string;
  position: number;
  context: string;
  isRecommended: boolean;
  badgeType: 'top-wahl' | 'empfehlung' | 'alternative' | null;
  ranking: number | null;
  isDuplicate: boolean;
  distanceFromTopPhrase: number; // NEW: Distance to nearest "top" phrase
}

/**
 * Badge priorities (for conflict resolution)
 */
const BADGE_PRIORITIES = {
  'top-wahl': 3,
  'empfehlung': 2,
  'alternative': 1,
  null: 0
};

/**
 * TOP PHRASES - Only these create Top-Wahl candidates
 */
const TOP_PHRASES = [
  'top recommendation',
  'top pick',
  'top choice',
  'top-wahl',
  'beste wahl',
  'best option',
  'first choice',
  'beste option',
  'definitely the',
  'meine top',
  'my top'
];

/**
 * EMPFEHLUNG PHRASES - For recommended but not top
 */
const EMPFEHLUNG_PHRASES = [
  'empfehle',
  'empfehlung',
  'recommend',
  'perfekt für',
  'ideal für',
  'perfect for',
  'ideal for',
  'besonders gut',
  'highly recommend',
  'great option',
  'excellent choice'
];

/**
 * ALTERNATIVE PHRASES - For alternatives
 */
const ALTERNATIVE_PHRASES = [
  'alternative',
  'auch gut',
  'weitere option',
  'another option',
  'passend',
  'geeignet',
  'also consider',
  'ebenfalls'
];

/**
 * Ranking patterns
 */
const RANKING_PATTERNS = [
  /(?:top|erste|first)\s*(?:wahl|choice|option)?[\s:]*(\d+)/i,
  /(?:position|rang|rank)[\s:]*(\d+)/i,
  /^(\d+)[\.)\s]/m,
  /🥇.*?(\d+)/i,
  /🥈.*?(\d+)/i,
  /🥉.*?(\d+)/i,
  /nummer[\s:]*(\d+)/i,
  /number[\s:]*(\d+)/i
];

/**
 * Find distance to nearest phrase in text
 */
function findNearestPhraseDistance(
  text: string,
  targetPosition: number,
  phrases: string[]
): number {
  let minDistance = Infinity;
  const lowerText = text.toLowerCase();

  for (const phrase of phrases) {
    let searchPos = 0;
    while (true) {
      const foundPos = lowerText.indexOf(phrase, searchPos);
      if (foundPos === -1) break;

      const distance = Math.abs(foundPos - targetPosition);
      if (distance < minDistance) {
        minDistance = distance;
      }

      searchPos = foundPos + 1;
    }
  }

  return minDistance;
}

/**
 * ENHANCED: Extract course references with STRICT badge logic
 * FEATURE_FLAG: STRICT_BADGE_ASSIGNMENT
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

  // Step 1: Find all course mentions
  availableCourses.forEach((course) => {
    if (!course) return;

    const courseTitle = course.title?.toLowerCase() || '';
    const courseSlug = course.slug?.toLowerCase() || '';
    const courseId = course.id?.toString() || '';

    if (courseTitle && lowerContent.includes(courseTitle)) {
      const position = lowerContent.indexOf(courseTitle);
      
      // Get context (±100 chars)
      const contextStart = Math.max(0, position - 100);
      const contextEnd = Math.min(lowerContent.length, position + courseTitle.length + 100);
      const context = messageContent.substring(contextStart, contextEnd);
      const contextLower = context.toLowerCase();

      // Calculate distances to phrase types
      const distanceToTop = findNearestPhraseDistance(lowerContent, position, TOP_PHRASES);
      const distanceToEmpfehlung = findNearestPhraseDistance(lowerContent, position, EMPFEHLUNG_PHRASES);
      const distanceToAlternative = findNearestPhraseDistance(lowerContent, position, ALTERNATIVE_PHRASES);

      // Initial badge assignment (will be refined later)
      let badgeType: 'top-wahl' | 'empfehlung' | 'alternative' | null = null;
      let minDistance = Math.min(distanceToTop, distanceToEmpfehlung, distanceToAlternative);

      // Only assign badge if within 100 chars
      if (minDistance <= 100) {
        if (distanceToTop === minDistance) {
          badgeType = 'top-wahl'; // Candidate for top-wahl
        } else if (distanceToEmpfehlung === minDistance) {
          badgeType = 'empfehlung';
        } else if (distanceToAlternative === minDistance) {
          badgeType = 'alternative';
        }
      }

      // Extract ranking
      let ranking: number | null = null;
      for (const regex of RANKING_PATTERNS) {
        const match = context.match(regex);
        if (match && match[1]) {
          ranking = parseInt(match[1], 10);
          break;
        }
      }

      const isDuplicate = previouslyShownCourseIds.includes(courseId);

      references.push({
        courseId,
        position,
        context,
        isRecommended: badgeType !== null,
        badgeType,
        ranking,
        isDuplicate,
        distanceFromTopPhrase: distanceToTop
      });

      console.log('🔍 Course reference found:', {
        title: course.title?.substring(0, 30),
        badgeType,
        distanceToTop,
        distanceToEmpfehlung,
        distanceToAlternative,
        isDuplicate
      });
    }
  });

  // Step 2: CRITICAL - Ensure only ONE Top-Wahl per message
  // Find the course CLOSEST to any "top" phrase
  const topCandidates = references.filter(ref => ref.badgeType === 'top-wahl');
  
  if (topCandidates.length > 1) {
    console.log('⚠️ Multiple Top-Wahl candidates, selecting nearest to "top" phrase');
    
    // Sort by distance to top phrase
    topCandidates.sort((a, b) => a.distanceFromTopPhrase - b.distanceFromTopPhrase);
    
    // Keep only the first (nearest) as Top-Wahl
    const winner = topCandidates[0];
    
    // Downgrade others to Empfehlung
    topCandidates.slice(1).forEach(candidate => {
      candidate.badgeType = 'empfehlung';
      candidate.isRecommended = true;
    });
    
    console.log('✅ Top-Wahl assigned to:', winner.courseId, 'distance:', winner.distanceFromTopPhrase);
  }

  // Sort by ranking > position
  references.sort((a, b) => {
    if (a.ranking && !b.ranking) return -1;
    if (!a.ranking && b.ranking) return 1;
    if (a.ranking && b.ranking) return a.ranking - b.ranking;
    return a.position - b.position;
  });

  return references;
}

/**
 * ENHANCED: Reorder courses with strict badge logic
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
    console.log('📋 No course mentions found, using original order');
    return courses;
  }

  const referenceMap = new Map(
    references.map(ref => [ref.courseId, ref])
  );

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

  // Sort: Top-Wahl > Empfehlung > Alternative > Position
  mentionedCourses.sort((a, b) => {
    const refA = referenceMap.get(a.id?.toString() || '');
    const refB = referenceMap.get(b.id?.toString() || '');
    
    // Ranking first
    if (refA?.ranking && !refB?.ranking) return -1;
    if (!refA?.ranking && refB?.ranking) return 1;
    if (refA?.ranking && refB?.ranking) return refA.ranking - refB.ranking;
    
    // Badge priority
    const priorityA = BADGE_PRIORITIES[refA?.badgeType || null];
    const priorityB = BADGE_PRIORITIES[refB?.badgeType || null];
    if (priorityA !== priorityB) return priorityB - priorityA;
    
    // Position in text
    return (refA?.position || 0) - (refB?.position || 0);
  });

  console.log('🎯 Smart ordering applied:', {
    mentioned: mentionedCourses.length,
    badgeDistribution: {
      topWahl: references.filter(r => r.badgeType === 'top-wahl').length,
      empfohlen: references.filter(r => r.badgeType === 'empfehlung').length,
      alternative: references.filter(r => r.badgeType === 'alternative').length
    }
  });

  return [...mentionedCourses, ...unmentionedCourses];
}

/**
 * Check if course should be displayed
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

  return (
    (courseTitle && lowerContent.includes(courseTitle)) ||
    (courseSlug && lowerContent.includes(courseSlug))
  );
}

/**
 * ENHANCED: Add recommendation context with strict badge logic
 * ALWAYS re-evaluates on every render
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
      _recommendationContext: ref.context,
      _distanceFromTopPhrase: ref.distanceFromTopPhrase
    };
  }

  return course;
}

/**
 * Extract courses from follow-up messages
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
 * Get badge label
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

/**
 * Determine "Zuvor gezeigt" position based on badge presence
 * FEATURE_FLAG: SMART_DUPLICATE_POSITIONING
 */
export function getDuplicateIndicatorPosition(hasBadge: boolean): 'bottom-left' | 'top-ribbon' {
  return hasBadge ? 'bottom-left' : 'top-ribbon';
}
