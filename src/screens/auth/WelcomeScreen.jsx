// src/screens/auth/WelcomeScreen.jsx
// Exact implementation of Figma "Mindbloom · Sign up or sign in" screen
// Serves as the warm welcome landing right after the splash screen

import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Animated,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../../theme/colors';
import { useResponsiveLayout } from '../../hooks/useResponsiveLayout';

export const WelcomeScreen = ({ navigation }) => {
  const { isDesktop, isTablet } = useResponsiveLayout();
  const isWide = isDesktop || isTablet;

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const floatAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: Platform.OS !== 'web',
    }).start();

    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: -5,
          duration: 2500,
          useNativeDriver: Platform.OS !== 'web',
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 2500,
          useNativeDriver: Platform.OS !== 'web',
        }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, []);

  const handleSupportPress = () => {
    Alert.alert(
      'Urgent Support',
      'If you need immediate help, reach out to the Kenya Red Cross Hotline at 1199 or Befrienders Kenya at +254 722 178 177. You are not alone.',
      [{ text: 'Understood', style: 'default' }]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Animated.View style={[{ flex: 1 }, { opacity: fadeAnim }]}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[styles.scrollContainer, isWide && styles.scrollContainerWide]}
        >
          <View style={[styles.pageWrapper, isWide && styles.pageWrapperWide]}>
            {/* ── Top Bar ────────────────────────────────────────── */}
            <View style={styles.topBar}>
              <Text style={styles.brandTitle}>mindbloom</Text>
              <Text style={styles.topTagline}>Your space. Your pace.</Text>
            </View>

            {/* ── Main 2-Column Content ───────────────────────────── */}
            <View style={[styles.mainLayout, isWide && styles.mainLayoutWide]}>
              {/* ── Left Column: Floral Arch & Thought Bubbles ─────── */}
              <View style={[styles.leftColumn, isWide && styles.leftColumnWide]}>
                <Text style={styles.leftHeading}>
                  {'A softer place\nto land.'}
                </Text>

                <Animated.View
                  style={[
                    styles.archWrapper,
                    { transform: [{ translateY: floatAnim }] },
                  ]}
                >
                  {/* Floating Pill: "Come as you are." */}
                  <View style={styles.chipTop}>
                    <Text style={styles.chipTopText}>Come as you are.</Text>
                  </View>

                  {/* Arched Matting & Hero Image */}
                  <View style={styles.archMattingFrame}>
                    <Image
                      source={require('../../../assets/images/splashscreen.jpg')}
                      style={styles.heroImage}
                      resizeMode="cover"
                    />
                  </View>

                  {/* Floating Quote Bubble: "You don't have to bloom all at once." */}
                  <View style={styles.speechBubbleLeft}>
                    <Text style={styles.speechBubbleText}>
                      "You don't have to bloom all at once."
                    </Text>
                  </View>
                </Animated.View>

                <Text style={styles.archCaption}>
                  A little kinder to your mind. Every day.
                </Text>

                <Text style={styles.privateDisclaimer}>
                  * 100% private space. Rooted in real mental wellbeing.
                </Text>
              </View>

              {/* ── Right Column: Lavender Action Card ────────────── */}
              <View style={[styles.rightColumn, isWide && styles.rightColumnWide]}>
                <View style={styles.lavenderCard}>
                  <Text style={styles.cardTag}>A LITTLE ROOM TO GROW</Text>
                  <Text style={styles.cardTitle}>Let's make space for you.</Text>
                  <Text style={styles.cardSubhead}>
                    Your space for mental wellbeing. Check in with your feelings and build habits that feel like you.
                  </Text>

                  {/* Action Buttons */}
                  <View style={styles.btnGroup}>
                    <TouchableOpacity
                      style={styles.primaryBtn}
                      onPress={() => navigation?.navigate('Signup')}
                      activeOpacity={0.88}
                    >
                      <Text style={styles.primaryBtnText}>Create an account</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.secondaryBtn}
                      onPress={() => navigation?.navigate('Login')}
                      activeOpacity={0.88}
                    >
                      <Text style={styles.secondaryBtnText}>Sign in</Text>
                    </TouchableOpacity>
                  </View>

                  <Text style={styles.paceNote}>
                    Start small. Go at your own pace.
                  </Text>

                  <View style={styles.cardFooter}>
                    <Text style={styles.legalText}>
                      Terms of Service · Privacy Policy
                    </Text>
                  </View>
                </View>

                {/* Need Urgent Support Link */}
                <TouchableOpacity
                  onPress={handleSupportPress}
                  style={styles.urgentLinkWrap}
                  activeOpacity={0.7}
                >
                  <Text style={styles.urgentLink}>Need urgent support?</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </Animated.View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.splashBg,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingVertical: 16,
    justifyContent: 'center',
  },
  scrollContainerWide: {
    paddingHorizontal: 48,
    paddingVertical: 24,
  },
  pageWrapper: {
    width: '100%',
    maxWidth: 1060,
    alignSelf: 'center',
  },
  pageWrapperWide: {
    paddingVertical: 8,
  },

  // Top Bar
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
    paddingHorizontal: 4,
  },
  brandTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: colors.brand,
    letterSpacing: -0.6,
  },
  topTagline: {
    fontSize: 12,
    fontStyle: 'italic',
    color: colors.textMuted,
    letterSpacing: 0.2,
  },

  // 2-Column Layout
  mainLayout: {
    flexDirection: 'column',
    gap: 28,
  },
  mainLayoutWide: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 48,
  },

  // Left Column
  leftColumn: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  leftColumnWide: {
    flex: 1,
    maxWidth: 480,
    alignItems: 'flex-start',
  },
  leftHeading: {
    fontSize: 32,
    fontWeight: '800',
    color: colors.textPrimary,
    lineHeight: 38,
    letterSpacing: -0.5,
    marginBottom: 20,
    textAlign: 'center',
    alignSelf: 'center',
  },
  archWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginVertical: 12,
    alignSelf: 'center',
  },
  chipTop: {
    position: 'absolute',
    top: -12,
    right: -10,
    zIndex: 10,
    backgroundColor: '#F3EFFD',
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: '#DFD5F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  chipTopText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  archMattingFrame: {
    width: 220,
    height: 290,
    borderRadius: 110,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    backgroundColor: colors.archMatting,
    borderWidth: 2,
    borderColor: colors.archBorder,
    padding: 6,
    overflow: 'hidden',
    shadowColor: '#492542',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 4,
  },
  heroImage: {
    width: '100%',
    height: '100%',
    borderRadius: 104,
    borderBottomLeftRadius: 26,
    borderBottomRightRadius: 26,
  },
  speechBubbleLeft: {
    position: 'absolute',
    bottom: 24,
    left: -40,
    zIndex: 10,
    backgroundColor: colors.white,
    borderRadius: 16,
    paddingVertical: 10,
    paddingHorizontal: 14,
    maxWidth: 160,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.06)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  speechBubbleText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textPrimary,
    lineHeight: 15,
  },
  archCaption: {
    fontSize: 11.5,
    fontStyle: 'italic',
    color: colors.textMuted,
    marginTop: 12,
    alignSelf: 'center',
  },
  privateDisclaimer: {
    fontSize: 10,
    color: colors.textMuted,
    marginTop: 20,
    alignSelf: 'center',
    opacity: 0.8,
  },

  // Right Column & Lavender Card
  rightColumn: {
    width: '100%',
  },
  rightColumnWide: {
    flex: 1,
    maxWidth: 460,
  },
  lavenderCard: {
    backgroundColor: colors.lavenderSheet,
    borderRadius: 28,
    paddingVertical: 36,
    paddingHorizontal: 28,
    borderWidth: 1,
    borderColor: colors.lavenderSheetBorder,
    shadowColor: '#492542',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.06,
    shadowRadius: 16,
    elevation: 2,
  },
  cardTag: {
    fontSize: 9.5,
    fontWeight: '800',
    color: colors.textSecondary,
    letterSpacing: 0.8,
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.textPrimary,
    lineHeight: 34,
    letterSpacing: -0.4,
    marginBottom: 10,
  },
  cardSubhead: {
    fontSize: 13.5,
    color: colors.textSecondary,
    lineHeight: 20,
    marginBottom: 24,
  },
  btnGroup: {
    gap: 12,
    marginBottom: 14,
  },
  primaryBtn: {
    backgroundColor: colors.brand,
    borderRadius: 18,
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.brand,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.22,
    shadowRadius: 10,
    elevation: 3,
  },
  primaryBtnText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 0.2,
  },
  secondaryBtn: {
    backgroundColor: colors.white,
    borderRadius: 18,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.08)',
  },
  secondaryBtnText: {
    color: colors.textPrimary,
    fontSize: 14,
    fontWeight: '700',
  },
  paceNote: {
    fontSize: 11.5,
    color: colors.textMuted,
    textAlign: 'center',
    marginBottom: 20,
  },
  cardFooter: {
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
    paddingTop: 14,
  },
  legalText: {
    fontSize: 11,
    color: colors.textMuted,
  },
  urgentLinkWrap: {
    alignSelf: 'flex-end',
    marginTop: 12,
    paddingVertical: 4,
  },
  urgentLink: {
    fontSize: 11.5,
    color: colors.textSecondary,
    textDecorationLine: 'underline',
  },
});
