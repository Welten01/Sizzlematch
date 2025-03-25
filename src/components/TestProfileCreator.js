import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { auth, isInitialized, initError } from '../config/firebase';
import { saveUserProfile, getUserProfile } from '../services/user';
import { createTestUserProfile, createMultipleTestProfiles } from '../utils/testUtils';
import { showToast } from '../utils/toast';
import { dateToTimestamp } from '../utils/dateUtils';

const TestProfileCreator = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [firebaseStatus, setFirebaseStatus] = useState({ ready: false, error: null });

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
        profilePicture: 'https://via.placeholder.com/150',
      };
      
      await saveUserProfile(user.uid, profileData);
      setResult('Profile created successfully!');
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
      
      await createTestUserProfile(user.uid);
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