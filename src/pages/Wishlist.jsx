import { motion } from 'framer-motion';
import { useWishlist } from '../context/WishlistContext';
import { useTheme } from '../context/ThemeContext';
import ProductCard from '../components/ProductCard';
import { Link } from 'react-router-dom';
import { getThemeClasses } from '../utils/themeStyles';

const Wishlist = () => {
  const { wishlistItems, clearWishlist } = useWishlist();
  const { theme } = useTheme();
  const isFun = theme === 'fun';
  const themeClasses = getThemeClasses(theme, isFun);

  if (wishlistItems.length === 0) {
    return (
      <div className="min-h-screen bg-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className={themeClasses.heading.h1}>My Wishlist</h1>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`${themeClasses.emptyState} p-12 text-center`}
          >
            <svg
              className="mx-auto h-24 w-24 text-gray-400 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
            <h2 className="text-xl font-light text-gray-900 dark:text-white mb-2 tracking-wide">Your wishlist is empty</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Start adding items you love to your wishlist</p>
            <motion.div whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.95 }}>
              <Link to="/" className={themeClasses.button.primary + ' inline-block'}>
                Continue Shopping
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className={themeClasses.heading.h1}>
            My Wishlist <span className="text-lg text-gray-500 dark:text-gray-400">({wishlistItems.length})</span>
          </h1>
          <motion.button
            onClick={clearWishlist}
            className="text-xs uppercase tracking-widest font-light text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Clear Wishlist
          </motion.button>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          {wishlistItems.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <ProductCard product={product} index={index} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default Wishlist;

