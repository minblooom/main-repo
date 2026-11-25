// App.js
// MindBloom Entry Point

import React, { useEffect } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider, useTheme } from './src/theme/ThemeContext';
import { I18nProvider } from './src/services/i18n';
import { AppNavigator } from './src/navigation/AppNavigator';
import { registerForPushNotifications } from './src/services/notificationService';

const AppContent = () => {
  const { theme, isDark } = useTheme();

  useEffect(() => {
    // Silently register push token after the app loads — never blocks UI
    registerForPushNotifications().catch(() => {});
  }, []);

  return (
    <View style={[styles.root, { backgroundColor: theme?.bg || '#FAF6EF' }]}>
      <StatusBar style={isDark ? 'light' : 'dark'} translucent backgroundColor="transparent" />
      <AppNavigator />
    </View>
  );
};

export default function App() {
  return (
    <SafeAreaProvider style={styles.safeArea}>
      <I18nProvider>
        <ThemeProvider>
          <AppContent />
        </ThemeProvider>
      </I18nProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  root: {
    flex: 1,
    width: '100%',
    height: '100%',
    ...(Platform.OS === 'web'
      ? {
          height: '100vh',
          width: '100vw',
          overflow: 'hidden',
          margin: 0,
          padding: 0,
        }
      : {}),
  },
});
