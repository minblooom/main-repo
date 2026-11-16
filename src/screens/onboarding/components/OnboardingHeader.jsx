// src/screens/onboarding/components/OnboardingHeader.jsx
// Unified header for all onboarding screens, matching the Signup header in Screenshot 2

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { colors } from '../../../theme/colors';

export const OnboardingHeader = ({ navigation, showBack = true, onBack }) => {
  const [language, setLanguage] = useState('EN');

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else if (navigation?.canGoBack?.()) {
      navigation.goBack();
    }
  };

  const handleSupportPress = () => {
    Alert.alert(
      'Urgent Support',
      'If you need immediate help, reach out to the Kenya Red Cross Hotline at 1199 or Befrienders Kenya at +254 722 178 177. You are not alone.',
      [{ text: 'Understood', style: 'default' }]
    );
  };

  return (
    <View style={styles.topHeader}>
      <Text style={styles.brandTitle}>mindbloom</Text>

      <View style={styles.headerRightLinks}>
        {showBack && (
          <TouchableOpacity
            onPress={handleBack}
            style={styles.backBtn}
            activeOpacity={0.7}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Text style={styles.backText}>← Back</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          onPress={() => setLanguage(language === 'EN' ? 'SW' : 'EN')}
          style={styles.langBtn}
          activeOpacity={0.7}
        >
          <Text style={styles.langText}>
            <Text style={language === 'EN' ? styles.langActive : styles.langInactive}>EN</Text>
            {' | '}
            <Text style={language === 'SW' ? styles.langActive : styles.langInactive}>SW</Text>
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleSupportPress} activeOpacity={0.7}>
          <Text style={styles.urgentLink}>Need urgent support?</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
    paddingHorizontal: 4,
    width: '100%',
  },
  brandTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.brand,
    letterSpacing: -0.5,
  },
  headerRightLinks: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  backBtn: {
    paddingVertical: 4,
    paddingHorizontal: 4,
  },
  backText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  langBtn: {
    paddingVertical: 4,
    paddingHorizontal: 6,
  },
  langText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: colors.textMuted,
  },
  langActive: {
    color: colors.textPrimary,
    fontWeight: '800',
  },
  langInactive: {
    color: colors.textMuted,
  },
  urgentLink: {
    fontSize: 11.5,
    color: colors.textSecondary,
    textDecorationLine: 'underline',
  },
});
