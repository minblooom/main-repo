// src/screens/onboarding/components/OnboardingHeader.jsx
// Standard header for onboarding steps

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '../../../theme/colors';

export const OnboardingHeader = ({ navigation, showBack = true, onBack, rightElement }) => {
  const handleBack = () => {
    if (onBack) {
      onBack();
    } else if (navigation?.canGoBack?.()) {
      navigation.goBack();
    }
  };

  return (
    <View style={styles.header}>
      <Text style={styles.brandTitle}>mindbloom</Text>
      <View style={styles.rightGroup}>
        {rightElement}
        {showBack && (
          <TouchableOpacity onPress={handleBack} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <Text style={styles.backText}>← Back</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 12,
    paddingBottom: 16,
    width: '100%',
  },
  brandTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.brand,
    letterSpacing: -0.4,
  },
  rightGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  backText: {
    fontSize: 13,
    color: '#8B6DA8',
    fontWeight: '600',
  },
});
