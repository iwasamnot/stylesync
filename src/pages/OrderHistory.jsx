import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useOrder } from '../context/OrderContext';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import ProtectedRoute from '../components/ProtectedRoute';

const OrderHistory = () => {
  const { orders, loading } = useOrder();
  const { currentUser } = useAuth();
  const { theme } = useTheme();
  const isFun = theme === 'fun';

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return isFun ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'processing':
        return isFun ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'shipped':
        return isFun ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' : 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'completed':
        return isFun ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const formatDate = (date) => {
    if (!date) return 'N/A';
    const d = date instanceof Date ? date : date.toDate();
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-transparent flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-white"></div>
      </div>
    );
  }

  return (
    <ProtectedRoute requireAuth={true}>
      <div className="min-h-screen bg-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-light text-gray-900 dark:text-white mb-8 tracking-wide">Order History</h1>

          {orders.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`bg-white dark:bg-gray-900 border ${isFun ? 'border-purple-200 dark:border-purple-700 rounded-2xl shadow-lg' : 'border-gray-200 dark:border-gray-800 rounded-lg shadow-md'} p-12 text-center`}
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
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No orders yet</h2>
              <p className="text-gray-500 dark:text-gray-400 mb-6">Start shopping to see your orders here</p>
              <Link
                to="/"
                className={`inline-block ${isFun ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white' : 'bg-black dark:bg-white text-white dark:text-black'} px-6 py-3 rounded-lg text-sm font-medium transition-all hover:scale-105`}
              >
                Start Shopping
              </Link>
            </motion.div>
          ) : (
            <div className="space-y-4">
              {orders.map((order, index) => (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`bg-white dark:bg-gray-900 border ${isFun ? 'border-purple-200 dark:border-purple-700 rounded-2xl shadow-lg' : 'border-gray-200 dark:border-gray-800 rounded-lg shadow-md'} overflow-hidden`}
                >
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                          Order #{order.id.slice(-8).toUpperCase()}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Placed on {formatDate(order.createdAt)}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                        <p className="mt-2 text-lg font-semibold text-gray-900 dark:text-white">
                          ${order.total?.toFixed(2) || '0.00'}
                        </p>
                      </div>
                    </div>

                    <div className="border-t border-gray-200 dark:border-gray-800 pt-4 mt-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        {order.items?.slice(0, 4).map((item, idx) => (
                          <div key={idx} className="flex items-center gap-3">
                            <img
                              src={item.image || 'https://via.placeholder.com/60'}
                              alt={item.name}
                              className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                            />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                {item.name}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                Qty: {item.quantity} × ${item.price?.toFixed(2)}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                      {order.items?.length > 4 && (
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                          +{order.items.length - 4} more item(s)
                        </p>
                      )}

                      <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-800 flex-wrap gap-4">
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          <span className="font-medium">Shipping to:</span> {order.shippingAddress?.city || 'N/A'}, {order.shippingAddress?.state || 'N/A'}
                        </div>
                        <motion.div
                          whileHover={{ scale: 1.05, y: -2 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Link
                            to={`/order/${order.id}`}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                              isFun
                                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:shadow-lg'
                                : 'bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-100'
                            }`}
                          >
                            View Details
                          </Link>
                        </motion.div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default OrderHistory;
