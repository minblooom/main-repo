// src/features/community/components/SuggestGroupForm.jsx
import React, { useState } from 'react';
import { View, Text, TextInput, Pressable } from 'react-native';
import { useTheme } from '../../../theme/ThemeContext';
import { styles } from './styles/SuggestGroupForm.styles';

const MAX_TITLE = 40;
const MAX_DESCRIPTION = 200;

export const SuggestGroupForm = ({ onSubmit }) => {
  const { theme } = useTheme();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  const canSubmit = title.trim().length > 0 && description.trim().length > 0 && !saving;

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setSaving(true);
    const ok = await onSubmit({ title, description });
    setSaving(false);
    if (ok) {
      setTitle('');
      setDescription('');
      setError(null);
    } else {
      setError('We couldn’t send your suggestion. Try again.');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.cardBg, borderColor: theme.divider }]}>
      <Text style={[styles.heading, { color: theme.textPrimary }]}>Suggest a group</Text>
      <Text style={[styles.hint, { color: theme.textSecondary }]}>
        Suggestions are reviewed by a moderator before they appear. Keep it kind, and avoid sharing
        personal details.
      </Text>

      <TextInput
        accessibilityLabel="Group title"
        value={title}
        onChangeText={(t) => { setTitle(t); setError(null); }}
        placeholder="Group title"
        placeholderTextColor={theme.textMuted}
        maxLength={MAX_TITLE}
        style={[styles.input, { color: theme.textPrimary, borderColor: theme.divider, backgroundColor: theme.bg }]}
      />

      <TextInput
        accessibilityLabel="Group description"
        value={description}
        onChangeText={(t) => { setDescription(t); setError(null); }}
        placeholder="What is this group for?"
        placeholderTextColor={theme.textMuted}
        maxLength={MAX_DESCRIPTION}
        multiline
        textAlignVertical="top"
        style={[styles.input, styles.multiline, { color: theme.textPrimary, borderColor: theme.divider, backgroundColor: theme.bg }]}
      />

      <View style={styles.footer}>
        <Text style={[styles.counter, { color: theme.textMuted }]}>{description.length}/{MAX_DESCRIPTION}</Text>
        <Pressable
          accessibilityRole="button"
          accessibilityState={{ disabled: !canSubmit }}
          disabled={!canSubmit}
          onPress={handleSubmit}
          style={({ pressed }) => [
            styles.button,
            { backgroundColor: theme.accent },
            (!canSubmit || pressed) && styles.dimmed,
          ]}
        >
          <Text style={[styles.buttonText, { color: theme.bg }]}>
            {saving ? 'Sending…' : 'Submit suggestion'}
          </Text>
        </Pressable>
      </View>

      {!!error && (
        <Text style={[styles.error, { color: theme.accent }]} accessibilityLiveRegion="polite">
          {error}
        </Text>
      )}
    </View>
  );
};