import React, { useState, useRef, useEffect, useCallback } from 'react';
import { FaPaperPlane, FaRobot, FaUser, FaTrash, FaSpinner, FaCopy, FaCheck, FaStethoscope, FaShieldAlt, FaBookMedical } from 'react-icons/fa';
import { HiSparkles } from 'react-icons/hi2';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from '../hooks/useTranslation';
import chatService from '../services/chatService';
import toast from 'react-hot-toast';

const MAX_CHARS = 500;

const WELCOME_MESSAGE = {
  id: 1,
  type: 'bot',
  text: `👋 Hello! I'm DermaVision AI, your specialized dermatology assistant.

I can help you with questions about:
- 🔬 Mycosis Fungoides (MF)
- 💜 Annular Lichen Planus
- ✅ Healthy Skin care
- 🔴 Psoriasis
- 🍄 Tinea Circinata (Ringworm)
- 🌡️ Urticaria (Hives)

How can I help you today?`,
  timestamp: new Date()
};

const QUICK_QUESTIONS = [
  'What is psoriasis?',
  'How to treat urticaria?',
  'What are signs of MF?',
  'Is tinea circinata contagious?',
  'How to care for healthy skin?',
  'What is annular lichen planus?',
];

// ===================== Typing Indicator =====================
const TypingDots = () => (
  <div className="flex items-end gap-2" style={{ animation: 'slideIn 0.3s ease forwards' }}>
    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center shadow-md mb-1 flex-shrink-0">
      <FaRobot className="text-white text-xs" />
    </div>
    <div className="bg-white dark:bg-gray-800 rounded-2xl rounded-bl-sm px-5 py-3.5 shadow-sm border border-gray-100 dark:border-gray-700">
      <div className="flex items-center space-x-1.5">
        {[0, 0.18, 0.36].map((delay, i) => (
          <div key={i}
            className="w-2 h-2 rounded-full bg-gradient-to-br from-blue-400 to-purple-400"
            style={{
              animation: `typingBounce 1.1s ease-in-out ${delay}s infinite`,
            }}
          />
        ))}
      </div>
    </div>
  </div>
);

