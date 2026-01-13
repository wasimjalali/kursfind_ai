'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useStudentLanguage } from '../StudentDashboardClient';

export default function ChatHistoryClient({ initialChatHistory, student }) {
  const router = useRouter();
  const [chatHistory, setChatHistory] = useState(initialChatHistory);
  const [selectedChats, setSelectedChats] = useState(new Set());
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectMode, setSelectMode] = useState(false);
  const { labels, lang } = useStudentLanguage();

  // Toggle select mode
  const toggleSelectMode = () => {
    setSelectMode(!selectMode);
    setSelectedChats(new Set());
  };

  // Toggle individual chat selection
  const toggleChatSelection = (chatId) => {
    const newSelected = new Set(selectedChats);
    if (newSelected.has(chatId)) {
      newSelected.delete(chatId);
    } else {
      newSelected.add(chatId);
    }
    setSelectedChats(newSelected);
  };

  // Select all chats
  const selectAll = () => {
    if (selectedChats.size === chatHistory.length) {
      setSelectedChats(new Set());
    } else {
      setSelectedChats(new Set(chatHistory.map(chat => chat.conversation_id)));
    }
  };

  // Delete selected chats
  const deleteSelectedChats = async () => {
    if (selectedChats.size === 0) return;

    const confirmMessage = selectedChats.size === 1
      ? (lang === 'de' ? 'Möchten Sie diesen Chat wirklich löschen?' : 'Do you really want to delete this chat?')
      : (lang === 'de' ? `Möchten Sie ${selectedChats.size} Chats wirklich löschen?` : `Do you really want to delete ${selectedChats.size} chats?`);

    if (!confirm(confirmMessage)) return;

    setIsDeleting(true);

    try {
      const deletePromises = Array.from(selectedChats).map(conversationId =>
        fetch('/api/student/delete-chat', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ conversation_id: conversationId })
        })
      );

      const results = await Promise.all(deletePromises);
      const failedDeletes = results.filter(r => !r.ok);

      if (failedDeletes.length > 0) {
        alert(lang === 'de' ? `${failedDeletes.length} Chat(s) konnten nicht gelöscht werden` : `${failedDeletes.length} chat(s) could not be deleted`);
      }

      // Remove deleted chats from state
      setChatHistory(chatHistory.filter(chat => !selectedChats.has(chat.conversation_id)));
      setSelectedChats(new Set());
      setSelectMode(false);

      // Dispatch event to notify sidebar and other components
      window.dispatchEvent(new CustomEvent('chatHistoryUpdated'));

      // Refresh the page to update data
      router.refresh();
    } catch (error) {
      console.error('Error deleting chats:', error);
      alert(lang === 'de' ? 'Fehler beim Löschen der Chats' : 'Error deleting chats');
    } finally {
      setIsDeleting(false);
    }
  };

  // Delete single chat
  const deleteSingleChat = async (conversationId) => {
    if (!confirm(lang === 'de' ? 'Möchten Sie diesen Chat wirklich löschen?' : 'Do you really want to delete this chat?')) return;

    try {
      const response = await fetch('/api/student/delete-chat', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ conversation_id: conversationId })
      });

      if (response.ok) {
        setChatHistory(chatHistory.filter(chat => chat.conversation_id !== conversationId));
        
        // Dispatch event to notify sidebar and other components
        window.dispatchEvent(new CustomEvent('chatHistoryUpdated'));
        
        router.refresh();
      } else {
        alert(lang === 'de' ? 'Fehler beim Löschen des Chats' : 'Error deleting chat');
      }
    } catch (error) {
      console.error('Error deleting chat:', error);
      alert(lang === 'de' ? 'Fehler beim Löschen des Chats' : 'Error deleting chat');
    }
  };

  return (
    <>
      {/* Stats and Actions - Mobile Optimized */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <span className="text-2xl">💬</span>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {chatHistory?.length || 0}
              </p>
              <p className="text-sm text-gray-600">{labels?.chatHistory?.savedConversations || 'Gespeicherte Unterhaltungen'}</p>
            </div>
          </div>

          {chatHistory && chatHistory.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              {selectMode && (
                <>
                  <button
                    onClick={selectAll}
                    className="px-3 py-2 text-xs sm:text-sm font-semibold text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    {selectedChats.size === chatHistory.length ? (lang === 'de' ? 'Abwählen' : 'Deselect') : (lang === 'de' ? 'Alle' : 'All')}
                  </button>
                  {selectedChats.size > 0 && (
                    <button
                      onClick={deleteSelectedChats}
                      disabled={isDeleting}
                      className="px-3 py-2 text-xs sm:text-sm font-semibold text-white bg-red-500 rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50"
                    >
                      {isDeleting ? '...' : (lang === 'de' ? `${selectedChats.size} löschen` : `Delete ${selectedChats.size}`)}
                    </button>
                  )}
                </>
              )}
              <button
                onClick={toggleSelectMode}
                className={`px-3 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-colors ${
                  selectMode
                    ? 'text-gray-700 border border-gray-300 hover:bg-gray-50'
                    : 'text-cyan-600 border border-cyan-300 hover:bg-cyan-50'
                }`}
              >
                {selectMode ? (labels?.common?.cancel || 'Abbrechen') : (labels?.common?.select || 'Auswählen')}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Chat History List - Mobile Optimized */}
      {chatHistory && chatHistory.length > 0 ? (
        <div className="space-y-4">
          {chatHistory.map((chat) => {
            const messages = chat.messages || [];
            const lastMessage = messages[messages.length - 1];
            const isSelected = selectedChats.has(chat.conversation_id);

            return (
              <div
                key={chat.id}
                className={`bg-white rounded-xl shadow-sm border-2 transition-all ${
                  isSelected
                    ? 'border-cyan-500 bg-cyan-50'
                    : 'border-gray-200 hover:shadow-md'
                }`}
              >
                <div className="p-4 sm:p-6">
                  {/* Header row with checkbox and icon */}
                  <div className="flex items-start gap-3 mb-3">
                    {selectMode && (
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleChatSelection(chat.conversation_id)}
                        className="mt-1 w-5 h-5 text-cyan-600 border-gray-300 rounded focus:ring-cyan-500 flex-shrink-0"
                      />
                    )}
                    <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-emerald-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-lg">🤖</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-1 line-clamp-2">
                        {chat.title || chat.conversation_title || (lang === 'de' ? 'Neue Konversation' : 'New Conversation')}
                      </h3>
                      <p className="text-xs sm:text-sm text-gray-600">
                        {new Date(chat.created_at).toLocaleDateString(lang === 'de' ? 'de-DE' : 'en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })} • {messages.length} {lang === 'de' ? 'Nachrichten' : 'messages'}
                      </p>
                    </div>
                  </div>

                  {/* Last Message Preview */}
                  {lastMessage && (
                    <div className="bg-gray-50 rounded-lg p-3 sm:p-4 mb-3">
                      <p className="text-xs font-semibold text-gray-500 mb-1">
                        {lang === 'de' ? 'Letzte Nachricht:' : 'Last message:'}
                      </p>
                      <p className="text-xs sm:text-sm text-gray-700 line-clamp-2 sm:line-clamp-3">
                        {typeof lastMessage === 'string' ? lastMessage : lastMessage.content || lastMessage.text}
                      </p>
                    </div>
                  )}

                  {/* Metadata */}
                  <div className="text-xs text-gray-400 mb-3">
                    {lang === 'de' ? 'Erstellt:' : 'Created:'} {new Date(chat.created_at).toLocaleDateString(lang === 'de' ? 'de-DE' : 'en-US')}
                  </div>

                  {/* Action Buttons - Mobile Optimized */}
                  {!selectMode && (
                    <div className="flex gap-2">
                      <Link
                        href={`/suchen?chat=${chat.conversation_id}`}
                        className="flex-1 py-2.5 text-center text-sm font-semibold text-cyan-600 hover:text-cyan-700 border border-cyan-300 rounded-lg hover:bg-cyan-50 transition-colors"
                      >
                        {lang === 'de' ? 'Fortsetzen →' : 'Continue →'}
                      </Link>
                      <button
                        onClick={() => deleteSingleChat(chat.conversation_id)}
                        className="px-4 py-2.5 text-sm font-semibold text-red-600 hover:text-red-700 border border-red-300 rounded-lg hover:bg-red-50 transition-colors"
                        title={lang === 'de' ? 'Chat löschen' : 'Delete chat'}
                      >
                        🗑️
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Empty State */
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 sm:p-12 text-center">
          <div className="text-5xl sm:text-6xl mb-4">💬</div>
          <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">
            {labels?.chatHistory?.noChats || 'Noch keine Unterhaltungen'}
          </h3>
          <p className="text-sm sm:text-base text-gray-600 mb-6">
            {labels?.chatHistory?.noChatsDesc || 'Starten Sie eine KI-gestützte Kurssuche, um passende Weiterbildungen zu finden'}
          </p>
          <Link
            href="/suchen"
            className="inline-block px-6 py-3 bg-gradient-to-r from-cyan-500 to-emerald-500 text-white font-semibold rounded-lg hover:shadow-lg transition-shadow"
          >
            {labels?.nav?.aiSearch || 'KI-Kurssuche starten'}
          </Link>
        </div>
      )}

      {/* Info Box - Mobile Optimized */}
      <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 sm:p-6">
        <h3 className="text-base sm:text-lg font-bold text-purple-900 mb-3">
          💡 {lang === 'de' ? 'Über den Chat-Verlauf' : 'About Chat History'}
        </h3>
        <ul className="space-y-2 text-xs sm:text-sm text-purple-800">
          <li className="flex items-start gap-2">
            <span className="text-purple-500 mt-0.5">✓</span>
            <span>{lang === 'de' ? 'Ihre Konversationen mit dem KI-Berater werden gespeichert' : 'Your conversations with the AI advisor are saved'}</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-purple-500 mt-0.5">✓</span>
            <span>{lang === 'de' ? 'Setzen Sie frühere Suchen fort und verfeinern Sie Ihre Anfragen' : 'Continue previous searches and refine your queries'}</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-purple-500 mt-0.5">✓</span>
            <span>{lang === 'de' ? 'Wählen Sie mehrere Chats aus, um sie auf einmal zu löschen' : 'Select multiple chats to delete them at once'}</span>
          </li>
        </ul>
      </div>
    </>
  );
}

