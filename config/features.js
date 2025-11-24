/**
 * Feature Flags Configuration
 * 
 * Centralized feature toggles for easy management and testing
 * 
 * HOW TO USE:
 * - Set feature to true to enable
 * - Set feature to false to disable
 * - Features can be toggled without code changes
 * - Useful for A/B testing and gradual rollouts
 */

export const FEATURES = {
  // ══════════════════════════════════════════════════════════════
  // SMART CARD ORDERING (PRECISION VERSION - v2)
  // ══════════════════════════════════════════════════════════════
  // Automatically reorders course cards based on AI recommendations
  // Cards mentioned in AI text appear first with badges
  SMART_CARD_ORDERING: true,
  
  // STRICT: Only ONE "Top-Wahl" badge per message (nearest to "top" phrase)
  // Other courses get "Empfohlen" or "Alternative" badges
  STRICT_BADGE_ASSIGNMENT: true,
  
  // Show badges on recommended courses (Top-Wahl, Empfohlen, Alternative)
  SHOW_RECOMMENDATION_BADGE: true,
  
  // Show ranking badges (🥇 Top 1, 🥈 Top 2, etc.)
  SHOW_RANKING_BADGES: true,
  
  // Show "Previously shown" indicator on duplicate courses
  SHOW_DUPLICATE_INDICATOR: true,
  
  // Smart positioning: bottom-left when badge present, ribbon when no badge
  SMART_DUPLICATE_POSITIONING: true,
  
  // Re-render course cards in follow-up messages
  ENABLE_FOLLOW_UP_CARD_RENDERING: true,
  
  // Re-evaluate badge logic on every render (not cached)
  DYNAMIC_BADGE_EVALUATION: true,
  
  // ══════════════════════════════════════════════════════════════
  // CITY FALLBACK SEARCH
  // ══════════════════════════════════════════════════════════════
  // Automatically searches nearby cities when no results in requested city
  // Includes online/remote courses as fallback
  CITY_FALLBACK_SEARCH: true,
  
  // Maximum number of fallback cities to search
  MAX_FALLBACK_CITIES: 3,
  
  // Include online/remote courses in fallback
  INCLUDE_ONLINE_IN_FALLBACK: true,
  
  // ══════════════════════════════════════════════════════════════
  // SEARCH ENHANCEMENTS
  // ══════════════════════════════════════════════════════════════
  // Expand search terms with synonyms
  KEYWORD_EXPANSION: true,
  
  // Multi-field search (title, description, category, subtitle)
  MULTI_FIELD_SEARCH: true,
  
  // Category-based fallback when no direct matches
  CATEGORY_FALLBACK: true,
  
  // ══════════════════════════════════════════════════════════════
  // COURSE PERSISTENCE
  // ══════════════════════════════════════════════════════════════
  // Save course cards with chat history
  SAVE_COURSES_IN_HISTORY: true,
  
  // Load courses when reopening chat
  LOAD_COURSES_FROM_HISTORY: true,
  
  // ══════════════════════════════════════════════════════════════
  // UI/UX FEATURES
  // ══════════════════════════════════════════════════════════════
  // Show match reason for each course
  SHOW_MATCH_REASON: true,
  
  // Show provider logo on course cards
  SHOW_PROVIDER_LOGO: true,
  
  // Animate course card appearance
  ANIMATE_CARDS: false, // Set to true if you want animations
  
  // ══════════════════════════════════════════════════════════════
  // LOGGING & DEBUGGING
  // ══════════════════════════════════════════════════════════════
  // Enable detailed console logging
  VERBOSE_LOGGING: true,
  
  // Log function call performance
  LOG_PERFORMANCE: true,
  
  // Log search query expansions
  LOG_SEARCH_EXPANSION: true
};

/**
 * Get feature flag value
 * @param {string} featureName - Name of the feature
 * @returns {boolean} - Whether feature is enabled
 */
export function isFeatureEnabled(featureName) {
  return FEATURES[featureName] === true;
}

/**
 * Get all enabled features
 * @returns {string[]} - Array of enabled feature names
 */
export function getEnabledFeatures() {
  return Object.keys(FEATURES).filter(key => FEATURES[key] === true);
}

/**
 * Feature flag usage examples:
 * 
 * In page.tsx:
 * ```
 * import { FEATURES } from '@/config/features';
 * 
 * if (FEATURES.SMART_CARD_ORDERING) {
 *   coursesToDisplay = orderCoursesByRecommendation(courses, message.content);
 * }
 * ```
 * 
 * In function-handlers.js:
 * ```
 * import { FEATURES } from '@/config/features';
 * 
 * if (FEATURES.CITY_FALLBACK_SEARCH && (!courses || courses.length === 0)) {
 *   // Perform city fallback search
 * }
 * ```
 */

export default FEATURES;

