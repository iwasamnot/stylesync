import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useOrder } from '../context/OrderContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useTheme } from '../context/ThemeContext';
import ProtectedRoute from '../components/ProtectedRoute';
import Confetti from '../components/Confetti';

const OrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getOrder, cancelOrder, updateOrderStatus } = useOrder();
  const { currentUser, isAdmin } = useAuth();
  const { showToast } = useToast();
  const { theme } = useTheme();
  const isFun = theme === 'fun';

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    loadOrder();
  }, [id]);

  const loadOrder = async () => {
    try {
      const orderData = await getOrder(id);
      if (!orderData) {
        navigate('/orders');
        return;
      }
      setOrder(orderData);
      
      // Show confetti if order was just placed (pending status)
      if (orderData.status === 'pending') {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 3000);
      }
    } catch (error) {
      console.error('Error loading order:', error);
      showToast('Failed to load order details', 'error');
      navigate('/orders');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async () => {
    if (!window.confirm('Are you sure you want to cancel this order?')) {
      return;
    }

    setCancelling(true);
    try {
      await cancelOrder(id);
      showToast('Order cancelled successfully', 'success');
      loadOrder();
    } catch (error) {
      console.error('Error cancelling order:', error);
      showToast(error.message || 'Failed to cancel order', 'error');
    } finally {
      setCancelling(false);
    }
  };

  const handleStatusUpdate = async (newStatus) => {
    try {
      await updateOrderStatus(id, newStatus);
      showToast(`Order status updated to ${newStatus}`, 'success');
      loadOrder();
    } catch (error) {
      console.error('Error updating order status:', error);
      showToast('Failed to update order status', 'error');
    }
  };

  const formatDate = (date) => {
    if (!date) return 'N/A';
    const d = date instanceof Date ? date : date.toDate?.() || new Date(date);
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'processing':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'shipped':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-transparent flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-white"></div>
      </div>
    );
  }

  if (!order) {
    return null;
  }

  const canCancel = order.status === 'pending' || order.status === 'processing';

  return (
    <ProtectedRoute requireAuth={true}>
      <div className="min-h-screen bg-transparent">
        <Confetti show={showConfetti} duration={3000} count={50} />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-light text-gray-900 dark:text-white mb-2 tracking-wide">
                Order Details
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Order #{order.id.slice(-8).toUpperCase()}
              </p>
            </div>
            <Link
              to="/orders"
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                isFun
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:shadow-lg'
                  : 'bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-100'
              }`}
            >
              Back to Orders
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Order Status */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`bg-white dark:bg-gray-900 border ${isFun ? 'border-purple-200 dark:border-purple-700 rounded-2xl shadow-lg' : 'border-gray-200 dark:border-gray-800 rounded-lg shadow-md'} p-6`}
              >
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-light text-gray-900 dark:text-white tracking-wide">Order Status</h2>
                  <span className={`inline-block px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                </div>
                <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <p><span className="font-medium">Placed on:</span> {formatDate(order.createdAt)}</p>
                  <p><span className="font-medium">Last updated:</span> {formatDate(order.updatedAt)}</p>
                </div>
                
                {isAdmin && canCancel && (
                  <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-800">
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3 uppercase tracking-widest">Update Status</h3>
                    <div className="flex gap-2 flex-wrap">
                      {['processing', 'shipped', 'completed'].map((status) => (
                        <motion.button
                          key={status}
                          onClick={() => handleStatusUpdate(status)}
                          disabled={order.status === status}
                          className={`px-3 py-1.5 rounded-lg text-xs uppercase tracking-widest font-light transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                            order.status === status
                              ? isFun
                                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                                : 'bg-black dark:bg-white text-white dark:text-black'
                              : 'border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800'
                          }`}
                          whileHover={{ scale: order.status === status ? 1 : 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          {status.charAt(0).toUpperCase() + status.slice(1)}
                        </motion.button>
                      ))}
                    </div>
                  </div>
                )}

                {canCancel && !isAdmin && (
                  <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-800">
                    <motion.button
                      onClick={handleCancelOrder}
                      disabled={cancelling}
                      className="w-full px-4 py-2 border border-red-300 dark:border-red-700 text-red-600 dark:text-red-400 rounded-lg text-sm font-medium transition-all hover:bg-red-50 dark:hover:bg-red-900/20 disabled:opacity-50 disabled:cursor-not-allowed"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {cancelling ? 'Cancelling...' : 'Cancel Order'}
                    </motion.button>
                  </div>
                )}
              </motion.div>

              {/* Order Items */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className={`bg-white dark:bg-gray-900 border ${isFun ? 'border-purple-200 dark:border-purple-700 rounded-2xl shadow-lg' : 'border-gray-200 dark:border-gray-800 rounded-lg shadow-md'} p-6`}
              >
                <h2 className="text-xl font-light text-gray-900 dark:text-white mb-6 tracking-wide">Order Items</h2>
                <div className="space-y-4">
                  {order.items?.map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex items-center gap-4 pb-4 border-b border-gray-200 dark:border-gray-800 last:border-0"
                    >
                      <Link to={`/product/${item.id}`}>
                        <img
                          src={item.image || 'https://via.placeholder.com/100'}
                          alt={item.name}
                          className="w-20 h-20 object-cover rounded-lg cursor-pointer hover:scale-105 transition-transform"
                        />
                      </Link>
                      <div className="flex-1">
                        <Link to={`/product/${item.id}`}>
                          <h3 className="text-base font-medium text-gray-900 dark:text-white hover:underline">
                            {item.name}
                          </h3>
                        </Link>
                        <div className="mt-1 space-y-1 text-sm text-gray-500 dark:text-gray-400">
                          <p>Quantity: {item.quantity}</p>
                          {item.selectedSize && <p>Size: {item.selectedSize}</p>}
                          {item.selectedColor && <p>Color: {item.selectedColor}</p>}
                          <p>Price: ${item.price?.toFixed(2)} each</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-semibold text-gray-900 dark:text-white">
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Shipping Address */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className={`bg-white dark:bg-gray-900 border ${isFun ? 'border-purple-200 dark:border-purple-700 rounded-2xl shadow-lg' : 'border-gray-200 dark:border-gray-800 rounded-lg shadow-md'} p-6`}
              >
                <h2 className="text-xl font-light text-gray-900 dark:text-white mb-4 tracking-wide">Shipping Address</h2>
                <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                  <p className="font-medium text-gray-900 dark:text-white">
                    {order.shippingAddress?.firstName} {order.shippingAddress?.lastName}
                  </p>
                  <p>{order.shippingAddress?.address}</p>
                  <p>
                    {order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.zipCode}
                  </p>
                  <p>{order.shippingAddress?.country}</p>
                  {order.shippingAddress?.phone && <p>Phone: {order.shippingAddress.phone}</p>}
                  {order.shippingAddress?.email && <p>Email: {order.shippingAddress.email}</p>}
                </div>
              </motion.div>
            </div>

            {/* Order Summary Sidebar */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className={`bg-white dark:bg-gray-900 border ${isFun ? 'border-purple-200 dark:border-purple-700 rounded-2xl shadow-lg' : 'border-gray-200 dark:border-gray-800 rounded-lg shadow-md'} p-6 sticky top-24`}
              >
                <h2 className="text-xl font-light text-gray-900 dark:text-white mb-6 tracking-wide">Order Summary</h2>
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300">
                    <span>Subtotal</span>
                    <span>${order.subtotal?.toFixed(2) || '0.00'}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300">
                    <span>Shipping</span>
                    <span className={order.shipping === 0 ? (isFun ? 'text-green-500' : 'text-green-600') : ''}>
                      {order.shipping === 0 ? 'Free' : `$${order.shipping?.toFixed(2)}`}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300">
                    <span>Tax</span>
                    <span>${order.tax?.toFixed(2) || '0.00'}</span>
                  </div>
                  <div className="border-t border-gray-200 dark:border-gray-800 pt-3 flex justify-between text-lg font-semibold text-gray-900 dark:text-white">
                    <span>Total</span>
                    <span className={isFun ? 'bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent' : ''}>
                      ${order.total?.toFixed(2) || '0.00'}
                    </span>
                  </div>
                </div>

                <div className="pt-6 border-t border-gray-200 dark:border-gray-800">
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2 uppercase tracking-widest">Payment Method</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {order.paymentMethod?.type === 'card' ? 'Credit Card' : order.paymentMethod?.type} ending in {order.paymentMethod?.last4 || '****'}
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default OrderDetails;
