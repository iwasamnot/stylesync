import { useState } from 'react';

const ProductFilters = ({ 
  categories, 
  selectedCategory, 
  onCategoryChange,
  priceRange,
  onPriceRangeChange,
  selectedSizes,
  onSizeChange,
  onClearFilters
}) => {
  const [showFilters, setShowFilters] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    category: true,
    price: true,
    size: true,
  });
  
  const allSizes = ['S', 'M', 'L', 'XL', 'XXL', '28', '30', '32', '34', '36', '38', '7', '8', '9', '10', '11', '12', 'One Size'];

  const toggleSection = (section) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const priceRanges = [
    { value: 'all', label: 'All Prices' },
    { value: '0-50', label: '$0 - $50' },
    { value: '50-100', label: '$50 - $100' },
    { value: '100-200', label: '$100 - $200' },
    { value: '200+', label: '$200+' },
  ];

  const hasActiveFilters = selectedCategory || priceRange !== 'all' || selectedSizes.length > 0;

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden sticky top-24">
      {/* Mobile filter toggle */}
      <div className="lg:hidden">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="w-full flex items-center justify-between px-6 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold"
        >
          <span className="flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            Filters
            {hasActiveFilters && (
              <span className="bg-white text-indigo-600 text-xs font-bold px-2 py-0.5 rounded-full">
                {[selectedCategory, priceRange !== 'all' ? '1' : null, selectedSizes.length > 0 ? selectedSizes.length : null].filter(Boolean).length}
              </span>
            )}
          </span>
          <svg
            className={`w-5 h-5 transform transition-transform duration-300 ${showFilters ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      {/* Filter content */}
      <div className={`${showFilters ? 'block' : 'hidden'} lg:block`}>
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-indigo-50 to-purple-50 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              Filters
            </h2>
            {hasActiveFilters && (
              <button
                onClick={onClearFilters}
                className="text-sm text-indigo-600 hover:text-indigo-700 font-medium transition-colors"
              >
                Clear All
              </button>
            )}
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Category Filter */}
          <div>
            <button
              onClick={() => toggleSection('category')}
              className="w-full flex items-center justify-between mb-4"
            >
              <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
                Category
              </h3>
              <svg
                className={`w-4 h-4 text-gray-500 transform transition-transform duration-200 ${expandedSections.category ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {expandedSections.category && (
              <div className="flex flex-wrap gap-2 animate-fade-in">
                <button
                  onClick={() => onCategoryChange('')}
                  className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${
                    selectedCategory === ''
                      ? 'bg-indigo-600 text-white shadow-md transform scale-105'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  All
                </button>
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => onCategoryChange(category)}
                    className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${
                      selectedCategory === category
                        ? 'bg-indigo-600 text-white shadow-md transform scale-105'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Price Range Filter */}
          <div>
            <button
              onClick={() => toggleSection('price')}
              className="w-full flex items-center justify-between mb-4"
            >
              <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Price Range
              </h3>
              <svg
                className={`w-4 h-4 text-gray-500 transform transition-transform duration-200 ${expandedSections.price ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {expandedSections.price && (
              <div className="space-y-2 animate-fade-in">
                {priceRanges.map((range) => (
                  <button
                    key={range.value}
                    onClick={() => onPriceRangeChange(range.value)}
                    className={`w-full text-left px-4 py-3 rounded-lg font-medium text-sm transition-all duration-200 ${
                      priceRange === range.value
                        ? 'bg-indigo-600 text-white shadow-md'
                        : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200'
                    }`}
                  >
                    {range.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Size Filter */}
          <div>
            <button
              onClick={() => toggleSection('size')}
              className="w-full flex items-center justify-between mb-4"
            >
              <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
                </svg>
                Size
                {selectedSizes.length > 0 && (
                  <span className="bg-indigo-100 text-indigo-600 text-xs font-bold px-2 py-0.5 rounded-full">
                    {selectedSizes.length}
                  </span>
                )}
              </h3>
              <svg
                className={`w-4 h-4 text-gray-500 transform transition-transform duration-200 ${expandedSections.size ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {expandedSections.size && (
              <div className="grid grid-cols-4 gap-2 animate-fade-in">
                {allSizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => onSizeChange(size, !selectedSizes.includes(size))}
                    className={`px-3 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${
                      selectedSizes.includes(size)
                        ? 'bg-indigo-600 text-white shadow-md transform scale-105'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductFilters;

