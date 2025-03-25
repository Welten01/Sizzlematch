import Toast from 'react-native-toast-message';

export const showToast = (message, type = 'info') => {
  Toast.show({
    type: type, // 'success', 'error', 'info'
    text1: message,
    position: 'bottom',
    visibilityTime: 3000,
  });
}; 