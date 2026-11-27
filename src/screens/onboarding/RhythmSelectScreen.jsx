// src/screens/onboarding/RhythmSelectScreen.jsx
// "Small is a good start." — Figma screen 08
// Daily time commitment preference + optional nudge toggle

import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useResponsiveLayout } from '../../hooks/useResponsiveLayout';
import { OnboardingHeader } from './components/OnboardingHeader';
import { OnboardingHeroCard } from './components/OnboardingHeroCard';
import { onboardingStyles as s } from './onboardingStyles';
import { colors } from '../../theme/colors';
import { COMPANION_MAP } from '../../constants/companions';

const RHYTHMS = [
  { id: '2', mins: '2', label: 'A tiny reset', desc: 'For the days that are already a lot.' },
  { id: '5', mins: '5', label: 'A little breathing room', desc: 'A breath, a check-in, a brief reflection.' },
  { id: '10', mins: '10', label: 'A moment to settle in', desc: 'Time to explore what feels good.' },
];

export const RhythmSelectScreen = ({ navigation, route }) => {
  const { isDesktop, isTablet } = useResponsiveLayout();
  const isWide = isDesktop || isTablet;
  const [rhythm, setRhythm] = useState(route?.params?.rhythm || '2');
  const [nudges, setNudges] = useState(Boolean(route?.params?.nudges));

  const companion = COMPANION_MAP[route?.params?.companion] || COMPANION_MAP.noodle;
  const selected = RHYTHMS.find((r) => r.id === rhythm);

  const handleContinue = () => {
    if (!navigation) return;
    navigation.navigate('ReadyToBloom', { ...(route?.params ?? {}), rhythm, nudges });
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
            {/* Left hero card */}
            <OnboardingHeroCard
              tag="LITTLE STEPS, REAL YOU."
              heading={'Tiny counts.\nEven today.'}
              quote='"No streaks to protect. No falling behind."'
              author={companion.author}
              image={companion.image}
              isWide={isWide}
            />

            {/* Right content */}
            <View style={[s.contentContainer, isWide && s.contentContainerWide]}>
              <Text style={s.stepTag}>STEP 6 OF 7 · YOUR RHYTHM</Text>
              <Text style={s.title}>Small is a good start.</Text>
              <Text style={s.subtitle}>
                How much space feels doable? This is an invitation, not a daily target.
              </Text>

              {RHYTHMS.map((r) => (
                <TouchableOpacity
                  key={r.id}
                  style={[styles.row, rhythm === r.id && styles.rowSelected]}
                  onPress={() => setRhythm(r.id)}
                  activeOpacity={0.85}
                >
                  <View style={styles.minsWrap}>
                    <Text style={[styles.mins, rhythm === r.id && styles.minsSelected]}>
                      {r.mins}
                    </Text>
                    <Text style={styles.minsLabel}>MIN</Text>
                  </View>
                  <View style={styles.rowText}>
                    <Text
                      style={[
                        styles.rowLabel,
                        rhythm === r.id && styles.rowLabelSelected,
                      ]}
                    >
                      {r.label}
                    </Text>
                    <Text style={styles.rowDesc}>{r.desc}</Text>
                  </View>
                  {rhythm === r.id && <Text style={styles.rowCheck}>✓</Text>}
                </TouchableOpacity>
              ))}

              {/* Nudge toggle */}
              <View style={styles.nudgeRow}>
                <View style={styles.nudgeText}>
                  <Text style={styles.nudgeTitle}>Gentle nudges? Only if you want.</Text>
                  <Text style={styles.nudgeDesc}>
                    Reminders are off. You can choose a time later in settings.
                  </Text>
                </View>
                <Switch
                  value={nudges}
                  onValueChange={setNudges}
                  trackColor={{ false: '#DDD', true: colors.brand }}
                  thumbColor="#fff"
                />
              </View>

              <TouchableOpacity style={s.primaryBtn} onPress={handleContinue} activeOpacity={0.88}>
                <Text style={s.primaryBtnText}>
                  {selected ? `${selected.mins} minutes sounds good →` : 'Continue →'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() =>
                  navigation?.navigate('ReadyToBloom', {
                    ...(route?.params ?? {}),
                    rhythm: null,
                    nudges: false,
                  })
                }
                style={s.skipBtn}
              >
                <Text style={s.skipBtnText}>Decide later</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

import { styles } from './styles/RhythmSelectScreen.styles';
