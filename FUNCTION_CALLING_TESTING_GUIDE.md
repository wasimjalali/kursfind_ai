# Function Calling Testing Guide

## ✅ Implementation Complete!

Your `route.js` has been fully updated with OpenAI/DeepSeek-style function calling support.

---

## 🎯 What Changed

### ✅ **Before:**
- Static course data in system prompt
- Manual course search logic
- 4000+ line system prompts
- Limited search capabilities

### ✅ **After:**
- Dynamic function calling
- AI decides when to query database
- Clean 250-line system prompt
- 12 powerful functions available
- Structured JSON responses
- Real-time database queries

---

## 🔧 Key Implementation Features

### 1. **Function Definitions Import**
```javascript
import { functionDefinitions } from './function-definitions'
import { executeFunctionCall } from './function-handlers'
```

### 2. **Two-Step API Call Pattern**
```javascript
// Step 1: AI decides if it needs functions
const firstApiCall = await fetch('https://api.deepseek.com/v1/chat/completions', {
  body: JSON.stringify({
    model: 'deepseek-chat',
    messages: conversationMessages,
    tools: functionDefinitions,  // ✅ Functions available
    tool_choice: 'auto'          // ✅ AI decides when to use
  })
});

// Step 2: If functions called, execute and get final response
if (assistantMessage.tool_calls) {
  // Execute functions
  for (const toolCall of assistantMessage.tool_calls) {
    const result = await executeFunctionCall(
      toolCall.function.name,
      JSON.parse(toolCall.function.arguments),
      { studentId, providerId }
    );
    
    // Add result as JSON to conversation
    conversationMessages.push({
      role: 'tool',
      tool_call_id: toolCall.id,
      content: JSON.stringify(result)  // ✅ Structured JSON
    });
  }
  
  // Get final AI response with function results
  const secondApiCall = await fetch(...);
}
```

### 3. **Authentication Context**
```javascript
const context = {
  studentId: studentId,      // For student-specific functions
  providerId: providerId,    // For provider-specific functions
  authUserId: user?.id       // Supabase auth UUID
};
```

### 4. **Structured JSON Responses**
```javascript
// Function results are returned as structured JSON
{
  success: true,
  data: {
    courses: [...],
    total: 150,
    showing: 10,
    hasMore: true
  }
}
```

### 5. **Course Extraction**
```javascript
// If search_courses was called, extract courses for frontend
if (functionName === 'search_courses' && functionResult.success) {
  coursesToReturn = functionResult.data.courses;
}
```

---

## 🧪 Testing Scenarios

### Test 1: Basic Course Search (Most Common - 85%)

**User Query:**
```
"Show me Web Development courses in Berlin"
```

**Expected Flow:**
1. ✅ AI receives query
2. ✅ AI calls `search_courses({ query: "Web Development", location: "Berlin" })`
3. ✅ Function queries Supabase database
4. ✅ Returns JSON with matching courses
5. ✅ AI generates natural language response
6. ✅ Frontend receives courses array + AI message

**How to Test:**
```bash
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [
      {"role": "user", "content": "Show me Web Development courses in Berlin"}
    ]
  }'
```

**Expected Response:**
```json
{
  "message": "Ich habe 5 passende Web Development Kurse in Berlin gefunden: [courses displayed as cards]",
  "response": "...",
  "courses": [
    {
      "id": 123,
      "title": "Web Development Bootcamp",
      "location": "Berlin",
      "duration": "12 Wochen",
      "providers": {
        "company_name": "Tech Academy"
      }
    }
  ],
  "function_calls": [
    {
      "name": "search_courses",
      "result": { "success": true, "data": {...} }
    }
  ]
}
```

**Check Console Logs:**
```
🔵 API /chat called with function calling enabled
🔧 Function definitions available: 12
📞 Calling function: search_courses
✅ Function result: { success: true, dataKeys: ['courses', 'total', 'showing'] }
📚 Courses to return: 5
✅ Final AI message generated from function results
```

---

### Test 2: Statistics Query (10%)

**User Query:**
```
"How many courses do you have?"
```

**Expected Flow:**
1. ✅ AI calls `get_course_statistics({ metrics: ["total_courses"] })`
2. ✅ Function counts courses in database
3. ✅ Returns `{ total_courses: 150 }`
4. ✅ AI responds: "We have 150 courses available on Kursfind AI"

**How to Test:**
```bash
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [
      {"role": "user", "content": "Wie viele Kurse habt ihr?"}
    ]
  }'
```

**Expected Response:**
```json
{
  "message": "Wir haben aktuell 150 Kurse auf Kursfind AI verfügbar.",
  "courses": [],
  "function_calls": [
    {
      "name": "get_course_statistics",
      "result": {
        "success": true,
        "data": { "total_courses": 150 }
      }
    }
  ]
}
```

---

### Test 3: Student Applications (Authenticated - 3%)

**User Query (Logged In):**
```
"Show my applications"
```

