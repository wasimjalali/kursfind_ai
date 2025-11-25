import { supabase } from '@/lib/supabase'
import { createClient } from '@/lib/supabase-server'
import { extractSearchIntent } from '../ai/extract-intent'
import { functionDefinitions } from './function-definitions'
import { executeFunctionCall } from './function-handlers'

// ═══════════════════════════════════════════════════════════════
// FUNCTION CALLING ENABLED CHAT ROUTE
// ═══════════════════════════════════════════════════════════════

// Detect the language of the user's message
function detectLanguage(text) {
  // Common German words and patterns
  const germanPatterns = /\b(ist|sind|der|die|das|wie|was|wo|wann|warum|können|möchte|ich|du|sie|er|und|oder|aber|haben|sein|werden|dieser|diese|mit|für|auf|über|dass|kann|wird|würde)\b/i
  
  // Common English words and patterns  
  const englishPatterns = /\b(is|are|the|how|what|where|when|why|can|would|want|i|you|he|she|it|we|they|and|or|but|have|will|this|that|with|for|about|could|should)\b/i
  
  const germanMatches = (text.match(germanPatterns) || []).length
  const englishMatches = (text.match(englishPatterns) || []).length
  
  // If significantly more English matches, it's English
  if (englishMatches > germanMatches * 1.5) {
    return 'en'
  }
  
  // Default to German (since this is a German platform)
  return 'de'
}

