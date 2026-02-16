import React, { useState, useRef, useEffect } from 'react';
import { FaPaperPlane, FaRobot, FaUser, FaBrain, FaTrash } from 'react-icons/fa';
import { collection, addDoc, query, where, orderBy, getDocs, limit } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from '../hooks/useTranslation'; // ✅ جديد
import toast from 'react-hot-toast';

const Chat = () => {
  const { t } = useTranslation(); // ✅ جديد

  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      text: t.chat.welcomeMessage,
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const { currentUser } = useAuth();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Load chat history from Firebase
  useEffect(() => {
    const loadChatHistory = async () => {
      if (!currentUser) return;
      try {
        const chatsRef = collection(db, 'chats');
        const q = query(
          chatsRef,
          where('userId', '==', currentUser.uid),
          orderBy('timestamp', 'desc'),
          limit(1)
        );
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          const lastChat = querySnapshot.docs[0].data();
          if (lastChat.messages && lastChat.messages.length > 1) {
            setMessages(lastChat.messages.map((msg, index) => ({
              ...msg,
              id: index + 1,
              timestamp: msg.timestamp?.toDate() || new Date()
            })));
          }
        }
      } catch (error) {
        console.error('Error loading chat history:', error);
      }
    };
    loadChatHistory();
  }, [currentUser]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: messages.length + 1,
      type: 'user',
      text: inputMessage,
      timestamp: new Date()
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInputMessage('');
    setIsTyping(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 2000));

      let aiResponse = '';
      const userInput = inputMessage.toLowerCase();

      if (userInput.includes('acne')) {
        aiResponse = 'Acne is a common skin condition caused by clogged hair follicles. Treatment typically includes topical retinoids, benzoyl peroxide, or antibiotics. Would you like specific recommendations for your skin type?';
      } else if (userInput.includes('eczema') || userInput.includes('dermatitis')) {
        aiResponse = 'Eczema (atopic dermatitis) causes dry, itchy, inflamed skin. Key treatments include moisturizers, topical corticosteroids, and avoiding triggers. Keep your skin well-hydrated and use gentle, fragrance-free products.';
      } else if (userInput.includes('vitiligo')) {
        aiResponse = 'Vitiligo is an autoimmune condition causing loss of skin pigmentation. Treatment options include topical corticosteroids, phototherapy, and in some cases, surgical procedures. Early intervention can help prevent progression.';
      } else if (userInput.includes('psoriasis')) {
        aiResponse = 'Psoriasis is a chronic autoimmune condition causing rapid skin cell buildup. Treatments range from topical therapies to systemic medications and biologics. A dermatologist can create a personalized treatment plan.';
      } else if (userInput.includes('rash')) {
        aiResponse = 'Rashes can have many causes including allergies, infections, or irritants. To provide better guidance, could you describe: location, appearance, duration, and any associated symptoms like itching or pain?';
      } else if (userInput.includes('skincare') || userInput.includes('routine')) {
        aiResponse = 'A basic skincare routine should include: 1) Gentle cleanser 2) Moisturizer 3) Sunscreen (SPF 30+). Additional products depend on your skin type and concerns. What\'s your primary skin concern?';
      } else {
        const genericResponses = [
          'Based on medical literature, this condition typically presents with specific symptoms. Could you provide more details about your concern?',
          'I understand your question. For accurate guidance, I recommend consulting with a dermatologist. However, here\'s some general information that might help...',
          'That\'s a great question! According to dermatological research, there are several factors to consider. Would you like me to explain the most important ones?',
          'Based on evidence-based dermatology, I can provide you with some insights. Could you tell me more about your specific situation?'
        ];
        aiResponse = genericResponses[Math.floor(Math.random() * genericResponses.length)];
      }

      const botMessage = {
        id: messages.length + 2,
        type: 'bot',
        text: aiResponse,
        timestamp: new Date()
      };

      const finalMessages = [...updatedMessages, botMessage];
      setMessages(finalMessages);

      if (currentUser) {
        await addDoc(collection(db, 'chats'), {
          userId: currentUser.uid,
          messages: finalMessages.map(msg => ({
            type: msg.type,
            text: msg.text,
            timestamp: msg.timestamp
          })),
          lastMessage: aiResponse.substring(0, 100),
          timestamp: new Date()
        });
      }

    } catch (error) {
      console.error('Chat error:', error);
      toast.error(t.chat.sendFailed);
    } finally {
      setIsTyping(false);
    }
  };

  const handleQuickQuestion = (question) => {
    setInputMessage(question);
    setTimeout(() => {
      const form = document.getElementById('chat-form');
      if (form) {
        form.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
      }
    }, 100);
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: 1,
        type: 'bot',
        text: t.chat.welcomeMessage,
        timestamp: new Date()
      }
    ]);
    toast.success(t.chat.chatCleared);
  };

  return (
    <div className="min-h-screen py-8 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="bg-white dark:bg-gray-800 rounded-t-2xl shadow-xl p-6 border-b-2 border-blue-100 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 rtl:space-x-reverse">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center shadow-lg">
                <FaBrain className="text-white text-2xl animate-pulse" />
              </div>
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {t.chat.title}
                </h1>
                <p className="text-sm text-green-600 dark:text-green-400 flex items-center space-x-2 rtl:space-x-reverse">
                  <span className="w-2 h-2 bg-green-600 dark:bg-green-400 rounded-full animate-pulse"></span>
                  <span>{t.chat.status}</span>
                </p>
              </div>
            </div>
            <button
              onClick={handleClearChat}
              className="hidden md:flex items-center space-x-2 rtl:space-x-reverse px-4 py-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/40 transition-all"
            >
              <FaTrash />
              <span className="text-sm font-semibold">{t.chat.clear}</span>
            </button>
          </div>

          {/* Mobile Clear Button */}
          <button
            onClick={handleClearChat}
            className="md:hidden w-full mt-4 flex items-center justify-center space-x-2 rtl:space-x-reverse px-4 py-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/40 transition-all"
          >
            <FaTrash />
            <span className="text-sm font-semibold">{t.chat.clearChat}</span>
          </button>
        </div>

        {/* Chat Messages */}
        <div className="bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-800 dark:to-gray-900 p-6 h-[500px] overflow-y-auto shadow-xl">
          <div className="space-y-6">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'} animate-fadeIn`}
              >
                <div className={`flex items-start space-x-3 rtl:space-x-reverse max-w-[85%] ${message.type === 'user' ? 'flex-row-reverse' : ''}`}>
                  {/* Avatar */}
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg ${
                    message.type === 'user'
                      ? 'bg-gradient-to-br from-purple-500 to-pink-500'
                      : 'bg-gradient-to-br from-blue-500 to-cyan-500'
                  }`}>
                    {message.type === 'user' ? (
                      <FaUser className="text-white text-sm" />
                    ) : (
                      <FaRobot className="text-white text-sm" />
                    )}
                  </div>

                  {/* Message Bubble */}
                  <div className="flex-1">
                    <div className={`rounded-2xl px-5 py-3 shadow-md ${
                      message.type === 'user'
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                        : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-700'
                    }`}>
                      <p className="text-sm leading-relaxed break-words">{message.text}</p>
                    </div>
                    <p className={`text-xs text-gray-500 dark:text-gray-400 mt-1 ${message.type === 'user' ? 'text-right rtl:text-left' : 'text-left rtl:text-right'}`}>
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex justify-start animate-fadeIn">
                <div className="flex items-start space-x-3 rtl:space-x-reverse">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center shadow-lg">
                    <FaRobot className="text-white text-sm" />
                  </div>
                  <div className="bg-white dark:bg-gray-800 rounded-2xl px-5 py-3 shadow-md border border-gray-200 dark:border-gray-700">
                    <div className="flex space-x-2 rtl:space-x-reverse">
                      <div className="w-2 h-2 bg-blue-400 dark:bg-blue-500 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-blue-400 dark:bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      <div className="w-2 h-2 bg-blue-400 dark:bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Quick Questions */}
        <div className="bg-white dark:bg-gray-800 px-6 py-4 border-t border-gray-200 dark:border-gray-700 shadow-xl">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 font-semibold flex items-center space-x-2 rtl:space-x-reverse">
            <span>💡</span>
            <span>{t.chat.quickQuestions}</span>
          </p>
          <div className="flex flex-wrap gap-2">
            {t.chat.quickQuestionsList.map((question, index) => (
              <button
                key={index}
                onClick={() => handleQuickQuestion(question)}
                disabled={isTyping}
                className="px-4 py-2 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/30 dark:to-purple-900/30 hover:from-blue-100 hover:to-purple-100 dark:hover:from-blue-900/50 dark:hover:to-purple-900/50 text-blue-700 dark:text-blue-300 text-sm rounded-full border border-blue-200 dark:border-blue-700 transition-all hover:scale-105 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {question}
              </button>
            ))}
          </div>
        </div>

        {/* Input Area */}
        <div className="bg-white dark:bg-gray-800 rounded-b-2xl shadow-xl p-6">
          <form id="chat-form" onSubmit={handleSendMessage} className="flex items-center space-x-4 rtl:space-x-reverse">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder={t.chat.placeholder}
              className="flex-1 px-5 py-3 border-2 border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-full focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 transition-all outline-none text-sm md:text-base placeholder-gray-400 dark:placeholder-gray-500"
              disabled={isTyping}
            />
            <button
              type="submit"
              disabled={!inputMessage.trim() || isTyping}
              className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full flex items-center justify-center hover:shadow-lg hover:scale-110 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              <FaPaperPlane />
            </button>
          </form>
        </div>

        {/* Info Cards */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border-l-4 rtl:border-l-0 rtl:border-r-4 border-blue-500">
            <h3 className="font-bold text-gray-900 dark:text-white mb-2">{t.chat.infoCards.aiPowered.title}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">{t.chat.infoCards.aiPowered.desc}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border-l-4 rtl:border-l-0 rtl:border-r-4 border-purple-500">
            <h3 className="font-bold text-gray-900 dark:text-white mb-2">{t.chat.infoCards.evidenceBased.title}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">{t.chat.infoCards.evidenceBased.desc}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border-l-4 rtl:border-l-0 rtl:border-r-4 border-green-500">
            <h3 className="font-bold text-gray-900 dark:text-white mb-2">{t.chat.infoCards.private.title}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">{t.chat.infoCards.private.desc}</p>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-6 p-6 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-xl border-2 border-yellow-200 dark:border-yellow-800 shadow-lg">
          <div className="flex items-start space-x-3 rtl:space-x-reverse">
            <span className="text-2xl">⚠️</span>
            <div>
              <h3 className="font-bold text-yellow-900 dark:text-yellow-300 mb-1">{t.chat.disclaimer.title}</h3>
              <p className="text-sm text-yellow-800 dark:text-yellow-200 leading-relaxed">
                {t.chat.disclaimer.text}
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Chat;