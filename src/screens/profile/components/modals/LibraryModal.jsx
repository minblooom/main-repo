// src/screens/profile/components/modals/LibraryModal.jsx
// Displays user's saved content exclusively bookmarked from the Chill & Soundscapes space.
// Styles extracted to src/screens/profile/styles/LibraryModal.styles.js.

import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { useTheme } from '../../../../theme/ThemeContext';
import { styles } from '../../styles/LibraryModal.styles';

const INITIAL_CHILL_ITEMS = [
  {
    id: 'cs_1',
    category: 'CHILL SOUNDSCAPE',
    title: 'Savanna Twilight Breeze',
    desc: 'Gentle dusk wind rustling through acacia boughs, distant crickets, and evening calm.',
    duration: '12 MIN',
    date: 'SAVED FROM CHILL SPACE',
    bg: '#F5EBE1',
    color: '#8A531C',
    icon: '🌾',
  },
  {
    id: 'cs_2',
    category: 'GUIDED BREATHWORK',
    title: 'Tulia 4-7-8 Deep Rhythm',
    desc: 'Inhale peace (4s), hold stillness (7s), release physical tension (8s). Calms the nervous system.',
    duration: '5 MIN',
    date: 'SAVED FROM CHILL SPACE',
    bg: '#EDF5EE',
    color: '#2C5A38',
    icon: '🫧',
  },
  {
    id: 'cs_3',
    category: 'CHILL SOUNDSCAPE',
    title: 'Mount Kenya Gentle Rain',
    desc: 'Soft mountain shower pattering on broad leaves for deep focus and emotional reset.',
    duration: '20 MIN',
    date: 'SAVED FROM CHILL SPACE',
    bg: '#EAF1F8',
    color: '#1E4D6B',
    icon: '🌧️',
  },
  {
    id: 'cs_4',
    category: 'SLEEP STORY',
    title: 'Starlit Mara Night Walk',
    desc: 'A gentle guided auditory bedtime journey across the peaceful, starlit African savanna.',
    duration: '15 MIN',
    date: 'SAVED FROM CHILL SPACE',
    bg: '#F0EAFA',
    color: '#492542',
    icon: '✨',
  },
  {
    id: 'cs_5',
    category: 'MINDFUL RESONANCE',
    title: 'Acacia Stream & Windchimes',
    desc: 'Flowing forest brook with organic bamboo windchimes to dissolve mental clutter.',
    duration: '8 MIN',
    date: 'SAVED FROM CHILL SPACE',
    bg: '#FAF4E8',
    color: '#7D5A18',
    icon: '🍃',
  },
];

export const LibraryModal = ({ visible, onClose, onNavigateChill, theme: propTheme }) => {
  const { theme: ctxTheme } = useTheme();
  const theme = propTheme || ctxTheme;

  const [savedItems, setSavedItems] = useState(INITIAL_CHILL_ITEMS);
  const [playingId, setPlayingId] = useState(null);

  const handlePlayItem = (item) => {
    if (playingId === item.id) {
      setPlayingId(null);
    } else {
      setPlayingId(item.id);
      Alert.alert(
        `Now Playing: ${item.title}`,
        `Streaming relaxing audio from Chill & Soundscapes (${item.duration}). Take a slow, gentle breath.`,
        [
          { text: 'Close', style: 'cancel' },
          {
            text: 'Go to Chill Space',
            onPress: () => {
              onClose?.();
              onNavigateChill?.();
            },
          },
        ]
      );
    }
  };

  const handleRemove = (id, title) => {
    Alert.alert(
      'Remove from Library',
      `Remove "${title}" from your saved Chill Space moments?`,
      [
        { text: 'Keep', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => {
            setSavedItems((prev) => prev.filter((item) => item.id !== id));
          },
        },
      ]
    );
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={[styles.modalCard, { backgroundColor: theme.cardBg }]}>
          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={[styles.tag, { color: theme.textMuted }]}>SAVED FROM CHILL SPACE</Text>
              <Text style={[styles.title, { color: theme.textPrimary }]}>My Chill Library</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn} activeOpacity={0.7}>
              <Text style={styles.closeBtnText}>✕</Text>
            </TouchableOpacity>
          </View>

          <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
            Your bookmarked soundscapes, guided breathwork, and sleep audio from the Chill & Soundscapes sanctuary.
          </Text>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
            {savedItems.length === 0 ? (
              <View style={styles.emptyWrap}>
                <Text style={styles.emptyIcon}>🌙</Text>
                <Text style={styles.emptyTitle}>Your Chill Library is empty</Text>
                <Text style={styles.emptySub}>
                  Bookmark soundscapes and breath sessions in Chill & Soundscapes to keep them handy here.
                </Text>
              </View>
            ) : (
              savedItems.map((item) => {
                const isPlaying = playingId === item.id;
                return (
                  <View key={item.id} style={[styles.itemCard, { backgroundColor: item.bg }]}>
                    <View style={styles.itemTop}>
                      <View style={styles.catWrap}>
                        <Text style={{ fontSize: 13 }}>{item.icon}</Text>
                        <Text style={[styles.itemCat, { color: item.color }]}>{item.category}</Text>
                      </View>
                      <Text style={[styles.itemDate, { color: item.color }]}>⏱ {item.duration}</Text>
                    </View>

                    <Text style={styles.itemTitle}>{item.title}</Text>
                    <Text style={styles.itemDesc}>{item.desc}</Text>

                    {/* Card Actions */}
                    <View style={styles.cardActionsRow}>
                      <TouchableOpacity
                        style={[styles.playBtn, { backgroundColor: item.color }]}
                        onPress={() => handlePlayItem(item)}
                        activeOpacity={0.8}
                      >
                        <Text style={styles.playBtnText}>
                          {isPlaying ? '⏸ Pause Audio' : '▶ Play Soundscape'}
                        </Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={styles.unsaveBtn}
                        onPress={() => handleRemove(item.id, item.title)}
                        activeOpacity={0.7}
                      >
                        <Text style={styles.unsaveBtnText}>Remove</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                );
              })
            )}
          </ScrollView>

          <TouchableOpacity
            style={[styles.doneBtn, { backgroundColor: theme.accent || '#492542' }]}
            onPress={onClose}
            activeOpacity={0.88}
          >
            <Text style={styles.doneBtnText}>Close Library</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};
