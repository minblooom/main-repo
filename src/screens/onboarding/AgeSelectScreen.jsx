// src/screens/onboarding/AgeSelectScreen.jsx
// "What season are you in?" — Figma screen 06
// Age group self-selection for content tailoring

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

const AGE_GROUPS = [
  { id: '13-17', label: '13–17', desc: 'Finding you, you.' },
  { id: '18-24', label: '18–24', desc: 'Campus kinda energy.' },
  { id: '25-34', label: '25–34', desc: 'Life on your terms.' },
  { id: '35+',   label: '35+',   desc: 'From here on, your way.' },
];

export const AgeSelectScreen = ({ navigation, route }) => {
  const { isDesktop, isTablet } = useResponsiveLayout();
  const isWide = isDesktop || isTablet;
  const [ageGroup, setAgeGroup] = useState('18-24');

  const handleContinue = () => {
    if (!navigation) return;
    navigation.navigate('FocusAreas', { ...(route?.params ?? {}), ageGroup });
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
              heading={"Growing isn't\na race."}
              quote='"There’s no timeline for figuring life out."'
              author="Noodle · here for the small steps"
              isWide={isWide}
            />

            {/* Right content */}
            <View style={[s.contentContainer, isWide && s.contentContainerWide]}>
              <Text style={s.stepTag}>STEP 4 OF 7 · YOUR SEASON</Text>
              <Text style={s.title}>What season are you in?</Text>
              <Text style={s.subtitle}>
                Your age helps us suggest relevant support and peer circles. MindBloom is for ages 13 and over.
              </Text>

              {AGE_GROUPS.map((g) => (
                <TouchableOpacity
                  key={g.id}
                  style={[styles.row, ageGroup === g.id && styles.rowSelected]}
                  onPress={() => setAgeGroup(g.id)}
                  activeOpacity={0.85}
                >
                  <View style={styles.rowLeft}>
                    <Text
                      style={[
                        styles.rowLabel,
                        ageGroup === g.id && styles.rowLabelSelected,
                      ]}
                    >
                      {g.label}
                    </Text>
                    <Text style={styles.rowDesc}>{g.desc}</Text>
                  </View>
                  {ageGroup === g.id && <Text style={styles.rowCheck}>✓</Text>}
                </TouchableOpacity>
              ))}

              <Text style={styles.hint}>
                No details needed. Just enough to make this relevant to you.
              </Text>

              <TouchableOpacity style={s.primaryBtn} onPress={handleContinue} activeOpacity={0.88}>
                <Text style={s.primaryBtnText}>{"That's me →"}</Text>
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
    paddingHorizontal: 18,
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
  rowLeft: {
    flex: 1,
  },
  rowLabel: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1A1A1A',
  },
  rowLabelSelected: {
    color: '#492542',
  },
  rowDesc: {
    fontSize: 12,
    color: '#777',
    marginTop: 1,
  },
  rowCheck: {
    fontSize: 16,
    color: '#492542',
    fontWeight: '800',
  },
  hint: {
    fontSize: 11.5,
    color: '#AAA',
    textAlign: 'center',
    marginTop: 2,
  },
});
