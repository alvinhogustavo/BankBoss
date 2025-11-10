// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCnUgRqdBBqHE5rQNaFwmre-O9djTAmPWg",
  authDomain: "bankboss-85bff.firebaseapp.com",
  projectId: "bankboss-85bff",
  storageBucket: "bankboss-85bff.firebasestorage.app",
  messagingSenderId: "590981711345",
  appId: "1:590981711345:web:e55234e9b12393c4c1f050",
  measurementId: "G-F7T4MQB08T"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export the necessary Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();
