// src/screens/home/components/HeroBanners.jsx
// Side-by-side hero cards: Aurora AI Companion (with Dynamic Animated Companion) & Tulia Breath reset

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { colors } from '../../../theme/colors';
import { AnimatedCompanion } from '../../../../src/components/companion/AnimatedCompanion';

export const HeroBanners = ({
  isWide = false,
  companionId = 'noodle',
  onAuroraPress,
  onBreathPress,
}) => {
  return (
    <View style={[styles.container, isWide && styles.containerWide]}>
      {/* ── CARD 1: AURORA COMPANION (Lavender with Animated Companion) ── */}
      <View style={[styles.card, styles.auroraCard]}>
        <View style={styles.cardContent}>
          <View style={styles.tagPill}>
            <Text style={styles.tagPillText}>AURORA · AI COMPANION</Text>
          </View>

          <Text style={styles.cardTitle}>
            {'A little lighter.\nOne chat at a time.'}
          </Text>

          <Text style={styles.cardSubtitle}>
            Big feelings or small things. You can start anywhere.
          </Text>

          <TouchableOpacity
            style={styles.primaryActionBtn}
            onPress={onAuroraPress}
            activeOpacity={0.88}
          >
            <Text style={styles.primaryActionBtnText}>Talk to Aurora →</Text>
          </TouchableOpacity>
        </View>

        {/* Dynamic Living Animated Companion */}
        <View style={styles.mascotContainer}>
          <AnimatedCompanion
            companionId={companionId}
            size={112}
            state="idle"
            interactive={true}
          />
        </View>
      </View>

      {/* ── CARD 2: TULIA BREATH (Mint Green Reset) ────────────────── */}
      <View style={[styles.card, styles.breathCard]}>
        <View style={styles.tagPillMint}>
          <Text style={styles.tagPillTextMint}>LET'S START SMALL</Text>
        </View>

        <Text style={styles.cardTitle}>
          Find a little breathing room.
        </Text>

        <Text style={styles.cardSubtitle}>
          Two minutes. Nothing to get right.
        </Text>

        {/* Inner Mini Card */}
        <View style={styles.innerBreathCard}>
          <View style={styles.breathTextCol}>
            <Text style={styles.innerBreathTitle}>Tulia breath</Text>
            <Text style={styles.innerBreathDesc}>A gentle grounding reset</Text>
          </View>
          <View style={styles.breathBadgeWrap}>
            <Text style={styles.breathBadgeText}>2 MIN</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.breathActionBtn}
          onPress={onBreathPress}
          activeOpacity={0.88}
        >
          <Text style={styles.breathActionBtnText}>Take a breath →</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    gap: 16,
  },
  containerWide: {
    flexDirection: 'row',
    alignItems: 'stretch',
    gap: 20,
  },
  card: {
    flex: 1,
    borderRadius: 26,
    padding: 24,
    justifyContent: 'space-between',
    borderWidth: 1,
    shadowColor: '#492542',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  auroraCard: {
    backgroundColor: '#EAE3F7',
    borderColor: '#DFD5F0',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 220,
  },
  cardContent: {
    flex: 1,
    paddingRight: 12,
  },
  tagPill: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingVertical: 4,
    paddingHorizontal: 10,
    alignSelf: 'flex-start',
    marginBottom: 10,
  },
  tagPillText: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#8B6DA8',
    letterSpacing: 0.6,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.textPrimary,
    lineHeight: 28,
    letterSpacing: -0.4,
    marginBottom: 6,
  },
  cardSubtitle: {
    fontSize: 12.5,
    color: '#6E5D87',
    lineHeight: 18,
    marginBottom: 16,
  },
  primaryActionBtn: {
    backgroundColor: colors.brand,
    borderRadius: 16,
    paddingVertical: 11,
    paddingHorizontal: 18,
    alignSelf: 'flex-start',
    shadowColor: colors.brand,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },
  primaryActionBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0.2,
  },

  // Companion Container
  mascotContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginLeft: 4,
  },

  // Breath Card Styles
  breathCard: {
    backgroundColor: '#EBF7EE',
    borderColor: '#D4EBD9',
    minHeight: 220,
  },
  tagPillMint: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingVertical: 4,
    paddingHorizontal: 10,
    alignSelf: 'flex-start',
    marginBottom: 10,
  },
  tagPillTextMint: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#528562',
    letterSpacing: 0.6,
  },
  innerBreathCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.04)',
  },
  breathTextCol: {
    gap: 2,
  },
  innerBreathTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#1A1A1A',
  },
  innerBreathDesc: {
    fontSize: 11.5,
    color: '#666',
  },
  breathBadgeWrap: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
    backgroundColor: '#EBF7EE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  breathBadgeText: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#346B46',
    letterSpacing: 0.5,
  },
  breathActionBtn: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 11,
    paddingHorizontal: 18,
    alignSelf: 'flex-start',
    borderWidth: 1.5,
    borderColor: '#C6E3CD',
  },
  breathActionBtnText: {
    color: '#285437',
    fontSize: 13,
    fontWeight: '800',
  },
});
