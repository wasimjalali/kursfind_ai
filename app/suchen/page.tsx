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
import { orderCoursesByRecommendation, enhanceCourseWithRecommendationContext } from '@/lib/course-recommendation-parser';

// ══════════════════════════════════════════════════════════════
// FEATURE FLAGS
// ══════════════════════════════════════════════════════════════
const ENABLE_SMART_CARD_ORDERING = true; // Enable intelligent course card ordering based on AI mentions

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
    }
  };

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

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

      // Add AI response WITH courses if available
      const assistantMessage: Message = { 
        role: 'assistant' as const, 
        content: data.response || data.message || 'Keine Antwort erhalten.',
        courses: Array.isArray(data.courses) ? data.courses : [],  // Ensure courses is always an array
        searchMeta: data.searchMeta  // Include search metadata if available
      };
      
      console.log('💬 Assistant message created:', {
        contentLength: assistantMessage.content.length,
        coursesLength: assistantMessage.courses?.length || 0,
        courses: assistantMessage.courses,
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
                            
                            {/* MARKDOWN CONTENT */}
                            <div className="prose prose-sm max-w-none mb-4 prose-headings:text-gray-900 prose-p:text-gray-700 prose-strong:!text-gray-900 prose-li:text-gray-700">
                              <ReactMarkdown
                                components={{
                                  // Bold text - ensure it's dark and visible (use !important to override prose defaults)
                                  strong: ({node, ...props}) => (
                                    <strong className="font-bold !text-gray-900" style={{ color: '#111827' }} {...props} />
                                  ),
                                  // Italic text
                                  em: ({node, ...props}) => (
                                    <em className="italic text-gray-700" {...props} />
                                  ),
                                  // Paragraphs
                                  p: ({node, ...props}) => (
                                    <p className="mb-3 last:mb-0 text-gray-700 leading-relaxed" {...props} />
                                  ),
                                  // Headings - Force black color
                                  h1: ({node, ...props}) => (
                                    <h1 className="text-xl font-bold mb-3" style={{color: '#111827'}} {...props} />
                                  ),
                                  h2: ({node, ...props}) => (
                                    <h2 className="text-lg font-bold mb-2" style={{color: '#111827'}} {...props} />
                                  ),
                                  h3: ({node, ...props}) => (
                                    <h3 className="text-base font-bold mb-2" style={{color: '#111827'}} {...props} />
                                  ),
                                  // Lists
                                  ul: ({node, ...props}) => (
                                    <ul className="ml-6 my-2 space-y-1 [&>li]:list-disc [&>li]:text-gray-900" style={{listStyleType: 'disc', listStylePosition: 'outside'}} {...props} />
                                  ),
                                  ol: ({node, ...props}) => (
                                    <ol className="ml-6 my-2 space-y-1 [&>li]:list-decimal [&>li]:text-gray-900" style={{listStyleType: 'decimal', listStylePosition: 'outside'}} {...props} />
                                  ),
                                  // @ts-ignore - ReactMarkdown renders li inside ul/ol
                                  li: ({node, ...props}) => (
                                    <li className="leading-relaxed ml-1 text-gray-900 marker:text-gray-900 marker:font-bold" style={{display: 'list-item'}} {...props} />
                                  ),
                                  // Links
                                  a: ({node, ...props}) => (
                                    <a className="text-cyan-600 hover:text-cyan-700 underline font-medium" {...props} />
                                  ),
                                  // Code
                                  code: ({node, ...props}: any) => {
                                    const inline = !props.className?.includes('language-');
                                    return inline 
                                      ? <code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm font-mono text-gray-800" {...props} />
                                      : <code className="block bg-gray-100 p-3 rounded-lg text-sm font-mono text-gray-800 overflow-x-auto" {...props} />;
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
                              
                              // SMART CARD ORDERING: Reorder courses based on AI recommendations
                              let coursesToDisplay = message.courses || [];
                              if (ENABLE_SMART_CARD_ORDERING && hasCourses && message.content) {
                                coursesToDisplay = orderCoursesByRecommendation(
                                  message.courses || [],
                                  message.content
                                );
                                console.log('🎯 Smart ordering applied:', {
                                  original: message.courses?.map(c => c.id),
                                  reordered: coursesToDisplay.map(c => c.id)
                                });
                              }
                              
                              return hasCourses && coursesToDisplay ? (
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
                                  
                                  {/* Course cards with full design and smart ordering */}
                                  <div className="space-y-3">
                                    {coursesToDisplay.map((course: any, courseIdx: number) => {
                                      // Enhance course with recommendation context
                                      const enhancedCourse = ENABLE_SMART_CARD_ORDERING 
                                        ? enhanceCourseWithRecommendationContext(course, message.content)
                                        : course;
                                      
                                      console.log('🎴 Rendering course card:', course.id, course.title, {
                                        isRecommended: enhancedCourse._isRecommended,
                                        position: courseIdx
                                      });
                                      
                                      return (
                                        <ChatCourseCard 
                                          key={`${course.id}-${idx}-${courseIdx}`} 
                                          course={enhancedCourse}
                                          showRecommendedBadge={enhancedCourse._isRecommended}
                                        />
                                      );
                                    })}
                                  </div>
                                  
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

                {/* Loading indicator */}
                {loading && (
                  <div className="flex justify-start">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-cyan-500 to-emerald-500 flex items-center justify-center mr-3 animate-pulse">
                      <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                      </svg>
                    </div>
                    <div className="bg-white text-gray-800 border border-gray-200 px-6 py-4 rounded-2xl shadow-lg">
                      <div className="flex items-center space-x-3">
                        <div className="flex space-x-2">
                          <div className="w-2 h-2 bg-cyan-500 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-cyan-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                          <div className="w-2 h-2 bg-cyan-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                        </div>
                        <span className="text-sm text-gray-600 font-medium">KI denkt...</span>
                      </div>
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
