// src/screens/home/components/HeroBanners.jsx
// Side-by-side hero cards: Aurora AI Companion (with Sloth mascot) & Tulia Breath reset

import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Animated,
  Platform,
} from 'react-native';
import { colors } from '../../../theme/colors';

export const HeroBanners = ({ isWide = false, onAuroraPress, onBreathPress }) => {
  const floatAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: -5,
          duration: 2400,
          useNativeDriver: Platform.OS !== 'web',
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 2400,
          useNativeDriver: Platform.OS !== 'web',
        }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, []);

  return (
    <View style={[styles.container, isWide && styles.containerWide]}>
      {/* ── CARD 1: AURORA COMPANION (Lavender with Sloth Mascot) ───── */}
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

        {/* Sloth Mascot Container */}
        <Animated.View
          style={[
            styles.mascotContainer,
            { transform: [{ translateY: floatAnim }] },
          ]}
        >
          <View style={styles.mascotCircle}>
            <Image
              source={require('../../../../assets/images/sloth.jpg')}
              style={styles.mascotImage}
              resizeMode="cover"
            />
          </View>
          {/* Subtle flower accents */}
          <Text style={styles.flowerTop}>🌸</Text>
          <Text style={styles.flowerBottom}>✨</Text>
        </Animated.View>
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
          <View style={styles.breathIconWrap}>
            <Text style={styles.breathIcon}>🍃</Text>
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

  // Sloth Mascot on Aurora Card
  mascotContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginLeft: 4,
  },
  mascotCircle: {
    width: 115,
    height: 115,
    borderRadius: 58,
    backgroundColor: '#FAF5EE',
    borderWidth: 3,
    borderColor: '#FFFFFF',
    overflow: 'hidden',
    shadowColor: '#492542',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
  },
  mascotImage: {
    width: 115,
    height: 135,
    marginTop: -8,
  },
  flowerTop: {
    position: 'absolute',
    top: -4,
    left: -4,
    fontSize: 16,
  },
  flowerBottom: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    fontSize: 16,
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
  breathIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#EBF7EE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  breathIcon: {
    fontSize: 16,
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
