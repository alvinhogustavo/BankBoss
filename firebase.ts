// FIX: Provide a valid Firebase configuration and initialize services.
// This resolves the "is not a module" errors in other files.
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// IMPORTANT: Replace the placeholder values below with your actual Firebase project configuration.
// You can find this in your Firebase project settings.
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:1234567890abcdef123456"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export the necessary Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();
