/**
 * Function Call Handlers
 * Executes the actual database queries for each function definition
 */

import { createClient } from '@supabase/supabase-js'

// Initialize Supabase client for server-side API routes
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase credentials in function-handlers')
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

/**
 * Keyword expansion for better search recall
 * Expands search terms with synonyms and related concepts
 */
function expandSearchTerms(query) {
  const lowerQuery = query.toLowerCase().trim();
  const terms = [query]; // Always include original
  
  // Synonym mapping for common course topics
  const synonymMap = {
    // Programming languages
    'python': ['python', 'programming', 'coding', 'entwicklung'],
    'javascript': ['javascript', 'js', 'web development', 'frontend', 'webentwicklung'],
    'java': ['java', 'programming', 'entwicklung'],
    'php': ['php', 'web development', 'backend'],
    'c#': ['c#', 'csharp', 'dotnet', '.net'],
    
    // Design
    'ux': ['ux', 'ui', 'user experience', 'design', 'interface'],
    'ui': ['ui', 'ux', 'user interface', 'design', 'interface'],
    'design': ['design', 'ux', 'ui', 'grafik', 'gestaltung'],
    'grafik': ['grafik', 'design', 'graphics', 'gestaltung'],
    
    // Web Development
    'web development': ['web development', 'webentwicklung', 'web', 'frontend', 'backend', 'fullstack', 'full stack'],
    'webentwicklung': ['webentwicklung', 'web development', 'web', 'frontend', 'backend'],
    'web': ['web', 'web development', 'webentwicklung', 'frontend', 'backend', 'fullstack'],
    'frontend': ['frontend', 'web development', 'web', 'javascript', 'react', 'vue'],
    'backend': ['backend', 'web development', 'web', 'api', 'server'],
    'fullstack': ['fullstack', 'full stack', 'web development', 'web', 'frontend', 'backend'],
    'full stack': ['full stack', 'fullstack', 'web development', 'web'],
    
    // Data & Analytics
    'data science': ['data science', 'data analytics', 'machine learning', 'ai', 'datenanalyse'],
    'data analytics': ['data analytics', 'data science', 'business intelligence', 'datenanalyse'],
    'machine learning': ['machine learning', 'ml', 'ai', 'data science', 'künstliche intelligenz'],
    'ai': ['ai', 'artificial intelligence', 'machine learning', 'künstliche intelligenz'],
    
    // Marketing
    'digital marketing': ['digital marketing', 'online marketing', 'marketing', 'seo', 'sem'],
    'online marketing': ['online marketing', 'digital marketing', 'marketing', 'seo'],
    'seo': ['seo', 'search engine optimization', 'online marketing', 'marketing'],
    
    // Project Management
    'project management': ['project management', 'projektmanagement', 'agile', 'scrum'],
    'agile': ['agile', 'scrum', 'project management', 'projektmanagement'],
    'scrum': ['scrum', 'agile', 'project management'],
    
    // IT & Tech
    'cybersecurity': ['cybersecurity', 'security', 'it security', 'sicherheit'],
    'cloud': ['cloud', 'aws', 'azure', 'cloud computing'],
    'devops': ['devops', 'ci/cd', 'automation', 'deployment'],
    
    // Healthcare
    'pflege': ['pflege', 'healthcare', 'nursing', 'gesundheit'],
    'healthcare': ['healthcare', 'pflege', 'health', 'gesundheit'],
    
    // Business
    'business': ['business', 'management', 'betriebswirtschaft', 'bwl'],
    'management': ['management', 'business', 'führung', 'leadership']
  };
  
  // Check if query matches any synonym key
  for (const [key, synonyms] of Object.entries(synonymMap)) {
    if (lowerQuery.includes(key)) {
      synonyms.forEach(syn => {
        if (!terms.some(t => t.toLowerCase() === syn.toLowerCase())) {
          terms.push(syn);
        }
      });
      break; // Only expand first match to avoid too many terms
    }
  }
  
  // Limit to 5 terms max to avoid overly broad searches
  return terms.slice(0, 5);
}

/**
 * Generate match reason for why a course was recommended
 */
function generateMatchReason(course, query, category, location) {
  const reasons = [];
  
  if (query) {
    const lowerQuery = query.toLowerCase();
    const lowerTitle = course.title?.toLowerCase() || '';
    const lowerDesc = course.description?.toLowerCase() || '';
    const lowerCategory = course.category?.toLowerCase() || '';
    
    if (lowerTitle.includes(lowerQuery)) {
      reasons.push(`Matches "${query}" in title`);
    } else if (lowerDesc.includes(lowerQuery)) {
      reasons.push(`Includes ${query} content`);
    } else if (lowerCategory.includes(lowerQuery)) {
      reasons.push(`${query} category course`);
    } else {
      reasons.push(`Related to ${query}`);
    }
  }
  
  if (category && course.category?.toLowerCase().includes(category.toLowerCase())) {
    reasons.push(`${category} category`);
  }
  
  if (location && course.location?.toLowerCase().includes(location.toLowerCase())) {
    reasons.push(`Available in ${location}`);
  }
  
  if (course.funding_types?.includes('Bildungsgutschein')) {
    reasons.push('Bildungsgutschein-eligible');
  }
  
  if (course.format) {
    reasons.push(course.format);
  }
  
  return reasons.join(' • ') || 'Recommended course';
}

