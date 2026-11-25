import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Modal,
  ScrollView,
  Image,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { useTheme } from '../../../theme/ThemeContext';
import { COMPANION_MAP } from '../../../constants/companions';
import { featuredStory } from '../chillData';
import { styles } from '../styles/ChillScreen.styles';

const STORY_CATEGORIES = [
  { id: 'for_you', label: '🌿 For You' },
  { id: 'all', label: 'All Stories' },
  { id: 'anxiety', label: '🌊 Anxiety' },
  { id: 'burnout', label: '💼 Burnout' },
  { id: 'family', label: '⚓ Family Burden' },
  { id: 'body', label: '🦋 Body & Self' },
  { id: 'men', label: '🦁 Men & Emotions' },
  { id: 'grief', label: '🍃 Grief' },
];

const tagOptions = [
  { label: '⚓ Firstborn Burden', category: 'family' },
  { label: '🌱 Therapy Journey', category: 'anxiety' },
  { label: '💼 Hustle & Burnout', category: 'burnout' },
  { label: '✨ Body & Self-Love', category: 'body' },
  { label: '🦁 Men & Emotions', category: 'men' },
  { label: '🍃 Grief & Healing', category: 'grief' },
];

const WIKI_WELLNESS_TOPICS = [
  'Mindfulness',
  'Diaphragmatic_breathing',
  'Emotional_self-regulation',
  'Progressive_muscle_relaxation',
];

