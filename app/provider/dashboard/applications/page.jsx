/**
 * SECURITY: Uses Supabase Auth to authenticate and identify providers
 * Only authenticated providers can access their own applications
 * Provider is identified by providers.id (linked via auth_user_id)
 * 
 * Flow:
 * 1. Get authenticated user from Supabase Auth
 * 2. Query providers table using auth_user_id
 * 3. Filter applications by provider.id
 * 4. Redirect to login if not authenticated
 */

'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase-browser'
import { useRouter } from 'next/navigation'
import ApplicationDetailModal from './ApplicationDetailModal'

function getStatusColor(status) {
  switch(status) {
    case 'new': return 'bg-blue-500'
    case 'contacted': return 'bg-yellow-500'
    case 'converted': return 'bg-green-500'
    case 'rejected': return 'bg-red-500'
    default: return 'bg-gray-500'
  }
}

function getStatusLabel(status) {
  switch(status) {
    case 'new': return 'Neu'
    case 'contacted': return 'Kontaktiert'
    case 'converted': return 'Angenommen'
    case 'rejected': return 'Abgelehnt'
    default: return status
  }
}

function formatDate(dateString) {
  if (!dateString) return '-'
  const date = new Date(dateString)
  return date.toLocaleDateString('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}

function calculateStats(applications) {
  const total = applications.length
  const newApps = applications.filter(app => !app.provider_viewed).length
  
  // This month
  const now = new Date()
  const thisMonth = applications.filter(app => {
    const appDate = new Date(app.applied_at)
    return appDate.getMonth() === now.getMonth() && 
           appDate.getFullYear() === now.getFullYear()
  }).length
  
  // Conversion rate
  const converted = applications.filter(app => app.status === 'converted').length
  const conversionRate = total > 0 ? ((converted / total) * 100).toFixed(1) : 0
  
  return { total, newApps, thisMonth, conversionRate }
}

export default function ApplicationsPage() {
  const router = useRouter()
  const [applications, setApplications] = useState([])
  const [selectedApplication, setSelectedApplication] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadApplications() {
      setIsLoading(true)
      
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      )
      
      // Get authenticated user
      const { data: { user }, error: authError } = await supabase.auth.getUser()
      
      // Redirect to login if not authenticated
      if (!user || authError) {
        router.push('/provider/login')
        return
      }
      
      // Get provider profile
      const { data: provider, error: providerError } = await supabase
        .from('providers')
        .select('id')
        .eq('auth_user_id', user.id)
        .single()
      
      console.log('Provider data:', provider)
      
      if (!provider || providerError) {
        console.error('Provider error:', providerError)
        router.push('/provider/login')
        return
      }
      
      const providerId = provider.id
      console.log('Fetching applications for provider_id:', providerId)
      
      // Fetch applications for this provider
      const { data, error } = await supabase
        .from('applications')
        .select('*')
        .eq('provider_id', providerId)
        .order('applied_at', { ascending: false })
      
      console.log('Applications data:', data)
      console.log('Applications error:', error)
      
      if (!error && data) {
        // Get course titles for all applications
        const courseIds = [...new Set(data.map(app => app.course_id).filter(Boolean))]
        const { data: coursesData } = await supabase
          .from('courses')
          .select('id, title')
          .in('id', courseIds)
        
        const coursesMap = {}
        coursesData?.forEach(course => {
          coursesMap[course.id] = course.title
        })
        
        // Map to match expected field names
        const mappedData = data.map(app => ({
          id: app.id,
          first_name: app.first_name,
          last_name: app.last_name,
          email: app.email,
          phone: app.phone,
          course_title: coursesMap[app.course_id] || 'Unbekannter Kurs',
          course_id: app.course_id,
          provider_id: app.provider_id,
          funding_type: app.funding_type,
          status: app.status || 'new',
          provider_viewed: app.provider_viewed || false,
          applied_at: app.applied_at,
          registration_status: app.registration_status,
          message: app.message,
          preferred_start_date: app.preferred_start_date,
          has_funding_approved: app.has_funding_approved,
          provider_notes: app.provider_notes,
          provider_viewed_at: app.provider_viewed_at,
          last_contacted_at: app.last_contacted_at
        }))
        setApplications(mappedData)
      }
      
      setIsLoading(false)
    }
    
    loadApplications()
  }, [])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600 mb-4"></div>
          <p className="text-gray-600">Laden...</p>
        </div>
      </div>
    )
  }

  const stats = calculateStats(applications)

  return (
    <div className="space-y-6 -mt-3 sm:-mt-4">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
          Bewerbungen
        </h1>
        <p className="text-base lg:text-lg text-gray-600">
          Verwalten Sie Ihre Kursbewerbungen
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Total Applications */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-cyan-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
          </div>
          <div className="text-3xl lg:text-4xl font-bold text-gray-900 mb-1">
            {stats.total}
          </div>
          <div className="text-sm lg:text-base text-gray-600">
            Gesamt Bewerbungen
          </div>
        </div>

        {/* New Applications */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </div>
          </div>
          <div className="text-3xl lg:text-4xl font-bold text-gray-900 mb-1">
            {stats.newApps}
          </div>
          <div className="text-sm lg:text-base text-gray-600">
            Neue Bewerbungen
          </div>
        </div>

        {/* This Month */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
          <div className="text-3xl lg:text-4xl font-bold text-gray-900 mb-1">
            {stats.thisMonth}
          </div>
          <div className="text-sm lg:text-base text-gray-600">
            Diesen Monat
          </div>
        </div>

        {/* Conversion Rate */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <div className="text-3xl lg:text-4xl font-bold text-gray-900 mb-1">
            {stats.conversionRate}%
          </div>
          <div className="text-sm lg:text-base text-gray-600">
            Conversion Rate
          </div>
        </div>
      </div>

      {/* Applications Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {applications.length === 0 ? (
          // Empty State
          <div className="text-center py-16 px-4">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
            </div>
            <h3 className="text-xl lg:text-2xl font-semibold text-gray-900 mb-2">
              Noch keine Bewerbungen
            </h3>
            <p className="text-base lg:text-lg text-gray-600 max-w-md mx-auto">
              Bewerbungen werden hier angezeigt, sobald Studenten sich bewerben.
            </p>
          </div>
        ) : (
          // Table
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs lg:text-sm font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs lg:text-sm font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs lg:text-sm font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs lg:text-sm font-medium text-gray-500 uppercase tracking-wider">
                    Telefon
                  </th>
                  <th className="px-6 py-3 text-left text-xs lg:text-sm font-medium text-gray-500 uppercase tracking-wider">
                    Kurs
                  </th>
                  <th className="px-6 py-3 text-left text-xs lg:text-sm font-medium text-gray-500 uppercase tracking-wider">
                    Förderung
                  </th>
                  <th className="px-6 py-3 text-left text-xs lg:text-sm font-medium text-gray-500 uppercase tracking-wider">
                    Datum
                  </th>
                  <th className="px-6 py-3 text-left text-xs lg:text-sm font-medium text-gray-500 uppercase tracking-wider">
                    Aktionen
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {applications.map((app) => (
                  <tr key={app.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span className={`w-3 h-3 rounded-full ${getStatusColor(app.status)}`}></span>
                        <span className="text-sm lg:text-base font-medium text-gray-900">
                          {getStatusLabel(app.status)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div>
                          <div className="text-sm lg:text-base font-medium text-gray-900">
                            {app.first_name} {app.last_name}
                          </div>
                          {!app.provider_viewed && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs lg:text-sm font-medium bg-blue-100 text-blue-800">
                              Neu
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm lg:text-base text-gray-900">{app.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm lg:text-base text-gray-900">{app.phone}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm lg:text-base text-gray-900 max-w-xs truncate">
                        {app.course_title}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs lg:text-sm font-medium bg-cyan-100 text-cyan-800">
                        {app.funding_type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm lg:text-base text-gray-900">
                        {formatDate(app.applied_at)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm lg:text-base">
                      <button
                        onClick={() => {
                          setSelectedApplication(app)
                          setIsModalOpen(true)
                        }}
                        className="text-cyan-600 hover:text-cyan-700 font-medium transition-colors"
                      >
                        Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Application Detail Modal */}
      <ApplicationDetailModal
        application={selectedApplication}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setSelectedApplication(null)
        }}
        onStatusUpdate={() => {
          // Reload applications after status change
          setIsModalOpen(false)
          setSelectedApplication(null)
          // Re-fetch data
          window.location.reload()
        }}
      />
    </div>
  )
}
