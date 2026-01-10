import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUserProfile } from '../context/UserProfileContext';
import { useRecentlyViewed } from '../context/RecentlyViewedContext';
import { recommendSize, getSizeRecommendationMessage } from '../utils/sizeRecommendation';
import { recommendProducts, getPersonalizedGreeting, getProductRecommendationMessage } from '../utils/productRecommendation';
import { useTheme } from '../context/ThemeContext';
import UserProfileForm from './UserProfileForm';

const AIAssistant = ({ product = null, allProducts = [], onSizeRecommendation = null }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showProfileForm, setShowProfileForm] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const { profile, updateProfile } = useUserProfile();
  const { recentlyViewed } = useRecentlyViewed();
  const { theme } = useTheme();
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      // Initialize with greeting
      const greeting = getPersonalizedGreeting(profile);
      setMessages([{ role: 'assistant', content: greeting }]);
    }
  }, [isOpen, profile]);

  const simulateTyping = async (response) => {
    setIsTyping(true);
    // Simulate typing delay
    await new Promise(resolve => setTimeout(resolve, 500));
    setIsTyping(false);
    return response;
  };

  const handleSendMessage = async (messageText = null) => {
    const userMessage = messageText || input.trim();
    if (!userMessage && !messageText) return;

    // Add user message
    const newMessages = [...messages, { role: 'user', content: userMessage }];
    setMessages(newMessages);
    setInput('');

    setIsTyping(true);

    // Process message and generate response
    setTimeout(async () => {
      const response = await generateResponse(userMessage, product, allProducts);
      setIsTyping(false);
      setMessages([...newMessages, { role: 'assistant', content: response }]);
    }, 1000);
  };

  const generateResponse = async (message, currentProduct, products) => {
    const lowerMessage = message.toLowerCase();

    // Size recommendation queries
    if (lowerMessage.includes('size') || lowerMessage.includes('fit') || lowerMessage.includes('measurement')) {
      if (currentProduct) {
        const recommendedSize = recommendSize(profile, currentProduct.category);
        const message = getSizeRecommendationMessage(
          profile,
          currentProduct.category,
          recommendedSize,
          currentProduct.sizes
        );
        
        // Auto-select recommended size if available and callback is provided
        if (recommendedSize && onSizeRecommendation && currentProduct.sizes && currentProduct.sizes.includes(recommendedSize)) {
          onSizeRecommendation(recommendedSize);
        }
        
        return message;
      } else {
        if (!profile.gender || !profile.weight || !profile.height) {
          return "I'd love to help you find the right size! To recommend a size, I need some information about you:\n\n- Gender\n- Age\n- Weight (kg)\n- Height (cm)\n- Optional: Chest, Waist, Hips measurements\n\nWould you like to provide your measurements? Just tell me your gender, age, weight, and height, or use the profile button to fill in your details.";
        } else {
          return "I can help you find the right size! Which product are you interested in? You can ask about a specific product on this page, or tell me what type of clothing you're looking for (like 'jeans' or 't-shirt').";
        }
      }
    }

    // Product recommendation queries
    if (lowerMessage.includes('recommend') || lowerMessage.includes('suggest') || lowerMessage.includes('find') || lowerMessage.includes('looking for')) {
      const recommended = recommendProducts(products || allProducts, profile, recentlyViewed, 6);
      return getProductRecommendationMessage(recommended);
    }

    // Profile/setup queries
    if (lowerMessage.includes('profile') || lowerMessage.includes('measurement') || lowerMessage.includes('information') || lowerMessage.includes('my details')) {
      if (!profile.gender || !profile.weight || !profile.height) {
        return "To give you the best recommendations, I need some information:\n\n**Required:**\n- Gender (male/female/other)\n- Age (years)\n- Weight (kg)\n- Height (cm)\n\n**Optional:**\n- Chest measurement (cm)\n- Waist measurement (cm)\n- Hips measurement (cm)\n\nYou can provide this information now, or click the profile button to fill in a form. For example, you could say: 'I'm a 25-year-old male, 180cm tall, 75kg'.";
      } else {
        let info = `Here's your profile:\n\n- Gender: ${profile.gender}\n`;
        if (profile.age) info += `- Age: ${profile.age} years\n`;
        if (profile.weight) info += `- Weight: ${profile.weight} kg\n`;
        if (profile.height) info += `- Height: ${profile.height} cm\n`;
        if (profile.chest) info += `- Chest: ${profile.chest} cm\n`;
        if (profile.waist) info += `- Waist: ${profile.waist} cm\n`;
        if (profile.hips) info += `- Hips: ${profile.hips} cm\n`;
        if (profile.preferredSize) info += `- Preferred Size: ${profile.preferredSize}\n`;
        info += `\nTo update your profile, click the profile button or tell me what you'd like to change.`;
        return info;
      }
    }

    // Greeting
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
      return getPersonalizedGreeting(profile) + "\n\nI can help you with:\n- Finding the right size for products\n- Recommending products based on your preferences\n- Answering questions about our products\n\nWhat would you like help with?";
    }

    // Help
    if (lowerMessage.includes('help') || lowerMessage.includes('what can you')) {
      return "I'm your StyleSync AI assistant! I can help you with:\n\n✅ **Size Recommendations** - Tell me your measurements and I'll recommend the perfect size\n✅ **Product Recommendations** - I'll suggest products based on your preferences\n✅ **Product Information** - Ask me about any product's features, sizes, or availability\n✅ **Shopping Help** - Need help finding something? Just ask!\n\nTry asking:\n- 'What size should I get?'\n- 'Recommend some products'\n- 'Show me jeans in my size'\n- 'What's my profile?'";
    }

    // Extract measurements from natural language
    const genderMatch = lowerMessage.match(/\b(male|female|man|woman|other)\b/i);
    const ageMatch = lowerMessage.match(/\b(\d+)\s*(years?|yrs?|year old|yr old)\b/i);
    const weightMatch = lowerMessage.match(/\b(\d+)\s*(kg|kilograms?|pounds?|lbs?|kgs?)\b/i);
    const heightMatch = lowerMessage.match(/\b(\d+)\s*(cm|centimeters?|meters?|m|feet|ft|inches?|in)\b/i);

    if (genderMatch || ageMatch || weightMatch || heightMatch) {
      const updates = {};
      
      if (genderMatch) {
        const gender = genderMatch[1].toLowerCase();
        if (gender.includes('male') || gender.includes('man')) updates.gender = 'male';
        else if (gender.includes('female') || gender.includes('woman')) updates.gender = 'female';
        else updates.gender = 'other';
      }
      
      if (ageMatch) updates.age = parseInt(ageMatch[1]);
      
      if (weightMatch) {
        let weight = parseFloat(weightMatch[1]);
        // Convert pounds to kg if needed
        if (weightMatch[2].toLowerCase().includes('pound') || weightMatch[2].toLowerCase().includes('lb')) {
          weight = weight * 0.453592;
        }
        updates.weight = Math.round(weight);
      }
      
      if (heightMatch) {
        let height = parseFloat(heightMatch[1]);
        const unit = heightMatch[2].toLowerCase();
        // Convert feet/inches to cm
        if (unit.includes('feet') || unit.includes('ft')) {
          const inchesMatch = lowerMessage.match(/\b(\d+)\s*(inches?|in)\b/i);
          if (inchesMatch) {
            height = (height * 12 + parseFloat(inchesMatch[1])) * 2.54;
          } else {
            height = height * 30.48; // feet to cm
          }
        } else if (unit.includes('meter') || unit === 'm') {
          height = height * 100; // meters to cm
        }
        updates.height = Math.round(height);
      }

      if (Object.keys(updates).length > 0) {
        updateProfile(updates);
        return `Great! I've saved your information. ${Object.keys(updates).length > 1 ? 'Here\'s what I saved:' : 'I saved:'}\n\n${Object.entries(updates).map(([key, value]) => `- ${key.charAt(0).toUpperCase() + key.slice(1)}: ${value}`).join('\n')}\n\nNow I can help you find the perfect size! Ask me "What size should I get?" for a product, or say "Recommend products" to see personalized suggestions.`;
      }
    }

    // Default response
    return "I'm here to help! I can assist you with:\n\n- Size recommendations (tell me your measurements or ask 'What size should I get?')\n- Product recommendations (say 'Recommend products')\n- Answer questions about products\n- Help you find items based on your preferences\n\nWhat would you like help with?";
  };

  const handleQuickAction = (action) => {
    switch (action) {
      case 'size':
        handleSendMessage('What size should I get?');
        break;
      case 'recommend':
        handleSendMessage('Recommend products for me');
        break;
      case 'profile':
        handleSendMessage('What is my profile?');
        break;
      default:
        break;
    }
  };

  return (
    <>
      {/* Floating Action Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-colors ${
          theme === 'fun'
            ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
            : 'bg-black dark:bg-white text-white dark:text-black'
        }`}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Open AI Assistant"
      >
        {isOpen ? (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        )}
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 right-6 z-50 w-96 max-w-[calc(100vw-3rem)] h-[600px] max-h-[calc(100vh-8rem)] bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between bg-gray-50 dark:bg-gray-800">
              <div className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  theme === 'fun'
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500'
                    : 'bg-black dark:bg-white'
                }`}>
                  <svg className="w-5 h-5 text-white dark:text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white">AI Assistant</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">StyleSync Helper</p>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div
              ref={chatContainerRef}
              className="flex-1 overflow-y-auto p-4 space-y-4"
            >
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg px-4 py-2 ${
                      message.role === 'user'
                        ? 'bg-black dark:bg-white text-white dark:text-black'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 dark:bg-gray-800 rounded-lg px-4 py-2">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Actions */}
            <div className="px-4 py-2 border-t border-gray-200 dark:border-gray-800 flex gap-2 overflow-x-auto">
              <button
                onClick={() => handleQuickAction('size')}
                className="px-3 py-1 text-xs bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors whitespace-nowrap"
              >
                Size Help
              </button>
              <button
                onClick={() => handleQuickAction('recommend')}
                className="px-3 py-1 text-xs bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors whitespace-nowrap"
              >
                Recommend
              </button>
              <button
                onClick={() => setShowProfileForm(true)}
                className="px-3 py-1 text-xs bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors whitespace-nowrap"
              >
                My Profile
              </button>
            </div>

            {/* Input */}
            <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-800">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="flex gap-2"
              >
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask me anything..."
                  className="flex-1 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-4 py-2 rounded-lg text-sm focus:outline-none focus:border-gray-900 dark:focus:border-white"
                  disabled={isTyping}
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isTyping}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    theme === 'fun'
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                      : 'bg-black dark:bg-white text-white dark:text-black'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  Send
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* User Profile Form Modal */}
      <UserProfileForm isOpen={showProfileForm} onClose={() => setShowProfileForm(false)} />
    </>
  );
};

export default AIAssistant;
