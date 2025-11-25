'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function ProviderLogin() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (error) {
        console.error('Login error:', error);
        throw error;
      }

      console.log('✅ Login successful:', data);
      console.log('User:', data.user?.email);
      console.log('Session:', data.session ? 'Active' : 'None');

      // Verify the provider exists in the database
      const { data: providerData, error: providerError } = await supabase
        .from('providers')
        .select('id, company_name')
        .eq('auth_user_id', data.user.id)
        .single();

      if (providerError || !providerData) {
        console.error('❌ Provider not found in database:', providerError);
        throw new Error('Kein Provider-Konto gefunden. Bitte kontaktieren Sie den Support.');
      }

      console.log('✅ Provider found:', providerData.company_name);

      // Wait for session to be fully established
      await new Promise(resolve => setTimeout(resolve, 800));

      // Use router.push instead of window.location for better Next.js integration
      console.log('🔄 Redirecting to dashboard...');
      router.push('/provider/dashboard');

    } catch (error) {
      console.error('Full error:', error);
      
      // Show specific error messages
      if (error.message?.includes('Email not confirmed')) {
        setError('Bitte bestätigen Sie zuerst Ihre E-Mail-Adresse');
      } else if (error.message?.includes('Invalid login credentials')) {
        setError('E-Mail oder Passwort ungültig');
      } else {
        setError(error.message || 'E-Mail oder Passwort ungültig');
      }
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
              src="/Assets/kursfind-ai-logo.jpg" 
              alt="Kursfind AI" 
              width={80} 
              height={80}
              className="mx-auto rounded-2xl shadow-lg mb-4"
            />
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Provider Login
          </h1>
          <p className="text-gray-600">
            Melden Sie sich bei Ihrem Anbieter-Konto an
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg mb-6">
            ❌ {error}
          </div>
        )}

        {/* Login Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
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
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-gray-900 placeholder:text-gray-400"
                placeholder="ihre@email.de"
              />
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-semibold text-gray-900">
                  Passwort
                </label>
                <Link href="/provider/forgot-password" className="text-sm text-cyan-600 hover:text-cyan-700 font-semibold">
                  Passwort vergessen?
                </Link>
              </div>
              <input
                type="password"
                required
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-gray-900 placeholder:text-gray-400"
                placeholder="Ihr Passwort"
              />
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

          {/* Info about invite-only access */}
          <div className="mt-6 text-center text-sm text-gray-600">
            Noch kein Konto?{' '}
            <Link href="/provider/signup" className="text-cyan-600 hover:text-cyan-700 font-semibold">
              Zugang beantragen
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
