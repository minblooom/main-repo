// src/screens/onboarding/GentleHelloScreen.jsx
// "Before we bloom..." — Figma screen 03
// Harmonized layout: cohesive trust card, clean hotline banner, visible CTA,
// and in-app legal modal popup for Terms, Privacy Policy, and Mental Health Disclaimer.

import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useResponsiveLayout } from '../../hooks/useResponsiveLayout';
import { OnboardingHeader } from './components/OnboardingHeader';
import { OnboardingHeroCard } from './components/OnboardingHeroCard';
import { onboardingStyles as s } from './onboardingStyles';
import { LegalModal } from '../legal/LegalScreen';

export const GentleHelloScreen = ({ navigation }) => {
  const { isDesktop, isTablet } = useResponsiveLayout();
  const isWide = isDesktop || isTablet;
  const [agreed, setAgreed] = useState(false);
  const [legalModalTab, setLegalModalTab] = useState(null); // 'terms' | 'privacy' | 'disclaimer' | null

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
                <TouchableOpacity
                  style={styles.trustItem}
                  onPress={() => setLegalModalTab('disclaimer')}
                  activeOpacity={0.8}
                >
                  <Text style={styles.trustTitle}>A little support, not a diagnosis ↗</Text>
                  <Text style={styles.trustBody}>
                    MindBloom provides wellness tools and peer support — not clinical advice or medical therapy. Tap to view full medical disclaimer.
                  </Text>
                </TouchableOpacity>

                <View style={styles.divider} />

                <TouchableOpacity
                  style={styles.trustItem}
                  onPress={() => setLegalModalTab('privacy')}
                  activeOpacity={0.8}
                >
                  <Text style={styles.trustTitle}>Your privacy matters ↗</Text>
                  <Text style={styles.trustBody}>
                    We only collect what is needed to personalize your space. We never sell your reflections or data. Tap to view privacy policy.
                  </Text>
                </TouchableOpacity>

                <View style={styles.divider} />

                <TouchableOpacity
                  style={styles.trustItem}
                  onPress={() => setLegalModalTab('terms')}
                  activeOpacity={0.8}
                >
                  <Text style={styles.trustTitle}>For people aged 13 and over ↗</Text>
                  <Text style={styles.trustBody}>
                    Tailored for youth, campus students, and twenties to meet you where you are in life. Tap to view terms of service.
                  </Text>
                </TouchableOpacity>
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
                  <Text
                    style={styles.link}
                    onPress={() => setLegalModalTab('terms')}
                  >
                    Terms of Service
                  </Text>,{' '}
                  <Text
                    style={styles.link}
                    onPress={() => setLegalModalTab('privacy')}
                  >
                    Privacy Policy
                  </Text>, and{' '}
                  <Text
                    style={styles.link}
                    onPress={() => setLegalModalTab('disclaimer')}
                  >
                    Mental Health Disclaimer
                  </Text>.
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

              {/* Tappable Legal Links in Footer */}
              <View style={styles.termsFooter}>
                <TouchableOpacity onPress={() => setLegalModalTab('terms')} activeOpacity={0.7}>
                  <Text style={styles.termsText}>Terms of Service</Text>
                </TouchableOpacity>
                <Text style={styles.termsText}> · </Text>
                <TouchableOpacity onPress={() => setLegalModalTab('privacy')} activeOpacity={0.7}>
                  <Text style={styles.termsText}>Privacy Policy</Text>
                </TouchableOpacity>
                <Text style={styles.termsText}> · </Text>
                <TouchableOpacity onPress={() => setLegalModalTab('disclaimer')} activeOpacity={0.7}>
                  <Text style={styles.termsText}>Disclaimer</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Reusable In-App Legal Modal Popup */}
      <LegalModal
        visible={!!legalModalTab}
        initialTab={legalModalTab || 'terms'}
        onClose={() => setLegalModalTab(null)}
      />
    </SafeAreaView>
  );
};

import { styles } from './styles/GentleHelloScreen.styles';