/**
 * Main function executor - routes function calls to appropriate handlers
 */
export async function executeFunctionCall(functionName, args, context = {}) {
  // STEP 9: Enhanced logging for audit trail
  const startTime = Date.now();
  console.log(`🔧 [${new Date().toISOString()}] Executing function: ${functionName}`);
  console.log(`📋 Arguments:`, JSON.stringify(args, null, 2));
  console.log(`👤 Context:`, { 
    hasStudentId: !!context.studentId, 
    hasProviderId: !!context.providerId 
  });

  try {
    let result;
    switch (functionName) {
      case 'search_courses':
        result = await searchCourses(args);
        break;
      
      case 'get_course_details':
        result = await getCourseDetails(args);
        break;
      
      case 'search_providers':
        result = await searchProviders(args);
        break;
      
      case 'get_provider_details':
        result = await getProviderDetails(args);
        break;
      
      case 'search_student_applications':
        result = await searchStudentApplications(args, context);
        break;
      
      case 'search_provider_applications':
        result = await searchProviderApplications(args, context);
        break;
      
      case 'search_saved_courses':
        result = await searchSavedCourses(args, context);
        break;
      
      case 'get_student_profile':
        result = await getStudentProfile(args, context);
        break;
      
      case 'get_course_statistics':
        result = await getCourseStatistics(args);
        break;
      
      case 'compare_courses':
        result = await compareCourses(args);
        break;
      
      case 'get_chat_history':
        result = await getChatHistory(args, context);
        break;
      
      case 'recommend_courses':
        result = await recommendCourses(args, context);
        break;
      
      default:
        result = {
          success: false,
          error: `Unknown function: ${functionName}`
        };
    }
    
    // STEP 9: Log execution result
    const duration = Date.now() - startTime;
    console.log(`✅ [${functionName}] Completed in ${duration}ms`);
    console.log(`📊 Result:`, {
      success: result.success,
      dataKeys: Object.keys(result.data || {}),
      itemCount: result.data?.courses?.length || result.data?.applications?.length || result.data?.providers?.length || 0,
      hasError: !!result.error
    });
    
    // STEP 8: Log failed calls for review
    if (!result.success) {
      console.error(`❌ [FAILED] ${functionName}:`, {
        args,
        error: result.error,
        timestamp: new Date().toISOString()
      });
    }
    
    return result;
    
  } catch (error) {
    const duration = Date.now() - startTime;
    console.error(`❌ [EXCEPTION] ${functionName} after ${duration}ms:`, error);
    console.error(`📋 Failed args:`, args);
    console.error(`🔍 Stack trace:`, error.stack);
    
    return {
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    };
  }
}

