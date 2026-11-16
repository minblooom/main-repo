// src/screens/onboarding/GentleHelloScreen.jsx
// "Before we bloom..." — Figma screen 03
// Harmonized layout: cohesive trust card, clean hotline banner, visible CTA

import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useResponsiveLayout } from '../../hooks/useResponsiveLayout';
import { OnboardingHeader } from './components/OnboardingHeader';
import { OnboardingHeroCard } from './components/OnboardingHeroCard';
import { onboardingStyles as s } from './onboardingStyles';
import { colors } from '../../theme/colors';

export const GentleHelloScreen = ({ navigation }) => {
  const { isDesktop, isTablet } = useResponsiveLayout();
  const isWide = isDesktop || isTablet;
  const [agreed, setAgreed] = useState(false);

  const handleContinue = () => {
    if (!agreed || !navigation) return;
    navigation.navigate('LocalSetup');
  };

  return (
    <SafeAreaView style={s.safeArea}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[s.scrollContainer, isWide && s.scrollContainerWide]}
        keyboardShouldPersistTaps="handled"
      >
        <View style={[s.pageWrapper, isWide && s.pageWrapperWide]}>
          <OnboardingHeader navigation={navigation} />

          <View style={[s.mainLayout, isWide && s.mainLayoutWide]}>
            {/* Left companion card */}
            <OnboardingHeroCard
              tag="LITTLE STEPS, REAL YOU."
              heading={'A softer start.\nNot another\nto-do.'}
              quote='"You get to go at your own pace."'
              author="Noodle · here for the small steps"
              isWide={isWide}
            />

            {/* Right content */}
            <View style={[s.contentContainer, isWide && s.contentContainerWide]}>
              <Text style={s.stepTag}>STEP 1 OF 7 · YOUR SPACE</Text>
              <Text style={s.title}>Before we bloom...</Text>
              <Text style={s.subtitle}>
                A few things to help this feel like a space you can trust.
              </Text>

              {/* Unified Trust Card */}
              <View style={styles.trustCard}>
                <View style={styles.trustItem}>
                  <Text style={styles.trustTitle}>A little support, not a diagnosis</Text>
                  <Text style={styles.trustBody}>
                    MindBloom provides wellness tools and peer support — not clinical advice or medical therapy.
                  </Text>
                </View>

                <View style={styles.divider} />

                <View style={styles.trustItem}>
                  <Text style={styles.trustTitle}>Your privacy matters</Text>
                  <Text style={styles.trustBody}>
                    We only collect what is needed to personalize your space. We never sell your reflections or data.
                  </Text>
                </View>

                <View style={styles.divider} />

                <View style={styles.trustItem}>
                  <Text style={styles.trustTitle}>For people aged 13 and over</Text>
                  <Text style={styles.trustBody}>
                    Tailored for youth, campus students, and twenties to meet you where you are in life.
                  </Text>
                </View>
              </View>

              {/* Concise Helpline Banner */}
              <View style={styles.hotlineBanner}>
                <Text style={styles.hotlineTitle}>Need immediate support?</Text>
                <Text style={styles.hotlineText}>
                  Kenya Red Cross: <Text style={styles.hotlineBold}>1199</Text> · Befrienders: <Text style={styles.hotlineBold}>+254 722 178 177</Text>
                </Text>
              </View>

              {/* Consent Checkbox */}
              <TouchableOpacity
                style={styles.checkRow}
                onPress={() => setAgreed(!agreed)}
                activeOpacity={0.8}
              >
                <View style={[styles.checkbox, agreed && styles.checkboxChecked]}>
                  {agreed && <Text style={styles.checkmark}>✓</Text>}
                </View>
                <Text style={styles.checkLabel}>
                  I understand MindBloom is a wellness app, not a medical service. I agree to the{' '}
                  <Text style={styles.link}>Terms of Service</Text> and{' '}
                  <Text style={styles.link}>Privacy Policy</Text>.
                </Text>
              </TouchableOpacity>

              {/* Action Button */}
              <TouchableOpacity
                style={[s.primaryBtn, !agreed && s.primaryBtnDisabled]}
                onPress={handleContinue}
                disabled={!agreed}
                activeOpacity={0.88}
              >
                <Text style={s.primaryBtnText}>Agree to continue →</Text>
              </TouchableOpacity>

              <View style={styles.termsFooter}>
                <Text style={styles.termsText}>
                  Read Terms of Service · Read Privacy Policy
                </Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  trustCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.06)',
    shadowColor: '#492542',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
    gap: 10,
  },
  trustItem: {
    gap: 3,
  },
  trustTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  trustBody: {
    fontSize: 12,
    color: '#666',
    lineHeight: 16,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  hotlineBanner: {
    backgroundColor: '#F3EFFD',
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: '#DFD5F0',
    marginTop: 2,
  },
  hotlineTitle: {
    fontSize: 11.5,
    fontWeight: '800',
    color: colors.brand,
    marginBottom: 2,
  },
  hotlineText: {
    fontSize: 11,
    color: '#555',
  },
  hotlineBold: {
    fontWeight: '700',
    color: colors.textPrimary,
  },
  checkRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    paddingVertical: 6,
    marginTop: 2,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: colors.brand,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
    flexShrink: 0,
  },
  checkboxChecked: {
    backgroundColor: colors.brand,
  },
  checkmark: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '800',
  },
  checkLabel: {
    flex: 1,
    fontSize: 12,
    color: '#555',
    lineHeight: 17,
  },
  link: {
    color: colors.brand,
    textDecorationLine: 'underline',
    fontWeight: '700',
  },
  termsFooter: {
    alignItems: 'center',
    paddingTop: 8,
  },
  termsText: {
    fontSize: 10.5,
    color: '#AAA',
  },
});
