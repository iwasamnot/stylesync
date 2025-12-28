import { useRecentlyViewed } from '../context/RecentlyViewedContext';
import ProductCard from './ProductCard';

const RecentlyViewed = () => {
  const { recentlyViewed, clearRecentlyViewed } = useRecentlyViewed();

  if (recentlyViewed.length === 0) return null;

  return (
    <div className="mb-20">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-xs uppercase tracking-widest text-gray-500 dark:text-gray-400 font-light">
          Recently Viewed
        </h2>
        <button
          onClick={clearRecentlyViewed}
          className="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white uppercase tracking-widest font-light transition-colors"
        >
          Clear
        </button>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
        {recentlyViewed.slice(0, 4).map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default RecentlyViewed;

