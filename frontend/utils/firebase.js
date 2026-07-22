// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "multi-agent-ai-49c2f.firebaseapp.com",
  projectId: "multi-agent-ai-49c2f",
  storageBucket: "multi-agent-ai-49c2f.firebasestorage.app",
  messagingSenderId: "306952023199",
  appId: "1:306952023199:web:7843d85217199afb13c6aa",
  measurementId: "G-8W94TRTVXG",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
