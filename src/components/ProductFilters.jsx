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
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 overflow-hidden sticky top-24">
      {/* Mobile filter toggle */}
      <div className="lg:hidden">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="w-full flex items-center justify-between px-6 py-4 bg-black text-white text-xs uppercase tracking-widest font-light"
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
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center justify-between">
            <h2 className="text-xs uppercase tracking-widest text-gray-900 dark:text-white font-light">
              Filters
            </h2>
            {hasActiveFilters && (
              <button
                onClick={onClearFilters}
                className="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white uppercase tracking-widest font-light transition-colors"
              >
                Clear
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
              <h3 className="text-xs uppercase tracking-widest text-gray-900 dark:text-white font-light">
                Category
              </h3>
              <svg
                className={`w-4 h-4 text-gray-500 dark:text-gray-400 transform transition-transform duration-200 ${expandedSections.category ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {expandedSections.category && (
              <div className="space-y-2 animate-fade-in">
                <button
                  onClick={() => onCategoryChange('')}
                  className={`block w-full text-left px-0 py-2 text-xs uppercase tracking-widest font-light transition-colors ${
                    selectedCategory === ''
                      ? 'text-gray-900 dark:text-white border-b border-gray-900 dark:border-white'
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  All
                </button>
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => onCategoryChange(category)}
                    className={`block w-full text-left px-0 py-2 text-xs uppercase tracking-widest font-light transition-colors ${
                      selectedCategory === category
                        ? 'text-gray-900 dark:text-white border-b border-gray-900 dark:border-white'
                        : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
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
              <h3 className="text-xs uppercase tracking-widest text-gray-900 dark:text-white font-light">
                Price
              </h3>
              <svg
                className={`w-4 h-4 text-gray-500 dark:text-gray-400 transform transition-transform duration-200 ${expandedSections.price ? 'rotate-180' : ''}`}
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
                    className={`block w-full text-left px-0 py-2 text-xs uppercase tracking-widest font-light transition-colors ${
                      priceRange === range.value
                        ? 'text-gray-900 dark:text-white border-b border-gray-900 dark:border-white'
                        : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
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
              <h3 className="text-xs uppercase tracking-widest text-gray-900 dark:text-white font-light">
                Size
                {selectedSizes.length > 0 && (
                  <span className="ml-2 text-gray-500 dark:text-gray-400">({selectedSizes.length})</span>
                )}
              </h3>
              <svg
                className={`w-4 h-4 text-gray-500 dark:text-gray-400 transform transition-transform duration-200 ${expandedSections.size ? 'rotate-180' : ''}`}
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
                    className={`px-3 py-2 text-xs uppercase tracking-widest font-light transition-colors border ${
                      selectedSizes.includes(size)
                        ? 'bg-black dark:bg-white text-white dark:text-black border-black dark:border-white'
                        : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-700 hover:border-gray-900 dark:hover:border-white'
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

