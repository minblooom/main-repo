// src/screens/onboarding/LocalSetupScreen.jsx
// "A little closer to home." — Figma screen 04
// Harmonized layout: clean country code badges and language selection

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

const COUNTRIES = [
  { id: 'ke', code: 'KE', name: 'Kenya', langs: 'Sheng, Kiswahili & English' },
  { id: 'ug', code: 'UG', name: 'Uganda', langs: 'Luganda & English' },
  { id: 'tz', code: 'TZ', name: 'Tanzania', langs: 'Kiswahili & English' },
  { id: 'et', code: 'ET', name: 'Ethiopia', langs: 'Amharic & English' },
  { id: 'rw', code: 'RW', name: 'Rwanda', langs: 'Kinyarwanda & English' },
];

const LANGUAGES = ['English', 'Kiswahili', 'Sheng'];

export const LocalSetupScreen = ({ navigation, route }) => {
  const { isDesktop, isTablet } = useResponsiveLayout();
  const isWide = isDesktop || isTablet;
  const [country, setCountry] = useState(route?.params?.country || 'ke');
  const [language, setLanguage] = useState(route?.params?.language || 'English');
  const [elsewhere, setElsewhere] = useState(false);

  const handleContinue = () => {
    if (!navigation) return;
    navigation.navigate('CompanionSelect', {
      ...(route?.params ?? {}),
      country,
      language,
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
              heading={'Rooted here.\nMade for you.'}
              quote='"Familiar words. A little more belonging."'
              author="Noodle · here for the small steps"
              isWide={isWide}
            />

            {/* Right content */}
            <View style={[s.contentContainer, isWide && s.contentContainerWide]}>
              <Text style={s.stepTag}>STEP 2 OF 7 · YOUR HOME BASE</Text>
              <Text style={s.title}>A little closer to home.</Text>
              <Text style={s.subtitle}>
                Choose your country for local support and language. No GPS needed.
              </Text>

              {/* Country list */}
              <View style={styles.listWrapper}>
                {COUNTRIES.map((c) => {
                  const isSelected = country === c.id && !elsewhere;
                  return (
                    <TouchableOpacity
                      key={c.id}
                      style={[styles.row, isSelected && styles.rowSelected]}
                      onPress={() => {
                        setCountry(c.id);
                        setElsewhere(false);
                      }}
                      activeOpacity={0.85}
                    >
                      <View style={[styles.codeBadge, isSelected && styles.codeBadgeSelected]}>
                        <Text style={[styles.codeBadgeText, isSelected && styles.codeBadgeTextSelected]}>
                          {c.code}
                        </Text>
                      </View>
                      <View style={styles.rowText}>
                        <Text
                          style={[
                            styles.rowName,
                            isSelected && styles.rowNameSelected,
                          ]}
                        >
                          {c.name}
                        </Text>
                        <Text style={styles.rowLangs}>{c.langs}</Text>
                      </View>
                      {isSelected && (
                        <Text style={styles.rowCheck}>✓</Text>
                      )}
                    </TouchableOpacity>
                  );
                })}

                <TouchableOpacity
                  style={[styles.row, elsewhere && styles.rowSelected]}
                  onPress={() => setElsewhere(true)}
                  activeOpacity={0.85}
                >
                  <View style={[styles.codeBadge, elsewhere && styles.codeBadgeSelected]}>
                    <Text style={[styles.codeBadgeText, elsewhere && styles.codeBadgeTextSelected]}>
                      GL
                    </Text>
                  </View>
                  <View style={styles.rowText}>
                    <Text style={[styles.rowName, elsewhere && styles.rowNameSelected]}>
                      I'm somewhere else
                    </Text>
                    <Text style={styles.rowLangs}>International & global resources</Text>
                  </View>
                  {elsewhere && <Text style={styles.rowCheck}>✓</Text>}
                </TouchableOpacity>
              </View>

              {/* Language chips */}
              <Text style={styles.langLabel}>Your language:</Text>
              <View style={styles.langRow}>
                {LANGUAGES.map((l) => (
                  <TouchableOpacity
                    key={l}
                    style={[styles.langChip, language === l && styles.langChipSelected]}
                    onPress={() => setLanguage(l)}
                  >
                    <Text
                      style={[
                        styles.langChipText,
                        language === l && styles.langChipTextSelected,
                      ]}
                    >
                      {l} {language === l ? '✓' : ''}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <TouchableOpacity style={s.primaryBtn} onPress={handleContinue} activeOpacity={0.88}>
                <Text style={s.primaryBtnText}>Feels like home →</Text>
              </TouchableOpacity>

              <Text style={styles.hint}>You can change this later. No drama, no tracking.</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

import { styles } from './styles/LocalSetupScreen.styles';
