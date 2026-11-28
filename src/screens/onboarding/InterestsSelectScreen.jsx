// src/screens/onboarding/InterestsSelectScreen.jsx
// "What fills your cup?" — Passions & Hobbies selection (pick up to 5)
// Powers small, safe community circles (at most 12 members) with matching vibes and shared interests.

import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  } from 'react-native';
import { styles } from './styles/InterestsSelectScreen.styles';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useResponsiveLayout } from '../../hooks/useResponsiveLayout';
import { OnboardingHeader } from './components/OnboardingHeader';
import { OnboardingHeroCard } from './components/OnboardingHeroCard';
import { onboardingStyles as s } from './onboardingStyles';
import { COMPANION_MAP } from '../../constants/companions';
import { onboardingStorage } from '../../services/onboardingStorage';

export const YOUTH_INTERESTS = [
  { id: 'music', label: '🎵 Music & Beats', desc: 'Afrobeats, Lo-Fi, R&B, Amapiano' },
  { id: 'art', label: '🎨 Art, Painting & Clay', desc: 'Sketching, painting, pottery' },
  { id: 'crafts', label: '🧶 DIY & Fiber Crafts', desc: 'Crochet, knitting, textile design' },
  { id: 'writing', label: '✍️ Writing & Poetry', desc: 'Spoken word, stories, journaling' },
  { id: 'photography', label: '📸 Photography & Film', desc: '35mm, vintage cams, visual stories' },
  { id: 'fashion', label: '👗 Thrifting & Streetwear', desc: 'Vintage hunting, styling, fashion' },
  { id: 'gaming', label: '🎮 Gaming & Play', desc: 'Cozy games, mobile gaming, PlayStation' },
  { id: 'tech', label: '💻 Tech, Coding & AI', desc: 'Building apps, design, creative tech' },
  { id: 'podcasts', label: '🎙️ Podcasts & Streaming', desc: 'Storytelling, deep banter, audio' },
  { id: 'books', label: '📚 Books, Manga & Anime', desc: 'Fiction, #BookTok, webtoons' },
  { id: 'fitness', label: '🏃 Run Clubs & Movement', desc: 'Morning runs, gym, dance workouts' },
  { id: 'outdoors', label: '🌿 Hiking & Nature', desc: 'Trail walks, forest retreats, outdoors' },
  { id: 'sports', label: '⚽ Football & Sports', desc: 'EPL banter, local matches, basketball' },
  { id: 'cooking', label: '☕ Cafe & Cozy Cooking', desc: 'Baking, chai & coffee chats' },
  { id: 'mindfulness', label: '🧘 Mindfulness & Rest', desc: 'Meditation, soundscapes, slow living' },
  { id: 'deep_talks', label: '💬 Deep Talks & Big Ideas', desc: 'Philosophy, heart sharing, safe listening' },
];

const MAX_SELECT = 5;

export const InterestsSelectScreen = ({ navigation, route }) => {
  const { isDesktop, isTablet } = useResponsiveLayout();
  const isWide = isDesktop || isTablet;

  const companion = COMPANION_MAP[route?.params?.companion] || COMPANION_MAP.noodle;
  const [selected, setSelected] = useState(route?.params?.interests || []);

  const toggle = (id) => {
    setSelected((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      if (prev.length >= MAX_SELECT) return prev;
      return [...prev, id];
    });
  };

  const handleContinue = async () => {
    try {
      await onboardingStorage.savePreferences({ interests: selected });
    } catch {}

    if (!navigation) return;
    navigation.navigate('RhythmSelect', {
      ...(route?.params ?? {}),
      interests: selected,
    });
  };

  const handleSkip = () => {
    if (!navigation) return;
    navigation.navigate('RhythmSelect', {
      ...(route?.params ?? {}),
      interests: [],
    });
  };

  const left = YOUTH_INTERESTS.filter((_, i) => i % 2 === 0);
  const right = YOUTH_INTERESTS.filter((_, i) => i % 2 !== 0);

  return (
    <SafeAreaView style={s.safeArea}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[s.scrollContainer, isWide && s.scrollContainerWide]}
        keyboardShouldPersistTaps="handled"
      >
        <View style={[s.pageWrapper, isWide && s.pageWrapperWide]}>
          <OnboardingHeader navigation={navigation} />

          <View style={[s.mainLayout, isWide && s.mainLayoutWide]}>
            {/* Left Hero Card */}
            <OnboardingHeroCard
              tag="YOUR PASSIONS & VIBES"
              heading={'What makes\nyour heart\nsmile?'}
              quote={`"Joy and connection are quiet medicine."`}
              author={companion.author}
              image={companion.image}
              isWide={isWide}
            />

            {/* Right Content */}
            <View style={[s.contentContainer, isWide && s.contentContainerWide]}>
              <Text style={s.stepTag}>STEP 6 OF 8 · YOUR INTERESTS</Text>
              <Text style={s.title}>What fills your cup?</Text>
              <Text style={s.subtitle}>
                Choose up to 5 passions. This helps match you with small circles (at most 12 peers) who share your wavelength.
              </Text>
              <Text style={styles.counter}>
                {selected.length} of {MAX_SELECT} chosen
              </Text>

              {/* Two-column grid */}
              <View style={styles.grid}>
                {[left, right].map((col, ci) => (
                  <View key={ci} style={styles.col}>
                    {col.map((item) => {
                      const isOn = selected.includes(item.id);
                      const isDisabled = !isOn && selected.length >= MAX_SELECT;
                      return (
                        <TouchableOpacity
                          key={item.id}
                          style={[
                            styles.chip,
                            isOn && styles.chipSelected,
                            isDisabled && styles.chipDisabled,
                          ]}
                          onPress={() => toggle(item.id)}
                          activeOpacity={0.85}
                          disabled={isDisabled}
                        >
                          <View style={styles.chipTop}>
                            <Text
                              style={[
                                styles.chipLabel,
                                isOn && styles.chipLabelSelected,
                              ]}
                            >
                              {item.label}
                            </Text>
                            {isOn && <Text style={styles.checkMark}>✓</Text>}
                          </View>
                          <Text
                            style={[
                              styles.chipDesc,
                              isOn && styles.chipDescSelected,
                            ]}
                          >
                            {item.desc}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                ))}
              </View>

              {/* Primary action */}
              <TouchableOpacity
                style={s.primaryBtn}
                onPress={handleContinue}
                activeOpacity={0.88}
              >
                <Text style={s.primaryBtnText}>
                  {selected.length > 0 ? 'Next: Your daily rhythm →' : 'Continue →'}
                </Text>
              </TouchableOpacity>

              {/* Skip option */}
              <TouchableOpacity
                style={s.skipBtn}
                onPress={handleSkip}
                activeOpacity={0.7}
              >
                <Text style={s.skipText}>I'll choose my passions later</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
