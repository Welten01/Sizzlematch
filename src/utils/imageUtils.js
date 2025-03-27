/**
 * Utility functions for handling images in the app
 */

/**
 * Converts an image URI to a Blob for Firebase Storage uploads
 * Works with both local file URIs and remote URLs
 * 
 * @param {string} uri - The image URI to convert
 * @returns {Promise<Blob>} A Blob representation of the image
 */
export const uriToBlob = async (uri) => {
  try {
    // Fetch the image as a blob
    const response = await fetch(uri);
    const blob = await response.blob();
    return blob;
  } catch (error) {
    console.error('Error converting image URI to blob:', error);
    throw new Error(`Failed to process image: ${error.message}`);
  }
};

/**
 * Validates an image file size
 * 
 * @param {Blob} blob - The image blob to validate
 * @param {number} maxSizeInMB - Maximum allowed size in MB (default: 5MB)
 * @returns {boolean} True if valid, false if too large
 */
export const validateImageSize = (blob, maxSizeInMB = 5) => {
  const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
  return blob.size <= maxSizeInBytes;
};

/**
 * Extracts file extension from URI or filename
 * 
 * @param {string} uri - The image URI or filename
 * @returns {string} File extension (e.g., 'jpg', 'png')
 */
export const getFileExtension = (uri) => {
  const fileName = uri.split('/').pop();
  return fileName.split('.').pop().toLowerCase();
};

/**
 * Validates image file type based on extension
 * 
 * @param {string} uri - The image URI to validate
 * @param {string[]} allowedTypes - Array of allowed extensions (default: common image types)
 * @returns {boolean} True if valid, false if not an allowed type
 */
export const validateImageType = (uri, allowedTypes = ['jpg', 'jpeg', 'png', 'gif']) => {
  const extension = getFileExtension(uri);
  return allowedTypes.includes(extension);
}; 