// ═══════════════════════════════════════════════════════════════
// 1. SEARCH COURSES
// ═══════════════════════════════════════════════════════════════
async function searchCourses(args) {
  const {
    query,
    category,
    location,
    format,
    funding_eligible,
    funding_type,
    language,
    start_date_from,
    start_date_to,
    duration_min,
    duration_max,
    provider_id,
    is_featured,
    status = 'active',
    certificate_type,
    max_results = 10,
    offset = 0,
    sort_by = 'relevance'
  } = args;

  // Fetch courses with provider data
  // Note: Using simple join without FK name since courses.provider_id (TEXT) 
  // references providers.provider_id (TEXT), not a standard BIGINT FK
  let queryBuilder = supabase
    .from('courses')
    .select(`
      *,
      providers(
        provider_id,
        company_name,
        logo_url,
        city,
        Certification
      )
    `, { count: 'exact' });

  // Apply filters
  if (status) {
    queryBuilder = queryBuilder.eq('status', status);
  }

  if (category) {
    queryBuilder = queryBuilder.ilike('category', `%${category}%`);
  }

  if (location) {
    queryBuilder = queryBuilder.ilike('location', `%${location}%`);
  }

  if (format) {
    queryBuilder = queryBuilder.ilike('format', `%${format}%`);
  }

  if (funding_eligible !== undefined) {
    queryBuilder = queryBuilder.eq('funding_eligible', funding_eligible);
  }

  if (funding_type) {
    queryBuilder = queryBuilder.contains('funding_types', [funding_type]);
  }

  if (language) {
    queryBuilder = queryBuilder.eq('language', language);
  }

  if (start_date_from) {
    queryBuilder = queryBuilder.gte('start_date', start_date_from);
  }

  if (start_date_to) {
    queryBuilder = queryBuilder.lte('start_date', start_date_to);
  }

  if (provider_id) {
    queryBuilder = queryBuilder.eq('provider_id', provider_id);
  }

  if (is_featured !== undefined) {
    queryBuilder = queryBuilder.eq('is_featured', is_featured);
  }

  if (certificate_type) {
    queryBuilder = queryBuilder.ilike('certificate_type', `%${certificate_type}%`);
  }

  // Text search on multiple fields with keyword expansion
  if (query) {
    // Expand query with synonyms and related terms
    const expandedTerms = expandSearchTerms(query);
    
    // Build OR conditions for all expanded terms across multiple fields
    // Use case-insensitive search (ilike) across title, description, category
    const searchConditions = expandedTerms.flatMap(term => [
      `title.ilike.%${term}%`,
      `description.ilike.%${term}%`,
      `category.ilike.%${term}%`,
      `subtitle.ilike.%${term}%`
    ]).join(',');
    
    queryBuilder = queryBuilder.or(searchConditions);
    
    console.log('🔍 Search query expanded:', { 
      original: query, 
      expanded: expandedTerms,
      searchFields: ['title', 'description', 'category', 'subtitle']
    });
  }

  // STEP 5: Improved Sorting - Semantic relevance first
  switch (sort_by) {
    case 'start_date':
      queryBuilder = queryBuilder.order('start_date', { ascending: true, nullsFirst: false });
      break;
    case 'view_count':
      queryBuilder = queryBuilder.order('views_count', { ascending: false });
      break;
    case 'application_count':
      queryBuilder = queryBuilder.order('application_count', { ascending: false });
      break;
    case 'created_at':
      queryBuilder = queryBuilder.order('created_at', { ascending: false });
      break;
    default:
      // Relevance - prioritize:
      // 1. Featured courses (verified quality)
      // 2. View count (popularity)
      // 3. Application count (proven interest)
      queryBuilder = queryBuilder.order('is_featured', { ascending: false });
      queryBuilder = queryBuilder.order('views_count', { ascending: false });
      queryBuilder = queryBuilder.order('application_count', { ascending: false });
  }

  // Pagination
  queryBuilder = queryBuilder.range(offset, offset + max_results - 1);

  const { data: courses, error, count } = await queryBuilder;

  if (error) {
    console.error('❌ Search courses error:', error);
    return {
      success: false,
      error: error.message
    };
  }

  // STEP 4A: City-based fallback search if location is specified but no results
  // ══════════════════════════════════════════════════════════════
  // FEATURE: Smart City Fallback
  // If user searches for courses in a specific city but none found,
  // automatically search nearby cities and online/remote options
  // ══════════════════════════════════════════════════════════════
  let fallbackContext = null; // Track if we used fallback
  
  if ((!courses || courses.length === 0) && location && query) {
    console.log('🏙️ No results in specified location, trying city fallback...');
    
    // Major German cities for fallback
    const majorCities = ['Berlin', 'Hamburg', 'München', 'Köln', 'Frankfurt'];
    const nearbyCities = {
      'Hamburg': ['Bremen', 'Lübeck', 'Berlin'],
      'Berlin': ['Potsdam', 'Leipzig', 'Hamburg'],
      'München': ['Augsburg', 'Nürnberg', 'Stuttgart'],
      'Köln': ['Düsseldorf', 'Bonn', 'Essen'],
      'Frankfurt': ['Mainz', 'Wiesbaden', 'Darmstadt'],
      'Bremen': ['Hamburg', 'Oldenburg'],
      'Leipzig': ['Dresden', 'Halle', 'Berlin'],
      'Dresden': ['Leipzig', 'Chemnitz'],
      'Stuttgart': ['Karlsruhe', 'Mannheim', 'München'],
      'Düsseldorf': ['Köln', 'Essen', 'Dortmund']
    };
    
    // Get nearby cities for the searched location
    const locationKey = Object.keys(nearbyCities).find(city => 
      location.toLowerCase().includes(city.toLowerCase())
    );
    const fallbackCities = locationKey ? nearbyCities[locationKey] : majorCities;
    
    console.log('🔍 Fallback cities:', fallbackCities);
    
    // Build query for nearby cities OR remote/online
    const cityConditions = fallbackCities.map(city => 
      `location.ilike.%${city}%`
    ).join(',');
    
    // Search in nearby cities OR online/remote courses
    const expandedTerms = expandSearchTerms(query);
    const searchConditions = expandedTerms.flatMap(term => [
      `title.ilike.%${term}%`,
      `description.ilike.%${term}%`,
      `category.ilike.%${term}%`,
      `subtitle.ilike.%${term}%`
    ]).join(',');
    
    let fallbackQueryBuilder = supabase
      .from('courses')
      .select('*', { count: 'exact' })
      .eq('status', status)
      .or(searchConditions);
    
    // Location: nearby cities OR online/remote
    fallbackQueryBuilder = fallbackQueryBuilder.or(
      `${cityConditions},format.ilike.%online%,format.ilike.%remote%,location.ilike.%online%`
    );
    
    // Apply other filters
    if (category) {
      fallbackQueryBuilder = fallbackQueryBuilder.ilike('category', `%${category}%`);
    }
    if (funding_eligible !== undefined) {
      fallbackQueryBuilder = fallbackQueryBuilder.eq('funding_eligible', funding_eligible);
    }
    
    // Sort by relevance
    fallbackQueryBuilder = fallbackQueryBuilder
      .order('is_featured', { ascending: false })
      .order('views_count', { ascending: false })
      .range(offset, offset + max_results - 1);
    
    const { data: cityFallbackCourses, count: cityFallbackCount } = await fallbackQueryBuilder;
    
    if (cityFallbackCourses && cityFallbackCourses.length > 0) {
      courses = cityFallbackCourses;
      count = cityFallbackCount;
      
      // Extract which cities/formats were found
      const foundLocations = new Set();
      const foundFormats = new Set();
      cityFallbackCourses.forEach(course => {
        if (course.location) foundLocations.add(course.location);
        if (course.format) foundFormats.add(course.format);
      });
      
      fallbackContext = {
        originalLocation: location,
        foundInCities: Array.from(foundLocations).slice(0, 3),
        hasOnline: Array.from(foundFormats).some(f => 
          f.toLowerCase().includes('online') || f.toLowerCase().includes('remote')
        ),
        totalResults: cityFallbackCount
      };
      
      console.log('✅ City fallback found courses:', courses.length, fallbackContext);
    }
  }
  
  // STEP 4B: General fallback search if still no results
  if ((!courses || courses.length === 0) && query) {
    console.log('🔄 No results found, trying category fallback search...');
    
    // Try broader category-based search
    const fallbackCategories = {
      'python': 'IT & Tech',
      'javascript': 'IT & Tech',
      'web': 'IT & Tech',
      'webentwicklung': 'IT & Tech',
      'development': 'IT & Tech',
      'entwicklung': 'IT & Tech',
      'programming': 'IT & Tech',
      'ux': 'Design',
      'ui': 'Design',
      'design': 'Design',
      'data': 'Data & Analytics',
      'marketing': 'Digital Marketing',
      'project': 'Project Management',
      'agile': 'Project Management'
    };
    
    const lowerQuery = query.toLowerCase();
    let fallbackCategory = null;
    
    for (const [keyword, category] of Object.entries(fallbackCategories)) {
      if (lowerQuery.includes(keyword)) {
        fallbackCategory = category;
        break;
      }
    }
    
    if (fallbackCategory) {
      console.log('🔍 Fallback: Searching category:', fallbackCategory);
      
      const { data: fallbackCourses, count: fallbackCount } = await supabase
        .from('courses')
        .select('*', { count: 'exact' })
        .eq('status', status)
        .ilike('category', `%${fallbackCategory}%`)
        .order('is_featured', { ascending: false })
        .order('views_count', { ascending: false })
        .range(offset, offset + max_results - 1);
      
      if (fallbackCourses && fallbackCourses.length > 0) {
        courses = fallbackCourses;
        count = fallbackCount;
        console.log('✅ Fallback found courses:', courses.length);
      }
    }
  }

  // Fetch providers separately for each course
  if (courses && courses.length > 0) {
    const coursesWithProviders = await Promise.all(
      courses.map(async (course) => {
        if (course.provider_id) {
          const { data: provider } = await supabase
            .from('providers')
            .select('id, provider_id, company_name, logo_url, city, Certification')
            .eq('provider_id', course.provider_id)
            .single();
          
          return {
            ...course,
            providers: provider || null,
            // STEP 6: Add recommendation rationale
            match_reason: generateMatchReason(course, query, category, location)
          };
        }
        return {
          ...course,
          match_reason: generateMatchReason(course, query, category, location)
        };
      })
    );

    console.log('✅ Found courses:', coursesWithProviders.length);
    
    return {
      success: true,
      data: {
        courses: coursesWithProviders,
        total: count || 0,
        showing: coursesWithProviders.length,
        offset,
        hasMore: count > offset + max_results,
        fallbackContext: fallbackContext || null // Include fallback info for AI to explain
      }
    };
  }

  console.log('⚠️ No courses found even after fallback');
  
  return {
    success: true,
    data: {
      courses: [],
      total: 0,
      showing: 0,
      offset,
      hasMore: false,
      message: query 
        ? `Keine ${query}-Kurse verfügbar. Versuchen Sie es mit anderen Suchbegriffen.`
        : 'Keine Kurse gefunden.'
    }
  };
}

