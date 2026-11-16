// src/screens/onboarding/AgeSelectScreen.jsx
// "What season are you in?" — Figma screen 06
// Direct age input + tailored age brackets for teenagers and twenties

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useResponsiveLayout } from '../../hooks/useResponsiveLayout';
import { OnboardingHeader } from './components/OnboardingHeader';
import { OnboardingHeroCard } from './components/OnboardingHeroCard';
import { onboardingStyles as s } from './onboardingStyles';
import { COMPANION_MAP } from '../../constants/companions';

const AGE_GROUPS = [
  { id: '13-17', min: 13, max: 17, defaultVal: '16', label: '13–17', desc: 'Finding who you are' },
  { id: '18-21', min: 18, max: 21, defaultVal: '20', label: '18–21', desc: 'Early campus & independence' },
  { id: '22-25', min: 22, max: 25, defaultVal: '23', label: '22–25', desc: 'Navigating work, study & change' },
  { id: '26-29+', min: 26, max: 99, defaultVal: '27', label: '26–29+', desc: 'Building life on your own terms' },
];

export const AgeSelectScreen = ({ navigation, route }) => {
  const { isDesktop, isTablet } = useResponsiveLayout();
  const isWide = isDesktop || isTablet;

  const companion = COMPANION_MAP[route?.params?.companion] || COMPANION_MAP.noodle;

  const [typedAge, setTypedAge] = useState(route?.params?.age || '22');
  const [selectedGroup, setSelectedGroup] = useState(route?.params?.ageGroup || '22-25');

  const handleAgeChange = (text) => {
    const cleaned = text.replace(/[^0-9]/g, '').slice(0, 2);
    setTypedAge(cleaned);

    const num = parseInt(cleaned, 10);
    if (!isNaN(num)) {
      const match = AGE_GROUPS.find((g) => num >= g.min && num <= g.max);
      if (match) {
        setSelectedGroup(match.id);
      } else if (num >= 26) {
        setSelectedGroup('26-29+');
      } else if (num < 13 && num > 0) {
        setSelectedGroup('13-17');
      }
    }
  };

  const handleSelectGroup = (group) => {
    setSelectedGroup(group.id);
    setTypedAge(group.defaultVal);
  };

  const handleContinue = () => {
    if (!navigation) return;
    const finalAge = typedAge || '22';
    navigation.navigate('FocusAreas', {
      ...(route?.params ?? {}),
      age: finalAge,
      ageGroup: selectedGroup,
    });
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
              heading={"Growing isn't\na race."}
              quote={companion.quote}
              author={companion.author}
              image={companion.image}
              isWide={isWide}
            />

            {/* Right content */}
            <View style={[s.contentContainer, isWide && s.contentContainerWide]}>
              <Text style={s.stepTag}>STEP 4 OF 7 · YOUR SEASON</Text>
              <Text style={s.title}>What season are you in?</Text>
              <Text style={s.subtitle}>
                Your age helps us suggest relevant support and peer circles. MindBloom is tailored for youth and twenties.
              </Text>

              {/* Direct Age Input Box */}
              <View style={styles.inputCard}>
                <Text style={styles.inputCardLabel}>Your age</Text>
                <View style={styles.inputRow}>
                  <TextInput
                    style={styles.ageNumberInput}
                    value={typedAge}
                    onChangeText={handleAgeChange}
                    keyboardType="numeric"
                    maxLength={2}
                    placeholder="22"
                    placeholderTextColor="#A799B7"
                  />
                  <Text style={styles.yearsSuffix}>years</Text>
                </View>
              </View>

              <Text style={styles.orGroupLabel}>Or choose your age group:</Text>

              {/* Age Bracket Options */}
              <View style={styles.bracketGroup}>
                {AGE_GROUPS.map((g) => {
                  const isSelected = selectedGroup === g.id;
                  return (
                    <TouchableOpacity
                      key={g.id}
                      style={[styles.row, isSelected && styles.rowSelected]}
                      onPress={() => handleSelectGroup(g)}
                      activeOpacity={0.85}
                    >
                      <View style={styles.rowLeft}>
                        <Text style={[styles.rowLabel, isSelected && styles.rowLabelSelected]}>
                          {g.label}
                        </Text>
                        <Text style={styles.rowDesc}>{g.desc}</Text>
                      </View>
                      {isSelected && <Text style={styles.rowCheck}>✓</Text>}
                    </TouchableOpacity>
                  );
                })}
              </View>

              <Text style={styles.hint}>
                No birthday needed. Just enough to make this relevant to you.
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
  inputCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingVertical: 14,
    paddingHorizontal: 20,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.06)',
    shadowColor: '#492542',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  inputCardLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#6E5D87',
    marginBottom: 4,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8,
  },
  ageNumberInput: {
    fontSize: 32,
    fontWeight: '800',
    color: '#2E1E46',
    minWidth: 44,
    paddingVertical: 0,
    letterSpacing: -0.5,
  },
  yearsSuffix: {
    fontSize: 15,
    fontWeight: '700',
    color: '#8B6DA8',
  },
  orGroupLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#6E5D87',
    marginTop: 4,
    marginBottom: 2,
  },
  bracketGroup: {
    gap: 10,
  },
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
    fontSize: 17,
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
