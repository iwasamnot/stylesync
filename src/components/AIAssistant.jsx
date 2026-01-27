import { useState, useRef, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useUserProfile } from '../context/UserProfileContext';
import { useRecentlyViewed } from '../context/RecentlyViewedContext';
import { recommendSize } from '../utils/sizeRecommendation';
import { recommendProducts } from '../utils/productRecommendation';
import { useTheme } from '../context/ThemeContext';

// --- Sub-components for cleaner code ---

const TypingIndicator = () => (
  <motion.div 
    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
    className="flex gap-1 p-2 bg-gray-100 dark:bg-gray-800 rounded-xl w-fit mb-2"
  >
    {[0, 1, 2].map((dot) => (
      <motion.div
        key={dot}
        className="w-1.5 h-1.5 bg-gray-400 rounded-full"
        animate={{ y: [0, -5, 0] }}
        transition={{ duration: 0.6, repeat: Infinity, delay: dot * 0.2 }}
      />
    ))}
  </motion.div>
);

const MessageBubble = ({ message, isFun }) => {
  const isUser = message.sender === 'user';
  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      className={`max-w-[85%] mb-3 p-3 text-sm rounded-2xl ${
        isUser
          ? isFun 
            ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white self-end ml-auto rounded-tr-none' 
            : 'bg-black dark:bg-white text-white dark:text-black self-end ml-auto rounded-tr-none'
          : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 self-start mr-auto rounded-tl-none border border-gray-200 dark:border-gray-700'
      }`}
    >
      {message.text}
    </motion.div>
  );
};

// --- Main Component ---

