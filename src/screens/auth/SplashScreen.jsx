// src/screens/auth/SplashScreen.jsx
// Exact implementation of Figma splash screen for MindBloom
// Responsive: 2-column on desktop/tablet, bottom sheet on mobile

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
  const { height, isDesktop, isTablet, containerMaxWidth } = useResponsiveLayout();
  const isWide = isDesktop || isTablet;

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
    const breathLoop = Animated.loop(
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
    );
    breathLoop.start();

    // Progress bar fill to 100% (2.8 seconds)
    Animated.timing(progressAnim, {
      toValue: 1,
      duration: 2800,
      useNativeDriver: false,
    }).start(({ finished }) => {
      if (finished) {
        handleProceed();
      }
    });

    return () => breathLoop.stop();
  }, []);

  const handleProceed = () => {
    if (onFinish) {
      onFinish();
    } else if (navigation) {
      // Navigate to Welcome screen
      navigation.navigate('Welcome');
    }
  };

  const archWidth = isWide ? 260 : Math.min(containerMaxWidth * 0.72, 280);
  const archHeight = isWide ? 340 : Math.min(height * 0.44, 380);

  const progressInterpolate = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      <Animated.View style={[styles.mainWrapper, { opacity: fadeAnim }]}>
        <View style={[styles.pageWrapper, isWide && styles.pageWrapperWide]}>
          {/* ── 2-COLUMN LAYOUT ON DESKTOP / STACK ON MOBILE ──────────────── */}
          <View style={[styles.contentLayout, isWide && styles.contentLayoutWide]}>
            {/* ── LEFT SECTION: BRAND + ARCHED FLORAL HERO ─────────────────── */}
            <View style={[styles.leftSection, isWide && styles.leftSectionWide]}>
              <View style={[styles.brandContainer, isWide && styles.brandContainerWide]}>
                <Text style={styles.brandTitle}>mindbloom</Text>
              </View>

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
                {/* Decorative floating dots */}
                <View style={[styles.dot, styles.dotUpperLeft]} />
                <View style={[styles.dot, styles.dotUpperRight]} />
                <View style={[styles.dot, styles.dotLowerRight]} />
                <View style={[styles.dot, styles.dotLowerLeft]} />

                {/* Arched Matting Frame */}
                <View
                  style={[
                    styles.archMattingFrame,
                    { width: archWidth, height: archHeight },
                  ]}
                >
                  <Image
                    source={require('../../../assets/images/splashscreen.jpg')}
                    style={styles.heroImage}
                    resizeMode="cover"
                  />
                </View>
              </Animated.View>

              <Text style={styles.leftTagline}>Your space. Your pace.</Text>
            </View>

            {/* ── RIGHT SECTION: LAVENDER CARD WITH PROGRESS BAR ──────────── */}
            <TouchableOpacity
              style={[styles.lavenderCard, isWide && styles.lavenderCardWide]}
              onPress={handleProceed}
              activeOpacity={0.96}
            >
              <Text style={styles.cardTag}>WELCOME TO MINDBLOOM</Text>

              <Text style={styles.headline}>
                {'A little habit.\nA more confident\nyou.'}
              </Text>

              <Text style={styles.subhead}>
                Build confidence and healthy mental habits,{'\n'}one small step at a time.
              </Text>

              <View style={styles.progressContainer}>
                <Text style={styles.statusLabel}>
                  Getting ready to bloom...
                </Text>
                <View style={styles.progressTrack}>
                  <Animated.View
                    style={[
                      styles.progressFill,
                      { width: progressInterpolate },
                    ]}
                  />
                </View>
              </View>
            </TouchableOpacity>
          </View>
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
  pageWrapper: {
    flex: 1,
    width: '100%',
    maxWidth: 1040,
    backgroundColor: colors.splashBg,
    justifyContent: 'space-between',
    alignSelf: 'center',
  },
  pageWrapperWide: {
    paddingHorizontal: 40,
    paddingVertical: 24,
    justifyContent: 'center',
  },
  contentLayout: {
    flex: 1,
    width: '100%',
    justifyContent: 'space-between',
  },
  contentLayoutWide: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 40,
  },

  // Left Section
  leftSection: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: Platform.OS === 'android' ? 16 : 8,
    paddingHorizontal: 20,
  },
  leftSectionWide: {
    alignItems: 'flex-start',
    paddingHorizontal: 0,
    paddingTop: 0,
  },
  brandContainer: {
    alignItems: 'center',
    marginBottom: 16,
    marginTop: 6,
  },
  brandContainerWide: {
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  brandTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.brand,
    letterSpacing: -0.6,
  },
  heroArchWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginVertical: 10,
    alignSelf: 'center',
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
    shadowOpacity: 0.12,
    shadowRadius: 20,
    elevation: 6,
  },
  heroImage: {
    width: '100%',
    height: '100%',
    borderRadius: 132,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  leftTagline: {
    fontSize: 11.5,
    fontStyle: 'italic',
    color: colors.textMuted,
    marginTop: 10,
    alignSelf: 'center',
  },

  // Decorative dots
  dot: {
    position: 'absolute',
    borderRadius: 50,
  },
  dotUpperLeft: {
    width: 6,
    height: 6,
    backgroundColor: colors.dotPeach,
    top: 30,
    left: -20,
  },
  dotUpperRight: {
    width: 8,
    height: 8,
    backgroundColor: colors.dotGold,
    top: 60,
    right: -24,
  },
  dotLowerRight: {
    width: 6,
    height: 6,
    backgroundColor: colors.dotPlum,
    bottom: 50,
    right: -20,
  },
  dotLowerLeft: {
    width: 7,
    height: 7,
    backgroundColor: colors.dotPeach,
    bottom: 90,
    left: -24,
  },

  // Right Lavender Card / Bottom Sheet
  lavenderCard: {
    backgroundColor: colors.lavenderSheet,
    borderTopLeftRadius: 36,
    borderTopRightRadius: 36,
    paddingHorizontal: 28,
    paddingTop: 28,
    paddingBottom: Platform.OS === 'ios' ? 40 : 28,
    borderWidth: 1,
    borderColor: colors.lavenderSheetBorder,
    borderBottomWidth: 0,
    alignItems: 'center',
  },
  lavenderCardWide: {
    flex: 1,
    maxWidth: 460,
    borderRadius: 32,
    borderBottomWidth: 1,
    paddingVertical: 44,
    paddingHorizontal: 36,
    alignItems: 'flex-start',
    shadowColor: '#492542',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 18,
    elevation: 3,
  },
  cardTag: {
    fontSize: 9.5,
    fontWeight: '800',
    color: colors.textSecondary,
    letterSpacing: 0.8,
    marginBottom: 12,
  },
  headline: {
    fontSize: 26,
    fontWeight: '800',
    color: colors.textPrimary,
    lineHeight: 33,
    letterSpacing: -0.4,
    marginBottom: 10,
  },
  subhead: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 19,
    marginBottom: 28,
  },
  progressContainer: {
    width: '100%',
    marginTop: 'auto',
  },
  statusLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textMuted,
    letterSpacing: 0.2,
    marginBottom: 8,
  },
  progressTrack: {
    width: '100%',
    height: 5,
    backgroundColor: colors.progressTrack,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.progressFill,
    borderRadius: 3,
  },
});
