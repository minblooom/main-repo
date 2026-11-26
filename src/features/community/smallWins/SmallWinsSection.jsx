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
import { COMPANION_MAP } from '../../../constants/companions';
import { AnimatedCompanion } from '../../../components/companion/AnimatedCompanion';
import { GardenStrip } from '../encouragement/GardenStrip';
import { soundService } from '../../../screens/arcade/audio/soundService';
import { useCommunityStore } from '../store/communityStore';
import { onboardingStorage } from '../../../services/onboardingStorage';
import { VoiceInputControls } from '../../../components/voice/VoiceInputControls';
import { VoiceNotePlayer } from '../../../components/voice/VoiceNotePlayer';
import { Modal } from 'react-native';

const CATEGORIES = [
  { id: 'all', label: 'All Wins 🌱' },
  { id: 'personal', label: 'Personal 🌿' },
  { id: 'school', label: 'Campus/School 📚' },
  { id: 'work', label: 'Hustle/Work 💼' },
  { id: 'healing', label: 'Healing/Body 🌺' },
];

export const SmallWinsSection = ({ companionId: propCompanionId = 'noodle' }) => {
  const { theme, companionId: globalCompanionId } = useTheme();
  const activeCompanionId = propCompanionId || globalCompanionId || 'noodle';
  const companion = COMPANION_MAP[activeCompanionId] || COMPANION_MAP.noodle;
  const { wins, addWin, toggleCheerWin } = useCommunityStore();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [newWinText, setNewWinText] = useState('');
  const [draftVoiceNote, setDraftVoiceNote] = useState(null);
  const [postCategory, setPostCategory] = useState('personal');
  const [authorName, setAuthorName] = useState('You · MindBloom');
  const [celebrationWin, setCelebrationWin] = useState(null);

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
    const postedText = newWinText.trim() || 'Voice small win 🎙️';
    addWin(newWinText.trim(), postCategory, authorName, draftVoiceNote);
    setNewWinText('');
    setDraftVoiceNote(null);
    setCelebrationWin(postedText);
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

        <TouchableOpacity
          style={[styles.postBtn, { backgroundColor: theme.accent, opacity: newWinText.trim() || draftVoiceNote ? 1 : 0.6 }]}
          onPress={handlePostWin}
          disabled={!newWinText.trim() && !draftVoiceNote}
          activeOpacity={0.85}
        >
          <Text style={styles.postBtnText}>Plant Your Win 🌱</Text>
        </TouchableOpacity>
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

              <View style={styles.winFooter}>
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
              </View>
            </View>
          ))}
        </View>
      )}

      {/* Companion Celebration Modal when user posts a Small Win */}
      <Modal
        visible={!!celebrationWin}
        transparent
        animationType="fade"
        onRequestClose={() => setCelebrationWin(null)}
      >
        <View style={{ flex: 1, backgroundColor: 'rgba(20, 12, 24, 0.6)', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <View
            style={{
              width: '100%',
              maxWidth: 380,
              backgroundColor: theme.cardBg || '#FFFFFF',
              borderRadius: 28,
              padding: 24,
              alignItems: 'center',
              borderWidth: 1.5,
              borderColor: theme.heroBorder || '#E8DFF2',
            }}
          >
            <Text style={{ fontSize: 28, marginBottom: 6 }}>🎉✨🌸</Text>
            <AnimatedCompanion
              companionId={activeCompanionId}
              size={104}
              state="happy"
              interactive={false}
            />
            <Text style={{ fontSize: 18, fontWeight: '900', color: theme.textPrimary || '#2A192E', textAlign: 'center', marginTop: 10 }}>
              {companion.name} is cheering for you!
            </Text>
            <Text style={{ fontSize: 13.5, color: theme.textSecondary || '#5C4D60', textAlign: 'center', marginTop: 8, lineHeight: 20 }}>
              "Look at you go! Every small win matters — whether it's resting, drinking water, or showing up today. Your garden just bloomed brighter."
            </Text>
            <View style={{ backgroundColor: theme.heroBg || '#F7F3FB', borderRadius: 14, paddingHorizontal: 14, paddingVertical: 10, marginTop: 14, width: '100%' }}>
              <Text style={{ fontSize: 12.5, fontStyle: 'italic', color: theme.accent || '#42213D', textAlign: 'center', fontWeight: '700' }} numberOfLines={2}>
                "{celebrationWin}"
              </Text>
            </View>
            <TouchableOpacity
              style={[styles.postBtn, { backgroundColor: theme.accent || '#42213D', width: '100%', marginTop: 16 }]}
              onPress={() => setCelebrationWin(null)}
              activeOpacity={0.85}
            >
              <Text style={styles.postBtnText}>Thank you, {companion.name} 💛</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
