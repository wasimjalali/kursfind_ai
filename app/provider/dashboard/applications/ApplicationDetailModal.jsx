'use client'

import { useState } from 'react'

export default function ApplicationDetailModal({ application, isOpen, onClose, onStatusUpdate }) {
  const [isUpdating, setIsUpdating] = useState(false)
  const [notes, setNotes] = useState(application?.provider_notes || '')
  
  if (!isOpen || !application) return null
  
  async function handleStatusChange(newStatus) {
    setIsUpdating(true)
    
    try {
      // Get auth token
      const { createClient } = await import('@/lib/supabase-browser')
      const supabase = createClient()
      const { data: { session } } = await supabase.auth.getSession()
      
      const response = await fetch(`/api/applications/${application.id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': session?.access_token ? `Bearer ${session.access_token}` : ''
        },
        body: JSON.stringify({ 
          status: newStatus,
          provider_viewed: true
        })
      })
      
      if (response.ok) {
        onStatusUpdate()
        onClose()
      } else {
        const error = await response.json()
        console.error('Update failed:', error)
        alert('Fehler beim Aktualisieren des Status')
      }
    } catch (error) {
      console.error('Error updating status:', error)
      alert('Fehler beim Aktualisieren des Status')
    }
    
    setIsUpdating(false)
  }
  
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b p-6 flex justify-between items-start rounded-t-2xl">
          <div>
            <h2 className="text-2xl lg:text-3xl font-bold text-gray-900">
              {application.first_name} {application.last_name}
            </h2>
            <div className="flex items-center gap-3 mt-2">
              <StatusBadge status={application.status} />
              <span className="text-sm lg:text-base text-gray-500">
                Eingereicht am {new Date(application.applied_at).toLocaleDateString('de-DE', {
                  day: '2-digit',
                  month: 'long',
                  year: 'numeric'
                })}
              </span>
            </div>
            <p className="text-sm lg:text-base text-cyan-600 mt-1">{application.course_title}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Contact Information */}
        <div className="p-6 border-b">
          <h3 className="text-lg lg:text-xl font-semibold text-gray-900 mb-4">Kontaktinformationen</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <a 
                href={`mailto:${application.email}`}
                className="text-base lg:text-lg text-cyan-600 hover:text-cyan-700"
              >
                {application.email}
              </a>
              <button 
                onClick={() => navigator.clipboard.writeText(application.email)}
                className="ml-auto text-sm lg:text-base text-gray-500 hover:text-gray-700"
              >
                Kopieren
              </button>
            </div>
            
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <a 
                href={`tel:${application.phone}`}
                className="text-base lg:text-lg text-cyan-600 hover:text-cyan-700"
              >
                {application.phone}
              </a>
              <button 
                onClick={() => navigator.clipboard.writeText(application.phone)}
                className="ml-auto text-sm lg:text-base text-gray-500 hover:text-gray-700"
              >
                Kopieren
              </button>
            </div>
          </div>
          
          <div className="mt-4 grid grid-cols-2 gap-4 text-sm lg:text-base">
            <div>
              <span className="text-gray-600">Förderung:</span>
              <p className="font-medium text-gray-900">{application.funding_type}</p>
            </div>
            {application.preferred_start_date && (
              <div>
                <span className="text-gray-600">Gewünschter Start:</span>
                <p className="font-medium text-gray-900">
                  {new Date(application.preferred_start_date).toLocaleDateString('de-DE')}
                </p>
              </div>
            )}
            {application.has_funding_approved !== null && (
              <div>
                <span className="text-gray-600">Förderung genehmigt:</span>
                <p className="font-medium text-gray-900">
                  {application.has_funding_approved ? '✅ Ja' : '❌ Nein'}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Message */}
        {application.message && (
          <div className="p-6 border-b">
            <h3 className="text-lg lg:text-xl font-semibold text-gray-900 mb-3">Nachricht vom Bewerber</h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-base lg:text-lg text-gray-700 whitespace-pre-wrap">{application.message}</p>
            </div>
          </div>
        )}

        {/* Status Management */}
        <div className="p-6 border-b">
          <h3 className="text-lg lg:text-xl font-semibold text-gray-900 mb-4">Status ändern</h3>
          <div className="flex flex-wrap gap-3">
            {application.status === 'new' && (
              <button
                onClick={() => handleStatusChange('contacted')}
                disabled={isUpdating}
                className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm lg:text-base"
              >
                {isUpdating ? 'Wird aktualisiert...' : 'Als kontaktiert markieren'}
              </button>
            )}
            
            {(application.status === 'contacted' || application.status === 'new') && (
            <button
              onClick={() => handleStatusChange('converted')}
              disabled={isUpdating}
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm lg:text-base"
            >
              {isUpdating ? 'Wird aktualisiert...' : 'Als angenommen markieren'}
            </button>
            )}
            
            <button
              onClick={() => handleStatusChange('rejected')}
              disabled={isUpdating}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm lg:text-base"
            >
              {isUpdating ? 'Wird aktualisiert...' : 'Als abgelehnt markieren'}
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-6 flex gap-3">
          <a
            href={`mailto:${application.email}?subject=Ihre Bewerbung für ${encodeURIComponent(application.course_title)}`}
            className="flex-1 px-4 py-3 bg-gradient-to-r from-cyan-500 to-emerald-500 text-white rounded-lg hover:shadow-lg transition-shadow text-center font-medium text-base lg:text-lg"
          >
            <svg className="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            E-Mail senden
          </a>
          
          <a
            href={`tel:${application.phone}`}
            className="flex-1 px-4 py-3 border-2 border-cyan-500 text-cyan-600 rounded-lg hover:bg-cyan-50 transition-colors text-center font-medium text-base lg:text-lg"
          >
            <svg className="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            Anrufen
          </a>
        </div>
      </div>
    </div>
  )
}

// Status Badge Component
function StatusBadge({ status }) {
  const styles = {
    new: 'bg-blue-100 text-blue-700',
    contacted: 'bg-yellow-100 text-yellow-700',
    converted: 'bg-green-100 text-green-700',
    rejected: 'bg-red-100 text-red-700'
  }
  
  const labels = {
    new: 'Neu',
    contacted: 'Kontaktiert',
    converted: 'Konvertiert',
    rejected: 'Abgelehnt'
  }
  
  return (
    <span className={`px-3 py-1 rounded-full text-sm lg:text-base font-medium ${styles[status] || styles.new}`}>
      {labels[status] || status}
    </span>
  )
}
