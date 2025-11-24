# Function Calling Flow Diagram

## 📊 Complete Request-Response Flow

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         USER SENDS QUERY                                 │
│                  "Show me Web Development courses in Berlin"             │
└─────────────────────────────────────────────────────────────────────────┘
                                    ↓
┌─────────────────────────────────────────────────────────────────────────┐
│                    FRONTEND → POST /api/chat                             │
│  {                                                                       │
│    "messages": [                                                         │
│      {"role": "user", "content": "Show me Web Development..."}          │
│    ]                                                                     │
│  }                                                                       │
└─────────────────────────────────────────────────────────────────────────┘
                                    ↓
┌─────────────────────────────────────────────────────────────────────────┐
│                         ROUTE.JS HANDLER                                 │
│  1. Extract message from request                                        │
│  2. Get authentication context (studentId, providerId)                  │
│  3. Build system prompt (with function calling instructions)            │
│  4. Build conversation messages array                                   │
└─────────────────────────────────────────────────────────────────────────┘
                                    ↓
┌─────────────────────────────────────────────────────────────────────────┐
│              FIRST DEEPSEEK API CALL (with tools)                        │
│  POST https://api.deepseek.com/v1/chat/completions                      │
│  {                                                                       │
│    "model": "deepseek-chat",                                            │
│    "messages": [                                                         │
│      {"role": "system", "content": "You are Kursfind AI..."},           │
│      {"role": "user", "content": "Show me Web Development..."}          │
│    ],                                                                    │
│    "tools": [                                                            │
│      {                                                                   │
│        "type": "function",                                              │
│        "function": {                                                     │
│          "name": "search_courses",                                      │
│          "description": "Searches for courses...",                      │
│          "parameters": {...}                                            │
│        }                                                                 │
│      },                                                                  │
│      ... 11 more functions                                              │
│    ],                                                                    │
│    "tool_choice": "auto"  ← AI decides when to use                     │
│  }                                                                       │
└─────────────────────────────────────────────────────────────────────────┘
                                    ↓
┌─────────────────────────────────────────────────────────────────────────┐
│                    DEEPSEEK AI PROCESSES REQUEST                         │
│  AI thinks:                                                              │
│  "User wants courses... I should call search_courses function"          │
│  "Parameters: query='Web Development', location='Berlin'"               │
└─────────────────────────────────────────────────────────────────────────┘
                                    ↓
┌─────────────────────────────────────────────────────────────────────────┐
│                      DEEPSEEK RETURNS TOOL CALLS                         │
│  {                                                                       │
│    "choices": [{                                                         │
│      "message": {                                                        │
│        "role": "assistant",                                             │
│        "content": null,                                                 │
│        "tool_calls": [                                                  │
│          {                                                               │
│            "id": "call_abc123",                                         │
│            "type": "function",                                          │
│            "function": {                                                │
│              "name": "search_courses",                                  │
│              "arguments": "{                                            │
│                \"query\": \"Web Development\",                          │
│                \"location\": \"Berlin\",                                │
│                \"max_results\": 10                                      │
│              }"                                                          │
│            }                                                             │
│          }                                                               │
│        ]                                                                 │
│      }                                                                   │
│    }]                                                                    │
│  }                                                                       │
└─────────────────────────────────────────────────────────────────────────┘
                                    ↓
┌─────────────────────────────────────────────────────────────────────────┐
│                  ROUTE.JS DETECTS TOOL CALLS                             │
│  if (assistantMessage.tool_calls) {                                     │
│    console.log('🔧 AI requested function calls');                       │
│    // Execute each function...                                          │
│  }                                                                       │
└─────────────────────────────────────────────────────────────────────────┘
                                    ↓
┌─────────────────────────────────────────────────────────────────────────┐
│                    EXECUTE FUNCTION CALL                                 │
│  const result = await executeFunctionCall(                              │
│    'search_courses',                                                    │
│    {                                                                     │
│      query: 'Web Development',                                          │
│      location: 'Berlin',                                                │
│      max_results: 10                                                    │
│    },                                                                    │
│    {                                                                     │
│      studentId: 123,                                                    │
│      providerId: null                                                   │
│    }                                                                     │
│  );                                                                      │
└─────────────────────────────────────────────────────────────────────────┘
                                    ↓
