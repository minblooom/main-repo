// src/screens/onboarding/LocalSetupScreen.jsx
// "A little closer to home." — Figma screen 04
// Country + language picker for localised support

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

const COUNTRIES = [
  { id: 'ke', flag: '🇰🇪', name: 'Kenya', langs: 'Sheng, Kiswahili & English' },
  { id: 'ug', flag: '🇺🇬', name: 'Uganda', langs: 'Luganda & English' },
  { id: 'tz', flag: '🇹🇿', name: 'Tanzania', langs: 'Kiswahili & English' },
  { id: 'et', flag: '🇪🇹', name: 'Ethiopia', langs: 'Amharic & English' },
  { id: 'rw', flag: '🇷🇼', name: 'Rwanda', langs: 'Kinyarwanda & English' },
];

const LANGUAGES = ['English', 'Kiswahili', 'Sheng'];

export const LocalSetupScreen = ({ navigation }) => {
  const { isDesktop, isTablet } = useResponsiveLayout();
  const isWide = isDesktop || isTablet;
  const [country, setCountry] = useState('ke');
  const [language, setLanguage] = useState('English');
  const [elsewhere, setElsewhere] = useState(false);

  const handleContinue = () => {
    if (!navigation) return;
    navigation.navigate('CompanionSelect', { country, language });
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
                {COUNTRIES.map((c) => (
                  <TouchableOpacity
                    key={c.id}
                    style={[styles.row, country === c.id && !elsewhere && styles.rowSelected]}
                    onPress={() => {
                      setCountry(c.id);
                      setElsewhere(false);
                    }}
                    activeOpacity={0.85}
                  >
                    <Text style={styles.flag}>{c.flag}</Text>
                    <View style={styles.rowText}>
                      <Text
                        style={[
                          styles.rowName,
                          country === c.id && !elsewhere && styles.rowNameSelected,
                        ]}
                      >
                        {c.name}
                      </Text>
                      <Text style={styles.rowLangs}>{c.langs}</Text>
                    </View>
                    {country === c.id && !elsewhere && (
                      <Text style={styles.rowCheck}>✓</Text>
                    )}
                  </TouchableOpacity>
                ))}

                <TouchableOpacity
                  style={[styles.row, elsewhere && styles.rowSelected]}
                  onPress={() => setElsewhere(true)}
                  activeOpacity={0.85}
                >
                  <Text style={styles.flag}>🌍</Text>
                  <Text style={[styles.rowName, elsewhere && styles.rowNameSelected]}>
                    I'm somewhere else
                  </Text>
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

const styles = StyleSheet.create({
  listWrapper: {
    borderRadius: 18,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.07)',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 13,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  rowSelected: {
    backgroundColor: '#F0EAFA',
  },
  flag: {
    fontSize: 20,
  },
  rowText: {
    flex: 1,
  },
  rowName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  rowNameSelected: {
    color: '#492542',
  },
  rowLangs: {
    fontSize: 11,
    color: '#888',
    marginTop: 1,
  },
  rowCheck: {
    fontSize: 15,
    color: '#492542',
    fontWeight: '800',
  },
  langLabel: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#1A1A1A',
    marginTop: 4,
  },
  langRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  langChip: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#fff',
    borderWidth: 1.5,
    borderColor: 'rgba(0,0,0,0.1)',
  },
  langChipSelected: {
    backgroundColor: '#492542',
    borderColor: '#492542',
  },
  langChipText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#555',
  },
  langChipTextSelected: {
    color: '#fff',
  },
  hint: {
    fontSize: 11,
    color: '#AAA',
    textAlign: 'center',
    marginTop: 4,
  },
});
