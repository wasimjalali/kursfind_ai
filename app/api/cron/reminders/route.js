import { createClient } from '@supabase/supabase-js'
import { sendStudentReminder, sendProviderReminder } from '@/lib/email'

/**
 * GET /api/cron/reminders
 * 
 * Cron job endpoint to send reminder emails for pending applications.
 * Should be called periodically (e.g., every hour or every 6 hours).
 * 
 * Security: Protected by CRON_SECRET environment variable.
 * 
 * Reminder Schedule:
 * - Provider R1: 24h after application, if status = 'new'
 * - Provider R2: 72h after application, if status = 'new'
 * - Student R1: 48h after application, if status = 'new'
 * - Student R2: 4 days after application, if status still 'new' or 'contacted'
 */
export async function GET(request) {
  try {
    // Verify cron secret (protect from unauthorized calls)
    const authHeader = request.headers.get('authorization')
    const cronSecret = process.env.CRON_SECRET
    
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      console.log('[Reminders] Unauthorized cron attempt')
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    console.log('[Reminders] Starting reminder job...')
    
    // Initialize Supabase with service role
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    )
    
    const now = new Date()
    const results = {
      providerR1: 0,
      providerR2: 0,
      studentR1: 0,
      studentR2: 0,
      errors: []
    }
    
    // ============================================
    // PROVIDER REMINDERS
    // ============================================
    
    // Get all applications with status 'new' that haven't been reminded yet
    const { data: pendingApps, error: fetchError } = await supabase
      .from('applications')
      .select(`
        id,
        first_name,
        last_name,
        email,
        applied_at,
        provider_id,
        course_id,
        provider_reminder_1_sent,
        provider_reminder_2_sent,
        student_reminder_1_sent,
        student_reminder_2_sent,
        courses:course_id (title),
        providers:provider_id (id, company_name, email)
      `)
      .eq('status', 'new')
      .order('applied_at', { ascending: true })
    
    if (fetchError) {
      console.error('[Reminders] Error fetching applications:', fetchError)
      return Response.json({ error: 'Failed to fetch applications' }, { status: 500 })
    }
    
    console.log(`[Reminders] Found ${pendingApps?.length || 0} pending applications`)
    
    // Group applications by provider for provider reminders
    const appsByProvider = {}
    
    for (const app of pendingApps || []) {
      const appliedAt = new Date(app.applied_at)
      const hoursAgo = (now - appliedAt) / (1000 * 60 * 60)
      const daysAgo = hoursAgo / 24
      
      const providerId = app.provider_id
      const providerEmail = app.providers?.email
      const providerName = app.providers?.company_name || 'Anbieter'
      const courseName = app.courses?.title || 'Kurs'
      const studentName = `${app.first_name} ${app.last_name}`
      
      // Track for provider reminders
      if (providerEmail) {
        if (!appsByProvider[providerId]) {
          appsByProvider[providerId] = {
            email: providerEmail,
            name: providerName,
            apps: [],
            needsR1: false,
            needsR2: false
          }
        }
        
        // Check if this app triggers a reminder
        if (hoursAgo >= 24 && !app.provider_reminder_1_sent) {
          appsByProvider[providerId].needsR1 = true
        }
        if (hoursAgo >= 72 && !app.provider_reminder_2_sent) {
          appsByProvider[providerId].needsR2 = true
        }
        
        appsByProvider[providerId].apps.push({
          id: app.id,
          studentName,
          courseName,
          daysPending: Math.floor(daysAgo),
          hoursAgo,
          r1Sent: app.provider_reminder_1_sent,
          r2Sent: app.provider_reminder_2_sent
        })
      }
      
      // ============================================
      // STUDENT REMINDERS
      // ============================================
      
      const studentEmail = app.email
      
      // Student R1: 48h after application
      if (hoursAgo >= 48 && !app.student_reminder_1_sent && studentEmail) {
        try {
          await sendStudentReminder({
            studentEmail,
            studentName,
            courseName,
            providerName,
            daysPending: Math.floor(daysAgo),
            isSecondReminder: false
          })
          
          // Mark as sent
          await supabase
            .from('applications')
            .update({ student_reminder_1_sent: true })
            .eq('id', app.id)
          
          results.studentR1++
          console.log(`[Reminders] Student R1 sent: ${studentEmail} for ${courseName}`)
        } catch (err) {
          console.error(`[Reminders] Failed to send student R1:`, err)
          results.errors.push(`Student R1 ${app.id}: ${err.message}`)
        }
      }
      
      // Student R2: 4 days after application
      if (daysAgo >= 4 && !app.student_reminder_2_sent && studentEmail) {
        try {
          await sendStudentReminder({
            studentEmail,
            studentName,
            courseName,
            providerName,
            daysPending: Math.floor(daysAgo),
            isSecondReminder: true
          })
          
          // Mark as sent
          await supabase
            .from('applications')
            .update({ student_reminder_2_sent: true })
            .eq('id', app.id)
          
          results.studentR2++
          console.log(`[Reminders] Student R2 sent: ${studentEmail} for ${courseName}`)
        } catch (err) {
          console.error(`[Reminders] Failed to send student R2:`, err)
          results.errors.push(`Student R2 ${app.id}: ${err.message}`)
        }
      }
    }
    
    // Send provider reminders (grouped by provider)
    for (const [providerId, data] of Object.entries(appsByProvider)) {
      const pendingAppsForProvider = data.apps.filter(a => !a.r1Sent || !a.r2Sent)
      
      if (pendingAppsForProvider.length === 0) continue
      
      // Provider R1: At least one app is >= 24h and R1 not sent
      if (data.needsR1) {
        const appsNeedingR1 = data.apps.filter(a => a.hoursAgo >= 24 && !a.r1Sent)
        if (appsNeedingR1.length > 0) {
          try {
            await sendProviderReminder({
              providerEmail: data.email,
              providerName: data.name,
              pendingCount: appsNeedingR1.length,
              applications: appsNeedingR1,
              isSecondReminder: false
            })
            
            // Mark all these apps as R1 sent
            for (const app of appsNeedingR1) {
              await supabase
                .from('applications')
                .update({ provider_reminder_1_sent: true })
                .eq('id', app.id)
            }
            
            results.providerR1++
            console.log(`[Reminders] Provider R1 sent: ${data.email} (${appsNeedingR1.length} apps)`)
          } catch (err) {
            console.error(`[Reminders] Failed to send provider R1:`, err)
            results.errors.push(`Provider R1 ${providerId}: ${err.message}`)
          }
        }
      }
      
      // Provider R2: At least one app is >= 72h and R2 not sent
      if (data.needsR2) {
        const appsNeedingR2 = data.apps.filter(a => a.hoursAgo >= 72 && !a.r2Sent)
        if (appsNeedingR2.length > 0) {
          try {
            await sendProviderReminder({
              providerEmail: data.email,
              providerName: data.name,
              pendingCount: appsNeedingR2.length,
              applications: appsNeedingR2,
              isSecondReminder: true
            })
            
            // Mark all these apps as R2 sent
            for (const app of appsNeedingR2) {
              await supabase
                .from('applications')
                .update({ provider_reminder_2_sent: true })
                .eq('id', app.id)
            }
            
            results.providerR2++
            console.log(`[Reminders] Provider R2 sent: ${data.email} (${appsNeedingR2.length} apps)`)
          } catch (err) {
            console.error(`[Reminders] Failed to send provider R2:`, err)
            results.errors.push(`Provider R2 ${providerId}: ${err.message}`)
          }
        }
      }
    }
    
    console.log('[Reminders] Job completed:', results)
    
    return Response.json({
      success: true,
      message: 'Reminder job completed',
      results
    })
    
  } catch (error) {
    console.error('[Reminders] Job failed:', error)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}
