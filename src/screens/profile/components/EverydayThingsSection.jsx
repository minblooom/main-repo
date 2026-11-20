// src/screens/profile/components/EverydayThingsSection.jsx
// "Your everyday little things" — Library, Mood Analytics, Journal
// Clean English text and dynamic theme integration.

import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useTheme } from '../../../theme/ThemeContext';

const Row = ({ icon, label, sublabel, onPress, theme }) => (
  <TouchableOpacity
    style={[styles.row, { borderBottomColor: theme.heroBorder }]}
    onPress={onPress}
    activeOpacity={0.75}
  >
    <View style={[styles.iconWrap, { backgroundColor: theme.accentSoft }]}>
      <Text style={styles.icon}>{icon}</Text>
    </View>
    <View style={styles.rowText}>
      <Text style={[styles.rowLabel, { color: theme.textPrimary }]}>{label}</Text>
      {sublabel ? (
        <Text style={[styles.rowSublabel, { color: theme.textMuted }]}>{sublabel}</Text>
      ) : null}
    </View>
    <Text style={[styles.arrow, { color: theme.textMuted }]}>›</Text>
  </TouchableOpacity>
);

export const EverydayThingsSection = ({ onLibraryPress, onMoodPress, onJournalPress }) => {
  const { theme } = useTheme();

  return (
    <View style={[styles.section, { backgroundColor: theme.cardBg, borderColor: theme.heroBorder }]}>
      <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>
        Your everyday little things
      </Text>

      <Row
        icon="🔖"
        label="My Library (Saved)"
        sublabel="Your saved moments"
        onPress={onLibraryPress}
        theme={theme}
      />
      <Row
        icon="📊"
        label="Mood Analytics"
        sublabel="Notice your patterns"
        onPress={onMoodPress}
        theme={theme}
      />
      <Row
        icon="📓"
        label="Journal"
        sublabel="A little room to reflect"
        onPress={onJournalPress}
        theme={theme}
      />
    </View>
  );
};

import { styles } from '../styles/EverydayThingsSection.styles';
