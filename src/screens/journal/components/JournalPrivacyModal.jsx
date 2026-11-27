// src/screens/journal/components/JournalPrivacyModal.jsx
// Dedicated in-app Privacy Settings Modal for the Journal
// Explains local storage limits, provides the Discreet Screen Shield toggle,
// text export, and direct link to full privacy policy.

import React from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  Switch,
  Alert,
} from 'react-native';
import { useTheme } from '../../../theme/ThemeContext';
import { styles } from '../styles/JournalPrivacyModal.styles';

export const JournalPrivacyModal = ({
  visible,
  onClose,
  onOpenPrivacyPolicy,
  onExportEntries,
}) => {
  const { theme, privacyShield, togglePrivacyShield } = useTheme();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={[styles.modalCard, { backgroundColor: theme.cardBg, borderColor: theme.heroBorder }]}>
          {/* Header */}
          <View style={styles.headerRow}>
            <Text style={[styles.tag, { color: theme.textMuted }]}>PRIVATE SANCTUARY</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn} activeOpacity={0.7}>
              <Text style={[styles.closeBtnText, { color: theme.textSecondary }]}>✕</Text>
            </TouchableOpacity>
          </View>

          <Text style={[styles.title, { color: theme.textPrimary }]}>Journal Privacy Settings</Text>
          <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
            Journal text is encrypted on this device. Some related features have different privacy limits.
          </Text>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
            {/* 1. Local storage details */}
            <View style={[styles.infoCard, { backgroundColor: theme.heroBg, borderColor: theme.heroBorder }]}>
              <View style={styles.infoTitleTitleRow || styles.infoTitleRow}>
                <Text style={styles.infoIcon}>🔒</Text>
                <Text style={[styles.infoTitle, { color: theme.textPrimary }]}>On-device journal storage</Text>
              </View>
              <Text style={[styles.infoBody, { color: theme.textSecondary }]}>
                Journal text is encrypted locally and is not synced to MindBloom's account database. Voice-note audio is stored locally; on native devices it is not protected by the journal's app-level encryption layer.
              </Text>
            </View>

            {/* 2. Discreet Screen Shield Toggle */}
            <View style={[styles.toggleCard, { backgroundColor: theme.cardBg, borderColor: theme.heroBorder }]}>
              <View style={styles.toggleLeft}>
                <Text style={[styles.toggleTitle, { color: theme.textPrimary }]}>
                  Discreet Privacy Shield 🛡️
                </Text>
                <Text style={[styles.toggleDesc, { color: theme.textMuted }]}>
                  Mask and soften reflection text on screen when writing in campus halls, matatus, or shared spaces.
                </Text>
              </View>
              <Switch
                value={privacyShield}
                onValueChange={togglePrivacyShield}
                trackColor={{ false: theme.heroBorder, true: theme.accent }}
                thumbColor={privacyShield ? '#FFFFFF' : theme.bg}
              />
            </View>

            {/* 3. Export Reflections */}
            <TouchableOpacity
              style={[styles.actionCard, { backgroundColor: theme.cardBg, borderColor: theme.heroBorder }]}
              onPress={() => {
                if (onExportEntries) {
                  onExportEntries();
                } else {
                  Alert.alert(
                    'Journal export unavailable',
                    'Text export is currently available only on web. Voice-note audio is not included.'
                  );
                }
              }}
              activeOpacity={0.8}
            >
              <View style={styles.actionLeft}>
                <Text style={[styles.actionTitle, { color: theme.textPrimary }]}>
                  Export Journal Text (.txt; unencrypted)
                </Text>
                <Text style={[styles.actionDesc, { color: theme.textMuted }]}>
                  Web only; exports text reflections, not voice notes. Anyone with the file can read it.
                </Text>
              </View>
              <Text style={[styles.actionArrow, { color: theme.accent }]}>↓</Text>
            </TouchableOpacity>

            {/* 4. Full Privacy Disclosures */}
            <TouchableOpacity
              style={[styles.actionCard, { backgroundColor: theme.cardBg, borderColor: theme.heroBorder }]}
              onPress={() => {
                onClose();
                onOpenPrivacyPolicy?.();
              }}
              activeOpacity={0.8}
            >
              <View style={styles.actionLeft}>
                <Text style={[styles.actionTitle, { color: theme.textPrimary }]}>
                  MindBloom Privacy Policy
                </Text>
                <Text style={[styles.actionDesc, { color: theme.textMuted }]}>
                  Learn how data is stored and which services process it.
                </Text>
              </View>
              <Text style={[styles.actionArrow, { color: theme.accent }]}>→</Text>
            </TouchableOpacity>
          </ScrollView>

          <TouchableOpacity
            style={[styles.doneBtn, { backgroundColor: theme.accent }]}
            onPress={onClose}
            activeOpacity={0.88}
          >
            <Text style={[styles.doneBtnText, { color: '#FFFFFF' }]}>Done</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};
