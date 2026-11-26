// src/screens/auth/VerifyOtpScreen.jsx
// src/screens/auth/VerifyOtpScreen.jsx
import React, { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { authStyles as s } from './authStyles';

export const VerifyOtpScreen = ({ navigation, route }) => {
  useEffect(() => {
    navigation?.replace('GentleHello', {
      ...(route?.params ?? {}),
    });
  }, [navigation, route?.params]);

  return (
    <SafeAreaView style={s.safeArea}>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#7C3AED" />
      </View>
    </SafeAreaView>
  );
};

export default VerifyOtpScreen;

