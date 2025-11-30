'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

export default function CourseForm({ course = null, onSuccess, provider = null }) {
  const isEditing = !!course;
  
  const [currentProvider, setCurrentProvider] = useState(provider);
  
  // Parse funding types from comma-separated string or array to array
  const parseFundingTypes = (fundingData) => {
    if (!fundingData) return [];
    // If already an array, return it
    if (Array.isArray(fundingData)) return fundingData;
    // If string, split by comma
    if (typeof fundingData === 'string') {
      return fundingData.split(',').map(f => f.trim());
    }
    return [];
  };

  // Parse benefits from comma-separated string or array to array
  const parseBenefits = (benefitsData) => {
    if (!benefitsData) return [];
    // If already an array, return it
    if (Array.isArray(benefitsData)) return benefitsData;
    // If string, split by comma
    if (typeof benefitsData === 'string') {
      return benefitsData.split(',').map(b => b.trim());
    }
    return [];
  };

  const [formData, setFormData] = useState({
    title: course?.title || '',
    subtitle: course?.subtitle || '',
    description: course?.description || '',
    location: course?.location || '',
    format: course?.format || 'Online',
    duration: course?.duration || '',
    duration_hours: course?.duration_hours || '',
    price: course?.price || '',
    price_type: course?.price_type || 'Einmalzahlung',
    start_date: course?.start_date || '',
    image_url: course?.image_url || '',
    is_active: course?.is_active ?? true,
    is_featured: course?.is_featured ?? false,
    funding_eligible: course?.funding_eligible ?? true,
    prerequisites: course?.prerequisites?.join('\n') || '',
    learning_objectives: course?.learning_objectives?.join('\n') || '',
    target_audience: course?.target_audience?.join('\n') || '',
    certificate_type: course?.certificate_type || '',
    job_placement_rate: course?.job_placement_rate || '',
    infomaterial_url: course?.infomaterial_url || '',
    meta_title: course?.meta_title || '',
    meta_description: course?.meta_description || '',
    keywords: course?.keywords?.join('\n') || '',
    badges: course?.badges?.join('\n') || '',
    status: course?.status || 'active',
  });

  // Separate state for funding types as array
  // Read from funding_types (plural) column in database
  const [fundingTypes, setFundingTypes] = useState(
    parseFundingTypes(course?.funding_types) || []
  );

  // Separate state for benefits as array
  const [benefits, setBenefits] = useState(
    parseBenefits(course?.benefits) || []
  );

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(course?.image_url || '');
  const [imageUrlInput, setImageUrlInput] = useState(course?.image_url || '');
  const [useImageUrl, setUseImageUrl] = useState(!!course?.image_url && !course?.image_url.includes('supabase'));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Fetch provider info if not passed as prop
  useEffect(() => {
    async function fetchProvider() {
      if (!currentProvider) {
        try {
          const { data: { user } } = await supabase.auth.getUser();
          if (user) {
            const { data: providerData } = await supabase
              .from('providers')
              .select('provider_id, company_name, logo_url')
              .eq('auth_user_id', user.id)
              .single();
            if (providerData) {
              setCurrentProvider(providerData);
            }
          }
        } catch (err) {
          console.error('Error fetching provider:', err);
        }
      }
    }
    fetchProvider();
  }, [currentProvider]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleFundingTypeChange = (type) => {
    setFundingTypes(prev => {
      if (prev.includes(type)) {
        // Remove if already selected
        return prev.filter(t => t !== type);
      } else {
        // Add if not selected
        return [...prev, type];
      }
    });
  };

  const handleBenefitChange = (benefit) => {
    setBenefits(prev => {
      if (prev.includes(benefit)) {
        // Remove if already selected
        return prev.filter(b => b !== benefit);
      } else {
        // Add if not selected
        return [...prev, benefit];
      }
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setUseImageUrl(false);
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageUrlChange = (e) => {
    const url = e.target.value;
    setImageUrlInput(url);
    setUseImageUrl(true);
    setImageFile(null);
    if (url) {
      setImagePreview(url);
    }
  };

  const uploadImage = async () => {
    // If using URL input, return that URL
    if (useImageUrl && imageUrlInput) {
      return imageUrlInput.trim();
    }
    
    // If no file selected, return existing URL
    if (!imageFile) return formData.image_url;

    try {
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
      const filePath = `course-images/${fileName}`;

      console.log('Uploading image to:', filePath);

      const { error: uploadError, data: uploadData } = await supabase.storage
        .from('courses')
        .upload(filePath, imageFile, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        console.error('Upload error details:', uploadError);
        // Check if it's a bucket not found error
        if (uploadError.message?.includes('bucket') || uploadError.message?.includes('not found')) {
          throw new Error('Speicher-Bucket nicht gefunden. Bitte kontaktieren Sie den Administrator.');
        }
        throw uploadError;
      }

      console.log('Upload successful:', uploadData);

      const { data: { publicUrl } } = supabase.storage
        .from('courses')
        .getPublicUrl(filePath);

      console.log('Public URL:', publicUrl);
      return publicUrl;
    } catch (err) {
      console.error('Error uploading image:', err);
      throw new Error('Fehler beim Hochladen des Bildes: ' + (err.message || 'Unbekannter Fehler'));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Check if user is authenticated (not in demo mode)
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('Demo-Modus: Bitte melden Sie sich an, um Kurse zu erstellen oder zu bearbeiten. Diese Funktion ist im Demo-Modus nicht verfügbar.');
      }

      // Validate required fields
      if (!formData.title || !formData.description) {
        throw new Error('Titel und Beschreibung sind Pflichtfelder');
      }

      // Validate location is required for Präsenz or Hybrid format
      if ((formData.format === 'Präsenz' || formData.format === 'Hybrid') && !formData.location) {
        throw new Error('Standort ist erforderlich für Präsenz- und Hybrid-Kurse');
      }

      // Validate funding types if funding is eligible
      if (formData.funding_eligible && fundingTypes.length === 0) {
        throw new Error('Bitte wählen Sie mindestens eine Förderungsart aus, wenn der Kurs förderungsfähig ist');
      }

      // Upload image if new one selected
      let imageUrl = formData.image_url;
      if (imageFile) {
        imageUrl = await uploadImage();
      }

      // Generate slug from title
      const slug = generateSlug(formData.title);

      // Prepare course data - convert textarea strings to arrays
      const courseData = {
        ...formData,
        slug: isEditing ? course.slug : slug, // Don't change slug when editing
        // Save funding_types as array (database column is funding_types, not funding_type)
        funding_types: fundingTypes.length > 0 ? fundingTypes : null,
        benefits: benefits.length > 0 ? benefits.join(', ') : null,
        image_url: imageUrl,
        price: formData.price ? parseFloat(formData.price) : null,
        duration_hours: formData.duration_hours?.trim() || null,
        job_placement_rate: formData.job_placement_rate ? parseFloat(formData.job_placement_rate) : null,
        // Convert newline-separated strings to arrays (with null safety)
        prerequisites: (formData.prerequisites && formData.prerequisites.trim()) ? formData.prerequisites.split('\n').filter(Boolean) : [],
        learning_objectives: (formData.learning_objectives && formData.learning_objectives.trim()) ? formData.learning_objectives.split('\n').filter(Boolean) : [],
        target_audience: (formData.target_audience && formData.target_audience.trim()) ? formData.target_audience.split('\n').filter(Boolean) : [],
        keywords: (formData.keywords && formData.keywords.trim()) ? formData.keywords.split('\n').filter(Boolean) : [],
        badges: (formData.badges && formData.badges.trim()) ? formData.badges.split('\n').filter(Boolean) : [],
        // Remove provider_id from form data - it's set automatically
        provider_id: undefined,
      };

      const url = isEditing 
        ? `/api/provider/courses?id=${course.id}` 
        : '/api/provider/courses';
      
      const method = isEditing ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(courseData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Fehler beim Speichern');
      }

      setSuccess(isEditing ? 'Kurs erfolgreich aktualisiert!' : 'Kurs erfolgreich erstellt!');
      
      // Call success callback after short delay
      setTimeout(() => {
        if (onSuccess) {
          onSuccess(result.course);
        }
      }, 1500);

    } catch (err) {
      console.error('Error submitting form:', err);
      setError(err.message || 'Ein Fehler ist aufgetreten');
    } finally {
      setLoading(false);
    }
  };

  // Generate slug from title
  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Provider Info Display (Read-only) */}
      {currentProvider && (
        <div className="bg-cyan-50 border border-cyan-200 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-3">
            {currentProvider.logo_url && (
              <img 
                src={currentProvider.logo_url} 
                alt={currentProvider.company_name}
                className="w-12 h-12 object-contain rounded-lg border border-cyan-200 bg-white p-1"
              />
            )}
            <div className="flex-1">
              <p className="text-sm text-gray-600">Kurs wird veröffentlicht von:</p>
              <p className="text-base font-semibold text-gray-900">{currentProvider.company_name}</p>
            </div>
            <Link
              href="/provider/dashboard/profile"
              className="text-sm text-cyan-600 hover:text-cyan-700 font-medium underline"
            >
              Profil bearbeiten
            </Link>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Success Message */}
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg">
          {success}
        </div>
      )}

      {/* Title */}
      <div>
        <label htmlFor="title" className="block text-sm font-semibold text-gray-700 mb-2">
          Kurstitel <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleInputChange}
          required
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-gray-900 placeholder:text-gray-400"
          placeholder="z.B. Vollzeit Weiterbildung zum Data Analyst"
        />
      </div>

      {/* Description */}
      <div>
        <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-2">
          Beschreibung <span className="text-red-500">*</span>
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          required
          rows={5}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-gray-900 placeholder:text-gray-400"
          placeholder="Beschreiben Sie den Kurs..."
        />
      </div>

      {/* Location and Duration */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="location" className="block text-sm font-semibold text-gray-700 mb-2">
            Standort {formData.format === 'Präsenz' || formData.format === 'Hybrid' ? <span className="text-red-500">*</span> : ''}
          </label>
          <input
            type="text"
            id="location"
            name="location"
            value={formData.location}
            onChange={handleInputChange}
            required={formData.format === 'Präsenz' || formData.format === 'Hybrid'}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-gray-900 placeholder:text-gray-400"
            placeholder="z.B. Berlin, Hamburg"
          />
          {formData.format === 'Online' && (
            <p className="mt-1 text-sm text-gray-500">Optional für Online-Kurse</p>
          )}
        </div>

        <div>
          <label htmlFor="duration" className="block text-sm font-semibold text-gray-700 mb-2">
            Dauer <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="duration"
            name="duration"
            value={formData.duration}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-gray-900 placeholder:text-gray-400"
            placeholder="z.B. 6 Monate, 3 Wochen"
          />
        </div>
      </div>

      {/* Funding Type and Price */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Förderungsart <span className="text-red-500">*</span>
          </label>
          <div className="space-y-3 max-h-72 overflow-y-auto border border-gray-200 rounded-lg p-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="funding_bildungsgutschein"
                checked={fundingTypes.includes('Bildungsgutschein')}
                onChange={() => handleFundingTypeChange('Bildungsgutschein')}
                className="w-5 h-5 text-cyan-600 border-gray-300 rounded focus:ring-cyan-500"
              />
              <label htmlFor="funding_bildungsgutschein" className="ml-3 text-sm font-medium text-gray-700">
                Bildungsgutschein
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="funding_avgs"
                checked={fundingTypes.includes('AVGS')}
                onChange={() => handleFundingTypeChange('AVGS')}
                className="w-5 h-5 text-cyan-600 border-gray-300 rounded focus:ring-cyan-500"
              />
              <label htmlFor="funding_avgs" className="ml-3 text-sm font-medium text-gray-700">
                AVGS
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="funding_vorauszahlung"
                checked={fundingTypes.includes('Vorauszahlung')}
                onChange={() => handleFundingTypeChange('Vorauszahlung')}
                className="w-5 h-5 text-cyan-600 border-gray-300 rounded focus:ring-cyan-500"
              />
              <label htmlFor="funding_vorauszahlung" className="ml-3 text-sm font-medium text-gray-700">
                Vorauszahlung
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="funding_monatlich"
                checked={fundingTypes.includes('Monatliche Zahlung')}
                onChange={() => handleFundingTypeChange('Monatliche Zahlung')}
                className="w-5 h-5 text-cyan-600 border-gray-300 rounded focus:ring-cyan-500"
              />
              <label htmlFor="funding_monatlich" className="ml-3 text-sm font-medium text-gray-700">
                Monatliche Zahlung
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="funding_studiendarlehen"
                checked={fundingTypes.includes('Studiendarlehen')}
                onChange={() => handleFundingTypeChange('Studiendarlehen')}
                className="w-5 h-5 text-cyan-600 border-gray-300 rounded focus:ring-cyan-500"
              />
              <label htmlFor="funding_studiendarlehen" className="ml-3 text-sm font-medium text-gray-700">
                Studiendarlehen
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="funding_einkommensteilung"
                checked={fundingTypes.includes('Einkommensteilungsvereinbarung')}
                onChange={() => handleFundingTypeChange('Einkommensteilungsvereinbarung')}
                className="w-5 h-5 text-cyan-600 border-gray-300 rounded focus:ring-cyan-500"
              />
              <label htmlFor="funding_einkommensteilung" className="ml-3 text-sm font-medium text-gray-700">
                Einkommensteilungsvereinbarung
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="funding_kostenlos"
                checked={fundingTypes.includes('Kostenlos')}
                onChange={() => handleFundingTypeChange('Kostenlos')}
                className="w-5 h-5 text-cyan-600 border-gray-300 rounded focus:ring-cyan-500"
              />
              <label htmlFor="funding_kostenlos" className="ml-3 text-sm font-medium text-gray-700">
                Kostenlos
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="funding_stipendium"
                checked={fundingTypes.includes('Mit Stipendium')}
                onChange={() => handleFundingTypeChange('Mit Stipendium')}
                className="w-5 h-5 text-cyan-600 border-gray-300 rounded focus:ring-cyan-500"
              />
              <label htmlFor="funding_stipendium" className="ml-3 text-sm font-medium text-gray-700">
                Mit Stipendium
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="funding_unternehmensfinanzierung"
                checked={fundingTypes.includes('Unternehmensfinanzierung')}
                onChange={() => handleFundingTypeChange('Unternehmensfinanzierung')}
                className="w-5 h-5 text-cyan-600 border-gray-300 rounded focus:ring-cyan-500"
              />
              <label htmlFor="funding_unternehmensfinanzierung" className="ml-3 text-sm font-medium text-gray-700">
                Unternehmensfinanzierung
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="funding_selbstzahler"
                checked={fundingTypes.includes('Selbstzahler')}
                onChange={() => handleFundingTypeChange('Selbstzahler')}
                className="w-5 h-5 text-cyan-600 border-gray-300 rounded focus:ring-cyan-500"
              />
              <label htmlFor="funding_selbstzahler" className="ml-3 text-sm font-medium text-gray-700">
                Selbstzahler
              </label>
            </div>
          </div>
          {fundingTypes.length === 0 && (
            <p className="mt-2 text-sm text-red-600">Mindestens eine Option auswählen</p>
          )}
        </div>

        <div>
          <label htmlFor="price" className="block text-sm font-semibold text-gray-700 mb-2">
            Preis (€)
          </label>
          <input
            type="number"
            id="price"
            name="price"
            value={formData.price}
            onChange={handleInputChange}
            min="0"
            step="0.01"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-gray-900 placeholder:text-gray-400"
            placeholder="Optional"
          />
        </div>
      </div>

      {/* Start Date */}
      <div>
        <label htmlFor="start_date" className="block text-sm font-semibold text-gray-700 mb-2">
          Startdatum
        </label>
        <input
          type="date"
          id="start_date"
          name="start_date"
          value={formData.start_date}
          onChange={handleInputChange}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-gray-900"
        />
      </div>

      {/* Image Upload */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Kursbild
        </label>
        
        {imagePreview && (
          <div className="mb-4">
            <img
              src={imagePreview}
              alt="Vorschau"
              className="w-full h-48 object-cover rounded-lg border border-gray-200"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          </div>
        )}

        <div className="space-y-3">
          {/* Option 1: File Upload */}
          <div>
            <label className="flex items-center gap-2 mb-2">
              <input
                type="radio"
                checked={!useImageUrl}
                onChange={() => setUseImageUrl(false)}
                className="text-cyan-600"
              />
              <span className="text-sm text-gray-700">Bild hochladen</span>
            </label>
            <input
              type="file"
              id="image"
              accept="image/*"
              onChange={handleImageChange}
              disabled={useImageUrl}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-gray-900 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-cyan-50 file:text-cyan-700 hover:file:bg-cyan-100 disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">oder</span>
            </div>
          </div>

          {/* Option 2: URL Input */}
          <div>
            <label className="flex items-center gap-2 mb-2">
              <input
                type="radio"
                checked={useImageUrl}
                onChange={() => setUseImageUrl(true)}
                className="text-cyan-600"
              />
              <span className="text-sm text-gray-700">Bild-URL eingeben</span>
            </label>
            <input
              type="url"
              value={imageUrlInput}
              onChange={handleImageUrlChange}
              disabled={!useImageUrl}
              placeholder="https://example.com/kursbild.jpg"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-gray-900 placeholder:text-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>
        </div>

        <p className="text-sm text-gray-500 mt-2">
          Empfohlene Größe: 1200x600px (JPG, PNG)
        </p>
      </div>

      {/* Course Benefits */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          Zusätzliche Leistungen & Benefits
        </label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border border-gray-200 rounded-lg bg-gray-50">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="benefit_jobgarantie"
              checked={benefits.includes('Job Garantie')}
              onChange={() => handleBenefitChange('Job Garantie')}
              className="w-5 h-5 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
            />
            <label htmlFor="benefit_jobgarantie" className="ml-3 text-sm font-medium text-gray-700">
              Job Garantie
            </label>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="benefit_jobcoaching"
              checked={benefits.includes('Jobcoaching')}
              onChange={() => handleBenefitChange('Jobcoaching')}
              className="w-5 h-5 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
            />
            <label htmlFor="benefit_jobcoaching" className="ml-3 text-sm font-medium text-gray-700">
              Jobcoaching
            </label>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="benefit_laptop"
              checked={benefits.includes('Inklusiver Laptop')}
              onChange={() => handleBenefitChange('Inklusiver Laptop')}
              className="w-5 h-5 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
            />
            <label htmlFor="benefit_laptop" className="ml-3 text-sm font-medium text-gray-700">
              Inklusiver Laptop
            </label>
          </div>
        </div>
        <p className="text-sm text-gray-500 mt-2">
          Optional: Wählen Sie die zusätzlichen Leistungen aus, die Ihr Kurs bietet
        </p>
      </div>

      {/* Additional Details Section */}
      <div className="bg-gray-50 rounded-lg p-6 space-y-6">
        <h3 className="text-lg font-semibold text-gray-900">Zusätzliche Kursdetails</h3>
        
        {/* Subtitle, Format, Certificate */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label htmlFor="subtitle" className="block text-sm font-semibold text-gray-700 mb-2">
              Untertitel
            </label>
            <input
              type="text"
              id="subtitle"
              name="subtitle"
              value={formData.subtitle}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-gray-900 placeholder:text-gray-400"
              placeholder="Kurzer Untertitel"
            />
          </div>
          
          <div>
            <label htmlFor="format" className="block text-sm font-semibold text-gray-700 mb-2">
              Format
            </label>
            <select
              id="format"
              name="format"
              value={formData.format}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-gray-900"
            >
              <option value="Online">Online</option>
              <option value="Präsenz">Präsenz</option>
              <option value="Hybrid">Hybrid</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="certificate_type" className="block text-sm font-semibold text-gray-700 mb-2">
              Zertifikat
            </label>
            <input
              type="text"
              id="certificate_type"
              name="certificate_type"
              value={formData.certificate_type}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-gray-900 placeholder:text-gray-400"
              placeholder="z.B. IHK-Zertifikat"
            />
          </div>
        </div>
        
        {/* Duration Hours, Price Type, Job Placement */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label htmlFor="duration_hours" className="block text-sm font-semibold text-gray-700 mb-2">
              Dauer in Stunden/UE
            </label>
            <input
              type="text"
              id="duration_hours"
              name="duration_hours"
              value={formData.duration_hours}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-gray-900 placeholder:text-gray-400"
              placeholder="z.B. 400 UE oder 200 Std"
            />
            <p className="mt-1 text-sm text-gray-500">Format: z.B. "400 UE" oder "200 Std"</p>
          </div>
          
          <div>
            <label htmlFor="price_type" className="block text-sm font-semibold text-gray-700 mb-2">
              Preistyp
            </label>
            <select
              id="price_type"
              name="price_type"
              value={formData.price_type}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-gray-900"
            >
              <option value="Einmalzahlung">Einmalzahlung</option>
              <option value="Ratenzahlung">Ratenzahlung</option>
              <option value="Kostenlos">Kostenlos</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="job_placement_rate" className="block text-sm font-semibold text-gray-700 mb-2">
              Vermittlungsquote (%)
            </label>
            <input
              type="number"
              id="job_placement_rate"
              name="job_placement_rate"
              value={formData.job_placement_rate}
              onChange={handleInputChange}
              min="0"
              max="100"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-gray-900 placeholder:text-gray-400"
              placeholder="0-100"
            />
          </div>
        </div>
        
        {/* Textarea Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="prerequisites" className="block text-sm font-semibold text-gray-700 mb-2">
              Voraussetzungen
            </label>
            <textarea
              id="prerequisites"
              name="prerequisites"
              value={formData.prerequisites}
              onChange={handleInputChange}
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-gray-900 placeholder:text-gray-400"
              placeholder="Eine pro Zeile..."
            />
            <p className="text-sm text-gray-500 mt-1">Eine Voraussetzung pro Zeile</p>
          </div>
          
          <div>
            <label htmlFor="learning_objectives" className="block text-sm font-semibold text-gray-700 mb-2">
              Lernziele
            </label>
            <textarea
              id="learning_objectives"
              name="learning_objectives"
              value={formData.learning_objectives}
              onChange={handleInputChange}
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-gray-900 placeholder:text-gray-400"
              placeholder="Eine pro Zeile..."
            />
            <p className="text-sm text-gray-500 mt-1">Ein Lernziel pro Zeile</p>
          </div>
        </div>
        
        <div>
          <label htmlFor="target_audience" className="block text-sm font-semibold text-gray-700 mb-2">
            Zielgruppe
          </label>
          <textarea
            id="target_audience"
            name="target_audience"
            value={formData.target_audience}
            onChange={handleInputChange}
            rows={3}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-gray-900 placeholder:text-gray-400"
            placeholder="Eine Zielgruppe pro Zeile..."
          />
          <p className="text-sm text-gray-500 mt-1">Eine Zielgruppe pro Zeile</p>
        </div>
      </div>
      
      {/* Marketing & SEO Section */}
      <div className="bg-gray-50 rounded-lg p-6 space-y-6">
        <h3 className="text-lg font-semibold text-gray-900">Marketing & SEO</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="status" className="block text-sm font-semibold text-gray-700 mb-2">
              Status
            </label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-gray-900"
            >
              <option value="active">Aktiv</option>
              <option value="draft">Entwurf</option>
              <option value="inactive">Inaktiv</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="infomaterial_url" className="block text-sm font-semibold text-gray-700 mb-2">
              Infomaterial URL
            </label>
            <input
              type="url"
              id="infomaterial_url"
              name="infomaterial_url"
              value={formData.infomaterial_url}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-gray-900 placeholder:text-gray-400"
              placeholder="https://..."
            />
          </div>
        </div>
        
        <div>
          <label htmlFor="meta_title" className="block text-sm font-semibold text-gray-700 mb-2">
            Meta Title (SEO)
          </label>
          <input
            type="text"
            id="meta_title"
            name="meta_title"
            value={formData.meta_title}
            onChange={handleInputChange}
            maxLength={60}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-gray-900 placeholder:text-gray-400"
            placeholder="SEO-optimierter Titel (max 60 Zeichen)"
          />
        </div>
        
        <div>
          <label htmlFor="meta_description" className="block text-sm font-semibold text-gray-700 mb-2">
            Meta Description (SEO)
          </label>
          <textarea
            id="meta_description"
            name="meta_description"
            value={formData.meta_description}
            onChange={handleInputChange}
            rows={3}
            maxLength={160}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-gray-900 placeholder:text-gray-400"
            placeholder="SEO-optimierte Beschreibung (max 160 Zeichen)"
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="keywords" className="block text-sm font-semibold text-gray-700 mb-2">
              Keywords
            </label>
            <textarea
              id="keywords"
              name="keywords"
              value={formData.keywords}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-gray-900 placeholder:text-gray-400"
              placeholder="Ein Keyword pro Zeile..."
            />
            <p className="text-sm text-gray-500 mt-1">Ein Keyword pro Zeile</p>
          </div>
          
          <div>
            <label htmlFor="badges" className="block text-sm font-semibold text-gray-700 mb-2">
              Badges
            </label>
            <textarea
              id="badges"
              name="badges"
              value={formData.badges}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-gray-900 placeholder:text-gray-400"
              placeholder="Ein Badge pro Zeile (z.B. Bestseller, Neu)..."
            />
            <p className="text-sm text-gray-500 mt-1">Ein Badge pro Zeile</p>
          </div>
        </div>
      </div>

      {/* Checkboxes */}
      <div className="space-y-4">
        <div className="flex items-center">
          <input
            type="checkbox"
            id="funding_eligible"
            name="funding_eligible"
            checked={formData.funding_eligible}
            onChange={handleInputChange}
            className="w-5 h-5 text-cyan-600 border-gray-300 rounded focus:ring-cyan-500"
          />
          <label htmlFor="funding_eligible" className="ml-3 text-sm font-medium text-gray-700">
            Förderungsfähig
          </label>
        </div>
      
        <div className="flex items-center">
          <input
            type="checkbox"
            id="is_active"
            name="is_active"
            checked={formData.is_active}
            onChange={handleInputChange}
            className="w-5 h-5 text-cyan-600 border-gray-300 rounded focus:ring-cyan-500"
          />
          <label htmlFor="is_active" className="ml-3 text-sm font-medium text-gray-700">
            Kurs ist aktiv (wird auf der Plattform angezeigt)
          </label>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="is_featured"
            name="is_featured"
            checked={formData.is_featured}
            onChange={handleInputChange}
            className="w-5 h-5 text-cyan-600 border-gray-300 rounded focus:ring-cyan-500"
          />
          <label htmlFor="is_featured" className="ml-3 text-sm font-medium text-gray-700">
            Hervorgehobener Kurs (wird prominent angezeigt)
          </label>
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex items-center gap-4 pt-4">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 px-6 py-3 bg-gradient-to-r from-cyan-500 to-emerald-500 text-white rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Wird gespeichert...' : isEditing ? 'Kurs aktualisieren' : 'Kurs erstellen'}
        </button>
      </div>
    </form>
  );
}
