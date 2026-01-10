import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { getThemeClasses } from '../utils/themeStyles';

class ErrorBoundaryClass extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <ErrorDisplay error={this.state.error} onReload={() => {
        this.setState({ hasError: false, error: null });
        window.location.reload();
      }} theme={this.props.theme} />;
    }

    return this.props.children;
  }
}

const ErrorDisplay = ({ error, onReload, theme }) => {
  const isFun = theme === 'fun';
  const themeClasses = getThemeClasses(theme, isFun);
  
  return (
    <div className="min-h-screen bg-transparent flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`${themeClasses.container} p-8 max-w-md w-full text-center`}
      >
        <svg
          className="mx-auto h-16 w-16 text-red-500 mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
        <h1 className="text-2xl font-light text-red-600 dark:text-red-400 mb-4 tracking-wide">Something went wrong</h1>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
          {error?.message || 'An unexpected error occurred'}
        </p>
        <motion.button
          onClick={onReload}
          className={themeClasses.button.primary}
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
        >
          Reload Page
        </motion.button>
      </motion.div>
    </div>
  );
};

const ErrorBoundary = ({ children }) => {
  const { theme } = useTheme();
  
  return (
    <ErrorBoundaryClass theme={theme}>
      {children}
    </ErrorBoundaryClass>
  );
};

export default ErrorBoundary;

