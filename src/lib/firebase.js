// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBNTyQfiShVkl1RDamNYleKvZiA0kYhfiA",
  authDomain: "stylesync-sistc.firebaseapp.com",
  projectId: "stylesync-sistc",
  storageBucket: "stylesync-sistc.firebasestorage.app",
  messagingSenderId: "866079887510",
  appId: "1:866079887510:web:11319e4823dd6de67bb2b7",
  measurementId: "G-PSWFGPWF5D"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Analytics (only in browser)
let analytics = null;
if (typeof window !== 'undefined') {
  try {
    analytics = getAnalytics(app);
  } catch (error) {
    console.warn('Firebase Analytics initialization error:', error);
  }
}

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

export default app;