// ═══════════════════════════════════════════════════════════════
// 2. GET COURSE DETAILS
// ═══════════════════════════════════════════════════════════════
async function getCourseDetails(args) {
  const { course_id, include_provider = true, include_similar = false } = args;

  // Try to find by ID first, then by slug
  let query = supabase.from('courses').select(`
    *,
    ${include_provider ? `providers!courses_provider_id_fkey(*)` : ''}
  `);

  // Check if course_id is numeric (ID) or string (slug)
  if (/^\d+$/.test(course_id)) {
    query = query.eq('id', course_id);
  } else {
    query = query.eq('slug', course_id);
  }

  const { data: course, error } = await query.single();

  if (error) {
    return {
      success: false,
      error: error.message
    };
  }

  const result = {
    success: true,
    data: { course }
  };

  // Get similar courses if requested
  if (include_similar && course) {
    const { data: similarCourses } = await supabase
      .from('courses')
      .select('id, title, location, duration, format, funding_types, provider_id')
      .eq('category', course.category)
      .neq('id', course.id)
      .eq('status', 'active')
      .limit(5);

    result.data.similar_courses = similarCourses || [];
  }

  return result;
}

// ═══════════════════════════════════════════════════════════════
// 3. SEARCH PROVIDERS
// ═══════════════════════════════════════════════════════════════
async function searchProviders(args) {
  const {
    query,
    city,
    certification,
    year_founded_min,
    has_courses = true,
    max_results = 10
  } = args;

  let queryBuilder = supabase
    .from('providers')
    .select(`
      *,
      courses:courses!courses_provider_id_fkey(count)
    `);

  if (query) {
    queryBuilder = queryBuilder.or(
      `company_name.ilike.%${query}%,description.ilike.%${query}%`
    );
  }

  if (city) {
    queryBuilder = queryBuilder.ilike('city', `%${city}%`);
  }

  if (certification) {
    queryBuilder = queryBuilder.contains('certifications', [certification]);
  }

  if (year_founded_min) {
    queryBuilder = queryBuilder.gte('year_founded', year_founded_min);
  }

  queryBuilder = queryBuilder.limit(max_results);

  const { data: providers, error } = await queryBuilder;

  if (error) {
    return {
      success: false,
      error: error.message
    };
  }

  // Filter providers with courses if requested
  let filteredProviders = providers || [];
  if (has_courses) {
    filteredProviders = filteredProviders.filter(p => p.courses?.[0]?.count > 0);
  }

  return {
    success: true,
    data: {
      providers: filteredProviders,
      total: filteredProviders.length
    }
  };
}

