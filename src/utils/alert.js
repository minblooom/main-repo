// src/utils/alert.js
// Cross-platform alert helper so alerts also work reliably on React Native Web

import { Alert, Platform } from 'react-native';

export function showAlert(title, message) {
  if (Platform.OS === 'web' && typeof window !== 'undefined' && typeof window.alert === 'function') {
    window.alert(message ? `${title}\n\n${message}` : title);
    return;
  }
  Alert.alert(title, message, [{ text: 'Understood', style: 'default' }]);
}
