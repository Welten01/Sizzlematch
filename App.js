import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { View, Text, StyleSheet } from 'react-native';
import AppNavigator from './src/navigation/AppNavigator';
import Toast from 'react-native-toast-message';

// Import Firebase configuration and initialization status
import { isInitialized, initError } from './src/config/firebase';

export default function App() {
  const [firebaseReady, setFirebaseReady] = useState(false);
  const [firebaseError, setFirebaseError] = useState(null);

  // Check Firebase initialization on mount
  useEffect(() => {
    if (isInitialized) {
      console.log('Firebase initialized successfully in App.js');
      setFirebaseReady(true);
    } else {
      console.error('Firebase initialization failed:', initError);
      setFirebaseError(initError ? initError.message : 'Unknown error');
    }
  }, []);

  // If Firebase failed to initialize, show error message
  if (!firebaseReady && firebaseError) {
    return (
      <SafeAreaProvider>
        <View style={styles.errorContainer}>
          <Text style={styles.errorTitle}>Firebase Initialization Error</Text>
          <Text style={styles.errorMessage}>{firebaseError}</Text>
          <Text style={styles.errorHelp}>
            This could be due to:
            {'\n'}- Invalid Firebase API key
            {'\n'}- Network connectivity issues
            {'\n'}- Environment variables not loading correctly
            {'\n\n'}Please check your configuration and try again.
          </Text>
        </View>
        <StatusBar style="dark" />
        <Toast />
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <AppNavigator />
      <StatusBar style="light" />
      <Toast />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'red',
    marginBottom: 20,
  },
  errorMessage: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  errorHelp: {
    fontSize: 14,
    lineHeight: 24,
    textAlign: 'center',
    color: '#666',
  },
});
