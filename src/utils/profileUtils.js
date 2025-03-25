import { dateToTimestamp, timestampToDate, formatDate } from './dateUtils';

/**
 * Normalizes user profile data for saving to Firestore
 * Converts any Date objects to Firebase Timestamps
 * @param {object} profileData - User profile data
 * @returns {object} - Normalized profile data
 */
export const normalizeProfileForSaving = (profileData) => {
  const normalized = { ...profileData };
  
  // Convert travel dates to Firebase Timestamps if they are Date objects
  if (normalized.travelDates) {
    if (normalized.travelDates.arrival instanceof Date) {
      normalized.travelDates.arrival = dateToTimestamp(normalized.travelDates.arrival);
    }
    
    if (normalized.travelDates.departure instanceof Date) {
      normalized.travelDates.departure = dateToTimestamp(normalized.travelDates.departure);
    }
  }
  
  return normalized;
};

/**
 * Transforms a Firestore profile document to a format suitable for the UI
 * Converts Firebase Timestamps to Date objects
 * @param {object} firestoreData - Profile data from Firestore
 * @returns {object} - UI-ready profile data
 */
export const transformProfileForUI = (firestoreData) => {
  if (!firestoreData) return null;
  
  const transformed = { ...firestoreData };
  
  // Convert Firebase Timestamps to Date objects
  if (transformed.travelDates) {
    if (transformed.travelDates.arrival && transformed.travelDates.arrival.toDate) {
      transformed.travelDates.arrival = timestampToDate(transformed.travelDates.arrival);
    }
    
    if (transformed.travelDates.departure && transformed.travelDates.departure.toDate) {
      transformed.travelDates.departure = timestampToDate(transformed.travelDates.departure);
    }
  }
  
  // Add formatted date strings for the UI
  if (transformed.travelDates) {
    transformed.formattedDates = {
      arrival: formatDate(transformed.travelDates.arrival),
      departure: formatDate(transformed.travelDates.departure)
    };
  }
  
  // Add age description
  if (transformed.age) {
    transformed.ageDescription = `${transformed.age} years old`;
  }
  
  return transformed;
}; 