import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAnalytics, isSupported } from "firebase/analytics";

// src/lib/firebase.ts
const firebaseConfig = {
  // 修正後應為讀取環境變數
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: "tool-development-request-8e135.firebaseapp.com",
  projectId: "tool-development-request-8e135",
  storageBucket: "tool-development-request-8e135.appspot.com",
  messagingSenderId: "832977730627",
  appId: "1:832977730627:web:8e169d51829e9f658e135b",
  measurementId: "G-6SBT9D9999"
};

// Initialize Firebase (Singleton pattern)
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Analytics (Client-side only)
let analytics;
if (typeof window !== "undefined") {
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  });
}

export { app, auth, db, storage, analytics };
