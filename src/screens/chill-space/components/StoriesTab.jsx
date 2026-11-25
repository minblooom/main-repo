import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, Modal, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { featuredStory } from '../chillData';
import { styles } from '../styles/ChillScreen.styles';

const tagOptions = [
  '⚓ Strong One Burden',
  '🌱 Therapy Journey',
  '💼 Work & Hustle',
  '❤️ Relationships',
  '🎓 Campus Life',
];

export const StoriesTab = ({ stories, onToggleLike, onToggleSave, onAddStory }) => {
  const navigation = useNavigation();
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [tag, setTag] = useState(tagOptions[0]);
  const [errorMsg, setErrorMsg] = useState('');

  function handleSubmit() {
    if (title.trim() === '' || excerpt.trim() === '') {
      setErrorMsg('Please fill in both the headline and your reflection.');
      return;
    }

    onAddStory(title.trim(), excerpt.trim(), tag);
    setTitle('');
    setExcerpt('');
    setErrorMsg('');
    setShowForm(false);
  }

  return (
    <View>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionHeading}>📖 Soul Stories</Text>
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
          onPress={() => navigation.navigate('StoryDetail', { story: featuredStory, isFeatured: true })}
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

          <TouchableOpacity onPress={() => navigation.navigate('StoryDetail', { story })}>
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

              <TouchableOpacity onPress={() => navigation.navigate('StoryDetail', { story })}>
                <Text style={styles.actionText}>💬 {story.reflections.length} reflections</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity onPress={() => onToggleSave(story.id)}>
              <Text style={styles.actionText}>{story.isSaved ? '🔖 Saved' : '🏷️ Save'}</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}

      {/* Share Story Modal */}
      <Modal visible={showForm} transparent animationType="slide">
        <View style={styles.modalBg}>
          <View style={styles.modalCard}>
            <View style={styles.cardTop}>
              <Text style={styles.sectionHeading}>Share Your Soul Story 📖</Text>
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
              <Text style={{ color: '#BA1A1A', fontSize: 12, marginBottom: 8 }}>{errorMsg}</Text>
            )}

            <TouchableOpacity style={styles.primaryBtn} onPress={handleSubmit}>
              <Text style={styles.primaryBtnText}>Publish to Chill Space</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};