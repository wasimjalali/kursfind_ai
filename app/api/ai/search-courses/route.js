import { createClient } from '@/lib/supabase-server'

export async function POST(req) {
  try {
    const body = await req.json()
    const {
      query = '',
      category,
      format,
      location,
      funding,
      language,
      maxResults = 10,
      offset = 0
    } = body

    const supabase = await createClient()

    // Build the query
    let dbQuery = supabase
      .from('courses')
      .select(`
        *,
        providers!courses_provider_id_fkey(
          provider_id,
          company_name,
          logo_url,
          phone,
          email,
          website
        )
      `, { count: 'exact' })
    
    // Filter by status if column exists (optional - some databases might not have it)
    // Note: If status column doesn't exist, this will be ignored by Supabase
    dbQuery = dbQuery.eq('status', 'active')

    // Smart search across relevant fields
    if (query && query.trim()) {
      const searchTerm = query.trim()
      // Search in title, description, and subtitle
      dbQuery = dbQuery.or(`
        title.ilike.%${searchTerm}%,
        description.ilike.%${searchTerm}%,
        subtitle.ilike.%${searchTerm}%
      `)
    }

    // Apply filters
    if (category) {
      dbQuery = dbQuery.eq('category', category)
    }

    if (format) {
      dbQuery = dbQuery.eq('format', format)
    }

    if (location) {
      dbQuery = dbQuery.eq('location', location)
    }

    if (language) {
      dbQuery = dbQuery.eq('language', language)
    }

    if (funding) {
      // Check if funding_types array contains the value
      dbQuery = dbQuery.contains('funding_types', [funding])
    }

    // Order by popularity (view_count) first, then by created_at
    dbQuery = dbQuery
      .order('view_count', { ascending: false, nullsFirst: false })
      .order('created_at', { ascending: false })

    // Apply pagination
    const limit = Math.min(maxResults, 20) // Max 20 at a time
    const start = offset
    const end = start + limit - 1

    dbQuery = dbQuery.range(start, end)

    const { data, error, count } = await dbQuery

    if (error) {
      console.error('Search courses error:', error)
      // Try fallback without provider join
      const fallbackQuery = supabase
        .from('courses')
        .select('*', { count: 'exact' })
        .eq('status', 'active')

      // Reapply filters
      if (query && query.trim()) {
        const searchTerm = query.trim()
        fallbackQuery.or(`title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%,subtitle.ilike.%${searchTerm}%`)
      }
      if (category) fallbackQuery.eq('category', category)
      if (format) fallbackQuery.eq('format', format)
      if (location) fallbackQuery.eq('location', location)
      if (language) fallbackQuery.eq('language', language)
      if (funding) fallbackQuery.contains('funding_types', [funding])

      fallbackQuery
        .order('view_count', { ascending: false, nullsFirst: false })
        .order('created_at', { ascending: false })
        .range(start, end)

      const { data: fallbackData, error: fallbackError, count: fallbackCount } = await fallbackQuery

      if (fallbackError) {
        return Response.json({
          error: 'Failed to search courses',
          message: fallbackError.message
        }, { status: 500 })
      }

      return Response.json({
        courses: fallbackData || [],
        total: fallbackCount || 0,
        hasMore: (fallbackCount || 0) > (offset + limit),
        nextOffset: offset + limit,
        limit
      })
    }

    return Response.json({
      courses: data || [],
      total: count || 0,
      hasMore: (count || 0) > (offset + limit),
      nextOffset: offset + limit,
      limit
    })

  } catch (error) {
    console.error('API Error:', error)
    return Response.json({
      error: 'Internal server error',
      message: error.message
    }, { status: 500 })
  }
}