**Expected Flow:**
1. ✅ AI calls `search_student_applications({ student_id: "123" })`
2. ✅ Function verifies authentication
3. ✅ Queries applications table filtered by student_id
4. ✅ Returns application list with status
5. ✅ AI presents applications to user

**How to Test:**
```bash
# Must include authentication cookie/token
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -H "Cookie: sb-access-token=YOUR_TOKEN" \
  -d '{
    "messages": [
      {"role": "user", "content": "Show my applications"}
    ]
  }'
```

**Expected Response:**
```json
{
  "message": "Du hast 3 Bewerbungen: 2 sind noch ausstehend, 1 wurde akzeptiert.",
  "courses": [],
  "function_calls": [
    {
      "name": "search_student_applications",
      "result": {
        "success": true,
        "data": {
          "applications": [
            {
              "id": 1,
              "status": "pending",
              "courses": {
                "title": "Web Development Bootcamp"
              }
            }
          ],
          "total": 3
        }
      }
    }
  ]
}
```

---

### Test 4: No Function Call Needed

**User Query:**
```
"What is Bildungsgutschein?"
```

**Expected Flow:**
1. ✅ AI receives query
2. ✅ AI determines no function call needed (general knowledge question)
3. ✅ AI responds directly from system prompt knowledge
4. ✅ No database queries made

**Expected Response:**
```json
{
  "message": "Bildungsgutschein ist eine 100% Kostenübernahme für berufliche Weiterbildung...",
  "courses": [],
  "function_calls": undefined
}
```

**Check Console Logs:**
```
💬 No function calls needed - using direct response
```

---

### Test 5: Multiple Function Calls

**User Query:**
```
"Recommend IT courses for me and show statistics"
```

**Expected Flow:**
1. ✅ AI calls `recommend_courses({ career_goal: "IT" })`
2. ✅ AI calls `get_course_statistics({ category: "IT & Tech" })`
3. ✅ Both functions execute
4. ✅ AI synthesizes results into single response

**Expected Response:**
```json
{
  "message": "Based on your interests, I recommend these 5 IT courses. We have 65 IT courses total on the platform.",
  "courses": [...],
  "function_calls": [
    { "name": "recommend_courses", "result": {...} },
    { "name": "get_course_statistics", "result": {...} }
  ]
}
```

---

### Test 6: Error Handling - No Results

**User Query:**
```
"Show me courses in Antarctica"
```

**Expected Flow:**
1. ✅ AI calls `search_courses({ location: "Antarctica" })`
2. ✅ Function returns `{ success: true, data: { courses: [], total: 0 } }`
3. ✅ AI responds honestly: "No courses found in Antarctica"

**Expected Response:**
```json
{
  "message": "Leider haben wir keine Kurse in Antarctica. Möchtest du nach Kursen in einer anderen Stadt suchen?",
  "courses": [],
  "function_calls": [
    {
      "name": "search_courses",
      "result": {
        "success": true,
        "data": { "courses": [], "total": 0 }
      }
    }
  ]
}
```

---

### Test 7: Error Handling - Unauthorized

**User Query (Not Logged In):**
```
"Show my applications"
```

**Expected Flow:**
1. ✅ AI calls `search_student_applications({ student_id: null })`
2. ✅ Function returns `{ success: false, error: "Unauthorized: Invalid student ID" }`
3. ✅ AI responds: "Please log in to see your applications"

**Expected Response:**
```json
{
  "message": "Um deine Bewerbungen zu sehen, musst du dich zuerst anmelden.",
  "courses": [],
  "function_calls": [
    {
      "name": "search_student_applications",
      "result": {
        "success": false,
        "error": "Unauthorized: Invalid student ID"
      }
    }
  ]
}
```

---

### Test 8: Course-Specific Chat (No Functions)

**Context:** User is on course detail page

**User Query:**
```
"Is this course good for beginners?"
```

**Expected Flow:**
1. ✅ `isCourseQuestion = true` (courseContext provided)
2. ✅ Functions are DISABLED for course-specific chat
3. ✅ AI uses course context from request
4. ✅ Direct response without function calls

**How to Test:**
```bash
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Is this course good for beginners?",
    "courseContext": {
      "id": 123,
      "title": "Web Development Bootcamp",
      "provider": "Tech Academy",
      "location": "Berlin",
      "duration": "12 Wochen",
      "funding_type": "Bildungsgutschein",
      "description": "Learn full-stack web development..."
    }
  }'
```

**Expected Response:**
```json
{
  "message": "Yes, this Web Development Bootcamp is suitable for beginners. The course covers fundamentals...",
  "courses": [],
  "function_calls": undefined
}
```

---

## 🔍 Debugging Checklist

### Console Logs to Check:

**1. Function Call Detection:**
```
🔧 AI requested 1 function calls
📞 Calling function: search_courses
```

**2. Function Execution:**
```
📋 Arguments: { query: "Web Development", location: "Berlin" }
✅ Function result: { success: true, dataKeys: [...] }
```

