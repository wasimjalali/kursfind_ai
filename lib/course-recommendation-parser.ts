/**
 * Course Recommendation Parser
 * 
 * Extracts course references from AI assistant messages and orders courses
 * based on their mention order in the recommendation text.
 * 
 * Feature Flag: ENABLE_SMART_CARD_ORDERING
 */

export interface CourseReference {
  courseId: string;
  position: number; // Position in text (for ordering)
  context: string; // Surrounding text
  isRecommended: boolean; // Explicitly recommended vs. mentioned
}

/**
 * Extract course IDs, slugs, and titles mentioned in the assistant's message
 */
export function extractCourseReferences(
  messageContent: string,
  availableCourses: any[]
): CourseReference[] {
  if (!messageContent || !availableCourses || availableCourses.length === 0) {
    return [];
  }

  const references: CourseReference[] = [];
  const lowerContent = messageContent.toLowerCase();

  // Patterns that indicate a recommendation
  const recommendationPatterns = [
    'empfehle',
    'empfehlung',
    'top-wahl',
    'beste wahl',
    'recommend',
    'top choice',
    'alternative',
    'perfekt für',
    'ideal für',
    'passend',
    'geeignet'
  ];

  availableCourses.forEach((course, index) => {
    if (!course) return;

    const courseTitle = course.title?.toLowerCase() || '';
    const courseSlug = course.slug?.toLowerCase() || '';
    const courseId = course.id?.toString() || '';

    // Check if course title is mentioned in the message
    if (courseTitle && lowerContent.includes(courseTitle)) {
      const position = lowerContent.indexOf(courseTitle);
      const contextStart = Math.max(0, position - 50);
      const contextEnd = Math.min(lowerContent.length, position + courseTitle.length + 50);
      const context = messageContent.substring(contextStart, contextEnd);

      // Check if it's explicitly recommended
      const isRecommended = recommendationPatterns.some(pattern => 
        context.toLowerCase().includes(pattern)
      );

      references.push({
        courseId: courseId,
        position,
        context,
        isRecommended
      });
    }
    // Also check for slug mentions (e.g., in links)
    else if (courseSlug && lowerContent.includes(courseSlug)) {
      const position = lowerContent.indexOf(courseSlug);
      references.push({
        courseId: courseId,
        position,
        context: '',
        isRecommended: false
      });
    }
  });

  // Sort by position in text
  return references.sort((a, b) => a.position - b.position);
}

/**
 * Reorder courses based on their mention order in the AI message
 * Recommended courses come first, then others in order of mention
 */
export function orderCoursesByRecommendation(
  courses: any[],
  messageContent: string
): any[] {
  if (!messageContent || !courses || courses.length === 0) {
    return courses;
  }

  const references = extractCourseReferences(messageContent, courses);

  if (references.length === 0) {
    // No specific mentions, return original order
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
    const courseId = course.id?.toString();
    if (referenceMap.has(courseId)) {
      mentionedCourses.push(course);
    } else {
      unmentionedCourses.push(course);
    }
  });

  // Sort mentioned courses by their position in text
  mentionedCourses.sort((a, b) => {
    const refA = referenceMap.get(a.id?.toString());
    const refB = referenceMap.get(b.id?.toString());
    
    // Recommended courses come first
    if (refA?.isRecommended !== refB?.isRecommended) {
      return refA?.isRecommended ? -1 : 1;
    }
    
    // Then by position in text
    return (refA?.position || 0) - (refB?.position || 0);
  });

  // Return mentioned courses first, then unmentioned
  return [...mentionedCourses, ...unmentionedCourses];
}

/**
 * Check if a course should be displayed based on message context
 * Only show courses that are explicitly mentioned or recommended
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
 * Add recommendation badge to courses mentioned in the message
 */
export function enhanceCourseWithRecommendationContext(
  course: any,
  messageContent: string
): any {
  if (!messageContent) {
    return course;
  }

  const references = extractCourseReferences(messageContent, [course]);
  
  if (references.length > 0 && references[0].isRecommended) {
    return {
      ...course,
      _isRecommended: true,
      _recommendationContext: references[0].context
    };
  }

  return course;
}