// ===================== Message Bubble =====================
const MessageBubble = ({ message, isNew }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(message.text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatText = (text) =>
    text.split('\n').map((line, i, arr) => (
      <span key={i}>{line}{i < arr.length - 1 && <br />}</span>
    ));

  const isUser = message.type === 'user';

  return (
    <div
      className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
      style={{ animation: isNew ? 'slideIn 0.35s cubic-bezier(0.16,1,0.3,1) forwards' : 'none' }}
    >
      <div className={`flex items-end gap-2.5 max-w-[85%] ${isUser ? 'flex-row-reverse' : ''}`}>

        {/* Avatar */}
        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 shadow-md mb-1 ${
          isUser
            ? 'bg-gradient-to-br from-violet-500 to-pink-500'
            : message.isError
              ? 'bg-red-500'
              : 'bg-gradient-to-br from-blue-500 to-cyan-500'
        }`}>
          {isUser
            ? <FaUser className="text-white text-xs" />
            : <FaRobot className="text-white text-xs" />
          }
        </div>

        {/* Bubble */}
        <div className="flex-1 group">
          <div className={`rounded-2xl px-4 py-3 shadow-sm relative ${
            isUser
              ? 'bg-gradient-to-br from-blue-600 to-violet-600 text-white rounded-br-sm'
              : message.isError
                ? 'bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-300 border border-red-200 dark:border-red-700 rounded-bl-sm'
                : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-gray-100 dark:border-gray-700 rounded-bl-sm shadow-sm'
          }`}>
            {/* Shimmer on bot messages */}
            {!isUser && !message.isError && (
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-200 dark:via-blue-700 to-transparent opacity-60 rounded-t-2xl"/>
            )}
            <p className="text-sm leading-relaxed whitespace-pre-wrap">{formatText(message.text)}</p>
          </div>

          {/* Time + copy */}
          <div className={`flex items-center gap-2 mt-1.5 ${isUser ? 'justify-end' : 'justify-start'}`}>
            <span className="text-[10px] text-gray-400 dark:text-gray-500 font-medium">
              {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
            {!isUser && !message.isError && (
              <button
                onClick={handleCopy}
                className="opacity-0 group-hover:opacity-100 transition-all flex items-center gap-1 text-[10px] text-gray-400 hover:text-blue-500 dark:text-gray-500 dark:hover:text-blue-400"
              >
                {copied
                  ? <><FaCheck className="text-green-500 text-[9px]"/><span className="text-green-500">Copied!</span></>
                  : <><FaCopy className="text-[9px]"/><span>Copy</span></>
                }
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// ===================== Chat Component =====================
const Chat = () => {
  const { t } = useTranslation();
  const { currentUser } = useAuth();
  const [messages, setMessages] = useState([WELCOME_MESSAGE]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [newMessageId, setNewMessageId] = useState(null);
  const [messageCount, setMessageCount] = useState(0);
  const [isFocused, setIsFocused] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const chatContainerRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSendMessage = useCallback(async (e, overrideText) => {
    e?.preventDefault();
    const text = (overrideText || inputMessage).trim();
    if (!text || isTyping) return;

    const userMessage = { id: Date.now(), type: 'user', text, timestamp: new Date() };
    const updatedMessages = [...messages, userMessage];

    setMessages(updatedMessages);
    setNewMessageId(userMessage.id);
    setInputMessage('');
    setIsTyping(true);
    setMessageCount(prev => prev + 1);

    try {
      const result = await chatService.sendMessage(updatedMessages);
      if (result.success) {
        const botMessage = { id: Date.now() + 1, type: 'bot', text: result.text, timestamp: new Date() };
        setMessages(prev => [...prev, botMessage]);
        setNewMessageId(botMessage.id);
      } else {
        const errorMessage = {
          id: Date.now() + 1, type: 'bot',
          text: result.error?.includes('API key not configured')
            ? '⚠️ AI Chat is not configured yet. Please add your API key to enable this feature.'
            : '❌ Sorry, I encountered an error. Please try again.',
          timestamp: new Date(), isError: true,
        };
        setMessages(prev => [...prev, errorMessage]);
        toast.error('Failed to get AI response');
      }
    } catch {
      toast.error('Something went wrong');
    } finally {
      setIsTyping(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [inputMessage, messages, isTyping]);

  const handleQuickQuestion = (question) => {
    if (isTyping) return;
    handleSendMessage(null, question);
  };

  const handleClearChat = () => {
    setMessages([{ ...WELCOME_MESSAGE, id: Date.now(), timestamp: new Date() }]);
    setMessageCount(0);
    toast.success('Chat cleared');
  };

  const charsLeft = MAX_CHARS - inputMessage.length;
  const isNearLimit = charsLeft < 50;

  return (
    <>
      <style>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes typingBounce {
          0%, 60%, 100% { transform: translateY(0);    opacity: 0.4; }
          30%            { transform: translateY(-6px); opacity: 1;   }
        }
        @keyframes pulseRing {
          0%   { transform: scale(1);    opacity: 0.8; }
          100% { transform: scale(1.55); opacity: 0;   }
        }
        .chat-scrollbar::-webkit-scrollbar { width: 4px; }
        .chat-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .chat-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; }
        .dark .chat-scrollbar::-webkit-scrollbar-thumb { background: #374151; }
      `}</style>

      <div className="min-h-screen py-8 bg-gradient-to-br from-slate-50 via-blue-50/30 to-violet-50/30 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* ===== Chat Window ===== */}
          <div className="rounded-3xl overflow-hidden shadow-2xl shadow-blue-100/50 dark:shadow-black/40 border border-white/80 dark:border-gray-700/50">

            {/* ── Header ── */}
            <div className="bg-white dark:bg-gray-800 px-6 py-4 border-b border-gray-100 dark:border-gray-700/80">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  {/* AI Avatar with animated ring */}
                  <div className="relative">
                    <div className="relative w-12 h-12">
                      {/* Pulse ring */}
                      <div className="absolute inset-0 rounded-full bg-blue-400 dark:bg-blue-500 opacity-20"
                        style={{ animation: 'pulseRing 2s ease-out infinite' }}/>
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 via-blue-600 to-violet-600 rounded-full flex items-center justify-center shadow-lg shadow-blue-200 dark:shadow-blue-900/40 relative z-10">
                        <FaRobot className="text-white text-xl" />
                      </div>
                    </div>
                    {/* Online dot */}
                    <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-white dark:border-gray-800 z-20"/>
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h1 className="text-lg font-bold text-gray-900 dark:text-white tracking-tight">DermaVision AI</h1>
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-gradient-to-r from-blue-50 to-violet-50 dark:from-blue-900/30 dark:to-violet-900/30 border border-blue-100 dark:border-blue-800/50 text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wide">
                        <HiSparkles className="text-[9px]"/> Pro
                      </span>
                    </div>
                    <div className="flex items-center space-x-2 mt-0.5">
                      <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"/>
                      <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
                        {isTyping ? '✦ Thinking...' : 'Online · Dermatology Specialist'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  {messageCount > 0 && (
                    <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-blue-50 to-violet-50 dark:from-blue-900/20 dark:to-violet-900/20 rounded-full border border-blue-100 dark:border-blue-800/50">
                      <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">{messageCount} msgs</span>
                    </div>
                  )}
                  <button onClick={handleClearChat}
                    className="flex items-center space-x-1.5 px-3 py-2 bg-red-50 dark:bg-red-900/20 text-red-500 dark:text-red-400 rounded-xl hover:bg-red-100 dark:hover:bg-red-900/40 transition-all border border-red-100 dark:border-red-800/50 text-xs font-semibold hover:scale-105">
                    <FaTrash className="text-[10px]" />
                    <span className="hidden md:inline">Clear</span>
                  </button>
                </div>
              </div>
            </div>

            {/* ── Messages ── */}
            <div
              ref={chatContainerRef}
              className="chat-scrollbar bg-gradient-to-b from-gray-50 to-slate-50/80 dark:from-gray-900 dark:to-gray-900/95 h-[460px] overflow-y-auto px-5 py-6"
            >
              {/* Date separator */}
              <div className="flex items-center gap-3 mb-5">
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-700 to-transparent"/>
                <span className="text-[10px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-widest px-3 py-1 bg-white dark:bg-gray-800 rounded-full border border-gray-200 dark:border-gray-700">
                  {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                </span>
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-700 to-transparent"/>
              </div>

              <div className="space-y-4">
                {messages.map((message) => (
                  <MessageBubble key={message.id} message={message} isNew={message.id === newMessageId} />
                ))}

                {isTyping && <TypingDots />}
                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* ── Quick Questions ── */}
            <div className="bg-white dark:bg-gray-800 px-5 py-3.5 border-t border-gray-100 dark:border-gray-700/80">
              <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 mb-2.5 uppercase tracking-widest flex items-center gap-1.5">
                <HiSparkles className="text-blue-400"/> Quick Questions
              </p>
              <div className="flex flex-wrap gap-1.5">
                {QUICK_QUESTIONS.map((q, i) => (
                  <button key={i} onClick={() => handleQuickQuestion(q)} disabled={isTyping}
                    className="px-3 py-1.5 bg-gradient-to-r from-blue-50 to-violet-50 dark:from-blue-900/20 dark:to-violet-900/20 hover:from-blue-100 hover:to-violet-100 dark:hover:from-blue-900/40 dark:hover:to-violet-900/40 text-blue-700 dark:text-blue-300 text-xs rounded-full border border-blue-200/70 dark:border-blue-700/50 transition-all hover:scale-105 hover:shadow-sm disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100 font-medium">
                    {q}
                  </button>
                ))}
              </div>
            </div>

            {/* ── Input ── */}
            <div className={`bg-white dark:bg-gray-800 p-4 border-t transition-all duration-200 ${
              isFocused
                ? 'border-blue-300 dark:border-blue-600 shadow-inner shadow-blue-50 dark:shadow-blue-900/20'
                : 'border-gray-100 dark:border-gray-700/80'
            }`}>
              <form onSubmit={handleSendMessage} className="flex items-end gap-3">
                <div className="flex-1 relative">
                  <textarea
                    ref={inputRef}
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value.slice(0, MAX_CHARS))}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendMessage(e); }
                    }}
                    placeholder="Ask about any skin condition... (Enter ↵ to send)"
                    rows={inputMessage.split('\n').length > 1 ? Math.min(inputMessage.split('\n').length, 4) : 1}
                    className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 dark:bg-gray-700/80 dark:text-white rounded-2xl focus:border-blue-400 dark:focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/30 transition-all outline-none text-sm placeholder-gray-400 dark:placeholder-gray-500 resize-none leading-relaxed"
                    disabled={isTyping}
                  />
                  {inputMessage.length > 0 && (
                    <div className={`absolute bottom-2.5 right-3 text-[10px] font-semibold transition-colors ${
                      isNearLimit ? 'text-red-500' : 'text-gray-400'
                    }`}>
                      {charsLeft}
                    </div>
                  )}
                </div>

                {/* Send button */}
                <button type="submit" disabled={!inputMessage.trim() || isTyping}
                  className="w-11 h-11 bg-gradient-to-br from-blue-500 to-violet-600 text-white rounded-2xl flex items-center justify-center shadow-md shadow-blue-200 dark:shadow-blue-900/40 hover:shadow-lg hover:shadow-blue-300/50 hover:scale-110 transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:shadow-none flex-shrink-0 mb-0.5">
                  {isTyping
                    ? <FaSpinner className="animate-spin text-sm" />
                    : <FaPaperPlane className="text-sm -translate-x-px" />
                  }
                </button>
              </form>

              <div className="flex items-center justify-between mt-2.5">
                <p className="text-[10px] text-gray-400 dark:text-gray-500 flex items-center gap-1">
                  <span className="text-amber-400">⚠️</span> For informational purposes only. Consult a dermatologist.
                </p>
                <p className="text-[10px] text-gray-400 dark:text-gray-500 font-medium">
                  Shift+Enter for new line
                </p>
              </div>
            </div>
          </div>

          {/* ===== Info Cards ===== */}
          <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                icon: <FaRobot className="text-blue-500 text-xl"/>,
                gradient: 'from-blue-500 to-cyan-500',
                bg: 'bg-blue-50 dark:bg-blue-900/20',
                title: 'AI-Powered',
                desc: 'Powered by advanced AI with specialized dermatology knowledge.',
              },
              {
                icon: <FaBookMedical className="text-violet-500 text-xl"/>,
                gradient: 'from-violet-500 to-purple-600',
                bg: 'bg-violet-50 dark:bg-violet-900/20',
                title: 'Evidence-Based',
                desc: 'Responses based on current dermatological research.',
              },
              {
                icon: <FaShieldAlt className="text-emerald-500 text-xl"/>,
                gradient: 'from-emerald-500 to-green-600',
                bg: 'bg-emerald-50 dark:bg-emerald-900/20',
                title: 'Private & Secure',
                desc: 'Your conversations are completely private.',
              },
            ].map((card, i) => (
              <div key={i} className="group bg-white dark:bg-gray-800/90 rounded-2xl shadow-sm p-5 border border-gray-100 dark:border-gray-700/50 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 overflow-hidden relative">
                {/* Top accent */}
                <div className={`absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r ${card.gradient}`}/>
                <div className={`w-10 h-10 ${card.bg} rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                  {card.icon}
                </div>
                <h3 className="font-bold text-gray-900 dark:text-white text-sm mb-1">{card.title}</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{card.desc}</p>
              </div>
            ))}
          </div>

        </div>
      </div>
    </>
  );
};

export default Chat;