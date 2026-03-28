/**
 * Notification Helper Utilities
 * 
 * This module provides functions to create and manage notifications
 * for students and providers in the Kursfind AI platform.
 */

import { createClient } from '@supabase/supabase-js'

// Create admin client for server-side operations (bypasses RLS)
function getAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  
  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('Missing Supabase credentials for admin client')
  }
  
  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })
}

/**
 * Notification types for students
 */
export const STUDENT_NOTIFICATION_TYPES = {
  APPLICATION_SUBMITTED: 'application_submitted',
  APPLICATION_STATUS_CHANGED: 'application_status_changed',
  ADDITIONAL_INFO_REQUESTED: 'additional_info_requested',
  APPLICATION_WITHDRAWN: 'application_withdrawn',
  PLATFORM_UPDATE: 'platform_update',
  SECURITY: 'security',
}

/**
 * Notification types for providers
 */
export const PROVIDER_NOTIFICATION_TYPES = {
  NEW_APPLICATION: 'provider_new_application',
  PENDING_DECISIONS: 'provider_pending_decisions',
  PERFORMANCE_UPDATE: 'provider_performance_update',
  PLATFORM_UPDATE: 'platform_update',
  SECURITY: 'security',
}

/**
 * Notification categories
 */
export const NOTIFICATION_CATEGORIES = {
  APPLICATIONS: 'applications',
  ACTIONS_REQUIRED: 'actions_required',
  ANALYTICS: 'analytics',
  PLATFORM: 'platform',
  SECURITY: 'security',
  BILLING: 'billing',
}

/**
 * Create a notification for a student
 * 
 * @param {Object} params
 * @param {number} params.userId - Student's ID (from students table)
 * @param {string} params.type - Notification type
 * @param {string} params.category - Notification category
 * @param {string} params.title - Notification title
 * @param {string} params.message - Notification message
 * @param {string} [params.link] - Optional link to navigate to
 * @returns {Promise<{success: boolean, id?: string, error?: string}>}
 */
export async function createStudentNotification({
  userId,
  type,
  category = NOTIFICATION_CATEGORIES.APPLICATIONS,
  title,
  message,
  link = null
}) {
  try {
    const supabase = getAdminClient()
    
    const { data, error } = await supabase
      .from('notifications')
      .insert({
        role: 'student',
        user_id: userId,
        provider_id: null,
        type,
        category,
        title,
        message,
        link,
        is_read: false
      })
      .select('id')
      .single()
    
    if (error) {
      console.error('Error creating student notification:', error)
      return { success: false, error: error.message }
    }
    
    return { success: true, id: data.id }
  } catch (error) {
    console.error('Error in createStudentNotification:', error)
    return { success: false, error: error.message }
  }
}

/**
 * Create a notification for a provider
 * 
 * @param {Object} params
 * @param {number} params.providerId - Provider's ID (from providers table)
 * @param {string} params.type - Notification type
 * @param {string} params.category - Notification category
 * @param {string} params.title - Notification title
 * @param {string} params.message - Notification message
 * @param {string} [params.link] - Optional link to navigate to
 * @returns {Promise<{success: boolean, id?: string, error?: string}>}
 */
export async function createProviderNotification({
  providerId,
  type,
  category = NOTIFICATION_CATEGORIES.APPLICATIONS,
  title,
  message,
  link = null
}) {
  try {
    const supabase = getAdminClient()
    
    const { data, error } = await supabase
      .from('notifications')
      .insert({
        role: 'provider',
        user_id: null,
        provider_id: providerId,
        type,
        category,
        title,
        message,
        link,
        is_read: false
      })
      .select('id')
      .single()
    
    if (error) {
      console.error('Error creating provider notification:', error)
      return { success: false, error: error.message }
    }
    
    return { success: true, id: data.id }
  } catch (error) {
    console.error('Error in createProviderNotification:', error)
    return { success: false, error: error.message }
  }
}

/**
 * Create notifications when a student submits an application
 * Creates notification for both student and provider
 * 
 * @param {Object} params
 * @param {number} params.studentId - Student's ID
 * @param {number} params.providerId - Provider's ID
 * @param {string} params.courseName - Name of the course
 * @param {number} params.applicationId - Application ID
 * @param {string} params.studentName - Student's name for provider notification
 */
