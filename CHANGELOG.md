# Changelog

All notable changes to the StyleSync project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added - 2026-01-06
- Theme system: **Light / Dark / Fun** with navbar switcher and persistence
- Fun theme visuals: animated gradient background + fun hero styling
- Fun theme polish: fun-mode banner, promo strip, rounder cards, and animated promo gradients
- Sale promotions: homepage sale banner + one-time-per-session sale popup
- Branding: custom logo + favicon
- Global search modal (Ctrl/⌘K or `/`) with product autocomplete
- Route code-splitting (faster initial load) + simple page transition animation
- PWA support (install prompt + offline banner + auto-updating service worker)

### Fixed - 2026-01-06
- Dark mode inconsistencies and initial theme flash (theme applied before first paint)
- URL navigation for category/tab links (URL params now sync properly with Home state)
- Removed placeholder contact/shipping/returns links and fake footer details
- Button behavior across the app (added explicit `type="button"` where needed)
- Product reviews: Firestore rules now allow reading/writing reviews; timestamp sorting fixed

### Added - 2025-01-27
- Initial project scaffold with React + Vite setup
- Tailwind CSS configuration and PostCSS setup
- Firebase v9 integration with Firestore, Authentication, and Analytics
- React Router DOM setup with routes for Home, Login, ProductDetails, and Cart pages
- Responsive Navbar component with cart icon and item count badge
- ProductCard component placeholder
- AuthContext and CartContext with boilerplate code
- Firebase configuration file with project credentials (stylesync-sistc)
- Project folder structure (components, pages, context, lib)
- README.md with comprehensive project documentation
- CHANGELOG.md for tracking all features and changes
- .gitignore file for Node.js projects
- Git repository initialization and GitHub integration
- Automatic commit workflow setup
- Firebase Hosting configuration (firebase.json, .firebaserc)
- Firebase CLI tools integration
- Deployment script (npm run deploy)
- Production build successfully created
- GitHub Actions workflow for automatic deployment to Firebase Hosting
- CI/CD pipeline that builds and deploys on push to main branch

### Added - 2025-01-27 (Role-Based Access Control)
- Complete authentication system with Firebase Auth (signup, login, logout)
- User role management system (admin, user, guest) with Firestore integration
- ProtectedRoute component for route guards and access control
- AdminDashboard page with full CRUD operations for products
- Product management (create, read, update, delete) for admins
- Enhanced Login page with signup/login forms and error handling
- Profile page for authenticated users with role display
- Role-based navigation in Navbar (different links for admin/user/guest)
- Full shopping cart functionality with add, remove, update quantity
- Cart persistence using localStorage
- Product listing from Firestore database
- Product details page with full product information
- Cart page with order summary and checkout button
- Guest user functionality (browse products, limited cart access)
- Normal user functionality (full cart, profile management)
- Admin functionality (product management, user role viewing)
- Protected routes for authenticated users and admin-only pages

### Fixed - 2025-01-27
- GitHub Actions workflow: Updated Node.js version from 18 to 20 for Firebase CLI v15+ compatibility
- Infinite refresh loop: Memoized AuthContext and CartContext values to prevent unnecessary re-renders
- Firebase Analytics: Added browser check to prevent initialization errors in non-browser environments
- Profile page navigation: Fixed potential navigation loop by checking loading state

### Added - 2025-01-27 (Security & Admin Setup)
- Firestore security rules (firestore.rules) with role-based access control
- Comprehensive admin setup guide (ADMIN_SETUP.md)
- Quick admin setup guide (QUICK_ADMIN_GUIDE.md)
- Security rules for users, products, orders, and carts collections
- Firebase configuration updated to include Firestore rules deployment

### Added - 2025-01-27 (E-commerce Features)
- Sample apparel products dataset (18 products: T-Shirts, Jeans, Hoodies, Jackets, Shoes, Accessories)
- Advanced product filtering system:
  - Category filter (T-Shirts, Jeans, Hoodies, Jackets, Shoes, Accessories)
  - Price range filter ($0-50, $50-100, $100-200, $200+)
  - Size filter (S, M, L, XL, XXL, numeric sizes, One Size)
