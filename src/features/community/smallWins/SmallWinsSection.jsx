// src/features/community/smallWins/SmallWinsSection.jsx
// Categorized Small Wins Garden combining real persistent user victories with dynamic GardenStrip.

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Platform,
} from 'react-native';
import { useTheme } from '../../../theme/ThemeContext';
import { GardenStrip } from '../encouragement/GardenStrip';
import { soundService } from '../../../screens/arcade/audio/soundService';
import { useCommunityStore } from '../store/communityStore';
import { onboardingStorage } from '../../../services/onboardingStorage';
import { VoiceInputControls } from '../../../components/voice/VoiceInputControls';
import { VoiceNotePlayer } from '../../../components/voice/VoiceNotePlayer';

const CATEGORIES = [
  { id: 'all', label: 'All Wins 🌟' },
  { id: 'personal', label: 'Personal 🌿' },
  { id: 'school', label: 'Campus/School 📚' },
  { id: 'work', label: 'Hustle/Work 💼' },
  { id: 'healing', label: 'Healing/Body 🌺' },
];

export const SmallWinsSection = ({ companionId = 'noodle' }) => {
  const { theme } = useTheme();
  const { wins, addWin, editWin, deleteWin, toggleCheerWin } = useCommunityStore();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [newWinText, setNewWinText] = useState('');
  const [draftVoiceNote, setDraftVoiceNote] = useState(null);
  const [editingWinId, setEditingWinId] = useState(null);
  const [postCategory, setPostCategory] = useState('personal');
  const [authorName, setAuthorName] = useState('You · MindBloom');

  useEffect(() => {
    async function loadUserName() {
      try {
        const prefs = await onboardingStorage.getPreferences();
        if (prefs?.name || prefs?.nickname) {
          setAuthorName(`${prefs.name || prefs.nickname} · MindBloom`);
        }
      } catch {}
    }
    loadUserName();
  }, []);

  const filteredWins = wins.filter(
    (w) => selectedCategory === 'all' || w.category === selectedCategory
  );

  const handleCheer = (winId) => {
    soundService.playPop();
    toggleCheerWin(winId);
  };

  const handlePostWin = () => {
    if (!newWinText.trim() && !draftVoiceNote) return;
    soundService.playVictory();
    if (editingWinId) {
      editWin(editingWinId, newWinText.trim(), postCategory);
      setEditingWinId(null);
      setNewWinText('');
      setDraftVoiceNote(null);
      return;
    }
    addWin(newWinText.trim(), postCategory, authorName, draftVoiceNote);
    setNewWinText('');
    setDraftVoiceNote(null);
  };

  const handleStartEditWin = (win) => {
    setEditingWinId(win.id);
    setNewWinText(win.text || '');
    setPostCategory(win.category || 'personal');
  };

  const handleDeleteWin = (winId) => {
    const doDelete = () => {
      deleteWin(winId);
      if (editingWinId === winId) {
        setEditingWinId(null);
        setNewWinText('');
      }
    };
    if (Platform.OS === 'web') {
      if (window.confirm('Delete this small win from your garden?')) {
        doDelete();
      }
      return;
    }
    Alert.alert('Delete Small Win', 'Remove this small win from your garden?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: doDelete },
    ]);
  };

  const dynamicPlants = wins.map((w, idx) => ({
    id: w.id,
    stage: 'blooming',
  }));

  return (
    <View style={styles.container}>
      {/* Living Garden Strip reflecting real planted wins */}
      <View style={styles.gardenWrap}>
        <GardenStrip plants={dynamicPlants} streak={wins.length > 0 ? 1 : 0} />
      </View>

      {/* Post a Small Win Card */}
      <View style={[styles.createCard, { backgroundColor: theme.cardBg, borderColor: theme.heroBorder }]}>
        <Text style={[styles.createTitle, { color: theme.textPrimary }]}>Celebrate a Small Win Today ✨</Text>
        <Text style={[styles.createSubtitle, { color: theme.textMuted }]}>
          Got out of bed? Drank water? Sent that email? No step is too small.
        </Text>

        <TextInput
          underlineColorAndroid="transparent"
          style={[
            styles.input,
            { color: theme.textPrimary, borderColor: theme.divider, backgroundColor: theme.bg },
            Platform.OS === 'web' && { outlineStyle: 'none', outlineWidth: 0 },
          ]}
          placeholder="Share your quiet victory today (or record/dictate below)..."
          placeholderTextColor={theme.textMuted}
          value={newWinText}
          onChangeText={setNewWinText}
          multiline
        />

        <View style={{ marginBottom: 12 }}>
          <VoiceInputControls
            voiceNote={draftVoiceNote}
            onVoiceNoteChange={setDraftVoiceNote}
            onAppendTranscript={(chunk) =>
              setNewWinText((prev) => (prev ? `${prev} ${chunk}` : chunk))
            }
            compact
          />
        </View>

        {/* Category Picker for Post */}
        <View style={styles.catPickerRow}>
          {CATEGORIES.filter((c) => c.id !== 'all').map((cat) => (
            <TouchableOpacity
              key={cat.id}
              style={[
                styles.catPill,
                { borderColor: theme.divider },
                postCategory === cat.id && [styles.catPillActive, { backgroundColor: theme.accentSoft, borderColor: theme.accent }],
              ]}
              onPress={() => setPostCategory(cat.id)}
            >
              <Text
                style={[
                  styles.catPillText,
                  { color: theme.textMuted },
                  postCategory === cat.id && { color: theme.accent, fontWeight: '800' },
                ]}
              >
                {cat.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={{ flexDirection: 'row', gap: 10 }}>
          {editingWinId && (
            <TouchableOpacity
              style={[styles.postBtn, { flex: 1, backgroundColor: theme.bg, borderWidth: 1, borderColor: theme.divider }]}
              onPress={() => {
                setEditingWinId(null);
                setNewWinText('');
              }}
              activeOpacity={0.8}
            >
              <Text style={[styles.postBtnText, { color: theme.textSecondary }]}>Cancel Edit</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={[styles.postBtn, { flex: 2, backgroundColor: theme.accent, opacity: newWinText.trim() || draftVoiceNote ? 1 : 0.6 }]}
            onPress={handlePostWin}
            disabled={!newWinText.trim() && !draftVoiceNote}
            activeOpacity={0.85}
          >
            <Text style={styles.postBtnText}>
              {editingWinId ? 'Save Changes ✓' : 'Plant Your Win 🌱'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Filter Tabs */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
        {CATEGORIES.map((cat) => {
          const isActive = selectedCategory === cat.id;
          return (
            <TouchableOpacity
              key={cat.id}
              style={[
                styles.filterPill,
                { backgroundColor: theme.cardBg, borderColor: theme.divider },
                isActive && [styles.filterPillActive, { backgroundColor: theme.accent, borderColor: theme.accent }],
              ]}
              onPress={() => setSelectedCategory(cat.id)}
            >
              <Text
                style={[
                  styles.filterText,
                  { color: theme.textSecondary },
                  isActive && { color: '#FFFFFF', fontWeight: '800' },
                ]}
              >
                {cat.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Wins Feed or Peaceful Empty State */}
      {filteredWins.length === 0 ? (
        <View style={[styles.emptyCard, { backgroundColor: theme.cardBg, borderColor: theme.divider }]}>
          <Text style={styles.emptyEmoji}>🌱</Text>
          <Text style={[styles.emptyTitle, { color: theme.textPrimary }]}>Your Garden is Calm & Ready</Text>
          <Text style={[styles.emptySubtitle, { color: theme.textMuted }]}>
            No wins recorded in this category yet. When you're ready, honor your first small step above.
          </Text>
        </View>
      ) : (
        <View style={styles.winsList}>
          {filteredWins.map((win) => (
            <View
              key={win.id}
              style={[styles.winCard, { backgroundColor: theme.cardBg, borderColor: theme.divider }]}
            >
              <View style={styles.winHeader}>
                <Text style={[styles.authorName, { color: theme.accent }]}>🌿 {win.author}</Text>
                <Text style={[styles.winTime, { color: theme.textMuted }]}>{win.createdAt}</Text>
              </View>

              {!!win.text && (
                <Text style={[styles.winText, { color: theme.textPrimary }]}>{win.text}</Text>
              )}

              {win.voiceNote && (
                <View style={{ marginBottom: 12 }}>
                  <VoiceNotePlayer voiceNote={win.voiceNote} compact />
                </View>
              )}

              <View style={[styles.winFooter, { justifyContent: 'space-between' }]}>
                <TouchableOpacity
                  style={[
                    styles.cheerBtn,
                    { borderColor: theme.divider },
                    win.hasCheered && [styles.cheerBtnActive, { backgroundColor: 'rgba(217, 107, 67, 0.15)', borderColor: '#D96B43' }],
                  ]}
                  onPress={() => handleCheer(win.id)}
                  activeOpacity={0.75}
                >
                  <Text style={styles.cheerEmoji}>{win.hasCheered ? '🌸' : '🌱'}</Text>
                  <Text
                    style={[
                      styles.cheerCount,
                      { color: theme.textSecondary },
                      win.hasCheered && { color: '#D96B43', fontWeight: '800' },
                    ]}
                  >
                    {win.cheers} {win.hasCheered ? 'Cheered!' : 'Cheer'}
                  </Text>
                </TouchableOpacity>

                <View style={{ flexDirection: 'row', gap: 8 }}>
                  <TouchableOpacity
                    style={[styles.cheerBtn, { borderColor: theme.divider }]}
                    onPress={() => handleStartEditWin(win)}
                    activeOpacity={0.75}
                  >
                    <Text style={[styles.cheerCount, { color: theme.textSecondary }]}>✏️ Edit</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.cheerBtn, { borderColor: theme.divider }]}
                    onPress={() => handleDeleteWin(win.id)}
                    activeOpacity={0.75}
                  >
                    <Text style={[styles.cheerCount, { color: '#C0392B' }]}>🗑️ Delete</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingBottom: 40,
  },
  gardenWrap: {
    marginBottom: 20,
  },
  createCard: {
    padding: 18,
    borderRadius: 20,
    borderWidth: 1.5,
    marginBottom: 24,
  },
  createTitle: {
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 4,
  },
  createSubtitle: {
    fontSize: 12.5,
    marginBottom: 14,
  },
  input: {
    minHeight: 80,
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
    fontSize: 14,
    lineHeight: 20,
    textAlignVertical: 'top',
    marginBottom: 12,
  },
  catPickerRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 14,
  },
  catPill: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    borderWidth: 1,
  },
  catPillActive: {
    borderWidth: 1,
  },
  catPillText: {
    fontSize: 11,
    fontWeight: '600',
  },
  postBtn: {
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  postBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
  filterScroll: {
    gap: 8,
    paddingBottom: 16,
  },
  filterPill: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 14,
    borderWidth: 1,
  },
  filterPillActive: {
    borderWidth: 1,
  },
  filterText: {
    fontSize: 12,
    fontWeight: '600',
  },
  winsList: {
    gap: 12,
  },
  winCard: {
    padding: 16,
    borderRadius: 18,
    borderWidth: 1,
    gap: 10,
  },
  winHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  authorName: {
    fontSize: 12,
    fontWeight: '800',
  },
  winTime: {
    fontSize: 10.5,
  },
  winText: {
    fontSize: 14,
    lineHeight: 20,
  },
  winFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  cheerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
  },
  cheerBtnActive: {
    borderWidth: 1,
  },
  cheerEmoji: {
    fontSize: 14,
  },
  cheerCount: {
    fontSize: 12,
    fontWeight: '700',
  },
  emptyCard: {
    padding: 32,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginVertical: 8,
  },
  emptyEmoji: {
    fontSize: 32,
    marginBottom: 4,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '800',
  },
  emptySubtitle: {
    fontSize: 12.5,
    lineHeight: 18,
    textAlign: 'center',
    maxWidth: 340,
  },
});