// ═══════════════════════════════════════════════════════════════
// 4. GET PROVIDER DETAILS
// ═══════════════════════════════════════════════════════════════
async function getProviderDetails(args) {
  const {
    provider_id,
    include_courses = true,
    include_faqs = true,
    include_stats = false
  } = args;

  // Get provider by ID (bigint) or provider_id (text)
  let query = supabase.from('providers').select('*');

  if (/^\d+$/.test(provider_id)) {
    query = query.eq('id', provider_id);
  } else {
    query = query.eq('provider_id', provider_id);
  }

  const { data: provider, error } = await query.single();

  if (error) {
    return {
      success: false,
      error: error.message
    };
  }

  const result = {
    success: true,
    data: { provider }
  };

  // Get courses
  if (include_courses) {
    const { data: courses } = await supabase
      .from('courses')
      .select('id, title, location, duration, format, funding_types, status, view_count, application_count')
      .eq('provider_id', provider.provider_id || provider.id)
      .eq('status', 'active');

    result.data.courses = courses || [];
  }

  // Get FAQs
  if (include_faqs) {
    const { data: faqs } = await supabase
      .from('provider_faqs')
      .select('*')
      .eq('provider_id', provider.provider_id || provider.id)
      .eq('is_active', true)
      .order('display_order', { ascending: true });

    result.data.faqs = faqs || [];
  }

  // Get statistics
  if (include_stats) {
    const { data: stats } = await supabase
      .from('courses')
      .select('view_count, application_count, click_count')
      .eq('provider_id', provider.provider_id || provider.id);

    const totalViews = stats?.reduce((sum, c) => sum + (c.view_count || 0), 0) || 0;
    const totalApplications = stats?.reduce((sum, c) => sum + (c.application_count || 0), 0) || 0;
    const totalClicks = stats?.reduce((sum, c) => sum + (c.click_count || 0), 0) || 0;

    result.data.stats = {
      total_courses: stats?.length || 0,
      total_views: totalViews,
      total_applications: totalApplications,
      total_clicks: totalClicks
    };
  }

  return result;
}

