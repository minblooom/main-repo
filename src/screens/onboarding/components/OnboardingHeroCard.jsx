// src/screens/onboarding/components/OnboardingHeroCard.jsx
// Left companion hero card with animated Sloth mascot and quote bubble
// Identical footprint and visual geometry to the Signup hero card in Screenshot 2

import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  Animated,
  Platform,
} from 'react-native';
import { styles } from './styles/OnboardingHeroCard.styles';
import { colors } from '../../../theme/colors';

export const OnboardingHeroCard = ({
  tag = 'LITTLE STEPS, REAL YOU.',
  heading,
  quote,
  author = 'Noodle · here for the small steps',
  image = require('../../../../assets/images/sloth.jpg'),
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
            source={image}
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