┌─────────────────────────────────────────────────────────────────────────┐
│              FUNCTION-HANDLERS.JS → SUPABASE QUERY                       │
│  async function searchCourses(args) {                                   │
│    let query = supabase                                                 │
│      .from('courses')                                                   │
│      .select(`                                                           │
│        *,                                                                │
│        providers!courses_provider_id_fkey(                              │
│          company_name, logo_url, certifications                         │
│        )                                                                 │
│      `)                                                                  │
│      .ilike('title', '%Web Development%')                               │
│      .ilike('location', '%Berlin%')                                     │
│      .eq('status', 'active')                                            │
│      .limit(10);                                                        │
│                                                                          │
│    const { data: courses, error } = await query;                        │
│                                                                          │
│    return {                                                              │
│      success: true,                                                     │
│      data: {                                                             │
│        courses: courses,                                                │
│        total: 150,                                                      │
│        showing: 10,                                                     │
│        hasMore: true                                                    │
│      }                                                                   │
│    };                                                                    │
│  }                                                                       │
└─────────────────────────────────────────────────────────────────────────┘
                                    ↓
┌─────────────────────────────────────────────────────────────────────────┐
│                    SUPABASE DATABASE QUERY                               │
│  SELECT                                                                  │
│    courses.*,                                                            │
│    providers.company_name,                                              │
│    providers.logo_url,                                                  │
│    providers.certifications                                             │
│  FROM courses                                                            │
│  LEFT JOIN providers ON courses.provider_id = providers.provider_id     │
│  WHERE                                                                   │
│    courses.title ILIKE '%Web Development%'                              │
│    AND courses.location ILIKE '%Berlin%'                                │
│    AND courses.status = 'active'                                        │
│  LIMIT 10;                                                              │
└─────────────────────────────────────────────────────────────────────────┘
                                    ↓
┌─────────────────────────────────────────────────────────────────────────┐
│                    SUPABASE RETURNS RESULTS                              │
│  [                                                                       │
│    {                                                                     │
│      "id": 123,                                                         │
│      "title": "Web Development Bootcamp",                               │
│      "location": "Berlin",                                              │
│      "duration": "12 Wochen",                                           │
│      "funding_types": ["Bildungsgutschein"],                            │
│      "providers": {                                                      │
│        "company_name": "Tech Academy",                                  │
│        "logo_url": "https://..."                                        │
│      }                                                                   │
│    },                                                                    │
│    ... 9 more courses                                                   │
│  ]                                                                       │
└─────────────────────────────────────────────────────────────────────────┘
                                    ↓
┌─────────────────────────────────────────────────────────────────────────┐
│              FUNCTION RETURNS STRUCTURED JSON                            │
│  {                                                                       │
│    "success": true,                                                     │
│    "data": {                                                             │
│      "courses": [...10 courses...],                                     │
│      "total": 150,                                                      │
│      "showing": 10,                                                     │
│      "hasMore": true                                                    │
│    }                                                                     │
│  }                                                                       │
└─────────────────────────────────────────────────────────────────────────┘
                                    ↓
┌─────────────────────────────────────────────────────────────────────────┐
│           ROUTE.JS ADDS FUNCTION RESULT TO CONVERSATION                  │
│  conversationMessages.push({                                            │
│    role: 'tool',                                                        │
│    tool_call_id: 'call_abc123',                                         │
│    name: 'search_courses',                                              │
│    content: JSON.stringify({                                            │
│      success: true,                                                     │
│      data: { courses: [...], total: 150, ... }                          │
│    })                                                                    │
│  });                                                                     │
│                                                                          │
│  // Extract courses for frontend                                        │
│  coursesToReturn = functionResult.data.courses;                         │
└─────────────────────────────────────────────────────────────────────────┘
                                    ↓
┌─────────────────────────────────────────────────────────────────────────┐
│           SECOND DEEPSEEK API CALL (with function results)               │
│  POST https://api.deepseek.com/v1/chat/completions                      │
│  {                                                                       │
│    "model": "deepseek-chat",                                            │
│    "messages": [                                                         │
│      {"role": "system", "content": "You are Kursfind AI..."},           │
│      {"role": "user", "content": "Show me Web Development..."},         │
│      {"role": "assistant", "tool_calls": [...]},                        │
│      {"role": "tool", "content": "{\"success\":true,\"data\":{...}}"}   │
│    ],                                                                    │
│    "temperature": 0.7                                                   │
│  }                                                                       │
└─────────────────────────────────────────────────────────────────────────┘
                                    ↓
