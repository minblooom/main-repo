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
  StyleSheet,
} from 'react-native';
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

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 24,
  },
  modalBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(26, 16, 36, 0.55)',
  },
  floatingModalCard: {
    width: '100%',
    maxWidth: 780,
    maxHeight: '92%',
    borderRadius: 26,
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 24,
    shadowColor: '#1A1024',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.25,
    shadowRadius: 30,
    elevation: 16,
  },
  floatingModalCardWide: { paddingHorizontal: 32 },
  modalTopHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  modalBackBtn: { paddingVertical: 4, paddingHorizontal: 6 },
  modalBackBtnText: { fontSize: 13, fontWeight: '700' },
  modalCloseCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FAF5EE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalCloseCircleText: { fontSize: 14, color: '#8B6DA8', fontWeight: '700' },
  modalTitleBlock: { gap: 4, marginBottom: 12 },
  modalKickerTag: { fontSize: 9.5, fontWeight: '800', letterSpacing: 0.9 },
  modalMainTitle: { fontSize: 26, fontWeight: '800', letterSpacing: -0.5 },
  modalSubTitle: { fontSize: 13, lineHeight: 18 },
  modalInnerScroll: { paddingVertical: 4 },
});
