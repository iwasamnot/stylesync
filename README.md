# StyleSync - Clothing E-commerce App

A modern clothing e-commerce application built with React, Vite, Tailwind CSS, and Firebase.

## 🚀 Tech Stack

- **Framework**: React 18 (Vite)
- **Styling**: Tailwind CSS 3
- **Backend**: Firebase v9 (Firestore, Auth, Analytics)
- **Routing**: React Router DOM v6
- **Build Tool**: Vite

## 📋 Features

- ✅ Project scaffold and folder structure
- ✅ Firebase integration (Auth, Firestore, Analytics)
- ✅ Responsive navigation with cart icon
- ✅ React Router setup with multiple routes
- ✅ Context API for state management (Auth, Cart)
- 🔄 Authentication (In Progress)
- 🔄 Product catalog (In Progress)
- 🔄 Shopping cart functionality (In Progress)
- 🔄 Checkout flow (Planned)

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

## 🔥 Firebase Setup

Firebase is already configured with the following services:
- **Authentication**: Ready for user sign-in/sign-up
- **Firestore**: Database for products and user data
- **Analytics**: User behavior tracking

Configuration file: `src/lib/firebase.js`

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
