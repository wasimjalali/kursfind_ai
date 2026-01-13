'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { getPortalLabels } from '@/lib/portal-labels';

export default function ProfileForm({ initialData, labels: propLabels }) {
  const router = useRouter();
  // Use passed labels or fallback to German
  const labels = propLabels || getPortalLabels('de');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [activeTab, setActiveTab] = useState('basic');
  const [formData, setFormData] = useState({
    ...initialData,
    certifications: initialData.certifications || [],
    faq: initialData.faq || [],
  });
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(initialData.logo_url || '');
  const [logoUrlInput, setLogoUrlInput] = useState(initialData.logo_url || '');
  const [useLogoUrl, setUseLogoUrl] = useState(!!initialData.logo_url && !initialData.logo_url.includes('supabase'));

  // Common certification options
  const commonCertifications = ['AZAV', 'ISO 9001', 'TÜV', 'DIN EN ISO', 'Bfz', 'IHK', 'Handwerkskammer'];

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  }

  function handleLogoChange(e) {
    const file = e.target.files?.[0];
    if (file) {
      setLogoFile(file);
      setUseLogoUrl(false);
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  }

  function handleLogoUrlChange(e) {
    setLogoUrlInput(e.target.value);
    setUseLogoUrl(true);
    setLogoFile(null);
    if (e.target.value) {
      setLogoPreview(e.target.value);
    }
  }

  function handleCertificationAdd(cert) {
    if (cert && !formData.certifications.includes(cert)) {
      setFormData(prev => ({
        ...prev,
        certifications: [...prev.certifications, cert]
      }));
    }
  }

  function handleCertificationRemove(index) {
    setFormData(prev => ({
      ...prev,
      certifications: prev.certifications.filter((_, i) => i !== index)
    }));
  }

  function handleCustomCertificationAdd() {
    const input = document.getElementById('custom-certification');
    const value = input.value.trim();
    if (value && !formData.certifications.includes(value)) {
      setFormData(prev => ({
        ...prev,
        certifications: [...prev.certifications, value]
      }));
      input.value = '';
    }
  }

  function handleFaqAdd() {
    setFormData(prev => ({
      ...prev,
      faq: [...prev.faq, { question: '', answer: '' }]
    }));
  }

  function handleFaqRemove(index) {
    setFormData(prev => ({
      ...prev,
      faq: prev.faq.filter((_, i) => i !== index)
    }));
  }

  function handleFaqChange(index, field, value) {
    setFormData(prev => ({
      ...prev,
      faq: prev.faq.map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: '', text: '' });

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error(labels.profile.validation.notLoggedIn);
      }

      // Validation
      if (!formData.company_name?.trim()) {
        throw new Error(labels.profile.validation.companyNameRequired);
      }
      if (!formData.description?.trim()) {
        throw new Error(labels.profile.validation.descriptionRequired);
      }
      if (!formData.phone?.trim()) {
        throw new Error(labels.profile.validation.phoneRequired);
      }
      if (!formData.email?.trim()) {
        throw new Error(labels.profile.validation.emailRequired);
      }

      let logoUrl = formData.logo_url;

      // Handle logo: file upload or URL
      if (logoFile) {
        const fileExt = logoFile.name.split('.').pop();
        const fileName = `${user.id}-${Date.now()}.${fileExt}`;
        const filePath = `provider-logos/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('logos')
          .upload(filePath, logoFile, {
            cacheControl: '3600',
            upsert: false
          });

        if (uploadError) {
          console.error('Upload error:', uploadError);
          throw new Error(labels.profile.validation.logoUploadError + ': ' + uploadError.message);
        }

        const { data: { publicUrl } } = supabase.storage
          .from('logos')
          .getPublicUrl(filePath);

        logoUrl = publicUrl;
      } else if (useLogoUrl && logoUrlInput) {
        logoUrl = logoUrlInput.trim();
      }

      // Filter out empty FAQ items
      const validFaq = formData.faq.filter(item => 
        item.question?.trim() && item.answer?.trim()
      );

      // Update provider profile
      // Note: Database column is "Certification" (singular, capital C) - stores as comma-separated string
      // Note: FAQ is stored in separate provider_faqs table, not in providers table
      const { error: updateError } = await supabase
        .from('providers')
        .update({
          company_name: formData.company_name.trim(),
          contact_name: formData.contact_name?.trim() || null,
          phone: formData.phone.trim(),
          email: formData.email.trim(),
          website: formData.website?.trim() || null,
          description: formData.description.trim(),
          street: formData.street?.trim() || null,
          city: formData.city?.trim() || null,
          postal_code: formData.postal_code?.trim() || null,
          logo_url: logoUrl || null,
          // Save as comma-separated string to "Certification" column (singular, capital C)
          Certification: formData.certifications.length > 0 ? formData.certifications.join(', ') : null,
          updated_at: new Date().toISOString()
        })
        .eq('auth_user_id', user.id);
      
      // Handle FAQs separately in provider_faqs table
      // Get provider data (both id and provider_id)
      const { data: providerData } = await supabase
        .from('providers')
        .select('id, provider_id')
        .eq('auth_user_id', user.id)
        .single();
      
      if (providerData) {
        // Delete existing FAQs (try both provider_id formats)
        await supabase
          .from('provider_faqs')
          .delete()
          .eq('provider_id', providerData.provider_id);
        
        // Also try deleting by numeric id in case that's what's stored
        await supabase
          .from('provider_faqs')
          .delete()
          .eq('provider_id', providerData.id);
        
        // Insert new FAQs if any
        if (validFaq.length > 0) {
          const faqsToInsert = validFaq.map((faq, index) => ({
            provider_id: providerData.provider_id, // Use text slug
            question: faq.question,
            answer: faq.answer,
            is_active: true,
            display_order: index + 1
          }));
          
          const { error: faqError } = await supabase
            .from('provider_faqs')
            .insert(faqsToInsert);
          
          if (faqError) {
            console.error('FAQ insert error:', faqError);
          }
        }
      }

      if (updateError) {
        console.error('Update error:', updateError);
        throw new Error(updateError.message || 'Fehler beim Aktualisieren des Profils');
      }

      setMessage({ type: 'success', text: labels.profile.successMessage });
      
      // Clear message after 5 seconds
      setTimeout(() => {
        setMessage({ type: '', text: '' });
      }, 5000);
      
      router.refresh();

    } catch (error) {
      console.error('Error:', error);
      setMessage({ 
        type: 'error', 
        text: error.message || labels.profile.errorMessage 
      });
    } finally {
      setSaving(false);
    }
  }

  const tabs = [
    { id: 'basic', label: labels.profile.tabs.basic },
    { id: 'contact', label: labels.profile.tabs.contact },
    { id: 'address', label: labels.profile.tabs.address },
    { id: 'about', label: labels.profile.tabs.about },
    { id: 'certifications', label: labels.profile.tabs.certifications },
    { id: 'faq', label: labels.profile.tabs.faq },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Message Toast */}
      {message.text && (
        <div className={`px-4 py-3 rounded-lg ${
          message.type === 'success' 
            ? 'bg-green-50 border border-green-200 text-green-800' 
            : 'bg-red-50 border border-red-200 text-red-800'
        }`}>
          {message.text}
        </div>
      )}

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-cyan-500 text-cyan-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="min-h-[400px]">
        {/* Basic Info Tab */}
        {activeTab === 'basic' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Grundinformationen</h2>
              
              {/* Logo */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Firmenlogo
                </label>
                {logoPreview && (
                  <div className="mb-4">
                    <img 
                      src={logoPreview} 
                      alt="Logo Preview" 
                      className="w-32 h-32 object-contain rounded-lg border border-gray-200 bg-white p-2" 
                    />
                  </div>
                )}
                <div className="space-y-3">
                  <div>
                    <label className="flex items-center gap-2 mb-2">
                      <input
                        type="radio"
                        checked={!useLogoUrl}
                        onChange={() => setUseLogoUrl(false)}
                        className="text-cyan-600"
                      />
                      <span className="text-sm text-gray-700">Logo hochladen</span>
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleLogoChange}
                      disabled={useLogoUrl}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                  </div>
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-300"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-white text-gray-500">oder</span>
                    </div>
                  </div>
                  <div>
                    <label className="flex items-center gap-2 mb-2">
                      <input
                        type="radio"
                        checked={useLogoUrl}
                        onChange={() => setUseLogoUrl(true)}
                        className="text-cyan-600"
                      />
                      <span className="text-sm text-gray-700">Logo-URL eingeben</span>
                    </label>
                    <input
                      type="url"
                      value={logoUrlInput}
                      onChange={handleLogoUrlChange}
                      disabled={!useLogoUrl}
                      placeholder="https://example.com/logo.png"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Company Name */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Firmenname *
                  </label>
                  <input
                    type="text"
                    name="company_name"
                    required
                    value={formData.company_name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-gray-900"
                  />
                </div>

                {/* Contact Name */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Ansprechpartner
                  </label>
                  <input
                    type="text"
                    name="contact_name"
                    value={formData.contact_name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-gray-900"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Contact Tab */}
        {activeTab === 'contact' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Kontaktdaten</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Email */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    E-Mail *
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-gray-900"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Telefon *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-gray-900"
                    placeholder="+49 221 123456"
                  />
                </div>

                {/* Website */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Website
                  </label>
                  <input
                    type="url"
                    name="website"
                    value={formData.website}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-gray-900"
                    placeholder="https://ihre-website.de"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Address Tab */}
        {activeTab === 'address' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Adresse</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Straße
                  </label>
                  <input
                    type="text"
                    name="street"
                    value={formData.street}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-gray-900"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    PLZ
                  </label>
                  <input
                    type="text"
                    name="postal_code"
                    value={formData.postal_code}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-gray-900"
                  />
                </div>
                <div className="md:col-span-3">
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Stadt
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-gray-900"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* About Tab */}
        {activeTab === 'about' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Über uns</h2>
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Beschreibung (Über den Anbieter) *
                </label>
                <textarea
                  name="description"
                  required
                  rows={8}
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-gray-900"
                  placeholder="Beschreiben Sie Ihr Unternehmen, Ihre Expertise und Ihre Werte..."
                />
                <p className="mt-2 text-sm text-gray-500">
                  Diese Beschreibung wird auf allen Ihren Kursseiten unter "Über den Anbieter" angezeigt.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Certifications Tab */}
        {activeTab === 'certifications' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Zertifizierungen</h2>
              
              {/* Current Certifications */}
              {formData.certifications.length > 0 && (
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Aktuelle Zertifizierungen
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {formData.certifications.map((cert, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-50 text-cyan-700 rounded-lg text-sm font-medium border border-cyan-200"
                      >
                        {cert}
                        <button
                          type="button"
                          onClick={() => handleCertificationRemove(index)}
                          className="text-cyan-700 hover:text-cyan-900"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Common Certifications */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Häufige Zertifizierungen
                </label>
                <div className="flex flex-wrap gap-2">
                  {commonCertifications.map((cert) => (
                    <button
                      key={cert}
                      type="button"
                      onClick={() => handleCertificationAdd(cert)}
                      disabled={formData.certifications.includes(cert)}
                      className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed border border-gray-300"
                    >
                      + {cert}
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Certification */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Eigene Zertifizierung hinzufügen
                </label>
                <div className="flex gap-2">
                  <input
                    id="custom-certification"
                    type="text"
                    placeholder="z.B. ISO 27001"
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-gray-900"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleCustomCertificationAdd();
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={handleCustomCertificationAdd}
                    className="px-6 py-3 bg-cyan-500 text-white rounded-lg font-medium hover:bg-cyan-600 transition-colors"
                  >
                    Hinzufügen
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* FAQ Tab */}
        {activeTab === 'faq' && (
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Häufig gestellte Fragen</h2>
                <button
                  type="button"
                  onClick={handleFaqAdd}
                  className="px-4 py-2 bg-cyan-500 text-white rounded-lg font-medium hover:bg-cyan-600 transition-colors"
                >
                  + FAQ hinzufügen
                </button>
              </div>

              {formData.faq.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="text-gray-500">Noch keine FAQs hinzugefügt.</p>
                  <p className="text-sm text-gray-400 mt-2">Klicken Sie auf "FAQ hinzufügen", um eine Frage hinzuzufügen.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {formData.faq.map((item, index) => (
                    <div key={index} className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                      <div className="flex items-start justify-between mb-3">
                        <span className="text-sm font-semibold text-gray-700">FAQ #{index + 1}</span>
                        <button
                          type="button"
                          onClick={() => handleFaqRemove(index)}
                          className="text-red-600 hover:text-red-800 text-sm font-medium"
                        >
                          Entfernen
                        </button>
                      </div>
                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Frage *
                          </label>
                          <input
                            type="text"
                            value={item.question}
                            onChange={(e) => handleFaqChange(index, 'question', e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-gray-900"
                            placeholder="Wie lange dauert die Ausbildung?"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Antwort *
                          </label>
                          <textarea
                            value={item.answer}
                            onChange={(e) => handleFaqChange(index, 'answer', e.target.value)}
                            rows={3}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-gray-900"
                            placeholder="Die Ausbildung dauert in der Regel 12 Monate..."
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Submit Button */}
      <div className="flex justify-end pt-6 border-t border-gray-200">
        <button
          type="submit"
          disabled={saving}
          className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-emerald-500 text-white font-semibold rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? labels.profile.saving : labels.profile.updateButton}
        </button>
      </div>
    </form>
  );
}
