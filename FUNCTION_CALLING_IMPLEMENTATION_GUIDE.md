# Function Calling Implementation Guide

## 📚 Overview

This guide shows how to integrate OpenAI/DeepSeek function calling into your Kursfind AI chat system. Function calling allows the AI to query your Supabase database intelligently during conversations.

---

## 🗂️ Files Created

1. **`app/api/chat/function-definitions.js`** - Function schemas for AI
2. **`app/api/chat/function-handlers.js`** - Database query implementations
3. **This guide** - Integration instructions

---

## 🚀 Quick Start Integration

### Step 1: Import the Functions

Add to your `app/api/chat/route.js`:

```javascript
import { functionDefinitions } from './function-definitions'
import { executeFunctionCall } from './function-handlers'
```

### Step 2: Update Your DeepSeek API Call

Replace your current DeepSeek API call with this enhanced version:

```javascript
// Build conversation messages
const conversationMessages = [
  {
    role: 'system',
    content: aiSystemPrompt
  },
  ...(messages || [{ role: 'user', content: message }])
];

// First API call - AI decides if it needs to call functions
const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`
  },
  body: JSON.stringify({
    model: 'deepseek-chat',
    messages: conversationMessages,
    tools: functionDefinitions,  // ✅ Enable function calling
    tool_choice: 'auto',         // ✅ Let AI decide when to use functions
    temperature: 0.7,
    max_tokens: 2000
  })
});

const responseData = await response.json();
const assistantMessage = responseData.choices[0].message;

