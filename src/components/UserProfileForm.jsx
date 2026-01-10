import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUserProfile } from '../context/UserProfileContext';
import { useTheme } from '../context/ThemeContext';

const UserProfileForm = ({ isOpen, onClose }) => {
  const { profile, updateProfile } = useUserProfile();
  const { theme } = useTheme();
  const [formData, setFormData] = useState({
    gender: profile.gender || '',
    age: profile.age || '',
    weight: profile.weight || '',
    height: profile.height || '',
    chest: profile.chest || '',
    waist: profile.waist || '',
    hips: profile.hips || '',
    preferredSize: profile.preferredSize || '',
    priceRange: profile.priceRange || '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    updateProfile(formData);
    onClose();
  };

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-50"
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-200 dark:border-gray-800">
              {/* Header */}
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
                <h2 className="text-xl font-light text-gray-900 dark:text-white">Your Profile</h2>
                <button
                  onClick={onClose}
                  className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    Help us recommend the perfect size by providing your measurements. All information is optional but helps improve recommendations.
                  </p>
                </div>

                {/* Basic Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-2">
                      Gender *
                    </label>
                    <select
                      value={formData.gender}
                      onChange={(e) => handleChange('gender', e.target.value)}
                      className="w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-4 py-2 text-sm focus:outline-none focus:border-gray-900 dark:focus:border-white"
                      required
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
                      value={formData.age}
                      onChange={(e) => handleChange('age', e.target.value)}
                      min="1"
                      max="120"
                      className="w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-4 py-2 text-sm focus:outline-none focus:border-gray-900 dark:focus:border-white"
                      placeholder="e.g., 25"
                    />
                  </div>
                </div>

                {/* Measurements */}
                <div className="border-t border-gray-200 dark:border-gray-800 pt-4">
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-4">Measurements</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-2">
                        Weight (kg) *
                      </label>
                      <input
                        type="number"
                        value={formData.weight}
                        onChange={(e) => handleChange('weight', e.target.value)}
                        min="1"
                        max="300"
                        step="0.1"
                        className="w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-4 py-2 text-sm focus:outline-none focus:border-gray-900 dark:focus:border-white"
                        placeholder="e.g., 70"
                        required
                      />
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Or use pounds and convert: 1 kg ≈ 2.2 lbs</p>
                    </div>

                    <div>
                      <label className="block text-xs uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-2">
                        Height (cm) *
                      </label>
                      <input
                        type="number"
                        value={formData.height}
                        onChange={(e) => handleChange('height', e.target.value)}
                        min="50"
                        max="250"
                        className="w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-4 py-2 text-sm focus:outline-none focus:border-gray-900 dark:focus:border-white"
                        placeholder="e.g., 175"
                        required
                      />
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Or use feet/inches: 5'10" ≈ 178 cm</p>
                    </div>

                    <div>
                      <label className="block text-xs uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-2">
                        Chest (cm)
                      </label>
                      <input
                        type="number"
                        value={formData.chest}
                        onChange={(e) => handleChange('chest', e.target.value)}
                        min="50"
                        max="200"
                        className="w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-4 py-2 text-sm focus:outline-none focus:border-gray-900 dark:focus:border-white"
                        placeholder="Optional"
                      />
                    </div>

                    <div>
                      <label className="block text-xs uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-2">
                        Waist (cm)
                      </label>
                      <input
                        type="number"
                        value={formData.waist}
                        onChange={(e) => handleChange('waist', e.target.value)}
                        min="40"
                        max="150"
                        className="w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-4 py-2 text-sm focus:outline-none focus:border-gray-900 dark:focus:border-white"
                        placeholder="Optional"
                      />
                    </div>

                    <div>
                      <label className="block text-xs uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-2">
                        Hips (cm)
                      </label>
                      <input
                        type="number"
                        value={formData.hips}
                        onChange={(e) => handleChange('hips', e.target.value)}
                        min="60"
                        max="150"
                        className="w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-4 py-2 text-sm focus:outline-none focus:border-gray-900 dark:focus:border-white"
                        placeholder="Optional"
                      />
                    </div>

                    <div>
                      <label className="block text-xs uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-2">
                        Preferred Size
                      </label>
                      <select
                        value={formData.preferredSize}
                        onChange={(e) => handleChange('preferredSize', e.target.value)}
                        className="w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-4 py-2 text-sm focus:outline-none focus:border-gray-900 dark:focus:border-white"
                      >
                        <option value="">Any</option>
                        <option value="XS">XS</option>
                        <option value="S">S</option>
                        <option value="M">M</option>
                        <option value="L">L</option>
                        <option value="XL">XL</option>
                        <option value="XXL">XXL</option>
                        <option value="XXXL">XXXL</option>
                        <option value="28">28</option>
                        <option value="30">30</option>
                        <option value="32">32</option>
                        <option value="34">34</option>
                        <option value="36">36</option>
                        <option value="38">38</option>
                        <option value="40">40</option>
                        <option value="42">42</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Preferences */}
                <div className="border-t border-gray-200 dark:border-gray-800 pt-4">
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-4">Preferences</h3>
                  
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-2">
                      Price Range
                    </label>
                    <select
                      value={formData.priceRange}
                      onChange={(e) => handleChange('priceRange', e.target.value)}
                      className="w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-4 py-2 text-sm focus:outline-none focus:border-gray-900 dark:focus:border-white"
                    >
                      <option value="">Any</option>
                      <option value="low">Under $50</option>
                      <option value="medium">$50 - $100</option>
                      <option value="high">Over $100</option>
                    </select>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-4 pt-4 border-t border-gray-200 dark:border-gray-800">
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 px-6 py-2 text-sm uppercase tracking-widest font-light hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className={`flex-1 px-6 py-2 text-sm uppercase tracking-widest font-light transition-colors ${
                      theme === 'fun'
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                        : 'border border-black dark:border-white text-black dark:text-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black'
                    }`}
                  >
                    Save Profile
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default UserProfileForm;