export async function notifyApplicationSubmitted({
  studentId,
  providerId,
  courseName,
  applicationId: _applicationId,
  studentName
}) {
  const results = await Promise.all([
    // Notify student
    createStudentNotification({
      userId: studentId,
      type: STUDENT_NOTIFICATION_TYPES.APPLICATION_SUBMITTED,
      category: NOTIFICATION_CATEGORIES.APPLICATIONS,
      title: 'Bewerbung gesendet',
      message: `Ihre Bewerbung für "${courseName}" wurde erfolgreich gesendet.`,
      link: `/student/dashboard/applications`
    }),
    // Notify provider
    createProviderNotification({
      providerId,
      type: PROVIDER_NOTIFICATION_TYPES.NEW_APPLICATION,
      category: NOTIFICATION_CATEGORIES.APPLICATIONS,
      title: 'Neue Bewerbung',
      message: `${studentName} hat sich für "${courseName}" beworben.`,
      link: `/provider/dashboard/applications`
    })
  ])
  
  return results
}

/**
 * Create notification when application status changes
 * 
 * @param {Object} params
 * @param {number} params.studentId - Student's ID
 * @param {string} params.courseName - Name of the course
 * @param {string} params.newStatus - New status of the application
 * @param {number} params.applicationId - Application ID
 */
export async function notifyApplicationStatusChanged({
  studentId,
  courseName,
  newStatus,
  applicationId: _applicationId
}) {
  // Map status to German labels
  const statusLabels = {
    'new': 'Neu',
    'in_review': 'In Bearbeitung',
    'accepted': 'Angenommen',
    'rejected': 'Abgelehnt',
    'withdrawn': 'Zurückgezogen',
    'info_requested': 'Weitere Informationen angefordert'
  }
  
  const statusLabel = statusLabels[newStatus] || newStatus
  
  return createStudentNotification({
    userId: studentId,
    type: STUDENT_NOTIFICATION_TYPES.APPLICATION_STATUS_CHANGED,
    category: NOTIFICATION_CATEGORIES.APPLICATIONS,
    title: 'Bewerbungsstatus aktualisiert',
    message: `Der Status Ihrer Bewerbung für "${courseName}" wurde auf "${statusLabel}" geändert.`,
    link: `/student/dashboard/applications`
  })
}

/**
 * Create notification when provider requests additional info
 * 
 * @param {Object} params
 * @param {number} params.studentId - Student's ID
 * @param {string} params.courseName - Name of the course
 * @param {string} params.providerName - Provider's company name
 */
export async function notifyAdditionalInfoRequested({
  studentId,
  courseName,
  providerName
}) {
  return createStudentNotification({
    userId: studentId,
    type: STUDENT_NOTIFICATION_TYPES.ADDITIONAL_INFO_REQUESTED,
    category: NOTIFICATION_CATEGORIES.ACTIONS_REQUIRED,
    title: 'Weitere Informationen angefordert',
    message: `${providerName} benötigt weitere Informationen zu Ihrer Bewerbung für "${courseName}".`,
    link: `/student/dashboard/applications`
  })
}

/**
 * Create a platform update notification for all students or providers
 * 
 * @param {Object} params
 * @param {string} params.role - 'student' or 'provider'
 * @param {number[]} params.userIds - Array of user IDs (student IDs or provider IDs)
 * @param {string} params.title - Notification title
 * @param {string} params.message - Notification message
 * @param {string} [params.link] - Optional link
 */
export async function notifyPlatformUpdate({
  role,
  userIds,
  title,
  message,
  link = null
}) {
  const createFn = role === 'student' ? createStudentNotification : createProviderNotification
  const idKey = role === 'student' ? 'userId' : 'providerId'
  
  const results = await Promise.all(
    userIds.map(id => createFn({
      [idKey]: id,
      type: role === 'student' 
        ? STUDENT_NOTIFICATION_TYPES.PLATFORM_UPDATE 
        : PROVIDER_NOTIFICATION_TYPES.PLATFORM_UPDATE,
      category: NOTIFICATION_CATEGORIES.PLATFORM,
      title,
      message,
      link
    }))
  )
  
  return results
}