**3. Course Extraction:**
```
📚 Courses to return: 5
```

**4. Final Response:**
```
✅ Final AI message generated from function results
📤 Response prepared: { coursesCount: 5, hasFunctionCalls: true }
```

### Common Issues:

**Issue 1: Functions Not Being Called**
- ✅ Check: `tools: functionDefinitions` is passed to API
- ✅ Check: `tool_choice: 'auto'` is set
- ✅ Check: System prompt mentions functions
- ✅ Check: Not in course-specific mode (`isCourseQuestion = false`)

**Issue 2: Empty Course Results**
- ✅ Check: Function returns `success: true`
- ✅ Check: `data.courses` array exists
- ✅ Check: Supabase RLS policies allow read access
- ✅ Check: Database has matching courses

**Issue 3: Authentication Errors**
- ✅ Check: User is logged in
- ✅ Check: `studentId` is extracted from session
- ✅ Check: Student record exists in database
- ✅ Check: `auth_user_id` matches session

**Issue 4: DeepSeek API Errors**
- ✅ Check: `DEEPSEEK_API_KEY` environment variable is set
- ✅ Check: API endpoint is correct: `https://api.deepseek.com/v1/chat/completions`
- ✅ Check: Request body is valid JSON
- ✅ Check: Function definitions are valid

---

## 📊 Expected Performance Metrics

| Metric | Target | How to Measure |
|--------|--------|----------------|
| Function call rate | 60% | Count requests with `function_calls` in response |
| Average response time | 2-4s | Time from request to response |
| Search accuracy | 95%+ | User feedback on course relevance |
| Error rate | <5% | Count responses with `success: false` |
| Most called function | `search_courses` (85%) | Count by function name |

---

## 🎯 Success Criteria

### ✅ **Basic Functionality:**
- [ ] Course search queries trigger `search_courses` function
- [ ] Statistics queries trigger `get_course_statistics` function
- [ ] Function results are returned as structured JSON
- [ ] AI generates natural language from function results
- [ ] Courses array is populated in response
- [ ] No invented/fake course data in responses

### ✅ **Authentication:**
- [ ] Logged-in students can query their applications
- [ ] Logged-in students can query their saved courses
- [ ] Unauthorized requests return appropriate errors
- [ ] Context includes `studentId` and `providerId`

### ✅ **Error Handling:**
- [ ] Empty results handled gracefully
- [ ] Database errors don't crash the API
- [ ] DeepSeek API errors are caught and logged
- [ ] User receives helpful error messages

### ✅ **Performance:**
- [ ] Response time under 4 seconds
- [ ] No unnecessary function calls
- [ ] Efficient database queries
- [ ] Proper pagination for large result sets

---

## 🚀 Quick Test Commands

### Test 1: Basic Search
```bash
npm run dev
# Then in another terminal:
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"messages":[{"role":"user","content":"Show me IT courses"}]}'
```

### Test 2: Statistics
```bash
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"messages":[{"role":"user","content":"How many courses?"}]}'
```

### Test 3: General Knowledge (No Function)
```bash
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"messages":[{"role":"user","content":"What is Bildungsgutschein?"}]}'
```

---

## 📝 Manual Testing Checklist

Open your app in browser and test:

- [ ] **Basic search:** "Show me Web Development courses"
  - Expect: Courses displayed, function called
  
- [ ] **Location filter:** "Courses in Berlin"
  - Expect: Only Berlin courses shown
  
- [ ] **Funding filter:** "Bildungsgutschein courses"
  - Expect: Only funded courses shown
  
- [ ] **Statistics:** "How many courses do you have?"
  - Expect: Number displayed, no courses shown
  
- [ ] **Recommendations:** "Recommend courses for Data Science"
  - Expect: Relevant courses shown
  
- [ ] **My applications** (logged in): "Show my applications"
  - Expect: User's applications listed
  
- [ ] **My saved courses** (logged in): "Show my saved courses"
  - Expect: User's bookmarked courses shown
  
- [ ] **General question:** "What is AVGS?"
  - Expect: Text answer, no function calls
  
- [ ] **No results:** "Courses in Antarctica"
  - Expect: "No courses found" message
  
- [ ] **Unauthorized:** "Show my applications" (not logged in)
  - Expect: "Please log in" message

---

## 🎉 You're Ready!

Your function calling implementation is complete and ready for testing. Start with the basic search test and work through the scenarios above.

**Next Steps:**
1. Start dev server: `npm run dev`
2. Test basic search query
3. Check console logs for function calls
4. Verify courses are returned
5. Test authenticated features
6. Monitor performance

**Need Help?**
- Check console logs for detailed debugging info
- Review `FUNCTION_CALLING_IMPLEMENTATION_GUIDE.md` for architecture
- Review `FUNCTION_CALLING_QUICK_REFERENCE.md` for quick lookup

Good luck! 🚀

