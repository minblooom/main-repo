// src/screens/profile/components/modals/HelpSupportModal.jsx
// Immediate crisis helplines, FAQ, and gentle feedback without stigma or county names.

import React from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  Linking,
  Alert,
} from 'react-native';
import { useTheme } from '../../../../theme/ThemeContext';

export const HelpSupportModal = ({ visible, onClose, theme: propTheme }) => {
  const { theme: ctxTheme } = useTheme();
  const theme = propTheme || ctxTheme;
  const callHelpline = (num) => {
    Linking.openURL(`tel:${num}`).catch(() => {
      Alert.alert('Phone Helpline', `Dial ${num} directly on your mobile device for immediate confidential support.`);
    });
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={[styles.modalCard, { backgroundColor: theme.cardBg }]}>
          <View style={styles.header}>
            <View>
              <Text style={[styles.tag, { color: theme.textMuted }]}>ALWAYS AVAILABLE</Text>
              <Text style={[styles.title, { color: theme.textPrimary }]}>Help & Support</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn} activeOpacity={0.7}>
              <Text style={styles.closeBtnText}>✕</Text>
            </TouchableOpacity>
          </View>

          <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
            If you or a friend are feeling overwhelmed, you are never alone. Confidential, free, and stigma-free.
          </Text>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
            {/* Urgent Hotline 1199 */}
            <View style={styles.urgentBanner}>
              <View style={styles.urgentHeader}>
                <Text style={styles.urgentTag}>24/7 TOLL-FREE HELPLINE</Text>
                <Text style={styles.urgentBadge}>FREE</Text>
              </View>
              <Text style={styles.urgentTitle}>Kenya Red Cross Hotline: 1199</Text>
              <Text style={styles.urgentDesc}>
                Immediate psychological support, active listening, and gentle crisis guidance.
              </Text>
              <TouchableOpacity
                style={styles.callBtn}
                onPress={() => callHelpline('1199')}
                activeOpacity={0.88}
              >
                <Text style={styles.callBtnText}>Call 1199 Now →</Text>
              </TouchableOpacity>
            </View>

            {/* Befrienders Kenya */}
            <View style={styles.supportRow}>
              <View style={styles.supportInfo}>
                <Text style={styles.supportName}>Befrienders Kenya</Text>
                <Text style={styles.supportDesc}>Emotional support and listening line: +254 722 178 177</Text>
              </View>
              <TouchableOpacity
                style={styles.actionPill}
                onPress={() => callHelpline('+254722178177')}
                activeOpacity={0.8}
              >
                <Text style={styles.actionPillText}>Call</Text>
              </TouchableOpacity>
            </View>

            {/* FAQs */}
            <View style={styles.faqCard}>
              <Text style={styles.faqTitle}>Frequently Asked Questions</Text>
              <Text style={styles.faqQ}>Is MindBloom medical therapy?</Text>
              <Text style={styles.faqA}>
                MindBloom is a wellness sanctuary and mindful habit companion designed for East African youth. It provides grounding tools, breathwork, and peer support — not formal medical diagnosis or psychiatric prescription.
              </Text>

              <Text style={styles.faqQ}>Who can see my journal entries?</Text>
              <Text style={styles.faqA}>
                Only you. All journal entries and reflections are stored locally on your device.
              </Text>
            </View>
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

import { styles } from '../../styles/HelpSupportModal.styles';
