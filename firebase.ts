// Fix: Add a triple-slash directive to include Vite's client types to resolve issues with `import.meta.env`.
/// <reference types="vite/client" />

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// This robust configuration works in both development and production (Vercel).
// It safely checks for environment variables and uses them if they exist (for Vercel),
// but falls back to the hardcoded keys for the local development environment without crashing.
const env = (typeof import.meta !== 'undefined' && import.meta.env) ? import.meta.env : {};

const firebaseConfig = {
  apiKey: env.VITE_FIREBASE_API_KEY || "AIzaSyCnUgRqdBBqHE5rQNaFwmre-O9djTAmPWg",
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN || "bankboss-85bff.firebaseapp.com",
  projectId: env.VITE_FIREBASE_PROJECT_ID || "bankboss-85bff",
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET || "bankboss-85bff.firebasestorage.app",
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID || "590981711345",
  appId: env.VITE_FIREBASE_APP_ID || "1:590981711345:web:e55234e9b12393c4c1f050",
  measurementId: env.VITE_FIREBASE_MEASUREMENT_ID || "G-F7T4MQB08T"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize and export Firebase services
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };