'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function StudentLogin() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resetSent, setResetSent] = useState(false);
  const [showResetForm, setShowResetForm] = useState(false);
  const [showNoProfileError, setShowNoProfileError] = useState(false);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setShowNoProfileError(false);
    setLoading(true);

    try {
      // Check if Supabase is configured
      if (!supabase) {
        throw new Error('Supabase client ist nicht konfiguriert. Bitte kontaktieren Sie den Support.');
      }

      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (signInError) {
        console.error('Sign in error:', signInError);
        
        // Provide user-friendly error messages
        if (signInError.message?.includes('Invalid login credentials')) {
          throw new Error('E-Mail oder Passwort ungültig');
        } else if (signInError.message?.includes('Email not confirmed')) {
          throw new Error('Bitte bestätigen Sie zuerst Ihre E-Mail-Adresse');
        }
        
        throw signInError;
      }

      if (!data.user) {
        throw new Error('Login fehlgeschlagen. Bitte überprüfen Sie Ihre Anmeldedaten.');
      }

      // Verify student profile exists
      const { data: student, error: studentError } = await supabase
        .from('students')
        .select('id')
        .eq('auth_user_id', data.user.id)
        .single();

      console.log('Auth user ID:', data.user.id);
      console.log('Student profile:', student);
      console.log('Student error:', studentError);

      if (studentError) {
        console.error('Student profile error:', studentError);
        console.error('Error code:', studentError.code);
        console.error('Error message:', studentError.message);
        
        // If profile doesn't exist, show error - do NOT auto-create
        if (studentError.code === 'PGRST116') {
          // Sign out the user since they don't have a student profile
          await supabase.auth.signOut();
          throw new Error('NO_STUDENT_PROFILE');
        } else {
          throw new Error(`Fehler beim Abrufen des Profils: ${studentError.message || 'Unbekannter Fehler'}`);
        }
      }

      // Redirect to dashboard
      router.push('/student/dashboard');
      router.refresh();

    } catch (error) {
      console.error('Login error:', error);
      if (error.message === 'NO_STUDENT_PROFILE') {
        setShowNoProfileError(true);
        setError('');
      } else {
        setError(error.message || 'Login fehlgeschlagen');
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    setError('');
    setResetSent(false);
    setLoading(true);

    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(
        formData.email,
        {
          redirectTo: `${window.location.origin}/student/reset-password`,
        }
      );

      if (resetError) throw resetError;

      setResetSent(true);
      setTimeout(() => {
        setShowResetForm(false);
        setResetSent(false);
      }, 5000);

    } catch (error) {
      setError(error.message || 'Passwort zurücksetzen fehlgeschlagen');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-cyan-50/30 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <img 
              src="/Assets/kursfind-ai-logo.jpg" 
              alt="Kursfind AI" 
              className="w-20 h-20 mx-auto rounded-2xl shadow-lg mb-4"
            />
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Willkommen zurück
          </h1>
          <p className="text-gray-600">
            Melden Sie sich an, um fortzufahren
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg mb-6">
            ❌ {error}
          </div>
        )}

        {/* No Student Profile Error - Special handling */}
        {showNoProfileError && (
          <div className="bg-amber-50 border border-amber-200 text-amber-800 px-4 py-4 rounded-lg mb-6">
            <div className="flex items-start gap-3">
              <svg className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <div>
                <p className="font-semibold mb-2">Kein Studentenprofil gefunden</p>
                <p className="text-sm mb-3">
                  Für diese E-Mail-Adresse existiert kein Studentenkonto. 
                  Bitte registrieren Sie sich zuerst als Student.
                </p>
                <Link 
                  href="/student/signup" 
                  className="inline-block px-4 py-2 bg-amber-600 text-white text-sm font-semibold rounded-lg hover:bg-amber-700 transition-colors"
                >
                  Jetzt registrieren →
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Success Message for Password Reset */}
        {resetSent && (
          <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg mb-6">
            ✅ Passwort-Reset-Link wurde an Ihre E-Mail gesendet!
          </div>
        )}

        {/* Login Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
          {!showResetForm ? (
            <form onSubmit={handleSubmit} className="space-y-4">
            
              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  E-Mail
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-gray-900"
                  placeholder="ihre@email.de"
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Passwort
                </label>
                <input
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-gray-900"
                  placeholder="Ihr Passwort"
                />
              </div>

              {/* Forgot Password Link */}
              <div className="text-right">
                <button
                  type="button"
                  onClick={() => setShowResetForm(true)}
                  className="text-sm text-cyan-600 hover:text-cyan-700 font-semibold"
                >
                  Passwort vergessen?
                </button>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-cyan-500 to-emerald-500 text-white font-semibold rounded-lg hover:shadow-lg hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Anmeldung läuft...' : 'Anmelden'}
              </button>
            </form>
          ) : (
            /* Password Reset Form */
            <form onSubmit={handlePasswordReset} className="space-y-4">
              <div className="text-center mb-4">
                <h2 className="text-xl font-bold text-gray-900">Passwort zurücksetzen</h2>
                <p className="text-sm text-gray-600 mt-2">
                  Geben Sie Ihre E-Mail-Adresse ein und wir senden Ihnen einen Link zum Zurücksetzen Ihres Passworts.
                </p>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  E-Mail
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-gray-900"
                  placeholder="ihre@email.de"
                />
              </div>

              {/* Buttons */}
              <div className="space-y-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-gradient-to-r from-cyan-500 to-emerald-500 text-white font-semibold rounded-lg hover:shadow-lg hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Wird gesendet...' : 'Reset-Link senden'}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setShowResetForm(false);
                    setError('');
                  }}
                  className="w-full py-3 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Zurück zur Anmeldung
                </button>
              </div>
            </form>
          )}

          {/* Signup Link */}
          <div className="mt-6 text-center text-sm text-gray-600">
            Noch kein Konto?{' '}
            <Link href="/student/signup" className="text-cyan-600 hover:text-cyan-700 font-semibold">
              Jetzt registrieren
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
