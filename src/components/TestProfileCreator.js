import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { auth, isInitialized, initError } from '../config/firebase';
import { saveUserProfile, getUserProfile } from '../services/user';
import { createTestUserProfile, createMultipleTestProfiles } from '../utils/testUtils';
import { showToast } from '../utils/toast';
import { dateToTimestamp } from '../utils/dateUtils';
import * as ImagePicker from 'expo-image-picker';
import { uriToBlob } from '../utils/imageUtils';

const TestProfileCreator = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [firebaseStatus, setFirebaseStatus] = useState({ ready: false, error: null });
  const [selectedImage, setSelectedImage] = useState(null);

  // Check Firebase initialization on component mount
  useEffect(() => {
    if (isInitialized) {
      setFirebaseStatus({ ready: true, error: null });
    } else {
      setFirebaseStatus({ 
        ready: false, 
        error: initError ? `Firebase initialization error: ${initError.message}` : 'Firebase not initialized'
      });
    }
  }, []);

  // Request permission and pick an image from gallery
  const pickImage = async () => {
    try {
      // Request permission
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        showToast('Permission to access media library is required', 'error');
        return;
      }

      // Launch image picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setSelectedImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      showToast('Failed to select image', 'error');
    }
  };

  const handleCreateProfile = async () => {
    setLoading(true);
    setResult(null);
    
    // Check Firebase initialization first
    if (!firebaseStatus.ready) {
      setResult(`Error: ${firebaseStatus.error}`);
      setLoading(false);
      return;
    }
    
    try {
      const user = auth.currentUser;
      
      if (!user) {
        showToast('Please log in first', 'error');
        setResult('Error: Not logged in. Please log in first.');
        setLoading(false);
        return;
      }
      
      // Sample profile data
      const profileData = {
        name: 'Sample User',
        age: 25,
        gender: 'male',
        travelDates: {
          arrival: dateToTimestamp(new Date()),
          departure: dateToTimestamp(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)),
        },
        bio: 'This is a sample profile created for testing purposes.',
      };
      
      // If an image was selected, pass it to saveUserProfile
      if (selectedImage) {
        await saveUserProfile(user.uid, profileData, selectedImage);
      } else {
        // Use placeholder if no image selected
        profileData.profilePicture = 'https://via.placeholder.com/150';
        await saveUserProfile(user.uid, profileData);
      }
      
      setResult('Profile created successfully!');
      setSelectedImage(null); // Reset selected image after successful upload
    } catch (error) {
      console.error('Error in test profile creation:', error);
      setResult(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleGetProfile = async () => {
    setLoading(true);
    setResult(null);
    
    // Check Firebase initialization first
    if (!firebaseStatus.ready) {
      setResult(`Error: ${firebaseStatus.error}`);
      setLoading(false);
      return;
    }
    
    try {
      const user = auth.currentUser;
      
      if (!user) {
        showToast('Please log in first', 'error');
        setResult('Error: Not logged in. Please log in first.');
        setLoading(false);
        return;
      }
      
      const profile = await getUserProfile(user.uid);
      
      if (profile) {
        setResult(`Profile found: ${JSON.stringify(profile, null, 2)}`);
      } else {
        setResult('No profile found for this user.');
      }
    } catch (error) {
      console.error('Error retrieving profile:', error);
      setResult(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTestProfile = async () => {
    setLoading(true);
    setResult(null);
    
    // Check Firebase initialization first
    if (!firebaseStatus.ready) {
      setResult(`Error: ${firebaseStatus.error}`);
      setLoading(false);
      return;
    }
    
    try {
      const user = auth.currentUser;
      
      if (!user) {
        showToast('Please log in first', 'error');
        setResult('Error: Not logged in. Please log in first.');
        setLoading(false);
        return;
      }
      
      // Pass selected image if available
      if (selectedImage) {
        await createTestUserProfile(user.uid, { imageUri: selectedImage });
        setSelectedImage(null); // Reset selected image after successful upload
      } else {
        await createTestUserProfile(user.uid);
      }
      
      setResult('Test profile created successfully!');
    } catch (error) {
      console.error('Error creating test profile:', error);
      setResult(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateMultipleProfiles = async () => {
    setLoading(true);
    setResult(null);
    
    // Check Firebase initialization first
    if (!firebaseStatus.ready) {
      setResult(`Error: ${firebaseStatus.error}`);
      setLoading(false);
      return;
    }
    
    try {
      const user = auth.currentUser;
      
      if (!user) {
        showToast('Please log in first', 'error');
        setResult('Error: Not logged in. Please log in first.');
        setLoading(false);
        return;
      }
      
      const testUids = [user.uid, user.uid, user.uid];
      
      await createMultipleTestProfiles(testUids);
      setResult('Multiple test profiles created successfully!');
      showToast('Note: In a real scenario, these would be different users', 'info');
    } catch (error) {
      console.error('Error creating multiple test profiles:', error);
      setResult(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Show Firebase status message if not ready
  if (!firebaseStatus.ready) {
    return (
      <ScrollView style={styles.container}>
        <Text style={styles.title}>Firebase Initialization Error</Text>
        <Text style={styles.errorText}>{firebaseStatus.error}</Text>
        <Text style={styles.helpText}>
          This could be due to:
          {'\n'}- Invalid API key in .env file
          {'\n'}- Environment variables not loading correctly
          {'\n'}- Network issues when connecting to Firebase
        </Text>
      </ScrollView>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Test User Profile in Firestore</Text>
      
      {/* Image Selection */}
      <View style={styles.imageSection}>
        <TouchableOpacity 
          style={styles.imagePicker}
          onPress={pickImage}
          disabled={loading}
        >
          {selectedImage ? (
            <Image source={{ uri: selectedImage }} style={styles.selectedImage} />
          ) : (
            <Text style={styles.imagePickerText}>Select Profile Image</Text>
          )}
        </TouchableOpacity>
      </View>
      
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={styles.button}
          onPress={handleCreateProfile}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? 'Creating...' : 'Create Profile'}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.button}
          onPress={handleGetProfile}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? 'Loading...' : 'Get Profile'}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.button}
          onPress={handleCreateTestProfile}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? 'Creating...' : 'Create Test Profile'}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.button}
          onPress={handleCreateMultipleProfiles}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? 'Creating...' : 'Create Multiple Profiles'}
          </Text>
        </TouchableOpacity>
      </View>
      
      {result && (
        <View style={styles.resultContainer}>
          <Text style={styles.resultTitle}>Result:</Text>
          <Text style={styles.resultText}>{result}</Text>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  imageSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  imagePicker: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#ccc',
  },
  imagePickerText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    padding: 10,
  },
  selectedImage: {
    width: '100%',
    height: '100%',
  },
  buttonContainer: {
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#2196F3',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 5,
    marginVertical: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  resultContainer: {
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 5,
    marginTop: 10,
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  resultText: {
    fontSize: 14,
    fontFamily: 'monospace',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  helpText: {
    fontSize: 14,
    lineHeight: 22,
    color: '#666',
    marginTop: 20,
  },
});

export default TestProfileCreator; 