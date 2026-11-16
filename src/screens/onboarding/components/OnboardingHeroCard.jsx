// src/screens/onboarding/components/OnboardingHeroCard.jsx
// Left companion hero card with animated Sloth mascot and quote bubble

import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Animated,
  Platform,
} from 'react-native';
import { colors } from '../../../theme/colors';

export const OnboardingHeroCard = ({
  tag = 'LITTLE STEPS, REAL YOU.',
  heading,
  quote,
  author = 'Noodle · here for the small steps',
  isWide = false,
}) => {
  const floatAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: -6,
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
    <View style={[styles.card, isWide && styles.cardWide]}>
      {/* Category Tag */}
      <Text style={styles.tag}>{tag}</Text>

      {/* Main Bold Heading */}
      <Text style={styles.heading}>{heading}</Text>

      {/* Floating Sloth Mascot */}
      <Animated.View
        style={[
          styles.mascotWrapper,
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
        <Text style={styles.sparkleLeft}>✦</Text>
        <Text style={styles.sparkleRight}>✦</Text>
      </Animated.View>

      {/* Bottom Quote Speech Bubble */}
      <View style={styles.bubble}>
        <Text style={styles.quoteText}>{quote}</Text>
        <Text style={styles.authorText}>{author}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.lavenderSheet,
    borderRadius: 28,
    padding: 24,
    borderWidth: 1,
    borderColor: colors.lavenderSheetBorder,
    justifyContent: 'space-between',
    gap: 14,
  },
  cardWide: {
    width: 320,
    minHeight: 460,
  },
  tag: {
    fontSize: 9.5,
    fontWeight: '800',
    color: colors.textSecondary,
    letterSpacing: 0.8,
  },
  heading: {
    fontSize: 26,
    fontWeight: '800',
    color: colors.textPrimary,
    lineHeight: 33,
    letterSpacing: -0.4,
  },
  mascotWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginVertical: 12,
  },
  mascotCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: '#FAF5EE',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    borderWidth: 3,
    borderColor: '#FFFFFF',
    shadowColor: '#492542',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 4,
  },
  mascotImage: {
    width: 140,
    height: 165,
    marginTop: -8,
  },
  sparkleLeft: {
    position: 'absolute',
    top: -2,
    left: '18%',
    fontSize: 16,
    color: '#E8B678',
    opacity: 0.9,
  },
  sparkleRight: {
    position: 'absolute',
    bottom: 2,
    right: '18%',
    fontSize: 15,
    color: '#EFA491',
    opacity: 0.9,
  },
  bubble: {
    backgroundColor: colors.white,
    borderRadius: 18,
    paddingVertical: 12,
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
  quoteText: {
    fontSize: 12.5,
    fontStyle: 'italic',
    fontWeight: '700',
    color: colors.textPrimary,
    lineHeight: 17,
  },
  authorText: {
    fontSize: 10.5,
    color: colors.textMuted,
    marginTop: 4,
  },
});
