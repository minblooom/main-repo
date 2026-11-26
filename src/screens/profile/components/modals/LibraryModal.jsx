// src/screens/profile/components/modals/LibraryModal.jsx
// Displays user's saved content exclusively bookmarked from the Chill & Soundscapes space.
// Styles extracted to src/screens/profile/styles/LibraryModal.styles.js.

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  Alert,
  Platform,
} from 'react-native';
import { useTheme } from '../../../../theme/ThemeContext';
import { chillLibraryStorage } from '../../../../services/chillLibraryStorage';
import { useAudioPlayer } from '../../../../core/audio/AudioPlayerContext';
import { styles } from '../../styles/LibraryModal.styles';

export const LibraryModal = ({ visible, onClose, onNavigateChill, theme: propTheme }) => {
  const { theme: ctxTheme } = useTheme();
  const theme = propTheme || ctxTheme;
  const { currentEpisode, isPlaying: audioPlaying, playEpisode } = useAudioPlayer();

  const [savedItems, setSavedItems] = useState([]);
  const [readingItem, setReadingItem] = useState(null);

  useEffect(() => {
    if (!visible) return;
    chillLibraryStorage.getAll().then(setSavedItems).catch(() => setSavedItems([]));
  }, [visible]);

  const handleOpenItem = (item) => {
    if (item.audioUrl) {
      playEpisode({
        id: item.id,
        title: item.title,
        collectionName: item.author || item.category,
        audioUrl: item.audioUrl,
      });
      return;
    }
    setReadingItem(item);
  };

  const performDelete = async (id) => {
    const next = await chillLibraryStorage.removeItem(id);
    setSavedItems(next);
    if (readingItem?.id === id) setReadingItem(null);
  };

  const handleRemove = (id, title) => {
    if (Platform.OS === 'web') {
      if (typeof window === 'undefined' || window.confirm(`Remove "${title}" from your saved Chill Space moments?`)) {
        performDelete(id);
      }
      return;
    }
    Alert.alert(
      'Remove from Library',
      `Remove "${title}" from your saved Chill Space moments?`,
      [
        { text: 'Keep', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => performDelete(id),
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
            {readingItem ? (
              <View style={[styles.itemCard, { backgroundColor: readingItem.bg || theme.heroBg }]}>
                <TouchableOpacity
                  onPress={() => setReadingItem(null)}
                  style={{ marginBottom: 10, alignSelf: 'flex-start' }}
                >
                  <Text style={{ fontSize: 12.5, fontWeight: '800', color: readingItem.color || theme.accent }}>
                    ← Back to Saved Library
                  </Text>
                </TouchableOpacity>
                <Text style={[styles.itemCat, { color: readingItem.color || theme.accent, marginBottom: 4 }]}>
                  {readingItem.icon} {readingItem.category} · OFFLINE READY
                </Text>
                <Text style={[styles.itemTitle, { fontSize: 17, marginBottom: 6 }]}>{readingItem.title}</Text>
                {readingItem.author ? (
                  <Text style={{ fontSize: 12, color: theme.textMuted, marginBottom: 10 }}>
                    By {readingItem.author}
                  </Text>
                ) : null}
                <Text style={[styles.itemDesc, { lineHeight: 22 }]}>
                  {readingItem.body || readingItem.desc}
                </Text>
              </View>
            ) : savedItems.length === 0 ? (
              <View style={styles.emptyWrap}>
                <Text style={styles.emptyIcon}>🌙</Text>
                <Text style={styles.emptyTitle}>Your Chill Library is empty</Text>
                <Text style={styles.emptySub}>
                  Save stories, essays, or podcasts in Chill & Soundscapes to keep them available offline here.
                </Text>
                {onNavigateChill && (
                  <TouchableOpacity
                    style={[styles.playBtn, { backgroundColor: theme.accent, marginTop: 14, paddingHorizontal: 18 }]}
                    onPress={() => {
                      onClose?.();
                      onNavigateChill();
                    }}
                  >
                    <Text style={styles.playBtnText}>Explore Chill Space →</Text>
                  </TouchableOpacity>
                )}
              </View>
            ) : (
              savedItems.map((item) => {
                const isPlaying = Boolean(item.audioUrl) && currentEpisode?.id === item.id && audioPlaying;
                return (
                  <View key={item.id} style={[styles.itemCard, { backgroundColor: item.bg || '#EDF5EE' }]}>
                    <View style={styles.itemTop}>
                      <View style={styles.catWrap}>
                        <Text style={{ fontSize: 13 }}>{item.icon || '🌿'}</Text>
                        <Text style={[styles.itemCat, { color: item.color || '#2C5A38' }]}>{item.category}</Text>
                      </View>
                      <Text style={[styles.itemDate, { color: item.color || '#2C5A38' }]}>
                        {item.duration ? `⏱ ${item.duration}` : '📥 Offline'}
                      </Text>
                    </View>

                    <Text style={styles.itemTitle}>{item.title}</Text>
                    <Text style={styles.itemDesc} numberOfLines={3}>{item.desc}</Text>

                    {/* Card Actions */}
                    <View style={styles.cardActionsRow}>
                      <TouchableOpacity
                        style={[styles.playBtn, { backgroundColor: item.color || theme.accent }]}
                        onPress={() => handleOpenItem(item)}
                        activeOpacity={0.8}
                      >
                        <Text style={styles.playBtnText}>
                          {item.audioUrl
                            ? isPlaying
                              ? '⏸ Pause Episode'
                              : '▶ Play Episode'
                            : '📖 Read Offline'}
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
