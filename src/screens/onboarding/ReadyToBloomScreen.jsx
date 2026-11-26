// src/screens/onboarding/ReadyToBloomScreen.jsx
// "Look at you. You showed up." — Figma screen 09
// Warm onboarding summary / welcome moment before entering main sanctuary

import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Animated,
  Platform,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useResponsiveLayout } from '../../hooks/useResponsiveLayout';
import { useTheme } from '../../theme/ThemeContext';
import { COMPANION_MAP } from '../../constants/companions';
import { OnboardingHeader } from './components/OnboardingHeader';
import { onboardingStyles as s } from './onboardingStyles';
import { onboardingStorage } from '../../services/onboardingStorage';
import { apiClient } from '../../core/api/client';

const FOCUS_LABEL_MAP = {
  anxiety: 'Anxiety & Overwhelm',
  burnout: 'Daily Hustle Burnout',
  low_mood: 'Low Mood',
  sleep: 'Sleep & Rest',
  body: 'Body Peace',
  strong_one: 'Strong One Burden',
  relationships: 'Relationships',
  trauma: 'Past Wounds',
  grief: 'Grief Space',
  self_doubt: 'Self-Doubt',
  isolation: 'Digital Isolation',
  identity: 'Identity & Belonging',
  feeling_off: "Feeling 'Off'",
  emptiness: 'Exhaustion & Emptiness',
};

