// src/screens/profile/components/RoomToGrowSection.jsx
// "Room to grow" & "A little support" sections
// Clean English text, Learned Vocabulary removed, and dynamic legal popup integration.

import React from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { useTheme } from '../../../theme/ThemeContext';

export const RoomToGrowSection = ({
  onHelpPress,
  onTermsPress,
  onDisclaimerPress,
}) => {
  const { theme } = useTheme();

  const handlePeerMentorsPress = () => {
    Alert.alert(
      'Peer Mentors & Therapists',
      'This feature is currently blossoming and will arrive in our upcoming release. Thank you for your patience! 🌸'
    );
  };

  return (
    <View style={styles.container}>
      {/* Room to grow */}
      <View style={[styles.section, { backgroundColor: theme.cardBg, borderColor: theme.heroBorder }]}>
        <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>
          Room to grow
        </Text>

        {/* Peer Mentors · Therapists */}
        <TouchableOpacity
          style={[styles.row, { borderBottomWidth: 0 }]}
          onPress={handlePeerMentorsPress}
          activeOpacity={0.75}
        >
          <View style={styles.rowText}>
            <Text style={[styles.rowLabel, { color: theme.textPrimary }]}>
              Peer Mentors · Therapists
            </Text>
            <Text style={[styles.rowSublabel, { color: theme.textMuted }]}>
              My Sessions
            </Text>
          </View>
          <View style={[styles.soonBadge, { backgroundColor: theme.heroBg }]}>
            <Text style={[styles.soonText, { color: theme.textSecondary }]}>Soon</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* A little support */}
      <View style={[styles.section, { backgroundColor: theme.cardBg, borderColor: theme.heroBorder }]}>
        <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>
          A little support
        </Text>

        {/* Help & Support */}
        <TouchableOpacity
          style={[styles.row, { borderBottomColor: theme.heroBorder }]}
          onPress={onHelpPress}
          activeOpacity={0.75}
        >
          <Text style={[styles.rowLabel, { color: theme.textPrimary }]}>Help & Support</Text>
          <Text style={[styles.arrow, { color: theme.textMuted }]}>›</Text>
        </TouchableOpacity>

        {/* Terms of Service & Privacy Policy */}
        <TouchableOpacity
          style={[styles.row, { borderBottomColor: theme.heroBorder }]}
          onPress={onTermsPress}
          activeOpacity={0.75}
        >
          <Text style={[styles.rowLabel, { color: theme.textPrimary }]}>Terms of Service & Privacy Policy</Text>
          <Text style={[styles.arrow, { color: theme.textMuted }]}>›</Text>
        </TouchableOpacity>

        {/* Mental Health Disclaimer */}
        <TouchableOpacity
          style={[styles.row, { borderBottomWidth: 0 }]}
          onPress={onDisclaimerPress}
          activeOpacity={0.75}
        >
          <Text style={[styles.rowLabel, { color: theme.textPrimary }]}>Mental Health Disclaimer</Text>
          <Text style={[styles.arrow, { color: theme.textMuted }]}>›</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

import { styles } from '../styles/RoomToGrowSection.styles';
