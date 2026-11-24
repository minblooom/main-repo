// src/features/community/components/CheckInEntryModal.jsx
import React, { useEffect, useState } from 'react';
import { Modal, View, Text, TextInput, Pressable, ScrollView } from 'react-native';
import { useTheme } from '../../../theme/ThemeContext';
import { MOODS, moodLabel } from '../data/checkInMoods';
import { formatDayLabel } from '../utils/dateKeys';
import { styles } from '../spaces/styles/CommunitySheet.styles';

export const CheckInEntryModal = ({ visible, entry, onClose, onSave, onDelete }) => {
  const { theme } = useTheme();
  const [editing, setEditing] = useState(false);
  const [mood, setMood] = useState(null);
  const [note, setNote] = useState('');
  const [armed, setArmed] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

  // Reset whenever a different entry (or a saved change) comes in
  useEffect(() => {
    setEditing(false);
    setArmed(false);
    setError(null);
    setMood(entry?.mood ?? null);
    setNote(entry?.note ?? '');
  }, [entry]);

  if (!entry) return null;

  const cancelEdit = () => {
    setMood(entry.mood);
    setNote(entry.note ?? '');
    setEditing(false);
    setError(null);
  };

  const save = async () => {
    if (!mood || busy) return;
    setBusy(true);
    setError(null);
    const ok = await onSave(entry.date, { mood, note });
    setBusy(false);
    if (!ok) setError('We couldn’t save that change. Try again.');
  };

  const remove = async () => {
    if (!armed) {
      setArmed(true);
      return;
    }
    setBusy(true);
    const ok = await onDelete(entry.date);
    setBusy(false);
    if (ok) onClose();
    else setError('We couldn’t let that go just yet. Take a breath and try again.');
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={[styles.card, { backgroundColor: theme.bg, borderColor: theme.divider }]}>
          <View style={styles.header}>
            <View style={{ flex: 1, gap: 2 }}>
              <Text style={[styles.kicker, { color: theme.textMuted }]}>
                {formatDayLabel(entry.date).toUpperCase()}
              </Text>
              <Text style={[styles.title, { color: theme.textPrimary }]}>{moodLabel(entry.mood)}</Text>
            </View>
            <Pressable accessibilityRole="button" accessibilityLabel="Close" onPress={onClose} style={styles.closeBtn}>
              <Text style={[styles.closeText, { color: theme.textSecondary }]}>✕</Text>
            </Pressable>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} style={{ flexShrink: 1 }}>
            {editing ? (
              <View style={styles.body}>
                <View style={styles.chipRow}>
                  {MOODS.map((m) => {
                    const selected = mood === m.key;
                    return (
                      <Pressable
                        key={m.key}
                        accessibilityRole="button"
                        accessibilityState={{ selected }}
                        onPress={() => setMood(m.key)}
                        style={[
                          styles.chip,
                          { borderColor: selected ? theme.accent : theme.divider, backgroundColor: selected ? theme.navActive : theme.cardBg },
                        ]}
                      >
                        <Text style={[styles.chipText, { color: selected ? theme.textPrimary : theme.textSecondary }]}>
                          {m.label}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>
                <TextInput
                  accessibilityLabel="Edit note"
                  value={note}
                  onChangeText={setNote}
                  multiline
                  maxLength={200}
                  placeholder="Add a note (optional)"
                  placeholderTextColor={theme.textMuted}
                  style={[styles.input, { color: theme.textPrimary, borderColor: theme.divider, backgroundColor: theme.cardBg }]}
                />
              </View>
            ) : (
              <View style={styles.body}>
                <Text style={[styles.bodyText, { color: entry.note ? theme.textPrimary : theme.textMuted }]}>
                  {entry.note || 'No note for this day.'}
                </Text>
              </View>
            )}
          </ScrollView>

          {!!error && (
            <Text style={[styles.error, { color: theme.accent }]} accessibilityLiveRegion="polite">{error}</Text>
          )}

          <View style={styles.footer}>
            <Pressable
              accessibilityRole="button"
              onPress={remove}
              disabled={busy}
              style={[styles.pill, { borderColor: theme.divider, backgroundColor: theme.cardBg }]}
            >
              <Text style={[styles.pillText, { color: theme.accent }]}>
                {armed ? 'Tap again to let go' : 'Let go'}
              </Text>
            </Pressable>

            <View style={styles.rightActions}>
              {editing ? (
                <>
                  <Pressable accessibilityRole="button" onPress={cancelEdit} style={[styles.pill, { borderColor: theme.divider, backgroundColor: theme.cardBg }]}>
                    <Text style={[styles.pillText, { color: theme.textSecondary }]}>Cancel</Text>
                  </Pressable>
                  <Pressable
                    accessibilityRole="button"
                    accessibilityState={{ disabled: !mood || busy }}
                    onPress={save}
                    disabled={!mood || busy}
                    style={[styles.primaryBtn, { backgroundColor: theme.accent }, (!mood || busy) && styles.dimmed]}
                  >
                    <Text style={[styles.primaryText, { color: theme.bg }]}>{busy ? 'Saving…' : 'Save'}</Text>
                  </Pressable>
                </>
              ) : (
                <Pressable accessibilityRole="button" onPress={() => setEditing(true)} style={[styles.primaryBtn, { backgroundColor: theme.accent }]}>
                  <Text style={[styles.primaryText, { color: theme.bg }]}>Edit</Text>
                </Pressable>
              )}
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};