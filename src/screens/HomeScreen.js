import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const HomeScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Sizzlematch</Text>
      <Text style={styles.subtitle}>Connect with travelers in Mallorca</Text>
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
    color: '#FF6B6B', // Warm sunset orange
  },
  subtitle: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
  },
});

export default HomeScreen; 