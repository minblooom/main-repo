// src/screens/profile/components/modals/PrivacyDataModal.jsx
// Explain current data storage and available privacy controls without overstating support.

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
      'Export is not available yet',
      'A complete export of your account and on-device data is not implemented yet.'
    );
  };

  const handleClearCache = () => {
    Alert.alert(
      'Cache clearing is not available yet',
      'This control does not currently remove cached images or audio.'
    );
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={[styles.modalCard, { backgroundColor: theme.cardBg }]}>
          <View style={styles.header}>
            <View>
              <Text style={[styles.tag, { color: theme.textMuted }]}>DATA STORAGE SUMMARY</Text>
              <Text style={[styles.title, { color: theme.textPrimary }]}>Privacy & Data</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn} activeOpacity={0.7}>
              <Text style={styles.closeBtnText}>✕</Text>
            </TouchableOpacity>
          </View>

          <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
            Some data stays on this device; account, mood, and community data can sync to MindBloom services.
          </Text>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
            <View style={styles.infoCard}>
              <Text style={styles.infoTitle}>🔒 Private device storage</Text>
              <Text style={styles.infoText}>
                Journal text and saved Aurora history are encrypted on this device. Native voice-note audio is stored locally but is not protected by the same app-level encryption. Profile preferences and mood check-ins sync to MindBloom. Aurora sends your message and up to 6 recent messages to Google Gemini; MindBloom does not store chat transcripts in your account database.
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
                <Text style={styles.actionTitle}>Export My Data · Not available yet</Text>
                <Text style={styles.actionDesc}>A complete account and device data export is not implemented yet</Text>
              </View>
              <Text style={styles.actionArrow}>→</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionRow} onPress={handleClearCache} activeOpacity={0.8}>
              <View>
                <Text style={styles.actionTitle}>Clear Temporary Cache · Not available yet</Text>
                <Text style={styles.actionDesc}>This control does not currently clear cached media</Text>
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
