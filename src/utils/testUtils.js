import { saveUserProfile } from '../services/user';
import { dateToTimestamp } from './dateUtils';
import { showToast } from './toast';

/**
 * Creates a test user profile in Firestore
 * @param {string} uid - User's Firebase UID
 * @param {object} overrides - Optional fields to override default values
 * @returns {Promise<void>}
 */
export const createTestUserProfile = async (uid, overrides = {}) => {
  try {
    // Default test profile data
    const defaultProfile = {
      name: 'Test User',
      age: 25,
      gender: 'male',
      travelDates: {
        arrival: dateToTimestamp(new Date()), // Today
        departure: dateToTimestamp(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)), // 7 days from now
      },
      bio: 'This is a test profile for development purposes.',
      profilePicture: 'https://via.placeholder.com/150',
    };

    // Merge defaults with any overrides
    const profileData = {
      ...defaultProfile,
      ...overrides,
    };

    // Save to Firestore
    await saveUserProfile(uid, profileData);
    console.log('Test profile created successfully:', profileData);
  } catch (error) {
    console.error('Error creating test profile:', error);
    showToast('Failed to create test profile', 'error');
  }
};

/**
 * Creates multiple test user profiles with varying data for testing matching algorithms
 * @param {Array<string>} uids - Array of Firebase UIDs
 * @returns {Promise<void>}
 */
export const createMultipleTestProfiles = async (uids) => {
  if (!Array.isArray(uids) || uids.length < 2) {
    showToast('At least 2 UIDs are required for test profiles', 'error');
    return;
  }

  try {
    // Create a male profile
    await createTestUserProfile(uids[0], {
      name: 'Male User',
      gender: 'male',
      travelDates: {
        arrival: dateToTimestamp(new Date()), // Today
        departure: dateToTimestamp(new Date(Date.now() + 10 * 24 * 60 * 60 * 1000)), // 10 days from now
      },
    });

    // Create a female profile with overlapping dates
    await createTestUserProfile(uids[1], {
      name: 'Female User',
      gender: 'female',
      age: 24,
      travelDates: {
        arrival: dateToTimestamp(new Date(Date.now() + 2 * 24 * 60 * 60 * 1000)), // 2 days from now
        departure: dateToTimestamp(new Date(Date.now() + 8 * 24 * 60 * 60 * 1000)), // 8 days from now
      },
      bio: 'I love traveling and meeting new people!',
    });

    // If there's a third UID, create a non-overlapping profile
    if (uids.length > 2) {
      await createTestUserProfile(uids[2], {
        name: 'Non-Overlapping User',
        gender: 'female',
        age: 28,
        travelDates: {
          arrival: dateToTimestamp(new Date(Date.now() + 15 * 24 * 60 * 60 * 1000)), // 15 days from now
          departure: dateToTimestamp(new Date(Date.now() + 20 * 24 * 60 * 60 * 1000)), // 20 days from now
        },
      });
    }

    showToast('Test profiles created successfully', 'success');
  } catch (error) {
    console.error('Error creating multiple test profiles:', error);
    showToast('Failed to create test profiles', 'error');
  }
}; 