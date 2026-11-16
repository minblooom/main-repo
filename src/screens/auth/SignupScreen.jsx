// src/screens/auth/SignupScreen.jsx
// "Create your space" — sign-up form screen
// Figma: "01 – Create your space" (Desktop + Mobile)

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

export const SignupScreen = ({ navigation }) => {
  const { isMobile, isTablet, isDesktop } = useResponsiveLayout();
  const isWide = isDesktop || isTablet;

  const [language, setLanguage] = useState('EN');
  const [nickname, setNickname] = useState('');
  const [contact, setContact] = useState('');
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

  const handleCreateSpace = () => {
    const name = nickname.trim() || 'Amani';
    // Navigate to companion selection onboarding
    if (navigation) {
      navigation.navigate('GentleHello');
    } else {
      Alert.alert('Space Created', `Karibu sana, ${name}! Your peaceful sanctuary is ready.`);
    }
  };

  const goToLogin = () => {
    if (navigation) {
      navigation.navigate('Login');
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
              <Text style={s.tagText}>KARIBU RAFIKI · HELLO, FRIEND</Text>

              <Text style={s.heroHeading}>
                {'Your mind.\nYour pace.\nYour kind of bloom.'}
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
                  "You don't have to have it all figured out."
                </Text>
                <Text style={s.speechAuthor}>Pole · your little pocket of courage</Text>
              </View>
            </View>

            {/* ── RIGHT: SIGNUP FORM ────────────────────── */}
            <View style={[s.formContainer, isWide && s.formContainerWide]}>
              <Text style={s.formTitle}>Let's make this space yours.</Text>
              <Text style={s.formSubhead}>
                A nickname is enough. Being yourself is plenty.
              </Text>

              {/* Segmented tab switcher */}
              <View style={s.segmentedTabsContainer}>
                <View style={[s.tabButton, s.tabButtonActive]}>
                  <Text style={[s.tabText, s.tabTextActive]}>Create account</Text>
                </View>
                <TouchableOpacity
                  style={s.tabButton}
                  onPress={goToLogin}
                  activeOpacity={0.85}
                >
                  <Text style={[s.tabText, s.tabTextInactive]}>Sign in</Text>
                </TouchableOpacity>
              </View>

              {/* Fields */}
              <View style={s.fieldsBlock}>

                <View style={s.fieldGroup}>
                  <Text style={s.fieldLabel}>What should we call you?</Text>
                  <TextInput
                    style={s.textInput}
                    value={nickname}
                    onChangeText={setNickname}
                    placeholder="e.g. Wanjiku or Amani"
                    placeholderTextColor="#76648E"
                    autoCorrect={false}
                  />
                </View>

                <View style={s.fieldGroup}>
                  <Text style={s.fieldLabel}>Email or phone · optional for now</Text>
                  <TextInput
                    style={s.textInput}
                    value={contact}
                    onChangeText={setContact}
                    placeholder="For saving and recovering your space"
                    placeholderTextColor="#76648E"
                    autoCapitalize="none"
                    keyboardType="email-address"
                    autoCorrect={false}
                  />
                </View>

                <View style={s.fieldGroup}>
                  <Text style={s.fieldLabel}>Create a password</Text>
                  <View style={s.passwordInputWrapper}>
                    <TextInput
                      style={s.passwordInput}
                      value={password}
                      onChangeText={setPassword}
                      placeholder="At least 12 characters"
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
                  <Text style={s.helperText}>You can add/edit details later in Settings.</Text>
                </View>

                <TouchableOpacity
                  style={s.primaryBtn}
                  onPress={handleCreateSpace}
                  activeOpacity={0.88}
                >
                  <Text style={s.primaryBtnText}>Create my space ➔</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={goToLogin}
                  style={s.switchLinkWrapper}
                >
                  <Text style={s.switchLinkText}>
                    Already have a space?{' '}
                    <Text style={s.switchLinkBold}>Sign in</Text>
                  </Text>
                </TouchableOpacity>

                <Text style={s.termsText}>
                  You're agreeing to our privacy terms and age guidelines here.
                </Text>

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
