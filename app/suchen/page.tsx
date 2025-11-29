'use client';

import { useState, useRef, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import ChatSidebar from '@/components/ChatSidebar';
import WelcomeScreen from '@/components/WelcomeScreen';
import ChatCourseCard from '@/components/ChatCourseCard';
import { supabase } from '@/lib/supabase';
import { 
  orderCoursesByRecommendation, 
  enhanceCourseWithRecommendationContext,
  extractCoursesFromFollowUp 
} from '@/lib/course-recommendation-parser';
import { FEATURES } from '@/config/features';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  courses?: any[];  // Optional courses array for AI messages
  searchMeta?: {
    hasMore: boolean;
    nextOffset: number;
    total: number;
    filters: {
      query?: string;
      category?: string;
      format?: string;
      location?: string;
      funding?: string;
      language?: string;
    };
  };
}

interface SearchState {
  query: string;
  filters: {
    query?: string;
    category?: string;
    format?: string;
    location?: string;
    funding?: string;
    language?: string;
  };
  offset: number;
  hasMore: boolean;
  totalCount: number;
}

function ChatContent() {
  const searchParams = useSearchParams();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingQuery, setLoadingQuery] = useState(''); // Track the current search query for loading animation
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [currentSearch, setCurrentSearch] = useState<SearchState>({
    query: '',
    filters: {},
    offset: 0,
    hasMore: false,
    totalCount: 0
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Load conversation from URL parameter
  useEffect(() => {
    const chatId = searchParams.get('chat');
    if (chatId) {
      loadConversation(chatId);
    }
  }, [searchParams]);

  // Load a conversation by ID
  const loadConversation = async (conversationId: string) => {
    try {
      console.log('📥 Loading conversation:', conversationId);
      setLoading(true);

      // Fetch all messages for this conversation_id
      const { data: chatMessages, error } = await supabase
        .from('chat_history')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('❌ Error loading conversation:', error);
        return;
      }

      if (chatMessages && chatMessages.length > 0) {
        console.log('✅ Loaded', chatMessages.length, 'messages');
        
        // Convert database messages to chat format with courses
        const loadedMessages: Message[] = chatMessages.map(msg => ({
          role: msg.role as 'user' | 'assistant',
          content: msg.content,
          courses: msg.courses || undefined, // Restore courses from history
        }));

        setMessages(loadedMessages);
        console.log('📚 Restored courses for', loadedMessages.filter(m => m.courses && m.courses.length > 0).length, 'messages');
      } else {
        console.warn('⚠️ No messages found for conversation:', conversationId);
      }
    } catch (error) {
      console.error('❌ Exception loading conversation:', error);
    } finally {
      setLoading(false);
      setLoadingQuery('');
    }
  };

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Extract the main course/topic from user query for loading animation
  const extractSearchTopic = (query: string): string => {
    // Remove common filler words to get just the topic
    const fillerPatterns = [
      /^ich suche\s*(ein|einen|eine|nach)?\s*/i,
      /^zeige mir\s*/i,
      /^finde\s*(mir)?\s*/i,
      /^suche\s*(nach)?\s*/i,
      /^ich möchte\s*/i,
      /^welche\s*/i,
      /^gibt es\s*/i,
      /^looking for\s*/i,
      /^show me\s*/i,
      /^find\s*/i,
      /\s*mit bildungsgutschein\s*/gi,
      /\s*in berlin\s*/gi,
      /\s*in münchen\s*/gi,
      /\s*in hamburg\s*/gi,
      /\s*in köln\s*/gi,
      /\s*oder remote\s*/gi,
      /\s*online\s*/gi,
      /\s*bootcamp(s)?\s*/gi,
      /\s*kurs(e)?\s*/gi,
      /\s*course(s)?\s*/gi,
    ];
    
    let topic = query.trim();
    
    // Apply each pattern
    for (const pattern of fillerPatterns) {
      topic = topic.replace(pattern, ' ');
    }
    
    // Clean up extra spaces and trim
    topic = topic.replace(/\s+/g, ' ').trim();
    
    // If we stripped too much, use first few words of original
    if (topic.length < 3) {
      const words = query.split(/\s+/).slice(0, 4);
      topic = words.join(' ');
    }
    
    // Capitalize first letter
    if (topic.length > 0) {
      topic = topic.charAt(0).toUpperCase() + topic.slice(1);
    }
    
    return topic;
  };

  const handleExampleClick = (query: string) => {
    setInput(query);
    handleSubmit(null, query);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement> | null, exampleQuery: string | null = null) => {
    if (e) e.preventDefault();
    
    const userMessage = exampleQuery || input;
    if (!userMessage.trim()) return;

    // Check if user is asking for "more" courses
    const isShowMoreRequest = /mehr|weitere|show more|nächste|next/i.test(userMessage);
    
    if (isShowMoreRequest && currentSearch.hasMore) {
      // Handle "show more" request
      await handleShowMore();
      return;
    }

    // Reset search state on new query (unless it's a "show more" request)
    if (!isShowMoreRequest) {
      setCurrentSearch({
        query: '',
        filters: {},
        offset: 0,
        hasMore: false,
        totalCount: 0
      });
    }

    // Create new user message
    const newUserMessage = { role: 'user' as const, content: userMessage };
    
    // IMPORTANT: Store updated messages in variable BEFORE setState
    const updatedMessages = [...messages, newUserMessage];
    
    // Update UI immediately
    setMessages(updatedMessages);
    setInput('');
    
    // Reset textarea height to minimum
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
    
    setLoading(true);
    setLoadingQuery(userMessage); // Store the query for the loading animation

    try {
      // ✅ CORRECT: Send ENTIRE conversation history
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          messages: updatedMessages  // ← Send ALL messages including new one
        }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();

      // Debug: Log the API response
      console.log('📥 API Response:', {
        hasMessage: !!data.message,
        hasCourses: !!data.courses,
        coursesLength: Array.isArray(data.courses) ? data.courses.length : 0,
        coursesType: typeof data.courses,
        coursesIsArray: Array.isArray(data.courses),
        hasConversationId: !!data.conversation_id
      });

      // Update URL with conversation_id if provided (for new conversations)
      if (data.conversation_id && !searchParams.get('chat')) {
        const newUrl = `/suchen?chat=${data.conversation_id}`;
        window.history.pushState({}, '', newUrl);
        console.log('🔗 Updated URL with conversation_id:', data.conversation_id);
      }

      // DEDUPLICATE courses from API response BEFORE storing
      let uniqueCoursesFromAPI: any[] = [];
      if (Array.isArray(data.courses) && data.courses.length > 0) {
        const seenIds = new Set<string>();
        const seenTitles = new Set<string>();
        uniqueCoursesFromAPI = data.courses.filter((course: any) => {
          const courseId = course.id?.toString();
          const courseTitle = course.title?.toLowerCase().trim();
          
          // Skip if we've seen this ID or title before
          if (courseId && seenIds.has(courseId)) {
            console.log('🔄 Frontend: Removing duplicate by ID:', courseId);
            return false;
          }
          if (courseTitle && seenTitles.has(courseTitle)) {
            console.log('🔄 Frontend: Removing duplicate by title:', courseTitle);
            return false;
          }
          
          if (courseId) seenIds.add(courseId);
          if (courseTitle) seenTitles.add(courseTitle);
          return true;
        });
        
        if (uniqueCoursesFromAPI.length !== data.courses.length) {
          console.log('✅ Frontend deduplication:', data.courses.length, '→', uniqueCoursesFromAPI.length);
        }
      }
      
      // Add AI response WITH deduplicated courses
      const assistantMessage: Message = { 
        role: 'assistant' as const, 
        content: data.response || data.message || 'Keine Antwort erhalten.',
        courses: uniqueCoursesFromAPI,
        searchMeta: data.searchMeta
      };
      
      console.log('💬 Assistant message created:', {
        contentLength: assistantMessage.content.length,
        coursesCount: assistantMessage.courses?.length || 0,
        searchMeta: assistantMessage.searchMeta
      });
      
      // Save search state if search metadata is available
      if (data.searchMeta) {
        setCurrentSearch({
          query: data.searchMeta.filters.query || '',
          filters: data.searchMeta.filters,
          offset: data.searchMeta.nextOffset || 10,
          hasMore: data.searchMeta.hasMore,
          totalCount: data.searchMeta.total
        });
      }
      
      setMessages(prev => [...prev, assistantMessage]);
      
      // Trigger sidebar reload by dispatching a custom event
      // This will tell ChatSidebar to reload conversations
      window.dispatchEvent(new CustomEvent('chatHistoryUpdated'));
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Entschuldigung, es ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut.' 
      }]);
    } finally {
      setLoading(false);
      setLoadingQuery('');
    }
  };

  const startNewChat = () => {
    setMessages([]);
    setInput('');
    setSidebarOpen(false);
    setCurrentSearch({
      query: '',
      filters: {},
      offset: 0,
      hasMore: false,
      totalCount: 0
    });
    // Clear URL parameter
    window.history.pushState({}, '', '/suchen');
    console.log('🆕 Started new chat - cleared URL');
  };

  const handleShowMore = async () => {
    if (!currentSearch.hasMore || isLoadingMore) return;
    
    setIsLoadingMore(true);
    
    try {
      const response = await fetch('/api/ai/search-courses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: currentSearch.filters.query || '',
          category: currentSearch.filters.category,
          format: currentSearch.filters.format,
          location: currentSearch.filters.location,
          funding: currentSearch.filters.funding,
          language: currentSearch.filters.language,
          maxResults: 10,
          offset: currentSearch.offset
        })
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.courses && data.courses.length > 0) {
        // Append new courses to the last assistant message
        setMessages(prev => {
          const newMessages = [...prev];
          const lastAssistantIndex = newMessages.length - 1;
          
          if (lastAssistantIndex >= 0 && newMessages[lastAssistantIndex].role === 'assistant') {
            const lastMessage = newMessages[lastAssistantIndex];
            newMessages[lastAssistantIndex] = {
              ...lastMessage,
              courses: [...(lastMessage.courses || []), ...data.courses]
            };
          }
          
          return newMessages;
        });

        // Update search state
        setCurrentSearch(prev => ({
          ...prev,
          offset: data.nextOffset || prev.offset + 10,
          hasMore: data.hasMore || false
        }));
      }
    } catch (error) {
      console.error('Error loading more courses:', error);
      // Add error message to chat
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Entschuldigung, es gab einen Fehler beim Laden weiterer Kurse. Bitte versuchen Sie es erneut.'
      }]);
    } finally {
      setIsLoadingMore(false);
    }
  };

  return (
    <div className="flex h-screen bg-[#FFFBF5]">
      
      {/* MOBILE STICKY HEADER - Only visible on mobile */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 lg:hidden">
        <div className="flex items-center justify-between h-14 px-4">
          {/* Hamburger button - left */}
          <button 
            onClick={() => setSidebarOpen(true)} 
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Open menu"
          >
            <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          
          {/* Logo - center - Larger and clickable */}
          <Link href="/suchen">
            <Image 
              src="/Assets/kursfind-ai-logo.jpg" 
              width={40} 
              height={40} 
              alt="Kursfind AI"
              className="rounded-lg cursor-pointer"
            />
          </Link>
          
          {/* New Chat button - right */}
          <button 
            onClick={startNewChat} 
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="New chat"
          >
            <svg className="w-6 h-6 text-cyan-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>
      </div>

      {/* DESKTOP: Floating Hamburger Button - Top Left - Hide when sidebar is open */}
      {!sidebarOpen && (
        <button
          onClick={() => setSidebarOpen(true)} 
          className="hidden lg:flex fixed top-4 left-4 z-50 p-3 bg-white rounded-lg shadow-lg hover:shadow-xl transition-all border border-gray-200"
          aria-label="Open menu"
        >
          <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      )}

      {/* DESKTOP: Floating New Chat Button - Top Right */}
      <button 
        onClick={startNewChat} 
        className="hidden lg:flex fixed top-4 right-4 z-50 items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-cyan-500 to-emerald-500 text-white rounded-lg hover:shadow-xl transition-all font-medium shadow-lg"
        aria-label="New chat"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        <span>Neuer Chat</span>
      </button>
      
      {/* Sidebar */}
      <ChatSidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">

        {/* Chat Area - Add padding-top for mobile header only */}
        <main className="flex-1 overflow-y-auto pt-14 lg:pt-0">
          <div className="max-w-4xl mx-auto px-4 py-8">
            
            {/* Show Welcome Screen if no messages */}
            {messages.length === 0 ? (
              <WelcomeScreen onExampleClick={handleExampleClick} />
            ) : (
              <div className="space-y-6">
                {messages.map((message, idx) => (
                  <div
                    key={idx}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    
                    {/* USER MESSAGE */}
                    {message.role === 'user' && (
                      <div className="max-w-full sm:max-w-[90%] lg:max-w-[80%] ml-auto bg-gradient-to-r from-cyan-50 to-emerald-50 border-2 border-cyan-200 text-gray-900 rounded-2xl rounded-tr-sm px-4 sm:px-6 py-3 sm:py-4 shadow-lg">
                        <p className="text-sm sm:text-base leading-relaxed">{message.content}</p>
                      </div>
                    )}
                    
                    {/* AI MESSAGE - WITH MARKDOWN RENDERING */}
                    {message.role === 'assistant' && (
                      <div className="max-w-full sm:max-w-[90%] lg:max-w-[80%] mr-auto bg-white rounded-2xl rounded-tl-sm px-4 sm:px-6 py-3 sm:py-4 shadow-lg border border-gray-200">
                        <div className="flex items-start gap-3">
                          <div className="relative flex-shrink-0">
                            <Image 
                              src="/Assets/kursfind-ai-logo.jpg" 
                              width={32} 
                              height={32}
                              className="rounded-lg animate-pulse"
                              alt="Kursfind AI"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-semibold text-gray-900 mb-2">Kursfind AI</div>
                            
                            {/* MARKDOWN CONTENT - Consistent text sizing and visible list markers */}
                            <div className="prose prose-sm max-w-none mb-4">
                              <ReactMarkdown
                                components={{
                                  // Bold text - Consistent size with paragraph
                                  strong: ({node, ...props}) => (
                                    <strong 
                                      className="font-bold text-[15px] sm:text-base" 
                                      style={{ color: '#1f2937', fontWeight: 700 }} 
                                      {...props} 
                                    />
                                  ),
                                  // Italic text
                                  em: ({node, ...props}) => (
                                    <em 
                                      className="italic text-[15px] sm:text-base" 
                                      style={{ color: '#374151' }} 
                                      {...props} 
                                    />
                                  ),
                                  // Paragraphs - Consistent 15px on mobile, 16px on desktop
                                  p: ({node, ...props}) => (
                                    <p 
                                      className="mb-2.5 sm:mb-3 last:mb-0 leading-relaxed text-[15px] sm:text-base" 
                                      style={{ color: '#374151' }} 
                                      {...props} 
                                    />
                                  ),
                                  // Headings - Slightly larger than body text
                                  h1: ({node, ...props}) => (
                                    <h1 
                                      className="text-lg sm:text-xl font-bold mb-2 sm:mb-3" 
                                      style={{ color: '#111827', fontWeight: 700 }} 
                                      {...props} 
                                    />
                                  ),
                                  h2: ({node, ...props}) => (
                                    <h2 
                                      className="text-[17px] sm:text-lg font-bold mb-2 sm:mb-2.5" 
                                      style={{ color: '#111827', fontWeight: 700 }} 
                                      {...props} 
                                    />
                                  ),
                                  h3: ({node, ...props}) => (
                                    <h3 
                                      className="text-[16px] sm:text-base font-bold mb-1.5 sm:mb-2" 
                                      style={{ color: '#111827', fontWeight: 700 }} 
                                      {...props} 
                                    />
                                  ),
                                  // Lists - FIXED: Visible markers with explicit dark color
                                  ul: ({node, ...props}) => (
                                    <ul 
                                      className="my-2 sm:my-3 ml-4 sm:ml-5 space-y-1.5 sm:space-y-2 list-disc"
                                      style={{
                                        color: '#374151',
                                        listStyleType: 'disc',
                                        listStylePosition: 'outside',
                                      }}
                                      {...props} 
                                    />
                                  ),
                                  ol: ({node, ...props}) => (
                                    <ol 
                                      className="my-2 sm:my-3 ml-4 sm:ml-5 space-y-1.5 sm:space-y-2 list-decimal"
                                      style={{
                                        color: '#374151',
                                        listStyleType: 'decimal',
                                        listStylePosition: 'outside',
                                      }}
                                      {...props} 
                                    />
                                  ),
                                  // List items - FIXED: Explicit marker color and consistent text size
                                  li: ({node, children, ...props}) => (
                                    <li 
                                      className="leading-relaxed text-[15px] sm:text-base marker:text-gray-600 marker:font-normal"
                                      style={{
                                        display: 'list-item',
                                        color: '#374151',
                                      }}
                                      {...props}
                                    >
                                      {children}
                                    </li>
                                  ),
                                  // Links - Visible cyan color
                                  a: ({node, ...props}) => (
                                    <a 
                                      className="underline font-medium text-[15px] sm:text-base" 
                                      style={{ color: '#0891b2' }} 
                                      {...props} 
                                    />
                                  ),
                                  // Code - Dark text
                                  code: ({node, ...props}: any) => {
                                    const inline = !props.className?.includes('language-');
                                    return inline 
                                      ? <code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm font-mono" style={{ color: '#1f2937' }} {...props} />
                                      : <code className="block bg-gray-100 p-3 rounded-lg text-sm font-mono overflow-x-auto" style={{ color: '#1f2937' }} {...props} />;
                                  },
                                }}
                              >
                                {message.content}
                              </ReactMarkdown>
                            </div>

                            {/* COURSE CARDS - ENHANCED WITH SMART ORDERING */}
                            {(() => {
                              const hasCourses = message.courses && Array.isArray(message.courses) && message.courses.length > 0;
                              const searchMeta = message.searchMeta;
                              // Show "Show More" button only on the last assistant message with courses and if there are more results
                              const isLastMessage = idx === messages.length - 1;
                              // Show "Show More" button if there are more results available
                              const showMoreButton = (searchMeta?.hasMore || currentSearch.hasMore) && isLastMessage;
                              
                              if (!hasCourses && message.role === 'assistant') {
                                console.log('🔍 No courses to render:', {
                                  hasCoursesProp: !!message.courses,
                                  coursesType: typeof message.courses,
                                  coursesIsArray: Array.isArray(message.courses),
                                  coursesLength: message.courses?.length || 0
                                });
                              }
                              
                              // ENHANCED: Track previously shown courses
                              const previouslyShownCourseIds = messages
                                .slice(0, idx)
                                .filter(m => m.courses && m.courses.length > 0)
                                .flatMap(m => m.courses || [])
                                .map(c => c.id?.toString() || '');
                              
                              // DEDUPLICATE COURSES AT FRONTEND - Safety net
                              let deduplicatedCourses = message.courses || [];
                              if (deduplicatedCourses.length > 0) {
                                const seenIds = new Set<string>();
                                const seenTitles = new Set<string>();
                                deduplicatedCourses = deduplicatedCourses.filter((course: any) => {
                                  const courseId = course.id?.toString();
                                  const courseTitle = course.title?.toLowerCase().trim();
                                  
                                  if (courseId && seenIds.has(courseId)) return false;
                                  if (courseTitle && seenTitles.has(courseTitle)) return false;
                                  
                                  if (courseId) seenIds.add(courseId);
                                  if (courseTitle) seenTitles.add(courseTitle);
                                  return true;
                                });
                              }
                              
                              // SMART CARD ORDERING: Reorder courses based on AI recommendations
                              let coursesToDisplay = deduplicatedCourses;
                              if (FEATURES.SMART_CARD_ORDERING && deduplicatedCourses.length > 0 && message.content) {
                                coursesToDisplay = orderCoursesByRecommendation(
                                  deduplicatedCourses,
                                  message.content,
                                  previouslyShownCourseIds
                                );
                              }
                              
                              // ENHANCED: Check if this is a follow-up with no courses but mentions existing ones
                              // CRITICAL: Only do this if message has NO courses from API
                              if (!hasCourses && message.role === 'assistant' && message.content) {
                                const allPreviousCourses = messages
                                  .slice(0, idx)
                                  .filter(m => m.courses && m.courses.length > 0)
                                  .flatMap(m => m.courses || []);
                                
                                const followUpCourses = extractCoursesFromFollowUp(
                                  message.content,
                                  allPreviousCourses,
                                  messages.slice(0, idx)
                                );
                                
                                if (followUpCourses.length > 0) {
                                  console.log('🔄 Follow-up detected, re-showing courses:', followUpCourses.length);
                                  coursesToDisplay = followUpCourses;
                                }
                              }
                              
                              // FINAL DEDUPLICATION: Just to be absolutely sure
                              if (coursesToDisplay.length > 0) {
                                const finalSeenIds = new Set<string>();
                                const finalSeenTitles = new Set<string>();
                                coursesToDisplay = coursesToDisplay.filter((course: any) => {
                                  const id = course.id?.toString();
                                  const title = course.title?.toLowerCase().trim();
                                  if (id && finalSeenIds.has(id)) return false;
                                  if (title && finalSeenTitles.has(title)) return false;
                                  if (id) finalSeenIds.add(id);
                                  if (title) finalSeenTitles.add(title);
                                  return true;
                                });
                              }
                              
                              const shouldRenderCards = coursesToDisplay && coursesToDisplay.length > 0;
                              
                              return shouldRenderCards ? (
                                <div className="space-y-3 mt-4">
                                  {/* Context message */}
                                  {searchMeta && searchMeta.total > 0 && (
                                    <p className="text-sm text-gray-600 mb-2">
                                      {searchMeta.total > coursesToDisplay.length 
                                        ? `Ich habe ${searchMeta.total} passende Kurse gefunden. Hier sind die ersten ${coursesToDisplay.length}:`
                                        : `Ich habe ${coursesToDisplay.length} passende Kurse gefunden:`
                                      }
                                    </p>
                                  )}
                                  
                                  {/* Course cards with full design and smart ordering - Grid layout: 2 cols on desktop, 1 on mobile */}
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {coursesToDisplay.map((course: any, courseIdx: number) => {
                                      // Enhance course with recommendation context
                                      const enhancedCourse = FEATURES.SMART_CARD_ORDERING 
                                        ? enhanceCourseWithRecommendationContext(
                                            course, 
                                            message.content,
                                            previouslyShownCourseIds
                                          )
                                        : course;
                                      
                                      return (
                                        <ChatCourseCard 
                                          key={`${course.id}-${idx}-${courseIdx}`} 
                                          course={enhancedCourse}
                                          showRecommendedBadge={enhancedCourse._isRecommended}
                                          badgeType={enhancedCourse._badgeType}
                                          ranking={enhancedCourse._ranking}
                                          isDuplicate={enhancedCourse._isDuplicate}
                                        />
                                      );
                                    })}
                                  </div>

                                  {/* SMART CTA: Encourage Multiple Applications (4+ courses) */}
                                  {/* BUSINESS IMPACT: Increases application success rate & lead generation */}
                                  {/* FEATURE_FLAG: SHOW_MULTI_APPLICATION_CTA */}
                                  {FEATURES.SHOW_MULTI_APPLICATION_CTA && coursesToDisplay.length >= FEATURES.CTA_MIN_COURSES && (
                                    <div className="mt-4 p-4 bg-gradient-to-r from-amber-50 to-yellow-50 border-l-4 border-amber-400 rounded-lg shadow-sm">
                                      <div className="flex items-start gap-3">
                                        <div className="flex-shrink-0 text-2xl">💡</div>
                                        <div className="flex-1">
                                          <p className="text-sm font-semibold text-gray-800 mb-1">
                                            {message.content.toLowerCase().includes('english') || 
                                             message.content.toLowerCase().includes('tip') ? 
                                              'Tip for Success:' : 
                                              'Tipp für mehr Erfolg:'}
                                          </p>
                                          <p className="text-sm text-gray-700 leading-relaxed">
                                            {message.content.toLowerCase().includes('english') || 
                                             message.content.toLowerCase().includes('tip') ? 
                                              'For the best chance of getting a spot, apply to at least 5–10 courses. The more applications you submit, the better your choices and your odds of landing a great course!' :
                                              'Für die besten Chancen, bewirb dich auf mindestens 5-10 Kurse! Je mehr Bewerbungen, desto besser stehen deine Auswahlmöglichkeiten und deine Chancen auf einen Platz.'}
                                          </p>
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                  
                                  {/* Show More Button */}
                                  {showMoreButton && (
                                    <div className="mt-4 flex items-center justify-center">
                                      <button
                                        onClick={handleShowMore}
                                        disabled={isLoadingMore}
                                        className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-emerald-500 text-white rounded-lg hover:from-cyan-600 hover:to-emerald-600 transition-all font-medium shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                      >
                                        {isLoadingMore ? (
                                          <>
                                            <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            <span>Lade weitere Kurse...</span>
                                          </>
                                        ) : (
                                          <>
                                            <span>
                                              {currentSearch.totalCount > 0 
                                                ? `Weitere ${Math.max(0, currentSearch.totalCount - currentSearch.offset)} Kurse anzeigen`
                                                : searchMeta?.total 
                                                  ? `Weitere ${Math.max(0, searchMeta.total - (message.courses?.length || 0))} Kurse anzeigen`
                                                  : 'Weitere Kurse anzeigen'
                                              }
                                            </span>
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                            </svg>
                                          </>
                                        )}
                                      </button>
                                    </div>
                                  )}
                                </div>
                              ) : null;
                            })()}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}

                {/* Loading indicator - Website-style search animation */}
                {loading && (
                  <div className="flex justify-center w-full">
                    <div className="bg-white border border-gray-200 rounded-2xl shadow-lg px-6 sm:px-8 py-5 sm:py-6 max-w-md w-full mx-4">
                      {/* Sparkle icon + Progress bar */}
                      <div className="flex items-center gap-3 mb-4">
                        <svg className="w-6 h-6 text-cyan-500 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                        </svg>
                        <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-cyan-500 to-emerald-500 rounded-full animate-progress-bar"></div>
                        </div>
                      </div>
                      {/* Search query text - shows just the topic, not full query */}
                      <p className="text-gray-700 text-base">
                        Suche nach{' '}
                        <span className="text-cyan-600 font-medium">
                          {extractSearchTopic(loadingQuery)}
                        </span>
                        {' ...'}
                      </p>
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>
        </main>

        {/* Input Area - Fixed at Bottom */}
        <div className="sticky bottom-0 bg-gradient-to-t from-[#FFFBF5] via-[#FFFBF5] to-transparent p-4">
          <div className="max-w-3xl mx-auto">
            <form onSubmit={handleSubmit} className="relative">
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => {
                  // Auto-resize functionality
                  const textarea = e.target;
                  textarea.style.height = 'auto';
                  textarea.style.height = Math.min(textarea.scrollHeight, 200) + 'px';
                  setInput(e.target.value);
                }}
                onKeyDown={(e) => {
                  // Send on Enter (without Shift)
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit(e as any, null);
                  }
                  // Shift+Enter allows new line (default behavior)
                }}
                placeholder="z.B. Ich suche einen Webentwicklung Kurs in Berlin mit Bildungsgutschein..."
                className="w-full min-h-[72px] max-h-[200px] resize-none overflow-auto pl-6 pr-32 py-4 border-2 border-gray-300 rounded-3xl focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 focus:outline-none shadow-lg text-gray-900 placeholder-gray-500 leading-relaxed bg-[#FFFBF5]"
                disabled={loading}
                rows={1}
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="absolute right-3 bottom-4 p-3 bg-gradient-to-r from-cyan-500 to-emerald-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Nachricht senden"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </form>
            <p className="text-xs text-center text-gray-500 mt-2">
              Kursfind AI kann Fehler machen. Überprüfen Sie wichtige Informationen.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Lade Chat...</p>
        </div>
      </div>
    }>
      <ChatContent />
    </Suspense>
  );
}