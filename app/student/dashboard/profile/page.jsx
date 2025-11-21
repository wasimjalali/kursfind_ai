import { createClient } from '@/lib/supabase-server';
import Link from 'next/link';

export default async function StudentProfilePage() {
  const supabase = await createClient();
  
  // Get current user
  const { data: { user } } = await supabase.auth.getUser();
  
  // Get student profile or use mock data
  let student = null;
  
  if (user) {
    const { data: studentData } = await supabase
      .from('students')
      .select('*')
      .eq('auth_user_id', user.id)
      .single();
    student = studentData;
  }
  
  // Use mock student data if no real student found
  if (!student) {
    student = {
      id: 1,
      email: 'demo@student.de',
      first_name: 'Demo',
      last_name: 'Student',
      phone: '+49 123 456789',
    };
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Profil Einstellungen ⚙️
        </h1>
        <p className="text-gray-600 mt-2">
          Verwalten Sie Ihre persönlichen Informationen
        </p>
      </div>

      {/* Profile Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <div className="flex items-start gap-6 mb-8">
          {/* Avatar */}
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-cyan-500 to-emerald-500 flex items-center justify-center text-white text-3xl font-bold flex-shrink-0">
            {student.first_name?.[0]}{student.last_name?.[0]}
          </div>

          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900 mb-1">
              {student.first_name} {student.last_name}
            </h2>
            <p className="text-gray-600 mb-4">{student.email}</p>
            <button className="px-4 py-2 bg-cyan-100 text-cyan-700 font-semibold rounded-lg hover:bg-cyan-200 transition-colors">
              📸 Profilbild ändern
            </button>
          </div>
        </div>

        {/* Form */}
        <form className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* First Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Vorname
              </label>
              <input
                type="text"
                defaultValue={student.first_name || ''}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-gray-900"
                placeholder="Ihr Vorname"
              />
            </div>

            {/* Last Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Nachname
              </label>
              <input
                type="text"
                defaultValue={student.last_name || ''}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-gray-900"
                placeholder="Ihr Nachname"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              E-Mail
            </label>
            <input
              type="email"
              defaultValue={student.email || ''}
              disabled
              className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed"
            />
            <p className="text-xs text-gray-500 mt-1">
              E-Mail kann nicht geändert werden
            </p>
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Telefonnummer
            </label>
            <input
              type="tel"
              defaultValue={student.phone || ''}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-gray-900"
              placeholder="+49 123 456789"
            />
          </div>

          {/* Save Button */}
          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-emerald-500 text-white font-semibold rounded-lg hover:shadow-lg transition-shadow"
            >
              💾 Änderungen speichern
            </button>
            <button
              type="button"
              className="px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition-colors"
            >
              Abbrechen
            </button>
          </div>
        </form>
      </div>

      {/* Account Actions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <h3 className="text-xl font-bold text-gray-900 mb-6">
          Konto-Aktionen
        </h3>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div>
              <h4 className="font-semibold text-gray-900 mb-1">Passwort ändern</h4>
              <p className="text-sm text-gray-600">Aktualisieren Sie Ihr Passwort</p>
            </div>
            <Link
              href="/student/reset-password"
              className="px-4 py-2 bg-cyan-100 text-cyan-700 font-semibold rounded-lg hover:bg-cyan-200 transition-colors"
            >
              Ändern
            </Link>
          </div>

          <div className="flex items-center justify-between p-4 border border-red-200 rounded-lg">
            <div>
              <h4 className="font-semibold text-red-900 mb-1">Konto löschen</h4>
              <p className="text-sm text-red-600">Alle Ihre Daten werden dauerhaft gelöscht</p>
            </div>
            <button className="px-4 py-2 bg-red-100 text-red-700 font-semibold rounded-lg hover:bg-red-200 transition-colors">
              Löschen
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
