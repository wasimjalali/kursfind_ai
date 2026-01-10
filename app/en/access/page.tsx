'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'

function AccessGateContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectUrl = searchParams.get('redirect') || '/suchen'
  
  const [inviteCode, setInviteCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showWaitlist, setShowWaitlist] = useState(false)

  // Load SendPulse script when showing waitlist
  useEffect(() => {
    if (showWaitlist) {
      const existingScript = document.querySelector('script[src*="webformscr.com"]')
      if (!existingScript) {
        const script = document.createElement('script')
        script.src = 'https://web.webformscr.com/apps/fc3/build/default-handler.js?1758181175060'
        script.async = true
        document.body.appendChild(script)
      }
    }
  }, [showWaitlist])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    if (!inviteCode.trim()) {
      setError('Please enter an invite code')
      setLoading(false)
      return
    }

    try {
      const response = await fetch('/api/invite/access', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: inviteCode.trim() })
      })

      const result = await response.json()

      if (result.success) {
        router.push(redirectUrl)
        router.refresh()
      } else {
        setError('Invalid or expired invite code')
        setShowWaitlist(true)
      }
    } catch (err) {
      setError('An error occurred. Please try again.')
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-100 to-emerald-100">
      {/* Logo - Top Left */}
      <div className="pt-6 pl-6 pb-4">
        <Link href="/en" className="inline-flex items-center hover:opacity-90 transition-opacity cursor-pointer">
          <Image
            src="/landing/kursfind-ai-logo.jpg"
            alt="Kursfind AI"
            width={56}
            height={56}
            className="h-14 w-auto rounded-xl"
          />
          <span className="ml-3 text-2xl font-bold text-gray-900">Kursfind <span className="text-cyan-600">AI</span></span>
        </Link>
      </div>

      <div className="flex items-center justify-center px-4 pb-8">
        <div className="w-full max-w-md">
        
        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 overflow-hidden border border-gray-100">
          
          {/* Header - Subtle gradient, compact with lock beside text */}
          <div className="bg-gradient-to-r from-cyan-50 to-emerald-50 px-6 py-4 border-b border-gray-100">
            <div className="flex items-center justify-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-cyan-500 to-emerald-500 rounded-xl">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-800">Invite-Only Beta</h1>
                <p className="text-gray-500 text-xs">
                  Access by invitation only
                </p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            
            {!showWaitlist ? (
              <>
                {/* Invite Code Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Enter your invite code
                    </label>
                    <input
                      type="text"
                      value={inviteCode}
                      onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
                      placeholder="e.g. COURSE2026"
                      className="w-full px-4 py-3 text-base font-mono tracking-widest text-center border-2 border-gray-300 rounded-xl focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10 transition-all outline-none placeholder:text-gray-400 bg-gray-50 focus:bg-white text-gray-900"
                      autoFocus
                      autoComplete="off"
                    />
                  </div>

                  {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-lg text-sm">
                      {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 px-6 bg-gradient-to-r from-cyan-500 to-emerald-500 text-white font-bold rounded-xl hover:shadow-lg hover:shadow-cyan-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  >
                    {loading ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Verifying...
                      </span>
                    ) : (
                      'Get Access'
                    )}
                  </button>
                </form>

                {/* Divider */}
                <div className="relative my-5">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-3 bg-white text-gray-400 text-xs">or</span>
                  </div>
                </div>

                {/* Waitlist CTA */}
                <button
                  onClick={() => setShowWaitlist(true)}
                  className="w-full py-3 px-6 bg-gray-50 hover:bg-gray-100 text-gray-700 font-semibold rounded-xl border border-gray-200 hover:border-gray-300 transition-all cursor-pointer text-sm"
                >
                  Join the Waiting List
                </button>
              </>
            ) : (
              <>
                {/* Waitlist Header - Different design */}
                <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-100">
                  <div className="flex items-center justify-center w-10 h-10 bg-emerald-100 rounded-xl">
                    <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-gray-800">Join the Waiting List</h2>
                    <p className="text-gray-500 text-xs">
                      Get your invite code via email
                    </p>
                  </div>
                </div>

                {/* SendPulse Form - English */}
                <div className="sp-form-outer">
                  <div 
                    id="sp-form-250258" 
                    sp-id="250258" 
                    sp-hash="537c1fa762a47656fda2327f75f361030cd2c468a199d647c547e173020d80ec" 
                    sp-lang="en" 
                    className="sp-form sp-form-regular sp-form-embed"
                    sp-show-options='{"satellite":false,"maDomain":"login.sendpulse.com","formsDomain":"forms.sendpulse.com","condition":"onEnter","scrollTo":25,"delay":10,"repeat":3,"background":"rgba(0, 0, 0, 0.5)","position":"bottom-right","animation":"","hideOnMobile":false,"submitRedirectUrl":"","urlFilter":false,"urlFilterConditions":[{"force":"hide","clause":"contains","token":""}],"analytics":{"ga":{"eventLabel":"Subscription_form_Kursfind","send":false}},"utmEnable":true}'
                  >
                    <div className="sp-form-fields-wrapper">
                      <div className="sp-message"><div></div></div>
                      <form noValidate className="sp-element-container">
                        <div className="sp-field" sp-id="sp-130bbaa6-21cc-4994-b7f5-258477f400f4">
                          <label className="sp-control-label"><span>Email</span><strong>*</strong></label>
                          <input 
                            type="email" 
                            sp-type="email" 
                            name="sform[email]" 
                            className="sp-form-control" 
                            placeholder="your@email.com" 
                            sp-tips='{"required":"Required field"}' 
                            autoComplete="on" 
                            required 
                          />
                        </div>
                        <div className="sp-field" sp-id="sp-083f176c-c749-4fb8-966b-5fae7b8b29ac">
                          <label className="sp-control-label"><span>Name</span><strong>*</strong></label>
                          <input 
                            type="text" 
                            sp-type="input" 
                            name="sform[TmFtZQ==]" 
                            className="sp-form-control" 
                            placeholder="Your First Name" 
                            sp-tips='{"required":"Required field"}' 
                            autoComplete="on" 
                            required 
                          />
                        </div>
                        <div className="sp-field" sp-id="sp-cbd69eef-da18-400a-af3b-25d148ddcd19">
                          <div className="sp-checkbox-option">
                            <label>
                              <input 
                                type="checkbox" 
                                sp-type="checkbox" 
                                name="sform[Q291bnRyeQ==]" 
                                value="yes" 
                                sp-tips='{"required":"Required field"}' 
                                required 
                              />
                              <span>I confirm that I am currently living in Germany.</span>
                              <span><strong>*</strong></span>
                            </label>
                          </div>
                        </div>
                        <div className="sp-field" sp-id="sp-a6fe7b17-7a5a-4e81-829a-7b89f86044eb">
                          <div className="sp-checkbox-option">
                            <label>
                              <input 
                                type="checkbox" 
                                sp-type="checkbox" 
                                name="sform[Z2RwclRlcm1z]" 
                                value="yes" 
                                sp-tips='{"required":"Required field"}' 
                                required 
                              />
                              <span>I agree to receive information from Kursfind AI. I can unsubscribe anytime.</span>
                              <span><strong>*</strong></span>
                            </label>
                          </div>
                        </div>
                        <div className="sp-field sp-button-container" sp-id="sp-521c4e4a-0c51-4a3b-b947-39b14f5abb98">
                          <button 
                            id="sp-521c4e4a-0c51-4a3b-b947-39b14f5abb98" 
                            className="sp-button"
                          >
                            Join the Waiting List
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>

                {/* Back to invite code */}
                <button
                  onClick={() => setShowWaitlist(false)}
                  className="w-full mt-4 text-cyan-600 hover:text-cyan-700 font-medium text-sm cursor-pointer"
                >
                  ← I have an invite code
                </button>
              </>
            )}
          </div>
        </div>

        {/* Footer Links - Compact */}
        <div className="mt-4 text-center space-y-2">
          <p className="text-gray-700 text-xs">
            Education provider?{' '}
            <Link href="/en/providers" className="text-cyan-700 hover:text-cyan-800 font-medium cursor-pointer underline">
              Become a Partner
            </Link>
          </p>
          <p className="text-gray-600 text-xs">
            <Link href="/en/imprint" className="hover:text-gray-800 cursor-pointer underline">Imprint</Link>
            {' · '}
            <Link href="/en/privacy" className="hover:text-gray-800 cursor-pointer underline">Privacy Policy</Link>
          </p>
        </div>

        </div>
      </div>

        {/* SendPulse Styles */}
        <style jsx global>{`
        .sp-form[sp-id="250258"] { 
          display: block; 
          background: transparent !important; 
          padding: 0 !important; 
          width: 100%; 
          max-width: 100%; 
          border-radius: 0 !important; 
          border: none !important;
          box-shadow: none !important;
        }
        .sp-form[sp-id="250258"]:hover { 
          box-shadow: none !important; 
          transform: none !important;
        }
        .sp-form[sp-id="250258"] .sp-form-fields-wrapper { 
          margin: 0; 
          width: 100%; 
        }
        .sp-form[sp-id="250258"] .sp-form-control { 
          background: #f9fafb !important; 
          border-color: #d1d5db !important; 
          border-style: solid; 
          border-width: 2px; 
          font-size: 15px; 
          padding: 12px 14px; 
          border-radius: 10px; 
          height: auto; 
          width: 100%; 
          transition: all 0.2s ease; 
          font-family: inherit;
          color: #111827 !important;
        }
        .sp-form[sp-id="250258"] .sp-form-control::placeholder {
          color: #6b7280 !important;
          opacity: 1 !important;
        }
        .sp-form[sp-id="250258"] .sp-form-control:focus { 
          outline: none; 
          border-color: #06b6d4 !important; 
          background: #ffffff !important;
          box-shadow: 0 0 0 3px rgba(6, 182, 212, 0.1);
        }
        .sp-form[sp-id="250258"] .sp-field { 
          margin-bottom: 12px;
        }
        .sp-form[sp-id="250258"] .sp-field label.sp-control-label { 
          color: #374151; 
          font-size: 13px; 
          font-weight: 600; 
          margin-bottom: 6px; 
          display: block;
        }
        .sp-form[sp-id="250258"] .sp-checkbox-option label { 
          font-weight: 400; 
          font-size: 12px; 
          color: #6b7280; 
          line-height: 1.4;
          display: flex;
          align-items: flex-start;
          gap: 8px;
          cursor: pointer;
        }
        .sp-form[sp-id="250258"] .sp-checkbox-option input[type="checkbox"] {
          margin-top: 2px;
          flex-shrink: 0;
          cursor: pointer;
        }
        .sp-form[sp-id="250258"] .sp-button { 
          border-radius: 10px; 
          background: linear-gradient(135deg, #06b6d4 0%, #10b981 100%); 
          color: #ffffff; 
          width: 100%; 
          padding: 12px 20px; 
          font-weight: 700; 
          font-size: 14px; 
          font-family: inherit; 
          box-shadow: 0 4px 12px rgba(6, 182, 212, 0.3); 
          border: none; 
          cursor: pointer; 
          transition: all 0.2s ease;
        }
        .sp-form[sp-id="250258"] .sp-button:hover { 
          box-shadow: 0 6px 20px rgba(6, 182, 212, 0.4); 
          transform: translateY(-1px);
        }
        .sp-form[sp-id="250258"] .sp-button-container { 
          text-align: center; 
          margin-top: 16px;
        }
        .sp-form[sp-id="250258"] .sp-link-wrapper {
          display: none !important;
        }
      `}</style>
    </div>
  )
}

export default function AccessPageEN() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-cyan-500 border-t-transparent rounded-full"></div>
      </div>
    }>
      <AccessGateContent />
    </Suspense>
  )
}
