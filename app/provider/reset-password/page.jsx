'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function ResetPassword() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isValidSession, setIsValidSession] = useState(false);

  useEffect(() => {
    // Handle the hash fragment from the email link
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const accessToken = hashParams.get('access_token');
    const refreshToken = hashParams.get('refresh_token');
    const type = hashParams.get('type');

    if (type === 'recovery' && accessToken) {
      // Set the session with the tokens from the URL
      supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken,
      }).then(({ data, error }) => {
        if (error) {
          setError('Ungültiger oder abgelaufener Reset-Link');
          setIsValidSession(false);
        } else {
          setIsValidSession(true);
        }
      });
    } else {
      // Check if user already has a valid session
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session) {
          setIsValidSession(true);
        } else {
          setError('Bitte verwenden Sie den Link aus Ihrer E-Mail');
          setIsValidSession(false);
        }
      });
    }

    // Also listen for auth state changes
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'PASSWORD_RECOVERY') {
        setIsValidSession(true);
        setError('');
      }
    });

    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validation
    if (password !== confirmPassword) {
      setError('Passwörter stimmen nicht überein');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('Passwort muss mindestens 6 Zeichen lang sein');
      setLoading(false);
      return;
    }

    try {
      const { error: updateError } = await supabase.auth.updateUser({
        password: password,
      });

      if (updateError) throw updateError;

      setSuccess(true);

      // Redirect to login after 3 seconds
      setTimeout(() => {
        router.push('/provider/login');
      }, 3000);

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
            <Image 
              src="/Assets/new-logo-kursfind.png" 
              alt="Kursfind AI" 
              width={80} 
              height={80}
              className="mx-auto rounded-2xl shadow-lg mb-4"
            />
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Neues Passwort festlegen
          </h1>
          <p className="text-gray-600">
            Geben Sie Ihr neues Passwort ein
          </p>
        </div>

        {/* Error Message */}
        {error && !isValidSession && (
          <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg mb-6">
            <div className="font-semibold mb-2">❌ {error}</div>
            <p className="text-sm">
              Bitte fordern Sie einen neuen Passwort-Reset-Link an.
            </p>
            <Link 
              href="/provider/forgot-password" 
              className="inline-block mt-3 text-sm font-semibold text-red-700 hover:text-red-800 underline"
            >
              Neuen Link anfordern →
            </Link>
          </div>
        )}

        {error && isValidSession && (
          <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg mb-6">
            ❌ {error}
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg mb-6">
            ✅ Passwort erfolgreich zurückgesetzt! Weiterleitung zur Anmeldung...
          </div>
        )}

        {/* Reset Password Form */}
        {!success && isValidSession && (
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* New Password */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Neues Passwort
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-gray-900"
                  placeholder="Mindestens 6 Zeichen"
                  minLength={6}
                />
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Passwort bestätigen
                </label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-gray-900"
                  placeholder="Passwort wiederholen"
                  minLength={6}
                />
              </div>

              {/* Password Requirements */}
              <div className="bg-cyan-50 border border-cyan-200 rounded-lg p-4">
                <p className="text-sm font-semibold text-cyan-900 mb-2">
                  Passwortanforderungen:
                </p>
                <ul className="text-xs text-cyan-800 space-y-1">
                  <li className="flex items-center">
                    <span className={password.length >= 6 ? 'text-green-600' : 'text-gray-400'}>
                      {password.length >= 6 ? '✓' : '○'}
                    </span>
                    <span className="ml-2">Mindestens 6 Zeichen</span>
                  </li>
                  <li className="flex items-center">
                    <span className={password && confirmPassword && password === confirmPassword ? 'text-green-600' : 'text-gray-400'}>
                      {password && confirmPassword && password === confirmPassword ? '✓' : '○'}
                    </span>
                    <span className="ml-2">Passwörter stimmen überein</span>
                  </li>
                </ul>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-cyan-500 to-emerald-500 text-white font-semibold rounded-lg hover:shadow-lg hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Passwort wird zurückgesetzt...' : 'Passwort zurücksetzen'}
              </button>
            </form>

            {/* Back to Login Link */}
            <div className="mt-6 text-center text-sm text-gray-600">
              <Link href="/provider/login" className="text-cyan-600 hover:text-cyan-700 font-semibold">
                ← Zurück zur Anmeldung
              </Link>
            </div>
          </div>
        )}

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
