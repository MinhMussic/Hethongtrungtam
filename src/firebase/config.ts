import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';

const metaEnv = (import.meta as unknown as { env?: Record<string, string> }).env || {};

const firebaseConfig = {
  apiKey: metaEnv.VITE_FIREBASE_API_KEY || "AIzaSyDummyKeyMinhMusicCenter1234567890",
  authDomain: metaEnv.VITE_FIREBASE_AUTH_DOMAIN || "minh-music-center.firebaseapp.com",
  projectId: metaEnv.VITE_FIREBASE_PROJECT_ID || "minh-music-center",
  storageBucket: metaEnv.VITE_FIREBASE_STORAGE_BUCKET || "minh-music-center.appspot.com",
  messagingSenderId: metaEnv.VITE_FIREBASE_MESSAGING_SENDER_ID || "448828093185",
  appId: metaEnv.VITE_FIREBASE_APP_ID || "1:448828093185:web:minhmusicapplet"
};

let app: FirebaseApp;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp();
}

export const auth: Auth = getAuth(app);
export const db: Firestore = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();
export default app;
