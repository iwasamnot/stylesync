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
  
  const allSizes = ['S', 'M', 'L', 'XL', 'XXL', '28', '30', '32', '34', '36', '38', '7', '8', '9', '10', '11', '12', 'One Size'];

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      {/* Mobile filter toggle */}
      <div className="lg:hidden mb-4">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="w-full flex items-center justify-between px-4 py-2 bg-gray-100 rounded-md hover:bg-gray-200"
        >
          <span className="font-medium">Filters</span>
          <svg
            className={`w-5 h-5 transform transition-transform ${showFilters ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      {/* Filter content */}
      <div className={`${showFilters ? 'block' : 'hidden'} lg:block space-y-6`}>
        {/* Category Filter */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Category</h3>
          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="radio"
                name="category"
                value=""
                checked={selectedCategory === ''}
                onChange={(e) => onCategoryChange(e.target.value)}
                className="mr-2"
              />
              <span>All Categories</span>
            </label>
            {categories.map((category) => (
              <label key={category} className="flex items-center">
                <input
                  type="radio"
                  name="category"
                  value={category}
                  checked={selectedCategory === category}
                  onChange={(e) => onCategoryChange(e.target.value)}
                  className="mr-2"
                />
                <span>{category}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Price Range Filter */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Price Range</h3>
          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="radio"
                name="priceRange"
                value="all"
                checked={priceRange === 'all'}
                onChange={(e) => onPriceRangeChange(e.target.value)}
                className="mr-2"
              />
              <span>All Prices</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="priceRange"
                value="0-50"
                checked={priceRange === '0-50'}
                onChange={(e) => onPriceRangeChange(e.target.value)}
                className="mr-2"
              />
              <span>$0 - $50</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="priceRange"
                value="50-100"
                checked={priceRange === '50-100'}
                onChange={(e) => onPriceRangeChange(e.target.value)}
                className="mr-2"
              />
              <span>$50 - $100</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="priceRange"
                value="100-200"
                checked={priceRange === '100-200'}
                onChange={(e) => onPriceRangeChange(e.target.value)}
                className="mr-2"
              />
              <span>$100 - $200</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="priceRange"
                value="200+"
                checked={priceRange === '200+'}
                onChange={(e) => onPriceRangeChange(e.target.value)}
                className="mr-2"
              />
              <span>$200+</span>
            </label>
          </div>
        </div>

        {/* Size Filter */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Size</h3>
          <div className="grid grid-cols-3 gap-2">
            {allSizes.map((size) => (
              <label key={size} className="flex items-center">
                <input
                  type="checkbox"
                  checked={selectedSizes.includes(size)}
                  onChange={(e) => onSizeChange(size, e.target.checked)}
                  className="mr-1"
                />
                <span className="text-sm">{size}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Clear Filters Button */}
        <button
          onClick={onClearFilters}
          className="w-full px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
        >
          Clear All Filters
        </button>
      </div>
    </div>
  );
};

export default ProductFilters;

