'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function CookieTestPage() {
  const [cookies, setCookies] = useState('');
  const [session, setSession] = useState(null);

  useEffect(() => {
    checkCookies();
    checkSession();
  }, []);

  function checkCookies() {
    setCookies(document.cookie);
  }

  async function checkSession() {
    const { data: { session } } = await supabase.auth.getSession();
    setSession(session);
  }

  async function testLogin() {
    const email = prompt('Enter email:');
    const password = prompt('Enter password:');

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert('Error: ' + error.message);
    } else {
      alert('Login successful! Checking cookies...');
      setTimeout(() => {
        checkCookies();
        checkSession();
      }, 1000);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Cookie & Session Test</h1>

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">Session</h2>
          {session ? (
            <div className="text-green-600">
              <p>✅ Session exists</p>
              <p className="mt-2 text-sm text-gray-600">User: {session.user.email}</p>
            </div>
          ) : (
            <p className="text-red-600">❌ No session</p>
          )}
        </div>

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">Cookies</h2>
          {cookies ? (
            <pre className="text-xs bg-gray-100 p-4 rounded overflow-auto">
              {cookies.split(';').map((cookie, i) => (
                <div key={i} className="mb-1">{cookie.trim()}</div>
              ))}
            </pre>
          ) : (
            <p className="text-red-600">❌ No cookies found</p>
          )}
        </div>

        <div className="space-x-4">
          <button
            onClick={testLogin}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Test Login
          </button>
          <button
            onClick={() => {
              checkCookies();
              checkSession();
            }}
            className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600"
          >
            Refresh
          </button>
          <button
            onClick={async () => {
              await supabase.auth.signOut();
              alert('Logged out');
              checkCookies();
              checkSession();
            }}
            className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
