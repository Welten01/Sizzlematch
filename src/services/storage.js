import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage, checkFirebaseInitialization } from '../config/firebase';
import Toast from 'react-native-toast-message';

/**
 * Uploads a profile picture to Firebase Cloud Storage
 * @param {string} uid - User ID to use in the storage path
 * @param {Blob} imageBlob - The image file as a Blob object
 * @returns {Promise<string>} Download URL of the uploaded image
 */
export const uploadProfilePicture = async (uid, imageBlob) => {
  try {
    checkFirebaseInitialization();
    
    // Generate a unique file name with timestamp to prevent caching issues
    const fileName = `${uid}_${Date.now()}`;
    const storageRef = ref(storage, `profilePictures/${uid}/${fileName}`);
    
    // Upload the image to Firebase Storage
    const snapshot = await uploadBytes(storageRef, imageBlob);
    console.log('Image uploaded successfully');
    
    // Get the download URL
    const downloadURL = await getDownloadURL(snapshot.ref);
    Toast.show({
      type: 'success',
      text1: 'Image uploaded successfully',
    });
    
    return downloadURL;
  } catch (error) {
    console.error('Error uploading profile picture:', error);
    Toast.show({
      type: 'error',
      text1: 'Failed to upload image',
      text2: error.message || 'Please try again later',
    });
    throw error;
  }
};

/**
 * Gets the download URL of a profile picture
 * @param {string} imagePath - Full storage path of the image
 * @returns {Promise<string>} Download URL of the image
 */
export const getProfilePictureURL = async (imagePath) => {
  try {
    checkFirebaseInitialization();
    
    const storageRef = ref(storage, imagePath);
    const downloadURL = await getDownloadURL(storageRef);
    
    return downloadURL;
  } catch (error) {
    console.error('Error getting profile picture URL:', error);
    Toast.show({
      type: 'error',
      text1: 'Failed to load image',
      text2: error.message || 'Please try again later',
    });
    throw error;
  }
};

/**
 * Deletes a profile picture from Firebase Cloud Storage
 * @param {string} imagePath - Full storage path of the image to delete
 * @returns {Promise<void>}
 */
export const deleteProfilePicture = async (imagePath) => {
  try {
    checkFirebaseInitialization();
    
    const storageRef = ref(storage, imagePath);
    await deleteObject(storageRef);
    
    console.log('Profile picture deleted successfully');
    Toast.show({
      type: 'success',
      text1: 'Image deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting profile picture:', error);
    Toast.show({
      type: 'error',
      text1: 'Failed to delete image',
      text2: error.message || 'Please try again later',
    });
    throw error;
  }
};

/**
 * Helper function to extract the storage path from a download URL
 * @param {string} downloadURL - The download URL
 * @returns {string|null} Storage path or null if not found
 */
export const getStoragePathFromURL = (downloadURL) => {
  try {
    // Extract path from Firebase Storage URL
    // URL format: https://firebasestorage.googleapis.com/v0/b/<bucket>/o/<encoded-path>?token=...
    const urlObj = new URL(downloadURL);
    const path = urlObj.pathname.split('/o/')[1];
    
    if (path) {
      // Decode the path and remove any query parameters
      return decodeURIComponent(path.split('?')[0]);
    }
    return null;
  } catch (error) {
    console.error('Error extracting storage path:', error);
    return null;
  }
};

/**
 * Updates the user's profile picture, deleting the old one if it exists
 * @param {string} uid - User ID
 * @param {Blob} imageBlob - New image as a Blob object
 * @param {string|null} oldImageURL - URL of the existing profile picture (if any)
 * @returns {Promise<string>} Download URL of the new image
 */
export const updateProfilePicture = async (uid, imageBlob, oldImageURL) => {
  try {
    // Delete old image if it exists
    if (oldImageURL) {
      const oldPath = getStoragePathFromURL(oldImageURL);
      if (oldPath) {
        await deleteProfilePicture(oldPath);
      }
    }
    
    // Upload new image
    return await uploadProfilePicture(uid, imageBlob);
  } catch (error) {
    console.error('Error updating profile picture:', error);
    Toast.show({
      type: 'error',
      text1: 'Failed to update profile picture',
      text2: error.message || 'Please try again later',
    });
    throw error;
  }
}; 