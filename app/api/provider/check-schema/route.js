import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export async function GET(request) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

  if (!supabaseUrl || (!supabaseServiceKey && !supabaseAnonKey)) {
    return NextResponse.json(
      { error: 'Missing Supabase credentials' },
      { status: 500 }
    );
  }

  // Use service role key to bypass RLS for schema inspection
  const supabaseKey = supabaseServiceKey && supabaseServiceKey.trim() !== '' 
    ? supabaseServiceKey 
    : supabaseAnonKey;

  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    // Try to query the table structure by selecting one row
    const { data, error } = await supabase
      .from('providers')
      .select('*')
      .limit(1);

    if (error) {
      // If table doesn't exist, try to get column info from information_schema
      if (error.message?.includes('does not exist') || error.code === '42P01') {
        return NextResponse.json({
          exists: false,
          error: 'Table "providers" does not exist',
          message: 'You need to run the SQL migration to create the table. See create_providers_table.sql',
          sqlFile: 'create_providers_table.sql'
        }, { status: 404 });
      }

      return NextResponse.json({
        exists: true,
        error: error.message,
        code: error.code,
        hint: error.hint
      }, { status: 500 });
    }

    // If we got data, infer columns from the first row
    const columns = data && data.length > 0 ? Object.keys(data[0]) : [];

    const expectedColumns = [
      'id',
      'auth_user_id',
      'provider_id',
      'email',
      'company_name',
      'contact_name',
      'phone',
      'website',
      'description',
      'street',
      'city',
      'postal_code',
      'logo_url',
      'created_at',
      'updated_at'
    ];

    const missingColumns = expectedColumns.filter(col => !columns.includes(col));
    const extraColumns = columns.filter(col => !expectedColumns.includes(col));

    return NextResponse.json({
      exists: true,
      columns: columns,
      sampleData: data?.[0] || null,
      expectedColumns: expectedColumns,
      missingColumns: missingColumns,
      extraColumns: extraColumns,
      message: columns.length > 0 
        ? `Table exists with ${columns.length} columns: ${columns.join(', ')}`
        : 'Table exists but appears to be empty',
      status: missingColumns.length > 0 
        ? 'MISSING_COLUMNS' 
        : extraColumns.length > 0 
        ? 'EXTRA_COLUMNS' 
        : 'OK'
    });

  } catch (error) {
    return NextResponse.json({
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    }, { status: 500 });
  }
}

