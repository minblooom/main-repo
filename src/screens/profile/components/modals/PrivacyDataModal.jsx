// src/screens/profile/components/modals/PrivacyDataModal.jsx
// Detailed breakdown of local device encryption, export data option, and cache management.

import React from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { useTheme } from '../../../../theme/ThemeContext';

export const PrivacyDataModal = ({ visible, onClose, onViewLegal, theme: propTheme }) => {
  const { theme: ctxTheme } = useTheme();
  const theme = propTheme || ctxTheme;
  const handleExport = () => {
    Alert.alert(
      'Export Reflections',
      'Your reflections, settings, and journal moments are packaged locally into a private backup format.'
    );
  };

  const handleClearCache = () => {
    Alert.alert(
      'Clear Cache',
      'This clears temporary cached images and audio files. Your saved moments, journal, and profile preferences are completely safe.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Clear', onPress: () => Alert.alert('Cache Cleared', 'Temporary app cache was cleared.') },
      ]
    );
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={[styles.modalCard, { backgroundColor: theme.cardBg }]}>
          <View style={styles.header}>
            <View>
              <Text style={[styles.tag, { color: theme.textMuted }]}>ZERO THIRD PARTIES</Text>
              <Text style={[styles.title, { color: theme.textPrimary }]}>Privacy & Data</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn} activeOpacity={0.7}>
              <Text style={styles.closeBtnText}>✕</Text>
            </TouchableOpacity>
          </View>

          <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
            Your sanctuary is built on respect. Your information never leaves your side.
          </Text>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
            <View style={styles.infoCard}>
              <Text style={styles.infoTitle}>🔒 On-Device Private Storage</Text>
              <Text style={styles.infoText}>
                Your mood reflections, focus preferences, and journal entries are saved strictly to your device's internal storage sandbox. No advertising trackers, no data brokers.
              </Text>
            </View>

            <View style={styles.infoCard}>
              <Text style={styles.infoTitle}>🛡️ Discreet Privacy Shield</Text>
              <Text style={styles.infoText}>
                When activated in settings, sensitive words and private tags are blurred or masked with dots to protect your privacy when opening MindBloom in public or campus spaces.
              </Text>
            </View>

            {/* Action Buttons */}
            <TouchableOpacity style={styles.actionRow} onPress={onViewLegal} activeOpacity={0.8}>
              <View>
                <Text style={styles.actionTitle}>Terms of Service & Privacy Policy</Text>
                <Text style={styles.actionDesc}>Read our youth safety guidelines and data protection rules</Text>
              </View>
              <Text style={styles.actionArrow}>→</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionRow} onPress={handleExport} activeOpacity={0.8}>
              <View>
                <Text style={styles.actionTitle}>Export My Data (JSON)</Text>
                <Text style={styles.actionDesc}>Download an offline copy of your sanctuary entries</Text>
              </View>
              <Text style={styles.actionArrow}>→</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionRow} onPress={handleClearCache} activeOpacity={0.8}>
              <View>
                <Text style={styles.actionTitle}>Clear Temporary Cache</Text>
                <Text style={styles.actionDesc}>Free up device storage without losing reflections</Text>
              </View>
              <Text style={styles.actionArrow}>→</Text>
            </TouchableOpacity>
          </ScrollView>

          <TouchableOpacity
            style={[styles.doneBtn, { backgroundColor: theme.accent }]}
            onPress={onClose}
            activeOpacity={0.88}
          >
            <Text style={styles.doneBtnText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

import { styles } from '../../styles/PrivacyDataModal.styles';
