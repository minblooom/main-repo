// src/screens/profile/components/modals/HelpSupportModal.jsx
// Immediate crisis helplines, FAQ, and gentle feedback without stigma or county names.
// Dynamically tailored to the user's selected home base / country.

import React from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  Linking,
  Alert,
  Platform,
} from 'react-native';
import { useTheme } from '../../../../theme/ThemeContext';
import { useI18n } from '../../../../services/i18n';
import { styles } from '../../styles/HelpSupportModal.styles';

export const HelpSupportModal = ({ visible, onClose, theme: propTheme }) => {
  const { theme: ctxTheme } = useTheme();
  const theme = propTheme || ctxTheme;
  const { countryData, t } = useI18n();

  const callHelpline = (num) => {
    if (!num) {
      Linking.openURL('https://befrienders.org').catch(() => {});
      return;
    }
    if (Platform.OS === 'web') {
      window.alert(`Helpline Contact:\n\nPlease call ${num} on your mobile device for immediate, confidential emotional support.`);
      return;
    }
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
              <Text style={[styles.tag, { color: theme.textMuted }]}>ALWAYS AVAILABLE · {countryData?.name?.toUpperCase()}</Text>
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
            {/* Urgent Regional Hotline */}
            <View style={styles.urgentBanner}>
              <View style={styles.urgentHeader}>
                <Text style={styles.urgentTag}>24/7 CRISIS HELPLINE</Text>
                <Text style={styles.urgentBadge}>FREE</Text>
              </View>
              <Text style={styles.urgentTitle}>{countryData?.helplineName || 'Local Support'}</Text>
              <Text style={styles.urgentDesc}>
                Immediate psychological support, active listening, and confidential crisis guidance in {countryData?.name}.
              </Text>
              <TouchableOpacity
                style={styles.callBtn}
                onPress={() => callHelpline(countryData?.primaryCallNum || countryData?.helplinePhone)}
                activeOpacity={0.88}
              >
                <Text style={styles.callBtnText}>
                  {countryData?.primaryCallNum ? `Call ${countryData.primaryCallNum} Now →` : 'Open Support Directory →'}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Secondary Support Line if available */}
            {countryData?.secondaryCallNum && (
              <View style={styles.supportRow}>
                <View style={styles.supportInfo}>
                  <Text style={styles.supportName}>Secondary Listening Line</Text>
                  <Text style={styles.supportDesc}>{countryData.secondaryCallNum}</Text>
                </View>
                <TouchableOpacity
                  style={styles.actionPill}
                  onPress={() => callHelpline(countryData.secondaryCallNum)}
                  activeOpacity={0.8}
                >
                  <Text style={styles.actionPillText}>Call</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* Befrienders Worldwide / Global Backup */}
            <View style={styles.supportRow}>
              <View style={styles.supportInfo}>
                <Text style={styles.supportName}>Befrienders Worldwide & IASP</Text>
                <Text style={styles.supportDesc}>Confidential global emotional support directory</Text>
              </View>
              <TouchableOpacity
                style={styles.actionPill}
                onPress={() => Linking.openURL('https://befrienders.org').catch(() => {})}
                activeOpacity={0.8}
              >
                <Text style={styles.actionPillText}>Visit</Text>
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
