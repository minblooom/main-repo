// src/features/community/components/SuggestionStatusList.jsx
import React from 'react';
import { View, Text } from 'react-native';
import { useTheme } from '../../../theme/ThemeContext';
import { styles } from './styles/SuggestionStatusList.styles';

const STATUS_LABEL = {
  pending: 'Waiting for review',
  approved: 'Approved',
  rejected: 'Not approved',
};

export const SuggestionStatusList = ({ suggestions }) => {
  const { theme } = useTheme();

  if (suggestions.length === 0) {
    return <Text style={[styles.empty, { color: theme.textMuted }]}>Suggestions you send will show here.</Text>;
  }

  return (
    <View style={styles.list}>
      <Text style={[styles.heading, { color: theme.textPrimary }]}>Your suggestions</Text>
      {suggestions.map((s) => (
        <View key={s.id} style={[styles.card, { backgroundColor: theme.cardBg, borderColor: theme.divider }]}>
          <View style={styles.top}>
            <Text style={[styles.title, { color: theme.textPrimary }]}>{s.title}</Text>
            <Text style={[styles.badge, { color: theme.accent }]}>{STATUS_LABEL[s.status] ?? STATUS_LABEL.pending}</Text>
          </View>
          <Text style={[styles.description, { color: theme.textSecondary }]}>{s.description}</Text>
          {s.status === 'rejected' && !!s.rejectionReason && (
            <Text style={[styles.reason, { color: theme.textSecondary }]}>Reason: {s.rejectionReason}</Text>
          )}
        </View>
      ))}
    </View>
  );
};