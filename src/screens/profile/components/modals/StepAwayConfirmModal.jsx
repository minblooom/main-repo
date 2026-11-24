// src/screens/profile/components/modals/StepAwayConfirmModal.jsx
// Peaceful in-app confirmation popup for "Step away for a moment"
// Prevents accidental sign-outs and reassures user of local data safety.

import React from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
} from 'react-native';
import { useTheme } from '../../../../theme/ThemeContext';
import { styles } from '../../styles/StepAwayConfirmModal.styles';

export const StepAwayConfirmModal = ({
  visible,
  onClose,
  onConfirm,
  theme: propTheme,
}) => {
  const { theme: ctxTheme } = useTheme();
  const theme = propTheme || ctxTheme;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={[styles.modalCard, { backgroundColor: theme.cardBg, borderColor: theme.heroBorder }]}>
          {/* Mascot / Peaceful Badge */}
          <View style={[styles.mascotWrap, { backgroundColor: theme.heroBg, borderColor: theme.heroBorder }]}>
            <Text style={styles.mascotIcon}>🍃</Text>
          </View>

          <Text style={[styles.tag, { color: theme.textMuted }]}>MINDFUL PAUSE</Text>
          <Text style={[styles.title, { color: theme.textPrimary }]}>Take a gentle pause?</Text>

          <Text style={[styles.message, { color: theme.textSecondary }]}>
            Are you sure you want to step away from your sanctuary? Don't worry — your space will wait patiently for you.
          </Text>

          {/* Safety reassurance card */}
          <View style={[styles.bulletCard, { backgroundColor: theme.heroBg, borderColor: theme.heroBorder }]}>
            <View style={styles.bulletRow}>
              <Text style={styles.bulletIcon}>🔒</Text>
              <Text style={[styles.bulletText, { color: theme.textPrimary }]}>
                Your reflections and journal entries remain encrypted on this device.
              </Text>
            </View>
            <View style={styles.bulletRow}>
              <Text style={styles.bulletIcon}>🌱</Text>
              <Text style={[styles.bulletText, { color: theme.textPrimary }]}>
                Your streak and glowing seeds are safely preserved.
              </Text>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionRow}>
            {/* Primary Action: Stay in sanctuary (Safe default) */}
            <TouchableOpacity
              style={[styles.stayBtn, { backgroundColor: theme.accent }]}
              onPress={onClose}
              activeOpacity={0.85}
            >
              <Text style={[styles.stayBtnText, { color: '#FFFFFF' }]}>Stay in sanctuary</Text>
            </TouchableOpacity>

            {/* Secondary Action: Step away */}
            <TouchableOpacity
              style={[styles.leaveBtn, { backgroundColor: theme.cardBg, borderColor: theme.heroBorder }]}
              onPress={() => {
                onClose();
                onConfirm?.();
              }}
              activeOpacity={0.8}
            >
              <Text style={[styles.leaveBtnText, { color: theme.textMuted }]}>Step away for a moment</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};