┌─────────────────────────────────────────────────────────────────────────┐
│              DEEPSEEK AI PROCESSES FUNCTION RESULTS                      │
│  AI thinks:                                                              │
│  "I received 10 Web Development courses in Berlin from the database"    │
│  "Let me present these to the user in a helpful way"                    │
└─────────────────────────────────────────────────────────────────────────┘
                                    ↓
┌─────────────────────────────────────────────────────────────────────────┐
│                 DEEPSEEK RETURNS FINAL RESPONSE                          │
│  {                                                                       │
│    "choices": [{                                                         │
│      "message": {                                                        │
│        "role": "assistant",                                             │
│        "content": "Ich habe 10 passende Web Development Kurse in        │
│                    Berlin für dich gefunden. Alle Kurse sind            │
│                    Bildungsgutschein-fähig und starten in den           │
│                    nächsten Wochen. Möchtest du mehr Details zu         │
│                    einem bestimmten Kurs?"                               │
│      }                                                                   │
│    }]                                                                    │
│  }                                                                       │
└─────────────────────────────────────────────────────────────────────────┘
                                    ↓
┌─────────────────────────────────────────────────────────────────────────┐
│                   ROUTE.JS PREPARES FINAL RESPONSE                       │
│  const responseData = {                                                 │
│    message: "Ich habe 10 passende Web Development Kurse...",            │
│    response: "...",  // Same as message                                 │
│    courses: [...10 courses...],  // From function result                │
│    conversation_id: "uuid-123",                                         │
│    function_calls: [                                                    │
│      {                                                                   │
│        name: "search_courses",                                          │
│        result: { success: true, data: {...} }                           │
│      }                                                                   │
│    ]                                                                     │
│  };                                                                      │
│                                                                          │
│  return Response.json(responseData);                                    │
└─────────────────────────────────────────────────────────────────────────┘
                                    ↓
┌─────────────────────────────────────────────────────────────────────────┐
│                      FRONTEND RECEIVES RESPONSE                          │
│  {                                                                       │
│    "message": "Ich habe 10 passende Web Development Kurse...",          │
│    "courses": [                                                          │
│      {                                                                   │
│        "id": 123,                                                       │
│        "title": "Web Development Bootcamp",                             │
│        "location": "Berlin",                                            │
│        "duration": "12 Wochen",                                         │
│        "providers": {                                                    │
│          "company_name": "Tech Academy"                                 │
│        }                                                                 │
│      },                                                                  │
│      ... 9 more courses                                                 │
│    ]                                                                     │
│  }                                                                       │
└─────────────────────────────────────────────────────────────────────────┘
                                    ↓
┌─────────────────────────────────────────────────────────────────────────┐
│                    FRONTEND DISPLAYS RESULTS                             │
│  ┌─────────────────────────────────────────────────────────┐            │
│  │  💬 AI Message:                                         │            │
│  │  "Ich habe 10 passende Web Development Kurse in         │            │
│  │   Berlin für dich gefunden..."                          │            │
│  └─────────────────────────────────────────────────────────┘            │
│                                                                          │
│  ┌─────────────────────────────────────────────────────────┐            │
│  │  📚 Course Card 1:                                      │            │
│  │  ┌─────────────────────────────────────────────────┐   │            │
│  │  │ Web Development Bootcamp                        │   │            │
│  │  │ Tech Academy • Berlin • 12 Wochen               │   │            │
│  │  │ ✅ Bildungsgutschein                            │   │            │
│  │  │ [BEWERBEN]                                      │   │            │
│  │  └─────────────────────────────────────────────────┘   │            │
│  └─────────────────────────────────────────────────────────┘            │
│                                                                          │
│  ... 9 more course cards ...                                            │
└─────────────────────────────────────────────────────────────────────────┘
                                    ↓
                            ✅ USER SEES RESULTS
```

---

## 🔄 Alternative Flow: No Function Calls Needed

```
User Query: "What is Bildungsgutschein?"
                ↓
        POST /api/chat
                ↓
    First DeepSeek API Call (with tools)
                ↓
    AI thinks: "This is a general knowledge question,
                I don't need to query the database"
                ↓
    DeepSeek returns: {
      "message": {
        "content": "Bildungsgutschein ist eine 100%
                    Kostenübernahme für berufliche
                    Weiterbildung...",
        "tool_calls": null  ← No function calls
      }
    }
                ↓
    Route.js: No tool_calls detected
              → Return direct response
                ↓
    Frontend displays AI message
    (No courses shown)
                ↓
            ✅ DONE
