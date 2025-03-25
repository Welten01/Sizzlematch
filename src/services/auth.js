import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile
} from 'firebase/auth';
import { auth } from '../config/firebase';
import { showToast } from '../utils/toast';

/**
 * Register a new user with email and password
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise<object>} - Firebase user object
 */
export const registerWithEmail = async (email, password) => {
  try {
    console.log('Attempting to register with:', { email, passwordLength: password.length });
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    console.log('Registration successful');
    return userCredential.user;
  } catch (error) {
    console.error('Firebase auth error details:', error.code, error.message);
    const errorMessage = getAuthErrorMessage(error.code);
    showToast(errorMessage, 'error');
    throw error;
  }
};

/**
 * Log in with email and password
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise<object>} - Firebase user object
 */
export const loginWithEmail = async (email, password) => {
  try {
    console.log('Attempting to login with:', { email });
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    console.log('Login successful');
    return userCredential.user;
  } catch (error) {
    console.error('Firebase auth error details:', error.code, error.message);
    const errorMessage = getAuthErrorMessage(error.code);
    showToast(errorMessage, 'error');
    throw error;
  }
};

/**
 * Log out the current user
 * @returns {Promise<void>}
 */
export const logout = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    showToast('Failed to log out. Please try again.', 'error');
    throw error;
  }
};

/**
 * Get a user-friendly error message for Firebase Auth error codes
 * @param {string} errorCode - Firebase Auth error code
 * @returns {string} - User-friendly error message
 */
const getAuthErrorMessage = (errorCode) => {
  switch (errorCode) {
    case 'auth/email-already-in-use':
      return 'This email is already registered.';
    case 'auth/invalid-email':
      return 'Please enter a valid email address.';
    case 'auth/weak-password':
      return 'Password should be at least 6 characters.';
    case 'auth/user-not-found':
    case 'auth/wrong-password':
      return 'Invalid email or password.';
    case 'auth/too-many-requests':
      return 'Too many failed attempts. Please try again later.';
    case 'auth/network-request-failed':
      return 'Network error. Please check your connection.';
    case 'auth/api-key-not-valid.-please-pass-a-valid-api-key.':
      return 'Firebase configuration error. Please contact support.';
    default:
      return `An error occurred (${errorCode}). Please try again.`;
  }
}; 