// src/screens/auth/WelcomeScreen.jsx
// Exact implementation of Figma "Mindbloom · Sign up or sign in" screen
// Serves as the warm welcome landing right after the splash screen

// src/screens/auth/WelcomeScreen.jsx
// Exact implementation of Figma "Mindbloom · Sign up or sign in" screen
// Serves as the warm welcome landing right after the splash screen

import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  Animated,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useResponsiveLayout } from '../../hooks/useResponsiveLayout';
import { styles } from './styles/WelcomeScreen.styles';
import { showAlert } from '../../utils/alert';

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
    showAlert(
      'Urgent Support',
      'If you need immediate help, reach out to the Kenya Red Cross Hotline at 1199 or Befrienders Kenya at +254 722 178 177. You are not alone.'
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
            {/* -- Top Bar ------------------------------------------ */}
            <View style={styles.topBar}>
              <Text style={styles.brandTitle}>mindbloom</Text>
              <Text style={styles.topTagline}>Your space. Your pace.</Text>
            </View>

            {/* -- Main 2-Column Content ----------------------------- */}
            <View style={[styles.mainLayout, isWide && styles.mainLayoutWide]}>
              {/* -- Left Column: Floral Arch & Thought Bubbles ------- */}
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
                  - Private journaling and clear data practices.
                </Text>
              </View>

              {/* -- Right Column: Lavender Action Card -------------- */}
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
