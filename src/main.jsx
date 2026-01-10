import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// Performance optimization: Only use StrictMode in development
const root = ReactDOM.createRoot(document.getElementById('root'));

if (import.meta.env.DEV) {
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} else {
  // Production: No StrictMode for better performance
  root.render(<App />);
}

// Mark HTML as loaded
document.documentElement.classList.add('loaded');

