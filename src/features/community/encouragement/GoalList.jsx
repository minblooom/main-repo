// src/features/community/components/GoalList.jsx
import React, { useState } from 'react';
import { View, Text, TextInput, Pressable } from 'react-native';
import { useTheme } from '../../../theme/ThemeContext';
import { currentStreak, todayKey } from '../utils/dateKeys';
import { styles } from './styles/GoalList.styles';

export const GoalList = ({ goals, canAdd, maxGoals, onAdd, onToggle, onRemove }) => {
  const { theme } = useTheme();
  const [draft, setDraft] = useState('');
  const [error, setError] = useState(null);
  const today = todayKey();
  const canSubmit = draft.trim().length > 0;

  const handleAdd = async () => {
    if (!canSubmit) return;
    const ok = await onAdd(draft);
    if (ok) { setDraft(''); setError(null); }
    else setError('We couldn’t save that goal. Try again.');
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.cardBg, borderColor: theme.divider }]}>
      <Text style={[styles.heading, { color: theme.textPrimary }]}>What am I working on?</Text>
      <Text style={[styles.hint, { color: theme.textSecondary }]}>
        Small goals work best. Mark one done on the days you do it.
      </Text>

      {goals.length === 0 && (
        <Text style={[styles.hint, { color: theme.textMuted }]}>No goals yet. Add one small thing you’d like to do.</Text>
      )}

      {goals.map((goal) => {
        const doneToday = goal.completedDates.includes(today);
        const streak = currentStreak(goal.completedDates);
        return (
          <View key={goal.id} style={[styles.goal, { backgroundColor: theme.bg, borderColor: theme.divider }]}>
            <View style={styles.goalTop}>
              <Text style={[styles.goalTitle, { color: theme.textPrimary }]}>{goal.title}</Text>
              <Pressable accessibilityRole="button" accessibilityLabel={`Remove ${goal.title}`} onPress={() => onRemove(goal.id)} hitSlop={8}>
                <Text style={[styles.remove, { color: theme.textMuted }]}>Remove</Text>
              </Pressable>
            </View>
            <Text style={[styles.meta, { color: theme.textMuted }]}>
              {streak > 0 ? `${streak}-day streak` : 'Start today'}
            </Text>
            <Pressable
              accessibilityRole="button"
              accessibilityState={{ selected: doneToday }}
              onPress={() => onToggle(goal.id)}
              style={[
                styles.toggle,
                { borderColor: theme.accent, backgroundColor: doneToday ? theme.accent : theme.cardBg },
              ]}
            >
              <Text style={[styles.toggleText, { color: doneToday ? theme.bg : theme.accent }]}>
                {doneToday ? '✓ Done today' : 'Mark done today'}
              </Text>
            </Pressable>
          </View>
        );
      })}

      {canAdd ? (
        <View style={styles.addRow}>
          <TextInput
            accessibilityLabel="New goal"
            value={draft}
            onChangeText={(t) => { setDraft(t); setError(null); }}
            onSubmitEditing={handleAdd}
            returnKeyType="done"
            placeholder="e.g. a ten-minute walk"
            placeholderTextColor={theme.textMuted}
            maxLength={60}
            style={[styles.input, { color: theme.textPrimary, borderColor: theme.divider, backgroundColor: theme.bg }]}
          />
          <Pressable
            accessibilityRole="button"
            accessibilityState={{ disabled: !canSubmit }}
            disabled={!canSubmit}
            onPress={handleAdd}
            style={[styles.addButton, { backgroundColor: theme.accent }, !canSubmit && styles.dimmed]}
          >
            <Text style={[styles.addText, { color: theme.bg }]}>Add</Text>
          </Pressable>
        </View>
      ) : (
        <Text style={[styles.hint, { color: theme.textSecondary }]}>
          You’ve reached {maxGoals} goals. Remove one to add another.
        </Text>
      )}

      {!!error && <Text style={[styles.hint, { color: theme.accent }]} accessibilityLiveRegion="polite">{error}</Text>}
    </View>
  );
};