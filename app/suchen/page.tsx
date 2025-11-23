'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import ReactMarkdown from 'react-markdown';
import ChatSidebar from '@/components/ChatSidebar';
import WelcomeScreen from '@/components/WelcomeScreen';
import ChatCourseCard from '@/components/ChatCourseCard';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  courses?: any[];  // Optional courses array for AI messages
}

export default function Home() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [renderKey, setRenderKey] = useState(0); // Force re-render trigger
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

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

      // Debug logging
      console.log('📥 API Response received:', {
        hasMessage: !!data.message,
        hasResponse: !!data.response,
        hasCourses: !!data.courses,
        coursesCount: Array.isArray(data.courses) ? data.courses.length : 0,
        coursesType: typeof data.courses
      });

      // Add AI response WITH courses if available
      const aiMessage = { 
        role: 'assistant' as const, 
        content: data.response || data.message || 'Keine Antwort erhalten.',
        courses: Array.isArray(data.courses) && data.courses.length > 0 ? data.courses : []
      };

      console.log('💬 Assistant message created:', {
        contentLength: aiMessage.content.length,
        coursesCount: aiMessage.courses?.length || 0,
        coursesIsArray: Array.isArray(aiMessage.courses)
      });

      // Update messages state
      setMessages(prev => {
        const updated = [...prev, aiMessage];
        console.log('✅ Messages state updated, total messages:', updated.length);
        return updated;
      });

      // Force re-render if courses exist
      if (aiMessage.courses && aiMessage.courses.length > 0) {
        console.log('🔄 Triggering force re-render for', aiMessage.courses.length, 'courses');
        setRenderKey(prev => prev + 1);
      }
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

  return (
    <div className="flex h-screen bg-[#FFFBF5]">
      
      {/* Sidebar */}
      <ChatSidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

      {/* Floating Open Button (when sidebar is closed) */}
      {!sidebarOpen && (
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setSidebarOpen(true);
          }}
          className="fixed top-4 left-4 z-40 p-2 bg-white border-2 border-gray-300 rounded-lg shadow-lg hover:bg-gray-50 hover:border-cyan-500 transition-all"
          aria-label="Open sidebar"
        >
          <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      )}

      {/* Main Content */}
      <div className={`flex-1 flex flex-col transition-all duration-300 ${
        sidebarOpen ? 'ml-[260px]' : 'ml-0'
      }`}>

        {/* Chat Area */}
        <main className="flex-1 overflow-y-auto">
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
                      <div className="max-w-3xl bg-gradient-to-r from-cyan-50 to-emerald-50 border-2 border-cyan-200 text-gray-900 rounded-2xl rounded-tr-sm px-6 py-4 shadow-lg">
                        <p className="text-base leading-relaxed">{message.content}</p>
                      </div>
                    )}
                    
                    {/* AI MESSAGE - WITH MARKDOWN RENDERING */}
                    {message.role === 'assistant' && (
                      <div className="max-w-3xl bg-white rounded-2xl rounded-tl-sm px-6 py-4 shadow-lg border border-gray-200">
                        <div className="flex items-start gap-3">
                          <div className="relative flex-shrink-0">
                            <Image 
                              src="/Assets/Kursfind-logo.png" 
                              width={32} 
                              height={32}
                              className="rounded-lg animate-pulse"
                              alt="Kursfind AI"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-semibold text-gray-900 mb-2">Kursfind AI</div>
                            
                            {/* MARKDOWN CONTENT */}
                            <div className="prose prose-sm max-w-none mb-4">
                              <ReactMarkdown
                                components={{
                                  // Bold text
                                  strong: ({node, ...props}) => (
                                    <strong className="font-bold text-gray-900" {...props} />
                                  ),
                                  // Italic text
                                  em: ({node, ...props}) => (
                                    <em className="italic text-gray-700" {...props} />
                                  ),
                                  // Paragraphs
                                  p: ({node, ...props}) => (
                                    <p className="mb-3 last:mb-0 text-gray-700 leading-relaxed" {...props} />
                                  ),
                                  // Headings
                                  h1: ({node, ...props}) => (
                                    <h1 className="text-xl font-bold mb-3 text-gray-900" {...props} />
                                  ),
                                  h2: ({node, ...props}) => (
                                    <h2 className="text-lg font-bold mb-2 text-gray-900" {...props} />
                                  ),
                                  h3: ({node, ...props}) => (
                                    <h3 className="text-base font-bold mb-2 text-gray-900" {...props} />
                                  ),
                                  // Lists
                                  ul: ({node, ...props}) => (
                                    <ul className="list-disc ml-5 my-2 space-y-1 text-gray-700" {...props} />
                                  ),
                                  ol: ({node, ...props}) => (
                                    <ol className="list-decimal ml-5 my-2 space-y-1 text-gray-700" {...props} />
                                  ),
                                  // @ts-ignore - ReactMarkdown renders li inside ul/ol
                                  li: ({node, ...props}) => (
                                    <li className="leading-relaxed" {...props} />
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

                            {/* COURSE CARDS - NEW! */}
                            {message.courses && message.courses.length > 0 && (
                              <div className="space-y-3 mt-4" key={`courses-${renderKey}`}>
                                {(() => {
                                  console.log('🎴 Rendering', message.courses.length, 'course cards');
                                  return message.courses.map((course: any, index: number) => {
                                    console.log('  - Course', index + 1, ':', course.id, course.title);
                                    return <ChatCourseCard key={`${course.id}-${renderKey}-${index}`} course={course} />;
                                  });
                                })()}
                              </div>
                            )}
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
                className="w-full min-h-[72px] max-h-[200px] resize-none overflow-auto pl-6 pr-32 py-4 border-2 border-gray-300 rounded-3xl focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 focus:outline-none shadow-lg text-gray-900 placeholder-gray-500 leading-relaxed"
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
