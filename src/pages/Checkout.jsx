import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useOrder } from '../context/OrderContext';
import { useToast } from '../context/ToastContext';
import { useTheme } from '../context/ThemeContext';
import ProtectedRoute from '../components/ProtectedRoute';
import Confetti from '../components/Confetti';

const Checkout = () => {
  const { cartItems, cartTotal, clearCart } = useCart();
  const { currentUser } = useAuth();
  const { createOrder } = useOrder();
  const { showToast } = useToast();
  const { theme } = useTheme();
  const navigate = useNavigate();
  const isFun = theme === 'fun';

  const [loading, setLoading] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [step, setStep] = useState(1); // 1: Shipping, 2: Payment, 3: Review

  const [shippingAddress, setShippingAddress] = useState({
    firstName: '',
    lastName: '',
    email: currentUser?.email || '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States',
  });

  const [paymentMethod, setPaymentMethod] = useState({
    type: 'card',
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',
  });

  const [billingSameAsShipping, setBillingSameAsShipping] = useState(true);

  useEffect(() => {
    if (cartItems.length === 0) {
      navigate('/cart');
    }
  }, [cartItems, navigate]);

  const subtotal = cartTotal;
  const shipping = 0; // Free shipping
  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + shipping + tax;

  const handleShippingSubmit = (e) => {
    e.preventDefault();
    setStep(2);
  };

  const handlePaymentSubmit = (e) => {
    e.preventDefault();
    setStep(3);
  };

  const handlePlaceOrder = async () => {
    if (!currentUser) {
      showToast('Please login to place an order', 'error');
      return;
    }

    setLoading(true);
    try {
      // Simulate payment processing
      // In production, you would integrate with Stripe here
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Generate mock payment intent ID
      const paymentIntentId = `pi_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      const orderData = {
        items: cartItems.map(item => ({
          id: item.id,
          name: item.name,
          image: item.image,
          price: item.price,
          quantity: item.quantity,
          selectedSize: item.selectedSize,
          selectedColor: item.selectedColor,
        })),
        shippingAddress,
        paymentMethod: {
          type: paymentMethod.type,
          last4: paymentMethod.cardNumber.slice(-4),
          brand: 'visa', // Mock
        },
        paymentIntentId,
        subtotal,
        shipping,
        tax,
        total,
      };

      const orderId = await createOrder(orderData);
      
      // Clear cart after successful order
      clearCart();
      
      // Show confetti
      setShowConfetti(true);
      
      // Redirect to order confirmation
      setTimeout(() => {
        navigate(`/order/${orderId}`);
      }, 1500);
    } catch (error) {
      console.error('Error placing order:', error);
      showToast('Failed to place order. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return null;
  }

  return (
    <ProtectedRoute requireAuth={true}>
      <div className="min-h-screen bg-transparent">
        <Confetti show={showConfetti} duration={3000} count={50} />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-light text-gray-900 dark:text-white mb-8 tracking-wide">Checkout</h1>

          {/* Progress Steps */}
          <div className="mb-8 flex items-center justify-center gap-4">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center">
                <motion.div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all ${
                    step >= s
                      ? isFun
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                        : 'bg-black dark:bg-white text-white dark:text-black'
                      : 'bg-gray-200 dark:bg-gray-800 text-gray-500 dark:text-gray-400'
                  }`}
                  initial={{ scale: 0.8 }}
                  animate={{ scale: step === s ? 1.1 : 1 }}
                  transition={{ duration: 0.3 }}
                >
                  {s}
                </motion.div>
                {s < 3 && (
                  <div className={`w-16 h-0.5 mx-2 ${step > s ? (isFun ? 'bg-gradient-to-r from-purple-500 to-pink-500' : 'bg-black dark:bg-white') : 'bg-gray-200 dark:bg-gray-800'}`} />
                )}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {step === 1 && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`bg-white dark:bg-gray-900 border ${isFun ? 'border-purple-200 dark:border-purple-700 rounded-2xl shadow-lg' : 'border-gray-200 dark:border-gray-800 rounded-lg shadow-md'} p-6`}
                >
                  <h2 className="text-xl font-light text-gray-900 dark:text-white mb-6 tracking-wide">Shipping Address</h2>
                  <form onSubmit={handleShippingSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-2">First Name *</label>
                        <input
                          type="text"
                          required
                          value={shippingAddress.firstName}
                          onChange={(e) => setShippingAddress({ ...shippingAddress, firstName: e.target.value })}
                          className={`w-full border ${isFun ? 'border-purple-200 dark:border-purple-700' : 'border-gray-300 dark:border-gray-700'} bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 ${isFun ? 'focus:ring-purple-500' : 'focus:ring-gray-900 dark:focus:ring-white'} transition-all`}
                        />
                      </div>
                      <div>
                        <label className="block text-xs uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-2">Last Name *</label>
                        <input
                          type="text"
                          required
                          value={shippingAddress.lastName}
                          onChange={(e) => setShippingAddress({ ...shippingAddress, lastName: e.target.value })}
                          className={`w-full border ${isFun ? 'border-purple-200 dark:border-purple-700' : 'border-gray-300 dark:border-gray-700'} bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 ${isFun ? 'focus:ring-purple-500' : 'focus:ring-gray-900 dark:focus:ring-white'} transition-all`}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-2">Email *</label>
                      <input
                        type="email"
                        required
                        value={shippingAddress.email}
                        onChange={(e) => setShippingAddress({ ...shippingAddress, email: e.target.value })}
                        className={`w-full border ${isFun ? 'border-purple-200 dark:border-purple-700' : 'border-gray-300 dark:border-gray-700'} bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 ${isFun ? 'focus:ring-purple-500' : 'focus:ring-gray-900 dark:focus:ring-white'} transition-all`}
                      />
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-2">Phone *</label>
                      <input
                        type="tel"
                        required
                        value={shippingAddress.phone}
                        onChange={(e) => setShippingAddress({ ...shippingAddress, phone: e.target.value })}
                        className={`w-full border ${isFun ? 'border-purple-200 dark:border-purple-700' : 'border-gray-300 dark:border-gray-700'} bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 ${isFun ? 'focus:ring-purple-500' : 'focus:ring-gray-900 dark:focus:ring-white'} transition-all`}
                      />
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-2">Address *</label>
                      <input
                        type="text"
                        required
                        value={shippingAddress.address}
                        onChange={(e) => setShippingAddress({ ...shippingAddress, address: e.target.value })}
                        className={`w-full border ${isFun ? 'border-purple-200 dark:border-purple-700' : 'border-gray-300 dark:border-gray-700'} bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 ${isFun ? 'focus:ring-purple-500' : 'focus:ring-gray-900 dark:focus:ring-white'} transition-all`}
                      />
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-2">City *</label>
                        <input
                          type="text"
                          required
                          value={shippingAddress.city}
                          onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                          className={`w-full border ${isFun ? 'border-purple-200 dark:border-purple-700' : 'border-gray-300 dark:border-gray-700'} bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 ${isFun ? 'focus:ring-purple-500' : 'focus:ring-gray-900 dark:focus:ring-white'} transition-all`}
                        />
                      </div>
                      <div>
                        <label className="block text-xs uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-2">State *</label>
                        <input
                          type="text"
                          required
                          value={shippingAddress.state}
                          onChange={(e) => setShippingAddress({ ...shippingAddress, state: e.target.value })}
                          className={`w-full border ${isFun ? 'border-purple-200 dark:border-purple-700' : 'border-gray-300 dark:border-gray-700'} bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 ${isFun ? 'focus:ring-purple-500' : 'focus:ring-gray-900 dark:focus:ring-white'} transition-all`}
                        />
                      </div>
                      <div>
                        <label className="block text-xs uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-2">Zip Code *</label>
                        <input
                          type="text"
                          required
                          value={shippingAddress.zipCode}
                          onChange={(e) => setShippingAddress({ ...shippingAddress, zipCode: e.target.value })}
                          className={`w-full border ${isFun ? 'border-purple-200 dark:border-purple-700' : 'border-gray-300 dark:border-gray-700'} bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 ${isFun ? 'focus:ring-purple-500' : 'focus:ring-gray-900 dark:focus:ring-white'} transition-all`}
                        />
                      </div>
                    </div>
                    <motion.button
                      type="submit"
                      className={`w-full mt-6 ${isFun ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg' : 'bg-black dark:bg-white text-white dark:text-black'} px-6 py-3 text-xs uppercase tracking-widest font-light rounded-lg transition-all`}
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Continue to Payment
                    </motion.button>
                  </form>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`bg-white dark:bg-gray-900 border ${isFun ? 'border-purple-200 dark:border-purple-700 rounded-2xl shadow-lg' : 'border-gray-200 dark:border-gray-800 rounded-lg shadow-md'} p-6`}
                >
                  <h2 className="text-xl font-light text-gray-900 dark:text-white mb-6 tracking-wide">Payment Method</h2>
                  <form onSubmit={handlePaymentSubmit} className="space-y-4">
                    <div>
                      <label className="block text-xs uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-2">Card Number *</label>
                      <input
                        type="text"
                        required
                        placeholder="1234 5678 9012 3456"
                        maxLength={19}
                        value={paymentMethod.cardNumber}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\s/g, '').replace(/\D/g, '');
                          const formatted = value.match(/.{1,4}/g)?.join(' ') || value;
                          setPaymentMethod({ ...paymentMethod, cardNumber: formatted });
                        }}
                        className={`w-full border ${isFun ? 'border-purple-200 dark:border-purple-700' : 'border-gray-300 dark:border-gray-700'} bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 ${isFun ? 'focus:ring-purple-500' : 'focus:ring-gray-900 dark:focus:ring-white'} transition-all`}
                      />
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-2">Cardholder Name *</label>
                      <input
                        type="text"
                        required
                        value={paymentMethod.cardName}
                        onChange={(e) => setPaymentMethod({ ...paymentMethod, cardName: e.target.value })}
                        className={`w-full border ${isFun ? 'border-purple-200 dark:border-purple-700' : 'border-gray-300 dark:border-gray-700'} bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 ${isFun ? 'focus:ring-purple-500' : 'focus:ring-gray-900 dark:focus:ring-white'} transition-all`}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-2">Expiry Date *</label>
                        <input
                          type="text"
                          required
                          placeholder="MM/YY"
                          maxLength={5}
                          value={paymentMethod.expiryDate}
                          onChange={(e) => {
                            let value = e.target.value.replace(/\D/g, '');
                            if (value.length >= 2) {
                              value = value.slice(0, 2) + '/' + value.slice(2, 4);
                            }
                            setPaymentMethod({ ...paymentMethod, expiryDate: value });
                          }}
                          className={`w-full border ${isFun ? 'border-purple-200 dark:border-purple-700' : 'border-gray-300 dark:border-gray-700'} bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 ${isFun ? 'focus:ring-purple-500' : 'focus:ring-gray-900 dark:focus:ring-white'} transition-all`}
                        />
                      </div>
                      <div>
                        <label className="block text-xs uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-2">CVV *</label>
                        <input
                          type="text"
                          required
                          placeholder="123"
                          maxLength={4}
                          value={paymentMethod.cvv}
                          onChange={(e) => setPaymentMethod({ ...paymentMethod, cvv: e.target.value.replace(/\D/g, '') })}
                          className={`w-full border ${isFun ? 'border-purple-200 dark:border-purple-700' : 'border-gray-300 dark:border-gray-700'} bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 ${isFun ? 'focus:ring-purple-500' : 'focus:ring-gray-900 dark:focus:ring-white'} transition-all`}
                        />
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <motion.button
                        type="button"
                        onClick={() => setStep(1)}
                        className={`flex-1 border ${isFun ? 'border-purple-200 dark:border-purple-700' : 'border-gray-300 dark:border-gray-700'} text-gray-900 dark:text-white px-6 py-3 text-xs uppercase tracking-widest font-light rounded-lg transition-all`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        Back
                      </motion.button>
                      <motion.button
                        type="submit"
                        className={`flex-1 ${isFun ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg' : 'bg-black dark:bg-white text-white dark:text-black'} px-6 py-3 text-xs uppercase tracking-widest font-light rounded-lg transition-all`}
                        whileHover={{ scale: 1.02, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        Review Order
                      </motion.button>
                    </div>
                  </form>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`bg-white dark:bg-gray-900 border ${isFun ? 'border-purple-200 dark:border-purple-700 rounded-2xl shadow-lg' : 'border-gray-200 dark:border-gray-800 rounded-lg shadow-md'} p-6 space-y-6`}
                >
                  <h2 className="text-xl font-light text-gray-900 dark:text-white mb-6 tracking-wide">Order Review</h2>
                  
                  {/* Shipping Address */}
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2 uppercase tracking-widest">Shipping Address</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {shippingAddress.firstName} {shippingAddress.lastName}<br />
                      {shippingAddress.address}<br />
                      {shippingAddress.city}, {shippingAddress.state} {shippingAddress.zipCode}<br />
                      {shippingAddress.country}
                    </p>
                  </div>

                  {/* Payment Method */}
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2 uppercase tracking-widest">Payment Method</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Card ending in {paymentMethod.cardNumber.slice(-4)}<br />
                      {paymentMethod.cardName}<br />
                      Expires: {paymentMethod.expiryDate}
                    </p>
                  </div>

                  {/* Order Items */}
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-4 uppercase tracking-widest">Order Items</h3>
                    <div className="space-y-3">
                      {cartItems.map((item) => (
                        <div key={item.id} className="flex items-center gap-4 pb-3 border-b border-gray-200 dark:border-gray-800">
                          <img
                            src={item.image || 'https://via.placeholder.com/80'}
                            alt={item.name}
                            className="w-16 h-16 object-cover rounded"
                          />
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900 dark:text-white">{item.name}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              Quantity: {item.quantity} × ${item.price?.toFixed(2)}
                            </p>
                          </div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            ${(item.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-4 pt-4">
                    <motion.button
                      type="button"
                      onClick={() => setStep(2)}
                      className={`flex-1 border ${isFun ? 'border-purple-200 dark:border-purple-700' : 'border-gray-300 dark:border-gray-700'} text-gray-900 dark:text-white px-6 py-3 text-xs uppercase tracking-widest font-light rounded-lg transition-all`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Back
                    </motion.button>
                    <motion.button
                      onClick={handlePlaceOrder}
                      disabled={loading}
                      className={`flex-1 ${isFun ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg' : 'bg-black dark:bg-white text-white dark:text-black'} px-6 py-3 text-xs uppercase tracking-widest font-light rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed`}
                      whileHover={{ scale: loading ? 1 : 1.02, y: loading ? 0 : -2 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {loading ? 'Processing...' : 'Place Order'}
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Order Summary Sidebar */}
            <div className="lg:col-span-1">
              <div className={`bg-white dark:bg-gray-900 border ${isFun ? 'border-purple-200 dark:border-purple-700 rounded-2xl shadow-lg' : 'border-gray-200 dark:border-gray-800 rounded-lg shadow-md'} p-6 sticky top-24`}>
                <h2 className="text-xl font-light text-gray-900 dark:text-white mb-6 tracking-wide">Order Summary</h2>
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300">
                    <span>Shipping</span>
                    <span className={isFun ? 'text-green-500' : 'text-green-600'}>Free</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300">
                    <span>Tax</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  <div className="border-t border-gray-200 dark:border-gray-800 pt-3 flex justify-between text-lg font-semibold text-gray-900 dark:text-white">
                    <span>Total</span>
                    <span className={isFun ? 'bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent' : ''}>${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default Checkout;
