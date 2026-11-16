// src/screens/home/HomeScreen.jsx
// MindBloom sanctuary home screen
// Responsive layout supporting desktop sidebar & mobile bottom navigation

import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useResponsiveLayout } from '../../hooks/useResponsiveLayout';
import { colors } from '../../theme/colors';

const MOODS = [
  { id: 'low', emoji: '🌧️', label: 'Low' },
  { id: 'heavy', emoji: '☁️', label: 'Heavy' },
  { id: 'okay', emoji: '⛅', label: 'Okay' },
  { id: 'calm', emoji: '🌸', label: 'Calm' },
  { id: 'great', emoji: '☀️', label: 'Great' },
];

export const HomeScreen = ({ navigation }) => {
  const { isDesktop, isTablet } = useResponsiveLayout();
  const isWide = isDesktop || isTablet;
  const [selectedMood, setSelectedMood] = useState('calm');

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scroll, isWide && styles.scrollWide]}
      >
        <View style={[styles.container, isWide && styles.containerWide]}>
          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={styles.brandTitle}>mindbloom</Text>
              <Text style={styles.greetingTitle}>Sema, Friend. A fresh start awaits.</Text>
            </View>
          </View>

          {/* Mood Check-In */}
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>How's your heart today?</Text>
            <Text style={styles.sectionSubtitle}>No right or wrong. Just check in with yourself.</Text>
            <View style={styles.moodRow}>
              {MOODS.map((m) => (
                <TouchableOpacity
                  key={m.id}
                  style={[
                    styles.moodItem,
                    selectedMood === m.id && styles.moodItemSelected,
                  ]}
                  onPress={() => setSelectedMood(m.id)}
                  activeOpacity={0.8}
                >
                  <Text style={styles.moodEmoji}>{m.emoji}</Text>
                  <Text
                    style={[
                      styles.moodLabel,
                      selectedMood === m.id && styles.moodLabelSelected,
                    ]}
                  >
                    {m.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Companion / Aurora Banner */}
          <View style={styles.companionBanner}>
            <View style={styles.bannerText}>
              <Text style={styles.bannerHeading}>A little lighter.</Text>
              <Text style={styles.bannerHeading}>One chat at a time.</Text>
              <Text style={styles.bannerSub}>Talk through your thoughts with Aurora & your companion.</Text>
              <TouchableOpacity style={styles.bannerBtn} activeOpacity={0.85}>
                <Text style={styles.bannerBtnText}>Talk to Aurora →</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.bannerMascotWrap}>
              <Image
                source={require('../../assets/images/sloth.jpg')}
                style={styles.bannerMascot}
                resizeMode="cover"
              />
            </View>
          </View>

          {/* A moment for you */}
          <Text style={styles.sectionTitle}>A moment for you</Text>
          <View style={[styles.activitiesRow, isWide && styles.activitiesRowWide]}>
            <TouchableOpacity style={[styles.activityCard, { backgroundColor: '#EBF7EE' }]}>
              <Text style={styles.activityTag}>2 MIN · BREATHING</Text>
              <Text style={styles.activityTitle}>Tulia breath</Text>
              <Text style={styles.activityDesc}>A gentle grounding exercise to release tension.</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.activityCard, { backgroundColor: '#FFF5E8' }]}>
              <Text style={styles.activityTag}>3 MIN · JOURNAL</Text>
              <Text style={styles.activityTitle}>A little reflection</Text>
              <Text style={styles.activityDesc}>Write freely without judgment.</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.activityCard, { backgroundColor: '#F0EAFA' }]}>
              <Text style={styles.activityTag}>COMMUNITY</Text>
              <Text style={styles.activityTitle}>Community Baraza</Text>
              <Text style={styles.activityDesc}>Peer sharing in a safe, moderated space.</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.splashBg },
  scroll: { flexGrow: 1, paddingHorizontal: 20, paddingBottom: 48 },
  scrollWide: { paddingHorizontal: 48 },
  container: { width: '100%', maxWidth: 1040, alignSelf: 'center', gap: 20 },
  containerWide: { paddingVertical: 16 },
  header: { paddingTop: 12, paddingBottom: 8 },
  brandTitle: { fontSize: 24, fontWeight: '800', color: colors.brand, letterSpacing: -0.4 },
  greetingTitle: { fontSize: 22, fontWeight: '800', color: colors.textPrimary, marginTop: 4 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.06)',
    gap: 8,
  },
  sectionTitle: { fontSize: 17, fontWeight: '800', color: colors.textPrimary },
  sectionSubtitle: { fontSize: 13, color: '#777', marginBottom: 6 },
  moodRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 8 },
  moodItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 18,
    backgroundColor: colors.splashBg,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  moodItemSelected: {
    borderColor: colors.brand,
    backgroundColor: '#F0EAFA',
  },
  moodEmoji: { fontSize: 22, marginBottom: 4 },
  moodLabel: { fontSize: 12, fontWeight: '700', color: '#666' },
  moodLabelSelected: { color: colors.brand, fontWeight: '800' },
  companionBanner: {
    backgroundColor: '#EAE3F7',
    borderRadius: 24,
    padding: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#DFD5F0',
  },
  bannerText: { flex: 1, paddingRight: 16 },
  bannerHeading: { fontSize: 22, fontWeight: '800', color: colors.textPrimary, lineHeight: 28 },
  bannerSub: { fontSize: 12.5, color: '#6E5D87', marginVertical: 8 },
  bannerBtn: {
    backgroundColor: colors.brand,
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 14,
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  bannerBtnText: { color: '#fff', fontSize: 13, fontWeight: '800' },
  bannerMascotWrap: {
    width: 90,
    height: 90,
    borderRadius: 45,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#fff',
    backgroundColor: '#FCE8D8',
  },
  bannerMascot: { width: '100%', height: '100%' },
  activitiesRow: { flexDirection: 'column', gap: 12 },
  activitiesRowWide: { flexDirection: 'row' },
  activityCard: {
    flex: 1,
    borderRadius: 20,
    padding: 18,
    gap: 4,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  activityTag: { fontSize: 9.5, fontWeight: '800', color: '#777', letterSpacing: 0.6 },
  activityTitle: { fontSize: 15, fontWeight: '800', color: colors.textPrimary, marginTop: 2 },
  activityDesc: { fontSize: 12, color: '#555', lineHeight: 16 },
});
