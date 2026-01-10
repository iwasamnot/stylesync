import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

const ShimmerLoader = ({ width = '100%', height = '20px', className = '', rounded = true }) => {
  const { theme } = useTheme();

  return (
    <motion.div
      className={`shimmer ${rounded ? 'rounded-lg' : ''} ${
        theme === 'dark' ? 'bg-gray-800' : 'bg-gray-200'
      } ${className}`}
      style={{ width, height }}
      initial={{ opacity: 0.6 }}
      animate={{ opacity: [0.6, 1, 0.6] }}
      transition={{
        duration: 1.5,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    />
  );
};

export const ProductCardSkeleton = ({ index = 0 }) => {
  const { theme } = useTheme();
  const isFun = theme === 'fun';

  return (
    <motion.div
      className={`group bg-white dark:bg-gray-900 overflow-hidden ${
        isFun ? 'rounded-2xl border border-white/60 shadow-lg' : 'rounded-lg shadow-md'
      }`}
      initial={{ opacity: 0, y: 40, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: index * 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className={`aspect-square bg-gray-100 dark:bg-gray-800 overflow-hidden relative ${
        isFun ? 'rounded-2xl' : 'rounded-t-lg'
      }`}>
        <ShimmerLoader width="100%" height="100%" rounded={false} />
      </div>
      <div className={`pt-4 ${isFun ? 'px-4 pb-4' : 'px-4 pb-4'}`}>
        <ShimmerLoader width="80%" height="20px" className="mb-2" />
        <ShimmerLoader width="60%" height="16px" className="mb-3" />
        <div className="flex items-center justify-between">
          <ShimmerLoader width="40%" height="20px" />
          <div className={`w-8 h-8 rounded-full ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-200'}`} />
        </div>
      </div>
    </motion.div>
  );
};

export default ShimmerLoader;
