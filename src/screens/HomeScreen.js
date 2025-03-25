import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AuthButton from '../components/AuthButton';

const HomeScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.contentContainer}>
        <View style={styles.headerContainer}>
          <Text style={styles.title}>Sizzlematch</Text>
          <Text style={styles.subtitle}>Find Your Travel Buddy in Mallorca</Text>
        </View>
        
        <View style={styles.imageContainer}>
          {/* Placeholder for an app logo or illustration */}
          <View style={styles.imagePlaceholder}>
            <Text style={styles.placeholderText}>🏝️</Text>
          </View>
        </View>
        
        <View style={styles.buttonContainer}>
          <AuthButton
            title="Log In"
            onPress={() => navigation.navigate('Login')}
          />
          <AuthButton
            title="Sign Up"
            onPress={() => navigation.navigate('SignUp')}
            secondary
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'space-between',
    padding: 20,
  },
  headerContainer: {
    alignItems: 'center',
    marginTop: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FF6B6B',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: '#666666',
    textAlign: 'center',
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePlaceholder: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 80,
  },
  buttonContainer: {
    width: '100%',
    marginBottom: 30,
  },
});

export default HomeScreen; 