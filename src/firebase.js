// Firebase initialization for Maxxjoy Travel Platform
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, setPersistence, browserLocalPersistence, inMemoryPersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyAZNUMSWy3Zjm4NlKoOJ-_pM0NaWsJ9ra8",
  authDomain: "maxxjoy-cbb84.firebaseapp.com",
  projectId: "maxxjoy-cbb84",
  storageBucket: "maxxjoy-cbb84.firebasestorage.app",
  messagingSenderId: "313661362324",
  appId: "1:313661362324:web:49a21eaa9e2669fbd72481",
  measurementId: "G-K1HY04RCRJ"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

// Safe Auth Persistence (prevents IndexedDB closure error)
if (typeof window !== 'undefined') {
  setPersistence(auth, browserLocalPersistence).catch(() => {
    setPersistence(auth, inMemoryPersistence).catch(() => {});
  });
}

// Analytics (only in browser)
let analytics = null;
if (typeof window !== 'undefined') {
  try {
    analytics = getAnalytics(app);
  } catch (e) {
    // analytics unavailable in dev
  }
}
export { analytics };

export default app;
