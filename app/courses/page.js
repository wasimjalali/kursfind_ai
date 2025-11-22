'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import Link from 'next/link'
import Image from 'next/image'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

export default function CoursesPage() {
  const [allCourses, setAllCourses] = useState([])
  const [filteredCourses, setFilteredCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [showScrollTop, setShowScrollTop] = useState(false)
  
  // Quick filter states (top bar)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedLocation, setSelectedLocation] = useState('')
  const [selectedFunding, setSelectedFunding] = useState('')
  const [selectedProvider, setSelectedProvider] = useState('')
  const [sortBy, setSortBy] = useState('newest')
  
  // Advanced filter states (sidebar checkboxes)
  const [selectedCategories, setSelectedCategories] = useState([])
  const [selectedFormats, setSelectedFormats] = useState([])
  const [selectedDurations, setSelectedDurations] = useState([])
  const [selectedFundingOptions, setSelectedFundingOptions] = useState([])
  
  // Unique values for dropdowns
  const [locations, setLocations] = useState([])
  const [fundingTypes, setFundingTypes] = useState([])
  const [providers, setProviders] = useState([])

  // Fetch courses function (separate so it can be reused for real-time updates)
  async function fetchCourses() {
    try {
      setLoading(true)
      
      // First, check if Supabase client is properly initialized
      if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
        throw new Error('Supabase environment variables are not set')
      }
      
      // Try to fetch with provider join first
      let { data, error } = await supabase
        .from('courses')
        .select(`
          *,
          providers (
            id,
            name,
            logo_url
          )
        `)
        .order('created_at', { ascending: false })

      // If join fails, try without join as fallback
      if (error && (error.code === 'PGRST116' || error.message?.includes('relation') || error.message?.includes('foreign key'))) {
        console.warn('Provider join failed, fetching courses without join:', error.message)
        const fallbackResult = await supabase
          .from('courses')
          .select('*')
          .order('created_at', { ascending: false })
        
        if (fallbackResult.error) {
          throw fallbackResult.error
        }
        
        data = fallbackResult.data
        error = null
      }

      if (error) {
        console.error('Supabase query error:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        })
        throw error
      }

      if (data) {
        setAllCourses(data)
        setFilteredCourses(data)
        
        // Extract unique values for filters
        const uniqueLocations = [...new Set(data.map(c => c.location).filter(Boolean))]
        const uniqueFunding = [...new Set(data.map(c => c.funding_type).filter(Boolean))]
        const uniqueProviders = [...new Set(data.map(c => c.provider || c.providers?.name).filter(Boolean))]
        
        setLocations(uniqueLocations.sort())
        setFundingTypes(uniqueFunding.sort())
        setProviders(uniqueProviders.sort())
      } else {
        // No error but no data - set empty arrays
        setAllCourses([])
        setFilteredCourses([])
        setLocations([])
        setFundingTypes([])
        setProviders([])
      }
    } catch (error) {
      console.error('Error fetching courses:', {
        message: error?.message || 'Unknown error',
        details: error?.details || error?.toString(),
        stack: error?.stack
      })
      // Set empty arrays on error to prevent UI crashes
      setAllCourses([])
      setFilteredCourses([])
      setLocations([])
      setFundingTypes([])
      setProviders([])
    } finally {
      setLoading(false)
    }
  }

  // Fetch courses on mount + Set up real-time subscription
  useEffect(() => {
    // Initial fetch
    fetchCourses()

    // Set up real-time subscription for live updates
    const channel = supabase
      .channel('courses-changes')
      .on(
        'postgres_changes',
        {
          event: '*', // Listen to INSERT, UPDATE, DELETE
          schema: 'public',
          table: 'courses'
        },
        (payload) => {
          console.log('Course database updated:', payload.eventType)
          // Automatically refetch all courses when database changes
          fetchCourses()
        }
      )
      .subscribe()

    // Cleanup subscription on unmount
    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  // Scroll to top button visibility
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Apply filters whenever filter states change
  useEffect(() => {
    let filtered = [...allCourses]

    // Keyword search (title, description, provider)
    if (searchTerm) {
      const keyword = searchTerm.toLowerCase()
      filtered = filtered.filter(course => 
        course.title?.toLowerCase().includes(keyword) ||
        course.description?.toLowerCase().includes(keyword) ||
        course.provider?.toLowerCase().includes(keyword)
      )
    }

    // Quick filters (top bar)
    if (selectedLocation) {
      filtered = filtered.filter(course => course.location === selectedLocation)
    }

    if (selectedFunding) {
      filtered = filtered.filter(course => course.funding_type === selectedFunding)
    }

    if (selectedProvider) {
      filtered = filtered.filter(course => course.provider === selectedProvider)
    }

    // Advanced filters (sidebar checkboxes)
    if (selectedCategories.length > 0) {
      filtered = filtered.filter(course =>
        selectedCategories.some(cat => 
          course.title?.toLowerCase().includes(cat.toLowerCase())
        )
      )
    }

    if (selectedFormats.length > 0) {
      filtered = filtered.filter(course =>
        selectedFormats.some(format => 
          course.format?.toLowerCase().includes(format.toLowerCase()) ||
          course.title?.toLowerCase().includes(format.toLowerCase())
        )
      )
    }

    if (selectedDurations.length > 0) {
      filtered = filtered.filter(course => {
        const durationText = course.duration?.toLowerCase() || ''
        return selectedDurations.some(dur => {
          if (dur === '0-3') {
            return durationText.includes('woche') || 
                   (durationText.includes('monat') && !durationText.match(/[4-9]|1[0-9]/))
          }
          if (dur === '3-6') {
            return durationText.match(/[3-6]\s*monat/)
          }
          if (dur === '6+') {
            return durationText.match(/[7-9]\s*monat/) || durationText.match(/1[0-9]\s*monat/)
          }
          return false
        })
      })
    }

    if (selectedFundingOptions.length > 0) {
      filtered = filtered.filter(course => {
        return selectedFundingOptions.some(opt => 
          course.funding_type === opt
        );
      })
    }

    // Sorting
    if (sortBy === 'newest') {
      filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    } else if (sortBy === 'a-z') {
      filtered.sort((a, b) => a.title.localeCompare(b.title))
    } else if (sortBy === 'z-a') {
      filtered.sort((a, b) => b.title.localeCompare(a.title))
    }

    setFilteredCourses(filtered)
  }, [searchTerm, selectedLocation, selectedFunding, selectedProvider, selectedCategories, selectedFormats, selectedDurations, selectedFundingOptions, sortBy, allCourses])

  const resetFilters = () => {
    setSearchTerm('')
    setSelectedLocation('')
    setSelectedFunding('')
    setSelectedProvider('')
    setSortBy('newest')
    setSelectedCategories([])
    setSelectedFormats([])
    setSelectedDurations([])
    setSelectedFundingOptions([])
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header - Fixed, Professional */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3">
              <Image 
                src="/Assets/kursfind-new-logo.PNG"
                alt="Kursfind AI"
                width={280}
                height={70}
                className="h-16 w-auto rounded-lg"
                priority
              />
            </Link>
            <Link 
              href="/" 
              className="text-gray-700 hover:text-cyan-600 font-medium transition-colors"
            >
              ← Zurück zur AI-Suche
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-cyan-500 via-cyan-600 to-emerald-600 text-white py-12 md:py-20">
        {/* Subtle overlay for depth */}
        <div className="absolute inset-0 bg-black/5"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Main Heading */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6 leading-tight">
            Finden Sie Ihre Weiterbildung in Minuten
          </h1>
          
          {/* Subheading - describes THIS page's purpose */}
          <p className="text-lg md:text-xl lg:text-2xl text-cyan-50 max-w-3xl mx-auto leading-relaxed">
            Entdecken Sie Top-Schulungsprogramme mit intelligenten Filtern
          </p>
        </div>
      </section>

      {/* Horizontal Quick Filters Bar - ALL FILTERS */}
      <section className="bg-white border-b border-gray-200 shadow-sm lg:sticky lg:top-[73px] z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            
            {/* Search Input */}
            <input
              type="text"
              placeholder="Kurs oder Anbieter suchen..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 min-w-[200px] px-4 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder:text-gray-500 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
            />

            {/* Location Filter */}
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="px-4 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-cyan-500 min-w-[140px]"
            >
              <option value="">Alle Standorte</option>
              {locations.map(loc => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </select>

            {/* Provider Filter */}
            <select
              value={selectedProvider}
              onChange={(e) => setSelectedProvider(e.target.value)}
              className="px-4 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-cyan-500 min-w-[140px]"
            >
              <option value="">Alle Anbieter</option>
              {providers.map(prov => (
                <option key={prov} value={prov}>{prov}</option>
              ))}
            </select>

            {/* Sort Filter */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-cyan-500 min-w-[140px]"
            >
              <option value="newest">Neueste zuerst</option>
              <option value="a-z">A-Z</option>
              <option value="z-a">Z-A</option>
            </select>

            {/* Reset Button */}
            <button
              onClick={resetFilters}
              className="px-5 py-2.5 text-cyan-600 hover:bg-cyan-50 border border-cyan-200 rounded-lg font-medium text-sm transition-colors whitespace-nowrap"
            >
              Zurücksetzen
            </button>
          </div>

          {/* Second Row - Advanced Filters */}
          <div className="flex flex-wrap items-center gap-3">
            
            {/* Category Filter */}
            <select
              value={selectedCategories.length === 1 ? selectedCategories[0] : ''}
              onChange={(e) => {
                if (e.target.value) {
                  setSelectedCategories([e.target.value])
                } else {
                  setSelectedCategories([])
                }
              }}
              className="px-4 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-cyan-500 min-w-[160px]"
            >
              <option value="">Alle Kategorien</option>
              <option value="Data Science">Data Science</option>
              <option value="Web Development">Web Development</option>
              <option value="Digital Marketing">Digital Marketing</option>
              <option value="Design">Design</option>
              <option value="Cyber Security">Cyber Security</option>
              <option value="Cloud Computing">Cloud Computing</option>
            </select>

            {/* Format Filter */}
            <select
              value={selectedFormats.length === 1 ? selectedFormats[0] : ''}
              onChange={(e) => {
                if (e.target.value) {
                  setSelectedFormats([e.target.value])
                } else {
                  setSelectedFormats([])
                }
              }}
              className="px-4 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-cyan-500 min-w-[140px]"
            >
              <option value="">Alle Formate</option>
              <option value="Vollzeit">Vollzeit</option>
              <option value="Teilzeit">Teilzeit</option>
              <option value="Online">Online</option>
              <option value="Präsenz">Präsenz</option>
              <option value="Hybrid">Hybrid</option>
            </select>

            {/* Duration Filter */}
            <select
              value={selectedDurations.length === 1 ? selectedDurations[0] : ''}
              onChange={(e) => {
                if (e.target.value) {
                  setSelectedDurations([e.target.value])
                } else {
                  setSelectedDurations([])
                }
              }}
              className="px-4 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-cyan-500 min-w-[140px]"
            >
              <option value="">Alle Dauern</option>
              <option value="0-3">Unter 3 Monate</option>
              <option value="3-6">3-6 Monate</option>
              <option value="6+">Über 6 Monate</option>
            </select>

            {/* Funding Options Filter */}
            <select
              value={selectedFundingOptions.length === 1 ? selectedFundingOptions[0] : ''}
              onChange={(e) => {
                if (e.target.value) {
                  setSelectedFundingOptions([e.target.value])
                } else {
                  setSelectedFundingOptions([])
                }
              }}
              className="px-4 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-cyan-500 min-w-[160px]"
            >
              <option value="">Finanzierungsoptionen</option>
              {fundingTypes.map(funding => (
                <option key={funding} value={funding}>{funding}</option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* Main Content Area - Full Width (No Sidebar) */}
      <div className="bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          
          {/* Results Header */}
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-3xl font-bold text-gray-900">Alle Kurse</h2>
            <div className="bg-white border border-gray-200 px-5 py-2.5 rounded-lg shadow-sm">
              <span className="text-2xl font-bold text-cyan-600">{filteredCourses.length}</span>
              <span className="text-sm text-gray-600 ml-2">Kurse gefunden</span>
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-gray-600 font-medium">Kurse werden geladen...</p>
            </div>
          )}

          {/* Empty State */}
          {!loading && filteredCourses.length === 0 && (
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-12 text-center">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Keine Kurse gefunden</h3>
              <p className="text-gray-600 mb-6">
                Versuchen Sie andere Filterkriterien oder setzen Sie die Suche zurück.
              </p>
              <button
                onClick={resetFilters}
                className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-emerald-500 text-white rounded-lg font-semibold hover:shadow-lg transition-all"
              >
                Filter zurücksetzen
              </button>
            </div>
          )}

          {/* 3-Column Course Grid - TALLER CARDS */}
          {!loading && filteredCourses.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCourses.map((course) => (
                <Link 
                  key={course.id} 
                  href={`/courses/${course.id}`}
                  className="block group h-full"
                >
                  <div className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-xl hover:border-cyan-300 transition-all duration-300 overflow-hidden flex flex-col h-full">
                    
                    {/* Course Image */}
                    {course.image_url ? (
                      <div className="w-full h-48 bg-gradient-to-br from-cyan-100 to-emerald-100 overflow-hidden">
                        <img 
                          src={course.image_url} 
                          alt={course.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-full h-48 bg-gradient-to-br from-cyan-100 to-emerald-100 flex items-center justify-center">
                        <svg className="w-16 h-16 text-cyan-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}
                    
                    <div className="p-6 flex flex-col flex-grow">
                      {/* Provider Logo + Name + Funding Badge */}
                      <div className="flex items-start justify-between mb-4 gap-3">
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          {/* Provider Logo */}
                          {course.providers?.logo_url ? (
                            <img 
                              src={course.providers.logo_url} 
                              alt={course.providers.name || course.provider}
                              className="w-10 h-10 rounded-lg object-contain border border-gray-200 bg-white p-1 flex-shrink-0"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-cyan-500 to-emerald-500 flex items-center justify-center flex-shrink-0">
                              <span className="text-white font-bold text-xs">
                                {(course.providers?.name || course.provider || 'K')[0].toUpperCase()}
                          </span>
                            </div>
                        )}
                          {/* Provider Name */}
                          <div className="flex-1 min-w-0">
                            <div className="text-xs font-semibold text-gray-900 truncate">
                              {course.providers?.name || course.provider || 'Anbieter'}
                            </div>
                        {course.funding_type && (
                              <div className="text-xs text-emerald-600 font-medium mt-0.5">
                            {course.funding_type}
                              </div>
                        )}
                          </div>
                        </div>
                      </div>

                      {/* Course Title - Taller min-height */}
                      <h3 className="text-lg font-bold text-gray-900 mb-4 group-hover:text-cyan-600 transition-colors line-clamp-2 min-h-[3.5rem]">
                        {course.title}
                      </h3>

                      {/* Description - More lines visible */}
                      {course.description && (
                        <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3 flex-grow">
                          {course.description}
                        </p>
                      )}

                      {/* Benefits */}
                      {course.benefits && (() => {
                        const benefitsList = course.benefits.split(',').map(b => b.trim()).filter(Boolean);
                        return benefitsList.length > 0 ? (
                          <div className="mb-4">
                            <div className="flex flex-wrap gap-2">
                              {benefitsList.slice(0, 3).map((benefit, idx) => (
                                <span 
                                  key={idx}
                                  className="inline-flex items-center gap-1 px-2.5 py-1 bg-cyan-50 text-cyan-700 text-xs font-semibold rounded-full border border-cyan-200"
                                >
                                  {benefit === 'Inklusiver Laptop' && '💻'}
                                  {benefit === 'Jobcoaching' && '👔'}
                                  {benefit === 'Job Garantie' && '✅'}
                                  <span>{benefit}</span>
                                </span>
                              ))}
                            </div>
                          </div>
                        ) : null;
                      })()}

                      {/* Metadata Grid - FULL INFO VISIBLE */}
                      <div className="space-y-3 mb-6">
                        {/* Location */}
                        {course.location && (
                          <div className="flex items-start gap-3">
                            <div className="flex-shrink-0 w-5 h-5 text-cyan-600">
                              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                              </svg>
                            </div>
                            <div>
                              <div className="text-xs text-gray-500 font-medium">Standort</div>
                              <div className="text-sm text-gray-900 font-semibold">{course.location}</div>
                            </div>
                          </div>
                        )}
                        
                        {/* Duration */}
                        {course.duration && (
                          <div className="flex items-start gap-3">
                            <div className="flex-shrink-0 w-5 h-5 text-cyan-600">
                              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            </div>
                            <div>
                              <div className="text-xs text-gray-500 font-medium">Dauer</div>
                              <div className="text-sm text-gray-900 font-semibold">{course.duration}</div>
                            </div>
                          </div>
                        )}
                        
                        {/* Format */}
                        <div className="flex items-start gap-3">
                          <div className="flex-shrink-0 w-5 h-5 text-cyan-600">
                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                          </div>
                          <div>
                            <div className="text-xs text-gray-500 font-medium">Format</div>
                            <div className="text-sm text-gray-900 font-semibold">{course.format || 'Vollzeit'}</div>
                          </div>
                        </div>
                      </div>

                      {/* CTA Button */}
                      <button className="w-full bg-gradient-to-r from-cyan-500 to-emerald-500 text-white font-semibold py-3 rounded-lg hover:shadow-lg hover:scale-[1.02] transition-all duration-200 flex items-center justify-center gap-2 mt-auto">
                        Mehr erfahren
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 w-12 h-12 rounded-full bg-gradient-to-r from-cyan-500 to-emerald-500 text-white shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center z-30 hover:scale-110"
          aria-label="Scroll to top"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
          </svg>
        </button>
      )}
    </div>
  )
}
