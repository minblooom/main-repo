// src/screens/onboarding/ReadyToBloomScreen.jsx
// "Look at you. You showed up." — Figma screen 09
// Warm onboarding summary / welcome moment before entering main sanctuary

import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Animated,
  Platform,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useResponsiveLayout } from '../../hooks/useResponsiveLayout';
import { COMPANION_MAP } from '../../constants/companions';
import { OnboardingHeader } from './components/OnboardingHeader';
import { onboardingStyles as s } from './onboardingStyles';
import { onboardingStorage } from '../../services/onboardingStorage';

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

  const params = route?.params ?? {};
  const companion = COMPANION_MAP.noodle;
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
      await onboardingStorage.setOnboardingCompleted(true);
      await onboardingStorage.savePreferences({
        companion: params.companion || 'noodle',
        focusAreas: params.focusAreas || [],
        rhythm: params.rhythm || '2',
        nudges: Boolean(params.nudges),
        country: params.country || 'ke',
        language: params.language || 'English',
        age: params.age || '22',
        ageGroup: params.ageGroup || '22-25',
        completedAt: new Date().toISOString(),
      });
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
                  { transform: [{ translateY: floatAnim }] },
                ]}
              >
                <Image source={companion.image} style={styles.heroImg} resizeMode="cover" />
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
                    ? `Based on: ${focusAreas.slice(0, 2).join(', ')}${
                        focusAreas.length > 2 ? ' & more.' : '.'
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

const styles = StyleSheet.create({
  heroBanner: {
    backgroundColor: '#EAE3F7',
    borderRadius: 28,
    padding: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#DFD5F0',
  },
  heroBannerWide: {
    paddingHorizontal: 36,
  },
  heroText: {
    flex: 1,
    paddingRight: 16,
  },
  heroTag: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#8B6DA8',
    letterSpacing: 1,
    marginBottom: 6,
  },
  heroTitle: {
    fontSize: 30,
    fontWeight: '800',
    color: '#2E1E46',
    lineHeight: 38,
    marginBottom: 8,
  },
  heroSub: {
    fontSize: 13,
    color: '#6E5D87',
    lineHeight: 19,
  },
  heroImgWrap: {
    width: 110,
    height: 110,
    borderRadius: 55,
    overflow: 'hidden',
    backgroundColor: '#FCE8D8',
    borderWidth: 3,
    borderColor: '#fff',
    shadowColor: '#492542',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
  },
  heroImg: {
    width: '100%',
    height: '100%',
  },
  kitTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1A1A1A',
    marginBottom: 2,
  },
  kitSub: {
    fontSize: 12,
    color: '#AAA',
    marginBottom: 14,
  },
  kitRow: {
    flexDirection: 'column',
    gap: 12,
    marginBottom: 24,
  },
  kitRowWide: {
    flexDirection: 'row',
  },
  kitCard: {
    flex: 1,
    borderRadius: 20,
    padding: 18,
    gap: 4,
  },
  kitNum: {
    fontSize: 11,
    fontWeight: '800',
    color: 'rgba(0,0,0,0.3)',
    marginBottom: 2,
  },
  kitCardLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: 'rgba(0,0,0,0.4)',
    letterSpacing: 0.8,
  },
  kitCardTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#1A1A1A',
    marginTop: 2,
  },
  kitCardDesc: {
    fontSize: 11.5,
    color: '#555',
    lineHeight: 16,
  },
  footer: {
    fontSize: 11.5,
    color: '#AAA',
    textAlign: 'center',
    marginTop: 14,
  },
});
