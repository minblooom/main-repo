// src/screens/auth/LoginScreen.jsx
// "Welcome back" — sign-in form screen
// Figma: "02 – Welcome back" (Desktop + Mobile)

import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  Animated,
  Alert,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { authStyles as s } from './authStyles';
import { useResponsiveLayout } from '../../hooks/useResponsiveLayout';

export const LoginScreen = ({ navigation }) => {
  const { isTablet, isDesktop } = useResponsiveLayout();
  const isWide = isDesktop || isTablet;

  const [language, setLanguage] = useState('EN');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Gentle float animation for the sloth mascot
  const floatAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: -6,
          duration: 2400,
          useNativeDriver: Platform.OS !== 'web',
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 2400,
          useNativeDriver: Platform.OS !== 'web',
        }),
      ])
    ).start();
  }, []);

  const handleUrgentSupport = () => {
    Alert.alert(
      'Urgent Support',
      'If you need immediate help, reach out to the Kenya Red Cross Hotline at 1199 or Befrienders Kenya at +254 722 178 177. You are not alone.',
      [{ text: 'Understood', style: 'default' }]
    );
  };

  const handleLogin = () => {
    const user = identifier.trim() || 'soso';
    if (navigation) {
      if (typeof navigation.replace === 'function') {
        navigation.replace('Home');
      } else {
        navigation.navigate('Home');
      }
    } else {
      Alert.alert('Welcome Back', `Good to see you, ${user}. Pick up wherever you are today.`);
    }
  };

  const handleForgotPassword = () => {
    Alert.alert('Reset Password', 'A recovery link will be sent to your registered contact.');
  };

  const goToSignup = () => {
    if (navigation) {
      navigation.navigate('Signup');
    }
  };

  return (
    <SafeAreaView style={s.safeArea}>
      <ScrollView
        contentContainerStyle={s.scrollContainer}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={[s.pageWrapper, isWide && s.pageWrapperWide]}>

          {/* ── HEADER ─────────────────────────────────── */}
          <View style={s.topHeader}>
            <Text style={s.brandTitle}>mindbloom</Text>
            <View style={s.headerRightLinks}>
              <TouchableOpacity
                onPress={() => setLanguage(language === 'EN' ? 'SW' : 'EN')}
                style={s.langBtn}
                activeOpacity={0.7}
              >
                <Text style={s.langText}>
                  <Text style={language === 'EN' ? s.langActive : s.langInactive}>EN</Text>
                  {' | '}
                  <Text style={language === 'SW' ? s.langActive : s.langInactive}>SW</Text>
                </Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleUrgentSupport} activeOpacity={0.7}>
                <Text style={s.urgentLink}>Need urgent support?</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* ── MAIN CONTENT ───────────────────────────── */}
          <View style={[s.mainLayout, isWide && s.mainLayoutWide]}>

            {/* ── LEFT: COMPANION HERO CARD ─────────────── */}
            <View style={[s.companionCard, isWide && s.companionCardWide]}>
              <Text style={s.tagText}>KARIBU TENA · WELCOME BACK</Text>

              <Text style={s.heroHeading}>
                {'Big feelings.\nSmall steps.\nStill you.'}
              </Text>

              <Animated.View
                style={[
                  s.mascotCircleWrapper,
                  { transform: [{ translateY: floatAnim }] },
                ]}
              >
                <View style={s.mascotCircle}>
                  <Image
                    source={require('../../../assets/images/sloth.jpg')}
                    style={s.mascotImage}
                    resizeMode="cover"
                  />
                </View>
                <Text style={s.sparkleTopLeft}>✦</Text>
                <Text style={s.sparkleBottomRight}>✦</Text>
              </Animated.View>

              <View style={s.speechBubbleCard}>
                <Text style={s.speechQuote}>
                  "No catching up needed. Just come as you are."
                </Text>
                <Text style={s.speechAuthor}>Pole · your quiet pocket of calm</Text>
              </View>
            </View>

            {/* ── RIGHT: LOGIN FORM ─────────────────────── */}
            <View style={[s.formContainer, isWide && s.formContainerWide]}>
              <Text style={s.formTitle}>Good to see you.</Text>
              <Text style={s.formSubhead}>Pick up wherever you are today.</Text>

              {/* Segmented tab switcher */}
              <View style={s.segmentedTabsContainer}>
                <TouchableOpacity
                  style={s.tabButton}
                  onPress={goToSignup}
                  activeOpacity={0.85}
                >
                  <Text style={[s.tabText, s.tabTextInactive]}>Create account</Text>
                </TouchableOpacity>
                <View style={[s.tabButton, s.tabButtonActive]}>
                  <Text style={[s.tabText, s.tabTextActive]}>Sign in</Text>
                </View>
              </View>

              {/* Fields */}
              <View style={s.fieldsBlock}>

                <View style={s.fieldGroup}>
                  <Text style={s.fieldLabel}>Email, phone or nickname</Text>
                  <TextInput
                    style={s.textInput}
                    value={identifier}
                    onChangeText={setIdentifier}
                    placeholder="wanjiku@email.com"
                    placeholderTextColor="#76648E"
                    autoCapitalize="none"
                    autoCorrect={false}
                    keyboardType="email-address"
                  />
                </View>

                <View style={s.fieldGroup}>
                  <Text style={s.fieldLabel}>Your password</Text>
                  <View style={s.passwordInputWrapper}>
                    <TextInput
                      style={s.passwordInput}
                      value={password}
                      onChangeText={setPassword}
                      placeholder="••••••••••••"
                      placeholderTextColor="#76648E"
                      secureTextEntry={!showPassword}
                    />
                    <TouchableOpacity
                      onPress={() => setShowPassword(!showPassword)}
                      style={s.showBtn}
                    >
                      <Text style={s.showBtnText}>{showPassword ? 'Hide' : 'Show'}</Text>
                    </TouchableOpacity>
                  </View>
                  <TouchableOpacity
                    onPress={handleForgotPassword}
                    style={s.forgotBtn}
                  >
                    <Text style={s.forgotBtnText}>Forgot password?</Text>
                  </TouchableOpacity>
                </View>

                <TouchableOpacity
                  style={s.primaryBtn}
                  onPress={handleLogin}
                  activeOpacity={0.88}
                >
                  <Text style={s.primaryBtnText}>Come on in ➔</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={goToSignup}
                  style={s.switchLinkWrapper}
                >
                  <Text style={s.switchLinkText}>
                    New here?{' '}
                    <Text style={s.switchLinkBold}>Create your space</Text>
                  </Text>
                </TouchableOpacity>

              </View>

              <View style={s.footerBrandRow}>
                <Text style={s.footerBrandText}>
                  Your space. Your pace. Your kind of brave.
                </Text>
              </View>
            </View>

          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