```

---

## 🔒 Alternative Flow: Authentication Required

```
User Query: "Show my applications" (NOT logged in)
                ↓
        POST /api/chat
                ↓
    Route.js: studentId = null (no user session)
                ↓
    First DeepSeek API Call
                ↓
    AI calls: search_student_applications({ student_id: null })
                ↓
    Function Handler checks authentication:
    if (!student_id || context.studentId !== student_id) {
      return {
        success: false,
        error: "Unauthorized: Invalid student ID"
      }
    }
                ↓
    Function returns error result
                ↓
    Second DeepSeek API Call (with error result)
                ↓
    AI responds: "Um deine Bewerbungen zu sehen,
                  musst du dich zuerst anmelden."
                ↓
    Frontend displays error message
                ↓
            ✅ DONE
```

---

## 📊 Timing Breakdown

```
Total Response Time: ~2.5 seconds

┌─────────────────────────────────────────────────┐
│ Request Processing         │ 50ms               │
│ ├─ Parse request          │ 10ms               │
│ ├─ Get authentication     │ 20ms               │
│ └─ Build system prompt    │ 20ms               │
├─────────────────────────────────────────────────┤
│ First DeepSeek API Call    │ 800ms              │
│ ├─ Network latency        │ 100ms              │
│ ├─ AI processing          │ 600ms              │
│ └─ Response parsing       │ 100ms              │
├─────────────────────────────────────────────────┤
│ Function Execution         │ 200ms              │
│ ├─ Parse arguments        │ 10ms               │
│ ├─ Supabase query         │ 150ms              │
│ └─ Format result          │ 40ms               │
├─────────────────────────────────────────────────┤
│ Second DeepSeek API Call   │ 900ms              │
│ ├─ Network latency        │ 100ms              │
│ ├─ AI synthesis           │ 700ms              │
│ └─ Response parsing       │ 100ms              │
├─────────────────────────────────────────────────┤
│ Response Preparation       │ 50ms               │
│ ├─ Extract courses        │ 10ms               │
│ ├─ Save chat history      │ 30ms               │
│ └─ Format response        │ 10ms               │
└─────────────────────────────────────────────────┘
Total: ~2,000ms (2 seconds)
```

---

## 🎯 Key Decision Points

### 1. Should Functions Be Available?
```
if (isCourseQuestion) {
  // Course-specific chat (floating widget)
  tools: undefined  ← NO FUNCTIONS
} else {
  // General search chat
  tools: functionDefinitions  ← FUNCTIONS AVAILABLE
}
```

### 2. Did AI Call Functions?
```
if (assistantMessage.tool_calls && assistantMessage.tool_calls.length > 0) {
  // Execute functions and make second API call
} else {
  // Return direct response
}
```

### 3. Is User Authenticated?
```
if (studentId && typeof studentId === 'number') {
  // Allow protected function calls
  // Save chat history
} else {
  // Block protected functions
  // Don't save chat history
}
```

### 4. Did Function Succeed?
```
if (functionResult.success) {
  // Extract data for frontend
  // Pass to AI for synthesis
} else {
  // Pass error to AI
  // AI generates user-friendly error message
}
```

---

## 🔍 Data Flow Summary

```
User Input (Natural Language)
        ↓
AI Decision (Function Call or Direct Response)
        ↓
Function Execution (Structured Database Query)
        ↓
Structured JSON Result (Database Data)
        ↓
AI Synthesis (Natural Language + Context)
        ↓
Final Response (Natural Language + Course Cards)
        ↓
User Sees Results (AI Message + Course Cards)
```

---

## 🎨 Response Types

### Type 1: Course Search (85%)
- **Function Called:** `search_courses`
- **Response Includes:** AI message + courses array
- **Frontend Displays:** Message + course cards

### Type 2: Statistics (10%)
- **Function Called:** `get_course_statistics`
- **Response Includes:** AI message with numbers
- **Frontend Displays:** Message only (no courses)

### Type 3: General Knowledge (40%)
- **Function Called:** None
- **Response Includes:** AI message only
- **Frontend Displays:** Message only

### Type 4: Authenticated (3%)
- **Function Called:** `search_student_applications`, `search_saved_courses`, etc.
- **Response Includes:** AI message + data
- **Frontend Displays:** Message + data cards

---

**This diagram shows the complete flow from user query to displayed results!** 🎉

