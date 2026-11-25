import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Modal,
  ScrollView,
  Platform,
} from 'react-native';
import { useTheme } from '../../../theme/ThemeContext';
import { featuredStory } from '../chillData';
import { styles } from '../styles/ChillScreen.styles';

const tagOptions = [
  '⚓ Strong One Burden',
  '🌱 Therapy Journey',
  '💼 Work & Hustle',
  '❤️ Relationships',
  '🎓 Campus Life',
];

export const StoriesTab = ({
  stories,
  onToggleLike,
  onToggleSave,
  onAddStory,
  onAddReflection,
}) => {
  const { theme } = useTheme();
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [tag, setTag] = useState(tagOptions[0]);
  const [errorMsg, setErrorMsg] = useState('');

  // Cute centered Story Reader popup state
  const [readingStory, setReadingStory] = useState(null); // { story, isFeatured }
  const [reflectionText, setReflectionText] = useState('');

  function handleSubmit() {
    if (title.trim() === '' || excerpt.trim() === '') {
      setErrorMsg('Please add both a headline and your reflection.');
      return;
    }

    onAddStory(title.trim(), excerpt.trim(), tag);
    setTitle('');
    setExcerpt('');
    setErrorMsg('');
    setShowForm(false);
  }

  function handleSendReflection() {
    if (!reflectionText.trim() || !readingStory || readingStory.isFeatured) return;
    onAddReflection?.(readingStory.story.id, reflectionText.trim());
    setReflectionText('');
  }

  // Always read the freshest story object from `stories` so likes/saves/reflections update live inside the popup
  const activeStory = readingStory
    ? readingStory.isFeatured
      ? featuredStory
      : stories.find((s) => s.id === readingStory.story.id) || readingStory.story
    : null;

  return (
    <View>
      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionHeading, { color: theme?.textPrimary || '#2A192E' }]}>
          📖 Soul Stories
        </Text>
        <TouchableOpacity style={styles.smallBtn} onPress={() => setShowForm(true)}>
          <Text style={styles.smallBtnText}>+ Share Story</Text>
        </TouchableOpacity>
      </View>

      {/* Featured guided audio story */}
      <View style={styles.featuredBox}>
        <View style={{ flex: 1 }}>
          <Text style={styles.tagText}>🌿 Guided Audio Story</Text>
          <Text style={[styles.storyTitle, { marginTop: 4 }]}>{featuredStory.title}</Text>
          <Text style={styles.metaText}>
            {featuredStory.author} · {featuredStory.duration}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.rsvpBtn}
          onPress={() => setReadingStory({ story: featuredStory, isFeatured: true })}
        >
          <Text style={styles.rsvpText}>Read →</Text>
        </TouchableOpacity>
      </View>

      {/* Community stories */}
      {stories.map((story) => (
        <View key={story.id} style={styles.card}>
          <View style={styles.cardTop}>
            <View style={styles.authorRow}>
              <View style={styles.avatar}>
                <Text style={{ fontSize: 18 }}>{story.authorEmoji}</Text>
              </View>
              <View>
                <Text style={styles.authorName}>{story.authorName}</Text>
                <Text style={styles.metaText}>{story.location}</Text>
              </View>
            </View>
            <View style={styles.tagBadge}>
              <Text style={styles.tagText}>{story.tag}</Text>
            </View>
          </View>

          <TouchableOpacity
            onPress={() => setReadingStory({ story, isFeatured: false })}
            activeOpacity={0.8}
          >
            <Text style={styles.storyTitle}>{story.title}</Text>
            <Text style={styles.bodyText}>{story.excerpt}</Text>
          </TouchableOpacity>

          <View style={styles.cardBottom}>
            <View style={styles.actionRow}>
              <TouchableOpacity onPress={() => onToggleLike(story.id)}>
                <Text style={styles.actionText}>
                  {story.isLiked ? '❤️' : '🤍'} {story.likes}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => setReadingStory({ story, isFeatured: false })}>
                <Text style={styles.actionText}>💬 {story.reflections.length} reflections</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity onPress={() => onToggleSave(story.id)}>
              <Text style={styles.actionText}>{story.isSaved ? '🔖 Saved' : '🏷️ Save'}</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}

      {/* Cute Centered Story Reader Popup Modal */}
      <Modal
        visible={!!readingStory}
        transparent
        animationType="fade"
        onRequestClose={() => setReadingStory(null)}
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
            {/* Cute Pastel Header */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <View style={{ backgroundColor: theme?.heroBg || '#F7F3FB', paddingHorizontal: 12, paddingVertical: 5, borderRadius: 99 }}>
                <Text style={[styles.tagText, { color: theme?.accent || '#42213D' }]}>
                  {readingStory?.isFeatured ? '🌿 Guided Story' : activeStory?.tag}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => setReadingStory(null)}
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
              {readingStory?.isFeatured && activeStory ? (
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
              ) : activeStory ? (
                <>
                  {/* Cozy Author Badge */}
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

                  {/* Cute Heart & Save Pills */}
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

                  {/* Reflections */}
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
                  key={option}
                  style={[styles.chip, tag === option && styles.chipActive]}
                  onPress={() => setTag(option)}
                >
                  <Text style={[styles.chipText, tag === option && styles.chipTextActive]}>
                    {option}
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
