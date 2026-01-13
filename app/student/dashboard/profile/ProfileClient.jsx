'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';
import { useStudentLanguage } from '../StudentDashboardClient';

export default function ProfileClient({ initialStudent, authUserId }) {
  const router = useRouter();
  const fileInputRef = useRef(null);
  const { labels, lang } = useStudentLanguage();
  
  const [student, setStudent] = useState(initialStudent);
  const [formData, setFormData] = useState({
    first_name: student.first_name || '',
    last_name: student.last_name || '',
    phone: student.phone || ''
  });
  
  const [loading, setLoading] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState('');

  // Handle logout
  const handleLogout = async () => {
    try {
      setLoading(true);
      console.log('🔓 Logging out student...');
      
      // Sign out from Supabase
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('❌ Logout error:', error);
        throw error;
      }
      
      console.log('✅ Logout successful');
      
      // Clear any local storage
      if (typeof window !== 'undefined') {
        localStorage.removeItem('supabase.auth.token');
        sessionStorage.clear();
      }
      
      // Wait a moment to ensure session is cleared
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Use window.location for a clean redirect that clears all state
      console.log('🔄 Redirecting to homepage...');
      window.location.href = '/';
    } catch (error) {
      console.error('❌ Logout error:', error);
      setMessage({ 
        type: 'error', 
        text: error.message || 'Fehler beim Abmelden' 
      });
      setLoading(false);
    }
  };

  // Handle form input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Handle profile update
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      // Validate
      if (!formData.first_name.trim() || !formData.last_name.trim()) {
        throw new Error('Vorname und Nachname sind erforderlich');
      }

      const response = await fetch('/api/student/update-profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Fehler beim Aktualisieren');
      }

      setStudent(data.student);
      setMessage({ 
        type: 'success', 
        text: '✅ Profil erfolgreich aktualisiert!' 
      });

      // Refresh the page to show updated data
      router.refresh();

    } catch (error) {
      console.error('Update error:', error);
      setMessage({ 
        type: 'error', 
        text: error.message || 'Fehler beim Aktualisieren' 
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle avatar upload
  const handleAvatarUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setMessage({ 
        type: 'error', 
        text: 'Bitte wählen Sie eine Bilddatei aus' 
      });
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setMessage({ 
        type: 'error', 
        text: 'Datei zu groß. Maximale Größe: 5MB' 
      });
      return;
    }

    setUploadingAvatar(true);
    setMessage({ type: '', text: '' });

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/student/upload-avatar', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Fehler beim Hochladen');
      }

      setStudent({ ...student, avatar_url: data.avatar_url });
      setMessage({ 
        type: 'success', 
        text: '✅ Profilbild erfolgreich hochgeladen!' 
      });

      // Refresh the page
      router.refresh();

    } catch (error) {
      console.error('Upload error:', error);
      setMessage({ 
        type: 'error', 
        text: error.message || 'Fehler beim Hochladen' 
      });
    } finally {
      setUploadingAvatar(false);
    }
  };

  // Handle account deletion
  const handleDeleteAccount = async () => {
    if (deleteConfirmation !== 'DELETE') {
      setMessage({ 
        type: 'error', 
        text: 'Bitte geben Sie "DELETE" ein, um zu bestätigen' 
      });
      return;
    }

    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await fetch('/api/student/delete-account', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          confirmation: deleteConfirmation
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Fehler beim Löschen');
      }

      // Redirect to home page after successful deletion
      router.push('/?deleted=true');

    } catch (error) {
      console.error('Delete error:', error);
      setMessage({ 
        type: 'error', 
        text: error.message || 'Fehler beim Löschen des Kontos' 
      });
      setLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          {labels?.profile?.title || 'Profil Einstellungen'} ⚙️
        </h1>
        <p className="text-gray-600 mt-2">
          {labels?.profile?.subtitle || 'Verwalten Sie Ihre persönlichen Informationen'}
        </p>
      </div>

      {/* Success/Error Message */}
      {message.text && (
        <div className={`p-4 rounded-lg ${
          message.type === 'success' 
            ? 'bg-green-50 text-green-800 border border-green-200' 
            : 'bg-red-50 text-red-800 border border-red-200'
        }`}>
          {message.text}
        </div>
      )}

      {/* Profile Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <div className="flex items-start gap-6 mb-8">
          {/* Avatar */}
          <div className="relative">
            {student.avatar_url ? (
              <Image
                src={student.avatar_url}
                alt="Profilbild"
                width={96}
                height={96}
                className="w-24 h-24 rounded-full object-cover"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-cyan-500 to-emerald-500 flex items-center justify-center text-white text-3xl font-bold flex-shrink-0">
                {student.first_name?.[0]}{student.last_name?.[0]}
              </div>
            )}
            {uploadingAvatar && (
              <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
              </div>
            )}
          </div>

          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900 mb-1">
              {student.first_name} {student.last_name}
            </h2>
            <p className="text-gray-600 mb-4">{student.email}</p>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleAvatarUpload}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploadingAvatar}
              className="px-4 py-2 bg-cyan-100 text-cyan-700 font-semibold rounded-lg hover:bg-cyan-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {uploadingAvatar ? '⏳ Hochladen...' : '📸 Profilbild ändern'}
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* First Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                {labels?.profile?.firstName || 'Vorname'} <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-gray-900"
                placeholder={lang === 'de' ? 'Ihr Vorname' : 'Your first name'}
              />
            </div>

            {/* Last Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                {labels?.profile?.lastName || 'Nachname'} <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-gray-900"
                placeholder={lang === 'de' ? 'Ihr Nachname' : 'Your last name'}
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              {labels?.profile?.email || 'E-Mail'}
            </label>
            <input
              type="email"
              value={student.email || ''}
              disabled
              className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed"
            />
            <p className="text-xs text-gray-500 mt-1">
              {labels?.profile?.emailNote || 'E-Mail kann nicht geändert werden'}
            </p>
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              {labels?.profile?.phone || 'Telefonnummer'}
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-gray-900"
              placeholder="+49 123 456789"
            />
          </div>

          {/* Save Button */}
          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-emerald-500 text-white font-semibold rounded-lg hover:shadow-lg transition-shadow disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (lang === 'de' ? '⏳ Speichern...' : '⏳ Saving...') : `💾 ${labels?.profile?.saveChanges || 'Änderungen speichern'}`}
            </button>
            <button
              type="button"
              onClick={() => {
                setFormData({
                  first_name: student.first_name || '',
                  last_name: student.last_name || '',
                  phone: student.phone || ''
                });
                setMessage({ type: '', text: '' });
              }}
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
          {labels?.profile?.accountActions || 'Konto-Aktionen'}
        </h3>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div>
              <h4 className="font-semibold text-gray-900 mb-1">{labels?.profile?.logout || 'Abmelden'}</h4>
              <p className="text-sm text-gray-600">{labels?.profile?.logoutDesc || 'Von Ihrem Konto abmelden'}</p>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition-colors"
            >
              {labels?.profile?.logout || 'Abmelden'}
            </button>
          </div>

          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div>
              <h4 className="font-semibold text-gray-900 mb-1">{labels?.profile?.changePassword || 'Passwort ändern'}</h4>
              <p className="text-sm text-gray-600">{labels?.profile?.changePasswordDesc || 'Aktualisieren Sie Ihr Passwort'}</p>
            </div>
            <Link
              href="/student/reset-password"
              className="px-4 py-2 bg-cyan-100 text-cyan-700 font-semibold rounded-lg hover:bg-cyan-200 transition-colors"
            >
              {labels?.profile?.change || 'Ändern'}
            </Link>
          </div>

          <div className="flex items-center justify-between p-4 border border-red-200 rounded-lg">
            <div>
              <h4 className="font-semibold text-red-900 mb-1">{labels?.profile?.deleteAccount || 'Konto löschen'}</h4>
              <p className="text-sm text-red-600">{labels?.profile?.deleteAccountDesc || 'Alle Ihre Daten werden dauerhaft gelöscht'}</p>
            </div>
            <button
              onClick={() => setShowDeleteModal(true)}
              className="px-4 py-2 bg-red-100 text-red-700 font-semibold rounded-lg hover:bg-red-200 transition-colors"
            >
              {labels?.profile?.deleteButton || 'Löschen'}
            </button>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                {lang === 'de' ? 'Konto löschen?' : 'Delete Account?'}
              </h3>
              <p className="text-gray-600 mb-4">
                {lang === 'de' ? 'Diese Aktion kann nicht rückgängig gemacht werden. Alle Ihre Daten, gespeicherten Kurse und Bewerbungen werden dauerhaft gelöscht.' : 'This action cannot be undone. All your data, saved courses, and applications will be permanently deleted.'}
              </p>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                {lang === 'de' ? 'Geben Sie ' : 'Type '}<span className="text-red-600 font-mono">DELETE</span>{lang === 'de' ? ' ein, um zu bestätigen:' : ' to confirm:'}
              </label>
              <input
                type="text"
                value={deleteConfirmation}
                onChange={(e) => setDeleteConfirmation(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-gray-900"
                placeholder="DELETE"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeleteConfirmation('');
                  setMessage({ type: '', text: '' });
                }}
                disabled={loading}
                className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
              >
                Abbrechen
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={loading || deleteConfirmation !== 'DELETE'}
                className="flex-1 px-6 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? '⏳ Löschen...' : 'Endgültig löschen'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

