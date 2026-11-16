// src/screens/onboarding/FocusAreasScreen.jsx
// "What needs a little room?" — Figma screen 07
// Mental health focus area multi-select (pick up to 3)
// English-only sub-labels — clear, thoughtful, and human

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

const FOCUS_AREAS = [
  { id: 'anxiety',       label: 'Anxiety & Overwhelm',       desc: 'Mentally exhausting' },
  { id: 'burnout',       label: 'Nairobi Hustle Burnout',     desc: 'Too much, all at once' },
  { id: 'low_mood',      label: 'Low Mood & Exhaustion',      desc: 'Vacant on the inside' },
  { id: 'sleep',         label: 'Sleep & Night Calm',         desc: 'Rest that actually restores' },
  { id: 'body',          label: 'Body Peace & Respect',       desc: 'A gentler relationship with self' },
  { id: 'strong_one',    label: 'Strong One Burden',          desc: 'Always holding it together' },
  { id: 'relationships', label: 'Relationship Strain',        desc: 'In spaces sometimes strained' },
  { id: 'trauma',        label: 'Past Wounds & Trauma',       desc: 'Things that still echo' },
  { id: 'grief',         label: 'Sacred Grief Space',         desc: 'Loss, in its many forms' },
  { id: 'self_doubt',    label: 'Self-Doubt & Inner Critic',  desc: 'An unfair inner mirror' },
  { id: 'isolation',     label: 'Digital Isolation',          desc: 'Connected, yet very alone' },
  { id: 'identity',      label: 'Identity & Belonging',       desc: 'Finding where you fit' },
  { id: 'feeling_off',   label: "Feeling 'Off'",              desc: "Can't quite name it" },
  { id: 'emptiness',     label: 'Exhaustion & Emptiness',     desc: 'Running on nothing' },
];

const MAX_SELECT = 3;

export const FocusAreasScreen = ({ navigation, route }) => {
  const { isDesktop, isTablet } = useResponsiveLayout();
  const isWide = isDesktop || isTablet;
  const [selected, setSelected] = useState([]);

  const toggle = (id) => {
    setSelected((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      if (prev.length >= MAX_SELECT) return prev;
      return [...prev, id];
    });
  };

  const handleContinue = () => {
    if (!navigation) return;
    navigation.navigate('RhythmSelect', {
      ...(route?.params ?? {}),
      focusAreas: selected,
    });
  };

  const handleSkip = () => {
    if (!navigation) return;
    navigation.navigate('RhythmSelect', {
      ...(route?.params ?? {}),
      focusAreas: [],
    });
  };

  const left = FOCUS_AREAS.filter((_, i) => i % 2 === 0);
  const right = FOCUS_AREAS.filter((_, i) => i % 2 !== 0);

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
              heading={'All of you\nis welcome\nhere.'}
              quote='"You don’t need the perfect words."'
              author="Noodle · here for the small steps"
              isWide={isWide}
            />

            {/* Right content */}
            <View style={[s.contentContainer, isWide && s.contentContainerWide]}>
              <Text style={s.stepTag}>STEP 5 OF 7 · YOUR FOCUS</Text>
              <Text style={s.title}>What needs a little room?</Text>
              <Text style={s.subtitle}>
                Choose up to 3. There are no wrong answers — you can change them later.
              </Text>
              <Text style={styles.counter}>
                {selected.length} of {MAX_SELECT} chosen
              </Text>

              {/* Two-column grid */}
              <View style={styles.grid}>
                {[left, right].map((col, ci) => (
                  <View key={ci} style={styles.col}>
                    {col.map((area) => {
                      const isOn = selected.includes(area.id);
                      const isDisabled = !isOn && selected.length >= MAX_SELECT;
                      return (
                        <TouchableOpacity
                          key={area.id}
                          style={[
                            styles.chip,
                            isOn && styles.chipSelected,
                            isDisabled && styles.chipDisabled,
                          ]}
                          onPress={() => toggle(area.id)}
                          activeOpacity={0.85}
                          disabled={isDisabled}
                        >
                          <View style={styles.chipTop}>
                            <Text
                              style={[
                                styles.chipLabel,
                                isOn && styles.chipLabelSelected,
                              ]}
                            >
                              {area.label}
                            </Text>
                            {isOn && <Text style={styles.chipCheck}>✓</Text>}
                          </View>
                          <Text style={styles.chipDesc}>{area.desc}</Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                ))}
              </View>

              <TouchableOpacity
                style={[s.primaryBtn, selected.length === 0 && s.primaryBtnDisabled]}
                onPress={handleContinue}
                disabled={selected.length === 0}
                activeOpacity={0.88}
              >
                <Text style={s.primaryBtnText}>Make room for me →</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={handleSkip} style={s.skipBtn}>
                <Text style={s.skipBtnText}>Not sure yet? Skip this step</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  counter: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#8B6DA8',
  },
  grid: {
    flexDirection: 'row',
    gap: 10,
  },
  col: {
    flex: 1,
    gap: 10,
  },
  chip: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 12,
    borderWidth: 2,
    borderColor: 'transparent',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  chipSelected: {
    backgroundColor: '#F0EAFA',
    borderColor: '#492542',
  },
  chipDisabled: {
    opacity: 0.4,
  },
  chipTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  chipLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1A1A1A',
    flex: 1,
    lineHeight: 16,
  },
  chipLabelSelected: {
    color: '#492542',
  },
  chipCheck: {
    fontSize: 12,
    color: '#492542',
    fontWeight: '800',
    marginLeft: 4,
  },
  chipDesc: {
    fontSize: 10.5,
    color: '#888',
    marginTop: 3,
  },
});
