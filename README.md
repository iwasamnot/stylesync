# StyleSync - Clothing E-commerce App

A modern clothing e-commerce application built with React, Vite, Tailwind CSS, and Firebase.

## 🚀 Tech Stack

- **Framework**: React 18 (Vite)
- **Styling**: Tailwind CSS 3
- **Animations**: Framer Motion
- **Backend**: Firebase v9 (Firestore, Auth, Analytics)
- **Routing**: React Router DOM v6
- **Build Tool**: Vite

## 📋 Features

### ✅ Completed Features
- Project scaffold and folder structure
- Firebase integration (Auth, Firestore, Analytics)
- Responsive navigation with role-based links
- React Router setup with protected routes
- Context API for state management (Auth, Cart)
- **Themes**: Light / Dark / Fun theme switcher (saved to localStorage)
- **Sale Promotions**: Sale banner + one-time-per-session sale popup on the homepage
- **Branding**: Custom logo component + favicon
- **Global Search**: Search modal with autocomplete (Ctrl/⌘K or `/`)
- **PWA**: Installable app + offline support (service worker)
- **Authentication System**: Sign up, login, logout with Firebase Auth
- **Role-Based Access Control**: Admin, User, and Guest roles
- **Admin Dashboard**: Full product management (CRUD operations)
- **Product Catalog**: Browse products from Firestore database
- **Shopping Cart**: Add, remove, update quantity with localStorage persistence
- **Product Details**: View individual product information
- **User Profile**: View profile and manage account
- **Protected Routes**: Route guards for authenticated and admin-only pages
- **💳 Payment & Orders** (Complete E-commerce Flow):
  - Payment integration with credit card processing (mock Stripe)
  - 3-step checkout flow: Shipping Address → Payment Method → Order Review
  - Shipping address form with validation
  - Payment method form with card number formatting
  - Order creation in Firestore with complete order data
  - Order history page showing all user orders
  - Order details page with full order information
  - Order status tracking: pending, processing, shipped, completed, cancelled
  - Order cancellation for users (pending/processing orders)
  - Admin order management with status updates
  - Order confirmation with confetti animation
  - Automatic cart clearing after successful order
  - Protected checkout route requiring authentication
  - Order summary with subtotal, shipping (free), tax (8%), and total
  - Progress indicator for checkout steps
  - Theme-aware styling for all order pages
- **🤖 AI Assistant** (Product Recommendations & Size Guessing):
  - AI-powered chat interface for product recommendations
  - Size recommendation system based on gender, age, weight, height, and body measurements
  - Automatic size selection when AI recommends a size
  - Natural language processing for extracting measurements from chat
  - User profile management (measurements stored in Firestore/localStorage)
  - Category-specific sizing algorithms (T-Shirts, Jeans, Shoes, etc.)
  - Product recommendations based on user preferences and browsing history
  - Quick action buttons: Size Help, Recommend Products, My Profile
  - "AI Size Help" button on product details page
  - Integrated on Home page (product recommendations) and Product Details page (size recommendations)
- **🎨 Fluid Animations & Motion Design** (Ready.so-Inspired):
  - Framer Motion integration for smooth, performant animations
  - Fluid morphing blob backgrounds with organic movement
  - Glass morphism design with backdrop blur effects
  - Ready.so-inspired large split typography in hero section
  - Scroll-triggered animations with Intersection Observer
  - Enhanced product cards with staggered entrance animations
  - Advanced hover effects with scale, elevation, and image zoom
  - Animated badges and buttons with spring physics
  - Smooth page transitions and route animations
  - Custom easing curves for natural motion
  - Floating decorative elements
  - Gradient text animations
  - Glow pulse effects
  - Button ripple effects
  - Parallax scrolling effects
  - Glass morphism navbar with blur on scroll

### 🔄 In Progress / Planned
- Real Stripe payment integration (requires backend server)
- Email notifications for order confirmations and status updates
- Order tracking with shipping provider integration
- Advanced AI assistant with machine learning models
- Product recommendations using collaborative filtering
- Wishlist notifications
- Product reviews and ratings system
- Inventory management
- Analytics dashboard

## 🎨 Themes

Use the theme switcher in the navbar to switch between:
- **Light**
- **Dark**
- **Fun** (animated gradient background, fun-mode banner, rounder UI, lively promos)

The selected theme is persisted in localStorage.

## 🔎 Search

