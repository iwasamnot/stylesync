# Changelog

All notable changes to the StyleSync project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

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

