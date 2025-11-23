/**
 * Extract search intent from user message
 * Returns filters and search query based on user's natural language
 */
export function extractSearchIntent(message) {
  const lowerMessage = message.toLowerCase()
  const intent = {
    query: '',
    category: null,
    format: null,
    location: null,
    funding: null,
    language: null
  }

  // Extract category keywords
  const categoryKeywords = {
    'IT & Programmierung': ['python', 'javascript', 'java', 'web', 'entwicklung', 'programmierung', 'coding', 'developer', 'software', 'it', 'tech', 'programming'],
    'Marketing & SEO': ['marketing', 'seo', 'social media', 'digital marketing', 'online marketing', 'werbung', 'advertising'],
    'Design & Medien': ['design', 'ux', 'ui', 'graphic', 'grafik', 'media', 'medien', 'illustration', 'photoshop'],
    'Data Science & KI': ['data science', 'data', 'machine learning', 'ai', 'artificial intelligence', 'ki', 'daten', 'analytics', 'big data'],
    'Projektmanagement': ['project management', 'projektmanagement', 'agile', 'scrum', 'pm', 'pmp'],
    'Kaufmännische Berufe': ['kaufmännisch', 'business', 'bwl', 'wirtschaft', 'buchhaltung', 'accounting'],
    'Sprachen': ['sprache', 'language', 'englisch', 'english', 'deutsch', 'german']
  }

  // Check for category matches
  for (const [category, keywords] of Object.entries(categoryKeywords)) {
    if (keywords.some(keyword => lowerMessage.includes(keyword))) {
      intent.category = category
      break
    }
  }

  // Extract format
  if (lowerMessage.includes('online') || lowerMessage.includes('remote') || lowerMessage.includes('virtuell')) {
    intent.format = 'Online'
  } else if (lowerMessage.includes('präsenz') || lowerMessage.includes('vor ort') || lowerMessage.includes('in person')) {
    intent.format = 'Präsenz'
  } else if (lowerMessage.includes('hybrid')) {
    intent.format = 'Hybrid'
  }

  // Extract location (common German cities)
  const locations = ['berlin', 'münchen', 'munich', 'hamburg', 'köln', 'cologne', 'frankfurt', 'stuttgart', 'düsseldorf', 'dortmund', 'essen', 'leipzig', 'bremen', 'dresden', 'hannover', 'nürnberg', 'nuremberg']
  for (const loc of locations) {
    if (lowerMessage.includes(loc)) {
      // Capitalize first letter
      intent.location = loc.charAt(0).toUpperCase() + loc.slice(1)
      // Handle special cases
      if (loc === 'münchen') intent.location = 'München'
      if (loc === 'köln') intent.location = 'Köln'
      if (loc === 'nürnberg') intent.location = 'Nürnberg'
      break
    }
  }

  // Extract funding type
  if (lowerMessage.includes('bildungsgutschein') || lowerMessage.includes('education voucher')) {
    intent.funding = 'Bildungsgutschein'
  } else if (lowerMessage.includes('avgs')) {
    intent.funding = 'AVGS'
  } else if (lowerMessage.includes('rentenversicherung')) {
    intent.funding = 'Deutsche Rentenversicherung'
  }

  // Extract language
  if (lowerMessage.includes('deutsch') || lowerMessage.includes('german')) {
    intent.language = 'Deutsch'
  } else if (lowerMessage.includes('englisch') || lowerMessage.includes('english')) {
    intent.language = 'English'
  } else if (lowerMessage.includes('französisch') || lowerMessage.includes('french')) {
    intent.language = 'Französisch'
  } else if (lowerMessage.includes('spanisch') || lowerMessage.includes('spanish')) {
    intent.language = 'Spanisch'
  }

  // Extract main query (remove filter keywords to get the actual search term)
  let query = message
  // Remove location mentions
  locations.forEach(loc => {
    query = query.replace(new RegExp(loc, 'gi'), '')
  })
  // Remove common filter words
  const filterWords = ['kurs', 'course', 'training', 'online', 'präsenz', 'hybrid', 'berlin', 'münchen', 'hamburg', 'bildungsgutschein', 'avgs', 'deutsch', 'english', 'mit', 'in', 'für', 'und', 'oder']
  filterWords.forEach(word => {
    query = query.replace(new RegExp(`\\b${word}\\b`, 'gi'), '')
  })
  // Clean up and trim
  query = query.replace(/\s+/g, ' ').trim()
  
  // If query is meaningful (more than 2 chars and not just common words), use it
  if (query.length > 2 && !['i', 'want', 'to', 'learn', 'show', 'me', 'ich', 'möchte', 'lernen', 'zeig', 'mir'].includes(query.toLowerCase())) {
    intent.query = query
  }

  return intent
}