- Open the global search modal with **Ctrl/⌘K** (or press **/**) from anywhere in the app.
- Type at least 2 characters to see product suggestions.

## 🤖 AI Assistant

StyleSync includes an AI-powered assistant to help you find the perfect products and sizes:

### Features:
- **Size Recommendations**: Get personalized size recommendations based on your measurements
- **Product Recommendations**: Discover products tailored to your preferences
- **Natural Language Chat**: Ask questions naturally like "What size should I get?" or "I'm a 25-year-old male, 180cm tall, 75kg"

### How to Use:

1. **Setup Your Profile**:
   - Click the AI Assistant button (floating button in bottom right)
   - Click "My Profile" button or tell the assistant your measurements
   - Fill in: Gender, Age, Weight (kg), Height (cm)
   - Optional: Chest, Waist, Hips measurements for more accuracy

2. **Get Size Recommendations**:
   - On any product page, click "AI Size Help" next to the size selector
   - Or ask: "What size should I get for this product?"
   - The AI will recommend a size and automatically select it if available

3. **Get Product Recommendations**:
   - On the home page, click "Recommend" in the AI Assistant
   - Or ask: "Recommend products for me" or "Show me jeans in my size"
   - The AI will suggest products based on your profile and preferences

### Example Conversations:
- "I'm a 30-year-old female, 165cm tall, 60kg" - Sets your profile
- "What size should I get for these jeans?" - Gets size recommendation
- "Recommend some t-shirts" - Gets product recommendations
- "What's my profile?" - Shows your saved measurements

## 📲 Install (PWA)

StyleSync is installable as a Progressive Web App:
- On supported browsers you'll see an **Install** option in the navbar.
- The app includes a service worker with **auto-updates** and basic **offline support**.

## Getting Started

### Installation

Install the dependencies:

```bash
npm install
```

### Development

Run the development server:

```bash
npm run dev
```

### Build

Build for production:

```bash
npm run build
```

### Notes on navigation (Firebase Hosting)

The app is a single-page application (React Router). Firebase Hosting is configured with a rewrite so deep links like `/cart`, `/wishlist`, `/product/:id`, `/admin` work on refresh.

## 🔥 Firebase Setup

Firebase is already configured with the following services:
- **Authentication**: Ready for user sign-in/sign-up
- **Firestore**: Database for products and user data
- **Analytics**: User behavior tracking

Configuration file: `src/lib/firebase.js`

### ⚠️ Important: Enable Email/Password Authentication

Before using the app, you must enable Email/Password authentication in Firebase Console:

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **stylesync-sistc**
3. Navigate to **Authentication** → **Sign-in method**
4. Click on **Email/Password**
5. Toggle **Enable** to ON
6. Click **Save**

**Without this step, you'll get `auth/operation-not-allowed` errors!**

For more troubleshooting, see [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)

### Admin Account Setup

To create an admin account, see the detailed guide in [ADMIN_SETUP.md](./ADMIN_SETUP.md).

**Quick Steps:**
1. Create a user account through the app
2. Go to Firebase Console → Firestore Database
3. Find the `users` collection and locate the user document (by UID)
4. Update the `role` field from `"user"` to `"admin"`

### Firestore Security Rules

Security rules are defined in `firestore.rules`. Deploy them with:

```bash
firebase deploy --only firestore:rules
```

**Key Rules:**
- **Users**: Can read own data; admins can read/write all
- **Products**: Everyone can read; only admins can create/update/delete
- **Orders**: Users can read own orders; admins can read/write all

## 📁 Project Structure

```
src/
├── components/     # Reusable UI components
│   ├── Navbar.jsx          # Responsive navigation bar
│   └── ProductCard.jsx     # Product display card
├── pages/         # Page components
│   ├── Home.jsx            # Homepage with product grid
│   ├── Login.jsx           # Authentication page
│   ├── ProductDetails.jsx  # Individual product page
│   └── Cart.jsx            # Shopping cart page
├── context/       # React Context providers
│   ├── AuthContext.jsx     # Authentication state
│   └── CartContext.jsx     # Shopping cart state
├── lib/           # Firebase configuration
│   └── firebase.js         # Firebase initialization
├── App.jsx        # Main app component with routing
└── main.jsx       # Application entry point
```

## 📝 Changelog

See [CHANGELOG.md](./CHANGELOG.md) for a detailed list of changes and features.

## 🛠️ Development

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

```bash
npm install
```

### Run Development Server

```bash
npm run dev
```

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## 🚀 Deployment

### Automatic Deployment via GitHub Actions

The project includes a GitHub Actions workflow that automatically builds and deploys to Firebase Hosting whenever you push code to the `main` branch.

#### Setup (One-time)

1. **Generate Firebase Service Account Token**:
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Select your project: `stylesync-sistc`
   - Go to Project Settings → Service Accounts
   - Click "Generate New Private Key"
   - Save the JSON file (keep it secure!)

2. **Add Secret to GitHub**:
   - Go to your GitHub repository: `https://github.com/iwasamnot/stylesync`
   - Navigate to Settings → Secrets and variables → Actions
   - Click "New repository secret"
   - Name: `FIREBASE_SERVICE_ACCOUNT`
   - Value: Paste the entire contents of the JSON file you downloaded
   - Click "Add secret"

3. **Push to main branch**:
   ```bash
   git push origin main
   ```
   The workflow will automatically trigger and deploy your site!

#### Manual Deployment

If you prefer to deploy manually:

1. **Login to Firebase** (first time only):
   ```bash
   npx firebase login
   ```
   This will open a browser window for authentication.

2. **Deploy to Firebase Hosting**:
   ```bash
   npm run deploy
   ```
   Or manually:
   ```bash
   npm run build
   npx firebase deploy --only hosting
   ```

### Live Site URLs

Once deployed, your site will be available at:
- https://stylesync-sistc.web.app
- https://stylesync-sistc.firebaseapp.com

**Note**: Firebase Hosting configuration files:
- `firebase.json` - Hosting configuration
- `.firebaserc` - Project ID configuration
- `.github/workflows/firebase-deploy.yml` - GitHub Actions workflow

## 📄 License

This project is private and proprietary.

## 👤 Author

StyleSync Developer
