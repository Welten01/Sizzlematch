import { 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  serverTimestamp 
} from 'firebase/firestore';
import { db, isInitialized } from '../config/firebase';
import { showToast } from '../utils/toast';
import { uploadProfilePicture, updateProfilePicture } from './storage';
import { uriToBlob } from '../utils/imageUtils';

// Helper to check Firebase initialization
const checkFirebaseReady = () => {
  if (!isInitialized) {
    const error = new Error('Firebase not initialized. Check your configuration.');
    console.error(error);
    showToast('Firebase initialization error. Please try again later.', 'error');
    throw error;
  }
};

/**
 * Creates or updates a user profile in Firestore
 * @param {string} uid - User's Firebase UID
 * @param {object} profileData - User profile data
 * @param {string} [imageUri] - Optional image URI to upload as profile picture
 * @returns {Promise<void>}
 */
export const saveUserProfile = async (uid, profileData, imageUri = null) => {
  try {
    // Check Firebase initialization first
    checkFirebaseReady();
    
    // Process profile picture if provided
    let dataToSave = { ...profileData };
    if (imageUri) {
      // Convert image URI to blob
      const imageBlob = await uriToBlob(imageUri);
      
      // Upload image and get download URL
      const downloadURL = await uploadProfilePicture(uid, imageBlob);
      
      // Add the profile picture URL to the profile data
      dataToSave.profilePicture = downloadURL;
    }
    
    const userRef = doc(db, 'users', uid);
    
    // Add metadata fields
    const dataWithMetadata = {
      ...dataToSave,
      updatedAt: serverTimestamp(),
    };
    
    // Check if document exists
    const docSnap = await getDoc(userRef);
    
    if (!docSnap.exists()) {
      // Create new document with createdAt timestamp
      await setDoc(userRef, {
        ...dataWithMetadata,
        uid,
        createdAt: serverTimestamp(),
      });
      showToast('Profile created successfully', 'success');
    } else {
      // Update existing document
      await updateDoc(userRef, dataWithMetadata);
      showToast('Profile updated successfully', 'success');
    }
  } catch (error) {
    console.error('Error saving user profile:', error);
    showToast('Failed to save profile. Please try again.', 'error');
    throw error;
  }
};

/**
 * Retrieves a user profile from Firestore by UID
 * @param {string} uid - User's Firebase UID
 * @returns {Promise<object|null>} - User profile data or null if not found
 */
export const getUserProfile = async (uid) => {
  try {
    // Check Firebase initialization first
    checkFirebaseReady();
    
    const userRef = doc(db, 'users', uid);
    const docSnap = await getDoc(userRef);
    
    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      console.log('No profile found for user:', uid);
      return null;
    }
  } catch (error) {
    console.error('Error retrieving user profile:', error);
    showToast('Failed to load profile. Please try again.', 'error');
    throw error;
  }
};

/**
 * Updates specific fields in a user profile
 * @param {string} uid - User's Firebase UID
 * @param {object} updates - Object containing fields to update
 * @param {string} [imageUri] - Optional new image URI for profile picture
 * @returns {Promise<void>}
 */
export const updateUserProfile = async (uid, updates, imageUri = null) => {
  try {
    // Check Firebase initialization first
    checkFirebaseReady();
    
    let updatesToApply = { ...updates };
    
    // Handle profile picture update if provided
    if (imageUri) {
      // Get current profile to check for existing picture
      const currentProfile = await getUserProfile(uid);
      const oldImageURL = currentProfile?.profilePicture || null;
      
      // Convert image URI to blob
      const imageBlob = await uriToBlob(imageUri);
      
      // Update the profile picture and get new URL
      const downloadURL = await updateProfilePicture(uid, imageBlob, oldImageURL);
      
      // Add the profile picture URL to the updates
      updatesToApply.profilePicture = downloadURL;
    }
    
    const userRef = doc(db, 'users', uid);
    
    // Add updatedAt timestamp
    const updatesWithTimestamp = {
      ...updatesToApply,
      updatedAt: serverTimestamp(),
    };
    
    await updateDoc(userRef, updatesWithTimestamp);
    showToast('Profile updated successfully', 'success');
  } catch (error) {
    console.error('Error updating user profile:', error);
    showToast('Failed to update profile. Please try again.', 'error');
    throw error;
  }
};

/**
 * Checks if a user has a complete profile
 * @param {string} uid - User's Firebase UID
 * @returns {Promise<boolean>} - True if user has a complete profile
 */
export const hasCompleteProfile = async (uid) => {
  try {
    // Check Firebase initialization first
    checkFirebaseReady();
    
    const profile = await getUserProfile(uid);
    
    if (!profile) {
      return false;
    }
    
    // Check for required fields
    const requiredFields = [
      'name', 
      'age', 
      'gender', 
      'travelDates',
      'profilePicture' // Added profile picture as a required field
    ];
    
    for (const field of requiredFields) {
      if (!profile[field]) {
        return false;
      }
    }
    
    // Check travel dates
    if (!profile.travelDates.arrival || !profile.travelDates.departure) {
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error checking profile completeness:', error);
    return false;
  }
}; 