/**
 * Consistent theme styles utility
 * Provides standardized styling classes based on theme
 */

export const getThemeClasses = (theme, isFun = false) => {
  return {
    // Container styles
    container: `bg-white dark:bg-gray-900 border ${
      isFun
        ? 'border-purple-200 dark:border-purple-700 rounded-2xl shadow-lg'
        : 'border-gray-200 dark:border-gray-800 rounded-lg shadow-md'
    }`,
    
    containerSubtle: `bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm border ${
      isFun
        ? 'border-purple-200/50 dark:border-purple-700/50 rounded-2xl'
        : 'border-gray-200/50 dark:border-gray-800/50 rounded-lg'
    }`,
    
    // Button styles
    button: {
      primary: `px-6 py-3 text-xs uppercase tracking-widest font-light rounded-lg transition-all ${
        isFun
          ? 'bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500 text-white shadow-lg hover:shadow-xl'
          : 'bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-100'
      }`,
      
      secondary: `px-6 py-3 text-xs uppercase tracking-widest font-light rounded-lg transition-all border ${
        isFun
          ? 'border-purple-200 dark:border-purple-700 text-gray-900 dark:text-white hover:bg-purple-50 dark:hover:bg-purple-900/20'
          : 'border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800'
      }`,
      
      danger: `px-6 py-3 text-xs uppercase tracking-widest font-light rounded-lg transition-all border border-red-300 dark:border-red-700 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20`,
      
      success: `px-6 py-3 text-xs uppercase tracking-widest font-light rounded-lg transition-all ${
        isFun
          ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg hover:shadow-xl'
          : 'bg-green-600 text-white hover:bg-green-700'
      }`,
      
      ghost: `px-4 py-2 text-xs uppercase tracking-widest font-light rounded-lg transition-all text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white`,
    },
    
    // Input styles
    input: `w-full border ${
      isFun
        ? 'border-purple-200 dark:border-purple-700 bg-white/80 dark:bg-gray-800/80'
        : 'border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800'
    } text-gray-900 dark:text-white px-4 py-2.5 text-sm rounded-lg focus:outline-none focus:ring-2 ${
      isFun
        ? 'focus:ring-purple-500 focus:border-purple-400 dark:focus:border-purple-500'
        : 'focus:ring-gray-900 dark:focus:ring-white focus:border-gray-900 dark:focus:border-white'
    } transition-all`,
    
    inputFilled: `w-full border ${
      isFun
        ? 'border-purple-400 dark:border-purple-500 bg-purple-50/50 dark:bg-purple-900/30'
        : 'border-gray-900 dark:border-white bg-gray-100 dark:bg-gray-800'
    } text-gray-900 dark:text-white px-4 py-2.5 text-sm rounded-lg focus:outline-none focus:ring-2 ${
      isFun
        ? 'focus:ring-purple-500'
        : 'focus:ring-gray-900 dark:focus:ring-white'
    } transition-all`,
    
    // Label styles
    label: `block text-xs uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-2 font-light`,
    
    // Heading styles
    heading: {
      h1: `text-3xl font-light text-gray-900 dark:text-white mb-8 tracking-wide`,
      h2: `text-2xl font-light text-gray-900 dark:text-white mb-6 tracking-wide`,
      h3: `text-xl font-light text-gray-900 dark:text-white mb-4 tracking-wide`,
      h4: `text-lg font-light text-gray-900 dark:text-white mb-3 tracking-wide`,
      section: `text-sm font-medium text-gray-900 dark:text-white mb-4 uppercase tracking-widest`,
    },
    
    // Text styles
    text: {
      body: `text-sm text-gray-600 dark:text-gray-400`,
      bodyLight: `text-sm text-gray-500 dark:text-gray-400`,
      muted: `text-xs text-gray-500 dark:text-gray-400`,
      primary: `text-sm font-medium text-gray-900 dark:text-white`,
      secondary: `text-sm text-gray-600 dark:text-gray-400`,
    },
    
    // Badge styles
    badge: {
      default: `inline-block px-3 py-1 rounded-full text-xs font-medium`,
      success: `inline-block px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200`,
      warning: `inline-block px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200`,
      info: `inline-block px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200`,
      danger: `inline-block px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200`,
      purple: `inline-block px-3 py-1 rounded-full text-xs font-medium ${
        isFun
          ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
          : 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
      }`,
    },
    
    // Card styles
    card: `bg-white dark:bg-gray-900 overflow-hidden ${
      isFun
        ? 'rounded-2xl border border-purple-200/60 dark:border-purple-700/60 shadow-lg'
        : 'rounded-lg border border-gray-200 dark:border-gray-800 shadow-md'
    } transition-all`,
    
    cardHover: `bg-white dark:bg-gray-900 overflow-hidden ${
      isFun
        ? 'rounded-2xl border border-purple-200/60 dark:border-purple-700/60 shadow-lg hover:shadow-xl hover:border-purple-400 dark:hover:border-purple-500'
        : 'rounded-lg border border-gray-200 dark:border-gray-800 shadow-md hover:shadow-lg hover:border-gray-300 dark:hover:border-gray-700'
    } transition-all`,
    
    // Divider styles
    divider: `border-t border-gray-200 dark:border-gray-800`,
    
    // Empty state styles
    emptyState: `bg-white dark:bg-gray-900 border ${
      isFun
        ? 'border-purple-200 dark:border-purple-700 rounded-2xl shadow-lg'
        : 'border-gray-200 dark:border-gray-800 rounded-lg shadow-md'
    } p-12 text-center`,
    
    // Status colors
    status: {
      pending: `bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200`,
      processing: `bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200`,
      shipped: `bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200`,
      completed: `bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200`,
      cancelled: `bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200`,
    },
    
    // Gradient text
    gradientText: isFun
      ? 'bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 bg-clip-text text-transparent'
      : 'text-gray-900 dark:text-white',
    
    // Price text
    priceText: isFun
      ? 'bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent font-medium'
      : 'text-gray-900 dark:text-white font-medium',
  };
};

// Standardized button component props
export const buttonVariants = {
  primary: 'primary',
  secondary: 'secondary',
  danger: 'danger',
  success: 'success',
  ghost: 'ghost',
};

// Standardized spacing
export const spacing = {
  xs: '0.5rem', // 2
  sm: '0.75rem', // 3
  md: '1rem', // 4
  lg: '1.5rem', // 6
  xl: '2rem', // 8
  '2xl': '3rem', // 12
  '3xl': '4rem', // 16
};

// Standardized border radius
export const borderRadius = {
  sm: 'rounded-lg',
  md: 'rounded-xl',
  lg: 'rounded-2xl',
  full: 'rounded-full',
};
