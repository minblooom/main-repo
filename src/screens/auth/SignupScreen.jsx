// src/screens/auth/SignupScreen.jsx
// MindBloom Account Creation Screen
// Wired to AuthService.register() — creates real account then flows to onboarding

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
  ActivityIndicator,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { authStyles as s } from './authStyles';
import { useResponsiveLayout } from '../../hooks/useResponsiveLayout';
import { onboardingStorage } from '../../services/onboardingStorage';
import { LegalModal } from '../legal/LegalScreen';
import { AuthService } from '../../core/api/authService';
import { useI18n } from '../../services/i18n';

export const SignupScreen = ({ navigation }) => {
  const { isDesktop, isTablet } = useResponsiveLayout();
  const isWide = isDesktop || isTablet;
  const { language, availableLanguages, cycleLanguage } = useI18n();
  const [nickname, setNickname] = useState('');
  const [contact, setContact] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [legalModalTab, setLegalModalTab] = useState(null); // 'terms' | 'privacy' | 'disclaimer' | null

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

  const validateForm = (nameVal, contactVal, passVal, confirmPassVal) => {
    const errs = {};
    const n = (nameVal !== undefined ? nameVal : nickname).trim();
    const c = (contactVal !== undefined ? contactVal : contact).trim();
    const p = passVal !== undefined ? passVal : password;
    const cp = confirmPassVal !== undefined ? confirmPassVal : confirmPassword;

    if (!n) {
      errs.nickname = 'Please enter what we should call you.';
    } else if (n.length < 2) {
      errs.nickname = 'Nickname must be at least 2 characters.';
    }

    if (!c) {
      errs.contact = 'Please enter your email or phone number.';
    } else if (c.includes('@')) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(c)) {
        errs.contact = 'Please enter a valid email address.';
      }
    } else {
      const digits = c.replace(/\D/g, '');
      if (digits.length < 9) {
        errs.contact = 'Please enter a valid phone number (at least 9 digits).';
      }
    }

    if (!p) {
      errs.password = 'Please create a password.';
    } else if (p.length < 6) {
      errs.password = 'Password must be at least 6 characters.';
    }

    if (!cp) {
      errs.confirmPassword = 'Please confirm your password.';
    } else if (cp !== p) {
      errs.confirmPassword = 'Passwords do not match.';
    }

    return errs;
  };

  const handleCreateSpace = async () => {
    setSubmitted(true);
    const errs = validateForm();
    setErrors(errs);

    if (Object.keys(errs).length > 0) return;

    const name = nickname.trim();
    const contactVal = contact.trim();

    setLoading(true);
    try {
      await AuthService.register({
        nickname: name,
        contact: contactVal,
        password,
      });

      await onboardingStorage.savePreferences({ nickname: name, contact: contactVal });

      let devCode = '';
      try {
        const otpRes = await AuthService.sendOtp({
          contact: contactVal,
          purpose: 'VERIFY_CONTACT',
        });
        if (otpRes?.devCode) devCode = otpRes.devCode;
      } catch {
        // Non-blocking if OTP email service is temporarily unavailable
      }

      if (navigation) {
        navigation.navigate('VerifyOtp', { contact: contactVal, devCode });
      }
    } catch (backendErr) {
      const status = backendErr?.response?.status;
      const code = backendErr?.response?.data?.error?.code;
      const msg = backendErr?.response?.data?.message || '';

      if (
        status === 409 ||
        code === 'CONTACT_TAKEN' ||
        msg.toLowerCase().includes('already') ||
        msg.toLowerCase().includes('exists')
      ) {
        setErrors({
          contact: 'An account with this email or phone already exists.',
          contactTaken: true,
        });
      } else {
        setErrors({
          general: msg || 'Could not create your account right now. Please check your connection and try again.',
        });
      }
    } finally {
      setLoading(false);
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

          {/* -- HEADER (matches LoginScreen exactly) ----- */}
          <View style={s.topHeader}>
            <Text style={s.brandTitle}>mindbloom</Text>
            <View style={s.headerRightLinks}>
              <TouchableOpacity onPress={handleUrgentSupport} activeOpacity={0.7}>
                <Text style={s.urgentLink}>Need urgent support?</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* -- MAIN CONTENT ----------------------------- */}
          <View style={[s.mainLayout, isWide && s.mainLayoutWide]}>

            {/* -- LEFT: COMPANION HERO CARD --------------- */}
            <View style={[s.companionCard, isWide && s.companionCardWide]}>
              <Text style={s.tagText}>KARIBU · WELCOME</Text>

              <Text style={s.heroHeading}>
                {'Your space.\nYour pace.\nYour bloom.'}
              </Text>

              <Animated.View
                style={[
                  s.mascotCircleWrapper,
                  { transform: [{ translateY: floatAnim }] },
                ]}
              >
                <View style={s.mascotCircle}>
                  <Image
                    source={require('../../../assets/images/sloth_cutout.png')}
                    style={s.mascotImage}
                    resizeMode="contain"
                  />
                </View>
                <Text style={s.sparkleTopLeft}>✦</Text>
                <Text style={s.sparkleBottomRight}>✦</Text>
              </Animated.View>

              <View style={s.speechBubbleCard}>
                <Text style={s.speechQuote}>
                  "Every big journey starts with one gentle step."
                </Text>
                <Text style={s.speechAuthor}>Pole · your quiet pocket of calm</Text>
              </View>
            </View>

            {/* -- RIGHT: SIGNUP FORM ---------------------- */}
            <View style={[s.formContainer, isWide && s.formContainerWide]}>
              <Text style={s.formTitle}>Create your space.</Text>
              <Text style={s.formSubhead}>Free, private, and entirely yours.</Text>

              {/* Segmented tab switcher — matches LoginScreen layout */}
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

              {/* General error banner */}
              {errors.general ? (
                <View style={s.errorBanner}>
                  <Text style={s.errorBannerText}>{errors.general}</Text>
                </View>
              ) : null}

              {/* Fields */}
              <View style={s.fieldsBlock}>

                {/* 1. Nickname */}
                <View style={s.fieldGroup}>
                  <Text style={s.fieldLabel}>What should we call you? *</Text>
                  <TextInput
                    underlineColorAndroid="transparent"
                    style={[s.textInput, (submitted && errors.nickname) && s.inputError]}
                    value={nickname}
                    onChangeText={(text) => {
                      setNickname(text);
                      if (submitted) setErrors(validateForm(text, undefined, undefined, undefined));
                    }}
                    placeholder="e.g. Wanjiku, Kofi, Amara"
                    placeholderTextColor="#76648E"
                    autoCapitalize="words"
                    autoCorrect={false}
                    editable={!loading}
                  />
                  {submitted && errors.nickname ? (
                    <Text style={s.errorText}>{errors.nickname}</Text>
                  ) : null}
                </View>

                {/* 2. Contact */}
                <View style={s.fieldGroup}>
                  <Text style={s.fieldLabel}>Email or phone number *</Text>
                  <TextInput
                    underlineColorAndroid="transparent"
                    style={[s.textInput, (submitted && errors.contact) && s.inputError]}
                    value={contact}
                    onChangeText={(text) => {
                      setContact(text);
                      if (submitted) setErrors(validateForm(undefined, text, undefined, undefined));
                    }}
                    placeholder="wanjiku@email.com or +254 7xx xxx xxx"
                    placeholderTextColor="#76648E"
                    autoCapitalize="none"
                    autoCorrect={false}
                    keyboardType="email-address"
                    editable={!loading}
                  />
                  {submitted && errors.contact ? (
                    <View>
                      <Text style={s.errorText}>{errors.contact}</Text>
                      {errors.contactTaken && (
                        <TouchableOpacity onPress={goToLogin} style={{ marginTop: 4 }}>
                          <Text style={[s.forgotBtnText, { fontWeight: '800' }]}>
                            Sign in instead →
                          </Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  ) : (
                    <Text style={s.helperText}>We'll never share this with anyone.</Text>
                  )}
                </View>

                {/* 3. Password */}
                <View style={s.fieldGroup}>
                  <Text style={s.fieldLabel}>Create a password *</Text>
                  <View style={[s.passwordInputWrapper, (submitted && errors.password) && s.inputError]}>
                    <TextInput
                      underlineColorAndroid="transparent"
                      style={s.passwordInput}
                      value={password}
                      onChangeText={(text) => {
                        setPassword(text);
                        if (submitted) setErrors(validateForm(undefined, undefined, text, undefined));
                      }}
                      placeholder="At least 6 characters"
                      placeholderTextColor="#76648E"
                      secureTextEntry={!showPassword}
                      editable={!loading}
                    />
                    <TouchableOpacity
                      onPress={() => setShowPassword(!showPassword)}
                      style={s.showBtn}
                    >
                      <Text style={s.showBtnText}>{showPassword ? 'Hide' : 'Show'}</Text>
                    </TouchableOpacity>
                  </View>
                  {submitted && errors.password ? (
                    <Text style={s.errorText}>{errors.password}</Text>
                  ) : (
                    <Text style={s.helperText}>Must be at least 6 characters.</Text>
                  )}
                </View>

                {/* 4. Confirm Password */}
                <View style={s.fieldGroup}>
                  <Text style={s.fieldLabel}>Confirm password *</Text>
                  <View style={[s.passwordInputWrapper, (submitted && errors.confirmPassword) && s.inputError]}>
                    <TextInput
                      underlineColorAndroid="transparent"
                      style={s.passwordInput}
                      value={confirmPassword}
                      onChangeText={(text) => {
                        setConfirmPassword(text);
                        if (submitted) setErrors(validateForm(undefined, undefined, undefined, text));
                      }}
                      placeholder="Re-enter your password"
                      placeholderTextColor="#76648E"
                      secureTextEntry={!showConfirmPassword}
                      editable={!loading}
                    />
                    <TouchableOpacity
                      onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                      style={s.showBtn}
                    >
                      <Text style={s.showBtnText}>{showConfirmPassword ? 'Hide' : 'Show'}</Text>
                    </TouchableOpacity>
                  </View>
                  {submitted && errors.confirmPassword ? (
                    <Text style={s.errorText}>{errors.confirmPassword}</Text>
                  ) : null}
                </View>

                {/* Submit Button */}
                <TouchableOpacity
                  style={[s.primaryBtn, loading && { opacity: 0.7 }]}
                  onPress={handleCreateSpace}
                  activeOpacity={0.88}
                  disabled={loading}
                >
                  {loading ? (
                    <ActivityIndicator color="#fff" size="small" />
                  ) : (
                    <Text style={s.primaryBtnText}>Create my space →</Text>
                  )}
                </TouchableOpacity>

                {/* Sign-in Switch Link */}
                <TouchableOpacity
                  onPress={goToLogin}
                  style={s.switchLinkWrapper}
                >
                  <Text style={s.switchLinkText}>
                    Already have a space?{' '}
                    <Text style={s.switchLinkBold}>Sign in</Text>
                  </Text>
                </TouchableOpacity>

                {/* Terms of Service & Privacy Policy Popup Links */}
                <Text style={s.termsText}>
                  By creating a space, you agree to our{' '}
                  <Text
                    style={s.termsLink}
                    onPress={() => setLegalModalTab('terms')}
                  >
                    Terms of Service
                  </Text>
                  {', '}
                  <Text
                    style={s.termsLink}
                    onPress={() => setLegalModalTab('privacy')}
                  >
                    Privacy Policy
                  </Text>
                  {', and '}
                  <Text
                    style={s.termsLink}
                    onPress={() => setLegalModalTab('disclaimer')}
                  >
                    Mental Health Disclaimer
                  </Text>.
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

      {/* In-App Terms, Privacy & Disclaimer Modal Popup */}
      <LegalModal
        visible={!!legalModalTab}
        initialTab={legalModalTab || 'terms'}
        onClose={() => setLegalModalTab(null)}
      />
    </SafeAreaView>
  );
};
