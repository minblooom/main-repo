// src/features/community/smallWins/SmallWinsSection.jsx
// Categorized Small Wins Garden combining react-frontend's categories and teammate's GardenStrip.

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { useTheme } from '../../../theme/ThemeContext';
import { GardenStrip } from '../encouragement/GardenStrip';
import { soundService } from '../../../screens/arcade/audio/soundService';

const CATEGORIES = [
  { id: 'all', label: 'All Wins 🌟' },
  { id: 'personal', label: 'Personal 🌿' },
  { id: 'school', label: 'Campus/School 📚' },
  { id: 'work', label: 'Hustle/Work 💼' },
  { id: 'healing', label: 'Healing/Body 🌺' },
];

const INITIAL_WINS = [
  {
    id: '1',
    author: 'Wanjiku',
    category: 'personal',
    text: 'Drank a full glass of cold water and sat in the sun for 10 minutes instead of scrolling in the dark.',
    cheers: 24,
    hasCheered: false,
    time: '20m ago',
  },
  {
    id: '2',
    author: 'Kevo_Nbo',
    category: 'school',
    text: 'Submitted my statistics assignment after 3 days of feeling paralyzed. Done is better than perfect!',
    cheers: 42,
    hasCheered: true,
    time: '1h ago',
  },
  {
    id: '3',
    author: 'Amina',
    category: 'healing',
    text: 'Didn’t apologize for resting today. Said no to an extra favor that would have drained my battery.',
    cheers: 31,
    hasCheered: false,
    time: '3h ago',
  },
  {
    id: '4',
    author: 'Brian_M',
    category: 'work',
    text: 'Finally responded to that client email that was giving me anxiety since Friday. Weight lifted!',
    cheers: 19,
    hasCheered: false,
    time: '5h ago',
  },
];

export const SmallWinsSection = ({ companionId = 'noodle' }) => {
  const { theme } = useTheme();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [wins, setWins] = useState(INITIAL_WINS);
  const [newWinText, setNewWinText] = useState('');
  const [postCategory, setPostCategory] = useState('personal');

  const filteredWins = wins.filter(
    (w) => selectedCategory === 'all' || w.category === selectedCategory
  );

  const handleCheer = (winId) => {
    soundService.playPop();
    setWins((prev) =>
      prev.map((w) => {
        if (w.id === winId) {
          const nextState = !w.hasCheered;
          return {
            ...w,
            cheers: nextState ? w.cheers + 1 : Math.max(0, w.cheers - 1),
            hasCheered: nextState,
          };
        }
        return w;
      })
    );
  };

  const handlePostWin = () => {
    if (!newWinText.trim()) return;
    soundService.playVictory();
    const newEntry = {
      id: Date.now().toString(),
      author: 'You (Champion)',
      category: postCategory,
      text: newWinText.trim(),
      cheers: 1,
      hasCheered: true,
      time: 'Just now',
    };
    setWins([newEntry, ...wins]);
    setNewWinText('');
    Alert.alert(
      'Hongera sana! 🌸',
      'Your win was planted into the community garden. Every small step counts!'
    );
  };

  return (
    <View style={styles.container}>
      {/* Living Garden Strip from Teammate's work */}
      <View style={styles.gardenWrap}>
        <GardenStrip totalMembers={142} bloomingSeeds={89} companionId={companionId} />
      </View>

      {/* Post a Small Win Card */}
      <View style={[styles.createCard, { backgroundColor: theme.cardBg, borderColor: theme.heroBorder }]}>
        <Text style={[styles.createTitle, { color: theme.textPrimary }]}>Celebrate a Small Win Today ✨</Text>
        <Text style={[styles.createSubtitle, { color: theme.textMuted }]}>
          Got out of bed? Drank water? Sent that email? No step is too small.
        </Text>

        <TextInput
          style={[styles.input, { color: theme.textPrimary, borderColor: theme.divider, backgroundColor: theme.bg }]}
          placeholder="Share your quiet victory today..."
          placeholderTextColor={theme.textMuted}
          value={newWinText}
          onChangeText={setNewWinText}
          multiline
        />

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
          style={[styles.postBtn, { backgroundColor: theme.accent, opacity: newWinText.trim() ? 1 : 0.6 }]}
          onPress={handlePostWin}
          disabled={!newWinText.trim()}
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

      {/* Wins Feed */}
      <View style={styles.winsList}>
        {filteredWins.map((win) => (
          <View
            key={win.id}
            style={[styles.winCard, { backgroundColor: theme.cardBg, borderColor: theme.divider }]}
          >
            <View style={styles.winHeader}>
              <Text style={[styles.authorName, { color: theme.accent }]}>🌿 {win.author}</Text>
              <Text style={[styles.winTime, { color: theme.textMuted }]}>{win.time}</Text>
            </View>

            <Text style={[styles.winText, { color: theme.textPrimary }]}>{win.text}</Text>

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
    fontSize: 13,
    marginBottom: 14,
  },
  input: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 12,
    minHeight: 70,
    textAlignVertical: 'top',
    fontSize: 14,
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
  catPillActive: {},
  catPillText: {
    fontSize: 11.5,
    fontWeight: '600',
  },
  postBtn: {
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: 'center',
  },
  postBtnText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 14,
  },
  filterScroll: {
    gap: 8,
    paddingBottom: 16,
  },
  filterPill: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
  },
  filterPillActive: {},
  filterText: {
    fontSize: 13,
    fontWeight: '600',
  },
  winsList: {
    gap: 12,
  },
  winCard: {
    padding: 16,
    borderRadius: 18,
    borderWidth: 1,
  },
  winHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  authorName: {
    fontSize: 13,
    fontWeight: '800',
  },
  winTime: {
    fontSize: 11,
  },
  winText: {
    fontSize: 14.5,
    lineHeight: 21,
    marginBottom: 12,
  },
  winFooter: {
    flexDirection: 'row',
    alignItems: 'center',
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
  cheerBtnActive: {},
  cheerEmoji: {
    fontSize: 14,
  },
  cheerCount: {
    fontSize: 12,
    fontWeight: '600',
  },
});
