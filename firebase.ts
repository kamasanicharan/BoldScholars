import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  sendPasswordResetEmail,
  signOut,
  onAuthStateChanged,
  updateProfile
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDNZFEaqPXXPImIB6sMnancvQHkxrBwIks",
  authDomain: "boldscholars-4ce84.firebaseapp.com",
  projectId: "boldscholars-4ce84",
  storageBucket: "boldscholars-4ce84.firebasestorage.app",
  messagingSenderId: "821466037858",
  appId: "1:821466037858:web:e01164814daa9c0ff81b3b",
  measurementId: "G-Y81CL8PN6Z"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Services
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
export const analytics = getAnalytics(app);

export { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInWithPopup, 
  sendPasswordResetEmail,
  signOut,
  onAuthStateChanged,
  updateProfile
};