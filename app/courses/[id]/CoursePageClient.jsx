'use client'
import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import SaveButton from '@/components/student/SaveButton'
import ApplicationForm from './ApplicationForm'

export default function CoursePageClient({ course, provider, providerFaqs }) {
  // Smart Component Localization - detect course language and set UI labels
  const isEnglish = (course?.language || '').toLowerCase().includes('english') || 
                    (course?.language || '').toLowerCase().includes('englisch');
  
  const ui = {
    // Hero section
    apply: isEnglish ? 'Apply Now' : 'Jetzt bewerben',
    download: isEnglish ? 'Download brochure' : 'Infomaterial herunterladen',
    startLabel: isEnglish ? 'Next Start' : 'Nächster Start',
    contactForInfo: isEnglish ? 'Please contact us for information materials' : 'Bitte kontaktieren Sie uns für Infomaterial',
    
    // Breadcrumbs
    home: isEnglish ? 'Home' : 'Home',
    allCourses: isEnglish ? 'All Courses' : 'Alle Kurse',
    
    // Sidebar
    sidebar: {
      title: isEnglish ? 'Course Details' : 'Kursdetails',
      subtitle: isEnglish ? 'All important information at a glance' : 'Alle wichtigen Informationen auf einen Blick',
      price: isEnglish ? 'Price' : 'Preis',
      language: isEnglish ? 'Language' : 'Sprache',
      format: isEnglish ? 'Format' : 'Format',
      duration: isEnglish ? 'Duration' : 'Dauer',
      hours: isEnglish ? 'Hours' : 'Stunden',
      location: isEnglish ? 'Location' : 'Ort',
      startDate: isEnglish ? 'Start Date' : 'Startdatum',
    },
    
    // Content sections
    sections: {
      about: isEnglish ? 'About this course' : 'Über diesen Kurs',
      benefits: isEnglish ? 'Additional Services & Benefits' : 'Zusätzliche Leistungen & Benefits',
      outcomes: isEnglish ? 'What you will learn' : 'Was Sie lernen werden',
      requirements: isEnglish ? 'Requirements' : 'Voraussetzungen',
      certificate: isEnglish ? 'Recognized Certificate' : 'Anerkanntes Zertifikat',
      funding: isEnglish ? 'Funding Options' : 'Finanzierungsmöglichkeiten',
      provider: isEnglish ? 'About the Provider' : 'Über den Anbieter',
      contact: isEnglish ? 'Contact the Provider' : 'Kontakt zum Anbieter',
      curriculum: isEnglish ? 'Course Curriculum' : 'Kursinhalte',
      faqs: isEnglish ? 'Frequently Asked Questions' : 'Häufig gestellte Fragen',
      visitWebsite: isEnglish ? 'Visit website' : 'Website besuchen',
      followUs: isEnglish ? 'Follow us' : 'Folgen Sie uns',
      viewReviews: isEnglish ? 'View reviews' : 'Bewertungen ansehen',
      contactPerson: isEnglish ? 'Contact Person' : 'Ansprechpartner',
    },
    
    // Application form
    form: {
      title: isEnglish ? 'Apply Now' : 'Jetzt bewerben',
      forCourse: isEnglish ? 'for' : 'für',
      firstName: isEnglish ? 'First Name' : 'Vorname',
      lastName: isEnglish ? 'Last Name' : 'Nachname',
      email: isEnglish ? 'Email' : 'E-Mail',
      phone: isEnglish ? 'Phone' : 'Telefon',
      fundingType: isEnglish ? 'Funding Type' : 'Förderungsart',
      registrationStatus: isEnglish ? 'Are you currently registered with' : 'Sind Sie aktuell registriert bei',
      preferredStartDate: isEnglish ? 'Preferred Start Date' : 'Gewünschter Starttermin',
      message: isEnglish ? 'Message / Comments' : 'Nachricht / Anmerkungen',
      messagePlaceholder: isEnglish ? 'Do you have any questions about the course?' : 'Haben Sie Fragen zum Kurs?',
      gdprConsent: isEnglish ? 'I agree to the' : 'Ich stimme der',
      privacyPolicy: isEnglish ? 'Privacy Policy' : 'Datenschutzerklärung',
      gdprConsentEnd: isEnglish ? '' : 'zu',
      marketingConsent: isEnglish ? 'I would like to receive email updates about new courses' : 'Ich möchte per E-Mail über neue Kurse informiert werden',
      placeholderSelect: isEnglish ? 'Please select' : 'Bitte wählen',
      submit: isEnglish ? 'Submit Application' : 'Bewerbung absenden',
      close: isEnglish ? 'Close' : 'Schließen',
      requiredFields: isEnglish ? 'Required fields' : 'Pflichtfelder',
      // Funding type options
      fundingBildungsgutschein: isEnglish ? 'Education Voucher' : 'Bildungsgutschein',
      fundingAVGS: 'AVGS',
      fundingSelfPayer: isEnglish ? 'Self-Payer' : 'Selbstzahler',
      fundingEmployer: isEnglish ? 'Employer' : 'Arbeitgeber',
      fundingOther: isEnglish ? 'Other' : 'Sonstiges',
      // Registration status options
      regJobCenter: 'JobCenter',
      regAgency: isEnglish ? 'Employment Agency' : 'Agentur für Arbeit',
      regNotRegistered: isEnglish ? 'Not registered' : 'Nicht registriert',
      // Loading and error messages
      submitting: isEnglish ? 'Submitting...' : 'Wird gesendet...',
      successMessage: isEnglish ? 'Thank you! We will contact you within 24 hours.' : 'Vielen Dank! Wir melden uns innerhalb von 24 Stunden bei Ihnen.',
      errorMessage: isEnglish ? 'Error submitting. Please try again.' : 'Fehler beim Absenden. Bitte versuchen Sie es erneut.',
    },
  };

  // Debug: Log the data received
  useEffect(() => {
    console.log('=== CoursePageClient Debug ===')
    console.log('Course:', course)
    console.log('Provider:', provider)
    console.log('Provider FAQs:', providerFaqs)
    console.log('---')
    console.log('Benefits:', course?.benefits)
    console.log('Curriculum:', course?.curriculum)
    console.log('Provider Name:', provider?.company_name || provider?.name)
    console.log('Provider Logo URL:', provider?.logo_url)
    console.log('==============================')
    
    if (course?.benefits) {
      console.log('Benefits type:', typeof course.benefits)
      console.log('Benefits value:', course.benefits)
      const benefitsArray = typeof course.benefits === 'string' 
        ? course.benefits.split(',').map(b => b.trim()).filter(Boolean)
        : Array.isArray(course.benefits) 
          ? course.benefits 
          : [];
      console.log('Parsed benefits array:', benefitsArray)
      console.log('Benefits array length:', benefitsArray.length)
    }
    
    if (course?.curriculum) {
      console.log('Curriculum type:', typeof course.curriculum)
      console.log('Curriculum modules:', course.curriculum?.modules)
    }
  }, [course, provider, providerFaqs])

  // Track course view on page load
  useEffect(() => {
    if (course?.id) {
      fetch('/api/courses/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ courseId: course.id, action: 'view' })
      })
      .then(res => res.json())
      .then(data => console.log('View tracked:', data))
      .catch(err => console.error('Failed to track view:', err))
    }
  }, [course?.id])

  const [expandedModule, setExpandedModule] = useState(null)
  const [showApplicationModal, setShowApplicationModal] = useState(false)

  // Track application click
  const handleApplicationClick = () => {
    // Track click
    if (course?.id) {
      fetch('/api/courses/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ courseId: course.id, action: 'click' })
      })
      .then(res => res.json())
      .then(data => console.log('Click tracked:', data))
      .catch(err => console.error('Failed to track click:', err))
    }
    // Show application modal
    setShowApplicationModal(true)
  }
  
  // Chat state
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [chatMessages, setChatMessages] = useState([])
  const [chatInput, setChatInput] = useState('')
  const [isChatLoading, setIsChatLoading] = useState(false)
  
  // Chat scroll ref
  const chatMessagesEndRef = useRef(null)
  
  const scrollChatToBottom = () => {
    chatMessagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }
  
  useEffect(() => {
    scrollChatToBottom()
  }, [chatMessages, isChatLoading])

  // Helper function to get course context
  const getCourseContext = () => ({
            title: course.title,
            provider: provider?.company_name || provider?.name || course.provider,
            location: course.location,
            duration: course.duration,
            funding_type: course.funding_type,
            description: course.description,
            price: course.price || 'Auf Anfrage',
            start_date: course.start_date || 'Flexibler Start',
            format: course.format || 'Vollzeit',
            certificate: course.certificate || 'Zertifikat wird vergeben',
            prerequisites: course.prerequisites || 'Keine besonderen Voraussetzungen',
            target_audience: course.target_audience || 'Offen für alle',
            website: provider?.website || course.website || '',
            contact_email: provider?.email || course.contact_email || '',
    contact_phone: provider?.phone || course.contact_phone || '',
    benefits: course.benefits || '',
    learning_objectives: course.learning_objectives || [],
    career_paths: course.career_paths || {}
  })

  // Helper function to send message with full context
  const sendMessageWithContext = async (userMessage, currentMessages) => {
    const updatedMessages = [...currentMessages, {
      role: 'user',
      content: userMessage
    }]
    setChatMessages(updatedMessages)
    setIsChatLoading(true)
    
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: updatedMessages, // Full conversation history
          courseContext: getCourseContext()
        })
      })
      
      const data = await response.json()
      
      setChatMessages(prev => [...prev, {
        role: 'assistant',
        content: data.message || data.response || 'Keine Antwort erhalten.'
      }])
    } catch (error) {
      console.error('Chat error:', error)
      setChatMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Entschuldigung, es gab einen Fehler. Bitte versuchen Sie es erneut.'
      }])
    } finally {
      setIsChatLoading(false)
    }
  }

  const handleChatSend = async () => {
    if (!chatInput.trim()) return
    
    const userMessage = chatInput
    setChatInput('')
    await sendMessageWithContext(userMessage, chatMessages)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <nav className="flex items-center gap-2 text-sm text-gray-600 overflow-x-auto whitespace-nowrap">
            <Link href="/" className="hover:text-cyan-600 transition-colors flex-shrink-0">
              {ui.home}
            </Link>
            <span>›</span>
            <Link href="/courses" className="hover:text-cyan-600 transition-colors flex-shrink-0">
              {ui.allCourses}
            </Link>
            <span>›</span>
            <span className="text-gray-900 font-medium truncate max-w-md">{course.title}</span>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-cyan-500 via-cyan-600 to-emerald-500 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="max-w-7xl mx-auto px-6 py-16 relative z-10">
          {/* Start Date - Subtle white outline pill */}
          {course.start_date && (
            <div className="flex items-center gap-2 mb-4">
              <span className="border border-white/50 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {ui.startLabel}: {course.start_date}
              </span>
            </div>
          )}
          
          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight max-w-4xl">
            {course.title}
          </h1>
          
          {course.subtitle && (
            <p className="text-xl text-white/90 mb-6 max-w-3xl leading-relaxed">
              {course.subtitle}
            </p>
          )}
          
          {/* Duration, Format, Location, Language, and Badges */}
          <div className="flex flex-wrap gap-3 mb-8">
            {/* Duration Badge - Show both duration and duration_hours if available */}
            {(course.duration || course.duration_hours) && (
              <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="font-medium">
                  {course.duration && course.duration_hours 
                    ? `${course.duration} | ${course.duration_hours}`
                    : course.duration || course.duration_hours}
                </span>
              </div>
            )}
            {/* Format Badge */}
            {course.format && (
              <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg flex items-center gap-2">
                {course.format === 'Online' && '💻'}
                {course.format === 'Präsenz' && '🏢'}
                {course.format === 'Hybrid' && '🔄'}
                <span className="font-medium">{course.format}</span>
              </div>
            )}
            {/* Language Badge */}
            {course.language && (() => {
              const getLanguageIcon = (lang) => {
                const langLower = (lang || '').toLowerCase();
                if (langLower.includes('deutsch') || langLower.includes('german')) return '🇩🇪';
                if (langLower.includes('english') || langLower.includes('englisch')) return '🇬🇧';
                if (langLower.includes('französisch') || langLower.includes('french')) return '🇫🇷';
                if (langLower.includes('spanisch') || langLower.includes('spanish')) return '🇪🇸';
                return '🌐';
              };
              return (
                <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg flex items-center gap-2">
                  <span>{getLanguageIcon(course.language)}</span>
                  <span className="font-medium">{course.language}</span>
                </div>
              );
            })()}
            {/* Location Badge - Only for Präsenz/Hybrid */}
            {course.location && (course.format === 'Präsenz' || course.format === 'Hybrid') && (
              <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="font-medium">{course.location}</span>
              </div>
            )}
            {/* Badges (Bestseller, Neu, etc.) */}
            {(() => {
              // Handle badges as array or string
              let badgesArray = [];
              if (course.badges) {
                if (Array.isArray(course.badges)) {
                  badgesArray = course.badges;
                } else if (typeof course.badges === 'string') {
                  badgesArray = course.badges.split(',').map(b => b.trim()).filter(Boolean);
                }
              }
              return badgesArray.length > 0 ? badgesArray.map((badge, idx) => (
                <div key={idx} className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg flex items-center gap-2">
                  {badge === 'Bestseller' && '⭐'}
                  {badge === 'Neu' && '🆕'}
                  <span className="font-medium">{badge}</span>
                </div>
              )) : null;
            })()}
          </div>

          <div className="flex flex-wrap gap-4 items-center">
            <button 
              onClick={handleApplicationClick}
              className="bg-white text-cyan-600 px-8 py-4 rounded-xl font-bold text-lg hover:shadow-2xl hover:scale-105 transition-all duration-200"
            >
              {ui.apply} →
            </button>
            
            {course.infomaterial_url ? (
              <a
                href={course.infomaterial_url}
                download
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-8 py-4 border-2 border-white text-white rounded-xl font-bold text-lg hover:bg-white/10 transition-all duration-200"
              >
                {ui.download}
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </a>
            ) : (
              <button
                onClick={() => alert(ui.contactForInfo)}
                className="inline-flex items-center gap-2 px-8 py-4 border-2 border-white text-white rounded-xl font-bold text-lg hover:bg-white/10 transition-all duration-200"
              >
                {ui.download}
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </button>
            )}
            
            <SaveButton courseId={course.id} size="lg" />
          </div>
        </div>
      </div>

      {/* Main Content with Sticky Sidebar */}
      <div className="lg:flex lg:gap-8 max-w-7xl mx-auto px-4 py-8">
        {/* Left Column: Main Content (2/3 width on desktop) */}
        <div className="lg:w-2/3 space-y-8">
          
          {/* Über diesen Kurs Section */}
          <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-8 py-6 border-b border-gray-200">
              <h2 className="text-3xl font-bold text-gray-900">{ui.sections.about}</h2>
            </div>
            <div className="p-8">
              <p className="text-gray-700 leading-relaxed text-lg">
                {course.description}
              </p>
            </div>
          </div>

          {/* Additional Benefits Section */}
          {course.benefits && (() => {
            // Parse benefits - handle string, array, or other formats
            let benefitsArray = [];
            
            if (typeof course.benefits === 'string' && course.benefits.trim() !== '') {
              benefitsArray = course.benefits.split(',').map(b => b.trim()).filter(Boolean);
            } else if (Array.isArray(course.benefits)) {
              benefitsArray = course.benefits.filter(Boolean);
            }
            
            console.log('🎁 Benefits check:', { 
              type: typeof course.benefits, 
              value: course.benefits,
              array: benefitsArray,
              length: benefitsArray.length 
            });
            
            return benefitsArray.length > 0;
          })() && (
            <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-cyan-50 to-emerald-50 px-8 py-6 border-b border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900">
                  {ui.sections.benefits}
                </h2>
              </div>
              <div className="p-8">
                {(() => {
                  // Parse benefits - handle string or array
                  let benefitsArray = [];
                  if (typeof course.benefits === 'string') {
                    benefitsArray = course.benefits.split(',').map(b => b.trim()).filter(Boolean);
                  } else if (Array.isArray(course.benefits)) {
                    benefitsArray = course.benefits.filter(Boolean);
                  }
                  
                  // Display all benefits in a grid
                  return (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {benefitsArray.map((benefit, index) => (
                        <div 
                          key={index}
                          className="flex items-start gap-4 p-6 bg-gradient-to-br from-cyan-50 to-emerald-50 rounded-xl border border-cyan-100 hover:border-cyan-200 transition-colors"
                        >
                          <div className="flex-shrink-0">
                            <svg className="w-8 h-8 text-cyan-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                          <div>
                            <h3 className="text-base font-semibold text-gray-900">
                              {benefit}
                            </h3>
                          </div>
                        </div>
                      ))}
                    </div>
                  );
                })()}
              </div>
            </div>
          )}
          
          {/* Learning Objectives Section */}
        {course.learning_objectives && course.learning_objectives.length > 0 && (
          <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-cyan-50 to-emerald-50 px-8 py-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                <svg className="w-8 h-8 text-cyan-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                {ui.sections.outcomes}
              </h2>
            </div>
            <div className="p-8">
            <div className="space-y-4">
              {course.learning_objectives.map((objective, index) => (
                <div key={index} className="flex items-start gap-3 p-3 rounded-lg hover:bg-cyan-50 transition-colors">
                  <svg className="w-6 h-6 text-cyan-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700 text-lg">{objective}</span>
                </div>
              ))}
            </div>
            </div>
          </div>
        )}
        
        {/* Prerequisites Section */}
        {course.prerequisites && course.prerequisites.length > 0 && (
          <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-emerald-50 to-cyan-50 px-8 py-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                <svg className="w-8 h-8 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {ui.sections.requirements}
              </h2>
            </div>
            <div className="p-8">
            <div className="space-y-4">
              {course.prerequisites.map((prereq, index) => (
                <div key={index} className="flex items-start gap-3 p-3 rounded-lg hover:bg-emerald-50 transition-colors">
                  <svg className="w-6 h-6 text-emerald-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700 font-medium text-lg">{prereq}</span>
                </div>
              ))}
            </div>
            </div>
          </div>
        )}

        {/* Curriculum Section */}
        {((course.curriculum?.modules && course.curriculum.modules.length > 0) || 
          (typeof course.curriculum === 'object' && course.curriculum !== null && Object.keys(course.curriculum).length > 0)) && (
          <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-100 p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Curriculum</h2>
            <div className="space-y-4">
              {(course.curriculum?.modules || []).map((module, index) => (
                <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
                  <button
                    onClick={() => setExpandedModule(expandedModule === index ? null : index)}
                    className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-4 text-left">
                      <div className="w-10 h-10 rounded-full bg-cyan-100 text-cyan-600 flex items-center justify-center font-bold flex-shrink-0">
                        {index + 1}
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900">{module.title}</h3>
                        {module.duration && (
                          <p className="text-sm text-gray-500">{module.duration}</p>
                        )}
                      </div>
                    </div>
                    <svg 
                      className={`w-5 h-5 text-gray-500 transition-transform ${expandedModule === index ? 'rotate-180' : ''}`}
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {expandedModule === index && module.topics && module.topics.length > 0 && (
                    <div className="px-4 pb-4 bg-gray-50">
                      <ul className="space-y-2">
                        {module.topics.map((topic, topicIndex) => (
                          <li key={topicIndex} className="flex items-start gap-2 text-gray-700">
                            <svg className="w-5 h-5 text-cyan-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <span>{topic}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Career Opportunities Section */}
        {(() => {
          // Handle career_paths as either array of strings or object with roles
          let careerPathsArray = [];
          
          if (Array.isArray(course.career_paths)) {
            // If it's already an array of strings
            careerPathsArray = course.career_paths;
          } else if (course.career_paths?.roles && Array.isArray(course.career_paths.roles)) {
            // If it's an object with roles array (objects)
            careerPathsArray = course.career_paths.roles.map(role => 
              typeof role === 'string' ? role : role.title
            );
          }
          
          console.log('Career paths parsed:', careerPathsArray);
          
          return careerPathsArray.length > 0 && (
          <div className="mt-8 bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Ihre Karrieremöglichkeiten
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {careerPathsArray.map((career, index) => (
                <div 
                  key={index}
                  className="bg-gradient-to-br from-cyan-50 to-emerald-50 rounded-lg p-6 border border-cyan-100 hover:shadow-md transition-shadow"
                >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-1">
                        <svg className="w-6 h-6 text-cyan-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-gray-900">
                          {career}
                  </h3>
                      </div>
                    </div>
                </div>
              ))}
            </div>
          </div>
          );
        })()}

        {/* Certificate Information Section */}
        {course.certificate_type && (
          <div className="mt-8 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            {/* Mobile: Icon and title side by side in header, Desktop: Side by side layout */}
            <div className="md:hidden bg-gradient-to-r from-cyan-50 to-emerald-50 px-8 py-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                <svg className="w-8 h-8 text-cyan-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
                {ui.sections.certificate}
              </h2>
            </div>
            
            {/* Mobile: Content only */}
            <div className="md:hidden p-8">
              <p className="text-lg text-cyan-600 font-semibold mb-3">
                {course.certificate_type}
              </p>
              <p className="text-gray-700 mb-4">
                Nach erfolgreichem Abschluss erhalten Sie ein anerkanntes Zertifikat, das Ihre erworbenen Qualifikationen dokumentiert und bei Arbeitgebern hohes Ansehen genießt.
              </p>
              {course.job_placement_rate && (
                <div className="flex items-center gap-2 bg-emerald-50 text-emerald-700 px-4 py-2 rounded-lg inline-flex">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="font-semibold">
                    {course.job_placement_rate}% Vermittlungsquote nach Abschluss
                  </span>
                </div>
              )}
            </div>

            {/* Desktop: Original side-by-side layout */}
            <div className="hidden md:flex md:items-start md:gap-6 md:p-8">
              <div className="flex-shrink-0">
                <div className="w-16 h-16 bg-cyan-100 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-cyan-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                </div>
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Anerkanntes Zertifikat
                </h2>
                <p className="text-lg text-cyan-600 font-semibold mb-3">
                  {course.certificate_type}
                </p>
                <p className="text-gray-700 mb-4">
                  Nach erfolgreichem Abschluss erhalten Sie ein anerkanntes Zertifikat, das Ihre erworbenen Qualifikationen dokumentiert und bei Arbeitgebern hohes Ansehen genießt.
                </p>
                {course.job_placement_rate && (
                  <div className="flex items-center gap-2 bg-emerald-50 text-emerald-700 px-4 py-2 rounded-lg inline-flex">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="font-semibold">
                      {course.job_placement_rate}% Vermittlungsquote nach Abschluss
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Funding Options Section */}
        {course.funding_types && course.funding_types.length > 0 && (
          <div className="mt-8 bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              {ui.sections.funding}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {course.funding_types.map((fundingType, index) => {
                // Define descriptions for known funding types
                const fundingInfo = {
                  'Bildungsgutschein': {
                    icon: '🎓',
                    description: '100% Förderung durch die Agentur für Arbeit oder Jobcenter. Komplett kostenlose Weiterbildung inklusive aller Materialien.'
                  },
                  'AVGS': {
                    icon: '💼',
                    description: 'Aktivierungs- und Vermittlungsgutschein für individuelle Coachings und Qualifizierungsmaßnahmen zur Eingliederung in Arbeit.'
                  },
                  'WeGebAU': {
                    icon: '📚',
                    description: 'Weiterbildung Geringqualifizierter und beschäftigter älterer Arbeitnehmer in Unternehmen. Förderung für Beschäftigte.'
                  },
                  'BAföG': {
                    icon: '🎯',
                    description: 'Bundesausbildungsförderungsgesetz - Finanzielle Unterstützung für schulische und berufliche Ausbildung.'
                  },
                  'Aufstiegs-BAföG': {
                    icon: '🚀',
                    description: 'Förderung für berufliche Aufstiegsfortbildungen. Bis zu 75% Zuschuss auf Lehrgangs- und Prüfungsgebühren.'
                  },
                  'Bildungsprämie': {
                    icon: '💰',
                    description: 'Prämiengutschein für Erwerbstätige mit geringerem Einkommen. Bis zu 500€ Zuschuss für Weiterbildungen.'
                  },
                  'Selbstzahler': {
                    icon: '💳',
                    description: 'Flexible Ratenzahlung möglich. Investieren Sie in Ihre berufliche Zukunft mit individuellen Zahlungsmöglichkeiten.'
                  }
                }

                const info = fundingInfo[fundingType] || { 
                  icon: '✓', 
                  description: 'Fördermöglichkeit verfügbar - kontaktieren Sie uns für Details.' 
                }

                return (
                  <div 
                    key={index}
                    className="bg-gradient-to-br from-cyan-50 to-emerald-50 rounded-lg p-6 border border-cyan-100 hover:shadow-md transition-shadow"
                  >
                    <div className="text-4xl mb-3">{info.icon}</div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">
                      {fundingType}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {info.description}
                    </p>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* FAQ Section - Provider Level */}
        {/* Using provider_faqs table only (cleaner, more manageable) */}
        {providerFaqs && providerFaqs.length > 0 && (
          <div className="mt-8 bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Häufig gestellte Fragen
            </h2>
            <div className="space-y-4">
              {providerFaqs.map((faq, index) => {
                const question = faq.question || 'Frage'
                const answer = faq.answer || ''
                const faqId = faq.id || index
                
                return (
                  <details 
                    key={faqId}
                    className="group border border-gray-200 rounded-lg overflow-hidden"
                  >
                    <summary className="flex justify-between items-center cursor-pointer p-4 hover:bg-gray-50 transition-colors">
                      <span className="font-medium text-gray-900">{question}</span>
                      <svg 
                        className="w-5 h-5 text-gray-500 group-open:rotate-180 transition-transform" 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </summary>
                    <div className="p-4 pt-0 text-gray-600">
                      {answer}
                    </div>
                  </details>
                )
              })}
            </div>
          </div>
        )}

        {/* Provider Info & Trust Section */}
        <div className="mt-8 bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            {ui.sections.provider}
          </h2>
          
          {/* Mobile: Title first, then logo on left. Desktop: Logo on left with content */}
          <div className="flex flex-col md:flex-row md:items-start gap-4 mb-6">
            {/* Company name - shows first on mobile, hidden on desktop */}
            <h3 className="text-xl font-bold text-gray-900 md:hidden">
              {provider?.company_name || provider?.name || course.provider}
            </h3>
            
            {/* Logo - Left aligned on mobile (after title), left on desktop */}
            {provider?.logo_url && provider.logo_url.trim() !== '' ? (
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-lg border border-gray-200 bg-white p-2 self-start flex-shrink-0 flex items-center justify-center overflow-hidden">
              <img 
                src={provider.logo_url} 
                alt={provider?.company_name || provider?.name || course.provider || 'Provider Logo'}
                  className="max-w-full max-h-full object-contain"
                  onError={(e) => {
                    console.error('Logo failed to load:', provider.logo_url);
                    e.target.style.display = 'none';
                    e.target.parentElement.innerHTML = `<div class="text-gray-400 text-center text-xs">Logo nicht verfügbar</div>`;
                  }}
                />
              </div>
            ) : (
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-lg border border-gray-200 bg-gradient-to-br from-cyan-100 to-emerald-100 p-2 self-start flex-shrink-0 flex items-center justify-center">
                <span className="text-2xl md:text-3xl font-bold text-gray-600">
                  {(provider?.company_name || provider?.name || course.provider || 'P')[0]}
                </span>
              </div>
            )}
            
            {/* Content */}
            <div className="flex-1">
              {/* Company name - hidden on mobile, shows on desktop */}
              <h3 className="hidden md:block text-xl font-bold text-gray-900 mb-2">
                {provider?.company_name || provider?.name || course.provider}
              </h3>
              
              {/* Certification Badge - Show below company name if exists */}
              {/* Check for both certifications array and Certification field */}
              {((provider?.certifications && Array.isArray(provider.certifications) && provider.certifications.length > 0) || provider?.Certification) && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {/* Display certifications array if exists */}
                  {provider?.certifications && Array.isArray(provider.certifications) && provider.certifications.length > 0 && (
                    provider.certifications.map((cert, index) => (
                      <span 
                        key={index}
                        className="inline-flex items-center px-3 py-1 bg-gradient-to-r from-cyan-50 to-emerald-50 border border-cyan-200 text-cyan-700 rounded-full text-xs font-semibold"
                      >
                        <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        {typeof cert === 'string' ? cert : cert.name || cert.title || 'Zertifiziert'}
                      </span>
                    ))
                  )}
                  {/* Display Certification field if exists (fallback) */}
                  {provider?.Certification && (!provider?.certifications || provider.certifications.length === 0) && (
                    <span 
                      className="inline-flex items-center px-3 py-1 bg-gradient-to-r from-cyan-50 to-emerald-50 border border-cyan-200 text-cyan-700 rounded-full text-xs font-semibold"
                    >
                      <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      {provider.Certification}-zertifiziert
                    </span>
                  )}
                </div>
              )}
              
              <p className="text-gray-600 mb-4">
                {provider?.description || provider?.short_description || 'Zertifizierter Bildungsträger mit langjähriger Erfahrung'}
              </p>
              {provider?.website && (
                <a 
                  href={provider.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-cyan-600 hover:text-cyan-700 font-medium text-sm mt-2"
                >
                  {ui.sections.visitWebsite}
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              )}
            </div>
          </div>

          {/* Social Media Links */}
          {provider?.social_media && typeof provider.social_media === 'object' && Object.keys(provider.social_media).length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">{ui.sections.followUs}</h3>
              <div className="flex flex-wrap gap-3">
                {provider.social_media.facebook && (
                  <a 
                    href={provider.social_media.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg hover:shadow-lg hover:scale-110 transition-all duration-200"
                    title="Facebook"
                  >
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  </a>
                )}
                {provider.social_media.instagram && (
                  <a 
                    href={provider.social_media.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center justify-center w-12 h-12 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 rounded-lg hover:shadow-lg hover:scale-110 transition-all duration-200"
                    title="Instagram"
                  >
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                  </a>
                )}
                {provider.social_media.youtube && (
                  <a 
                    href={provider.social_media.youtube}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center justify-center w-12 h-12 bg-gradient-to-r from-red-500 to-red-600 rounded-lg hover:shadow-lg hover:scale-110 transition-all duration-200"
                    title="YouTube"
                  >
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                    </svg>
                  </a>
                )}
                {provider.social_media.linkedin && (
                  <a 
                    href={provider.social_media.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg hover:shadow-lg hover:scale-110 transition-all duration-200"
                    title="LinkedIn"
                  >
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                  </a>
                )}
                {provider.social_media.twitter && (
                  <a 
                    href={provider.social_media.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-400 to-blue-500 rounded-lg hover:shadow-lg hover:scale-110 transition-all duration-200"
                    title="Twitter/X"
                  >
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                    </svg>
                  </a>
                )}
              </div>
            </div>
          )}

          {/* Trust Badges - Mobile & Desktop */}
          {(provider?.trustpilot_url || provider?.google_reviews_url) && (
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-3">{ui.sections.viewReviews}</h3>
              <div className="flex flex-wrap gap-3">
                {provider?.trustpilot_url && provider.trustpilot_url.trim() !== '' && (
                  <a 
                    href={provider.trustpilot_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-3 px-5 py-3 bg-gradient-to-r from-cyan-50 to-emerald-50 border-2 border-cyan-200 rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-200"
                  >
                    <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
                      <svg className="w-6 h-6 text-emerald-600" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                      </svg>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-gray-900">Trustpilot</span>
                      <span className="text-xs text-gray-600">Bewertungen lesen</span>
                    </div>
                    <svg className="w-4 h-4 text-gray-400 group-hover:text-cyan-600 transition-colors ml-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                )}
                
                {provider?.google_reviews_url && provider.google_reviews_url.trim() !== '' && (
                  <a 
                    href={provider.google_reviews_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-3 px-5 py-3 bg-gradient-to-r from-cyan-50 to-emerald-50 border-2 border-cyan-200 rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-200"
                  >
                    <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
                      <svg className="w-6 h-6" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                      </svg>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-gray-900">Google</span>
                      <span className="text-xs text-gray-600">Bewertungen lesen</span>
                    </div>
                    <svg className="w-4 h-4 text-gray-400 group-hover:text-cyan-600 transition-colors ml-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Provider Contact Section */}
        {provider && (provider.phone || provider.email || provider.contact_name) && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 pb-[69px] sm:pb-[77px]">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              {ui.sections.contact}
            </h2>
            
            <p className="text-xl font-semibold text-gray-900 mb-4">
              {provider.company_name || provider.name}
            </p>
            
            {provider.contact_name && (
              <p className="text-gray-600 mb-4">
                {ui.sections.contactPerson}: {provider.contact_name}
              </p>
            )}
            
            <div className="space-y-3 mb-6">
              {provider.phone && (
                <a 
                  href={`tel:${provider.phone}`}
                  className="flex items-center gap-3 text-gray-700 hover:text-cyan-600 transition-colors"
                >
                  <svg className="w-5 h-5 text-cyan-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span>{provider.phone}</span>
                </a>
              )}
              
              {provider.email && (
                <a 
                  href={`mailto:${provider.email}`}
                  className="flex items-center gap-3 text-gray-700 hover:text-cyan-600 transition-colors"
                >
                  <svg className="w-5 h-5 text-cyan-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span>{provider.email}</span>
                </a>
              )}
              
              {provider.website && (
                <a 
                  href={provider.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-gray-700 hover:text-cyan-600 transition-colors"
                >
                  <svg className="w-5 h-5 text-cyan-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                  </svg>
                  <span>{provider.website}</span>
                </a>
              )}
            </div>
            
            {provider.city && (
              <p className="text-gray-600 text-sm">
                <svg className="w-4 h-4 inline mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {provider.city}
              </p>
            )}
          </div>
        )}

        {/* End of Left Column */}
        </div>

        {/* Right Column: Sticky Sidebar (1/3 width on desktop, hidden on mobile) */}
        <div className="hidden lg:block lg:w-1/3">
          <div className="sticky top-24 space-y-6">
            
            {/* Course Details Card */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
              {/* Card Header with Gradient */}
              <div className="bg-gradient-to-r from-cyan-500 to-emerald-500 p-6 text-white">
                <h3 className="text-2xl font-bold mb-2">{ui.sidebar.title}</h3>
                <p className="text-white/90 text-sm">{ui.sidebar.subtitle}</p>
              </div>

              <div className="p-6 space-y-4">
                
                {/* Price */}
                {course.price && (
                  <div className="flex justify-between items-center pb-4 border-b border-gray-100">
                    <div className="flex items-center gap-2">
                      <svg className="w-5 h-5 text-cyan-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-gray-700 font-medium">{ui.sidebar.price}</span>
                    </div>
                    <span className="font-bold text-xl text-gray-900">
                      {new Intl.NumberFormat('de-DE', { 
                        style: 'currency', 
                        currency: 'EUR' 
                      }).format(course.price)}
                    </span>
                  </div>
                )}
                
                {/* Language */}
                {course.language && (
                  <div className="flex justify-between items-center pb-4 border-b border-gray-100">
                    <div className="flex items-center gap-2">
                      <svg className="w-5 h-5 text-cyan-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-gray-700 font-medium">{ui.sidebar.language}</span>
                    </div>
                    <span className="font-semibold text-gray-900 flex items-center gap-1">
                      {(() => {
                        const langLower = (course.language || '').toLowerCase();
                        if (langLower.includes('deutsch') || langLower.includes('german')) return '🇩🇪';
                        if (langLower.includes('english') || langLower.includes('englisch')) return '🇬🇧';
                        if (langLower.includes('französisch') || langLower.includes('french')) return '🇫🇷';
                        if (langLower.includes('spanisch') || langLower.includes('spanish')) return '🇪🇸';
                        return '🌐';
                      })()}
                      {course.language}
                    </span>
                  </div>
                )}
                
                {/* Format */}
                {course.format && (
                  <div className="flex justify-between items-center pb-4 border-b border-gray-100">
                    <div className="flex items-center gap-2">
                      <svg className="w-5 h-5 text-cyan-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <span className="text-gray-700 font-medium">{ui.sidebar.format}</span>
                    </div>
                    <span className="font-semibold text-gray-900">{course.format}</span>
                  </div>
                )}
                
                {/* Duration */}
                {course.duration && (
                  <div className="flex justify-between items-center pb-4 border-b border-gray-100">
                    <div className="flex items-center gap-2">
                      <svg className="w-5 h-5 text-cyan-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-gray-700 font-medium">{ui.sidebar.duration}</span>
                    </div>
                    <span className="font-semibold text-gray-900">{course.duration}</span>
                  </div>
                )}
                
                {/* Duration Hours */}
                {course.duration_hours && (
                  <div className="flex justify-between items-center pb-4 border-b border-gray-100">
                    <div className="flex items-center gap-2">
                      <svg className="w-5 h-5 text-cyan-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-gray-700 font-medium">{ui.sidebar.hours}</span>
                    </div>
                    <span className="font-semibold text-gray-900">{course.duration_hours}</span>
                  </div>
                )}
                
                {/* Location */}
                {course.location && (
                  <div className="flex justify-between items-center pb-4 border-b border-gray-100">
                    <div className="flex items-center gap-2">
                      <svg className="w-5 h-5 text-cyan-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span className="text-gray-700 font-medium">{ui.sidebar.location}</span>
                    </div>
                    <span className="font-semibold text-gray-900">{course.location}</span>
                  </div>
                )}
                
                {/* Next Start Date */}
                {course.start_date && (
                  <div className="flex justify-between items-center pb-4 border-b border-gray-100">
                    <div className="flex items-center gap-2">
                      <svg className="w-5 h-5 text-cyan-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span className="text-gray-700 font-medium">{ui.sidebar.startDate}</span>
                    </div>
                    <span className="font-semibold text-gray-900">
                      {new Date(course.start_date).toLocaleDateString('de-DE', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric'
                      })}
                    </span>
                  </div>
                )}

              </div>

              {/* Apply Button */}
              <div className="p-6 pt-0">
                <button
                  onClick={() => setShowApplicationModal(true)}
                  className="w-full bg-gradient-to-r from-cyan-500 to-emerald-500 text-white font-bold py-4 rounded-xl hover:shadow-xl hover:scale-105 transition-all duration-200 flex items-center justify-center gap-2"
                >
                  {ui.apply}
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </button>

                {/* Additional Info */}
                <div className="mt-4 text-center">
                  <p className="text-sm text-gray-500">
                    {(() => {
                      // Get funding types from course data
                      let fundingTypes = [];
                      if (course.funding_types && Array.isArray(course.funding_types)) {
                        fundingTypes = course.funding_types;
                      } else if (course.funding_type) {
                        if (typeof course.funding_type === 'string') {
                          fundingTypes = course.funding_type.split(',').map(f => f.trim()).filter(Boolean);
                        }
                      }
                      
                      return (
                        <>
                          {/* Funding Types */}
                          {fundingTypes.length > 0 ? (
                            <>
                              {fundingTypes.map((type, idx) => (
                                <span key={idx}>
                                  ✓ {type}
                                  {idx < fundingTypes.length - 1 && <br/>}
                                </span>
                              ))}
                              <br/>
                            </>
                          ) : course.funding_eligible ? (
                            <>
                              ✓ 100% Förderung möglich<br/>
                            </>
                          ) : null}
                          ✓ Kostenlose Beratung<br/>
                          ✓ Zertifizierter Anbieter
                        </>
                      );
                    })()}
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
        {/* End of Right Column */}

      </div>

      {/* Floating Mobile Application Button */}
      {provider && (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg p-4 z-50">
          <button
            onClick={handleApplicationClick}
            className="w-full bg-gradient-to-r from-cyan-500 to-emerald-500 text-white font-semibold py-4 rounded-lg shadow-lg flex items-center justify-center gap-2"
          >
            Jetzt bewerben
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </button>
        </div>
      )}

      {/* Unified Application Modal - Works on both desktop and mobile */}
      {showApplicationModal && provider && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            {/* Sticky Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center z-10 rounded-t-2xl">
              <h2 className="text-2xl font-bold text-gray-900">{ui.form.title}</h2>
              <button
                onClick={() => setShowApplicationModal(false)}
                className="text-gray-500 hover:text-gray-700 transition-colors"
                aria-label={ui.form.close}
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            {/* Application Form */}
            <div className="p-6">
              <ApplicationForm 
                courseId={course.id}
                courseName={course.title}
                providerId={provider.id}
                providerName={provider.company_name || provider.name}
                labels={ui.form}
              />
            </div>
          </div>
        </div>
      )}

      {/* Floating AI Chat Button - Visible on all screens, positioned above application button on mobile */}
      <button
        onClick={() => setIsChatOpen(true)}
        className="fixed right-4 bottom-[100px] sm:right-6 sm:bottom-6 w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-r from-cyan-500 to-emerald-500 text-white rounded-full shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-200 flex items-center justify-center z-[60]"
        aria-label="AI Chat öffnen"
      >
        {/* Sparkles/AI Icon */}
        <svg className="w-6 h-6 sm:w-7 sm:h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
        </svg>
      </button>

      {/* AI Chat Widget Modal - Floating on all screens */}
      {isChatOpen && (
        <>
          {/* Backdrop - Mobile only */}
          <div 
            className="fixed inset-0 bg-black/50 z-[55] sm:hidden"
            onClick={() => setIsChatOpen(false)}
          />
          
          {/* Chat Modal - Floating */}
          <div className="fixed right-4 bottom-4 left-4 sm:right-6 sm:bottom-6 sm:left-auto sm:w-96 sm:h-[500px] h-[500px] bg-white rounded-2xl shadow-2xl z-[60] flex flex-col">
          {/* Chat Header */}
          <div className="bg-gradient-to-r from-cyan-500 to-emerald-500 text-white p-4 rounded-t-2xl flex justify-between items-center">
            <div className="flex items-center gap-2">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
              <span className="font-semibold">Kursfind AI</span>
            </div>
            <button
              onClick={() => setIsChatOpen(false)}
              className="text-white hover:text-gray-200 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Chat Content */}
          <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
            {chatMessages.length === 0 ? (
              <div className="text-center py-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-cyan-500 to-emerald-500 rounded-full mb-4 animate-pulse">
                  <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Willkommen beim Kursfind AI!</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Ich bin Ihr persönlicher AI-Berater für diesen Kurs. Stellen Sie mir Fragen wie:
                </p>
                <div className="mt-4 space-y-2 text-left">
                  <button
                    onClick={() => sendMessageWithContext('Was sind die Voraussetzungen für diesen Kurs?', chatMessages)}
                    className="w-full bg-white p-3 rounded-lg text-sm text-gray-700 hover:shadow-md hover:border-cyan-500 transition-all border border-gray-200 text-left"
                  >
                    💡 Was sind die Voraussetzungen für diesen Kurs?
                  </button>
                  <button
                    onClick={() => sendMessageWithContext('Wann kann ich starten?', chatMessages)}
                    className="w-full bg-white p-3 rounded-lg text-sm text-gray-700 hover:shadow-md hover:border-cyan-500 transition-all border border-gray-200 text-left"
                  >
                    📅 Wann kann ich starten?
                  </button>
                  <button
                    onClick={() => sendMessageWithContext('Welche Karrierechancen habe ich nach dem Kurs?', chatMessages)}
                    className="w-full bg-white p-3 rounded-lg text-sm text-gray-700 hover:shadow-md hover:border-cyan-500 transition-all border border-gray-200 text-left"
                  >
                    🎓 Welche Karrierechancen habe ich nach dem Kurs?
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {chatMessages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    {message.role === 'assistant' && (
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-cyan-500 to-emerald-500 flex items-center justify-center mr-2">
                        <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                        </svg>
                      </div>
                    )}
                    <div
                      className={`max-w-[80%] p-3 rounded-lg ${
                        message.role === 'user'
                          ? 'bg-gradient-to-r from-cyan-500 to-emerald-500 text-white'
                          : 'bg-white text-gray-800 border border-gray-200 shadow-sm'
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    </div>
                  </div>
                ))}
                {isChatLoading && (
                  <div className="flex justify-start">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-cyan-500 to-emerald-500 flex items-center justify-center mr-2">
                      <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                      </svg>
                    </div>
                    <div className="bg-white text-gray-800 border border-gray-200 p-3 rounded-lg">
                      <div className="flex space-x-2">
                        <div className="w-2 h-2 bg-cyan-500 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-cyan-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        <div className="w-2 h-2 bg-cyan-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={chatMessagesEndRef} />
              </div>
            )}
          </div>

          {/* Chat Input */}
          <div className="p-4 border-t border-gray-200 bg-white rounded-b-2xl">
            <div className="flex gap-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && chatInput.trim() && !isChatLoading) {
                    handleChatSend()
                  }
                }}
                placeholder="Stelle eine Frage zu diesem Kurs..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all text-gray-900 placeholder:text-gray-400"
                disabled={isChatLoading}
              />
              <button
                onClick={handleChatSend}
                className="bg-gradient-to-r from-cyan-500 to-emerald-500 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!chatInput.trim() || isChatLoading}
              >
                {isChatLoading ? (
                  <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
        </>
      )}

    </div>
  )
}