// Check if AI wants to call functions
if (assistantMessage.tool_calls && assistantMessage.tool_calls.length > 0) {
  console.log('🔧 AI requested function calls:', assistantMessage.tool_calls.length);
  
  // Add assistant's function call request to conversation
  conversationMessages.push(assistantMessage);
  
  // Execute each function call
  for (const toolCall of assistantMessage.tool_calls) {
    const functionName = toolCall.function.name;
    const functionArgs = JSON.parse(toolCall.function.arguments);
    
    console.log(`📞 Calling: ${functionName}`, functionArgs);
    
    // Execute the function with context (student/provider ID from session)
    const functionResult = await executeFunctionCall(functionName, functionArgs, {
      studentId: studentId,  // From your existing auth logic
      providerId: null       // Add if provider context exists
    });
    
    console.log(`✅ Result:`, functionResult);
    
    // Add function result to conversation
    conversationMessages.push({
      role: 'tool',
      tool_call_id: toolCall.id,
      name: functionName,
      content: JSON.stringify(functionResult)
    });
  }
  
  // Make second API call with function results
  const finalResponse = await fetch('https://api.deepseek.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`
    },
    body: JSON.stringify({
      model: 'deepseek-chat',
      messages: conversationMessages,
      temperature: 0.7,
      max_tokens: 2000
    })
  });
  
  const finalData = await finalResponse.json();
  const finalMessage = finalData.choices[0].message.content;
  
  // Return final response
  return new Response(JSON.stringify({
    response: finalMessage,
    functionCalls: assistantMessage.tool_calls.length
  }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
  
} else {
  // No function calls needed - return direct response
  return new Response(JSON.stringify({
    response: assistantMessage.content
  }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
}
```

---

## 🎯 Available Functions

### 1. **search_courses**
Searches for courses matching user criteria.

**Example user queries:**
- "Show me Web Development courses in Berlin"
- "Find Bildungsgutschein-eligible courses"
- "What IT courses start in January?"

**AI will call:**
```json
{
  "name": "search_courses",
  "arguments": {
    "query": "Web Development",
    "location": "Berlin",
    "funding_eligible": true
  }
}
```

---

### 2. **get_course_details**
Gets complete details for a specific course.

**Example user queries:**
- "Tell me more about course ID 123"
- "What's included in the Data Science bootcamp?"

---

### 3. **search_providers**
Searches for training providers.

**Example user queries:**
- "Which providers offer courses in München?"
- "Show me AZAV-certified providers"

---

### 4. **search_student_applications**
Gets student's application history (requires authentication).

**Example user queries:**
- "Show my applications"
- "What's the status of my pending applications?"

---

### 5. **search_saved_courses**
Gets student's saved/bookmarked courses (requires authentication).

**Example user queries:**
- "Show my saved courses"
- "What courses did I bookmark?"

---

### 6. **get_student_profile**
Gets student profile and preferences (requires authentication).

**Example user queries:**
- "What are my interests?"
- "Show my profile"

---

### 7. **get_course_statistics**
Gets platform statistics and trends.

**Example user queries:**
- "How many courses do you have?"
- "What are the most popular categories?"
- "Show trending courses"

---

### 8. **compare_courses**
Compares multiple courses side-by-side.

**Example user queries:**
- "Compare course 123 and course 456"
- "What's the difference between these two bootcamps?"

---

### 9. **recommend_courses**
Gets AI-powered personalized recommendations.

**Example user queries:**
- "Recommend courses for me"
- "I want to become a Data Analyst, what should I study?"

---

## 🔒 Security & Authentication

### Context Object

The `executeFunctionCall` function accepts a `context` object for authentication:

```javascript
const context = {
  studentId: studentId,      // From your auth logic (bigint)
  providerId: providerId,    // If provider is logged in (bigint)
  authUserId: user?.id       // Supabase auth UUID
};

const result = await executeFunctionCall(functionName, functionArgs, context);
```

### Protected Functions

These functions require authentication:
- `search_student_applications` - Requires `studentId`
- `search_provider_applications` - Requires `providerId`
- `search_saved_courses` - Requires `studentId`
- `get_student_profile` - Requires `studentId`
- `get_chat_history` - Requires `studentId`

The handlers automatically verify that the requested ID matches the authenticated user.

---

## 📊 Response Format

All function handlers return this format:

```javascript
{
  success: true,           // or false if error
  data: {                  // Function-specific data
    courses: [...],
    total: 10,
    showing: 10,
    hasMore: false
  },
  error: "Error message"   // Only if success: false
}
```

---

## 🎨 Update Your System Prompt

Add this section to your `aiSystemPrompt` in `route.js`:

```javascript
aiSystemPrompt = `
... existing prompt ...

═══════════════════════════════════════════════════════════════
🔧 FUNCTION CALLING CAPABILITIES
═══════════════════════════════════════════════════════════════

YOU HAVE ACCESS TO THESE FUNCTIONS:
1. search_courses - Search our course database
2. get_course_details - Get full details for a specific course
3. search_providers - Find training providers
4. search_student_applications - Check student's applications (auth required)
5. search_saved_courses - Get student's saved courses (auth required)
6. get_student_profile - Get student profile (auth required)
7. get_course_statistics - Get platform statistics
8. compare_courses - Compare multiple courses
9. recommend_courses - Get personalized recommendations

WHEN TO USE FUNCTIONS:
- User asks about courses → Use search_courses
- User asks "how many courses" → Use get_course_statistics
- User asks about specific course → Use get_course_details
- User asks "my applications" → Use search_student_applications
- User asks "my saved courses" → Use search_saved_courses
- User asks for recommendations → Use recommend_courses

IMPORTANT:
- ALWAYS use functions to get real data
- NEVER invent course information
- If function returns no results, say so honestly
- Present function results clearly to the user

... rest of prompt ...
`
```

---

## 🧪 Testing

### Test 1: Basic Course Search

**User:** "Show me Web Development courses in Berlin"

**Expected Flow:**
1. AI calls `search_courses` with `{ query: "Web Development", location: "Berlin" }`
2. Function returns matching courses
3. AI presents courses to user

### Test 2: Statistics Query

**User:** "How many courses do you have?"

**Expected Flow:**
1. AI calls `get_course_statistics` with `{ metrics: ["total_courses"] }`
2. Function returns count
3. AI responds: "We have 150 courses available on Kursfind AI"

### Test 3: Student Applications (Authenticated)

**User:** "Show my applications"

**Expected Flow:**
1. AI calls `search_student_applications` with `{ student_id: "123" }`
2. Function verifies authentication and returns applications
3. AI presents application status to user

---

## 🔍 Debugging

Enable detailed logging:

```javascript
console.log('🔧 Function call requested:', toolCall.function.name);
console.log('📥 Arguments:', JSON.parse(toolCall.function.arguments));
console.log('📤 Result:', functionResult);
```

Check for common issues:
- ❌ Missing `DEEPSEEK_API_KEY` environment variable
- ❌ Student/provider ID mismatch in context
- ❌ Supabase RLS policies blocking queries
- ❌ Invalid function arguments

---

## 📈 Performance Optimization

### 1. Cache Frequent Queries

```javascript
// Cache course statistics for 5 minutes
const statsCache = new Map();
const CACHE_TTL = 5 * 60 * 1000;

async function getCourseStatistics(args) {
  const cacheKey = JSON.stringify(args);
  const cached = statsCache.get(cacheKey);
  
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }
  
  const result = await actualGetCourseStatistics(args);
  statsCache.set(cacheKey, { data: result, timestamp: Date.now() });
  
  return result;
}
```

### 2. Limit Function Calls

Add to system prompt:
```
- Maximum 3 function calls per conversation turn
- Combine related queries when possible
- Don't call functions for information already in context
```

### 3. Use Pagination

For large result sets:
```javascript
{
  name: "search_courses",
  arguments: {
    query: "IT",
    max_results: 10,    // Start with 10
    offset: 0           // Pagination offset
  }
}
```

---

## 🎯 Best Practices

### 1. **Function Naming**
- Use clear, descriptive names
- Follow pattern: `verb_noun` (e.g., `search_courses`, `get_details`)

### 2. **Parameter Design**
- Make parameters optional when possible
- Provide sensible defaults
- Use enums for constrained values

### 3. **Error Handling**
- Always return `{ success: false, error: "message" }` on errors
- Log errors for debugging
- Provide user-friendly error messages

### 4. **System Prompt Integration**
- Explain WHEN to use each function
- Give examples of user queries that trigger functions
- Emphasize using functions over inventing data

### 5. **Security**
- Always verify authentication for protected functions
- Use RLS policies in Supabase
- Never expose sensitive data in function responses

---

## 🔄 Migration Path

### Phase 1: Parallel Testing (Week 1)
- Keep existing search logic
- Add function calling alongside
- Compare results

### Phase 2: Gradual Rollout (Week 2-3)
- Enable function calling for 10% of users
- Monitor performance and accuracy
- Fix any issues

### Phase 3: Full Migration (Week 4)
- Enable for all users
- Remove old search logic
- Optimize based on usage patterns

---

## 📚 Additional Resources

### DeepSeek Function Calling Docs
https://api-docs.deepseek.com/guides/function_calling

### OpenAI Function Calling Guide
https://platform.openai.com/docs/guides/function-calling

### Supabase Query Optimization
https://supabase.com/docs/guides/database/query-optimization

---

## 🆘 Troubleshooting

### Issue: AI doesn't call functions

**Solution:**
- Check system prompt mentions functions
- Verify `tools` parameter is passed to API
- Ensure `tool_choice: 'auto'` is set

### Issue: Function returns empty results

**Solution:**
- Check Supabase RLS policies
- Verify query parameters are correct
- Test query directly in Supabase dashboard

### Issue: Authentication errors

**Solution:**
- Verify `studentId` is passed in context
- Check student record exists in database
- Ensure auth_user_id matches session

---

## 🎉 Next Steps

1. ✅ Review function definitions
2. ✅ Test function handlers individually
3. ✅ Integrate into chat route
4. ✅ Update system prompt
5. ✅ Test with real user queries
6. ✅ Monitor and optimize

---

**Questions?** Check the inline comments in `function-definitions.js` and `function-handlers.js` for detailed documentation.

**Need help?** All functions include comprehensive error handling and logging.