export const StoriesTab = ({
  stories,
  userFocusAreas = ['anxiety'],
  onToggleLike,
  onToggleSave,
  onAddStory,
  onAddReflection,
}) => {
  const { theme, companionId } = useTheme();
  const companion = COMPANION_MAP[companionId || 'noodle'] || COMPANION_MAP.noodle;
  const primaryFocus = (userFocusAreas?.[0] || 'anxiety').toLowerCase();

  const [selectedCategory, setSelectedCategory] = useState('for_you');
  const [liveArticles, setLiveArticles] = useState([]);
  const [loadingArticles, setLoadingArticles] = useState(false);

  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [selectedTagObj, setSelectedTagObj] = useState(tagOptions[0]);
  const [errorMsg, setErrorMsg] = useState('');

  // Cute centered Reader Popup state (handles featured story, community story, or external essay)
  const [readingItem, setReadingItem] = useState(null); // { type: 'featured' | 'story' | 'article', data }
  const [fullArticleBody, setFullArticleBody] = useState('');
  const [loadingFullArticle, setLoadingFullArticle] = useState(false);
  const [reflectionText, setReflectionText] = useState('');

  // Fetch multi-source wellness articles (DEV.to mentalhealth + Wikipedia REST summaries)
  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoadingArticles(true);
      const collected = [];

      try {
        const tag = primaryFocus.includes('burnout') ? 'burnout' : 'mentalhealth';
        const res = await fetch(`https://dev.to/api/articles?tag=${tag}&per_page=8&top=30`);
        if (res.ok) {
          const data = await res.json();
          const filtered = (data || [])
            .filter(
              (a) =>
                a.title &&
                a.description &&
                !/interview|coding|leetcode|javascript|react|python/i.test(a.title)
            )
            .slice(0, 4);
          filtered.forEach((a) => {
            collected.push({
              id: `dev-${a.id}`,
              devId: a.id,
              source: 'DEV.to Wellness',
              title: a.title,
              author: a.user?.name || 'Community Writer',
              readTime: `${a.reading_time_minutes || 3} min read`,
              coverImage: a.cover_image || null,
              body: a.description,
              takeaway: 'Slow down first; your mind follows when your body feels safe.',
            });
          });
        }
      } catch {}

      try {
        const wikiResults = await Promise.all(
          WIKI_WELLNESS_TOPICS.map(async (topic) => {
            const r = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${topic}`);
            if (!r.ok) return null;
            return { topic, data: await r.json() };
          })
        );
        wikiResults.filter(Boolean).forEach(({ topic, data: w }) => {
          if (w?.title && w?.extract) {
            collected.push({
              id: `wiki-${w.pageid || w.title}`,
              wikiTitle: w.title || topic,
              source: 'Wellness Encyclopedia',
              title: w.title,
              author: 'Evidence-Based Guide',
              readTime: '3 min read',
              coverImage: w.thumbnail?.source || null,
              body: w.extract,
              takeaway: 'Small, repeatable grounding practices build lasting emotional steadiness.',
            });
          }
        });
      } catch {}

      if (!cancelled) {
        setLiveArticles(collected);
        setLoadingArticles(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [primaryFocus]);

  // Fetch full article text when user opens an external DEV.to or Wikipedia essay
  useEffect(() => {
    if (readingItem?.type !== 'article' || !readingItem.data) {
      setFullArticleBody('');
      setLoadingFullArticle(false);
      return;
    }

    const art = readingItem.data;
    if (art.fullBody) {
      setFullArticleBody(art.fullBody);
      setLoadingFullArticle(false);
      return;
    }

    let cancelled = false;
    setFullArticleBody('');
    setLoadingFullArticle(true);

    (async () => {
      try {
        let fetchedText = '';
        if (art.devId) {
          const res = await fetch(`https://dev.to/api/articles/${art.devId}`);
          if (res.ok) {
            const detail = await res.json();
            const rawMd = detail?.body_markdown || '';
            fetchedText = rawMd
              .replace(/^---[\s\S]*?---/, '')
              .replace(/!\[.*?\]\(.*?\)/g, '')
              .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
              .replace(/#{1,6}\s*/g, '')
              .replace(/[*_`>~]/g, '')
              .replace(/\n{3,}/g, '\n\n')
              .trim();
          }
        } else if (art.wikiTitle) {
          const url = `https://en.wikipedia.org/w/api.php?action=query&prop=extracts&explaintext=1&exsectionformat=plain&titles=${encodeURIComponent(
            art.wikiTitle
          )}&format=json&origin=*`;
          const res = await fetch(url);
          if (res.ok) {
            const json = await res.json();
            const pages = json?.query?.pages || {};
            const firstPage = Object.values(pages)[0];
            if (firstPage?.extract) {
              fetchedText = firstPage.extract.replace(/\n{3,}/g, '\n\n').trim();
            }
          }
        }

        if (!cancelled) {
          const finalBody = fetchedText || art.body;
          art.fullBody = finalBody;
          setFullArticleBody(finalBody);
        }
      } catch {
        if (!cancelled) setFullArticleBody(art.body);
      } finally {
        if (!cancelled) setLoadingFullArticle(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [readingItem]);

  const filteredStories = useMemo(() => {
    const normalizedFocus = userFocusAreas.map((f) => f.toLowerCase());
    const matchesFocus = (cat) =>
      normalizedFocus.some((f) => f.includes(cat) || cat.includes(f));

    if (selectedCategory === 'for_you') {
      return [...stories].sort((a, b) => (matchesFocus(b.category) ? 1 : 0) - (matchesFocus(a.category) ? 1 : 0));
    }
    if (selectedCategory === 'all') return stories;
    return stories.filter((s) => s.category === selectedCategory);
  }, [stories, selectedCategory, userFocusAreas]);

  function handleSubmit() {
    if (title.trim() === '' || excerpt.trim() === '') {
      setErrorMsg('Please add both a headline and your reflection.');
      return;
    }

    onAddStory(title.trim(), excerpt.trim(), selectedTagObj.label, selectedTagObj.category);
    setTitle('');
    setExcerpt('');
    setErrorMsg('');
    setShowForm(false);
  }

  function handleSendReflection() {
    if (!reflectionText.trim() || readingItem?.type !== 'story') return;
    onAddReflection?.(readingItem.data.id, reflectionText.trim());
    setReflectionText('');
  }

  const activeStory =
    readingItem?.type === 'story'
      ? stories.find((s) => s.id === readingItem.data.id) || readingItem.data
      : readingItem?.data || null;

  return (
    <View>
      {/* Personalized Journey Hero Card */}
      <View
        style={[
          styles.card,
          {
            backgroundColor: theme?.heroBg || '#FCEFE9',
            borderColor: theme?.heroBorder || '#E8DFF2',
            marginBottom: 14,
          },
        ]}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <Image
            source={companion.image}
            style={{ width: 42, height: 42, borderRadius: 21 }}
            resizeMode="cover"
          />
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 15, fontWeight: '800', color: theme?.textPrimary || '#2A192E' }}>
              Personalized for Your Journey
            </Text>
            <Text style={{ fontSize: 12, color: theme?.textSecondary || '#5C4D60', marginTop: 2 }}>
              Focus: <Text style={{ fontWeight: '800', color: theme?.accent || '#E06D3B' }}>{primaryFocus.toUpperCase()}</Text> · Tap any story to open reader
            </Text>
          </View>
          <TouchableOpacity
            style={[styles.smallBtn, { backgroundColor: theme?.accent || '#42213D' }]}
            onPress={() => setShowForm(true)}
          >
            <Text style={[styles.smallBtnText, { color: '#FFFFFF' }]}>+ Share Story</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Category Filter Pills */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 16 }}>
        <View style={{ flexDirection: 'row', gap: 8 }}>
          {STORY_CATEGORIES.map((cat) => {
            const active = selectedCategory === cat.id;
            return (
              <TouchableOpacity
                key={cat.id}
                style={[
                  styles.chip,
                  {
                    backgroundColor: active ? (theme?.accent || '#42213D') : (theme?.cardBg || '#FFFFFF'),
                    borderColor: active ? (theme?.accent || '#42213D') : (theme?.divider || '#E8DFF2'),
                    borderWidth: 1,
                  },
                ]}
                onPress={() => setSelectedCategory(cat.id)}
              >
                <Text style={[styles.chipText, { color: active ? '#FFFFFF' : (theme?.textSecondary || '#5C4D60') }]}>
                  {cat.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      {/* Live Clinical & Wellness Insights (Multi-API Carousel) */}
      <View style={styles.sectionHeader}>
        <View>
          <Text style={[styles.sectionHeading, { color: theme?.textPrimary || '#2A192E' }]}>
            Clinical & Wellness Insights 🌐
          </Text>
          <Text style={[styles.sectionSubtext, { color: theme?.textMuted || '#7E726D' }]}>
            Live essays from DEV.to & Wellness Encyclopedia
          </Text>
        </View>
      </View>

      {loadingArticles ? (
        <View style={[styles.infoBox, { backgroundColor: theme?.cardBg || '#FFFFFF' }]}>
          <ActivityIndicator color={theme?.accent || '#42213D'} />
        </View>
      ) : (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 18 }}>
          <View style={{ flexDirection: 'row', gap: 12 }}>
            {liveArticles.map((art) => (
              <TouchableOpacity
                key={art.id}
                style={[
                  styles.card,
                  {
                    width: 245,
                    padding: 14,
                    marginBottom: 0,
                    backgroundColor: theme?.cardBg || '#FFFFFF',
                    borderColor: theme?.divider || '#E8DFF2',
                  },
                ]}
                onPress={() => setReadingItem({ type: 'article', data: art })}
                activeOpacity={0.85}
              >
                <View
                  style={{
                    height: 76,
                    borderRadius: 14,
                    backgroundColor: theme?.heroBg || '#F7F3FB',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 10,
                    overflow: 'hidden',
                  }}
                >
                  {art.coverImage ? (
                    <Image source={{ uri: art.coverImage }} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
                  ) : (
                    <Text style={{ fontSize: 28 }}>🧠</Text>
                  )}
                </View>
                <Text style={{ fontSize: 10.5, fontWeight: '800', color: theme?.accent || '#E06D3B' }}>
                  {art.source}
                </Text>
                <Text
                  style={{ fontSize: 13.5, fontWeight: '800', color: theme?.textPrimary || '#2A192E', marginTop: 4 }}
                  numberOfLines={2}
                >
                  {art.title}
                </Text>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
                  <Text style={{ fontSize: 11, color: theme?.textMuted || '#7E726D' }}>⏱ {art.readTime}</Text>
                  <Text style={{ fontSize: 11.5, fontWeight: '800', color: theme?.accent || '#42213D' }}>Read ↗</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      )}

      {/* Featured guided audio story */}
      <View style={[styles.featuredBox, { borderColor: theme?.divider || '#E8DFF2' }]}>
        <View style={{ flex: 1 }}>
          <Text style={styles.tagText}>🌿 Guided Story</Text>
          <Text style={[styles.storyTitle, { marginTop: 4 }]}>{featuredStory.title}</Text>
          <Text style={styles.metaText}>
            {featuredStory.author} · {featuredStory.duration}
          </Text>
        </View>
        <TouchableOpacity
          style={[styles.rsvpBtn, { backgroundColor: theme?.accent || '#42213D' }]}
          onPress={() => setReadingItem({ type: 'featured', data: featuredStory })}
        >
          <Text style={[styles.rsvpText, { color: '#FFFFFF' }]}>Read →</Text>
        </TouchableOpacity>
      </View>

      {/* Sanctuary Voices */}
      <View style={[styles.sectionHeader, { marginTop: 6 }]}>
        <Text style={[styles.sectionHeading, { color: theme?.textPrimary || '#2A192E' }]}>
          Sanctuary Voices 🏡
        </Text>
        <Text style={[styles.metaText, { color: theme?.textMuted || '#7E726D' }]}>
          {filteredStories.length} stories
        </Text>
      </View>

      {filteredStories.map((story) => {
        const isMatch = userFocusAreas.some(
          (f) => f.toLowerCase().includes(story.category) || story.category.includes(f.toLowerCase())
        );
        return (
          <View
            key={story.id}
            style={[
              styles.card,
              {
                backgroundColor: theme?.cardBg || '#FFFFFF',
                borderColor: isMatch ? (theme?.accent || '#E06D3B') : (theme?.divider || '#E8DFF2'),
              },
            ]}
          >
            {isMatch && (
              <View
                style={{
                  alignSelf: 'flex-start',
                  backgroundColor: theme?.heroBg || '#FCEFE9',
                  paddingHorizontal: 10,
                  paddingVertical: 3,
                  borderRadius: 99,
                  marginBottom: 8,
                }}
              >
                <Text style={{ fontSize: 10.5, fontWeight: '800', color: theme?.accent || '#E06D3B' }}>
                  ✨ Matches your focus
                </Text>
              </View>
            )}

            <View style={styles.cardTop}>
              <View style={styles.authorRow}>
                <View style={styles.avatar}>
                  <Text style={{ fontSize: 18 }}>{story.authorEmoji}</Text>
                </View>
                <View>
                  <Text style={[styles.authorName, { color: theme?.textPrimary || '#2A192E' }]}>
                    {story.authorName}
                  </Text>
                  <Text style={[styles.metaText, { color: theme?.textMuted || '#7E726D' }]}>
                    {story.location}
                  </Text>
                </View>
              </View>
              <View style={styles.tagBadge}>
                <Text style={styles.tagText}>{story.tag}</Text>
              </View>
            </View>

            <TouchableOpacity
              onPress={() => setReadingItem({ type: 'story', data: story })}
              activeOpacity={0.8}
            >
              <Text style={[styles.storyTitle, { color: theme?.textPrimary || '#2A192E' }]}>{story.title}</Text>
              <Text style={[styles.bodyText, { color: theme?.textSecondary || '#5C4D60' }]}>{story.excerpt}</Text>
            </TouchableOpacity>

            <View style={styles.cardBottom}>
              <View style={styles.actionRow}>
                <TouchableOpacity onPress={() => onToggleLike(story.id)}>
                  <Text style={styles.actionText}>
                    {story.isLiked ? '❤️' : '🤍'} {story.likes}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => setReadingItem({ type: 'story', data: story })}>
                  <Text style={styles.actionText}>💬 {story.reflections.length} reflections</Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity onPress={() => onToggleSave(story.id)}>
                <Text style={styles.actionText}>{story.isSaved ? '🔖 Saved' : '🏷️ Save'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        );
      })}

      {/* Cute Centered Reader Popup Modal */}
      <Modal
        visible={!!readingItem}
        transparent
        animationType="fade"
        onRequestClose={() => setReadingItem(null)}
      >
        <View style={styles.modalBg}>
          <View
            style={[
              styles.modalCard,
              {
                backgroundColor: theme?.cardBg || '#FFFFFF',
                borderRadius: 28,
                maxHeight: '85%',
                borderWidth: 1,
                borderColor: theme?.divider || '#E8DFF2',
              },
            ]}
          >
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <View style={{ backgroundColor: theme?.heroBg || '#F7F3FB', paddingHorizontal: 12, paddingVertical: 5, borderRadius: 99 }}>
                <Text style={[styles.tagText, { color: theme?.accent || '#42213D' }]}>
                  {readingItem?.type === 'featured'
                    ? '🌿 Guided Story'
                    : readingItem?.type === 'article'
                      ? activeStory?.source
                      : activeStory?.tag}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => setReadingItem(null)}
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 16,
                  backgroundColor: theme?.bg || '#FAF6EF',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Text style={{ fontSize: 15, fontWeight: '700', color: theme?.textMuted || '#7E726D' }}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 6 }}>
              {readingItem?.type === 'featured' && activeStory ? (
                <View style={{ alignItems: 'center', paddingVertical: 6 }}>
                  <View
                    style={{
                      width: 68,
                      height: 68,
                      borderRadius: 34,
                      backgroundColor: theme?.heroBg || '#F7F3FB',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: 10,
                    }}
                  >
                    <Text style={{ fontSize: 34 }}>{activeStory.emoji}</Text>
                  </View>
                  <Text style={[styles.storyTitle, { fontSize: 19, textAlign: 'center', color: theme?.textPrimary || '#2A192E' }]}>
                    {activeStory.title}
                  </Text>
                  <Text style={[styles.metaText, { marginBottom: 14, color: theme?.textMuted || '#7E726D' }]}>
                    {activeStory.author} · {activeStory.duration}
                  </Text>
                  <Text style={[styles.bodyText, { fontSize: 14.5, lineHeight: 23, color: theme?.textSecondary || '#5C4D60' }]}>
                    {activeStory.body}
                  </Text>
                </View>
              ) : readingItem?.type === 'article' && activeStory ? (
                <View>
                  <Text style={[styles.storyTitle, { fontSize: 19, marginBottom: 6, color: theme?.textPrimary || '#2A192E' }]}>
                    {activeStory.title}
                  </Text>
                  <Text style={[styles.metaText, { marginBottom: 14, color: theme?.textMuted || '#7E726D' }]}>
                    By {activeStory.author} · {activeStory.readTime}
                  </Text>
                  {loadingFullArticle ? (
                    <View style={{ paddingVertical: 20, alignItems: 'center', gap: 8 }}>
                      <ActivityIndicator color={theme?.accent || '#42213D'} />
                      <Text style={{ fontSize: 12, color: theme?.textMuted || '#7E726D' }}>
                        Loading full story...
                      </Text>
                    </View>
                  ) : (
                    <Text style={[styles.bodyText, { fontSize: 14.5, lineHeight: 23, color: theme?.textSecondary || '#5C4D60' }]}>
                      {fullArticleBody || activeStory.body}
                    </Text>
                  )}
                  <View style={{ backgroundColor: theme?.heroBg || '#FCEFE9', padding: 14, borderRadius: 16, marginTop: 14 }}>
                    <Text style={{ fontSize: 11.5, fontWeight: '800', color: theme?.accent || '#E06D3B', marginBottom: 4 }}>
                      🌿 Gentle Takeaway
                    </Text>
                    <Text style={{ fontSize: 13, color: theme?.textPrimary || '#2A192E', lineHeight: 19 }}>
                      {activeStory.takeaway}
                    </Text>
                  </View>
                </View>
              ) : activeStory ? (
                <>
                  <View style={[styles.authorRow, { marginBottom: 12 }]}>
                    <View style={[styles.avatar, { width: 44, height: 44, borderRadius: 22, backgroundColor: theme?.heroBg || '#F7F3FB' }]}>
                      <Text style={{ fontSize: 22 }}>{activeStory.authorEmoji}</Text>
                    </View>
                    <View>
                      <Text style={[styles.authorName, { color: theme?.textPrimary || '#2A192E' }]}>
                        {activeStory.authorName}
                      </Text>
                      <Text style={[styles.metaText, { color: theme?.textMuted || '#7E726D' }]}>
                        {activeStory.location}
                      </Text>
                    </View>
                  </View>

                  <Text style={[styles.storyTitle, { fontSize: 18, marginBottom: 8, color: theme?.textPrimary || '#2A192E' }]}>
                    {activeStory.title}
                  </Text>
                  <Text style={[styles.bodyText, { fontSize: 14.5, lineHeight: 23, color: theme?.textSecondary || '#5C4D60' }]}>
                    {activeStory.excerpt}
                  </Text>

                  <View style={{ flexDirection: 'row', gap: 10, marginVertical: 14 }}>
                    <TouchableOpacity
                      onPress={() => onToggleLike(activeStory.id)}
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        paddingHorizontal: 14,
                        paddingVertical: 7,
                        borderRadius: 99,
                        backgroundColor: theme?.heroBg || '#FAF6EF',
                      }}
                    >
                      <Text style={{ fontSize: 13, fontWeight: '700', color: theme?.textPrimary || '#2A192E' }}>
                        {activeStory.isLiked ? '❤️' : '🤍'} {activeStory.likes}
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => onToggleSave(activeStory.id)}
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        paddingHorizontal: 14,
                        paddingVertical: 7,
                        borderRadius: 99,
                        backgroundColor: theme?.heroBg || '#FAF6EF',
                      }}
                    >
                      <Text style={{ fontSize: 13, fontWeight: '700', color: theme?.textPrimary || '#2A192E' }}>
                        {activeStory.isSaved ? '🔖 Saved' : '🏷️ Save'}
                      </Text>
                    </TouchableOpacity>
                  </View>

                  <Text style={{ fontSize: 13.5, fontWeight: '800', color: theme?.textPrimary || '#2A192E', marginBottom: 8 }}>
                    💬 Warm Reflections ({activeStory.reflections.length})
                  </Text>

                  {activeStory.reflections.map((ref) => (
                    <View
                      key={ref.id}
                      style={[
                        styles.memeSubBox,
                        {
                          alignItems: 'flex-start',
                          backgroundColor: theme?.bg || '#FAF6EF',
                          borderRadius: 16,
                          marginBottom: 8,
                        },
                      ]}
                    >
                      <Text style={[styles.tagText, { color: theme?.accent || '#42213D' }]}>{ref.author}</Text>
                      <Text style={{ fontSize: 13, color: theme?.textPrimary || '#2D2522', marginTop: 4, lineHeight: 19 }}>
                        {ref.text}
                      </Text>
                    </View>
                  ))}

                  <TextInput
                    underlineColorAndroid="transparent"
                    style={[
                      styles.input,
                      {
                        height: 68,
                        textAlignVertical: 'top',
                        backgroundColor: theme?.bg || '#F5F1FA',
                        color: theme?.textPrimary || '#2A192E',
                      },
                      Platform.OS === 'web' && { outlineStyle: 'none', outlineWidth: 0 },
                    ]}
                    placeholder="Leave a gentle, supportive note..."
                    placeholderTextColor={theme?.textMuted || '#7E726D'}
                    value={reflectionText}
                    onChangeText={setReflectionText}
                    multiline
                  />
                  <TouchableOpacity
                    style={[styles.primaryBtn, { backgroundColor: theme?.accent || '#42213D' }]}
                    onPress={handleSendReflection}
                  >
                    <Text style={styles.primaryBtnText}>Send warm reflection</Text>
                  </TouchableOpacity>
                </>
              ) : null}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Share Story Modal */}
      <Modal visible={showForm} transparent animationType="fade" onRequestClose={() => setShowForm(false)}>
        <View style={styles.modalBg}>
          <View style={[styles.modalCard, { backgroundColor: theme?.cardBg || '#FFFFFF', borderRadius: 28 }]}>
            <View style={styles.cardTop}>
              <Text style={[styles.sectionHeading, { color: theme?.textPrimary || '#2A192E' }]}>
                Share Your Soul Story 📖
              </Text>
              <TouchableOpacity onPress={() => setShowForm(false)}>
                <Text style={{ fontSize: 18, color: '#7E726D' }}>✕</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.metaText}>Headline</Text>
            <TextInput
              underlineColorAndroid="transparent"
              style={[styles.input, Platform.OS === 'web' && { outlineStyle: 'none', outlineWidth: 0 }]}
              placeholder="e.g. Carrying the family at 22"
              value={title}
              onChangeText={setTitle}
            />

            <Text style={styles.metaText}>Reflection</Text>
            <TextInput
              underlineColorAndroid="transparent"
              style={[styles.input, { height: 90, textAlignVertical: 'top' }, Platform.OS === 'web' && { outlineStyle: 'none', outlineWidth: 0 }]}
              placeholder="Write your story here..."
              value={excerpt}
              onChangeText={setExcerpt}
              multiline
            />

            <Text style={[styles.metaText, { marginBottom: 8 }]}>Theme Tag</Text>
            <View style={styles.chipRow}>
              {tagOptions.map((option) => (
                <TouchableOpacity
                  key={option.label}
                  style={[styles.chip, selectedTagObj.label === option.label && styles.chipActive]}
                  onPress={() => setSelectedTagObj(option)}
                >
                  <Text style={[styles.chipText, selectedTagObj.label === option.label && styles.chipTextActive]}>
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {errorMsg !== '' && (
              <Text style={{ color: '#BA1A1A', fontSize: 12, marginTop: 8 }}>{errorMsg}</Text>
            )}

            <TouchableOpacity style={[styles.primaryBtn, { backgroundColor: theme?.accent || '#42213D' }]} onPress={handleSubmit}>
              <Text style={styles.primaryBtnText}>Share gently</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};
