import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Modal,
  Share,
} from 'react-native';
import { useTheme } from '../../../theme/ThemeContext';
import { initialMemes } from '../chillData';
import { styles } from '../styles/ChillScreen.styles';

export const MemesTab = () => {
  const { theme } = useTheme();
  const [localMemes, setLocalMemes] = useState(initialMemes.map((m) => ({ ...m, liked: false })));
  const [apiMemes, setApiMemes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedMemeIdx, setSelectedMemeIdx] = useState(-1);

  // Fetch wholesome memes from multiple subreddits via meme-api.com
  const fetchLiveMemes = useCallback(async () => {
    setLoading(true);
    try {
      const subs = ['wholesomememes', 'MadeMeSmile', 'me_irl'];
      const pickA = subs[Math.floor(Math.random() * subs.length)];
      const pickB = subs[(subs.indexOf(pickA) + 1) % subs.length];

      const results = await Promise.all(
        [pickA, pickB].map(async (sub) => {
          const res = await fetch(`https://meme-api.com/gimme/${sub}/8`);
          if (!res.ok) return [];
          const data = await res.json();
          return (data.memes || []).filter(
            (m) =>
              m.url &&
              !m.nsfw &&
              (m.url.endsWith('.jpg') || m.url.endsWith('.png') || m.url.endsWith('.webp'))
          );
        })
      );

      const seen = new Set();
      const merged = [];
      results.flat().forEach((m) => {
        if (!seen.has(m.url)) {
          seen.add(m.url);
          merged.push({ ...m, liked: false });
        }
      });
      setApiMemes(merged);
    } catch {
      // Offline fallback uses curated local cards cleanly
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLiveMemes();
  }, [fetchLiveMemes]);

  function handleLocalReact(id) {
    setLocalMemes((prev) =>
      prev.map((m) =>
        m.id === id
          ? { ...m, liked: !m.liked, ups: m.liked ? m.ups - 1 : m.ups + 1 }
          : m
      )
    );
  }

  function handleApiReact(idx) {
    setApiMemes((prev) =>
      prev.map((m, i) =>
        i === idx
          ? { ...m, liked: !m.liked, ups: m.liked ? m.ups - 1 : m.ups + 1 }
          : m
      )
    );
  }

  function handleShare(text) {
    Share.share({ message: `${text}\n\n— MindBloom Chill Space` }).catch(() => {});
  }

  const activeMeme = selectedMemeIdx >= 0 ? apiMemes[selectedMemeIdx] : null;

  return (
    <View>
      <View style={styles.sectionHeader}>
        <View>
          <Text style={[styles.sectionHeading, { color: theme?.textPrimary || '#2A192E' }]}>
            Live Wholesome Memes 🎭
          </Text>
          <Text style={[styles.sectionSubtext, { color: theme?.textMuted || '#7E726D' }]}>
            Tap any meme to view, react & share a gentle laugh
          </Text>
        </View>
        <TouchableOpacity
          style={[styles.smallBtn, { backgroundColor: theme?.heroBg || '#F1EBF8' }]}
          onPress={fetchLiveMemes}
        >
          <Text style={[styles.smallBtnText, { color: theme?.accent || '#42213D' }]}>Shuffle 🔀</Text>
        </TouchableOpacity>
      </View>

      {loading && (
        <View style={[styles.infoBox, { backgroundColor: theme?.cardBg || '#FFFFFF' }]}>
          <ActivityIndicator color={theme?.accent || '#42213D'} />
          <Text style={[styles.metaText, { marginTop: 8 }]}>Loading fresh wholesome memes...</Text>
        </View>
      )}

      {/* 2-Column Masonry Grid matching screenshot */}
      {apiMemes.length > 0 && (
        <View style={{ flexDirection: 'row', gap: 12, marginBottom: 16 }}>
          {[0, 1].map((col) => (
            <View key={col} style={{ flex: 1, gap: 12 }}>
              {apiMemes
                .map((m, idx) => ({ m, idx }))
                .filter(({ idx }) => idx % 2 === col)
                .map(({ m, idx }) => (
                  <TouchableOpacity
                    key={m.url}
                    style={[
                      styles.card,
                      {
                        padding: 0,
                        overflow: 'hidden',
                        marginBottom: 0,
                        backgroundColor: theme?.cardBg || '#FFFFFF',
                        borderColor: theme?.divider || '#E8DFF2',
                      },
                    ]}
                    onPress={() => setSelectedMemeIdx(idx)}
                    activeOpacity={0.88}
                  >
                    <Image
                      source={{ uri: m.url }}
                      style={{ width: '100%', height: 155 }}
                      resizeMode="cover"
                    />
                    <View style={{ padding: 12, gap: 6 }}>
                      <Text
                        style={{ fontSize: 12.5, fontWeight: '700', color: theme?.textPrimary || '#2A192E' }}
                        numberOfLines={2}
                      >
                        {m.title}
                      </Text>
                      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Text style={{ fontSize: 11, color: theme?.textMuted || '#7E726D' }}>
                          r/{m.subreddit}
                        </Text>
                        <Text style={{ fontSize: 12, fontWeight: '700', color: theme?.accent || '#E06D3B' }}>
                          ❤️ {m.ups}
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                ))}
            </View>
          ))}
        </View>
      )}

      {/* Relatable Local MindBloom Cards */}
      <Text style={[styles.sectionHeading, { fontSize: 15, marginBottom: 10, color: theme?.textPrimary || '#2A192E' }]}>
        Sanctuary Relatable Moments 🌿
      </Text>
      {localMemes.map((meme) => (
        <View
          key={meme.id}
          style={[
            styles.card,
            { backgroundColor: theme?.cardBg || '#FFFFFF', borderColor: theme?.divider || '#E8DFF2' },
          ]}
        >
          <Text style={[styles.tagText, { color: theme?.accent || '#E06D3B', marginBottom: 6 }]}>
            {meme.badge}
          </Text>
          <Text style={[styles.bodyText, { color: theme?.textPrimary || '#2A192E' }]}>{meme.title}</Text>
          <Text style={[styles.metaText, { marginBottom: 10 }]}>{meme.subtext}</Text>
          <View style={styles.cardBottom}>
            <TouchableOpacity style={styles.reactionPill} onPress={() => handleLocalReact(meme.id)}>
              <Text style={styles.actionText}>
                {meme.liked ? '❤️' : '🤍'} {meme.ups}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleShare(meme.title)}>
              <Text style={styles.actionText}>↗️ Share</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}

      {/* Cute Meme Viewer Popup */}
      <Modal
        visible={!!activeMeme}
        transparent
        animationType="fade"
        onRequestClose={() => setSelectedMemeIdx(-1)}
      >
        <View style={styles.modalBg}>
          <View
            style={[
              styles.modalCard,
              {
                backgroundColor: theme?.cardBg || '#FFFFFF',
                borderRadius: 28,
                borderWidth: 1,
                borderColor: theme?.divider || '#E8DFF2',
              },
            ]}
          >
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <Text style={[styles.tagText, { color: theme?.accent || '#E06D3B' }]}>
                r/{activeMeme?.subreddit}
              </Text>
              <TouchableOpacity onPress={() => setSelectedMemeIdx(-1)}>
                <Text style={{ fontSize: 17, fontWeight: '700', color: theme?.textMuted || '#7E726D' }}>✕</Text>
              </TouchableOpacity>
            </View>

            {activeMeme && (
              <>
                <Image
                  source={{ uri: activeMeme.url }}
                  style={{ width: '100%', height: 260, borderRadius: 16, marginBottom: 12 }}
                  resizeMode="contain"
                />
                <Text style={{ fontSize: 14.5, fontWeight: '700', color: theme?.textPrimary || '#2A192E', marginBottom: 12 }}>
                  {activeMeme.title}
                </Text>

                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <TouchableOpacity
                    style={[styles.reactionPill, { backgroundColor: theme?.heroBg || '#F5F1FA' }]}
                    onPress={() => handleApiReact(selectedMemeIdx)}
                  >
                    <Text style={styles.actionText}>
                      {activeMeme.liked ? '❤️' : '🤍'} {activeMeme.ups}
                    </Text>
                  </TouchableOpacity>

                  <View style={{ flexDirection: 'row', gap: 10 }}>
                    <TouchableOpacity
                      style={[styles.smallBtn, { backgroundColor: theme?.bg || '#F1EBF8' }]}
                      onPress={() =>
                        setSelectedMemeIdx((idx) => (idx - 1 + apiMemes.length) % apiMemes.length)
                      }
                    >
                      <Text style={styles.smallBtnText}>‹ Prev</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.smallBtn, { backgroundColor: theme?.bg || '#F1EBF8' }]}
                      onPress={() => setSelectedMemeIdx((idx) => (idx + 1) % apiMemes.length)}
                    >
                      <Text style={styles.smallBtnText}>Next ›</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.smallBtn, { backgroundColor: theme?.accent || '#42213D' }]}
                      onPress={() => handleShare(`${activeMeme.title} ${activeMeme.postLink || ''}`)}
                    >
                      <Text style={[styles.smallBtnText, { color: '#FFFFFF' }]}>Share</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};
