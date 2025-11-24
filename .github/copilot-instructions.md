# Kursfind AI - AI Agent Instructions

## Project Overview
Kursfind AI is a Next.js 15 platform connecting German job seekers with vocational training courses, integrated with Bildungsgutschein (education voucher) funding and AI-powered course search.

**Stack**: Next.js 15 (App Router) + Supabase + DeepSeek AI + Tailwind CSS  
**Language**: German (primary), English (secondary)  
**Target Users**: Job seekers, course providers, unemployed workers seeking retraining

---

## Architecture & Data Flow

### Three-Sided Marketplace
1. **Students** (`/student/*`) - browse courses, save favorites, apply through platform
2. **Providers** (`/provider/*`) - manage courses, view applications, track analytics  
3. **AI Search** (`/suchen`) - conversational course discovery with chat history

### Authentication Pattern
- **Supabase Auth** for user management (`auth.users`)
- **Role-based access**: Students have `students` table records, Providers have `providers` table records
- **Foreign key chains**: `auth.users.id` (uuid) → `students.auth_user_id` (uuid) → `chat_history.student_id` (int8)
- **Middleware**: `middleware.js` refreshes auth sessions on every request

### Database Schema (Supabase PostgreSQL)
Key tables with critical relationships:
- `courses` → `providers` (via `provider_id` text)
- `chat_history` → `students` (via `student_id` int8) - stores conversation state
- `applications` → `courses`, `providers`, `students` (application tracking)
- `saved_courses` → junction table for student bookmarks

**Critical Foreign Key Note**: `chat_history.student_id` references `students.id` (int8 primary key), NOT `auth_user_id` (uuid). Always lookup student by auth_user_id first to get the int8 ID.

---

## Critical Patterns & Conventions

### 1. Supabase Client Initialization
**THREE different patterns** based on context:

```javascript
// CLIENT-SIDE (browser):
import { supabase } from '@/lib/supabase'
// Uses createBrowserClient, reads NEXT_PUBLIC_* env vars

// SERVER COMPONENTS:
import { createClient } from '@/lib/supabase-server'
const supabase = await createClient()
// Uses Next.js cookies() API, async initialization

// API ROUTES:
import { createClient } from '@/lib/supabase-server'
const supabaseServer = await createClient()
const { data: { user } } = await supabaseServer.auth.getUser()
// Always check auth first in API routes
```

### 2. Provider Foreign Key Quirk
**Problem**: `courses.provider_id` is TEXT, but some code expects `providers.id` (int8).

**Solution**: Use `provider_id` (text) consistently. When querying:
```javascript
.select('*, providers!courses_provider_id_fkey(company_name, logo_url)')
// Explicit FK name if automatic join fails
```

If join errors occur, **fetch providers separately**:
```javascript
const { data: courses } = await supabase.from('courses').select('*')
// Then for each course:
const { data: provider } = await supabase
  .from('providers')
  .eq('provider_id', course.provider_id)
  .single()
```

### 3. Chat History Storage Pattern
**Security-Critical**: Always validate student ownership before saving chat.

```javascript
// 1. Get authenticated user (uuid)
const { data: { user } } = await supabase.auth.getUser()

// 2. Lookup students.id (int8) from auth_user_id (uuid)
const { data: student } = await supabase
  .from('students')
  .select('id')
  .eq('auth_user_id', user.id)
  .single()

// 3. Use students.id (int8) for chat_history.student_id
await supabase.from('chat_history').insert({
  student_id: student.id, // NOT user.id!
  conversation_id: uuid,
  role: 'user',
  content: message
})
```

### 4. AI Integration (DeepSeek API)
**Location**: `/app/api/chat/route.js` (~4000 lines)

**Key Features**:
- **Bilingual detection**: Analyzes message language, responds in German/English
- **Intent extraction**: Parses course search intent (category, location, format, funding)
- **Context injection**: Adds available courses to system prompt for accurate recommendations
- **Course display markers**: AI uses `[SHOW_COURSES]` + `{"courseIds": [1,2,3]}` to trigger card display