// ═══════════════════════════════════════════════════════════════
// 5. SEARCH STUDENT APPLICATIONS
// ═══════════════════════════════════════════════════════════════
async function searchStudentApplications(args, context) {
  const {
    student_id,
    status,
    course_id,
    provider_id,
    funding_type,
    has_funding_approved,
    applied_after,
    applied_before,
    sort_by = 'applied_at',
    sort_order = 'desc'
  } = args;

  // Verify student_id matches authenticated user
  if (!student_id || (context.studentId && student_id !== context.studentId.toString())) {
    return {
      success: false,
      error: 'Unauthorized: Invalid student ID'
    };
  }

  let queryBuilder = supabase
    .from('applications')
    .select(`
      *,
      courses!applications_course_id_fkey(
        id, title, location, duration, format, start_date, slug
      ),
      providers!applications_provider_id_fkey(
        id, company_name, email, phone, website
      )
    `)
    .eq('student_id', student_id);

  if (status) {
    queryBuilder = queryBuilder.eq('status', status);
  }

  if (course_id) {
    queryBuilder = queryBuilder.eq('course_id', course_id);
  }

  if (provider_id) {
    queryBuilder = queryBuilder.eq('provider_id', provider_id);
  }

  if (funding_type) {
    queryBuilder = queryBuilder.eq('funding_type', funding_type);
  }

  if (has_funding_approved !== undefined) {
    queryBuilder = queryBuilder.eq('has_funding_approved', has_funding_approved);
  }

  if (applied_after) {
    queryBuilder = queryBuilder.gte('applied_at', applied_after);
  }

  if (applied_before) {
    queryBuilder = queryBuilder.lte('applied_at', applied_before);
  }

  queryBuilder = queryBuilder.order(sort_by, { ascending: sort_order === 'asc' });

  const { data: applications, error } = await queryBuilder;

  if (error) {
    return {
      success: false,
      error: error.message
    };
  }

  return {
    success: true,
    data: {
      applications: applications || [],
      total: applications?.length || 0
    }
  };
}

// ═══════════════════════════════════════════════════════════════
// 6. SEARCH PROVIDER APPLICATIONS
// ═══════════════════════════════════════════════════════════════
async function searchProviderApplications(args, context) {
  const {
    provider_id,
    status,
    course_id,
    provider_viewed,
    has_funding_approved,
    applied_after,
    sort_by = 'applied_at',
    max_results = 20
  } = args;

  // Verify provider_id matches authenticated user
  if (!provider_id || (context.providerId && provider_id !== context.providerId.toString())) {
    return {
      success: false,
      error: 'Unauthorized: Invalid provider ID'
    };
  }

  let queryBuilder = supabase
    .from('applications')
    .select(`
      *,
      courses!applications_course_id_fkey(
        id, title, location, duration, format, start_date
      )
    `)
    .eq('provider_id', provider_id);

  if (status) {
    queryBuilder = queryBuilder.eq('status', status);
  }

  if (course_id) {
    queryBuilder = queryBuilder.eq('course_id', course_id);
  }

  if (provider_viewed !== undefined) {
    queryBuilder = queryBuilder.eq('provider_viewed', provider_viewed);
  }

  if (has_funding_approved !== undefined) {
    queryBuilder = queryBuilder.eq('has_funding_approved', has_funding_approved);
  }

  if (applied_after) {
    queryBuilder = queryBuilder.gte('applied_at', applied_after);
  }

  queryBuilder = queryBuilder.order(sort_by, { ascending: false });
  queryBuilder = queryBuilder.limit(max_results);

  const { data: applications, error } = await queryBuilder;

  if (error) {
    return {
      success: false,
      error: error.message
    };
  }

  return {
    success: true,
    data: {
      applications: applications || [],
      total: applications?.length || 0
    }
  };
}

// ═══════════════════════════════════════════════════════════════
// 7. SEARCH SAVED COURSES
// ═══════════════════════════════════════════════════════════════
async function searchSavedCourses(args, context) {
  const {
    student_id,
    category,
    location,
    funding_type,
    has_notes,
    saved_after,
    sort_by = 'saved_at',
    sort_order = 'desc'
  } = args;

  // Verify student_id matches authenticated user
  if (!student_id || (context.studentId && student_id !== context.studentId.toString())) {
    return {
      success: false,
      error: 'Unauthorized: Invalid student ID'
    };
  }

  let queryBuilder = supabase
    .from('saved_courses')
    .select(`
      *,
      courses!saved_courses_course_id_fkey(
        id, title, subtitle, location, duration, format, start_date,
        funding_types, category, provider_id, slug, image_url,
        providers!courses_provider_id_fkey(
          company_name, logo_url
        )
      )
    `)
    .eq('student_id', student_id);

  if (has_notes) {
    queryBuilder = queryBuilder.not('notes', 'is', null);
  }

  if (saved_after) {
    queryBuilder = queryBuilder.gte('saved_at', saved_after);
  }

  queryBuilder = queryBuilder.order(sort_by, { ascending: sort_order === 'asc' });

  const { data: savedCourses, error } = await queryBuilder;

  if (error) {
    return {
      success: false,
      error: error.message
    };
  }

  // Apply course-level filters
  let filteredCourses = savedCourses || [];

  if (category) {
    filteredCourses = filteredCourses.filter(sc => 
      sc.courses?.category?.toLowerCase().includes(category.toLowerCase())
    );
  }

  if (location) {
    filteredCourses = filteredCourses.filter(sc => 
      sc.courses?.location?.toLowerCase().includes(location.toLowerCase())
    );
  }

  if (funding_type) {
    filteredCourses = filteredCourses.filter(sc => 
      sc.courses?.funding_types?.includes(funding_type)
    );
  }

  return {
    success: true,
    data: {
      saved_courses: filteredCourses,
      total: filteredCourses.length
    }
  };
}

