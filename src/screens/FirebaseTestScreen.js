import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { db } from '../config/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { showToast } from '../utils/toast';

const FirebaseTestScreen = () => {
  useEffect(() => {
    const testFirebaseConnection = async () => {
      try {
        // Try to fetch a non-existent collection to test connection
        await getDocs(collection(db, 'test_collection'));
        showToast('Firebase connected successfully!', 'success');
      } catch (error) {
        console.error('Firebase connection error:', error);
        showToast('Firebase connection error', 'error');
      }
    };

    testFirebaseConnection();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Firebase Configuration Test</Text>
      <Text style={styles.subtitle}>Check console logs for config info</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#FF6B6B',
  },
  subtitle: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
  },
});

export default FirebaseTestScreen; 