**System Prompt Structure** (see `route.js:80-3900`):
- Expert persona as German education counselor
- Bildungsgutschein/AVGS funding knowledge base
- Labor market data (700K+ IT jobs, salary ranges)
- Response format rules (no markdown, progressive disclosure)

**Integration Pattern**:
```javascript
const response = await fetch('https://api.deepseek.com/chat/completions', {
  headers: { 'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}` },
  body: JSON.stringify({
    model: 'deepseek-chat',
    messages: [
      { role: 'system', content: systemPrompt },
      ...conversationHistory
    ]
  })
})
```

---

## Development Workflows

### Adding a New Course Field
1. **Database**: Add column via Supabase SQL editor (e.g., `ALTER TABLE courses ADD COLUMN benefits TEXT`)
2. **Type**: Update `types/course.ts` interface
3. **Form**: Add field to `components/provider/CourseForm.jsx` (formData state + input)
4. **Display**: Update `app/courses/[id]/CoursePageClient.jsx` to show new field
5. **API**: Ensure API routes include field in SELECT queries

### Creating a New API Route
**Pattern to follow** (see `/app/api/courses/[slug]/route.js`):
```javascript
export async function GET(req, { params }) {
  const supabase = await createClient()
  
  // Always handle provider join failure gracefully
  let { data, error } = await supabase
    .from('courses')
    .select('*, providers(*)')
    .eq('slug', params.slug)
    .single()
  
  if (error && error.message.includes('relation')) {
    // Fallback: fetch without provider join
    data = await supabase.from('courses').select('*').eq('slug', params.slug).single()
  }
  
  return NextResponse.json(data)
}
```

### Running Database Migrations
**SQL files** in root directory document schema changes (e.g., `create_chat_history_table.sql`).

**To apply**:
1. Copy SQL content
2. Go to Supabase Dashboard → SQL Editor
3. Paste and run
4. Verify with `schema_verification_query.sql`

---

## Key Files & Their Responsibilities

### Core Application Flow
- `app/page.tsx` - Root redirects to `/suchen` (main entry point)
- `app/suchen/page.tsx` - AI chat interface (~650 lines)
  - Manages conversation state, message history
  - Calls `/api/chat` for AI responses
  - Displays course cards from AI recommendations
  - Handles "Show More" pagination for course search

### API Routes (Most Complex)
- `app/api/chat/route.js` - **THE BRAIN** (4062 lines)
  - DeepSeek AI integration
  - Smart search intent extraction
  - Bildungsgutschein/AVGS knowledge base
  - Course recommendation logic
  - Chat history persistence
- `app/api/ai/search-courses/route.js` - Structured course search with filters
- `app/api/applications/route.js` - Course application submission

### Provider Dashboard
- `app/provider/dashboard/page.jsx` - Stats overview (views, clicks, applications)
- `app/provider/dashboard/courses/page.jsx` - Course management CRUD
- `components/provider/CourseForm.jsx` - Complex form with funding types, benefits, curriculum

### Authentication Helpers
- `lib/supabase-server.js` - Server-side client + `getUser()`, `getCurrentProvider()` helpers
- `middleware.js` - Session refresh on all requests

---

## Environment Variables

**Required** (stored in `.env.local`):
```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=

# AI
DEEPSEEK_API_KEY=

# App URL (for API-to-API calls)
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**Build-time safety**: Code checks for missing env vars but allows build to continue (enables CI/CD).

---

## Common Pitfalls & Solutions

### 1. "Foreign key constraint violation" on chat_history
**Cause**: Trying to insert `auth_user_id` (uuid) into `student_id` (int8) column.  
**Fix**: Always lookup `students.id` by `auth_user_id` first (see "Chat History Storage Pattern" above).

### 2. Provider join returns 400/500 error
**Cause**: FK naming mismatch or schema drift.  
**Fix**: Use explicit FK name `courses_provider_id_fkey` or fetch separately (see "Provider Foreign Key Quirk" above).

### 3. AI returns courses that don't exist
**Cause**: AI hallucinates course IDs.  
**Fix**: Parse AI response for `[SHOW_COURSES]` marker, validate IDs against database, only return matched courses.

