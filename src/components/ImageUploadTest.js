import React, { useState } from 'react';
import { View, Text, Button, Image, StyleSheet, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { uploadProfilePicture, deleteProfilePicture, getStoragePathFromURL } from '../services/storage';
import { uriToBlob, validateImageSize, validateImageType } from '../utils/imageUtils';
import { auth } from '../config/firebase';
import Toast from 'react-native-toast-message';

const ImageUploadTest = () => {
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  
  // Get current user's ID for storage path
  const uid = auth.currentUser?.uid;
  
  // Request permission to access the device's photo library
  const requestPermission = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Toast.show({
        type: 'error',
        text1: 'Permission denied',
        text2: 'We need access to your photos to upload a profile picture',
      });
      return false;
    }
    return true;
  };
  
  // Pick an image from the gallery
  const pickImage = async () => {
    const hasPermission = await requestPermission();
    if (!hasPermission) return;
    
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });
      
      if (!result.canceled && result.assets && result.assets.length > 0) {
        const selectedImage = result.assets[0];
        
        // Validate image type
        if (!validateImageType(selectedImage.uri)) {
          Toast.show({
            type: 'error',
            text1: 'Invalid file type',
            text2: 'Please select a JPG, PNG, or GIF image',
          });
          return;
        }
        
        setImage(selectedImage.uri);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Toast.show({
        type: 'error',
        text1: 'Error selecting image',
        text2: error.message,
      });
    }
  };
  
  // Upload the selected image to Firebase Storage
  const handleUpload = async () => {
    if (!image) {
      Toast.show({
        type: 'error',
        text1: 'No image selected',
        text2: 'Please select an image first',
      });
      return;
    }
    
    if (!uid) {
      Toast.show({
        type: 'error',
        text1: 'User not logged in',
        text2: 'Please log in to upload an image',
      });
      return;
    }
    
    setLoading(true);
    
    try {
      // Convert URI to Blob
      const blob = await uriToBlob(image);
      
      // Validate image size
      if (!validateImageSize(blob, 2)) { // 2MB limit
        Toast.show({
          type: 'error',
          text1: 'Image too large',
          text2: 'Please select an image smaller than 2MB',
        });
        setLoading(false);
        return;
      }
      
      // Upload to Firebase Storage
      const downloadURL = await uploadProfilePicture(uid, blob);
      setImageUrl(downloadURL);
      
      Toast.show({
        type: 'success',
        text1: 'Image uploaded successfully',
        text2: 'Your profile picture has been updated',
      });
    } catch (error) {
      console.error('Upload error:', error);
      Toast.show({
        type: 'error',
        text1: 'Upload failed',
        text2: error.message,
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Delete the uploaded image
  const handleDelete = async () => {
    if (!imageUrl) {
      Toast.show({
        type: 'error',
        text1: 'No image to delete',
      });
      return;
    }
    
    setLoading(true);
    
    try {
      const path = getStoragePathFromURL(imageUrl);
      if (path) {
        await deleteProfilePicture(path);
        setImageUrl(null);
        setImage(null);
        Toast.show({
          type: 'success',
          text1: 'Image deleted successfully',
        });
      } else {
        throw new Error('Could not extract storage path from URL');
      }
    } catch (error) {
      console.error('Delete error:', error);
      Toast.show({
        type: 'error',
        text1: 'Delete failed',
        text2: error.message,
      });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Image Upload Test</Text>
      
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <>
          <View style={styles.imageContainer}>
            {imageUrl ? (
              <Image source={{ uri: imageUrl }} style={styles.image} />
            ) : image ? (
              <Image source={{ uri: image }} style={styles.image} />
            ) : (
              <View style={styles.placeholderImage}>
                <Text>No image selected</Text>
              </View>
            )}
          </View>
          
          <View style={styles.buttonContainer}>
            <Button title="Select Image" onPress={pickImage} />
            <Button 
              title="Upload Image" 
              onPress={handleUpload}
              disabled={!image || loading} 
            />
            <Button 
              title="Delete Image" 
              onPress={handleDelete}
              disabled={!imageUrl || loading} 
            />
          </View>
          
          {imageUrl && (
            <Text style={styles.urlText} numberOfLines={3} ellipsizeMode="middle">
              {imageUrl}
            </Text>
          )}
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    margin: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  imageContainer: {
    width: 200,
    height: 200,
    marginBottom: 20,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#e0e0e0',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  placeholderImage: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e0e0e0',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 20,
  },
  urlText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginTop: 10,
  },
});

export default ImageUploadTest; 