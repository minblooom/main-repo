// src/screens/onboarding/RhythmSelectScreen.jsx
// "Small is a good start." — Figma screen 08
// Daily time commitment preference + optional nudge toggle

import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useResponsiveLayout } from '../../hooks/useResponsiveLayout';
import { OnboardingHeader } from './components/OnboardingHeader';
import { OnboardingHeroCard } from './components/OnboardingHeroCard';
import { onboardingStyles as s } from './onboardingStyles';

const RHYTHMS = [
  { id: '2',  mins: '2',  label: 'A tiny reset',         desc: 'For the days that are already a lot.' },
  { id: '5',  mins: '5',  label: 'A little breathing room', desc: 'A breath, a check-in, a brief reflection.' },
  { id: '10', mins: '10', label: 'A moment to settle in', desc: 'Time to explore what feels good.' },
];

export const RhythmSelectScreen = ({ navigation, route }) => {
  const { isDesktop, isTablet } = useResponsiveLayout();
  const isWide = isDesktop || isTablet;
  const [rhythm, setRhythm] = useState('2');
  const [nudges, setNudges] = useState(false);

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
      >
        <View style={[s.pageWrapper, isWide && s.pageWrapperWide]}>
          <OnboardingHeader navigation={navigation} />

          <View style={[s.mainLayout, isWide && s.mainLayoutWide]}>
            {/* Left hero card */}
            <OnboardingHeroCard
              tag="LITTLE STEPS, REAL YOU."
              heading={'Tiny counts.\nEven today.'}
              quote='"No streaks to protect. No falling behind."'
              author="Noodle · here for the small steps"
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
                  trackColor={{ false: '#DDD', true: '#492542' }}
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

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 16,
    gap: 14,
    borderWidth: 2,
    borderColor: 'transparent',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  rowSelected: {
    borderColor: '#492542',
    backgroundColor: '#F0EAFA',
  },
  minsWrap: {
    alignItems: 'center',
    width: 36,
  },
  mins: {
    fontSize: 22,
    fontWeight: '800',
    color: '#888',
  },
  minsSelected: {
    color: '#492542',
  },
  minsLabel: {
    fontSize: 8,
    fontWeight: '700',
    color: '#AAA',
    letterSpacing: 0.5,
  },
  rowText: {
    flex: 1,
  },
  rowLabel: {
    fontSize: 14,
    fontWeight: '800',
    color: '#1A1A1A',
  },
  rowLabelSelected: {
    color: '#492542',
  },
  rowDesc: {
    fontSize: 12,
    color: '#777',
    marginTop: 2,
  },
  rowCheck: {
    fontSize: 15,
    color: '#492542',
    fontWeight: '800',
  },
  nudgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 16,
    gap: 12,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.07)',
  },
  nudgeText: {
    flex: 1,
  },
  nudgeTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  nudgeDesc: {
    fontSize: 11.5,
    color: '#888',
    marginTop: 2,
  },
});
