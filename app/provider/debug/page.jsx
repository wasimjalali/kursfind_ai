'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function DebugPage() {
  const [session, setSession] = useState(null);
  const [provider, setProvider] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    checkAuth();
  }, []);

  async function checkAuth() {
    try {
      // Check session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      console.log('Session:', session);
      setSession(session);

      if (sessionError) {
        setError('Session error: ' + sessionError.message);
        return;
      }

      if (!session) {
        setError('No active session found');
        return;
      }

      // Check provider profile
      const { data: providerData, error: providerError } = await supabase
        .from('providers')
        .select('*')
        .eq('auth_user_id', session.user.id);

      console.log('Provider query result:', providerData);
      console.log('Provider error:', providerError);

      if (providerError) {
        setError('Provider error: ' + providerError.message);
        return;
      }

      setProvider(providerData?.[0] || null);

    } catch (err) {
      console.error('Debug error:', err);
      setError(err.message);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Debug Information</h1>

        {/* Session Info */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">Session Status</h2>
          {session ? (
            <div className="space-y-2">
              <p className="text-green-600 font-semibold">✅ Session Active</p>
              <p><strong>User ID:</strong> {session.user.id}</p>
              <p><strong>Email:</strong> {session.user.email}</p>
              <p><strong>Email Confirmed:</strong> {session.user.email_confirmed_at ? '✅ Yes' : '❌ No'}</p>
            </div>
          ) : (
            <p className="text-red-600">❌ No active session</p>
          )}
        </div>

        {/* Provider Info */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">Provider Profile</h2>
          {provider ? (
            <div className="space-y-2">
              <p className="text-green-600 font-semibold">✅ Provider Profile Found</p>
              <p><strong>ID:</strong> {provider.id}</p>
              <p><strong>Company:</strong> {provider.company_name}</p>
              <p><strong>Contact:</strong> {provider.contact_name}</p>
              <p><strong>Email:</strong> {provider.email}</p>
              <p><strong>Auth User ID:</strong> {provider.auth_user_id}</p>
            </div>
          ) : session ? (
            <p className="text-red-600">❌ No provider profile found for this user</p>
          ) : (
            <p className="text-gray-500">Login first to check provider profile</p>
          )}
        </div>

        {/* Error Info */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
            <h2 className="text-xl font-bold text-red-800 mb-2">Error</h2>
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {/* Actions */}
        <div className="space-y-4">
          <button
            onClick={checkAuth}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Refresh Status
          </button>

          {!provider && session && (
            <button
              onClick={async () => {
                try {
                  const { data, error } = await supabase
                    .from('providers')
                    .insert([{
                      auth_user_id: session.user.id,
                      email: session.user.email,
                      company_name: 'My Company',
                      contact_name: 'Your Name',
                      phone: '',
                    }])
                    .select();

                  if (error) {
                    alert('Error creating profile: ' + error.message);
                  } else {
                    alert('Provider profile created!');
                    checkAuth();
                  }
                } catch (err) {
                  alert('Error: ' + err.message);
                }
              }}
              className="ml-4 px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600"
            >
              Create Provider Profile
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
