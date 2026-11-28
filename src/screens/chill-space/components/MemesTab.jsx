import React, { useState, useEffect, useCallback, useRef } from 'react';
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
import { onboardingStorage } from '../../../services/onboardingStorage';
import { AuthService } from '../../../core/api/authService';
import { initialMemes } from '../chillData';
import { styles } from '../styles/ChillScreen.styles';
import { ShareToCircleModal } from '../../../components/modals/ShareToCircleModal';

const INTEREST_SUBREDDITS = {
  music: ['wholesomememes', 'MadeMeSmile'],
  gaming: ['gamingmemes', 'wholesomememes'],
  anime: ['wholesomeanimemes', 'animememes'],
  tech: ['ProgrammerHumor', 'me_irl'],
  books: ['bookmemes', 'introvertmemes'],
  writing: ['introvertmemes', 'wholesomememes'],
  fitness: ['GymMemes', 'MadeMeSmile'],
  sports: ['GymMemes', 'MadeMeSmile'],
  outdoors: ['MadeMeSmile', 'wholesomememes'],
  cooking: ['wholesomememes', 'me_irl'],
  art: ['wholesomememes', 'MadeMeSmile'],
  photography: ['MadeMeSmile', 'mildlyinteresting'],
  mindfulness: ['wholesomememes', 'introvertmemes'],
  podcasts: ['me_irl', 'wholesomememes'],
  deep_talks: ['introvertmemes', 'wholesomememes'],
  fashion: ['me_irl', 'wholesomememes'],
  crafts: ['wholesomememes', 'MadeMeSmile'],
};

const DEFAULT_SUBREDDITS = ['wholesomememes', 'MadeMeSmile', 'me_irl', 'introvertmemes'];

