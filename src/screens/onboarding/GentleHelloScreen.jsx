// src/screens/onboarding/GentleHelloScreen.jsx
// "Before we bloom..." — Figma screen 03
// Safety disclaimer + consent before onboarding continues

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

const HOTLINES = [
  { country: 'Kenya', line: '1199 · Befrienders +254 722 03 07' },
  { country: 'Tanzania', line: '+255 800 750 075' },
  { country: 'Ethiopia', line: '199' },
  { country: 'Rwanda', line: 'Posner ID: +250 788 123 123' },
];

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

              <View style={styles.infoCard}>
                <Text style={styles.infoTitle}>A little support, not a diagnosis</Text>
                <Text style={styles.infoBody}>
                  MindBloom offers wellness tools and community peer support — not clinical advice, therapy or medical treatment.
                </Text>
              </View>

              <View style={styles.infoCard}>
                <Text style={styles.infoTitle}>Your privacy matters</Text>
                <Text style={styles.infoBody}>
                  We collect only what is needed to personalise your space. We never sell your personal information — ever, full stop.
                </Text>
              </View>

              <View style={styles.infoCard}>
                <Text style={styles.infoTitle}>For people aged 13 and over</Text>
                <Text style={styles.infoBody}>
                  Made for youth, campus students and adults. We'll tailor the experience to your stage of life.
                </Text>
              </View>

              <View style={[styles.infoCard, styles.infoCardAccent]}>
                <Text style={styles.infoTitle}>Need immediate support?</Text>
                {HOTLINES.map((h) => (
                  <Text key={h.country} style={styles.hotlineRow}>
                    <Text style={styles.hotlineCountry}>{h.country} </Text>
                    <Text style={styles.hotlineLine}>{h.line}</Text>
                  </Text>
                ))}
              </View>

              {/* Consent checkbox */}
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

              {/* CTA */}
              <TouchableOpacity
                style={[s.primaryBtn, !agreed && s.primaryBtnDisabled]}
                onPress={handleContinue}
                disabled={!agreed}
                activeOpacity={0.88}
              >
                <Text style={s.primaryBtnText}>Agree to continue →</Text>
              </TouchableOpacity>

              <View style={styles.termsRow}>
                <TouchableOpacity>
                  <Text style={styles.termsLink}>Read Terms of Service</Text>
                </TouchableOpacity>
                <Text style={styles.termsSep}> · </Text>
                <TouchableOpacity>
                  <Text style={styles.termsLink}>Read Privacy Policy</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  infoCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 14,
    gap: 4,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.06)',
  },
  infoCardAccent: {
    backgroundColor: '#F3EFFD',
    borderColor: '#DFD5F0',
  },
  infoTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#1A1A1A',
  },
  infoBody: {
    fontSize: 12,
    color: '#555',
    lineHeight: 17,
  },
  hotlineRow: {
    marginTop: 4,
  },
  hotlineCountry: {
    fontSize: 12,
    fontWeight: '700',
    color: '#492542',
  },
  hotlineLine: {
    fontSize: 12,
    color: '#555',
  },
  checkRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    paddingVertical: 4,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#492542',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
    flexShrink: 0,
  },
  checkboxChecked: {
    backgroundColor: '#492542',
  },
  checkmark: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '800',
  },
  checkLabel: {
    flex: 1,
    fontSize: 12.5,
    color: '#444',
    lineHeight: 18,
  },
  link: {
    color: '#492542',
    textDecorationLine: 'underline',
    fontWeight: '700',
  },
  termsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 4,
  },
  termsLink: {
    fontSize: 11,
    color: '#8B6DA8',
    textDecorationLine: 'underline',
  },
  termsSep: {
    fontSize: 11,
    color: '#AAA',
  },
});