- Product sorting functionality:
  - Sort by newest first
  - Sort by price (low to high, high to low)
  - Sort by name (A to Z, Z to A)
- Search functionality (search by product name, description, category, brand)
- Enhanced ProductCard component with stock status and category display
- ProductFilters component with responsive mobile/desktop layout
- ProductSort component with product count display
- SearchBar component with icon
- Admin Dashboard: "Add Sample Products" button for quick product seeding
- Admin Dashboard: Enhanced product form with sizes, colors, and brand fields
- Responsive filter sidebar with mobile toggle
- Real-time product count display based on active filters

### Added - 2025-01-27 (Major Features & Modern UI)
- **Discount Percentage Display**: Shows discount percentage (e.g., "-25% OFF") on sale items
- **Wishlist/Favorites System**: 
  - Add/remove products to wishlist
  - Wishlist page with all saved items
  - Wishlist button on product cards and details page
  - Wishlist count badge in navbar
  - localStorage persistence
- **Toast Notifications**: 
  - Success, error, info, and warning toasts
  - Auto-dismiss with customizable duration
  - Smooth slide-in animations
- **Loading Skeletons**: 
  - Beautiful skeleton loaders for better perceived performance
  - Replaces basic spinners
- **Smooth Animations & Transitions**:
  - Product card hover effects (scale, shadow, translate)
  - Fade-in animations for product grid
  - Scale-in animations with staggered delays
  - Smooth transitions on all interactive elements
  - Custom scrollbar styling
- **Enhanced Product Cards**:
  - Discount badge with percentage
  - Wishlist button overlay
  - Improved hover states
  - Better visual hierarchy
- **Enhanced Product Details**:
  - Discount percentage display
  - Wishlist button
  - Toast notifications for cart actions
- **Modern UI Improvements**:
  - Custom CSS animations (slide-in, fade-in, scale-in)
  - Smooth scrolling
  - Better focus states
  - Improved mobile responsiveness
  - Enhanced visual feedback

### Improved - 2025-01-27 (Modern UI Redesign)
- **Redesigned Product Filters**:
  - Modern pill-style category buttons with active states
  - Collapsible sections with smooth animations
  - Gradient header with filter count badges
  - Button-style price range filters
  - Chip-style size filters with active indicators
  - Icons for each filter section
  - Sticky positioning for better UX
  - Active filter count display
- **Redesigned Product Tabs**:
  - Modern pill-style tabs with gradient active state
  - Icons for each tab (🛍️ All, ✨ New, 🔥 Trending, 🏷️ Sale)
  - Smooth scale and shadow transitions
  - Better visual hierarchy
- **Enhanced Search Bar**:
  - Larger, more prominent design
  - Clear button when search has text
  - Better focus states with ring effects
  - Hover shadow effects
- **Enhanced Sort Component**:
  - Card-style container with shadow
  - Icons for better visual communication
  - Modern select dropdown styling
  - Better spacing and typography
- **Overall Design Consistency**:
  - Gradient backgrounds and text
  - Consistent border radius (rounded-xl)
  - Unified shadow system
  - Consistent color scheme (indigo-purple gradient)
  - Smooth transitions throughout
  - Better empty states with icons

### Added - 2025-01-27 (Website Content & Filling)
- **Hero Banner**: Large gradient banner with call-to-action buttons
- **Featured Product Sections**: 
  - "On Sale Now" section with featured sale items
  - "New Arrivals" section with latest products
  - "Trending Now" section with popular items
  - Each section shows 4 products with "View All" links
- **Category Showcase**: Visual category grid with icons and hover effects
- **Promotional Banners**: 
  - Free shipping banner
  - New collection banner
  - Gradient designs with call-to-action buttons
- **Stats Section**: Company statistics (Products, Customers, Orders, Countries)
- **Footer**: 
  - Brand information
  - Quick links navigation
  - Customer service links
  - Contact information
  - Social media icons
- **URL Parameter Support**: Tabs and categories can be accessed via URL parameters
- **Smart Content Display**: Featured sections only show when viewing all products without filters
- **Enhanced Homepage Layout**: More content, better spacing, filled appearance