export const MemesTab = () => {
  const { theme } = useTheme();
  const [localMemes, setLocalMemes] = useState(initialMemes.map((m) => ({ ...m, liked: false })));
  const [apiMemes, setApiMemes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [selectedMemeIdx, setSelectedMemeIdx] = useState(-1);
  const [userInterests, setUserInterests] = useState([]);
  const [shareCircleItem, setShareCircleItem] = useState(null);

  const seenUrlsRef = useRef(new Set());
  const poolRef = useRef(DEFAULT_SUBREDDITS);

  // Build personalized subreddit pool from user's selected interests
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const [prefs, user] = await Promise.all([
          onboardingStorage.getPreferences(),
          AuthService.getStoredUser(),
        ]);
        const interests = prefs?.interests?.length
          ? prefs.interests
          : user?.interests || [];
        if (!mounted) return;
        setUserInterests(interests);

        const subs = new Set(DEFAULT_SUBREDDITS);
        interests.forEach((raw) => {
          const key = String(raw).toLowerCase();
          Object.entries(INTEREST_SUBREDDITS).forEach(([k, list]) => {
            if (key.includes(k) || k.includes(key)) {
              list.forEach((s) => subs.add(s));
            }
          });
        });
        poolRef.current = Array.from(subs);
      } catch {}
      if (mounted) fetchBatch(true);
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const fetchBatch = useCallback(async (reset = false) => {
    if (reset) {
      setLoading(true);
      seenUrlsRef.current = new Set();
    } else {
      setLoadingMore(true);
    }

    try {
      const pool = poolRef.current.length ? poolRef.current : DEFAULT_SUBREDDITS;
      // Pick 2 distinct subreddits from the user's interest pool
      const idxA = Math.floor(Math.random() * pool.length);
      const idxB = (idxA + 1 + Math.floor(Math.random() * Math.max(1, pool.length - 1))) % pool.length;
      const picks = idxA === idxB ? [pool[idxA]] : [pool[idxA], pool[idxB]];

      const results = await Promise.all(
        picks.map(async (sub) => {
          const res = await fetch(`https://meme-api.com/gimme/${sub}/10`);
          if (!res.ok) return [];
          const data = await res.json();
          return (data.memes || []).filter(
            (m) =>
              m.url &&
              !m.nsfw &&
              !m.spoiler &&
              (m.url.endsWith('.jpg') || m.url.endsWith('.png') || m.url.endsWith('.webp'))
          );
        })
      );

      const fresh = [];
      results.flat().forEach((m) => {
        if (!seenUrlsRef.current.has(m.url)) {
          seenUrlsRef.current.add(m.url);
          fresh.push({ ...m, liked: false });
        }
      });

      if (reset) {
        setApiMemes(fresh);
      } else if (fresh.length > 0) {
        setApiMemes((prev) => [...prev, ...fresh]);
      }
    } catch {
      // Offline fallback uses local MindBloom cards cleanly
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, []);

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
        <View style={{ flex: 1 }}>
          <Text style={[styles.sectionHeading, { color: theme?.textPrimary || '#2A192E' }]}>
            Endless Relatable Vibes 🎭
          </Text>
          <Text style={[styles.sectionSubtext, { color: theme?.textMuted || '#7E726D' }]}>
            {userInterests.length > 0
              ? `Tailored to your interests: ${userInterests.slice(0, 3).join(' · ')}`
              : 'Tap any meme to view, react & share a gentle laugh'}
          </Text>
        </View>
        <TouchableOpacity
          style={[styles.smallBtn, { backgroundColor: theme?.heroBg || '#F1EBF8' }]}
          onPress={() => fetchBatch(true)}
        >
          <Text style={[styles.smallBtnText, { color: theme?.accent || '#42213D' }]}>Shuffle 🔀</Text>
        </TouchableOpacity>
      </View>

      {loading && (
        <View style={[styles.infoBox, { backgroundColor: theme?.cardBg || '#FFFFFF' }]}>
          <ActivityIndicator color={theme?.accent || '#42213D'} />
          <Text style={[styles.metaText, { marginTop: 8 }]}>Loading fresh relatable memes...</Text>
        </View>
      )}

      {/* Endless 2-Column Masonry Grid */}
      {apiMemes.length > 0 && (
        <>
          <View style={{ flexDirection: 'row', gap: 12, marginBottom: 14 }}>
            {[0, 1].map((col) => (
              <View key={col} style={{ flex: 1, gap: 12 }}>
                {apiMemes
                  .map((m, idx) => ({ m, idx }))
                  .filter(({ idx }) => idx % 2 === col)
                  .map(({ m, idx }) => (
                    <TouchableOpacity
                      key={`${m.url}-${idx}`}
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

          <TouchableOpacity
            style={[
              styles.primaryBtn,
              {
                backgroundColor: theme?.heroBg || '#F1EBF8',
                borderWidth: 1,
                borderColor: theme?.divider || '#E8DFF2',
                marginBottom: 20,
              },
            ]}
            onPress={() => fetchBatch(false)}
            disabled={loadingMore}
          >
            {loadingMore ? (
              <ActivityIndicator size="small" color={theme?.accent || '#42213D'} />
            ) : (
              <Text style={[styles.primaryBtnText, { color: theme?.accent || '#42213D' }]}>
                Load more memes ✨
              </Text>
            )}
          </TouchableOpacity>
        </>
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
            <View style={{ flexDirection: 'row', gap: 12, alignItems: 'center' }}>
              <TouchableOpacity onPress={() => setShareCircleItem(meme)}>
                <Text style={[styles.actionText, { color: theme?.accent || '#42213D' }]}>💬 Circle</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleShare(meme.title)}>
                <Text style={styles.actionText}>↗️ Share</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      ))}

      {/* Cute Meme Viewer Popup (auto-loads more when reaching end) */}
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

                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
                  <TouchableOpacity
                    style={[styles.reactionPill, { backgroundColor: theme?.heroBg || '#F5F1FA' }]}
                    onPress={() => handleApiReact(selectedMemeIdx)}
                  >
                    <Text style={styles.actionText}>
                      {activeMeme.liked ? '❤️' : '🤍'} {activeMeme.ups}
                    </Text>
                  </TouchableOpacity>

                  <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, flexShrink: 1 }}>
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
                      onPress={() => {
                        const nextIdx = selectedMemeIdx + 1;
                        if (nextIdx >= apiMemes.length - 2) fetchBatch(false);
                        setSelectedMemeIdx(nextIdx % apiMemes.length);
                      }}
                    >
                      <Text style={styles.smallBtnText}>Next ›</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.smallBtn, { backgroundColor: theme?.heroBg || '#F1EBF8' }]}
                      onPress={() => {
                        const target = {
                          title: activeMeme.title,
                          imageUrl: activeMeme.url,
                        };
                        setSelectedMemeIdx(-1);
                        setShareCircleItem(target);
                      }}
                    >
                      <Text style={[styles.smallBtnText, { color: theme?.accent || '#42213D' }]}>💬 Circle</Text>
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

      <ShareToCircleModal
        visible={!!shareCircleItem}
        type="meme"
        item={shareCircleItem}
        onClose={() => setShareCircleItem(null)}
      />
    </View>
  );
};