// ═══════════════════════════════════════════════════════════════
// 8. GET STUDENT PROFILE
// ═══════════════════════════════════════════════════════════════
async function getStudentProfile(args, context) {
  const { student_id, include_stats = true } = args;

  // Verify student_id matches authenticated user
  if (!student_id || (context.studentId && student_id !== context.studentId.toString())) {
    return {
      success: false,
      error: 'Unauthorized: Invalid student ID'
    };
  }

  const { data: student, error } = await supabase
    .from('students')
    .select('*')
    .eq('id', student_id)
    .single();

  if (error) {
    return {
      success: false,
      error: error.message
    };
  }

  const result = {
    success: true,
    data: { student }
  };

  if (include_stats) {
    // Get application count
    const { count: applicationCount } = await supabase
      .from('applications')
      .select('*', { count: 'exact', head: true })
      .eq('student_id', student_id);

    // Get saved courses count
    const { count: savedCoursesCount } = await supabase
      .from('saved_courses')
      .select('*', { count: 'exact', head: true })
      .eq('student_id', student_id);

    result.data.stats = {
      total_applications: applicationCount || 0,
      total_saved_courses: savedCoursesCount || 0
    };
  }

  return result;
}

// ═══════════════════════════════════════════════════════════════
// 9. GET COURSE STATISTICS
// ═══════════════════════════════════════════════════════════════
async function getCourseStatistics(args) {
  const {
    category,
    location,
    funding_type,
    time_period = 'all_time',
    metrics = ['total_courses']
  } = args;

  const result = {
    success: true,
    data: {}
  };

  let queryBuilder = supabase.from('courses').select('*', { count: 'exact' });

  if (category) {
    queryBuilder = queryBuilder.ilike('category', `%${category}%`);
  }

  if (location) {
    queryBuilder = queryBuilder.ilike('location', `%${location}%`);
  }

  if (funding_type) {
    queryBuilder = queryBuilder.contains('funding_types', [funding_type]);
  }

  queryBuilder = queryBuilder.eq('status', 'active');

  // Apply time filter if needed
  if (time_period !== 'all_time') {
    const daysAgo = {
      'last_7_days': 7,
      'last_30_days': 30,
      'last_90_days': 90
    }[time_period];

    const dateThreshold = new Date();
    dateThreshold.setDate(dateThreshold.getDate() - daysAgo);
    queryBuilder = queryBuilder.gte('created_at', dateThreshold.toISOString());
  }

  const { data: courses, count } = await queryBuilder;

  // Calculate requested metrics
  if (metrics.includes('total_courses')) {
    result.data.total_courses = count || 0;
  }

  if (metrics.includes('total_applications')) {
    result.data.total_applications = courses?.reduce((sum, c) => sum + (c.application_count || 0), 0) || 0;
  }

  if (metrics.includes('total_views')) {
    result.data.total_views = courses?.reduce((sum, c) => sum + (c.view_count || 0), 0) || 0;
  }

  if (metrics.includes('avg_duration')) {
    // This would need more complex parsing of duration strings
    result.data.avg_duration = 'Not implemented';
  }

  if (metrics.includes('popular_categories')) {
    const categoryCounts = {};
    courses?.forEach(c => {
      if (c.category) {
        categoryCounts[c.category] = (categoryCounts[c.category] || 0) + 1;
      }
    });
    result.data.popular_categories = Object.entries(categoryCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([category, count]) => ({ category, count }));
  }

  if (metrics.includes('popular_locations')) {
    const locationCounts = {};
    courses?.forEach(c => {
      if (c.location) {
        locationCounts[c.location] = (locationCounts[c.location] || 0) + 1;
      }
    });
    result.data.popular_locations = Object.entries(locationCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([location, count]) => ({ location, count }));
  }

  if (metrics.includes('trending_courses')) {
    result.data.trending_courses = courses
      ?.sort((a, b) => (b.view_count || 0) - (a.view_count || 0))
      .slice(0, 10)
      .map(c => ({
        id: c.id,
        title: c.title,
        view_count: c.view_count,
        application_count: c.application_count
      })) || [];
  }

  return result;
}

