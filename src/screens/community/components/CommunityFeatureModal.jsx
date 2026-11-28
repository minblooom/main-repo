// src/screens/community/components/CommunityFeatureModal.jsx
// Centered floating dialog modal matching NotificationSettingsModal design.

import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Modal,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  } from 'react-native';
import { styles } from './styles/CommunityFeatureModal.styles';
import { useTheme } from '../../../theme/ThemeContext';

export const CommunityFeatureModal = ({
  visible,
  onClose,
  kicker,
  title,
  subtitle,
  isWide,
  children,
}) => {
  const { theme } = useTheme();

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={true}
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.modalOverlay}
      >
        <TouchableWithoutFeedback onPress={onClose}>
          <View style={styles.modalBackdrop} />
        </TouchableWithoutFeedback>

        <View
          style={[
            styles.floatingModalCard,
            { backgroundColor: theme.cardBg },
            isWide && styles.floatingModalCardWide,
          ]}
        >
          <View style={styles.modalTopHeader}>
            <TouchableOpacity onPress={onClose} style={styles.modalBackBtn} activeOpacity={0.7}>
              <Text style={[styles.modalBackBtnText, { color: theme.textMuted }]}>
                ‹ Back to Baraza
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onClose} style={styles.modalCloseCircle} activeOpacity={0.7}>
              <Text style={styles.modalCloseCircleText}>✕</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.modalTitleBlock}>
            <Text style={[styles.modalKickerTag, { color: theme.textMuted }]}>{kicker}</Text>
            <Text style={[styles.modalMainTitle, { color: theme.textPrimary }]}>{title}</Text>
            <Text style={[styles.modalSubTitle, { color: theme.textSecondary }]}>{subtitle}</Text>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.modalInnerScroll}>
            {children}
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};
