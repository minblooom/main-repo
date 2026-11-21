// src/screens/auth/SplashScreen.jsx
// Exact implementation of Figma splash screen for MindBloom
// Responsive: 2-column on desktop/tablet, bottom sheet on mobile

import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  Image,
  Animated,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
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
          {/* -- 2-COLUMN LAYOUT ON DESKTOP / STACK ON MOBILE ---------------- */}
          <View style={[styles.contentLayout, isWide && styles.contentLayoutWide]}>
            {/* -- LEFT SECTION: BRAND + ARCHED FLORAL HERO ------------------- */}
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

            {/* -- RIGHT SECTION: LAVENDER CARD WITH PROGRESS BAR ------------ */}
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

import { styles } from './styles/SplashScreen.styles';
