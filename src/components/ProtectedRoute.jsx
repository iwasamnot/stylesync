import { Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const ProtectedRoute = ({ children, requireAuth = false, requireAdmin = false }) => {
  const { currentUser, userRole, loading } = useAuth();
  const { theme } = useTheme();
  const isFun = theme === 'fun';

  if (loading) {
    return (
      <div className="min-h-screen bg-transparent flex items-center justify-center">
        <motion.div
          className={`rounded-full h-12 w-12 border-2 ${
            isFun
              ? 'border-purple-500 border-t-transparent'
              : 'border-gray-900 dark:border-white border-t-transparent'
          }`}
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        />
      </div>
    );
  }

  // Require authentication
  if (requireAuth && !currentUser) {
    return <Navigate to="/login" replace />;
  }

  // Require admin role
  if (requireAdmin && userRole !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;

