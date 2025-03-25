import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { 
  FIREBASE_API_KEY,
  FIREBASE_AUTH_DOMAIN,
  FIREBASE_PROJECT_ID,
  FIREBASE_STORAGE_BUCKET,
  FIREBASE_MESSAGING_SENDER_ID,
  FIREBASE_APP_ID
} from '@env';

// Track Firebase initialization status
let isInitialized = false;
let initError = null;

// Firebase configuration from environment variables
const firebaseConfig = {
  apiKey: FIREBASE_API_KEY,
  authDomain: FIREBASE_AUTH_DOMAIN,
  projectId: FIREBASE_PROJECT_ID,
  storageBucket: FIREBASE_STORAGE_BUCKET,
  messagingSenderId: FIREBASE_MESSAGING_SENDER_ID,
  appId: FIREBASE_APP_ID
};

// Initialize Firebase with error handling
let app, auth, db, storage;

try {
  console.log('Initializing Firebase with config:', {
    apiKey: FIREBASE_API_KEY ? 'valid' : 'missing',
    authDomain: FIREBASE_AUTH_DOMAIN,
    projectId: FIREBASE_PROJECT_ID,
  });

  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
  storage = getStorage(app);
  isInitialized = true;
  console.log('Firebase successfully initialized');
} catch (error) {
  console.error('Firebase initialization error:', error);
  initError = error;
}

// Helper function to check if Firebase is initialized
export const checkFirebaseInitialization = () => {
  if (!isInitialized) {
    throw new Error(`Firebase initialization failed: ${initError?.message || 'Unknown error'}`);
  }
  return true;
};

export { app, auth, db, storage, isInitialized, initError }; 