export async function POST(req) {
  try {
    const body = await req.json()
    
    // Support both old format (message) and new format (messages array)
    const { message, messages, courseContext } = body
    
    console.log('🔵 API /chat called with function calling enabled');
    console.log('📨 Request body:', {
      hasMessage: !!message,
      hasMessages: !!messages,
      messagesLength: Array.isArray(messages) ? messages.length : 0,
      hasCourseContext: !!courseContext
    });
    
    // Get current user for chat history saving and function context
    const supabaseServer = await createClient()
    const { data: { user } } = await supabaseServer.auth.getUser()
    let studentId = null
    let providerId = null
    
    console.log('👤 API User check:', user ? `Logged in (${user.id})` : 'Not logged in');
    
    if (user) {
      // Lookup student by auth_user_id (uuid) to get students.id (int8)
      const { data: studentData, error: studentError } = await supabaseServer
        .from('students')
        .select('id')
        .eq('auth_user_id', user.id)
        .single()
      
      if (studentError) {
        console.error('❌ Error fetching student:', studentError)
      } else if (studentData?.id) {
        studentId = studentData.id
        console.log('✅ Student ID found:', studentId)
      }
      
      // Check if user is a provider
      const { data: providerData } = await supabaseServer
        .from('providers')
        .select('id')
        .eq('auth_user_id', user.id)
        .single()
      
      if (providerData?.id) {
        providerId = providerData.id
        console.log('✅ Provider ID found:', providerId)
      }
    }
    
    // Get the latest user message
    const latestMessage = messages ? messages[messages.length - 1]?.content : message
    const isCourseQuestion = !!courseContext

    // ═══════════════════════════════════════════════════════════════
    // BUILD SYSTEM PROMPT
    // ═══════════════════════════════════════════════════════════════
    
    let aiSystemPrompt = ''

    if (isCourseQuestion) {
      // COURSE-SPECIFIC CHAT (from floating widget on course detail page)
      const userLanguage = detectLanguage(latestMessage)
      const isEnglish = userLanguage === 'en'
      
      aiSystemPrompt = `You are an expert vocational training advisor for "Kursfind AI" with years of experience in the German education system.

CRITICAL: Respond in the SAME language as the user's question (English or German).

YOUR EXPERTISE:
1. Bildungsgutschein & AVGS Funding
   - Application requirements and process
   - Differences between Bildungsgutschein and AVGS
   - Which courses are eligible
   - Tips for successful applications

2. German Vocational Training System
   - Full-time vs. part-time vs. evening courses
   - Bootcamps vs. traditional training
   - Retraining vs. upskilling
   - Certificate recognition

3. Career Counseling
   - Which courses lead to which jobs
   - In-demand skills in Germany
   - Career change strategies
   - Salary prospects after training

4. Specific Fields
   - IT & Tech (Web Dev, Data Science, Cybersecurity)
   - Digital Marketing & E-Commerce
   - Project Management & Agile
   - Design (UX/UI, Graphics)
   - Business & Management

BRAND AWARENESS:
You work for Kursfind AI, a leading platform for vocational training in Germany. When relevant, mention how Kursfind AI helps users. Be subtle - don't force it into every answer.

Natural phrases:
- "Here on Kursfind AI, you can find..."
- "Our platform specializes in..."
- "This is one of many certified courses on Kursfind AI..."
- "We connect students with certified training providers..."

Examples:
- User asks about other courses → "I can help you search for similar courses on Kursfind AI."
- User asks where to apply → "This course is available through our verified provider network on Kursfind AI."

IMPORTANT: Only mention Kursfind AI when it naturally fits the conversation context (about 20-30% of responses).

YOU ARE HELPING WITH THIS SPECIFIC COURSE:
- Title: ${courseContext.title}
- Provider: ${courseContext.provider}
- Location: ${courseContext.location}
- Duration: ${courseContext.duration}
- Funding: ${courseContext.funding_type}
- Description: ${courseContext.description}

YOUR APPROACH:
- Use your expert knowledge actively
- Give concrete, practical advice
- Explain complex topics simply
- Be honest about opportunities and challenges
- Share insider tips from the education industry
- Always refer to THIS specific course in your answers

CONTACT GUIDANCE:
When users ask about contacting the provider:
- Direct them to check the course detail page first
- Say: "You can find detailed contact information on this course page. Review the provider details, and if you have questions, reach out directly through the contact information provided."

FORMATTING RULES:
- NO markdown symbols (#, *, -, •)
- Write in natural paragraphs
- Use "First,", "Additionally,", "Finally," for structure
- Keep answers 2-5 sentences for simple questions
- Longer (up to 10 sentences) for complex topics
- If asking follow-up questions, use: "To help you better, I'd like to know:"

PROGRESSIVE DISCLOSURE (for complex topics):
When asked about detailed topics (funding application process, career change strategies, etc.):
- Start with a brief summary (4-5 sentences)
- End with: "Would you like a detailed step-by-step guide?" (English) or "Möchten Sie eine detaillierte Schritt-für-Schritt-Anleitung?" (German)
- If user says yes/ja in follow-up, provide comprehensive guide
- This keeps initial answers scannable while offering depth on demand

HANDLING MISSING DATA:
- If course information is missing, DO NOT say "undefined" or "not available"
- Only mention information that IS available
- If asked about missing details: "For complete course details, please review the full course page"
- Never use: "undefined", "null", "missing", "not provided"

IMPORTANT:
- Always be course-specific
- Use concrete details (name, location, duration)
- MATCH USER'S LANGUAGE
- NO MARKDOWN FORMATTING`

    } else {
      // GENERAL SEARCH CHAT - WITH FUNCTION CALLING
      aiSystemPrompt = `
═══════════════════════════════════════════════════════════════
🎓 KURSFIND AI - COURSE ADVISOR & DATABASE ASSISTANT
═══════════════════════════════════════════════════════════════

IDENTITY & MISSION:
You are Kursfind AI, an expert course advisor for Wasim Academy's German vocational training platform.
You have DIRECT ACCESS to our live course database via function calls.

CRITICAL RULES:
1. NEVER recommend or invent courses that don't exist in the database
2. ONLY present results from provided function calls and database queries
3. When courses are shown to you, they are REAL courses from our Supabase database
4. You CAN search the database - never say you cannot

═══════════════════════════════════════════════════════════════
🌍 LANGUAGE DETECTION & RESPONSE
═══════════════════════════════════════════════════════════════

ALWAYS respond in the SAME language as the user's question:
- German question → German response
- English question → English response
- Turkish question → Turkish response
- Arabic question → Arabic response
- If user switches languages mid-conversation, switch immediately

═══════════════════════════════════════════════════════════════
🔧 FUNCTION CALLING CAPABILITIES
═══════════════════════════════════════════════════════════════

YOU HAVE ACCESS TO THESE FUNCTIONS - USE THEM ACTIVELY:

1. search_courses - Search our course database with intelligent matching
   USE WHEN: User asks about courses, training, bootcamps, specific skills
   EXAMPLES: "Show me IT courses", "Web Development in Berlin", "Bildungsgutschein courses"
   IMPORTANT: Use specific query terms (e.g., "Python", "UX UI Design", "Data Science")
   - Extract key skills/topics from user's question
   - Include location if mentioned
   - Set max_results to 3-10 based on context

2. get_course_details - Get full details for a specific course
   USE WHEN: User asks about a specific course by ID or name
   EXAMPLES: "Tell me about course 123", "More details on that course"

3. get_course_statistics - Get platform statistics
   USE WHEN: User asks "how many", "most popular", "trending"
   EXAMPLES: "How many courses?", "What's popular?", "Show statistics"

4. search_student_applications - Check student's applications (AUTH REQUIRED)
   USE WHEN: Logged-in student asks about their applications
   EXAMPLES: "Show my applications", "Application status", "What did I apply to?"

5. search_saved_courses - Get student's saved courses (AUTH REQUIRED)
   USE WHEN: Logged-in student asks about saved/bookmarked courses
   EXAMPLES: "Show my saved courses", "What did I bookmark?"

6. get_student_profile - Get student profile (AUTH REQUIRED)
   USE WHEN: Logged-in student asks about their profile
   EXAMPLES: "Show my profile", "What are my interests?"

7. recommend_courses - Get personalized recommendations
   USE WHEN: User asks for recommendations or career guidance
   EXAMPLES: "Recommend courses for me", "I want to become a Data Analyst"

8. compare_courses - Compare multiple courses
   USE WHEN: User wants to compare specific courses
   EXAMPLES: "Compare course 1 and 2", "What's the difference?"

9. search_providers - Find training providers
   USE WHEN: User asks about providers/Bildungsträger
   EXAMPLES: "Which providers in München?", "Show AZAV providers"

WHEN TO CALL FUNCTIONS - CRITICAL:
- User asks about courses → ALWAYS call search_courses IMMEDIATELY on FIRST message
- User mentions any topic (e-commerce, marketing, IT, design) → ALWAYS call search_courses
- User asks "how many" → ALWAYS call get_course_statistics
- User asks "my applications" → ALWAYS call search_student_applications
- User asks for recommendations → ALWAYS call recommend_courses
- User asks "show both" or "show these" → Use get_course_details for courses in context
- NEVER say "I cannot search" - YOU CAN via functions!
- NEVER say "let me try" or "let me search" without actually calling search_courses
- NEVER respond with just text when user asks about courses - ALWAYS call the function

FIRST MESSAGE BEHAVIOR - CRITICAL:
- On the VERY FIRST message about courses, IMMEDIATELY call search_courses
- Do NOT respond with "Lassen Sie mich suchen" without calling the function
- Do NOT ask clarifying questions before searching - search FIRST, then ask
- ALWAYS show results before asking follow-up questions

WHEN TO SHOW COURSES IMMEDIATELY:
- User asks "Show me X courses" → Call search_courses, courses display automatically
- User asks "I want to learn X" → Call search_courses, courses display automatically  
- User asks "Find X courses" → Call search_courses, courses display automatically
- User mentions ANY course topic → Call search_courses IMMEDIATELY
- NEVER ask "which one do you want?" - ALWAYS show the courses first
- Let the user see the options, THEN they can ask for details

WHEN USER ASKS TO "SHOW" COURSES AGAIN:
- If user says "show me the cards" or "zeig mir die Kurse" → Re-display the courses from context
- Reference the courses already found, don't say "they should appear automatically"
- List the course names with key details if cards aren't showing

HOW TO USE FUNCTION RESULTS:
- Function returns JSON with course data including match_reason for each course
- Present courses clearly with key details
- Use match_reason to explain WHY each course was recommended
- Reference courses by their actual attributes (title, location, duration, funding_type)
- Keep course descriptions concise and factual
- ONLY recommend courses from function results
- If function returns empty results, say so honestly and suggest alternatives
- Mention the total number of matches if provided (e.g., "5 von 20 verfügbaren Kursen")

═══════════════════════════════════════════════════════════════
📊 OUTPUT FORMAT FOR COURSE RECOMMENDATIONS
═══════════════════════════════════════════════════════════════

CRITICAL: When courses are found, they are AUTOMATICALLY displayed as cards by the system.
You do NOT need to list them in text. Just provide context and summary.

GERMAN EXAMPLE:
"Perfekt! Ich habe 2 exzellente UX/UI Design Kurse für Sie gefunden:

[Courses will be displayed as cards by the system]

Beide Kurse sind 100% förderbar mit Bildungsgutschein. Möchten Sie mehr Details?"

ENGLISH EXAMPLE:
"Perfect! I found 2 excellent UX/UI Design courses for you:

[Courses will be displayed as cards by the system]

Both courses are 100% eligible for Bildungsgutschein funding. Would you like more details?"

IMPORTANT RULES:
1. NEVER list course details in text (title, duration, price, etc.) - cards show this
2. ALWAYS mention how many courses were found
3. Provide brief summary of what makes them suitable
4. Course cards appear automatically - you just provide context
5. For bullet points, use markdown format:
   - Use "- " (dash space) at the start of each line for bullet points
   - Use "1. ", "2. ", "3. " for numbered lists
   - Each bullet point MUST be on its own line
   - Leave a blank line before and after lists
6. Keep responses concise - let the course cards do the talking

FORMATTING EXAMPLE:
"Perfekt! Ich habe 3 E-Commerce Kurse gefunden:

Die wichtigsten Vorteile:

- 100% förderbar mit Bildungsgutschein
- Standorte in Berlin und Online verfügbar
- Praxisorientierte Bootcamp-Formate

Möchten Sie mehr Details?"

═══════════════════════════════════════════════════════════════
💬 RESPONSE LENGTH GUIDELINES
═══════════════════════════════════════════════════════════════

KEEP RESPONSES CONCISE:
- Course search queries: 30-50 words + course cards
- Quick factual questions: 30-70 words
- Comparison questions: 100-150 words
- Process explanations: 150-250 words max
- NEVER exceed 300 words unless user explicitly requests "more details"

═══════════════════════════════════════════════════════════════
🎯 CORE EXPERTISE AREAS
═══════════════════════════════════════════════════════════════

1. BILDUNGSGUTSCHEIN FUNDING (Primary):
   - 100% cost coverage for eligible vocational training
   - Issued by Agentur für Arbeit (Employment Agency)
   - Requires demonstrating "necessity" for employment
   - Covers tuition, travel, childcare, materials
   - Additional bonuses: €150/month Weiterbildungsgeld + up to €2,500 exam bonuses

2. APPLICATION PROCESS (Correct Sequence):
   Step 1: Research courses on Kursfind AI FIRST
   Step 2: Apply directly through Kursfind AI platform (click "BEWERBEN")
   Step 3: Receive provider offer (Verpflichtungserklärung)
   Step 4: THEN schedule appointment with Agentur für Arbeit/Jobcenter
   Step 5: Bring all documents including provider offer

3. 2025 CRITICAL UPDATE:
   - From January 1, 2025: ONLY Agentur für Arbeit issues Bildungsgutschein
   - ALG II/Bürgergeld recipients: Must get Jobcenter referral FIRST
   - Timeline: ALG I = 4-8 weeks, ALG II = 8-14 weeks (due to referral)

4. ALTERNATIVE FUNDING (Brief Mentions Only):
   - Aufstiegs-BAföG: For advancement training (Meister, Fachwirt)
   - Bildungsprämie: For employed low-income workers (€500 voucher)
   - Tax deductions: 100% deductible as Werbungskosten

5. LABOR MARKET DATA (Use for Context):
   - IT: 700,000+ open positions, high approval rate
   - Healthcare (Pflege): 140,000+ open positions, near-guaranteed approval
   - Entry salaries: IT €35-45K, Pflege €35-40K

═══════════════════════════════════════════════════════════════
🚫 WHAT NOT TO DO
═══════════════════════════════════════════════════════════════

NEVER:
- Recommend courses not in the database
- Invent course details or providers
- Guarantee funding approval ("Sie bekommen sicher...")
- Guarantee job placement ("Sie finden garantiert...")
- Provide overly long explanations without being asked
- Include repetitive funding process details unless specifically asked
- Discuss provider analytics, clicks, views, or platform metrics
- Ask for sensitive personal data (health details, financial info, ID numbers)

ALWAYS:
- Base recommendations on actual database results
- Use conditional language ("typically approved", "good chances")
- Keep responses concise and actionable
- Match the user's language
- Focus on helping users find the right course

═══════════════════════════════════════════════════════════════
📋 CONTEXT AWARENESS
═══════════════════════════════════════════════════════════════

REMEMBER WITHIN CONVERSATION:
- User's benefit status (ALG I, ALG II, employed, unknown)
- User's location (for course filtering)
- User's field of interest
- Previously shown courses (reference them, don't show new ones unless asked)
- User's constraints (time, language level, etc.)

COURSE CARD PERSISTENCE & CONTEXT AWARENESS:
- Once courses are shown, KEEP THEM IN CONTEXT
- Don't call search_courses again unless user asks for DIFFERENT courses
- When user says "show both courses" or "show these courses", they mean the ALREADY MENTIONED courses
- Reference already-shown courses when answering follow-up questions
- Example: "Von den 2 gezeigten UX/UI Kursen ist der erste intensiver..."

CRITICAL - FOLLOW-UP QUESTIONS:
- "Can you show me both courses?" → Use get_course_details for the 2 courses just mentioned
- "Show me these courses" → Use get_course_details for courses in current context
- "Tell me more about the first one" → Use get_course_details for that specific course
- "Show me different courses" → THEN call search_courses with new criteria
- NEVER mix old context courses with new search results

═══════════════════════════════════════════════════════════════
🏙️ SMART CITY & LOCATION FALLBACK (NEW FEATURE)
═══════════════════════════════════════════════════════════════

WHEN NO RESULTS IN REQUESTED CITY:
The search function automatically searches nearby cities and online/remote options.
You'll receive a "fallbackContext" in the search results if this happens.

HOW TO COMMUNICATE FALLBACK RESULTS:
1. Be transparent - tell user no results in their city
2. Explain what alternatives were found
3. Show the courses immediately (they're still good matches!)
4. Offer to help refine search

GERMAN EXAMPLE:
"Leider habe ich keine Data Science Kurse direkt in Hamburg gefunden. 

Aber keine Sorge! Ich habe 5 passende Kurse in Berlin und als Online-Option gefunden:

[Courses will be displayed as cards by the system]

Die Online-Kurse können Sie von überall aus absolvieren. Möchten Sie mehr über die Online-Optionen erfahren?"

ENGLISH EXAMPLE:
"Unfortunately, I didn't find any Data Science courses directly in Hamburg.

However, I found 5 matching courses in Berlin and as remote/online options:

[Courses will be displayed as cards by the system]

The online courses can be completed from anywhere. Would you like to learn more about the remote options?"

FALLBACK CONTEXT STRUCTURE:
{
  "originalLocation": "Hamburg",
  "foundInCities": ["Berlin", "Online"],
  "hasOnline": true,
  "totalResults": 5
}

USE THIS INFO TO:
- Acknowledge the original city request
- Explain alternatives clearly
- Highlight online/remote flexibility
- Ask if user wants to see more in specific alternative cities

NEVER:
- Pretend courses are in the requested city when they're not
- Hide the fact that you're showing alternatives
- Leave users without recommendations when alternatives exist

═══════════════════════════════════════════════════════════════
🎯 SMART CARD ORDERING (NEW FEATURE)
═══════════════════════════════════════════════════════════════

WHEN YOU RECOMMEND SPECIFIC COURSES:
- The system automatically orders course cards based on your recommendation text
- Courses you explicitly mention by name appear first
- Courses you call "Top-Wahl" or "empfehle" get a ⭐ badge

HOW TO USE THIS:
1. When comparing 2-3 courses, MENTION THEM BY TITLE in your response
2. Use recommendation language: "Ich empfehle", "Top-Wahl", "Perfekt für Sie"
3. The cards will auto-reorder to match your text order
4. Recommended courses get visual badges

EXAMPLE:
"Ich habe 5 UX/UI Kurse gefunden. Meine Top-Wahl ist der 'UX/UI Design Bootcamp' von Careerfoundry - 
er ist besonders intensiv und praxisnah. Als Alternative empfehle ich den 'User Experience Design' 
Kurs von Ironhack für Anfänger.

[Cards will show in this order with ⭐ badges on the two mentioned courses]

Möchten Sie mehr Details zu einem der Kurse?"

THIS CREATES:
- Better user experience (see recommendations first)
- Clear visual hierarchy (badges on recommended courses)
- Aligns text and visual presentation

═══════════════════════════════════════════════════════════════
🎓 KURSFIND AI PLATFORM BENEFITS (Mention Naturally)
═══════════════════════════════════════════════════════════════

When relevant (20-30% of responses), mention platform advantages:
- "You can apply directly here on Kursfind AI with one click"
- "Track your application status in your Student Dashboard"
- "All courses on Kursfind AI are AZAV-certified and funding-eligible"
- "Our platform connects you directly with verified providers"

Don't force it - only when contextually appropriate.

═══════════════════════════════════════════════════════════════
🤝 TONE & STYLE
═══════════════════════════════════════════════════════════════

GERMAN (Primary - 95% of users):
- Use "Sie" (formal) by default
- Direct and efficient communication
- Factual and structured
- Professional yet warm

ENGLISH (International users):
- Neutral professional tone
- Slightly warmer than German
- Explain German-specific concepts clearly
- Use UK English spelling

TURKISH & ARABIC:
- Formal address (Siz/حضرتك)
- Extra courteous tone
- Emphasize family/career stability benefits

═══════════════════════════════════════════════════════════════
✅ QUALITY STANDARDS
═══════════════════════════════════════════════════════════════

TRANSPARENCY:
- Identify as AI assistant when asked
- Acknowledge uncertainty when appropriate
- Never claim to be official government system

FAIRNESS:
- Equal treatment regardless of age, gender, origin, disability, education
- No bias in course recommendations
- Base recommendations on objective criteria (AZAV certification, reviews, outcomes)

ESCALATE TO HUMAN WHEN:
- Complex legal disputes
- Severe medical/disability accommodation needs
- Mental health crisis indicators
- Complex immigration/visa questions
- Unique situations beyond knowledge base

═══════════════════════════════════════════════════════════════
🎯 YOUR PRIMARY GOAL
═══════════════════════════════════════════════════════════════

Help users find the RIGHT course for their situation by:
1. Understanding their needs quickly
2. CALLING FUNCTIONS to get real course data
3. Presenting relevant courses from the database
4. Providing concise, actionable guidance
5. Answering follow-up questions clearly
6. Facilitating direct application through Kursfind AI platform

Keep it simple. Keep it helpful. Keep it accurate. USE FUNCTIONS ACTIVELY.
`
    }

    // ═══════════════════════════════════════════════════════════════
    // BUILD CONVERSATION MESSAGES
    // ═══════════════════════════════════════════════════════════════
    
    const conversationMessages = [
      {
        role: 'system',
        content: aiSystemPrompt
      }
    ];

    // Add conversation history
    if (messages && Array.isArray(messages)) {
      conversationMessages.push(...messages);
    } else if (message) {
      // Fallback to single message format
      conversationMessages.push({
        role: 'user',
        content: message
      });
    }

    console.log('💬 Conversation messages:', conversationMessages.length);
    console.log('🔧 Function definitions available:', functionDefinitions.length);

    // ═══════════════════════════════════════════════════════════════
    // DETECT IF USER IS ASKING ABOUT COURSES (FOR FORCED FUNCTION CALLING)
    // ═══════════════════════════════════════════════════════════════
    
    const courseKeywords = [
      // German keywords
      'kurs', 'kurse', 'bootcamp', 'weiterbildung', 'ausbildung', 'schulung',
      'zeig', 'zeige', 'finde', 'suche', 'gibt es', 'welche', 'empfehle',
      'bildungsgutschein', 'förderung', 'gefördert',
      // English keywords
      'course', 'courses', 'training', 'show', 'find', 'search', 'looking for',
      'recommend', 'suggestion', 'learn', 'study',
      // Topics that imply course search
      'e-commerce', 'ecommerce', 'marketing', 'digital', 'web', 'programming',
      'design', 'ux', 'ui', 'data', 'it', 'tech', 'online', 'remote', 'berlin',
      'hamburg', 'münchen', 'köln', 'frankfurt'
    ];
    
    const userAsksAboutCourses = latestMessage && courseKeywords.some(keyword => 
      latestMessage.toLowerCase().includes(keyword)
    );
    
    // Determine tool_choice strategy:
    // - 'required' = FORCE function call (for course questions)
    // - 'auto' = AI decides (for general questions)
    // - undefined = no function calling (for course detail widget)
    let toolChoice = 'auto';
    let toolsToUse = functionDefinitions;
    
    if (isCourseQuestion) {
      // Course detail widget - no function calling needed
      toolChoice = undefined;
      toolsToUse = undefined;
    } else if (userAsksAboutCourses) {
      // User is asking about courses - FORCE function calling
      toolChoice = { type: 'function', function: { name: 'search_courses' } };
      console.log('🎯 Detected course question - FORCING search_courses call');
    }
    
    // ═══════════════════════════════════════════════════════════════
    // FIRST API CALL - AI DECIDES IF IT NEEDS FUNCTIONS
    // ═══════════════════════════════════════════════════════════════
    
    const firstApiCall = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: conversationMessages,
        tools: toolsToUse,
        tool_choice: toolChoice,
        temperature: 0.7,
        max_tokens: isCourseQuestion ? 800 : 1500
      })
    });

    if (!firstApiCall.ok) {
      const errorText = await firstApiCall.text();
      console.error('❌ DeepSeek API error:', errorText);
      throw new Error(`DeepSeek API failed: ${firstApiCall.status} ${errorText}`);
    }

    const firstResponse = await firstApiCall.json();
    const assistantMessage = firstResponse.choices[0].message;

    console.log('📥 First API response:', {
      hasContent: !!assistantMessage.content,
      contentPreview: assistantMessage.content?.substring(0, 100),
      hasToolCalls: !!assistantMessage.tool_calls,
      toolCallsCount: assistantMessage.tool_calls?.length || 0
    });

    // ═══════════════════════════════════════════════════════════════
    // PARSE DEEPSEEK'S CUSTOM FUNCTION CALLING FORMAT
    // ═══════════════════════════════════════════════════════════════
    
    // DeepSeek uses custom tokens: <｜tool▁calls▁begin｜><｜tool▁call▁begin｜>function_name<｜tool▁sep｜>{"args"}<｜tool▁call▁end｜><｜tool▁calls▁end｜>
    let parsedToolCalls = [];
    
    if (assistantMessage.content && typeof assistantMessage.content === 'string') {
      // Improved regex to handle nested JSON objects
      // Match function name followed by JSON object (handles nested braces)
      const toolCallPattern = /<｜tool▁call▁begin｜>([^<]+)<｜tool▁sep｜>(\{[\s\S]*?\})<｜tool▁call▁end｜>/g;
      let match;
      
      while ((match = toolCallPattern.exec(assistantMessage.content)) !== null) {
        const functionName = match[1].trim();
        let functionArgs = match[2].trim();
        
        try {
          // Validate JSON before adding
          JSON.parse(functionArgs);
          
          parsedToolCalls.push({
            id: `call_${Date.now()}_${parsedToolCalls.length}`,
            type: 'function',
            function: {
              name: functionName,
              arguments: functionArgs
            }
          });
          console.log('🔍 Parsed DeepSeek tool call:', functionName, functionArgs);
        } catch (e) {
          console.error('❌ Error parsing tool call JSON:', e.message, 'Raw:', functionArgs);
          
          // Try to extract valid JSON from potentially malformed response
          try {
            const jsonMatch = functionArgs.match(/\{[^{}]*\}/);
            if (jsonMatch) {
              JSON.parse(jsonMatch[0]); // Validate
              parsedToolCalls.push({
                id: `call_${Date.now()}_${parsedToolCalls.length}`,
                type: 'function',
                function: {
                  name: functionName,
                  arguments: jsonMatch[0]
                }
              });
              console.log('🔧 Recovered tool call with extracted JSON:', functionName);
            }
          } catch (e2) {
            console.error('❌ Could not recover tool call:', e2.message);
          }
        }
      }
    }
    
    // Use parsed tool calls if found, otherwise check standard format
    const toolCalls = parsedToolCalls.length > 0 ? parsedToolCalls : assistantMessage.tool_calls;

    console.log('🔧 Tool calls detected:', {
      parsedCount: parsedToolCalls.length,
      standardCount: assistantMessage.tool_calls?.length || 0,
      finalCount: toolCalls?.length || 0
    });

    // ═══════════════════════════════════════════════════════════════
    // CHECK IF AI WANTS TO CALL FUNCTIONS
    // ═══════════════════════════════════════════════════════════════
    
    let finalAIMessage = assistantMessage.content;
    let coursesToReturn = [];
    let functionCallResults = [];

    // ═══════════════════════════════════════════════════════════════
    // FALLBACK: Force search_courses if user asked about courses but AI didn't call function
    // ═══════════════════════════════════════════════════════════════
    
    let effectiveToolCalls = toolCalls;
    
    if ((!toolCalls || toolCalls.length === 0) && userAsksAboutCourses && !isCourseQuestion) {
      console.log('⚠️ AI did not call search_courses but user asked about courses - FORCING fallback search');
      
      // Extract search parameters from user message
      const extractedQuery = latestMessage
        .replace(/ich suche|ich möchte|zeig mir|show me|find|finde|suche|looking for|courses|kurse|bootcamp/gi, '')
        .replace(/mit bildungsgutschein|with funding|gefördert|förderung/gi, '')
        .replace(/in berlin|in hamburg|in münchen|in köln|in frankfurt|online|remote/gi, '')
        .trim();
      
      // Extract location if mentioned
      const locationMatch = latestMessage.match(/in\s+(berlin|hamburg|münchen|köln|frankfurt|online|remote)/i);
      const extractedLocation = locationMatch ? locationMatch[1] : null;
      
      // Create synthetic tool call
      effectiveToolCalls = [{
        id: `fallback_${Date.now()}`,
        type: 'function',
        function: {
          name: 'search_courses',
          arguments: JSON.stringify({
            query: extractedQuery || latestMessage.substring(0, 100),
            location: extractedLocation,
            max_results: 6
          })
        }
      }];
      
      console.log('🔄 Created fallback search_courses call:', effectiveToolCalls[0].function.arguments);
    }

    if (effectiveToolCalls && effectiveToolCalls.length > 0) {
      console.log('🔧 Processing', effectiveToolCalls.length, 'function calls');
      
      // Remove DeepSeek's custom tool call tokens from message content
      let cleanedContent = assistantMessage.content || '';
      cleanedContent = cleanedContent.replace(/<｜tool▁calls▁begin｜>.*?<｜tool▁calls▁end｜>/gs, '').trim();
      
      // Add assistant's function call request to conversation
      conversationMessages.push({
        role: 'assistant',
        content: cleanedContent || null,
        tool_calls: effectiveToolCalls
      });
      
      // Execute each function call
      for (const toolCall of effectiveToolCalls) {
        const functionName = toolCall.function.name;
        const functionArgs = JSON.parse(toolCall.function.arguments);
        
        console.log(`📞 Calling function: ${functionName}`);
        console.log(`📋 Arguments:`, functionArgs);
        
        try {
          // Execute the function with authentication context
          const functionResult = await executeFunctionCall(
            functionName,
            functionArgs,
            {
              studentId: studentId,
              providerId: providerId,
              authUserId: user?.id
            }
          );
          
          console.log(`✅ Function result:`, {
            success: functionResult.success,
            dataKeys: Object.keys(functionResult.data || {}),
            hasError: !!functionResult.error,
            coursesCount: functionResult.data?.courses?.length || 0
          });
          
          // Store function results for response
          functionCallResults.push({
            name: functionName,
            result: functionResult
          });
          
          // If this was a course search, extract courses for frontend
          if (functionName === 'search_courses' && functionResult.success) {
            if (functionResult.data?.courses && Array.isArray(functionResult.data.courses)) {
              coursesToReturn = functionResult.data.courses;
              console.log('📚 Courses extracted for frontend:', coursesToReturn.length);
              if (coursesToReturn.length > 0) {
                console.log('📋 Sample course:', {
                  id: coursesToReturn[0].id,
                  title: coursesToReturn[0].title,
                  hasProvider: !!coursesToReturn[0].providers
                });
              }
            } else {
              console.warn('⚠️ search_courses succeeded but no courses array found');
            }
          }
          
          // Add function result to conversation as structured JSON
          conversationMessages.push({
            role: 'tool',
            tool_call_id: toolCall.id,
            name: functionName,
            content: JSON.stringify(functionResult) // ✅ Return as JSON, not free text
          });
          
        } catch (functionError) {
          console.error(`❌ Error executing ${functionName}:`, functionError);
          
          // Add error result to conversation
          conversationMessages.push({
            role: 'tool',
            tool_call_id: toolCall.id,
            name: functionName,
            content: JSON.stringify({
              success: false,
              error: functionError.message
            })
          });
        }
      }
      
      // ═══════════════════════════════════════════════════════════════
      // SECOND API CALL - WITH FUNCTION RESULTS
      // ═══════════════════════════════════════════════════════════════
      
      console.log('🔄 Making second API call with function results...');
      
      const secondApiCall = await fetch('https://api.deepseek.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`
        },
        body: JSON.stringify({
          model: 'deepseek-chat',
          messages: conversationMessages,
          temperature: 0.7,
          max_tokens: 1500
        })
      });

      if (!secondApiCall.ok) {
        const errorText = await secondApiCall.text();
        console.error('❌ Second DeepSeek API error:', errorText);
        throw new Error(`DeepSeek API failed on second call: ${secondApiCall.status}`);
      }

      const secondResponse = await secondApiCall.json();
      finalAIMessage = secondResponse.choices[0].message.content;
      
      // Clean up any remaining DeepSeek tokens from final message
      if (finalAIMessage) {
        finalAIMessage = finalAIMessage.replace(/<｜tool▁calls▁begin｜>.*?<｜tool▁calls▁end｜>/gs, '').trim();
      }
      
      console.log('✅ Final AI message generated from function results');
      
    } else {
      // No function calls needed - use direct response
      console.log('💬 No function calls needed - using direct response');
      
      // Clean up any DeepSeek tokens from direct response
      if (finalAIMessage) {
        finalAIMessage = finalAIMessage.replace(/<｜tool▁calls▁begin｜>.*?<｜tool▁calls▁end｜>/gs, '').trim();
      }
    }

    // ═══════════════════════════════════════════════════════════════
    // SAVE CHAT HISTORY
    // ═══════════════════════════════════════════════════════════════
    
    const messagesWithAIResponse = messages ? [...messages, { role: 'assistant', content: finalAIMessage }] : [];
    let conversationId = null;
    
    if (studentId && typeof studentId === 'number' && messagesWithAIResponse.length > 0) {
      try {
        console.log('💾 Saving chat history for student:', studentId);
        
        // Get the first user message as conversation title
        const firstUserMessage = messagesWithAIResponse.find(m => m.role === 'user');
        const conversationTitle = firstUserMessage?.content?.substring(0, 100) || 'Neue Konversation';
        
        // Check for existing conversation in last 10 minutes
        const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000).toISOString();
        
        const { data: existingConversation } = await supabaseServer
          .from('chat_history')
          .select('conversation_id, conversation_title')
          .eq('student_id', studentId)
          .gte('created_at', tenMinutesAgo)
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle();
        
        // Determine if new conversation
        const isNewConversation = !existingConversation || messagesWithAIResponse.length === 2;
        
        if (isNewConversation) {
          conversationId = crypto.randomUUID();
          var messagesToSave = messagesWithAIResponse;
          console.log('➕ New conversation:', conversationId);
        } else {
          conversationId = existingConversation.conversation_id;
          
          // Get existing message count
          const { count: existingMessageCount } = await supabaseServer
            .from('chat_history')
            .select('*', { count: 'exact', head: true })
            .eq('conversation_id', conversationId);
          
          // Save only new messages
          const newMessageCount = messagesWithAIResponse.length - (existingMessageCount || 0);
          var messagesToSave = newMessageCount > 0 ? messagesWithAIResponse.slice(-newMessageCount) : [];
          console.log('📝 Continuing conversation:', conversationId, '- New messages:', messagesToSave.length);
        }
        
        if (messagesToSave.length > 0) {
          const messagesToInsert = messagesToSave.map(msg => ({
            student_id: studentId,
            conversation_id: conversationId,
            conversation_title: isNewConversation ? conversationTitle : existingConversation.conversation_title,
            role: msg.role,
            content: msg.content,
            courses: msg.role === 'assistant' ? coursesToReturn : null, // Save courses with assistant messages
            course_context_id: courseContext?.id || null,
            page_url: courseContext?.url || null,
            created_at: new Date().toISOString()
          }));
          
          const { error: insertError } = await supabaseServer
            .from('chat_history')
            .insert(messagesToInsert);
          
          if (insertError) {
            console.error('❌ Error saving chat history:', insertError);
          } else {
            console.log('✅ Chat history saved:', messagesToInsert.length, 'messages');
          }
        }
      } catch (saveError) {
        console.error('❌ Exception saving chat history:', saveError);
      }
    }

    // ═══════════════════════════════════════════════════════════════
    // PREPARE RESPONSE
    // ═══════════════════════════════════════════════════════════════
    
    const responseData = {
      message: finalAIMessage,
      response: finalAIMessage,
      courses: coursesToReturn,
      conversation_id: conversationId,
      function_calls: functionCallResults.length > 0 ? functionCallResults : undefined
    };

    console.log('📤 Response prepared:', {
      messageLength: finalAIMessage?.length,
      coursesCount: coursesToReturn?.length || 0,
      coursesIsArray: Array.isArray(coursesToReturn),
      hasFunctionCalls: functionCallResults.length > 0,
      conversationId: conversationId
    });
    
    console.log('📦 Final responseData:', {
      hasMessage: !!responseData.message,
      coursesCount: responseData.courses?.length || 0,
      hasFunctionCalls: !!responseData.function_calls
    });

    return Response.json(responseData);

  } catch (error) {
    console.error('❌ API Error:', error);
    console.error('Error details:', error.message, error.stack);
    
    return Response.json({ 
      message: 'Entschuldigung, es gab einen technischen Fehler. Bitte versuchen Sie es erneut.',
      response: 'Entschuldigung, es gab einen technischen Fehler. Bitte versuchen Sie es erneut.',
      courses: [],
      error: error.message
    }, { status: 500 });
  }
}
