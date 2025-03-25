import { Timestamp } from 'firebase/firestore';

/**
 * Converts a JavaScript Date object to a Firebase Timestamp
 * @param {Date} date - JavaScript Date object
 * @returns {Timestamp} - Firebase Timestamp object
 */
export const dateToTimestamp = (date) => {
  if (!date || !(date instanceof Date)) {
    throw new Error('Invalid date object provided');
  }
  return Timestamp.fromDate(date);
};

/**
 * Converts a Firebase Timestamp to a JavaScript Date object
 * @param {Timestamp} timestamp - Firebase Timestamp object
 * @returns {Date} - JavaScript Date object
 */
export const timestampToDate = (timestamp) => {
  if (!timestamp || !timestamp.toDate) {
    throw new Error('Invalid timestamp object provided');
  }
  return timestamp.toDate();
};

/**
 * Formats a date object to a human-readable string (YYYY-MM-DD)
 * @param {Date|Timestamp} date - Date object or Firebase Timestamp
 * @returns {string} - Formatted date string
 */
export const formatDate = (date) => {
  try {
    // Convert to Date object if it's a Firebase Timestamp
    const dateObj = date instanceof Date ? date : date.toDate();
    
    return dateObj.toISOString().split('T')[0]; // Returns YYYY-MM-DD format
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Invalid date';
  }
};

/**
 * Checks if two date ranges overlap
 * @param {object} range1 - First date range with arrival and departure properties
 * @param {object} range2 - Second date range with arrival and departure properties
 * @returns {boolean} - True if the ranges overlap
 */
export const doDateRangesOverlap = (range1, range2) => {
  // Convert timestamps to Date objects if needed
  const arrival1 = range1.arrival instanceof Date ? range1.arrival : range1.arrival.toDate();
  const departure1 = range1.departure instanceof Date ? range1.departure : range1.departure.toDate();
  const arrival2 = range2.arrival instanceof Date ? range2.arrival : range2.arrival.toDate();
  const departure2 = range2.departure instanceof Date ? range2.departure : range2.departure.toDate();
  
  // Check for overlap
  // Range 1 starts before Range 2 ends AND Range 2 starts before Range 1 ends
  return arrival1 < departure2 && arrival2 < departure1;
}; 