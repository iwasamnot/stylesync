import { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { ToastProvider, useToast } from './context/ToastContext';
import { ThemeProvider } from './context/ThemeContext';
import { RecentlyViewedProvider } from './context/RecentlyViewedContext';
import { UserProfileProvider } from './context/UserProfileContext';
import ErrorBoundary from './components/ErrorBoundary';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import ToastContainer from './components/ToastContainer';
import OfflineBanner from './components/OfflineBanner';

const Home = lazy(() => import('./pages/Home'));
const Login = lazy(() => import('./pages/Login'));
const ProductDetails = lazy(() => import('./pages/ProductDetails'));
const Cart = lazy(() => import('./pages/Cart'));
const Profile = lazy(() => import('./pages/Profile'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const Wishlist = lazy(() => import('./pages/Wishlist'));

function RouteTransition({ children }) {
  const location = useLocation();
  return (
    <div key={location.key} className="animate-fade-in">
      {children}
    </div>
  );
}

function AppContent() {
  const { toasts, removeToast } = useToast();

  return (
    <Router>
      <div className="min-h-screen bg-transparent">
        <Navbar />
        <ToastContainer toasts={toasts} removeToast={removeToast} />
        <OfflineBanner />
        <Suspense
          fallback={
            <div className="min-h-[60vh] flex items-center justify-center">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900 dark:border-white" />
            </div>
          }
        >
          <RouteTransition>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/product/:id" element={<ProductDetails />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/wishlist" element={<Wishlist />} />
              
              {/* Protected Routes - Require Authentication */}
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
          </RouteTransition>
        </Suspense>
        <Footer />
      </div>
    </Router>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AuthProvider>
          <UserProfileProvider>
            <CartProvider>
              <WishlistProvider>
                <RecentlyViewedProvider>
                  <ToastProvider>
                    <AppContent />
                  </ToastProvider>
                </RecentlyViewedProvider>
              </WishlistProvider>
            </CartProvider>
          </UserProfileProvider>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;

