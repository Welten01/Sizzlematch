import { Toast } from 'expo-toast';

export const showToast = (message, type = 'default') => {
  let style = {};
  
  switch (type) {
    case 'success':
      style = { backgroundColor: '#4CAF50' };
      break;
    case 'error':
      style = { backgroundColor: '#F44336' };
      break;
    case 'warning':
      style = { backgroundColor: '#FFC107' };
      break;
    default:
      style = { backgroundColor: '#333' };
  }
  
  Toast.show({
    text: message,
    duration: 3000,
    style,
  });
}; 