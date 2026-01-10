import { motion } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Link, useNavigate } from 'react-router-dom';
import { getThemeClasses } from '../utils/themeStyles';

const Cart = () => {
  const { cartItems, updateQuantity, removeFromCart, cartTotal, clearCart } = useCart();
  const { currentUser } = useAuth();
  const { theme } = useTheme();
  const isFun = theme === 'fun';
  const navigate = useNavigate();
  const themeClasses = getThemeClasses(theme, isFun);

  const handleCheckout = () => {
    if (!currentUser) {
      alert('Please login to checkout');
      navigate('/login');
      return;
    }
    navigate('/checkout');
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className={themeClasses.heading.h1}>Shopping Cart</h1>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`${themeClasses.emptyState} p-12 text-center`}
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
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            <h2 className="text-xl font-light text-gray-900 dark:text-white mb-2 tracking-wide">Your cart is empty</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Start shopping to add items to your cart</p>
            <motion.div whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.95 }}>
              <Link to="/" className={themeClasses.button.primary + ' inline-block'}>
                Continue Shopping
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className={themeClasses.heading.h1}>Shopping Cart</h1>
          <motion.button
            type="button"
            onClick={clearCart}
            className="text-xs uppercase tracking-widest font-light text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Clear Cart
          </motion.button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={themeClasses.container + ' overflow-hidden'}
            >
              <div className="divide-y divide-gray-200 dark:divide-gray-800">
                {cartItems.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="p-6 flex items-center gap-4 hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors"
                  >
                    <img
                      src={item.image || 'https://via.placeholder.com/100'}
                      alt={item.name}
                      className={`w-20 h-20 object-cover ${isFun ? 'rounded-xl' : 'rounded-lg'} flex-shrink-0`}
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base font-light text-gray-900 dark:text-white mb-1 tracking-wide truncate">{item.name}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">${item.price?.toFixed(2)} each</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <motion.button
                        type="button"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className={`w-8 h-8 rounded-full border ${
                          isFun
                            ? 'border-purple-200 dark:border-purple-700 text-gray-900 dark:text-white hover:bg-purple-50 dark:hover:bg-purple-900/20'
                            : 'border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800'
                        } flex items-center justify-center transition-all text-sm font-light`}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        -
                      </motion.button>
                      <span className="w-12 text-center text-sm font-medium text-gray-900 dark:text-white">{item.quantity}</span>
                      <motion.button
                        type="button"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className={`w-8 h-8 rounded-full border ${
                          isFun
                            ? 'border-purple-200 dark:border-purple-700 text-gray-900 dark:text-white hover:bg-purple-50 dark:hover:bg-purple-900/20'
                            : 'border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800'
                        } flex items-center justify-center transition-all text-sm font-light`}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        +
                      </motion.button>
                    </div>
                    <div className="text-right">
                      <p className={`text-base font-medium mb-2 ${themeClasses.priceText}`}>
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                      <motion.button
                        type="button"
                        onClick={() => removeFromCart(item.id)}
                        className="text-xs uppercase tracking-widest font-light text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Remove
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className={`${themeClasses.container} p-6 sticky top-24`}
            >
              <h2 className={themeClasses.heading.h3}>Order Summary</h2>
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300">
                  <span>Subtotal</span>
                  <span className="font-medium">${cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300">
                  <span>Shipping</span>
                  <span className={isFun ? 'text-green-500 font-medium' : 'text-green-600 font-medium'}>Free</span>
                </div>
                <div className={themeClasses.divider + ' pt-3 flex justify-between'}>
                  <span className="text-lg font-medium text-gray-900 dark:text-white">Total</span>
                  <span className={`text-lg font-medium ${themeClasses.priceText}`}>${cartTotal.toFixed(2)}</span>
                </div>
              </div>
              <motion.button
                type="button"
                onClick={handleCheckout}
                className={`w-full ${themeClasses.button.primary} mb-3`}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                {currentUser ? 'Proceed to Checkout' : 'Login to Checkout'}
              </motion.button>
              {!currentUser && (
                <Link
                  to="/login"
                  className="block text-center text-xs uppercase tracking-widest font-light text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  Create an account
                </Link>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;

