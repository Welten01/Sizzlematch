import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AuthButton from '../components/AuthButton';
import { logout } from '../services/auth';
import { showToast } from '../utils/toast';
import TestProfileCreator from '../components/TestProfileCreator';
import ImageUploadTest from '../components/ImageUploadTest';

const DashboardScreen = () => {
  const handleLogout = async () => {
    try {
      await logout();
      showToast('Successfully logged out', 'success');
    } catch (error) {
      console.log('Logout error:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          <Text style={styles.title}>Welcome to Sizzlematch!</Text>
          <Text style={styles.subtitle}>
            You're logged in. This is a placeholder dashboard for authenticated users.
          </Text>
          
          {/* User Profile Testing Section */}
          <TestProfileCreator />
          
          {/* Image Upload Testing Section */}
          <ImageUploadTest />
          
          <View style={styles.buttonContainer}>
            <AuthButton
              title="Log Out"
              onPress={handleLogout}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 20,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666666',
    marginBottom: 30,
    textAlign: 'center',
  },
  buttonContainer: {
    width: '100%',
    paddingHorizontal: 20,
    marginTop: 20,
  },
});

export default DashboardScreen; 