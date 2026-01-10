import { useState, useRef, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useUserProfile } from '../context/UserProfileContext';
import { useRecentlyViewed } from '../context/RecentlyViewedContext';
import { recommendSize, getSizeRecommendationMessage } from '../utils/sizeRecommendation';
import { recommendProducts } from '../utils/productRecommendation';
import { useTheme } from '../context/ThemeContext';

const AIAssistant = ({ product = null, allProducts = [], onSizeRecommendation = null }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('size'); // 'size' or 'recommendations'
  const { profile, updateProfile } = useUserProfile();
  const { recentlyViewed } = useRecentlyViewed();
  const { theme } = useTheme();
  const isFun = theme === 'fun';

  // Form state for measurements
  const [measurements, setMeasurements] = useState({
    gender: profile.gender || '',
    age: profile.age || '',
    weight: profile.weight || '',
    height: profile.height || '',
    chest: profile.chest || '',
    waist: profile.waist || '',
    hips: profile.hips || '',
  });

  // Calculate recommended size and products with useMemo
  const recommendedSize = useMemo(() => {
    if (!product || !measurements.gender || !measurements.weight || !measurements.height) return null;
    return recommendSize(measurements, product.category);
  }, [product, measurements]);

  const recommendedProducts = useMemo(() => {
    if (!allProducts || allProducts.length === 0) return [];
    return recommendProducts(allProducts, { ...profile, ...measurements }, recentlyViewed, 6);
  }, [allProducts, profile, measurements, recentlyViewed]);

  useEffect(() => {
    // Sync form with profile when profile updates
    setMeasurements({
      gender: profile.gender || '',
      age: profile.age || '',
      weight: profile.weight || '',
      height: profile.height || '',
      chest: profile.chest || '',
      waist: profile.waist || '',
      hips: profile.hips || '',
    });
  }, [profile]);

  const handleInputChange = (field, value) => {
    const updated = { ...measurements, [field]: value };
    setMeasurements(updated);
    // Auto-save to profile
    updateProfile(updated);
  };

  const handleGetRecommendation = () => {
    if (!measurements.gender || !measurements.weight || !measurements.height) {
      return;
    }
    
    if (product && recommendedSize && onSizeRecommendation && product.sizes && product.sizes.includes(recommendedSize)) {
      onSizeRecommendation(recommendedSize);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: [0.16, 1, 0.3, 1],
        staggerChildren: 0.1,
      },
    },
    exit: { opacity: 0, y: 20, scale: 0.95, transition: { duration: 0.3 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] },
    },
  };

  return (
    <>
      {/* Floating Action Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 ${
          isFun
            ? 'bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500 text-white shadow-xl hover:shadow-2xl'
            : 'bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-100'
        }`}
        whileHover={{ scale: 1.1, rotate: 5 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Open AI Assistant"
        animate={{
          boxShadow: isOpen 
            ? '0 0 0 0 rgba(168, 85, 247, 0.4)' 
            : isFun
            ? '0 10px 40px rgba(168, 85, 247, 0.3), 0 0 0 0 rgba(168, 85, 247, 0.7)'
            : '0 10px 30px rgba(0, 0, 0, 0.2)',
        }}
        transition={{ repeat: Infinity, duration: 2 }}
      >
        {isOpen ? (
          <motion.svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            initial={{ rotate: 0 }}
            animate={{ rotate: 180 }}
            transition={{ duration: 0.3 }}
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </motion.svg>
        ) : (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        )}
      </motion.button>

      {/* Assistant Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed bottom-24 right-6 z-50 w-[420px] max-w-[calc(100vw-3rem)] h-[600px] max-h-[calc(100vh-8rem)] glass-morphism backdrop-blur-xl bg-white/90 dark:bg-gray-900/90 border border-white/20 dark:border-gray-700/50 rounded-2xl shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Fluid Background Blobs */}
            <motion.div
              className="absolute -top-20 -right-20 w-40 h-40 bg-purple-400/20 rounded-full blur-3xl pointer-events-none"
              animate={{
                x: [0, 30, 0],
                y: [0, -20, 0],
                scale: [1, 1.2, 1],
              }}
              transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
            />
            <motion.div
              className="absolute -bottom-20 -left-20 w-40 h-40 bg-pink-400/20 rounded-full blur-3xl pointer-events-none"
              animate={{
                x: [0, -20, 0],
                y: [0, 30, 0],
                scale: [1, 1.1, 1],
              }}
              transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: -2 }}
            />

            {/* Header */}
            <div className="relative z-10 px-6 py-4 border-b border-gray-200/50 dark:border-gray-700/50 flex items-center justify-between">
              <motion.div variants={itemVariants} className="flex items-center gap-3">
                <motion.div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    isFun
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 shadow-lg'
                      : 'bg-black dark:bg-white'
                  }`}
                  whileHover={{ scale: 1.1, rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  <svg className="w-5 h-5 text-white dark:text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </motion.div>
                <div>
                  <h3 className="text-base font-light text-gray-900 dark:text-white tracking-wide">AI Assistant</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-widest">StyleSync Helper</p>
                </div>
              </motion.div>
            </div>

            {/* Tabs */}
            <div className="relative z-10 px-6 pt-4 border-b border-gray-200/50 dark:border-gray-700/50">
              <div className="flex gap-2">
                <motion.button
                  onClick={() => setActiveTab('size')}
                  className={`relative px-4 py-2 text-xs uppercase tracking-widest font-light transition-colors rounded-t-lg ${
                    activeTab === 'size'
                      ? isFun
                        ? 'text-gray-900 dark:text-white'
                        : 'text-gray-900 dark:text-white'
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Size Help
                  {activeTab === 'size' && (
                    <motion.div
                      className={`absolute bottom-0 left-0 right-0 h-0.5 ${
                        isFun
                          ? 'bg-gradient-to-r from-purple-500 to-pink-500'
                          : 'bg-black dark:bg-white'
                      }`}
                      layoutId="activeTab"
                      transition={{ duration: 0.3 }}
                    />
                  )}
                </motion.button>
                <motion.button
                  onClick={() => setActiveTab('recommendations')}
                  className={`relative px-4 py-2 text-xs uppercase tracking-widest font-light transition-colors rounded-t-lg ${
                    activeTab === 'recommendations'
                      ? isFun
                        ? 'text-gray-900 dark:text-white'
                        : 'text-gray-900 dark:text-white'
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Recommendations
                  {activeTab === 'recommendations' && (
                    <motion.div
                      className={`absolute bottom-0 left-0 right-0 h-0.5 ${
                        isFun
                          ? 'bg-gradient-to-r from-purple-500 to-pink-500'
                          : 'bg-black dark:bg-white'
                      }`}
                      layoutId="activeTab"
                      transition={{ duration: 0.3 }}
                    />
                  )}
                </motion.button>
              </div>
            </div>

            {/* Content */}
            <div className="relative z-10 flex-1 overflow-y-auto p-6">
              <AnimatePresence mode="wait">
                {activeTab === 'size' ? (
                  <motion.div
                    key="size"
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    className="space-y-6"
                  >
                    {/* Size Recommendation for Current Product */}
                    {product && (
                      <motion.div
                        variants={itemVariants}
                        className={`p-6 rounded-xl border backdrop-blur-sm ${
                          isFun
                            ? 'bg-gradient-to-br from-purple-50/70 via-pink-50/70 to-rose-50/70 dark:from-purple-900/30 dark:via-pink-900/30 dark:to-rose-900/30 border-purple-200/50 dark:border-purple-700/50 shadow-lg'
                            : 'bg-gray-50/90 dark:bg-gray-800/90 border-gray-200 dark:border-gray-700 shadow-md'
                        }`}
                      >
                        <h4 className="text-sm font-light text-gray-900 dark:text-white mb-4 tracking-wide">
                          Size for {product.name}
                        </h4>
                        {measurements.gender && measurements.weight && measurements.height ? (
                          recommendedSize && product.sizes && product.sizes.includes(recommendedSize) ? (
                            <motion.div
                              initial={{ scale: 0.9, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              className="space-y-4"
                            >
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="text-xs uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-2">
                                    Recommended Size
                                  </p>
                                  <motion.p
                                    className={`text-4xl font-light mb-2 ${
                                      isFun
                                        ? 'bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 bg-clip-text text-transparent'
                                        : 'text-gray-900 dark:text-white'
                                    }`}
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                                  >
                                    {recommendedSize}
                                  </motion.p>
                                  <p className="text-xs text-gray-500 dark:text-gray-400">
                                    Based on your measurements
                                  </p>
                                </div>
                                <motion.button
                                  onClick={handleGetRecommendation}
                                  className={`px-6 py-3 rounded-xl text-xs uppercase tracking-widest font-light transition-all shadow-lg ${
                                    isFun
                                      ? 'bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500 text-white hover:shadow-xl'
                                      : 'bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-100'
                                  }`}
                                  whileHover={{ scale: 1.05, y: -2 }}
                                  whileTap={{ scale: 0.95 }}
                                >
                                  Select
                                </motion.button>
                              </div>
                            </motion.div>
                          ) : recommendedSize ? (
                            <div>
                              <p className="text-xs uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-2">
                                Recommended Size
                              </p>
                              <p className={`text-3xl font-light mb-2 ${
                                isFun
                                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent'
                                  : 'text-gray-900 dark:text-white'
                              }`}>{recommendedSize}</p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                Size {recommendedSize} is not available. Closest: {product.sizes?.[0] || 'N/A'}
                              </p>
                            </div>
                          ) : null
                        ) : (
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Fill in your measurements below to get a size recommendation.
                          </p>
                        )}
                      </motion.div>
                    )}

                    {/* Measurement Inputs */}
                    <div className="space-y-4">
                      <h4 className="text-sm font-light text-gray-900 dark:text-white tracking-wide mb-4">
                        Your Measurements
                      </h4>

                      <motion.div variants={itemVariants} className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-2">
                            Gender *
                          </label>
                          <select
                            value={measurements.gender}
                            onChange={(e) => handleInputChange('gender', e.target.value)}
                            className={`w-full border ${
                              measurements.gender
                                ? isFun
                                  ? 'border-purple-400 dark:border-purple-500 bg-purple-50/50 dark:bg-purple-900/30'
                                  : 'border-gray-900 dark:border-white bg-gray-100 dark:bg-gray-800'
                                : isFun
                                ? 'border-purple-200 dark:border-purple-700 bg-white/80 dark:bg-gray-800/80'
                                : 'border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800'
                            } text-gray-900 dark:text-white px-4 py-2.5 text-sm rounded-lg focus:outline-none focus:ring-2 ${
                              isFun
                                ? 'focus:ring-purple-500'
                                : 'focus:ring-gray-900 dark:focus:ring-white'
                            } transition-all`}
                          >
                            <option value="">Select...</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-2">
                            Age (years)
                          </label>
                          <input
                            type="number"
                            value={measurements.age}
                            onChange={(e) => handleInputChange('age', e.target.value)}
                            min="1"
                            max="120"
                            placeholder="25"
                            className={`w-full border ${
                              isFun
                                ? 'border-purple-200 dark:border-purple-700 bg-white/80 dark:bg-gray-800/80'
                                : 'border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800'
                            } text-gray-900 dark:text-white px-4 py-2.5 text-sm rounded-lg focus:outline-none focus:ring-2 ${
                              isFun
                                ? 'focus:ring-purple-500'
                                : 'focus:ring-gray-900 dark:focus:ring-white'
                            } transition-all`}
                          />
                        </div>
                      </motion.div>

                      <motion.div variants={itemVariants} className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-2">
                            Weight (kg) *
                          </label>
                          <input
                            type="number"
                            value={measurements.weight}
                            onChange={(e) => handleInputChange('weight', e.target.value)}
                            min="1"
                            max="300"
                            step="0.1"
                            placeholder="70"
                            className={`w-full border ${
                              measurements.weight
                                ? isFun
                                  ? 'border-purple-400 dark:border-purple-500 bg-purple-50/50 dark:bg-purple-900/30'
                                  : 'border-gray-900 dark:border-white bg-gray-100 dark:bg-gray-800'
                                : isFun
                                ? 'border-purple-200 dark:border-purple-700 bg-white/80 dark:bg-gray-800/80'
                                : 'border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800'
                            } text-gray-900 dark:text-white px-4 py-2.5 text-sm rounded-lg focus:outline-none focus:ring-2 ${
                              isFun
                                ? 'focus:ring-purple-500'
                                : 'focus:ring-gray-900 dark:focus:ring-white'
                            } transition-all`}
                          />
                        </div>

                        <div>
                          <label className="block text-xs uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-2">
                            Height (cm) *
                          </label>
                          <input
                            type="number"
                            value={measurements.height}
                            onChange={(e) => handleInputChange('height', e.target.value)}
                            min="50"
                            max="250"
                            placeholder="175"
                            className={`w-full border ${
                              measurements.height
                                ? isFun
                                  ? 'border-purple-400 dark:border-purple-500 bg-purple-50/50 dark:bg-purple-900/30'
                                  : 'border-gray-900 dark:border-white bg-gray-100 dark:bg-gray-800'
                                : isFun
                                ? 'border-purple-200 dark:border-purple-700 bg-white/80 dark:bg-gray-800/80'
                                : 'border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800'
                            } text-gray-900 dark:text-white px-4 py-2.5 text-sm rounded-lg focus:outline-none focus:ring-2 ${
                              isFun
                                ? 'focus:ring-purple-500'
                                : 'focus:ring-gray-900 dark:focus:ring-white'
                            } transition-all`}
                          />
                        </div>
                      </motion.div>

                      <motion.div variants={itemVariants} className="grid grid-cols-3 gap-4">
                        <div>
                          <label className="block text-xs uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-2">
                            Chest (cm)
                          </label>
                          <input
                            type="number"
                            value={measurements.chest}
                            onChange={(e) => handleInputChange('chest', e.target.value)}
                            min="50"
                            max="200"
                            placeholder="95"
                            className={`w-full border ${
                              isFun
                                ? 'border-purple-200 dark:border-purple-700 bg-white/80 dark:bg-gray-800/80'
                                : 'border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800'
                            } text-gray-900 dark:text-white px-4 py-2.5 text-sm rounded-lg focus:outline-none focus:ring-2 ${
                              isFun
                                ? 'focus:ring-purple-500'
                                : 'focus:ring-gray-900 dark:focus:ring-white'
                            } transition-all`}
                          />
                        </div>

                        <div>
                          <label className="block text-xs uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-2">
                            Waist (cm)
                          </label>
                          <input
                            type="number"
                            value={measurements.waist}
                            onChange={(e) => handleInputChange('waist', e.target.value)}
                            min="40"
                            max="150"
                            placeholder="80"
                            className={`w-full border ${
                              isFun
                                ? 'border-purple-200 dark:border-purple-700 bg-white/80 dark:bg-gray-800/80'
                                : 'border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800'
                            } text-gray-900 dark:text-white px-4 py-2.5 text-sm rounded-lg focus:outline-none focus:ring-2 ${
                              isFun
                                ? 'focus:ring-purple-500'
                                : 'focus:ring-gray-900 dark:focus:ring-white'
                            } transition-all`}
                          />
                        </div>

                        <div>
                          <label className="block text-xs uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-2">
                            Hips (cm)
                          </label>
                          <input
                            type="number"
                            value={measurements.hips}
                            onChange={(e) => handleInputChange('hips', e.target.value)}
                            min="60"
                            max="150"
                            placeholder="95"
                            className={`w-full border ${
                              isFun
                                ? 'border-purple-200 dark:border-purple-700 bg-white/80 dark:bg-gray-800/80'
                                : 'border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800'
                            } text-gray-900 dark:text-white px-4 py-2.5 text-sm rounded-lg focus:outline-none focus:ring-2 ${
                              isFun
                                ? 'focus:ring-purple-500'
                                : 'focus:ring-gray-900 dark:focus:ring-white'
                            } transition-all`}
                          />
                        </div>
                      </motion.div>

                      {/* General Size Recommendation */}
                      {!product && measurements.gender && measurements.weight && measurements.height && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={`p-6 rounded-xl border backdrop-blur-sm ${
                            isFun
                              ? 'bg-gradient-to-br from-cyan-50/70 via-emerald-50/70 to-teal-50/70 dark:from-cyan-900/30 dark:via-emerald-900/30 dark:to-teal-900/30 border-cyan-200/50 dark:border-cyan-700/50 shadow-lg'
                              : 'bg-gray-50/90 dark:bg-gray-800/90 border-gray-200 dark:border-gray-700 shadow-md'
                          }`}
                        >
                          <p className="text-xs uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-3">
                            Typical Size Range
                          </p>
                          <div className="flex items-baseline gap-3 mb-2">
                            <p className={`text-3xl font-light ${
                              isFun
                                ? 'bg-gradient-to-r from-cyan-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent'
                                : 'text-gray-900 dark:text-white'
                            }`}>
                              {(() => {
                                // Estimate general size based on measurements
                                const heightInMeters = measurements.height / 100;
                                const bmi = measurements.weight / (heightInMeters * heightInMeters);
                                let size;
                                if (measurements.gender === 'male') {
                                  if (bmi < 20) return 'S - M';
                                  if (bmi < 25) return 'M - L';
                                  if (bmi < 28) return 'L - XL';
                                  return 'XL - XXL';
                                } else {
                                  if (bmi < 19) return 'XS - S';
                                  if (bmi < 23) return 'S - M';
                                  if (bmi < 26) return 'M - L';
                                  return 'L - XL';
                                }
                              })()}
                            </p>
                          </div>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            Based on your measurements (BMI: {((measurements.weight / ((measurements.height / 100) ** 2)).toFixed(1))})
                          </p>
                        </motion.div>
                      )}
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="recommendations"
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    className="space-y-4"
                  >
                    <h4 className="text-sm font-light text-gray-900 dark:text-white tracking-wide mb-4">
                      Recommended For You
                    </h4>
                    
                    {recommendedProducts.length > 0 ? (
                      <div className="space-y-3 max-h-[400px] overflow-y-auto">
                        {recommendedProducts.map((recProduct, index) => (
                          <motion.div
                            key={recProduct.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                            whileHover={{ x: 4, scale: 1.01 }}
                            className="group"
                          >
                            <Link
                              to={`/product/${recProduct.id}`}
                              className={`block p-4 rounded-xl border transition-all ${
                                isFun
                                  ? 'bg-gradient-to-br from-purple-50/50 to-pink-50/50 dark:from-purple-900/20 dark:to-pink-900/20 border-purple-200/50 dark:border-purple-700/50 hover:border-purple-400 dark:hover:border-purple-500 hover:shadow-lg'
                                  : 'bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-md'
                              }`}
                            >
                              <div className="flex gap-4">
                                <div className={`w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 ${
                                  isFun ? 'rounded-2xl' : ''
                                }`}>
                                  <img
                                    src={recProduct.image || 'https://via.placeholder.com/80'}
                                    alt={recProduct.name}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                  />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <h5 className="text-sm font-light text-gray-900 dark:text-white mb-1 tracking-wide truncate">
                                    {recProduct.name}
                                  </h5>
                                  {recProduct.category && (
                                    <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-2">
                                      {recProduct.category}
                                    </p>
                                  )}
                                  <div className="flex items-center justify-between">
                                    <p className={`text-sm font-medium ${
                                      isFun
                                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent'
                                        : 'text-gray-900 dark:text-white'
                                    }`}>
                                      ${recProduct.price?.toFixed(2) || '0.00'}
                                    </p>
                                    {recProduct.onSale && (
                                      <span className={`text-[10px] uppercase tracking-widest px-2 py-0.5 rounded-full ${
                                        isFun
                                          ? 'bg-gradient-to-r from-rose-500 to-pink-500 text-white'
                                          : 'bg-black dark:bg-white text-white dark:text-black'
                                      }`}>
                                        Sale
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </Link>
                          </motion.div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                          Fill in your profile to get personalized recommendations
                        </p>
                        <p className="text-xs text-gray-400 dark:text-gray-500">
                          Go to "Size Help" tab and enter your measurements
                        </p>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AIAssistant;
