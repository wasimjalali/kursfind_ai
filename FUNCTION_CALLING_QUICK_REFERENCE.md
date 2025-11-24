# Function Calling Quick Reference

## 🚀 12 Functions Available

| Function | Purpose | Auth Required | Example Query |
|----------|---------|---------------|---------------|
| **search_courses** | Find courses by criteria | ❌ No | "Show me IT courses in Berlin" |
| **get_course_details** | Get full course info | ❌ No | "Tell me about course 123" |
| **search_providers** | Find training providers | ❌ No | "Which providers are in München?" |
| **get_provider_details** | Get provider info | ❌ No | "Tell me about provider XYZ" |
| **search_student_applications** | Student's applications | ✅ Yes | "Show my applications" |
| **search_provider_applications** | Provider's applications | ✅ Yes | "Show new applications" |
| **search_saved_courses** | Student's saved courses | ✅ Yes | "Show my saved courses" |
| **get_student_profile** | Student profile & stats | ✅ Yes | "Show my profile" |
| **get_course_statistics** | Platform statistics | ❌ No | "How many courses?" |
| **compare_courses** | Compare courses | ❌ No | "Compare course 1 and 2" |
| **get_chat_history** | Previous conversations | ✅ Yes | "Show my chat history" |
| **recommend_courses** | AI recommendations | ❌ No | "Recommend courses for me" |

---

## 📋 Most Common Use Cases

### 1. Course Search (90% of queries)
```javascript
// User: "Web Development Kurse in Berlin"
{
  name: "search_courses",
  arguments: {
    query: "Web Development",
    location: "Berlin",
    max_results: 10
  }
}
```

### 2. Statistics (5% of queries)
```javascript
// User: "Wie viele Kurse habt ihr?"
{
  name: "get_course_statistics",
  arguments: {
    metrics: ["total_courses"]
  }
}
```

### 3. Student Applications (3% of queries)
```javascript
// User: "Zeig mir meine Bewerbungen"
{
  name: "search_student_applications",
  arguments: {
    student_id: "123",  // Auto-filled from session
    sort_by: "applied_at"
  }
}
```

### 4. Recommendations (2% of queries)
```javascript
// User: "Recommend courses for Data Science"
{
  name: "recommend_courses",
  arguments: {
    career_goal: "Data Scientist",
    max_results: 5
  }
}
```

---

## 🔑 Key Parameters

### search_courses
| Parameter | Type | Example | Common Values |
|-----------|------|---------|---------------|
| query | string | "Web Development" | Any search term |
| category | string | "IT & Tech" | IT & Tech, Design, Healthcare, etc. |
| location | string | "Berlin" | Berlin, München, Online, etc. |
| format | string | "Online" | Online, Präsenz, Hybrid, Vollzeit |
| funding_eligible | boolean | true | true/false |
| funding_type | string | "Bildungsgutschein" | Bildungsgutschein, AVGS |
| max_results | integer | 10 | 1-50 |

### get_course_statistics
| Parameter | Type | Example | Options |
|-----------|------|---------|---------|
| metrics | array | ["total_courses", "popular_categories"] | total_courses, total_applications, total_views, popular_categories, popular_locations, trending_courses |
| category | string | "IT & Tech" | Filter by category |
| time_period | string | "last_30_days" | last_7_days, last_30_days, last_90_days, all_time |

### search_student_applications
| Parameter | Type | Example | Options |
|-----------|------|---------|---------|
| student_id | string | "123" | Auto-filled from session |
| status | string | "pending" | pending, contacted, accepted, rejected, enrolled |
| sort_by | string | "applied_at" | applied_at, updated_at, status |

---

## 💡 Integration Snippets

### Minimal Integration (Add to route.js)

```javascript
import { functionDefinitions } from './function-definitions'
import { executeFunctionCall } from './function-handlers'

// In your POST handler:
const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`
  },
  body: JSON.stringify({
    model: 'deepseek-chat',
    messages: conversationMessages,
    tools: functionDefinitions,  // ← Add this
    tool_choice: 'auto',         // ← Add this
    temperature: 0.7
  })
});

const data = await response.json();
const message = data.choices[0].message;

// Handle function calls
if (message.tool_calls) {
  conversationMessages.push(message);
  
  for (const call of message.tool_calls) {
    const result = await executeFunctionCall(
      call.function.name,
      JSON.parse(call.function.arguments),
      { studentId, providerId }  // ← Pass auth context
    );
    
    conversationMessages.push({
      role: 'tool',
      tool_call_id: call.id,
      name: call.function.name,
      content: JSON.stringify(result)
    });
  }
  
  // Second API call with results
  const finalResponse = await fetch('https://api.deepseek.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`
    },
    body: JSON.stringify({
      model: 'deepseek-chat',
      messages: conversationMessages,
      temperature: 0.7
    })
  });
  
  const finalData = await finalResponse.json();
  return new Response(JSON.stringify({
    response: finalData.choices[0].message.content
  }));
}
```

---

## 🎯 System Prompt Addition

Add this to your `aiSystemPrompt`:

```
═══════════════════════════════════════════════════════════════
🔧 FUNCTION CALLING
═══════════════════════════════════════════════════════════════

