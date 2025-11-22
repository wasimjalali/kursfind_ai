'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function ProviderSignup() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [debugInfo, setDebugInfo] = useState('');

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    companyName: '',
    contactName: '',
    phone: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setDebugInfo('');
    setLoading(true);

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwörter stimmen nicht überein');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Passwort muss mindestens 6 Zeichen lang sein');
      setLoading(false);
      return;
    }

    if (!formData.companyName.trim()) {
      setError('Firmenname ist erforderlich');
      setLoading(false);
      return;
    }

    if (!formData.contactName.trim()) {
      setError('Ansprechpartner ist erforderlich');
      setLoading(false);
      return;
    }

    try {
      console.log('🚀 Starting provider signup...');
      setDebugInfo('Schritt 1: Erstelle Benutzerkonto...');

      // 1. Sign up user with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
      });

      if (authError) {
        console.error('❌ Auth error:', authError);
        throw authError;
      }

      console.log('✅ Auth signup successful:', authData);

      // Check if user was created
      if (!authData.user) {
        throw new Error('Benutzer konnte nicht erstellt werden. Bitte versuchen Sie es erneut.');
      }

      console.log('✅ User created:', authData.user.id);

      // 2. Generate provider_id from company name (slug format)
      const providerId = formData.companyName
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');

      if (!providerId) {
        throw new Error('Ungültiger Firmenname. Bitte verwenden Sie nur Buchstaben und Zahlen.');
      }

      console.log('📝 Creating provider profile...');
      setDebugInfo('Schritt 2: Erstelle Provider-Profil...');

      // 3. Create provider profile via API route
      const profileResponse = await fetch('/api/provider/create-profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          auth_user_id: authData.user.id,
          email: formData.email,
          company_name: formData.companyName.trim(),
          contact_name: formData.contactName.trim(),
          phone: formData.phone.trim() || null,
          provider_id: providerId,
        }),
      });

      const profileResult = await profileResponse.json();

      console.log('📡 API Response:', {
        status: profileResponse.status,
        ok: profileResponse.ok,
        result: profileResult,
      });

      if (!profileResponse.ok) {
        // Extract error message
        const errorMsg = profileResult.error || 'Fehler beim Erstellen des Provider-Profils';
        console.error('❌ Profile creation failed:', errorMsg);
        throw new Error(errorMsg);
      }

      console.log('✅ Provider profile created:', profileResult);

      // 4. Check if email confirmation is required
      if (authData.user && !authData.session) {
        setSuccess(true);
        setError(''); // Clear any previous errors
        setDebugInfo('');
        setLoading(false);
        // Show success message about email confirmation
        setTimeout(() => {
          setError('Registrierung erfolgreich! Bitte bestätigen Sie Ihre E-Mail-Adresse. Wir haben Ihnen einen Bestätigungslink gesendet. Nach der Bestätigung können Sie sich anmelden.');
        }, 100);
        return;
      }

      // 5. Success - redirect to dashboard
      setSuccess(true);
      setError('');
      setDebugInfo('');
      setLoading(false);
      
      console.log('✅ Signup complete! Redirecting to dashboard...');
      
      // Redirect to dashboard after 2 seconds
      setTimeout(() => {
        window.location.href = '/provider/dashboard';
      }, 2000);

    } catch (error) {
      console.error('❌ Signup error:', error);
      setLoading(false);
      setDebugInfo('');
      
      // More specific error messages
      let errorMessage = 'Registrierung fehlgeschlagen';
      
      if (error.message) {
        errorMessage = error.message;
      } else if (error.code === '23505') {
        errorMessage = 'Diese E-Mail-Adresse ist bereits registriert';
      } else if (error.code === '23503') {
        errorMessage = 'Datenbankfehler: Ungültige Referenz';
      } else if (error.message?.includes('duplicate key')) {
        errorMessage = 'Diese E-Mail-Adresse ist bereits registriert';
      } else if (error.message?.includes('violates foreign key')) {
        errorMessage = 'Datenbankfehler: Ungültige Referenz';
      } else if (error.message?.includes('row-level security') || error.message?.includes('RLS')) {
        errorMessage = 'Berechtigungsfehler: Die Registrierung konnte nicht abgeschlossen werden. Bitte kontaktieren Sie den Support.';
      }
      
      setError(errorMessage);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-cyan-50/30 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <Image 
              src="/Assets/kursfind-orginal-logo.png" 
              alt="Kursfind AI" 
              width={80} 
              height={80}
              className="mx-auto rounded-2xl shadow-lg mb-4"
            />
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Provider Registrierung
          </h1>
          <p className="text-gray-600">
            Erstellen Sie Ihr Anbieter-Konto bei Kursfind AI
          </p>
        </div>

        {/* Success Message */}
        {success && !error && (
          <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg mb-6">
            ✅ Registrierung erfolgreich! Sie werden weitergeleitet...
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg mb-6">
            ❌ {error}
          </div>
        )}

        {/* Debug Info */}
        {debugInfo && (
          <div className="bg-blue-50 border border-blue-200 text-blue-800 px-4 py-3 rounded-lg mb-6 text-sm">
            ℹ️ {debugInfo}
          </div>
        )}

        {/* Signup Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Company Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Firmenname *
              </label>
              <input
                type="text"
                required
                value={formData.companyName}
                onChange={(e) => setFormData({...formData, companyName: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-gray-900 placeholder:text-gray-400"
                placeholder="z.B. Bildungszentrum Berlin GmbH"
                disabled={loading}
              />
            </div>

            {/* Contact Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Ansprechpartner *
              </label>
              <input
                type="text"
                required
                value={formData.contactName}
                onChange={(e) => setFormData({...formData, contactName: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-gray-900 placeholder:text-gray-400"
                placeholder="Ihr Name"
                disabled={loading}
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                E-Mail *
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-gray-900 placeholder:text-gray-400"
                placeholder="ihre@email.de"
                disabled={loading}
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Telefon
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-gray-900 placeholder:text-gray-400"
                placeholder="+49 123 456789"
                disabled={loading}
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Passwort *
              </label>
              <input
                type="password"
                required
                minLength={6}
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-gray-900 placeholder:text-gray-400"
                placeholder="Mindestens 6 Zeichen"
                disabled={loading}
              />
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Passwort bestätigen *
              </label>
              <input
                type="password"
                required
                minLength={6}
                value={formData.confirmPassword}
                onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-gray-900 placeholder:text-gray-400"
                placeholder="Passwort wiederholen"
                disabled={loading}
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-cyan-500 to-emerald-500 text-white font-semibold rounded-lg hover:shadow-lg hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Registrierung läuft...' : 'Jetzt registrieren'}
            </button>
          </form>

          {/* Login Link */}
          <div className="mt-6 text-center text-sm text-gray-600">
            Bereits registriert?{' '}
            <Link href="/provider/login" className="text-cyan-600 hover:text-cyan-700 font-semibold">
              Hier anmelden
            </Link>
          </div>
        </div>

        {/* Back to Home */}
        <div className="mt-6 text-center">
          <Link href="/" className="text-sm text-gray-600 hover:text-gray-900">
            ← Zurück zur Startseite
          </Link>
        </div>
      </div>
    </div>
  );
}
