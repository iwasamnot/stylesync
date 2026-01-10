import { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { ToastProvider, useToast } from './context/ToastContext';
import { ThemeProvider } from './context/ThemeContext';
import { RecentlyViewedProvider } from './context/RecentlyViewedContext';
import { UserProfileProvider } from './context/UserProfileContext';
import { OrderProvider } from './context/OrderContext';
import ErrorBoundary from './components/ErrorBoundary';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import ToastContainer from './components/ToastContainer';
import OfflineBanner from './components/OfflineBanner';
import ScrollIndicator from './components/ScrollIndicator';

const Home = lazy(() => import('./pages/Home'));
const Login = lazy(() => import('./pages/Login'));
const ProductDetails = lazy(() => import('./pages/ProductDetails'));
const Cart = lazy(() => import('./pages/Cart'));
const Checkout = lazy(() => import('./pages/Checkout'));
const Profile = lazy(() => import('./pages/Profile'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const Wishlist = lazy(() => import('./pages/Wishlist'));
const OrderHistory = lazy(() => import('./pages/OrderHistory'));
const OrderDetails = lazy(() => import('./pages/OrderDetails'));

// Optimize AppContent with React.memo for better performance
function AppContent() {
  const { toasts, removeToast } = useToast();
  const location = useLocation();

  return (
    <div className="min-h-screen bg-transparent">
      <ScrollIndicator />
      <Navbar />
      <ToastContainer toasts={toasts} removeToast={removeToast} />
      <OfflineBanner />
      <Suspense
        fallback={
          <div className="min-h-[60vh] flex items-center justify-center">
            <motion.div
              className="rounded-full h-10 w-10 border-2 border-gray-900 dark:border-white"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              style={{ 
                borderTopColor: 'transparent',
                // GPU acceleration for smooth 60fps+ loading
                willChange: 'transform',
                transform: 'translateZ(0)',
                backfaceVisibility: 'hidden',
              }}
            />
          </div>
        }
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ 
              duration: 0.3, // Faster transition for smoother feel
              ease: [0.16, 1, 0.3, 1], // Optimized easing for 60fps+
              type: 'tween', // Use tween for better performance
            }}
            className="page-transition"
            style={{
              // GPU acceleration for smooth page transitions
              willChange: 'transform, opacity',
              transform: 'translateZ(0)',
              backfaceVisibility: 'hidden',
            }}
          >
            <Routes location={location}>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/product/:id" element={<ProductDetails />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/wishlist" element={<Wishlist />} />
              
              {/* Protected Routes - Require Authentication */}
              <Route
                path="/checkout"
                element={
                  <ProtectedRoute requireAuth={true}>
                    <Checkout />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/orders"
                element={
                  <ProtectedRoute requireAuth={true}>
                    <OrderHistory />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/order/:id"
                element={
                  <ProtectedRoute requireAuth={true}>
                    <OrderDetails />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute requireAuth={true}>
                    <Profile />
                  </ProtectedRoute>
                }
              />
              
              {/* Admin Routes - Require Admin Role */}
              <Route
                path="/admin"
                element={
                  <ProtectedRoute requireAuth={true} requireAdmin={true}>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </motion.div>
        </AnimatePresence>
      </Suspense>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AuthProvider>
          <UserProfileProvider>
            <CartProvider>
              <OrderProvider>
                <WishlistProvider>
                  <RecentlyViewedProvider>
                    <ToastProvider>
                      <Router>
                        <AppContent />
                      </Router>
                    </ToastProvider>
                  </RecentlyViewedProvider>
                </WishlistProvider>
              </OrderProvider>
            </CartProvider>
          </UserProfileProvider>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;

