'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import Image from 'next/image'

export default function CoursesPage() {
  const [allCourses, setAllCourses] = useState([])
  const [filteredCourses, setFilteredCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [showScrollTop, setShowScrollTop] = useState(false)
  const [savedCourses, setSavedCourses] = useState(new Set())
  const [savingCourses, setSavingCourses] = useState(new Set())
  
  // Quick filter states (top bar)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedLocation, setSelectedLocation] = useState('')
  const [selectedProvider, setSelectedProvider] = useState('')
  const [selectedLanguage, setSelectedLanguage] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedFormat, setSelectedFormat] = useState('')
  const [selectedDuration, setSelectedDuration] = useState('')
  const [selectedFundingOption, setSelectedFundingOption] = useState('')
  const [sortBy, setSortBy] = useState('newest')
  
  // Unique values for dropdowns
  const [locations, setLocations] = useState([])
  const [fundingTypes, setFundingTypes] = useState([])
  const [providers, setProviders] = useState([])
  const [languages, setLanguages] = useState([])
  const [categories, setCategories] = useState([])
  const [formats, setFormats] = useState([])

  // Fetch courses function (separate so it can be reused for real-time updates)
  async function fetchCourses() {
    try {
      setLoading(true)
      
      // First, check if Supabase client is properly initialized
      if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
        throw new Error('Supabase environment variables are not set')
      }
      
      // Fetch courses first, then providers separately (more reliable)
      console.log('🔍 Fetching courses...')
      let { data, error } = await supabase
        .from('courses')
        .select('*, language')
        .order('created_at', { ascending: false })
      
      if (error) {
        console.error('❌ Error fetching courses:', error)
        throw error
      }
      
      console.log(`✅ Fetched ${data?.length || 0} courses`)
      
      if (data && data.length > 0) {
        // Fetch all unique provider_ids from courses
        const providerIds = [...new Set(data.map(c => c.provider_id).filter(Boolean))]
        console.log(`🏢 Found ${providerIds.length} unique provider IDs:`, providerIds)
        
        let processedData = data
        
        if (providerIds.length > 0) {
          // Fetch all providers in one query
          console.log('🔍 Fetching providers from database...')
          const { data: allProviders, error: providersError } = await supabase
            .from('providers')
            .select('provider_id, company_name, logo_url, description, certifications, phone, email, website, contact_name, city')
            .in('provider_id', providerIds)
          
          if (providersError) {
            console.error('❌ Error fetching providers:', providersError)
          } else if (allProviders && allProviders.length > 0) {
            console.log(`✅ Fetched ${allProviders.length} providers`)
            console.log('📊 Provider data:', allProviders)
            
            // Create a map for quick lookup
            const providersMap = new Map(allProviders.map(p => [p.provider_id, p]))
            console.log('🗺️ Provider map keys:', Array.from(providersMap.keys()))
            
            // Attach providers to courses
            processedData = data.map(course => {
              const provider = providersMap.get(course.provider_id)
              if (provider) {
                console.log(`✅ Matched provider for course "${course.title}": ${provider.company_name}`)
              } else {
                console.warn(`⚠️ No provider found for course "${course.title}" with provider_id: "${course.provider_id}"`)
              }
              return {
                ...course,
                providers: provider || null
              }
            })
          } else {
            console.warn('⚠️ No providers returned from database')
          }
        }
        
        console.log('📦 Sample course with provider:', {
          title: processedData[0]?.title,
          provider_id: processedData[0]?.provider_id,
          provider_name: processedData[0]?.providers?.company_name,
          provider_logo: processedData[0]?.providers?.logo_url
        })
        
        setAllCourses(processedData)
        setFilteredCourses(processedData)
        
        // Extract unique values for filters
        const uniqueLocations = [...new Set(processedData.map(c => c.location).filter(Boolean))]
        const uniqueLanguages = [...new Set(processedData.map(c => c.language).filter(Boolean))]
        const uniqueCategories = [...new Set(processedData.map(c => c.category).filter(Boolean))]
        const uniqueFormats = [...new Set(processedData.map(c => c.format).filter(Boolean))]
        const uniqueProviders = [...new Set(processedData.map(c => {
          const provider = Array.isArray(c.providers) ? c.providers[0] : c.providers
          return c.provider || provider?.company_name || provider?.name
        }).filter(Boolean))]
        
        // Extract funding types from funding_types array column
        const allFundingTypes = processedData.flatMap(c => {
          if (Array.isArray(c.funding_types)) {
            return c.funding_types.filter(Boolean)
          }
          // Fallback to funding_type if funding_types doesn't exist
          return c.funding_type ? [c.funding_type] : []
        })
        const uniqueFundingTypes = [...new Set(allFundingTypes)]
        
        setLocations(uniqueLocations.sort())
        setLanguages(uniqueLanguages.sort())
        setCategories(uniqueCategories.sort())
        setFormats(uniqueFormats.sort())
        setFundingTypes(uniqueFundingTypes.sort())
        setProviders(uniqueProviders.sort())
      } else {
        // No error but no data - set empty arrays
        setAllCourses([])
        setFilteredCourses([])
        setLocations([])
        setLanguages([])
        setCategories([])
        setFormats([])
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

  // Load saved courses for current user
  useEffect(() => {
    async function loadSavedCourses() {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        const { data: student } = await supabase
          .from('students')
          .select('id')
          .eq('auth_user_id', user.id)
          .single()

        if (!student) return

        const { data: saved } = await supabase
          .from('saved_courses')
          .select('course_id')
          .eq('student_id', student.id)

        if (saved) {
          // Ensure all course IDs are numbers
          const courseIds = saved.map(s => {
            const id = s.course_id
            return typeof id === 'string' ? parseInt(id, 10) : id
          }).filter(id => !isNaN(id))
          setSavedCourses(new Set(courseIds))
          console.log('Loaded saved courses:', courseIds)
        }
      } catch (error) {
        console.error('Error loading saved courses:', error)
      }
    }
    loadSavedCourses()
  }, [])

  // Toggle save course
  const toggleSaveCourse = async (courseId, e) => {
    e.preventDefault()
    e.stopPropagation()

    try {
      // Ensure courseId is a number
      const courseIdNum = typeof courseId === 'string' ? parseInt(courseId, 10) : courseId
      
      if (isNaN(courseIdNum)) {
        console.error('Invalid course ID:', courseId)
        alert('Fehler: Ungültige Kurs-ID')
        return
      }

      const { data: { user }, error: authError } = await supabase.auth.getUser()
      
      // Only redirect to signup if user is NOT authenticated
      if (authError || !user) {
        console.log('User not authenticated, redirecting to signup')
        window.location.href = '/student/signup'
        return
      }

      // User is authenticated, proceed with save
      setSavingCourses(prev => new Set(prev).add(courseIdNum))

      const { data: student, error: studentError } = await supabase
        .from('students')
        .select('id')
        .eq('auth_user_id', user.id)
        .maybeSingle()

      // If student profile doesn't exist, show error but don't redirect (user is logged in)
      if (studentError) {
        console.error('Error fetching student profile:', studentError)
        alert('Fehler beim Laden Ihres Profils. Bitte versuchen Sie es erneut oder kontaktieren Sie den Support.')
        setSavingCourses(prev => {
          const newSet = new Set(prev)
          newSet.delete(courseIdNum)
          return newSet
        })
        return
      }

      if (!student) {
        console.error('Student profile not found for authenticated user:', user.id)
        alert('Ihr Studentenprofil wurde nicht gefunden. Bitte vervollständigen Sie Ihr Profil.')
        setSavingCourses(prev => {
          const newSet = new Set(prev)
          newSet.delete(courseIdNum)
          return newSet
        })
        return
      }

      const isSaved = savedCourses.has(courseIdNum)
      const method = isSaved ? 'DELETE' : 'POST'

      console.log('Saving course:', { courseId: courseIdNum, method, isSaved })

      const response = await fetch('/api/student/saved-courses', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ courseId: courseIdNum }),
      })

      const responseData = await response.json()

      if (response.ok) {
        if (isSaved) {
          setSavedCourses(prev => {
            const newSet = new Set(prev)
            newSet.delete(courseIdNum)
            return newSet
          })
          console.log('Course unsaved successfully')
        } else {
          setSavedCourses(prev => new Set(prev).add(courseIdNum))
          console.log('Course saved successfully')
        }
      } else {
        console.error('Save failed:', responseData)
        alert(responseData.error || 'Fehler beim Speichern des Kurses')
      }
    } catch (error) {
      console.error('Error toggling save:', error)
      alert('Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.')
    } finally {
      setSavingCourses(prev => {
        const newSet = new Set(prev)
        newSet.delete(typeof courseId === 'string' ? parseInt(courseId, 10) : courseId)
        return newSet
      })
    }
  }

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

    if (selectedProvider) {
      filtered = filtered.filter(course => {
        const provider = Array.isArray(course.providers) ? course.providers[0] : course.providers
        const providerName = provider?.company_name || provider?.name || course.provider
        return providerName === selectedProvider
      })
    }

    // Language filter
    if (selectedLanguage) {
      filtered = filtered.filter(course => course.language === selectedLanguage)
    }

    // Category filter
    if (selectedCategory) {
      filtered = filtered.filter(course => course.category === selectedCategory)
    }

    // Format filter
    if (selectedFormat) {
      filtered = filtered.filter(course => course.format === selectedFormat)
    }

    // Duration filter with smart ranges
    if (selectedDuration) {
      filtered = filtered.filter(course => {
        const durationText = course.duration?.toLowerCase() || ''
        if (selectedDuration === 'short') {
          // Bis 1 Monat - Wochen or short months
          return durationText.includes('woche') || 
                 durationText.match(/1\s*monat/) ||
                 durationText.match(/2\s*monat/) ||
                 durationText.match(/3\s*monat/) ||
                 durationText.match(/4\s*wochen/) ||
                 durationText.match(/8\s*wochen/) ||
                 durationText.match(/12\s*wochen/)
        } else if (selectedDuration === 'medium') {
          // 1-3 Monate
          return durationText.match(/[1-3]\s*monat/) ||
                 durationText.match(/8\s*wochen/) ||
                 durationText.match(/10\s*wochen/) ||
                 durationText.match(/12\s*wochen/) ||
                 durationText.match(/16\s*wochen/)
        } else if (selectedDuration === 'long') {
          // 3-6 Monate
          return durationText.match(/[3-6]\s*monat/) ||
                 durationText.match(/20\s*wochen/) ||
                 durationText.match(/24\s*wochen/)
        } else if (selectedDuration === 'very_long') {
          // 6+ Monate
          return durationText.match(/[6-9]\s*monat/) ||
                 durationText.match(/1[0-9]\s*monat/) ||
                 durationText.match(/2[0-9]\s*monat/) ||
                 durationText.match(/jahr/) ||
                 durationText.match(/year/)
        }
        return false
      })
    }

    // Funding options filter (check funding_types array)
    if (selectedFundingOption) {
      filtered = filtered.filter(course => {
        if (Array.isArray(course.funding_types)) {
          return course.funding_types.includes(selectedFundingOption)
        }
        // Fallback to funding_type column
        return course.funding_type === selectedFundingOption
      })
    }

    // Sorting
    if (sortBy === 'newest') {
      filtered.sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0))
    } else if (sortBy === 'oldest') {
      filtered.sort((a, b) => new Date(a.created_at || 0) - new Date(b.created_at || 0))
    } else if (sortBy === 'popular') {
      filtered.sort((a, b) => (b.view_count || 0) - (a.view_count || 0))
    } else if (sortBy === 'price_asc') {
      filtered.sort((a, b) => (a.price || 0) - (b.price || 0))
    } else if (sortBy === 'price_desc') {
      filtered.sort((a, b) => (b.price || 0) - (a.price || 0))
    } else if (sortBy === 'a-z') {
      filtered.sort((a, b) => (a.title || '').localeCompare(b.title || ''))
    } else if (sortBy === 'z-a') {
      filtered.sort((a, b) => (b.title || '').localeCompare(a.title || ''))
    }

    setFilteredCourses(filtered)
  }, [searchTerm, selectedLocation, selectedProvider, selectedLanguage, selectedCategory, selectedFormat, selectedDuration, selectedFundingOption, sortBy, allCourses])

  const resetFilters = () => {
    setSearchTerm('')
    setSelectedLocation('')
    setSelectedProvider('')
    setSelectedLanguage('')
    setSelectedCategory('')
    setSelectedFormat('')
    setSelectedDuration('')
    setSelectedFundingOption('')
    setSortBy('newest')
  }

  // Helper function to get language icon/emoji
  const getLanguageIcon = (lang) => {
    if (!lang) return '🌐'
    const langLower = lang.toLowerCase()
    if (langLower.includes('deutsch') || langLower.includes('german')) return '🇩🇪'
    if (langLower.includes('english') || langLower.includes('englisch')) return '🇬🇧'
    if (langLower.includes('französisch') || langLower.includes('french')) return '🇫🇷'
    if (langLower.includes('spanisch') || langLower.includes('spanish')) return '🇪🇸'
    return '🌐'
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header - Fixed, Professional */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3">
              <Image 
                src="/Assets/kursfind-ai-logo.jpg"
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
      <section className="bg-white border-b border-gray-200 shadow-sm z-40">
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
              className="px-4 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-cyan-500 min-w-[180px]"
            >
              <option value="newest">Neueste zuerst</option>
              <option value="oldest">Älteste zuerst</option>
              <option value="popular">Beliebteste</option>
              <option value="price_asc">Preis: Niedrig → Hoch</option>
              <option value="price_desc">Preis: Hoch → Niedrig</option>
              <option value="a-z">A → Z</option>
              <option value="z-a">Z → A</option>
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
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-cyan-500 min-w-[180px]"
            >
              <option value="">Alle Kategorien</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>

            {/* Format Filter */}
            <select
              value={selectedFormat}
              onChange={(e) => setSelectedFormat(e.target.value)}
              className="px-4 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-cyan-500 min-w-[140px]"
            >
              <option value="">Alle Formate</option>
              {formats.map(format => (
                <option key={format} value={format}>{format}</option>
              ))}
            </select>

            {/* Language Filter */}
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="px-4 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-cyan-500 min-w-[160px]"
            >
              <option value="">Alle Sprachen</option>
              {languages.map(lang => (
                <option key={lang} value={lang}>
                  {getLanguageIcon(lang)} {lang}
                </option>
              ))}
            </select>

            {/* Duration Filter */}
            <select
              value={selectedDuration}
              onChange={(e) => setSelectedDuration(e.target.value)}
              className="px-4 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-cyan-500 min-w-[160px]"
            >
              <option value="">Alle Dauern</option>
              <option value="short">Bis 1 Monat</option>
              <option value="medium">1-3 Monate</option>
              <option value="long">3-6 Monate</option>
              <option value="very_long">6+ Monate</option>
            </select>

            {/* Funding Options Filter */}
            <select
              value={selectedFundingOption}
              onChange={(e) => setSelectedFundingOption(e.target.value)}
              className="px-4 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-cyan-500 min-w-[200px]"
            >
              <option value="">Alle Finanzierungsoptionen</option>
              {fundingTypes.map(funding => (
                <option key={funding} value={funding}>{funding}</option>
              ))}
            </select>
          </div>

          {/* Active Filter Chips */}
          {(selectedLocation || selectedProvider || selectedLanguage || selectedCategory || selectedFormat || selectedDuration || selectedFundingOption) && (
            <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-gray-200">
              <span className="text-sm text-gray-600 font-medium">Aktive Filter:</span>
              
              {selectedLocation && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-cyan-50 text-cyan-700 rounded-full text-sm font-medium border border-cyan-200">
                  📍 {selectedLocation}
                  <button
                    onClick={() => setSelectedLocation('')}
                    className="ml-1 hover:text-cyan-900"
                    aria-label="Filter entfernen"
                  >
                    ×
                  </button>
                </span>
              )}
              
              {selectedProvider && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-cyan-50 text-cyan-700 rounded-full text-sm font-medium border border-cyan-200">
                  🏢 {selectedProvider}
                  <button
                    onClick={() => setSelectedProvider('')}
                    className="ml-1 hover:text-cyan-900"
                    aria-label="Filter entfernen"
                  >
                    ×
                  </button>
                </span>
              )}
              
              {selectedLanguage && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-cyan-50 text-cyan-700 rounded-full text-sm font-medium border border-cyan-200">
                  {getLanguageIcon(selectedLanguage)} {selectedLanguage}
                  <button
                    onClick={() => setSelectedLanguage('')}
                    className="ml-1 hover:text-cyan-900"
                    aria-label="Filter entfernen"
                  >
                    ×
                  </button>
                </span>
              )}
              
              {selectedCategory && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-cyan-50 text-cyan-700 rounded-full text-sm font-medium border border-cyan-200">
                  📚 {selectedCategory}
                  <button
                    onClick={() => setSelectedCategory('')}
                    className="ml-1 hover:text-cyan-900"
                    aria-label="Filter entfernen"
                  >
                    ×
                  </button>
                </span>
              )}
              
              {selectedFormat && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-cyan-50 text-cyan-700 rounded-full text-sm font-medium border border-cyan-200">
                  💻 {selectedFormat}
                  <button
                    onClick={() => setSelectedFormat('')}
                    className="ml-1 hover:text-cyan-900"
                    aria-label="Filter entfernen"
                  >
                    ×
                  </button>
                </span>
              )}
              
              {selectedDuration && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-cyan-50 text-cyan-700 rounded-full text-sm font-medium border border-cyan-200">
                  ⏱️ {selectedDuration === 'short' ? 'Bis 1 Monat' : selectedDuration === 'medium' ? '1-3 Monate' : selectedDuration === 'long' ? '3-6 Monate' : '6+ Monate'}
                  <button
                    onClick={() => setSelectedDuration('')}
                    className="ml-1 hover:text-cyan-900"
                    aria-label="Filter entfernen"
                  >
                    ×
                  </button>
                </span>
              )}
              
              {selectedFundingOption && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-cyan-50 text-cyan-700 rounded-full text-sm font-medium border border-cyan-200">
                  💳 {selectedFundingOption}
                  <button
                    onClick={() => setSelectedFundingOption('')}
                    className="ml-1 hover:text-cyan-900"
                    aria-label="Filter entfernen"
                  >
                    ×
                  </button>
                </span>
              )}
            </div>
          )}
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
                    
                    {/* Course Image with Fallback to Provider Logo */}
                    {(() => {
                      // Handle providers as array or object
                      const provider = Array.isArray(course.providers) ? course.providers[0] : course.providers
                      const providerLogo = provider?.logo_url
                      
                      // Get course image with fallback to provider logo
                      const getCourseImage = () => {
                        // Check if course.image_url exists and is not empty
                        if (course.image_url && course.image_url.trim() !== '') {
                          return course.image_url
                        }
                        // Fallback to provider logo
                        if (providerLogo && providerLogo.trim() !== '') {
                          return providerLogo
                        }
                        return null
                      }
                      
                      const imageUrl = getCourseImage()
                      const providerName = provider?.company_name || provider?.name || course.provider
                      
                      // Ensure course.id is a number for comparison
                      const courseIdNum = typeof course.id === 'string' ? parseInt(course.id, 10) : course.id
                      const isSaved = savedCourses.has(courseIdNum)
                      const isSaving = savingCourses.has(courseIdNum)
                      
                      return imageUrl ? (
                        <div className="w-full h-48 bg-gradient-to-br from-cyan-100 to-emerald-100 overflow-hidden relative">
                          <img 
                            src={imageUrl} 
                            alt={course.title}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              // If course image fails to load, try provider logo as fallback
                              const currentSrc = e.target.src
                              if (providerLogo && providerLogo.trim() !== '' && currentSrc !== providerLogo) {
                                e.target.src = providerLogo
                              } else {
                                // If provider logo also fails or doesn't exist, show placeholder
                                e.target.style.display = 'none'
                                const placeholder = document.createElement('div')
                                placeholder.className = 'w-full h-48 bg-gradient-to-br from-cyan-100 to-emerald-100 flex items-center justify-center absolute inset-0'
                                placeholder.innerHTML = `
                                  <svg class="w-16 h-16 text-cyan-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                  </svg>
                                `
                                e.target.parentElement.appendChild(placeholder)
                              }
                            }}
                          />
                          {/* Heart Icon - Desktop Only, Top Right */}
                          <button
                            onClick={(e) => toggleSaveCourse(courseIdNum, e)}
                            disabled={isSaving}
                            className={`hidden lg:flex absolute top-3 right-3 w-10 h-10 bg-white/95 backdrop-blur-sm rounded-full items-center justify-center shadow-lg transition-all duration-200 z-10 ${
                              isSaved 
                                ? 'text-red-500 hover:bg-red-50' 
                                : 'text-gray-400 hover:text-red-400 hover:bg-red-50'
                            } ${isSaving ? 'opacity-50 cursor-not-allowed' : 'hover:scale-110'}`}
                            title={isSaved ? 'Kurs entfernen' : 'Kurs speichern'}
                          >
                            {isSaving ? (
                              <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                            ) : (
                              <svg className={`w-5 h-5 ${isSaved ? 'fill-current' : ''}`} fill={isSaved ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                              </svg>
                            )}
                          </button>
                        </div>
                      ) : (
                        <div className="w-full h-48 bg-gradient-to-br from-cyan-100 to-emerald-100 flex items-center justify-center relative">
                          <svg className="w-16 h-16 text-cyan-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          {/* Heart Icon - Desktop Only, Top Right */}
                          <button
                            onClick={(e) => toggleSaveCourse(courseIdNum, e)}
                            disabled={isSaving}
                            className={`hidden lg:flex absolute top-3 right-3 w-10 h-10 bg-white/95 backdrop-blur-sm rounded-full items-center justify-center shadow-lg transition-all duration-200 z-10 ${
                              isSaved 
                                ? 'text-red-500 hover:bg-red-50' 
                                : 'text-gray-400 hover:text-red-400 hover:bg-red-50'
                            } ${isSaving ? 'opacity-50 cursor-not-allowed' : 'hover:scale-110'}`}
                            title={isSaved ? 'Kurs entfernen' : 'Kurs speichern'}
                          >
                            {isSaving ? (
                              <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                            ) : (
                              <svg className={`w-5 h-5 ${isSaved ? 'fill-current' : ''}`} fill={isSaved ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                              </svg>
                            )}
                          </button>
                        </div>
                      )
                    })()}
                    
                    <div className="p-6 flex flex-col flex-grow">
                      {/* Provider Logo + Name + Funding Badge */}
                      {(() => {
                        // Handle providers as array or object
                        const provider = Array.isArray(course.providers) ? course.providers[0] : course.providers
                        const providerName = provider?.company_name || provider?.name || course.provider
                        const providerLogo = provider?.logo_url
                        
                        return (
                          <div className="flex items-start justify-between mb-4 gap-3">
                            <div className="flex items-center gap-3 flex-1 min-w-0">
                              {/* Provider Logo - 2.5x larger for better brand awareness */}
                              {providerLogo ? (
                                <img 
                                  src={providerLogo} 
                                  alt={providerName || 'Provider Logo'}
                                  className="w-24 h-24 rounded-lg object-contain border border-gray-200 bg-white p-2 flex-shrink-0 shadow-sm"
                                />
                              ) : (
                                <div className="w-24 h-24 rounded-lg bg-gradient-to-r from-cyan-500 to-emerald-500 flex items-center justify-center flex-shrink-0 shadow-sm">
                                  <span className="text-white font-bold text-2xl">
                                    {(providerName || 'K')[0].toUpperCase()}
                                  </span>
                                </div>
                              )}
                              {/* Provider Name */}
                              <div className="flex-1 min-w-0">
                                <div className="text-base font-semibold text-gray-900 line-clamp-2 bg-gradient-to-r from-cyan-50 to-emerald-50 px-3 py-1.5 rounded-lg border border-cyan-200 lg:transition-all lg:cursor-default" title={providerName}>
                                  {providerName || 'Anbieter'}
                                </div>
                                {course.funding_type && (
                                  <div className="text-xs text-emerald-600 font-medium mt-1">
                                    {course.funding_type}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        )
                      })()}

                      {/* Course Title - Taller min-height */}
                      <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-cyan-600 transition-colors line-clamp-2 min-h-[3.5rem]">
                        {course.title}
                      </h3>

                      {/* Subtitle - Full text, 2-3 lines max */}
                      {course.subtitle && (
                        <p className="text-sm text-gray-600 mb-4 line-clamp-2 leading-relaxed">
                          {course.subtitle}
                        </p>
                      )}

                      {/* Badges (Language, Bestseller, etc.) */}
                      <div className="flex flex-wrap gap-2 mb-4">
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
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-blue-50 text-blue-700 text-xs font-semibold rounded-full border border-blue-200">
                              {getLanguageIcon(course.language)}
                              {course.language}
                            </span>
                          );
                        })()}
                        {/* Badges (Bestseller, Neu, etc.) - Max 3 */}
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
                          return badgesArray.length > 0 ? badgesArray.slice(0, 3).map((badge, idx) => (
                            <span 
                              key={idx}
                              className="inline-flex items-center gap-1 px-2.5 py-1 bg-yellow-50 text-yellow-700 text-xs font-semibold rounded-full border border-yellow-200"
                            >
                              {badge === 'Bestseller' && '⭐'}
                              {badge === 'Neu' && '🆕'}
                              {badge}
                            </span>
                          )) : null;
                        })()}
                      </div>

                      {/* Benefits - Max 3 badges */}
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

                      {/* Course Info Grid - Above Button (6 items: 3 left, 3 right) */}
                      <div className="grid grid-cols-2 gap-x-4 gap-y-2 mb-4 text-sm">
                        {/* Left Column */}
                        {course.location && (
                          <div className="flex items-center gap-2">
                            <svg className="w-4 h-4 text-cyan-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <span className="text-gray-700 font-semibold truncate">{course.location}</span>
                          </div>
                        )}
                        {course.duration && (
                          <div className="flex items-center gap-2">
                            <svg className="w-4 h-4 text-cyan-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="text-gray-700 font-semibold truncate">{course.duration}</span>
                          </div>
                        )}
                        {course.format && (
                          <div className="flex items-center gap-2">
                            <svg className="w-4 h-4 text-cyan-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                            <span className="text-gray-700 font-semibold truncate">{course.format}</span>
                          </div>
                        )}
                        
                        {/* Right Column */}
                        {course.duration_hours && (
                          <div className="flex items-center gap-2">
                            <svg className="w-4 h-4 text-cyan-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="text-gray-700 font-semibold truncate">{course.duration_hours}</span>
                          </div>
                        )}
                        {course.start_date && (
                          <div className="flex items-center gap-2">
                            <svg className="w-4 h-4 text-cyan-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span className="text-gray-700 font-semibold truncate">
                              {new Date(course.start_date).toLocaleDateString('de-DE', {
                                day: '2-digit',
                                month: '2-digit',
                                year: 'numeric'
                              })}
                            </span>
                          </div>
                        )}
                        {course.price && (
                          <div className="flex items-center gap-2">
                            <svg className="w-4 h-4 text-cyan-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="text-gray-700 font-semibold truncate">
                              {new Intl.NumberFormat('de-DE', { 
                                style: 'currency', 
                                currency: 'EUR',
                                maximumFractionDigits: 0
                              }).format(course.price)}
                            </span>
                          </div>
                        )}
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
