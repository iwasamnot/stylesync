import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { calculateDiscount } from '../utils/helpers';
import WishlistButton from './WishlistButton';
import ProductQuickView from './ProductQuickView';
import { useTheme } from '../context/ThemeContext';

const ProductCard = ({ product, index = 0 }) => {
  const [showQuickView, setShowQuickView] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const { theme } = useTheme();
  const isFun = theme === 'fun';
  const inStock = (product?.stock || 0) > 0;
  const discount = product?.onSale && product?.originalPrice 
    ? calculateDiscount(product.originalPrice, product.price) 
    : 0;

  const cardVariants = {
    hidden: { opacity: 0, y: 40, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        delay: index * 0.1,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  const imageVariants = {
    rest: { scale: 1, filter: 'brightness(1)' },
    hover: {
      scale: 1.05,
      filter: 'brightness(1.1)',
      transition: {
        duration: 0.4,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  return (
    <>
      <motion.div
        className="group"
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
      >
        <motion.div
          className={`bg-white dark:bg-gray-900 overflow-hidden fluid-hover ${
            isFun ? 'rounded-2xl border border-white/60 shadow-lg' : 'rounded-lg'
          } ${isHovered ? 'shadow-2xl' : 'shadow-md'}`}
          whileHover={{ y: -8 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className={`aspect-square bg-gray-100 dark:bg-gray-800 overflow-hidden relative ${isFun ? 'rounded-2xl' : 'rounded-t-lg'}`}>
            <Link to={`/product/${product?.id || '1'}`}>
              <motion.img
                src={product?.image || 'https://via.placeholder.com/300'}
                alt={product?.name || 'Product'}
                className="w-full h-full object-cover"
                variants={imageVariants}
                initial="rest"
                animate={isHovered ? 'hover' : 'rest'}
              />
            </Link>
            <motion.div
              className="absolute top-4 left-4 z-10"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 + index * 0.05, duration: 0.4 }}
            >
              {product?.onSale && discount > 0 && (
                <motion.span
                  className={[
                    'px-3 py-1 text-xs font-medium tracking-wide uppercase inline-block',
                    isFun
                      ? 'rounded-full bg-gradient-to-r from-rose-500 via-fuchsia-500 to-indigo-500 text-white shadow-lg'
                      : 'rounded-md bg-black dark:bg-white text-white dark:text-black',
                  ].join(' ')}
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                >
                  {discount}% OFF
                </motion.span>
              )}
              {product?.newArrival && !product?.onSale && (
                <motion.span
                  className={[
                    'px-3 py-1 text-xs font-medium tracking-wide uppercase inline-block',
                    isFun
                      ? 'rounded-full bg-gradient-to-r from-cyan-500 to-emerald-500 text-white shadow-lg'
                      : 'rounded-md bg-black dark:bg-white text-white dark:text-black',
                  ].join(' ')}
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                >
                  NEW
                </motion.span>
              )}
            </motion.div>
            <motion.div
              className="absolute top-4 right-4 flex gap-2 z-10"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : -10 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            >
              <WishlistButton product={product} />
              <motion.button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  setShowQuickView(true);
                }}
                className={[
                  'p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white',
                  isFun ? 'rounded-full bg-white/90 dark:bg-gray-800 shadow-lg backdrop-blur-sm' : 'rounded-md bg-white/90 dark:bg-gray-800 backdrop-blur-sm',
                ].join(' ')}
                aria-label="Quick view"
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </motion.button>
            </div>
            {!inStock && (
              <div className="absolute inset-0 bg-white/80 dark:bg-gray-900/80 flex items-center justify-center">
                <span className="text-sm font-medium tracking-wide uppercase text-gray-600 dark:text-gray-400">Out of Stock</span>
              </div>
            )}
          </div>
          <motion.div
            className={`pt-4 ${isFun ? 'px-4 pb-4' : 'px-4 pb-4'}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 + index * 0.05, duration: 0.4 }}
          >
            {product?.category && (
              <motion.p
                className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-1 font-light"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + index * 0.05 }}
              >
                {product.category}
              </motion.p>
            )}
            <Link to={`/product/${product?.id || '1'}`}>
              <motion.h3
                className="text-sm font-light text-gray-900 dark:text-white mb-2 tracking-wide transition-colors"
                whileHover={{ x: 4, color: isFun ? '#ec4899' : '#6366f1' }}
                transition={{ duration: 0.3 }}
              >
                {product?.name || 'Product Name'}
              </motion.h3>
            </Link>
            <div className="flex items-baseline justify-between">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 + index * 0.05 }}
              >
                {product?.onSale && product?.originalPrice ? (
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      ${product?.price?.toFixed(2) || '0.00'}
                    </p>
                    <p className="text-xs text-gray-400 line-through">
                      ${product.originalPrice.toFixed(2)}
                    </p>
                  </div>
                ) : (
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    ${product?.price?.toFixed(2) || '0.00'}
                  </p>
                )}
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
      <ProductQuickView 
        product={product} 
        isOpen={showQuickView} 
        onClose={() => setShowQuickView(false)} 
      />
    </>
  );
};

export default ProductCard;

