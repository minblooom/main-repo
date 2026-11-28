// src/screens/onboarding/components/OnboardingHeader.jsx
// Unified header for all onboarding screens, matching the Signup header in Screenshot 2

import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { styles } from './styles/OnboardingHeader.styles';
import { colors } from '../../../theme/colors';
import { useI18n } from '../../../services/i18n';
import { showAlert } from '../../../utils/alert';

export const OnboardingHeader = ({ navigation, showBack = true, onBack }) => {
  const { language, availableLanguages, cycleLanguage, t } = useI18n();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else if (navigation?.canGoBack?.()) {
      navigation.goBack();
    }
  };

  const handleSupportPress = () => {
    showAlert('Urgent Support', t('urgent_support_alert'));
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

        <TouchableOpacity onPress={handleSupportPress} activeOpacity={0.7}>
          <Text style={styles.urgentLink}>Need urgent support?</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
