'use client'
import { useState } from 'react'

export default function ApplicationForm({ courseId, courseName, providerId, providerName, labels }) {
  // Default labels for backward compatibility
  const defaultLabels = {
    firstName: 'Vorname',
    lastName: 'Nachname',
    email: 'E-Mail',
    phone: 'Telefon',
    fundingType: 'Förderungsart',
    placeholderSelect: 'Bitte wählen',
    submit: 'Bewerbung absenden',
  };
  const ui = labels || defaultLabels;
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    fundingType: '',
    registrationStatus: '',
    preferredStartDate: '',
    message: '',
    gdprConsent: false,
    marketingConsent: false
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState(null) // 'success' | 'error' | null
  const [errorMessage, setErrorMessage] = useState('')

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const isFormValid = () => {
    return (
      formData.firstName.trim() !== '' &&
      formData.lastName.trim() !== '' &&
      formData.email.trim() !== '' &&
      formData.phone.trim() !== '' &&
      formData.fundingType !== '' &&
      formData.registrationStatus !== '' &&
      formData.gdprConsent
    )
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!isFormValid()) {
      setSubmitStatus('error')
      return
    }

    setIsSubmitting(true)
    setSubmitStatus(null)
    setErrorMessage('')

    try {
      // Validate providerId
      if (!providerId) {
        throw new Error('Provider ID fehlt. Bitte laden Sie die Seite neu.')
      }

      // Get auth token from client
      const supabase = (await import('@/lib/supabase-browser')).createClient()
      const { data: { session } } = await supabase.auth.getSession()
      
      const requestBody = {
        ...formData,
        courseId,
        courseName,
        providerId,
        providerName,
        submittedAt: new Date().toISOString()
      }
      
      console.log('Submitting application:', requestBody)
      
      const response = await fetch('/api/applications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': session?.access_token ? `Bearer ${session.access_token}` : ''
        },
        body: JSON.stringify(requestBody)
      })

      const result = await response.json()
      console.log('Application response:', result)

      if (!response.ok) {
        console.error('Application error:', result)
        throw new Error(result.error || result.details || 'Submission failed')
      }

      setSubmitStatus('success')
      // Clear form after successful submission
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        fundingType: '',
        registrationStatus: '',
        preferredStartDate: '',
        message: '',
        gdprConsent: false,
        marketingConsent: false
      })

      // Clear success message after 5 seconds
      setTimeout(() => {
        setSubmitStatus(null)
      }, 5000)

    } catch (error) {
      console.error('Application submission error:', error)
      setSubmitStatus('error')
      setErrorMessage(error.message || 'Ein unbekannter Fehler ist aufgetreten.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-2">
        Jetzt bewerben
      </h2>
      <p className="text-sm text-gray-600 mb-6">
        für {courseName}
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* First Name */}
        <div>
          <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
            {ui.firstName} <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 outline-none transition-colors text-gray-900 placeholder:text-gray-400"
            placeholder="Max"
          />
        </div>

        {/* Last Name */}
        <div>
          <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
            {ui.lastName} <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 outline-none transition-colors text-gray-900 placeholder:text-gray-400"
            placeholder="Mustermann"
          />
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            {ui.email} <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 outline-none transition-colors text-gray-900 placeholder:text-gray-400"
            placeholder="max@beispiel.de"
          />
        </div>

        {/* Phone */}
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
            {ui.phone} <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 outline-none transition-colors text-gray-900 placeholder:text-gray-400"
            placeholder="+49 123 456789"
          />
        </div>

        {/* Funding Type */}
        <div>
          <label htmlFor="fundingType" className="block text-sm font-medium text-gray-700 mb-1">
            {ui.fundingType} <span className="text-red-500">*</span>
          </label>
          <select
            id="fundingType"
            name="fundingType"
            value={formData.fundingType}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 outline-none transition-colors text-gray-900"
          >
            <option value="">{ui.placeholderSelect}</option>
            <option value="Bildungsgutschein">Bildungsgutschein</option>
            <option value="AVGS">AVGS</option>
            <option value="Selbstzahler">Selbstzahler</option>
            <option value="Arbeitgeber">Arbeitgeber</option>
            <option value="Sonstiges">Sonstiges</option>
          </select>
        </div>

        {/* Registration Status */}
        <div>
          <label htmlFor="registrationStatus" className="block text-sm font-medium text-gray-700 mb-1">
            Sind Sie aktuell registriert bei <span className="text-red-500">*</span>
          </label>
          <select
            id="registrationStatus"
            name="registrationStatus"
            value={formData.registrationStatus}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 outline-none transition-colors text-gray-900"
          >
            <option value="">{ui.placeholderSelect}</option>
            <option value="JobCenter">JobCenter</option>
            <option value="Agentur für Arbeit">Agentur für Arbeit</option>
            <option value="Nicht registriert">Nicht registriert</option>
          </select>
        </div>

        {/* Preferred Start Date */}
        <div>
          <label htmlFor="preferredStartDate" className="block text-sm font-medium text-gray-700 mb-1">
            Gewünschter Starttermin
          </label>
          <input
            type="date"
            id="preferredStartDate"
            name="preferredStartDate"
            value={formData.preferredStartDate}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 outline-none transition-colors text-gray-900"
          />
        </div>

        {/* Message */}
        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
            Nachricht / Anmerkungen
          </label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            rows="4"
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 outline-none transition-colors resize-none text-gray-900 placeholder:text-gray-400"
            placeholder="Haben Sie Fragen zum Kurs?"
          />
        </div>

        {/* GDPR Consent */}
        <div className="flex items-start gap-3">
          <input
            type="checkbox"
            id="gdprConsent"
            name="gdprConsent"
            checked={formData.gdprConsent}
            onChange={handleChange}
            required
            className="mt-1 w-4 h-4 text-cyan-600 border-gray-300 rounded focus:ring-cyan-500 focus:ring-2"
          />
          <label htmlFor="gdprConsent" className="text-sm text-gray-700">
            Ich stimme der <a href="/privacy-policy" target="_blank" className="text-cyan-600 hover:underline">Datenschutzerklärung</a> zu <span className="text-red-500">*</span>
          </label>
        </div>

        {/* Marketing Consent */}
        <div className="flex items-start gap-3">
          <input
            type="checkbox"
            id="marketingConsent"
            name="marketingConsent"
            checked={formData.marketingConsent}
            onChange={handleChange}
            className="mt-1 w-4 h-4 text-cyan-600 border-gray-300 rounded focus:ring-cyan-500 focus:ring-2"
          />
          <label htmlFor="marketingConsent" className="text-sm text-gray-700">
            Ich möchte per E-Mail über neue Kurse informiert werden
          </label>
        </div>

        {/* Status Messages */}
        {submitStatus === 'success' && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-600 px-4 py-3 rounded-lg">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="font-medium">Vielen Dank! Wir melden uns innerhalb von 24 Stunden bei Ihnen.</span>
            </div>
          </div>
        )}

        {submitStatus === 'error' && (
          <div className={`px-4 py-3 rounded-lg ${errorMessage?.includes('bereits') ? 'bg-amber-50 border border-amber-200 text-amber-800' : 'bg-red-50 border border-red-200 text-red-600'}`}>
            <div className="flex items-start gap-3">
              <svg className="w-6 h-6 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                {errorMessage?.includes('bereits') ? (
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                ) : (
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                )}
              </svg>
              <p className="text-sm leading-relaxed">{errorMessage || 'Fehler beim Absenden. Bitte versuchen Sie es erneut.'}</p>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={!isFormValid() || isSubmitting}
          className="w-full bg-gradient-to-r from-cyan-500 to-emerald-500 text-white font-bold py-3 px-6 rounded-lg hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <>
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Wird gesendet...</span>
            </>
          ) : (
            <span>{ui.submit}</span>
          )}
        </button>

        <p className="text-xs text-gray-500 text-center mt-2">
          <span className="text-red-500">*</span> Pflichtfelder
        </p>
      </form>
    </div>
  )
}
