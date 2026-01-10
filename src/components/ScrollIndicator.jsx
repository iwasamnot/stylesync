import { useEffect, useState, useCallback } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { optimizeScroll, prefersReducedMotion } from '../utils/performance';

const ScrollIndicator = () => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const shouldReduceMotion = useReducedMotion() || prefersReducedMotion();
  const { theme } = useTheme();
  const isFun = theme === 'fun';

  useEffect(() => {
    const updateScrollProgress = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrolled = window.scrollY;
      const progress = scrollHeight > 0 ? (scrolled / scrollHeight) * 100 : 0;
      setScrollProgress(Math.min(100, Math.max(0, progress))); // Clamp between 0-100
    };

    // Optimize scroll handler with requestAnimationFrame for 60fps+
    const optimizedScroll = optimizeScroll(updateScrollProgress, { wait: 0 });
    
    window.addEventListener('scroll', optimizedScroll, { passive: true });
    updateScrollProgress(); // Initial calculation

    return () => window.removeEventListener('scroll', optimizedScroll);
  }, []);

  return (
    <div 
      className="fixed top-0 left-0 w-full h-1 bg-gray-200 dark:bg-gray-800 z-[9999]"
      style={{
        transform: 'translateZ(0)', // GPU acceleration
        willChange: 'auto',
      }}
    >
      <motion.div
        className={`h-full ${
          isFun
            ? 'bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500'
            : 'bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500'
        }`}
        style={{ 
          width: `${scrollProgress}%`,
          // GPU acceleration for smooth 60fps+ updates
          willChange: 'width',
          transform: 'translateZ(0)',
          backfaceVisibility: 'hidden',
        }}
        initial={{ width: 0 }}
        animate={{ width: shouldReduceMotion ? `${scrollProgress}%` : `${scrollProgress}%` }}
        transition={{ 
          duration: shouldReduceMotion ? 0.05 : 0.08, // Faster for smoother feel
          ease: [0.16, 1, 0.3, 1], // Optimized easing for 60fps+
        }}
      />
    </div>
  );
};

export default ScrollIndicator;
