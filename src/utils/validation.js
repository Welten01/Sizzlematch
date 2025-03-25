/**
 * Validates user profile data
 * @param {object} profileData - User profile data to validate
 * @returns {object} - Object with isValid boolean and errorMessage string if invalid
 */
export const validateUserProfile = (profileData) => {
  // Check required fields
  if (!profileData.name || profileData.name.trim() === '') {
    return { isValid: false, errorMessage: 'Name is required' };
  }

  // Validate age (18-30)
  const age = parseInt(profileData.age);
  if (isNaN(age) || age < 18 || age > 30) {
    return { isValid: false, errorMessage: 'Age must be between 18 and 30' };
  }

  // Validate gender
  if (!profileData.gender || !['male', 'female'].includes(profileData.gender)) {
    return { isValid: false, errorMessage: 'Gender must be male or female' };
  }

  // Validate travel dates
  if (!profileData.travelDates) {
    return { isValid: false, errorMessage: 'Travel dates are required' };
  }

  const { arrival, departure } = profileData.travelDates;
  
  if (!arrival || !departure) {
    return { isValid: false, errorMessage: 'Both arrival and departure dates are required' };
  }

  // Convert to Date objects if they are timestamps
  const arrivalDate = arrival instanceof Date ? arrival : arrival.toDate();
  const departureDate = departure instanceof Date ? departure : departure.toDate();

  // Ensure arrival is before departure
  if (arrivalDate >= departureDate) {
    return { isValid: false, errorMessage: 'Arrival date must be before departure date' };
  }

  // Validate profile picture URL if provided
  if (profileData.profilePicture && typeof profileData.profilePicture !== 'string') {
    return { isValid: false, errorMessage: 'Profile picture must be a valid URL string' };
  }

  // If all validations pass
  return { isValid: true };
}; 