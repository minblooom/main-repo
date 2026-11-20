// src/screens/onboarding/AgeSelectScreen.jsx
// "What season are you in?" — Figma screen 06
// Direct age input + tailored age brackets for teenagers (13+) and twenties
// Strictly enforces 13+ age requirement with protective youth safety warning.

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
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

  const ageNum = parseInt(typedAge, 10);
  const isUnderage = !isNaN(ageNum) && ageNum < 13 && typedAge.length > 0;

  const handleAgeChange = (text) => {
    const cleaned = text.replace(/[^0-9]/g, '').slice(0, 2);
    setTypedAge(cleaned);

    const num = parseInt(cleaned, 10);
    if (!isNaN(num)) {
      if (num < 13) {
        setSelectedGroup(null);
      } else {
        const match = AGE_GROUPS.find((g) => num >= g.min && num <= g.max);
        if (match) {
          setSelectedGroup(match.id);
        } else if (num >= 26) {
          setSelectedGroup('26-29+');
        }
      }
    }
  };

  const handleSelectGroup = (group) => {
    setSelectedGroup(group.id);
    setTypedAge(group.defaultVal);
  };

  const handleContinue = () => {
    if (isUnderage) {
      Alert.alert(
        'Age Requirement (13+)',
        'MindBloom is designed for youth and young adults aged 13 and older. For your privacy and safety, independent registration is only permitted for ages 13+. Please explore wellness tools with a parent, guardian, or teacher.'
      );
      return;
    }

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
                    style={[
                      styles.ageNumberInput,
                      isUnderage && { color: '#BE123C' },
                    ]}
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

              {/* Underage Protective Warning */}
              {isUnderage && (
                <View style={styles.underageWarningBox}>
                  <Text style={styles.underageWarningTitle}>⚠️ Must Be 13 or Older to Register</Text>
                  <Text style={styles.underageWarningText}>
                    MindBloom is crafted for youth aged 13 and above. Under data protection regulations and youth safeguarding guidelines, users under 13 cannot register an independent account.
                    {'\n\n'}
                    If you are experiencing tough times, please reach out to Childline Kenya at 116 (Toll-Free) or speak with a trusted parent or counselor.
                  </Text>
                </View>
              )}

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

              {/* Action Button: Disabled when age < 13 */}
              <TouchableOpacity
                style={[
                  s.primaryBtn,
                  isUnderage && s.primaryBtnDisabled,
                ]}
                onPress={handleContinue}
                disabled={isUnderage}
                activeOpacity={0.88}
              >
                <Text style={s.primaryBtnText}>
                  {isUnderage ? '13+ Required to Continue' : 'Next, your rhythm →'}
                </Text>
              </TouchableOpacity>

              <Text style={styles.hint}>Age helps us suggest relevant spaces. Changeable anytime.</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

import { styles } from './styles/AgeSelectScreen.styles';