export const ReadyToBloomScreen = ({ navigation, route }) => {
  const { isDesktop, isTablet } = useResponsiveLayout();
  const isWide = isDesktop || isTablet;
  const { setCompanionId } = useTheme();

  const params = route?.params ?? {};
  const companion = COMPANION_MAP[params.companion] || COMPANION_MAP.noodle;
  const focusAreas = (params.focusAreas ?? []).map((id) => FOCUS_LABEL_MAP[id] ?? id);
  const rhythm = params.rhythm ?? '2';

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const floatAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.94)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: Platform.OS !== 'web',
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 6,
        tension: 160,
        useNativeDriver: Platform.OS !== 'web',
      }),
    ]).start();

    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: -6,
          duration: 2200,
          useNativeDriver: Platform.OS !== 'web',
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 2200,
          useNativeDriver: Platform.OS !== 'web',
        }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, []);

  const handleEnter = async () => {
    try {
      const chosenCompanion = params.companion || 'noodle';
      setCompanionId(chosenCompanion);
      await onboardingStorage.setOnboardingCompleted(true);
      // Map frontend gender ids to backend enum values
      const genderMap = {
        female: 'FEMALE',
        male: 'MALE',
        non_binary: 'NON_BINARY',
        prefer_not: 'PREFER_NOT_TO_SAY',
      };
      const backendGender = genderMap[params.gender] || 'PREFER_NOT_TO_SAY';

      await onboardingStorage.savePreferences({
        companion: chosenCompanion,
        companionId: chosenCompanion,
        focusAreas: params.focusAreas || [],
        interests: params.interests || [],
        rhythm: params.rhythm || '2',
        nudges: Boolean(params.nudges),
        country: params.country || 'ke',
        language: params.language || 'English',
        age: params.age || '22',
        ageGroup: params.ageGroup || '22-25',
        gender: params.gender || 'prefer_not',
        completedAt: new Date().toISOString(),
      });

      // Synchronize focus areas, interests, age, and gender with backend if user is authenticated
      apiClient.patch('/user/profile', {
        primaryStruggles: params.focusAreas || [],
        interests: params.interests || [],
        ageBand: params.age && Number(params.age) <= 17 ? 'TEEN_13_17' : Number(params.age) <= 24 ? 'YOUNG_ADULT_18_24' : 'ADULT_25_PLUS',
        gender: backendGender,
      }).catch(() => {});

      // Keep stored user session updated with struggles and passions
      try {
        const storedUser = await AuthService.getStoredUser();
        if (storedUser) {
          const updatedUser = {
            ...storedUser,
            primaryStruggles: params.focusAreas || [],
            interests: params.interests || [],
          };
          await AsyncStorage.setItem(AUTH_STORAGE_KEYS.USER_PROFILE, JSON.stringify(updatedUser));
        }
      } catch { }
    } catch {
      // Memory fallback active
    }

    if (navigation) {
      if (typeof navigation.replace === 'function') {
        navigation.replace('Home', {
          companion: params.companion || 'noodle',
          focusAreas: params.focusAreas || [],
          rhythm: params.rhythm || '2',
        });
      } else {
        navigation.navigate('Home', {
          companion: params.companion || 'noodle',
          focusAreas: params.focusAreas || [],
          rhythm: params.rhythm || '2',
        });
      }
    }
  };

  return (
    <SafeAreaView style={s.safeArea}>
      <Animated.View style={[{ flex: 1 }, { opacity: fadeAnim }]}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[s.scrollContainer, isWide && s.scrollContainerWide]}
        >
          <View style={[s.pageWrapper, isWide && s.pageWrapperWide]}>
            <OnboardingHeader navigation={navigation} showBack={true} />

            {/* Hero banner */}
            <Animated.View
              style={[
                styles.heroBanner,
                isWide && styles.heroBannerWide,
                { transform: [{ scale: scaleAnim }] },
              ]}
            >
              <View style={styles.heroText}>
                <Text style={styles.heroTag}>KARIBU, BLOOMER.</Text>
                <Text style={styles.heroTitle}>{'Look at you.\nYou showed up.'}</Text>
                <Text style={styles.heroSub}>
                  No perfect version of you required. This space is yours, just as you are.
                </Text>
              </View>
              <Animated.View
                style={[
                  styles.heroImgWrap,
                  { backgroundColor: companion.accent || '#E8DEFF', transform: [{ translateY: floatAnim }] },
                ]}
              >
                <Image
                  source={companion.cutoutImage || companion.image}
                  style={styles.heroImg}
                  resizeMode="contain"
                />
              </Animated.View>
            </Animated.View>

            {/* Starter kit */}
            <Text style={styles.kitTitle}>Your little starter kit</Text>
            <Text style={styles.kitSub}>Nothing set in stone. You can change it later.</Text>

            <View style={[styles.kitRow, isWide && styles.kitRowWide]}>
              <View style={[styles.kitCard, { backgroundColor: '#EAE3F7' }]}>
                <Text style={styles.kitNum}>01</Text>
                <Text style={styles.kitCardLabel}>YOUR COMPANY</Text>
                <Text style={styles.kitCardTitle}>{companion.name}'s got you.</Text>
                <Text style={styles.kitCardDesc}>
                  A little pocket of emotional courage, here whenever you need them.
                </Text>
              </View>

              <View style={[styles.kitCard, { backgroundColor: '#FFF3D6' }]}>
                <Text style={styles.kitNum}>02</Text>
                <Text style={styles.kitCardLabel}>YOUR FOCUS</Text>
                <Text style={styles.kitCardTitle}>A little more ease.</Text>
                <Text style={styles.kitCardDesc}>
                  {focusAreas.length > 0
                    ? `Based on: ${focusAreas.slice(0, 2).join(', ')}${focusAreas.length > 2 ? ' & more.' : '.'
                    }`
                    : "We'll personalise as you go."}
                </Text>
              </View>

              <View style={[styles.kitCard, { backgroundColor: '#D6EFDE' }]}>
                <Text style={styles.kitNum}>03</Text>
                <Text style={styles.kitCardLabel}>YOUR RHYTHM</Text>
                <Text style={styles.kitCardTitle}>{rhythm} minutes. Just you.</Text>
                <Text style={styles.kitCardDesc}>
                  Start small. MindBloom fits around your life, not the other way around.
                </Text>
              </View>
            </View>

            {/* CTA */}
            <TouchableOpacity style={s.primaryBtn} onPress={handleEnter} activeOpacity={0.88}>
              <Text style={s.primaryBtnText}>Enter my sanctuary →</Text>
            </TouchableOpacity>

            <Text style={styles.footer}>A small beginning is still a beginning.</Text>
          </View>
        </ScrollView>
      </Animated.View>
    </SafeAreaView>
  );
};

import { styles } from './styles/ReadyToBloomScreen.styles';
