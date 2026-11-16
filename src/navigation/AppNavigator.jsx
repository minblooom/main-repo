// src/navigation/AppNavigator.jsx
// Root navigation stack for MindBloom

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Auth & Welcome
import { SplashScreen }          from '../screens/auth/SplashScreen';
import { WelcomeScreen }         from '../screens/auth/WelcomeScreen';
import { SignupScreen }          from '../screens/auth/SignupScreen';
import { LoginScreen }           from '../screens/auth/LoginScreen';

// Onboarding (steps 1–7)
import { GentleHelloScreen }     from '../screens/onboarding/GentleHelloScreen';
import { LocalSetupScreen }      from '../screens/onboarding/LocalSetupScreen';
import { CompanionSelectScreen } from '../screens/onboarding/CompanionSelectScreen';
import { AgeSelectScreen }       from '../screens/onboarding/AgeSelectScreen';
import { FocusAreasScreen }      from '../screens/onboarding/FocusAreasScreen';
import { RhythmSelectScreen }    from '../screens/onboarding/RhythmSelectScreen';
import { ReadyToBloomScreen }    from '../screens/onboarding/ReadyToBloomScreen';

// Main App
import { HomeScreen }            from '../screens/home/HomeScreen';

const Stack = createNativeStackNavigator();

export const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Splash"
        screenOptions={{
          headerShown: false,
          animation: 'fade',
        }}
      >
        {/* ── Landing & Auth ────────────────────────── */}
        <Stack.Screen name="Splash"          component={SplashScreen} />
        <Stack.Screen name="Welcome"         component={WelcomeScreen} />
        <Stack.Screen name="Signup"          component={SignupScreen} />
        <Stack.Screen name="Login"           component={LoginScreen} />

        {/* ── Onboarding ────────────────────────────── */}
        <Stack.Screen name="GentleHello"     component={GentleHelloScreen} />
        <Stack.Screen name="LocalSetup"      component={LocalSetupScreen} />
        <Stack.Screen name="CompanionSelect" component={CompanionSelectScreen} />
        <Stack.Screen name="AgeSelect"       component={AgeSelectScreen} />
        <Stack.Screen name="FocusAreas"      component={FocusAreasScreen} />
        <Stack.Screen name="RhythmSelect"    component={RhythmSelectScreen} />
        <Stack.Screen name="ReadyToBloom"    component={ReadyToBloomScreen} />

        {/* ── Main Sanctuary ────────────────────────── */}
        <Stack.Screen name="Home"            component={HomeScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
