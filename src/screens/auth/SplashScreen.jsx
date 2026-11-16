// src/screens/auth/SplashScreen.jsx
// Exact implementation of the Figma splash screen for MindBloom
// Responsive across Mobile, Tablet, and Desktop screens

import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Animated,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../../theme/colors';
import { useResponsiveLayout } from '../../hooks/useResponsiveLayout';

export const SplashScreen = ({ onFinish, navigation }) => {
  const { width, height, isMobile, isTablet, isDesktop, containerMaxWidth } = useResponsiveLayout();

  // Floating gentle breath animation for the hero arch
  const floatAnim = useRef(new Animated.Value(0)).current;
  const pulseScale = useRef(new Animated.Value(1)).current;

  // Progress bar fill animation
  const progressAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Fade in whole view
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: Platform.OS !== 'web',
    }).start();

    // Gentle breathing loop
    Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(floatAnim, {
            toValue: -6,
            duration: 2500,
            useNativeDriver: Platform.OS !== 'web',
          }),
          Animated.timing(pulseScale, {
            toValue: 1.018,
            duration: 2500,
            useNativeDriver: Platform.OS !== 'web',
          }),
        ]),
        Animated.parallel([
          Animated.timing(floatAnim, {
            toValue: 0,
            duration: 2500,
            useNativeDriver: Platform.OS !== 'web',
          }),
          Animated.timing(pulseScale, {
            toValue: 1.0,
            duration: 2500,
            useNativeDriver: Platform.OS !== 'web',
          }),
        ]),
      ])
    ).start();

    // Progress bar fill to 100%
    Animated.timing(progressAnim, {
      toValue: 1,
      duration: 2800,
      useNativeDriver: false,
    }).start(({ finished }) => {
      if (finished) {
        handleProceed();
      }
    });
  }, []);

  const handleProceed = () => {
    if (onFinish) {
      onFinish();
    } else if (navigation) {
      navigation.navigate('Onboarding');
    }
  };

  // Responsive dimensions for the hero arch
  const archWidth = Math.min(containerMaxWidth * 0.72, 280);
  const archHeight = Math.min(height * 0.44, 380);

  const progressInterpolate = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      <Animated.View style={[styles.mainWrapper, { opacity: fadeAnim }]}>
        <View style={[styles.responsiveContainer, { maxWidth: containerMaxWidth }]}>

          {/* ── 1. TOP CREAM SECTION ────────────────────────────────────────── */}
          <View style={styles.topSection}>
            {/* Mindbloom Brand Wordmark */}
            <View style={styles.brandContainer}>
              <Text style={styles.brandTitle}>mindbloom</Text>
            </View>

            {/* Arched Hero Card with Floral Silhouette */}
            <Animated.View
              style={[
                styles.heroArchWrapper,
                {
                  transform: [
                    { translateY: floatAnim },
                    { scale: pulseScale },
                  ],
                },
              ]}
            >
              {/* Outer Decorative Floating Dots (From Figma Design) */}
              <View style={[styles.dot, styles.dotUpperLeft]} />
              <View style={[styles.dot, styles.dotUpperRight]} />
              <View style={[styles.dot, styles.dotLowerRight]} />
              <View style={[styles.dot, styles.dotLowerLeft]} />

              {/* Matting Frame */}
              <View
                style={[
                  styles.archMattingFrame,
                  {
                    width: archWidth,
                    height: archHeight,
                  },
                ]}
              >
                {/* Hero Floral Image */}
                <Image
                  source={require('../../../assets/images/splashscreen.jpg')}
                  style={styles.heroImage}
                  resizeMode="cover"
                />
              </View>
            </Animated.View>
          </View>

          {/* ── 2. BOTTOM SOFT LAVENDER SHEET ──────────────────────────────── */}
          <TouchableOpacity
            style={styles.bottomSheet}
            onPress={handleProceed}
            activeOpacity={0.96}
          >
            {/* Primary Headline */}
            <Text style={styles.headline}>
              A little habit.{'\n'}A more confident you.
            </Text>

            {/* Subheading */}
            <Text style={styles.subhead}>
              Build confidence and healthy mental habits,{'\n'}one small step at a time.
            </Text>

            {/* Status Text */}
            <Text style={styles.statusLabel}>
              Getting ready to bloom...
            </Text>

            {/* Animated Progress Bar */}
            <View style={styles.progressTrack}>
              <Animated.View
                style={[
                  styles.progressFill,
                  {
                    width: progressInterpolate,
                  },
                ]}
              />
            </View>
          </TouchableOpacity>

        </View>
      </Animated.View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.splashBg,
  },
  mainWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  responsiveContainer: {
    flex: 1,
    width: '100%',
    backgroundColor: colors.splashBg,
    justifyContent: 'space-between',
    alignSelf: 'center',
    // Soft shadow on desktop centered canvas
    ...Platform.select({
      web: {
        boxShadow: '0 8px 32px rgba(46, 30, 70, 0.08)',
      },
      default: {},
    }),
  },

  // Top Section
  topSection: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: Platform.OS === 'android' ? 16 : 8,
    paddingHorizontal: 20,
  },
  brandContainer: {
    alignItems: 'center',
    marginBottom: 18,
    marginTop: 6,
  },
  brandTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.brand,
    letterSpacing: -0.6,
  },

  // Hero Arch
  heroArchWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginVertical: 10,
  },
  archMattingFrame: {
    borderRadius: 140,
    borderBottomLeftRadius: 36,
    borderBottomRightRadius: 36,
    backgroundColor: colors.archMatting,
    borderWidth: 2,
    borderColor: colors.archBorder,
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    shadowColor: '#492542',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 6,
  },
  heroImage: {
    width: '100%',
    height: '100%',
    borderRadius: 132,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },

  // Decorative Floating Dots (from screenshot)
  dot: {
    position: 'absolute',
    borderRadius: 10,
    zIndex: 10,
  },
  dotUpperLeft: {
    width: 10,
    height: 10,
    backgroundColor: colors.dotPeach,
    top: '14%',
    left: -18,
  },
  dotUpperRight: {
    width: 8,
    height: 8,
    backgroundColor: colors.dotGold,
    top: '6%',
    right: -14,
  },
  dotLowerRight: {
    width: 7,
    height: 7,
    backgroundColor: colors.dotPlum,
    bottom: '22%',
    right: -20,
  },
  dotLowerLeft: {
    width: 6,
    height: 6,
    backgroundColor: colors.dotPeach,
    bottom: '12%',
    left: -12,
  },

  // Bottom Soft Lavender Sheet
  bottomSheet: {
    backgroundColor: colors.lavenderSheet,
    borderTopLeftRadius: 36,
    borderTopRightRadius: 36,
    paddingHorizontal: 28,
    paddingTop: 32,
    paddingBottom: Platform.OS === 'ios' ? 24 : 32,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: colors.lavenderSheetBorder,
  },
  headline: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.textPrimary,
    textAlign: 'center',
    letterSpacing: -0.3,
    lineHeight: 31,
  },
  subhead: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 18,
    maxWidth: 320,
  },
  statusLabel: {
    fontSize: 11.5,
    fontWeight: '600',
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: 22,
    marginBottom: 8,
    letterSpacing: 0.1,
  },
  progressTrack: {
    width: 140,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.progressTrack,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
    backgroundColor: colors.progressFill,
  },
});
