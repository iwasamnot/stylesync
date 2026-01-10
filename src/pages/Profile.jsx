import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';

const Profile = () => {
  const { currentUser, logout, userRole, loading } = useAuth();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isFun = theme === 'fun';

  useEffect(() => {
    if (!loading && !currentUser) {
      navigate('/login', { replace: true });
    }
  }, [currentUser, loading, navigate]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  if (loading || !currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-white"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-transparent py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`bg-white dark:bg-gray-900 border ${isFun ? 'border-purple-200 dark:border-purple-700 rounded-2xl shadow-lg' : 'border-gray-200 dark:border-gray-800 rounded-lg shadow-md'} p-8`}
        >
          <h1 className="text-3xl font-light text-gray-900 dark:text-white mb-6 tracking-wide">Profile</h1>
          
          <div className="space-y-6">
            <div>
              <label className="block text-xs uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-2">Display Name</label>
              <p className="text-lg font-light text-gray-900 dark:text-white">
                {currentUser.displayName || 'Not set'}
              </p>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-2">Email</label>
              <p className="text-lg font-light text-gray-900 dark:text-white">{currentUser.email}</p>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-2">User Role</label>
              <p className="mt-1">
                <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  userRole === 'admin' 
                    ? isFun
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                      : 'bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-200' 
                    : 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-200'
                }`}>
                  {userRole === 'admin' ? '👑 Admin' : '👤 User'}
                </span>
              </p>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-800">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Quick Actions</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Link
                  to="/orders"
                  className={`block p-4 border ${isFun ? 'border-purple-200 dark:border-purple-700 rounded-2xl hover:border-purple-400 dark:hover:border-purple-500 bg-gradient-to-br from-purple-50/50 to-pink-50/50 dark:from-purple-900/20 dark:to-pink-900/20' : 'border-gray-200 dark:border-gray-800 rounded-lg hover:border-gray-300 dark:hover:border-gray-700 bg-gray-50 dark:bg-gray-800'} transition-all text-center`}
                >
                  <svg className="w-8 h-8 mx-auto mb-2 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">Order History</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">View your orders</p>
                </Link>
                
                {userRole === 'admin' && (
                  <Link
                    to="/admin"
                    className={`block p-4 border ${isFun ? 'border-purple-200 dark:border-purple-700 rounded-2xl hover:border-purple-400 dark:hover:border-purple-500 bg-gradient-to-br from-purple-50/50 to-pink-50/50 dark:from-purple-900/20 dark:to-pink-900/20' : 'border-gray-200 dark:border-gray-800 rounded-lg hover:border-gray-300 dark:hover:border-gray-700 bg-gray-50 dark:bg-gray-800'} transition-all text-center`}
                  >
                    <svg className="w-8 h-8 mx-auto mb-2 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">Admin Dashboard</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Manage products & orders</p>
                  </Link>
                )}
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-800">
              <motion.button
                onClick={handleLogout}
                className={`w-full ${isFun ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-lg' : 'bg-red-600 text-white'} px-4 py-2 rounded-lg text-sm font-medium transition-all`}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                Sign Out
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;

