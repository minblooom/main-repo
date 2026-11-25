import React, { useState } from 'react';
import { SafeAreaView, ScrollView, View, Text, TouchableOpacity, TextInput } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { styles } from './styles/ChillScreen.styles';

export const StoryDetailScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { story, isFeatured } = route.params || {};

  const [reflections, setReflections] = useState(story?.reflections || []);
  const [comment, setComment] = useState('');

  if (!story) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.scrollContent}>
          <Text style={styles.sectionHeading}>Story not found</Text>
          <TouchableOpacity style={styles.smallBtn} onPress={() => navigation.goBack()}>
            <Text style={styles.smallBtnText}>← Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  function handleAddComment() {
    if (comment.trim() === '') return;
    const newItem = {
      id: 'r_' + Date.now(),
      author: 'You · Just now',
      text: comment.trim(),
    };
    setReflections([...reflections, newItem]);
    setComment('');
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <TouchableOpacity
          style={[styles.smallBtn, { alignSelf: 'flex-start', marginBottom: 16 }]}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.smallBtnText}>← Back to Chill Space</Text>
        </TouchableOpacity>

        <View style={styles.card}>
          {isFeatured ? (
            <>
              <Text style={{ fontSize: 44, textAlign: 'center' }}>{story.emoji}</Text>
              <Text style={[styles.title, { textAlign: 'center', marginTop: 8 }]}>
                {story.title}
              </Text>
              <Text style={[styles.tagText, { textAlign: 'center', marginVertical: 10 }]}>
                {story.author} · {story.duration}
              </Text>
              <Text style={styles.bodyText}>{story.body}</Text>
            </>
          ) : (
            <>
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

              <Text style={[styles.title, { fontSize: 22, marginBottom: 10 }]}>{story.title}</Text>
              <Text style={styles.bodyText}>{story.excerpt}</Text>

              <Text style={[styles.sectionHeading, { fontSize: 16, marginTop: 10, marginBottom: 10 }]}>
                💬 Community Reflections ({reflections.length})
              </Text>

              <TextInput
                style={[styles.input, { height: 70, textAlignVertical: 'top' }]}
                placeholder="Write a supportive reflection..."
                value={comment}
                onChangeText={setComment}
                multiline
              />
              <TouchableOpacity style={styles.primaryBtn} onPress={handleAddComment}>
                <Text style={styles.primaryBtnText}>Post Reflection</Text>
              </TouchableOpacity>

              <View style={{ marginTop: 16 }}>
                {reflections.map((ref) => (
                  <View key={ref.id} style={[styles.memeSubBox, { alignItems: 'flex-start' }]}>
                    <Text style={styles.tagText}>{ref.author}</Text>
                    <Text style={{ fontSize: 13, color: '#2D2522', marginTop: 4 }}>{ref.text}</Text>
                  </View>
                ))}
              </View>
            </>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};