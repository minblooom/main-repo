// src/screens/chill/ChillScreen.jsx
// MindBloom Chill & Soundscapes Sanctuary
// Houses the Podcast of the Day and ambient soundscapes for relaxation

import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useResponsiveLayout } from '../../hooks/useResponsiveLayout';
import { colors } from '../../theme/colors';

const SOUNDSCAPES = [
  { id: 'rain', title: 'Rain on Tin Roof', desc: 'Gentle steady rainfall to wash away tension', duration: 'Looping' },
  { id: 'acoustic', title: 'Acoustic Polepole', desc: 'Warm fingerpicked guitar melodies', duration: '18 min' },
  { id: 'dusk', title: 'Savannah Dusk', desc: 'Evening cicadas and calm breeze', duration: 'Looping' },
  { id: 'stream', title: 'Gentle Mountain Stream', desc: 'Flowing water and fresh morning air', duration: '25 min' },
];

export const ChillScreen = ({ navigation, route }) => {
  const { isDesktop, isTablet } = useResponsiveLayout();
  const isWide = isDesktop || isTablet;

  const [isPlayingPodcast, setIsPlayingPodcast] = useState(false);
  const [activeSoundscape, setActiveSoundscape] = useState(null);

  const podcastTitle = route?.params?.podcastTitle || 'Calming the Overwhelmed Mind';
  const podcastDesc = route?.params?.podcastDesc || 'A daily 10-minute sanctuary to unwind racing thoughts and reset your pace.';

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContainer,
          isWide && styles.scrollContainerWide,
        ]}
      >
        <View style={[styles.wrapper, isWide && styles.wrapperWide]}>
          {/* Top Bar */}
          <View style={styles.topBar}>
            <TouchableOpacity
              style={styles.backBtn}
              onPress={() => navigation?.goBack?.() || navigation?.navigate?.('Home')}
              activeOpacity={0.8}
            >
              <Text style={styles.backBtnText}>← Sanctuary Home</Text>
            </TouchableOpacity>
            <Text style={styles.tagText}>CALM AUDIO · POLEPOLE</Text>
          </View>

          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Chill & Soundscapes</Text>
            <Text style={styles.subhead}>
              Audio that respects your peace. No loud ads, no urgency.
            </Text>
          </View>

          {/* Featured: Podcast of the Day Card */}
          <View style={styles.featuredCard}>
            <View style={styles.featuredTop}>
              <Text style={styles.featuredTag}>PODCAST OF THE DAY · 10 MIN</Text>
              <Text style={styles.freshTag}>NEW TODAY</Text>
            </View>

            <Text style={styles.podcastTitle}>{podcastTitle}</Text>
            <Text style={styles.podcastDesc}>{podcastDesc}</Text>

            {/* Audio player progress bar */}
            <View style={styles.progressBarWrap}>
              <View style={[styles.progressBarFill, { width: isPlayingPodcast ? '45%' : '0%' }]} />
            </View>
            <View style={styles.timeRow}>
              <Text style={styles.timeText}>{isPlayingPodcast ? '04:32' : '00:00'}</Text>
              <Text style={styles.timeText}>10:00</Text>
            </View>

            <TouchableOpacity
              style={[styles.playBtn, isPlayingPodcast && styles.playBtnActive]}
              onPress={() => setIsPlayingPodcast((p) => !p)}
              activeOpacity={0.88}
            >
              <Text style={styles.playBtnText}>
                {isPlayingPodcast ? 'Pause episode' : 'Listen now →'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Ambient Soundscapes Section */}
          <View style={styles.soundscapesSection}>
            <Text style={styles.sectionHeading}>Ambient Soundscapes</Text>
            <View style={styles.soundscapeList}>
              {SOUNDSCAPES.map((item) => {
                const isSelected = activeSoundscape === item.id;
                return (
                  <TouchableOpacity
                    key={item.id}
                    style={[styles.soundscapeCard, isSelected && styles.soundscapeCardActive]}
                    onPress={() => setActiveSoundscape(isSelected ? null : item.id)}
                    activeOpacity={0.85}
                  >
                    <View style={styles.soundscapeInfo}>
                      <Text style={[styles.soundscapeTitle, isSelected && styles.soundscapeTitleActive]}>
                        {item.title}
                      </Text>
                      <Text style={styles.soundscapeDesc}>{item.desc}</Text>
                    </View>
                    <View style={[styles.durationPill, isSelected && styles.durationPillActive]}>
                      <Text style={[styles.durationText, isSelected && styles.durationTextActive]}>
                        {isSelected ? 'Playing' : item.duration}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          <Text style={styles.footerNote}>
            Designed to quiet the background noise of life. Take all the time you need.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FAF5EE',
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 40,
  },
  scrollContainerWide: {
    paddingHorizontal: 48,
    paddingTop: 28,
  },
  wrapper: {
    width: '100%',
    maxWidth: 820,
    alignSelf: 'center',
    gap: 20,
  },
  wrapperWide: {
    paddingVertical: 10,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  backBtn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: 'rgba(73, 37, 66, 0.08)',
  },
  backBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.brand,
  },
  tagText: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#8B6DA8',
    letterSpacing: 0.8,
  },
  header: {
    gap: 6,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.textPrimary,
    letterSpacing: -0.5,
  },
  subhead: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  featuredCard: {
    backgroundColor: '#EDF5EE',
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: '#D8ECDA',
    gap: 10,
    shadowColor: '#285437',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  featuredTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  featuredTag: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#346B46',
    letterSpacing: 0.8,
  },
  freshTag: {
    fontSize: 9,
    fontWeight: '800',
    color: '#346B46',
    backgroundColor: '#FFFFFF',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 10,
  },
  podcastTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1C3E28',
    letterSpacing: -0.3,
  },
  podcastDesc: {
    fontSize: 13,
    color: '#497354',
    lineHeight: 18,
  },
  progressBarWrap: {
    height: 6,
    backgroundColor: 'rgba(0, 0, 0, 0.06)',
    borderRadius: 3,
    overflow: 'hidden',
    marginTop: 10,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#285437',
    borderRadius: 3,
  },
  timeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  timeText: {
    fontSize: 11,
    color: '#658D70',
    fontWeight: '600',
  },
  playBtn: {
    backgroundColor: '#285437',
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 22,
    alignSelf: 'flex-start',
    marginTop: 6,
  },
  playBtnActive: {
    backgroundColor: '#1C3E28',
  },
  playBtnText: {
    color: '#FFFFFF',
    fontSize: 13.5,
    fontWeight: '800',
  },
  soundscapesSection: {
    gap: 12,
    marginTop: 6,
  },
  sectionHeading: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  soundscapeList: {
    gap: 10,
  },
  soundscapeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderWidth: 1,
    borderColor: 'rgba(73, 37, 66, 0.06)',
  },
  soundscapeCardActive: {
    borderColor: '#346B46',
    backgroundColor: '#F5FAF6',
  },
  soundscapeInfo: {
    flex: 1,
    gap: 3,
    paddingRight: 12,
  },
  soundscapeTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  soundscapeTitleActive: {
    color: '#285437',
    fontWeight: '800',
  },
  soundscapeDesc: {
    fontSize: 12,
    color: '#666',
  },
  durationPill: {
    backgroundColor: '#FAF5EE',
    borderRadius: 12,
    paddingVertical: 4,
    paddingHorizontal: 10,
  },
  durationPillActive: {
    backgroundColor: '#285437',
  },
  durationText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#8B6DA8',
  },
  durationTextActive: {
    color: '#FFFFFF',
  },
  footerNote: {
    fontSize: 12,
    color: '#8B6DA8',
    textAlign: 'center',
    fontStyle: 'italic',
    marginTop: 8,
  },
});
