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
import { AuthService } from '../../core/api/authService';
import { useI18n } from '../../services/i18n';

export const LoginScreen = ({ navigation }) => {
  const { isTablet, isDesktop } = useResponsiveLayout();
  const isWide = isDesktop || isTablet;
  const { language, setLanguage, countryData, t } = useI18n();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

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
      t('need_support'),
      t('urgent_support_alert'),
      [{ text: t('understood'), style: 'default' }]
    );
  };

  const validateLogin = (idVal, passVal) => {
    const errs = {};
    const id = (idVal !== undefined ? idVal : identifier).trim();
    const p = passVal !== undefined ? passVal : password;

    if (!id) {
      errs.identifier = 'Please enter your email, phone or nickname.';
    } else if (id.includes('@')) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(id)) {
        errs.identifier = 'Please enter a valid email address.';
      }
    } else if (id.length < 2) {
      errs.identifier = 'Nickname or username must be at least 2 characters.';
    }

    if (!p) {
      errs.password = 'Please enter your password.';
    } else if (p.length < 6) {
      errs.password = 'Password must be at least 6 characters.';
    }

    return errs;
  };

  const handleLogin = async () => {
    setSubmitted(true);
    const errs = validateLogin();
    setErrors(errs);

    if (Object.keys(errs).length > 0) return;

    setLoading(true);
    try {
      await AuthService.login({ identifier: identifier.trim(), password });
      // Success — go home
      if (navigation) {
        if (typeof navigation.replace === 'function') {
          navigation.replace('Home');
        } else {
          navigation.navigate('Home');
        }
      }
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message || 'Sign-in failed. Please try again.';
      // Friendly error messages
      if (msg.toLowerCase().includes('invalid') || msg.toLowerCase().includes('incorrect') || msg.toLowerCase().includes('not found')) {
        setErrors({ general: 'Hmm, those details don\'t match. Double-check and try again.' });
      } else if (msg.toLowerCase().includes('network') || msg.toLowerCase().includes('econnrefused')) {
        setErrors({ general: 'No connection right now. Check your internet and try again.' });
      } else {
        setErrors({ general: msg });
      }
    } finally {
      setLoading(false);
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

          {/* -- HEADER ----------------------------------- */}
          <View style={s.topHeader}>
            <Text style={s.brandTitle}>mindbloom</Text>
            <View style={s.headerRightLinks}>
              <TouchableOpacity
                onPress={() => {
                  const nextLang = language === 'en' ? 'sw' : language === 'sw' ? 'sheng' : 'en';
                  setLanguage(nextLang);
                }}
                style={s.langBtn}
                activeOpacity={0.7}
              >
                <Text style={s.langText}>
                  <Text style={language === 'en' ? s.langActive : s.langInactive}>EN</Text>
                  {' | '}
                  <Text style={language === 'sw' ? s.langActive : s.langInactive}>SW</Text>
                  {' | '}
                  <Text style={language === 'sheng' ? s.langActive : s.langInactive}>SH</Text>
                </Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleUrgentSupport} activeOpacity={0.7}>
                <Text style={s.urgentLink}>{t('need_support')}</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* -- MAIN CONTENT ----------------------------- */}
          <View style={[s.mainLayout, isWide && s.mainLayoutWide]}>

            {/* -- LEFT: COMPANION HERO CARD --------------- */}
            <View style={[s.companionCard, isWide && s.companionCardWide]}>
              <Text style={s.tagText}>{t('welcome_back')}</Text>

              <Text style={s.heroHeading}>
                {t('hero_heading')}
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
                  {t('sloth_quote')}
                </Text>
                <Text style={s.speechAuthor}>{t('companion_sub')}</Text>
              </View>
            </View>

            {/* -- RIGHT: LOGIN FORM ----------------------- */}
            <View style={[s.formContainer, isWide && s.formContainerWide]}>
              <Text style={s.formTitle}>{t('good_to_see_you')}</Text>
              <Text style={s.formSubhead}>{t('pick_up_where')}</Text>

              {/* Segmented tab switcher */}
              <View style={s.segmentedTabsContainer}>
                <TouchableOpacity
                  style={s.tabButton}
                  onPress={goToSignup}
                  activeOpacity={0.85}
                >
                  <Text style={[s.tabText, s.tabTextInactive]}>{t('create_account')}</Text>
                </TouchableOpacity>
                <View style={[s.tabButton, s.tabButtonActive]}>
                  <Text style={[s.tabText, s.tabTextActive]}>{t('sign_in')}</Text>
                </View>
              </View>

              {/* General error banner */}
              {errors.general ? (
                <View style={s.errorBanner}>
                  <Text style={s.errorBannerText}>{errors.general}</Text>
                </View>
              ) : null}

              {/* Fields */}
              <View style={s.fieldsBlock}>

                <View style={s.fieldGroup}>
                  <Text style={s.fieldLabel}>{t('email_or_nickname')}</Text>
                  <TextInput
                    underlineColorAndroid="transparent"
                    style={[s.textInput, (submitted && errors.identifier) && s.inputError]}
                    value={identifier}
                    onChangeText={(text) => {
                      setIdentifier(text);
                      if (submitted) {
                        setErrors(validateLogin(text, undefined));
                      }
                    }}
                    placeholder="wanjiku@email.com or nickname"
                    placeholderTextColor="#76648E"
                    autoCapitalize="none"
                    autoCorrect={false}
                    keyboardType="email-address"
                    editable={!loading}
                  />
                  {submitted && errors.identifier ? (
                    <Text style={s.errorText}>{errors.identifier}</Text>
                  ) : null}
                </View>

                <View style={s.fieldGroup}>
                  <Text style={s.fieldLabel}>{t('password')}</Text>
                  <View style={[s.passwordInputWrapper, (submitted && errors.password) && s.inputError]}>
                    <TextInput
                      underlineColorAndroid="transparent"
                      style={s.passwordInput}
                      value={password}
                      onChangeText={(text) => {
                        setPassword(text);
                        if (submitted) {
                          setErrors(validateLogin(undefined, text));
                        }
                      }}
                      placeholder="············"
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
                  ) : null}
                  <TouchableOpacity
                    onPress={handleForgotPassword}
                    style={s.forgotBtn}
                  >
                    <Text style={s.forgotBtnText}>{t('forgot_password')}</Text>
                  </TouchableOpacity>
                </View>

                <TouchableOpacity
                  style={[s.primaryBtn, loading && { opacity: 0.7 }]}
                  onPress={handleLogin}
                  activeOpacity={0.88}
                  disabled={loading}
                >
                  {loading ? (
                    <ActivityIndicator color="#fff" size="small" />
                  ) : (
                    <Text style={s.primaryBtnText}>{t('come_on_in')}</Text>
                  )}
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={goToSignup}
                  style={s.switchLinkWrapper}
                >
                  <Text style={s.switchLinkText}>
                    {t('new_here')}{' '}
                    <Text style={s.switchLinkBold}>{t('create_your_space')}</Text>
                  </Text>
                </TouchableOpacity>

              </View>

              <View style={s.footerBrandRow}>
                <Text style={s.footerBrandText}>
                  {t('your_space_pace')}
                </Text>
              </View>
            </View>

          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