// ═══════════════════════════════════════════════════════════════
// 10. COMPARE COURSES
// ═══════════════════════════════════════════════════════════════
async function compareCourses(args) {
  const { course_ids, comparison_fields } = args;

  const { data: courses, error } = await supabase
    .from('courses')
    .select(`
      *,
      providers!courses_provider_id_fkey(
        company_name, city, certifications
      )
    `)
    .in('id', course_ids);

  if (error) {
    return {
      success: false,
      error: error.message
    };
  }

  // Build comparison object
  const comparison = {
    courses: courses?.map(c => ({
      id: c.id,
      title: c.title,
      duration: c.duration,
      price: c.price,
      funding_types: c.funding_types,
      location: c.location,
      format: c.format,
      start_date: c.start_date,
      next_start_dates: c.next_start_dates,
      curriculum: c.curriculum,
      prerequisites: c.prerequisites,
      certificate_type: c.certificate_type,
      provider: c.providers?.company_name,
      view_count: c.view_count,
      application_count: c.application_count
    })) || []
  };

  return {
    success: true,
    data: comparison
  };
}

// ═══════════════════════════════════════════════════════════════
// 11. GET CHAT HISTORY
// ═══════════════════════════════════════════════════════════════
async function getChatHistory(args, context) {
  const {
    student_id,
    conversation_id,
    limit = 50,
    include_course_context = false
  } = args;

  // Verify student_id matches authenticated user
  if (!student_id || (context.studentId && student_id !== context.studentId.toString())) {
    return {
      success: false,
      error: 'Unauthorized: Invalid student ID'
    };
  }

  let queryBuilder = supabase
    .from('chat_history')
    .select(`
      *
      ${include_course_context ? ', courses!chat_history_course_context_id_fkey(id, title, slug)' : ''}
    `)
    .eq('student_id', student_id);

  if (conversation_id) {
    queryBuilder = queryBuilder.eq('conversation_id', conversation_id);
  }

  queryBuilder = queryBuilder
    .order('created_at', { ascending: true })
    .limit(limit);

  const { data: messages, error } = await queryBuilder;

  if (error) {
    return {
      success: false,
      error: error.message
    };
  }

  return {
    success: true,
    data: {
      messages: messages || [],
      total: messages?.length || 0
    }
  };
}

// ═══════════════════════════════════════════════════════════════
// 12. RECOMMEND COURSES (AI-Powered)
// ═══════════════════════════════════════════════════════════════
async function recommendCourses(args, context) {
  const {
    student_id,
    career_goal,
    current_skills = [],
    interests = [],
    constraints = {},
    max_results = 5
  } = args;

  // Start with base query
  let queryBuilder = supabase
    .from('courses')
    .select(`
      *,
      providers!courses_provider_id_fkey(company_name, logo_url)
    `)
    .eq('status', 'active');

  // Apply constraints
  if (constraints.location) {
    queryBuilder = queryBuilder.ilike('location', `%${constraints.location}%`);
  }

  if (constraints.format) {
    queryBuilder = queryBuilder.ilike('format', `%${constraints.format}%`);
  }

  if (constraints.funding_required) {
    queryBuilder = queryBuilder.eq('funding_eligible', true);
  }

  // Get student profile if available
  let studentInterests = interests;
  if (student_id) {
    const { data: student } = await supabase
      .from('students')
      .select('interests, location_preference')
      .eq('id', student_id)
      .single();

    if (student?.interests) {
      studentInterests = [...studentInterests, ...student.interests];
    }

    if (!constraints.location && student?.location_preference) {
      queryBuilder = queryBuilder.ilike('location', `%${student.location_preference}%`);
    }
  }

  // Match based on career goal or interests
  if (career_goal) {
    queryBuilder = queryBuilder.or(
      `title.ilike.%${career_goal}%,description.ilike.%${career_goal}%,category.ilike.%${career_goal}%`
    );
  } else if (studentInterests.length > 0) {
    const interestQuery = studentInterests.map(i => 
      `title.ilike.%${i}%,description.ilike.%${i}%,category.ilike.%${i}%`
    ).join(',');
    queryBuilder = queryBuilder.or(interestQuery);
  }

  queryBuilder = queryBuilder
    .order('view_count', { ascending: false })
    .limit(max_results);

  const { data: courses, error } = await queryBuilder;

  if (error) {
    return {
      success: false,
      error: error.message
    };
  }

  return {
    success: true,
    data: {
      recommendations: courses || [],
      total: courses?.length || 0,
      reasoning: career_goal 
        ? `Courses matched to career goal: ${career_goal}`
        : `Courses matched to interests: ${studentInterests.join(', ')}`
    }
  };
}