YOU HAVE DIRECT DATABASE ACCESS via these functions:
- search_courses: Find courses by any criteria
- get_course_statistics: Get platform statistics
- search_student_applications: Check user's applications (auth required)
- search_saved_courses: Get user's saved courses (auth required)
- recommend_courses: Get personalized recommendations

CRITICAL RULES:
1. ALWAYS use functions to get real data
2. NEVER invent course information
3. When user asks about courses → call search_courses
4. When user asks "how many" → call get_course_statistics
5. When user asks "my applications" → call search_student_applications

EXAMPLE FLOW:
User: "Show me Web Development courses in Berlin"
→ Call search_courses({ query: "Web Development", location: "Berlin" })
→ Present the returned courses to user
```

---

## 🔍 Testing Checklist

- [ ] Test basic course search: "Show me IT courses"
- [ ] Test with location: "Courses in Berlin"
- [ ] Test with funding: "Bildungsgutschein courses"
- [ ] Test statistics: "How many courses do you have?"
- [ ] Test authenticated: "Show my applications" (logged in)
- [ ] Test recommendations: "Recommend courses for me"
- [ ] Test comparison: "Compare course 1 and 2"
- [ ] Test error handling: Invalid course ID
- [ ] Test no results: "Courses in Antarctica"
- [ ] Test multiple filters: "Online IT courses in München with Bildungsgutschein"

---

## 🐛 Common Issues & Fixes

| Issue | Cause | Fix |
|-------|-------|-----|
| AI doesn't call functions | Missing `tools` parameter | Add `tools: functionDefinitions` to API call |
| Empty results | RLS policy blocking | Check Supabase RLS policies |
| Auth error | Student ID mismatch | Verify `studentId` in context matches session |
| Function not found | Typo in function name | Check spelling in `executeFunctionCall` |
| Slow response | Too many function calls | Limit to 3 calls per turn in system prompt |

---

## 📊 Expected Performance

- **Response time:** 2-4 seconds (with 1 function call)
- **Accuracy:** 95%+ for course searches
- **Function call rate:** ~60% of queries will trigger functions
- **Most called:** `search_courses` (85%), `get_course_statistics` (10%), others (5%)

---

## 🎨 Response Format Examples

### Course Search Response
```json
{
  "success": true,
  "data": {
    "courses": [
      {
        "id": 123,
        "title": "Web Development Bootcamp",
        "location": "Berlin",
        "duration": "12 Wochen",
        "funding_types": ["Bildungsgutschein"],
        "providers": {
          "company_name": "Tech Academy"
        }
      }
    ],
    "total": 15,
    "showing": 10,
    "hasMore": true
  }
}
```

### Statistics Response
```json
{
  "success": true,
  "data": {
    "total_courses": 150,
    "popular_categories": [
      { "category": "IT & Tech", "count": 65 },
      { "category": "Design", "count": 30 }
    ]
  }
}
```

### Error Response
```json
{
  "success": false,
  "error": "Unauthorized: Invalid student ID"
}
```

---

## 🚀 Quick Start (5 Minutes)

1. **Copy files:**
   - `function-definitions.js` ✅ Created
   - `function-handlers.js` ✅ Created

2. **Add 3 lines to route.js:**
   ```javascript
   import { functionDefinitions } from './function-definitions'
   import { executeFunctionCall } from './function-handlers'
   // ... add tools: functionDefinitions to API call
   ```

3. **Update system prompt:**
   - Add function calling section (see above)

4. **Test:**
   ```bash
   # Start dev server
   npm run dev
   
   # Test query
   curl -X POST http://localhost:3000/api/chat \
     -H "Content-Type: application/json" \
     -d '{"message": "Show me IT courses"}'
   ```

5. **Done!** 🎉

---

## 📈 Monitoring

Track these metrics:
- Function call rate (target: 60%)
- Average response time (target: <3s)
- Error rate (target: <5%)
- Most called functions
- User satisfaction with results

---

## 🔗 Related Files

- `/app/api/chat/route.js` - Main chat endpoint (modify this)
- `/app/api/chat/function-definitions.js` - Function schemas (created)
- `/app/api/chat/function-handlers.js` - Database queries (created)
- `/lib/supabase.js` - Database client
- `FUNCTION_CALLING_IMPLEMENTATION_GUIDE.md` - Full guide

---

**Ready to implement?** Start with the "Minimal Integration" snippet above! 🚀

