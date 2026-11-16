// App.js
// MindBloom Entry Point

import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppNavigator } from './src/navigation/AppNavigator';

export default function App() {
  return (
    <View style={styles.root}>
      <SafeAreaProvider>
        <StatusBar style="dark" translucent backgroundColor="transparent" />
        <AppNavigator />
      </SafeAreaProvider>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: '#FAF5EE',
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