### 4. Courses not showing in /suchen chat
**Cause**: `coursesToReturn` is null or `shouldShowCourses` logic fails.  
**Debug**: Check console logs for `📤 Final course return debug` object. Ensure `coursesToReturn` is an array (can be empty).

---

## Testing Strategy

### Manual Testing Checklist
- [ ] Student can register/login and see saved courses
- [ ] Provider can create/edit courses with all fields
- [ ] AI chat responds in correct language (German/English)
- [ ] Course cards display when AI recommends courses
- [ ] Application submission creates record in `applications` table
- [ ] Chat history persists across page reloads for logged-in users

### Database Verification
```sql
-- Check chat history is saving correctly:
SELECT ch.*, s.name 
FROM chat_history ch 
JOIN students s ON ch.student_id = s.id 
ORDER BY ch.created_at DESC 
LIMIT 10;

-- Verify provider FK relationships:
SELECT c.id, c.title, c.provider_id, p.company_name 
FROM courses c 
LEFT JOIN providers p ON c.provider_id = p.provider_id 
LIMIT 5;
```

---

## Architectural Decisions

### Why Next.js App Router?
- Server Components reduce client JS bundle (critical for SEO)
- Streaming SSR for faster perceived performance
- Simplified data fetching with async components

### Why Supabase?
- PostgreSQL with Row-Level Security (RLS) for multi-tenancy
- Real-time subscriptions (unused currently, but available)
- Auth + Database in one service reduces complexity

### Why DeepSeek over OpenAI?
- Cost-effective for high-volume chat interactions
- German language proficiency comparable to GPT-4
- Custom system prompt allows vocational training domain expertise

### Why Text-Based provider_id FK?
**Legacy decision**: Provider data originally imported with string IDs. Changing to int8 would require migration of ~500 courses. Text FK works but requires explicit join syntax.

---

## Domain-Specific Context

### German Vocational Training System
**Bildungsgutschein** (Education Voucher):
- Covers 100% of training costs for unemployed/at-risk workers
- Issued by Agentur für Arbeit or Jobcenter
- Requires AZAV certification on courses
- Application process: research courses → get provider offer → apply to agency

**AZAV Certification**: 
- Government accreditation for training providers
- Required for Bildungsgutschein eligibility
- Displayed as badge on course cards

### Key German Terms in Codebase
- `Weiterbildung` - Continuing education
- `Umschulung` - Retraining (longer, 1-2 years)
- `Anbieter` - Provider
- `Kurs/Lehrgang` - Course
- `Förderung` - Funding/subsidy
- `Teilzeit/Vollzeit` - Part-time/Full-time

---

## When to Escalate to Human Review

1. **Security issues**: Any RLS bypass, auth vulnerabilities, or data leakage
2. **Data integrity**: Foreign key constraint errors that suggest schema misalignment
3. **AI behavior**: Responses that contradict established Bildungsgutschein rules
4. **Performance**: Database queries taking >5s or API routes timing out

---

## Code Style & Conventions

**Taken from** `.cursor/rules/kursfindnextjs.mdc`:
- Use tabs for indentation (not spaces)
- Single quotes for strings
- No semicolons (except where required)
- PascalCase for components, camelCase for functions
- Kebab-case for file names (`course-card.jsx`)
- Always use strict equality (`===`)

**Component Structure**:
1. Imports
2. Type definitions
3. Component function
4. Return JSX
5. Export

---

## Quick Reference Commands

```bash
# Development
npm run dev              # Start dev server (localhost:3000)

# Database
# Run SQL via Supabase Dashboard (no local CLI setup)

# Linting
npm run lint             # ESLint check

# Build
npm run build            # Production build
```

---

## Additional Resources

- **README.md**: Standard Next.js setup guide (minimal project-specific info)
- **components/Table-structure-supabase.md**: Complete database schema reference
- **SQL files in root**: Migration scripts and schema verification queries
- **`.cursor/rules/kursfindnextjs.mdc`**: Comprehensive React/Next.js style guide (206 lines)

---

*Last Updated: 2025-01-24*  
*For questions or clarifications, refer to the original codebase context or consult the team lead.*
