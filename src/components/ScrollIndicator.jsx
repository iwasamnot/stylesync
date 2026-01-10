import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

const ScrollIndicator = () => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const { theme } = useTheme();
  const isFun = theme === 'fun';

  useEffect(() => {
    const updateScrollProgress = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrolled = window.scrollY;
      const progress = (scrolled / scrollHeight) * 100;
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', updateScrollProgress);
    updateScrollProgress();

    return () => window.removeEventListener('scroll', updateScrollProgress);
  }, []);

  return (
    <div className="fixed top-0 left-0 w-full h-1 bg-gray-200 dark:bg-gray-800 z-[9999]">
      <motion.div
        className={`h-full ${
          isFun
            ? 'bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500'
            : 'bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500'
        }`}
        style={{ width: `${scrollProgress}%` }}
        initial={{ width: 0 }}
        animate={{ width: `${scrollProgress}%` }}
        transition={{ duration: 0.1, ease: 'easeOut' }}
      />
    </div>
  );
};

export default ScrollIndicator;
