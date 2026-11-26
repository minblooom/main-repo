// src/screens/auth/SplashScreen.jsx
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
import { AuthService } from '../../core/api/authService';
import { onboardingStorage } from '../../services/onboardingStorage';
import { styles } from './styles/SplashScreen.styles';

export const SplashScreen = ({ onFinish, navigation }) => {
  const { height, isDesktop, isTablet, containerMaxWidth } = useResponsiveLayout();
  const isWide = isDesktop || isTablet;

  const floatAnim = useRef(new Animated.Value(0)).current;
  const pulseScale = useRef(new Animated.Value(1)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const hasProceededRef = useRef(false);

  const handleProceed = async () => {
    if (hasProceededRef.current) return;
    hasProceededRef.current = true;

    if (onFinish) {
      onFinish();
      return;
    }
    if (navigation) {
      const remembered = await AuthService.hasValidSession();
      if (remembered) {
        const completed = await onboardingStorage.isOnboardingCompleted();
        navigation.replace(completed ? 'Home' : 'GentleHello');
      } else {
        navigation.replace('Welcome');
      }
    }
  };

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: Platform.OS !== 'web',
    }).start();

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

    const progressTimer = Animated.timing(progressAnim, {
      toValue: 1,
      duration: 2800,
      useNativeDriver: false,
    });
    progressTimer.start(({ finished }) => {
      if (finished) {
        handleProceed();
      }
    });

    return () => {
      breathLoop.stop();
      progressTimer.stop();
    };
  }, []);

  const archWidth = isWide ? 280 : Math.min(containerMaxWidth * 0.65, 250);
  const archHeight = isWide ? 340 : Math.min(height * 0.35, 300);

  const progressInterpolate = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      <Animated.View style={[styles.mainWrapper, { opacity: fadeAnim }]}>
        <View style={[styles.pageWrapper, isWide && styles.pageWrapperWide]}>
          <View style={[styles.contentLayout, isWide && styles.contentLayoutWide]}>
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
                <View style={[styles.dot, styles.dotUpperLeft]} />
                <View style={[styles.dot, styles.dotUpperRight]} />
                <View style={[styles.dot, styles.dotLowerRight]} />
                <View style={[styles.dot, styles.dotLowerLeft]} />

                <View
                  style={[
                    styles.archMattingFrame,
                    { width: archWidth, height: archHeight },
                  ]}
                >
                  <Image
                    source={require('../../../assets/images/splashscreen.jpg')}
                    style={styles.heroImage}
                    resizeMode="contain"
                  />
                </View>
              </Animated.View>

              <Text style={styles.leftTagline}>Your space. Your pace.</Text>
            </View>

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





