// src/screens/onboarding/FocusAreasScreen.jsx
// "What needs a little room?" — Figma screen 07
// Mental health focus area multi-select (pick up to 3)

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
import { COMPANION_MAP } from '../../constants/companions';
import { FOCUS_AREAS, MAX_FOCUS_AREAS } from '../../constants/focusAreas';

export const FocusAreasScreen = ({ navigation, route }) => {
  const { isDesktop, isTablet } = useResponsiveLayout();
  const isWide = isDesktop || isTablet;

  const companion = COMPANION_MAP[route?.params?.companion] || COMPANION_MAP.noodle;
  const [selected, setSelected] = useState(route?.params?.focusAreas || []);

  const toggle = (id) => {
    setSelected((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      if (prev.length >= MAX_FOCUS_AREAS) return prev;
      return [...prev, id];
    });
  };

  const handleContinue = () => {
    if (!navigation) return;
    navigation.navigate('InterestsSelect', {
      ...(route?.params ?? {}),
      focusAreas: selected,
    });
  };

  const handleSkip = () => {
    if (!navigation) return;
    navigation.navigate('InterestsSelect', {
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
        keyboardShouldPersistTaps="handled"
      >
        <View style={[s.pageWrapper, isWide && s.pageWrapperWide]}>
          <OnboardingHeader navigation={navigation} />

          <View style={[s.mainLayout, isWide && s.mainLayoutWide]}>
            {/* Left hero card */}
            <OnboardingHeroCard
              tag="LITTLE STEPS, REAL YOU."
              heading={'All of you\nis welcome\nhere.'}
              quote={`"You don't need the perfect words."`}
              author={companion.author}
              image={companion.image}
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
                {selected.length} of {MAX_FOCUS_AREAS} chosen
              </Text>

              {/* Two-column grid */}
              <View style={styles.grid}>
                {[left, right].map((col, ci) => (
                  <View key={ci} style={styles.col}>
                    {col.map((area) => {
                      const isOn = selected.includes(area.id);
                      const isDisabled = !isOn && selected.length >= MAX_FOCUS_AREAS;
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

import { styles } from './styles/FocusAreasScreen.styles';
