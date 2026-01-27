import { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useUserProfile } from '../context/UserProfileContext';
import { useRecentlyViewed } from '../context/RecentlyViewedContext';
import { recommendSize } from '../utils/sizeRecommendation';
import { recommendProducts } from '../utils/productRecommendation';
import { useTheme } from '../context/ThemeContext';

const AIAssistant = ({ product = null, allProducts = [], onSizeRecommendation = null }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('size');
  
  const { profile, updateProfile } = useUserProfile();
  const { recentlyViewed } = useRecentlyViewed();
  const { theme } = useTheme();
  const isFun = theme === 'fun';

  // --- Form State ---
  const [measurements, setMeasurements] = useState({
    gender: '', age: '', weight: '', height: '',
    chest: '', waist: '', hips: '',
    ...profile // Spread profile to set defaults safely
  });

  // Sync state when profile loads/updates
  useEffect(() => {
    setMeasurements((prev) => ({ ...prev, ...profile }));
  }, [profile]);

  const handleInputChange = (field, value) => {
    const updated = { ...measurements, [field]: value };
    setMeasurements(updated);
    updateProfile(updated);
  };

  // --- Logic Refactoring ---

  // 1. Determine Logic Status instead of nested ifs
  const sizeStatus = useMemo(() => {
    const { gender, weight, height } = measurements;
    
    // Condition 1: Missing Input
    if (!gender || !weight || !height) return 'MISSING_INPUTS';
    
    // Condition 2: General Estimate (No specific product selected)
    if (!product) return 'GENERAL_ESTIMATE';

    // Calculate Size
    const recSize = recommendSize(measurements, product.category);
    
    // Condition 3: Calculation Failed
    if (!recSize) return 'CALCULATION_FAILED';

    // Condition 4: Product Availability Check
    const availableSizes = product.sizes || [];
    const isExactMatch = availableSizes.includes(recSize);

    return isExactMatch ? 'PERFECT_MATCH' : 'NO_EXACT_MATCH';
  }, [measurements, product]);

  // 2. Specific Size Value
  const calculatedSize = useMemo(() => {
    if (!product || sizeStatus === 'MISSING_INPUTS') return null;
    return recommendSize(measurements, product.category);
  }, [measurements, product, sizeStatus]);

  // 3. General Size Range Logic (Replaced if/else with Lookup)
  const generalSizeEstimate = useMemo(() => {
    if (sizeStatus === 'MISSING_INPUTS') return null;

    const h = parseFloat(measurements.height) / 100;
    const w = parseFloat(measurements.weight);
    const bmi = w / (h * h);

    const ranges = measurements.gender === 'male' 
      ? [ { max: 20, label: 'S - M' }, { max: 25, label: 'M - L' }, { max: 28, label: 'L - XL' } ]
      : [ { max: 19, label: 'XS - S' }, { max: 23, label: 'S - M' }, { max: 26, label: 'M - L' } ];

    const match = ranges.find(r => bmi < r.max);
    return {
      label: match ? match.label : 'XL - XXL',
      bmi: bmi.toFixed(1)
    };
  }, [measurements, sizeStatus]);

  // 4. Product Recommendations
  const recommendedProducts = useMemo(() => {
    if (!allProducts?.length) return [];
    return recommendProducts(allProducts, { ...profile, ...measurements }, recentlyViewed, 6);
  }, [allProducts, profile, measurements, recentlyViewed]);

  const handleSelectSize = () => {
    if (calculatedSize && onSizeRecommendation) {
      onSizeRecommendation(calculatedSize);
    }
  };

  // --- Animation Variants ---
  const containerVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
    exit: { opacity: 0, y: 20, scale: 0.95, transition: { duration: 0.3 } },
  };

  // --- Render Helpers (Keeps JSX Clean) ---

  const renderSizeResult = () => {
    // Switch case is cleaner than nested ternaries for UI states
    switch (sizeStatus) {
      case 'MISSING_INPUTS':
        return (
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Fill in your measurements below to get a size recommendation.
          </p>
        );

      case 'PERFECT_MATCH':
        return (
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-2">Recommended Size</p>
                <motion.p 
                  className={`text-4xl font-light mb-2 ${isFun ? 'bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 bg-clip-text text-transparent' : 'text-gray-900 dark:text-white'}`}
                  initial={{ scale: 0 }} animate={{ scale: 1 }}
                >
                  {calculatedSize}
                </motion.p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Based on your measurements</p>
              </div>
              <motion.button
                onClick={handleSelectSize}
                whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.95 }}
                className={`px-6 py-3 rounded-xl text-xs uppercase tracking-widest font-light shadow-lg ${isFun ? 'bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500 text-white' : 'bg-black dark:bg-white text-white dark:text-black'}`}
              >
                Select
              </motion.button>
            </div>
          </motion.div>
        );

      case 'NO_EXACT_MATCH':
        return (
          <div>
            <p className="text-xs uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-2">Recommended Size</p>
            <p className={`text-3xl font-light mb-2 ${isFun ? 'text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600' : 'text-gray-900 dark:text-white'}`}>
              {calculatedSize}
            </p>
            <p className="text-xs text-amber-600 dark:text-amber-400 font-medium">
               Size {calculatedSize} is unavailable. Closest available: {product.sizes?.[0] || 'N/A'}
            </p>
          </div>
        );

      case 'GENERAL_ESTIMATE':
        return (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`p-6 rounded-xl border backdrop-blur-sm ${isFun ? 'bg-gradient-to-br from-cyan-50/70 to-teal-50/70 dark:from-cyan-900/30 dark:to-teal-900/30 border-cyan-200/50' : 'bg-gray-50/90 border-gray-200'}`}>
            <p className="text-xs uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-3">Typical Size Range</p>
            <div className="flex items-baseline gap-3 mb-2">
              <p className={`text-3xl font-light ${isFun ? 'text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-teal-600' : 'text-gray-900 dark:text-white'}`}>
                {generalSizeEstimate?.label}
              </p>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Based on your measurements (BMI: {generalSizeEstimate?.bmi})
            </p>
          </motion.div>
        );

      default: return null;
    }
  };

  // --- Main JSX ---
  return (
    <>
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 ${
          isFun ? 'bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500 text-white' : 'bg-black dark:bg-white text-white dark:text-black'
        }`}
        whileHover={{ scale: 1.1, rotate: 5 }} whileTap={{ scale: 0.95 }}
      >
        {isOpen ? (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        ) : (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
        )}
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            variants={containerVariants} initial="hidden" animate="visible" exit="exit"
            className="fixed bottom-24 right-6 z-50 w-[420px] max-w-[calc(100vw-3rem)] max-h-[calc(100vh-8rem)] glass-morphism backdrop-blur-xl bg-white/90 dark:bg-gray-900/90 border border-white/20 rounded-2xl shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Background Effects */}
            {isFun && (
               <>
                 <motion.div className="absolute -top-20 -right-20 w-40 h-40 bg-purple-400/20 rounded-full blur-3xl pointer-events-none" animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 8, repeat: Infinity }} />
                 <motion.div className="absolute -bottom-20 -left-20 w-40 h-40 bg-pink-400/20 rounded-full blur-3xl pointer-events-none" animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 10, repeat: Infinity, delay: -2 }} />
               </>
            )}

            {/* Header */}
            <div className="relative z-10 px-6 py-4 border-b border-gray-200/50 flex items-center gap-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isFun ? 'bg-gradient-to-r from-purple-500 to-pink-500 shadow-lg' : 'bg-black dark:bg-white'}`}>
                <svg className="w-5 h-5 text-white dark:text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              </div>
              <div>
                <h3 className="text-base font-light text-gray-900 dark:text-white">AI Assistant</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-widest">StyleSync Helper</p>
              </div>
            </div>

            {/* Tabs */}
            <div className="relative z-10 px-6 pt-4 border-b border-gray-200/50 flex gap-2">
              {['size', 'recommendations'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`relative px-4 py-2 text-xs uppercase tracking-widest font-light transition-colors rounded-t-lg ${activeTab === tab ? 'text-gray-900 dark:text-white' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  {tab === 'size' ? 'Size Help' : 'Recommendations'}
                  {activeTab === tab && (
                    <motion.div className={`absolute bottom-0 left-0 right-0 h-0.5 ${isFun ? 'bg-gradient-to-r from-purple-500 to-pink-500' : 'bg-black dark:bg-white'}`} layoutId="activeTab" />
                  )}
                </button>
              ))}
            </div>

            {/* Content Area */}
            <div className="relative z-10 flex-1 overflow-y-auto p-6">
              <AnimatePresence mode="wait">
                {activeTab === 'size' ? (
                  <motion.div key="size" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
                    
                    {/* Dynamic Result Panel */}
                    {(product || sizeStatus === 'GENERAL_ESTIMATE') && (
                      <div className={`p-6 rounded-xl border backdrop-blur-sm ${isFun ? 'bg-gradient-to-br from-purple-50/70 to-rose-50/70 border-purple-200/50' : 'bg-gray-50/90 border-gray-200'}`}>
                        {product && <h4 className="text-sm font-light text-gray-900 dark:text-white mb-4 tracking-wide">Size for {product.name}</h4>}
                        {renderSizeResult()}
                      </div>
                    )}

                    {/* Inputs */}
                    <div className="space-y-4">
                      <h4 className="text-sm font-light text-gray-900 dark:text-white tracking-wide mb-4">Your Measurements</h4>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col gap-2">
                            <label className="text-xs uppercase tracking-widest text-gray-500">Gender *</label>
                            <select value={measurements.gender} onChange={(e) => handleInputChange('gender', e.target.value)} className="w-full border border-gray-300 p-2.5 rounded-lg text-sm bg-white dark:bg-gray-800 focus:ring-2 focus:ring-purple-500">
                                <option value="">Select...</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                            </select>
                        </div>
                        <div className="flex flex-col gap-2">
                             <label className="text-xs uppercase tracking-widest text-gray-500">Age</label>
                             <input type="number" value={measurements.age} onChange={(e) => handleInputChange('age', e.target.value)} className="w-full border border-gray-300 p-2.5 rounded-lg text-sm bg-white dark:bg-gray-800" placeholder="25" />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                         <div className="flex flex-col gap-2">
                             <label className="text-xs uppercase tracking-widest text-gray-500">Weight (kg) *</label>
                             <input type="number" value={measurements.weight} onChange={(e) => handleInputChange('weight', e.target.value)} className="w-full border border-gray-300 p-2.5 rounded-lg text-sm bg-white dark:bg-gray-800" placeholder="70" />
                         </div>
                         <div className="flex flex-col gap-2">
                             <label className="text-xs uppercase tracking-widest text-gray-500">Height (cm) *</label>
                             <input type="number" value={measurements.height} onChange={(e) => handleInputChange('height', e.target.value)} className="w-full border border-gray-300 p-2.5 rounded-lg text-sm bg-white dark:bg-gray-800" placeholder="175" />
                         </div>
                      </div>

                      <div className="grid grid-cols-3 gap-4">
                        {['chest', 'waist', 'hips'].map(field => (
                          <div key={field} className="flex flex-col gap-2">
                            <label className="text-xs uppercase tracking-widest text-gray-500 capitalize">{field}</label>
                            <input type="number" value={measurements[field]} onChange={(e) => handleInputChange(field, e.target.value)} className="w-full border border-gray-300 p-2.5 rounded-lg text-sm bg-white dark:bg-gray-800" placeholder="-" />
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div key="recommendations" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
                     <h4 className="text-sm font-light text-gray-900 dark:text-white tracking-wide mb-4">Recommended For You</h4>
                     {recommendedProducts.length > 0 ? (
                        <div className="space-y-3">
                            {recommendedProducts.map((recProduct, idx) => (
                                <Link to={`/product/${recProduct.id}`} key={recProduct.id} className="flex gap-4 p-3 rounded-xl border border-gray-100 hover:shadow-md transition-all bg-white dark:bg-gray-800">
                                    <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden"><img src={recProduct.image} alt={recProduct.name} className="w-full h-full object-cover" /></div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-900 dark:text-white">{recProduct.name}</p>
                                        <p className="text-xs text-gray-500">{recProduct.category}</p>
                                        <p className="text-sm font-bold mt-1">${recProduct.price}</p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                     ) : (
                        <div className="text-center py-8 text-gray-500 text-sm">Fill in your measurements to get recommendations.</div>
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
