const ProductSort = ({ sortBy, onSortChange, productCount }) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-12 gap-4 pb-4 border-b border-gray-200">
      <div className="text-xs text-gray-500 uppercase tracking-widest font-light">
        {productCount} {productCount === 1 ? 'item' : 'items'}
      </div>
      <div className="flex items-center gap-4">
        <label htmlFor="sort" className="text-xs text-gray-500 uppercase tracking-widest font-light">
          Sort
        </label>
        <select
          id="sort"
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value)}
          className="border-0 border-b border-gray-300 bg-transparent text-xs text-gray-900 font-light focus:outline-none focus:border-gray-900 cursor-pointer transition-colors py-1"
        >
          <option value="newest">Newest</option>
          <option value="price-low">Price: Low to High</option>
          <option value="price-high">Price: High to Low</option>
          <option value="name-asc">Name: A-Z</option>
          <option value="name-desc">Name: Z-A</option>
        </select>
      </div>
    </div>
  );
};

export default ProductSort;

