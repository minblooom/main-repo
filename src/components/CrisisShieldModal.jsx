// src/components/CrisisShieldModal.jsx
// Immediate toll-free crisis resource overlay with pre-drafted SOS & Grounding button

import React from 'react';
import { View, Text, Modal, TouchableOpacity, Linking } from 'react-native';
import { styles } from './styles/CrisisShieldModal.styles';
import { Phone, Wind, MessageSquare, X } from 'lucide-react-native';
import { CRISIS_DIRECTORY } from '../core/safety/crisisHotlines';
import { useTheme } from '../theme/ThemeContext';

export const CrisisShieldModal = ({
  visible,
  onClose,
  onOpenGrounding,
  countryCode = 'KE',
}) => {
  const { theme } = useTheme();
  const hotlines = CRISIS_DIRECTORY[countryCode] || CRISIS_DIRECTORY.KE;
  const primaryResource = hotlines[0];

  const crisisRed = '#DC2626';

  const handleCall = () => {
    if (primaryResource?.number) {
      Linking.openURL(`tel:${primaryResource.number}`).catch(() => {});
    }
  };

  const handleSMS = () => {
    const sms = primaryResource?.smsNumber || primaryResource?.number;
    if (sms) {
      const msg = encodeURIComponent('Hello, I need immediate emotional support.');
      Linking.openURL(`sms:${sms}?body=${msg}`).catch(() => {});
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View
          style={[
            styles.modalCard,
            {
              backgroundColor: theme?.cardBg || '#FFFFFF',
              borderColor: crisisRed,
            },
          ]}
        >
          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <X size={20} color={theme?.textSecondary || '#5C4D60'} />
          </TouchableOpacity>

          <View style={[styles.badge, { backgroundColor: 'rgba(220, 38, 38, 0.12)' }]}>
            <Text style={[styles.badgeText, { color: crisisRed }]}>TOLL-FREE CRISIS SHIELD</Text>
          </View>

          <Text style={[styles.title, { color: theme?.textPrimary || '#2A192E' }]}>
            We Are Here With You
          </Text>
          <Text style={[styles.subtitle, { color: theme?.textSecondary || '#5C4D60' }]}>
            You do not have to carry this weight silently. Real human support is available right now at zero cost ({primaryResource?.name}).
          </Text>

          {/* Primary Call Button */}
          <TouchableOpacity
            style={[styles.actionBtn, { backgroundColor: crisisRed }]}
            onPress={handleCall}
          >
            <Phone size={18} color="#FFFFFF" />
            <Text style={styles.actionBtnText}>Call Now ({primaryResource?.number})</Text>
          </TouchableOpacity>

          {/* SOS SMS Button */}
          <TouchableOpacity
            style={[styles.actionBtnOutline, { borderColor: theme?.divider || '#E8DFF2' }]}
            onPress={handleSMS}
          >
            <MessageSquare size={18} color={theme?.textPrimary || '#2A192E'} />
            <Text style={[styles.actionBtnOutlineText, { color: theme?.textPrimary || '#2A192E' }]}>
              Send SOS SMS (Pre-drafted)
            </Text>
          </TouchableOpacity>

          {/* Grounding Button */}
          {onOpenGrounding && (
            <TouchableOpacity
              style={[styles.actionBtnGhost, { backgroundColor: 'rgba(16, 185, 129, 0.1)' }]}
              onPress={() => {
                onClose();
                onOpenGrounding();
              }}
            >
              <Wind size={18} color={theme?.accent || '#10B981'} />
              <Text style={[styles.actionBtnGhostText, { color: theme?.accent || '#10B981' }]}>
                Breathe First (Grounding Exercise)
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </Modal>
  );
};
