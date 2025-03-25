import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppNavigator from './src/navigation/AppNavigator';
import Toast from 'react-native-toast-message';

// Import Firebase configuration to ensure it initializes when the app starts
import './src/config/firebase';

export default function App() {
  return (
    <SafeAreaProvider>
      <AppNavigator />
      <StatusBar style="light" />
      <Toast />
    </SafeAreaProvider>
  );
}
