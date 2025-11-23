# AI Smart Course Search Implementation

## Overview

This implementation adds a smart course search function for the AI chatbot that intelligently extracts user intent and returns only relevant courses.

## Files Created

### 1. `/app/api/ai/search-courses/route.js`
- New API endpoint for smart course search
- Accepts search parameters: query, category, format, location, funding, language
- Supports pagination (maxResults, offset)
- Returns courses with provider data
- Orders by popularity (view_count) then by created_at

### 2. `/app/api/ai/extract-intent.js`
- Helper function to extract search intent from natural language
- Detects:
  - Category keywords (IT, Marketing, Design, etc.)
  - Format preferences (Online, Präsenz, Hybrid)
  - Location mentions (Berlin, München, Hamburg, etc.)
  - Funding types (Bildungsgutschein, AVGS, etc.)
  - Language preferences (Deutsch, English, etc.)
  - Main search query (cleaned from filter words)

## Integration

### Updated `/app/api/chat/route.js`
- Imports `extractSearchIntent` function
- Uses smart search API instead of basic keyword matching
- Extracts user intent before searching
- Passes extracted filters to search API
- Falls back to basic search if API fails

## How It Works

### 1. User Message Analysis
```
User: "I want to learn Python online in Berlin"
→ Extracted Intent:
{
  query: "Python",
  category: "IT & Programmierung",
  format: "Online",
  location: "Berlin"
}
```

### 2. Smart Search API Call
```javascript
POST /api/ai/search-courses
{
  query: "Python",
  category: "IT & Programmierung",
  format: "Online",
  location: "Berlin",
  maxResults: 10,
  offset: 0
}
```

### 3. AI Response Format
- Contextual introduction: "Ich habe 5 passende IT-Kurse in Berlin für dich gefunden:"
- Shows course cards (max 10)
- Mentions if more results exist: "Es gibt noch 15 weitere Kurse. Möchtest du mehr sehen?"

## Features

### ✅ Smart Intent Extraction
- Detects category from keywords
- Extracts location from message
- Identifies format preferences
- Recognizes funding types
- Cleans search query

### ✅ Intelligent Filtering
- Combines multiple filters with AND logic
- Searches across title, description, subtitle
- Filters by exact matches for category, location, format, language
- Checks funding_types array for funding options

### ✅ Pagination Support
- Returns max 10 courses at a time
- Includes `hasMore` flag
- Provides `nextOffset` for next page
- Total count included

### ✅ Validation
- Only shows courses matching user intent
- Verifies category matches
- Doesn't mix unrelated courses
- Provides context about what's being shown

## Example Queries

### Example 1: Simple Category Search
```
User: "I want to learn Python"
→ Intent: { query: "Python", category: "IT & Programmierung" }
→ Shows: Only IT/Programming courses with Python
```

### Example 2: Multi-Filter Search
```
User: "Show me IT courses in Berlin with Bildungsgutschein"
→ Intent: { 
  category: "IT & Programmierung",
  location: "Berlin",
  funding: "Bildungsgutschein"
}
→ Shows: Only IT courses in Berlin with Bildungsgutschein funding
```

### Example 3: Format-Specific Search
```
User: "I need a marketing course online"
→ Intent: { 
  query: "marketing",
  category: "Marketing & SEO",
  format: "Online"
}
→ Shows: Only online marketing courses
```

## Edge Cases Handled

1. **No Results Found**
   - AI responds: "Leider habe ich keine passenden Kurse gefunden. Kann ich dir mit anderen Kriterien helfen?"

2. **Too Many Results**
   - Shows top 10 (most popular first)
   - Offers to refine search or show more

3. **Ambiguous Request**
   - AI asks clarifying questions before searching

4. **API Failure**
   - Falls back to basic search
   - Logs error for debugging

## Testing Checklist

- [ ] Test simple category search: "I want to learn Python"
- [ ] Test multi-filter: "IT courses in Berlin online"
- [ ] Test format filter: "Show me online courses"
- [ ] Test location filter: "Courses in München"
- [ ] Test funding filter: "Courses with Bildungsgutschein"
- [ ] Test language filter: "English courses"
- [ ] Test pagination: "Show more courses"
- [ ] Test no results: Search for non-existent category
- [ ] Test API failure: Verify fallback works
- [ ] Test intent extraction accuracy

## Next Steps

1. Add "Show More" button in chat UI
2. Implement pagination in chat component
3. Add search result validation
4. Improve intent extraction accuracy
5. Add search history/refinement