const AIAssistant = ({ product = null, allProducts = [], onSizeRecommendation = null }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  
  // Context
  const { profile, updateProfile } = useUserProfile();
  const { recentlyViewed } = useRecentlyViewed();
  const { theme } = useTheme();
  const isFun = theme === 'fun';

  // Chat State
  const [messages, setMessages] = useState([
    { id: 1, sender: 'ai', text: "Hi! I'm your StyleSync assistant. Ask me about sizing, style advice, or specific products." }
  ]);

  // Measurement State (Synced with Profile)
  const [measurements, setMeasurements] = useState({ ...profile });

  // Scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Contextual Greeting when Product changes
  useEffect(() => {
    if (product && isOpen) {
      addMessage('ai', `I see you're looking at the ${product.name}. Would you like help choosing the right size?`, 'suggestion_chips');
    }
  }, [product, isOpen]);

  // --- Logic ---

  const addMessage = (sender, text, type = 'text', data = null) => {
    setMessages(prev => [...prev, { id: Date.now(), sender, text, type, data }]);
  };

  const handleSend = async () => {
    if (!inputValue.trim()) return;
    
    const userText = inputValue;
    setInputValue('');
    addMessage('user', userText);
    setIsTyping(true);

    // Simulate AI "Thinking" latency
    setTimeout(() => {
      processIntent(userText);
      setIsTyping(false);
    }, 800 + Math.random() * 500); 
  };

  // Simple Intent Recognition Logic
  const processIntent = (text) => {
    const lowerText = text.toLowerCase();

    // Intent: Sizing Help
    if (lowerText.includes('size') || lowerText.includes('fit') || lowerText.includes('measure')) {
      addMessage('ai', "Let's find your perfect fit. Please confirm your details below:", 'widget_size_form');
      return;
    }

    // Intent: Recommendations / "Show me"
    if (lowerText.includes('recommend') || lowerText.includes('show') || lowerText.includes('suggest') || lowerText.includes('similar')) {
      const recs = recommendProducts(allProducts, { ...profile, ...measurements }, recentlyViewed, 4);
      if (recs.length > 0) {
        addMessage('ai', "Based on your style profile, I think you'll love these:", 'widget_product_grid', recs);
      } else {
        addMessage('ai', "I need a bit more info to recommend products. Try browsing a few items first!");
      }
      return;
    }

    // Intent: Greeting
    if (lowerText.includes('hi') || lowerText.includes('hello') || lowerText.includes('hey')) {
      addMessage('ai', `Hello! ${profile.name ? `Welcome back, ${profile.name}.` : ''} How can I help you today?`);
      return;
    }

    // Fallback
    addMessage('ai', "I'm specializing in style and sizing. You can ask me to 'Help with size' or 'Show recommendations'.");
  };

  const handleUpdateMeasurements = (field, value) => {
    const updated = { ...measurements, [field]: value };
    setMeasurements(updated);
    updateProfile(updated); // Sync with global context
  };

  const calculateSize = () => {
    if (!measurements.weight || !measurements.height) {
      addMessage('ai', "I need your weight and height to calculate the size.");
      return;
    }
    const size = recommendSize(measurements, product?.category || 'general');
    addMessage('ai', `Based on your measurements, I recommend size ${size}.`, 'text');
    if (onSizeRecommendation) onSizeRecommendation(size);
  };

  // --- Render Widgets ---

  const renderWidget = (msg) => {
    switch (msg.type) {
      case 'widget_size_form':
        return (
          <motion.div 
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 mb-4 shadow-sm"
          >
            <div className="grid grid-cols-2 gap-3 mb-3">
              <input 
                type="number" placeholder="Height (cm)" value={measurements.height || ''}
                onChange={(e) => handleUpdateMeasurements('height', e.target.value)}
                className="p-2 text-sm bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700"
              />
              <input 
                type="number" placeholder="Weight (kg)" value={measurements.weight || ''}
                onChange={(e) => handleUpdateMeasurements('weight', e.target.value)}
                className="p-2 text-sm bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700"
              />
            </div>
            <button 
              onClick={calculateSize}
              className={`w-full py-2 rounded-lg text-xs uppercase tracking-widest font-bold text-white transition-all ${
                isFun ? 'bg-gradient-to-r from-purple-500 to-pink-500' : 'bg-black dark:bg-white dark:text-black'
              }`}
            >
              Calculate Size
            </button>
          </motion.div>
        );

      case 'widget_product_grid':
        return (
          <div className="flex gap-3 overflow-x-auto pb-4 mb-2 snap-x">
            {msg.data.map(p => (
              <Link to={`/product/${p.id}`} key={p.id} className="min-w-[120px] snap-center">
                <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-sm">
                  <img src={p.image} alt={p.name} className="w-full h-24 object-cover" />
                  <div className="p-2">
                    <p className="text-xs font-medium truncate dark:text-white">{p.name}</p>
                    <p className="text-xs text-gray-500">${p.price}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        );

      case 'suggestion_chips':
        return (
          <div className="flex gap-2 flex-wrap mb-4">
            <button 
              onClick={() => { addMessage('user', 'Help me with size'); setIsTyping(true); setTimeout(() => processIntent('size'), 600); }}
              className="px-3 py-1.5 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-xs rounded-full border border-purple-200 dark:border-purple-700"
            >
              Check my size
            </button>
            <button 
              onClick={() => { addMessage('user', 'Show me recommendations'); setIsTyping(true); setTimeout(() => processIntent('recommend'), 600); }}
              className="px-3 py-1.5 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 text-xs rounded-full border border-gray-200 dark:border-gray-700"
            >
              Similar items
            </button>
          </div>
        );

      default: return null;
    }
  };

  // --- Animation Variants ---
  const containerVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } },
    exit: { opacity: 0, y: 20, scale: 0.95, transition: { duration: 0.2 } },
  };

  return (
    <>
      {/* Floating Toggle Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 ${
          isFun ? 'bg-gradient-to-r from-purple-600 via-pink-500 to-rose-500 text-white' : 'bg-black dark:bg-white text-white dark:text-black'
        }`}
        whileHover={{ scale: 1.1, rotate: 5 }}
        whileTap={{ scale: 0.95 }}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.svg key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></motion.svg>
          ) : (
            <motion.svg key="chat" initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.5, opacity: 0 }} className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></motion.svg>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Main Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            variants={containerVariants}
            initial="hidden" animate="visible" exit="exit"
            className="fixed bottom-24 right-6 z-50 w-[380px] max-w-[calc(100vw-3rem)] h-[600px] max-h-[calc(100vh-8rem)] glass-morphism backdrop-blur-xl bg-white/90 dark:bg-gray-900/90 border border-white/20 dark:border-gray-700/50 rounded-2xl shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className={`p-4 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center ${isFun ? 'bg-gradient-to-r from-purple-500/10 to-pink-500/10' : ''}`}>
              <div className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full ${isTyping ? 'bg-green-500 animate-pulse' : 'bg-green-500'}`} />
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white">StyleSync AI</h3>
                  <p className="text-[10px] text-gray-500 uppercase tracking-wider">Assistant</p>
                </div>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 scrollbar-hide">
              {messages.map((msg) => (
                <div key={msg.id}>
                  <MessageBubble message={msg} isFun={isFun} />
                  {renderWidget(msg)}
                </div>
              ))}
              {isTyping && <TypingIndicator />}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white/50 dark:bg-black/20 border-t border-gray-100 dark:border-gray-800">
              <form 
                onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                className="flex gap-2"
              >
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Ask about size, style, or products..."
                  className="flex-1 bg-transparent border-none text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:ring-0"
                  autoFocus
                />
                <button 
                  type="submit"
                  disabled={!inputValue.trim() || isTyping}
                  className={`p-2 rounded-full transition-colors ${
                    inputValue.trim() 
                      ? isFun ? 'text-purple-600 bg-purple-50' : 'text-black bg-gray-100 dark:text-white dark:bg-gray-800'
                      : 'text-gray-300'
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AIAssistant;
