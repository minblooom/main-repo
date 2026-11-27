// src/components/companion/AnimatedCompanion.jsx
// MindBloom Living Companion Component
// Renders responsive, breathing, tactile animated mascot with synchronized breath cycles,
// tap interactions, aura halo, and optional gentle thought bubble.

import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Platform,
} from 'react-native';
import { COMPANION_MAP } from '../../constants/companions';

// Safe optional import for haptics on native devices
let Haptics;
try {
  Haptics = require('expo-haptics');
} catch {
  Haptics = null;
}

export const AnimatedCompanion = ({
  companionId = 'noodle',
  size = 120,
  state = 'idle', // 'idle' | 'breathe' | 'happy' | 'sleep'
  interactive = true,
  showSpeechBubble = false,
  showAura = true,
  useCutout = true,
  customQuote,
  onPress,
}) => {
  const companion = COMPANION_MAP[companionId] || COMPANION_MAP.noodle;
  const imageSource = (useCutout && companion.cutoutImage) ? companion.cutoutImage : companion.image;

  // Animation values
  const floatAnim = useRef(new Animated.Value(0)).current;
  const breathAnim = useRef(new Animated.Value(1)).current;
  const auraAnim = useRef(new Animated.Value(0.4)).current;
  const tapScale = useRef(new Animated.Value(1)).current;
  const tiltAnim = useRef(new Animated.Value(0)).current;

  const [isTapped, setIsTapped] = useState(false);

  // Synchronized Breathing & Floating Engine
  useEffect(() => {
    let breathLoop;
    let floatLoop;

    if (state === 'breathe') {
      // Deep 4-second inhale, 4-second exhale for Tulia breath synchronization
      breathLoop = Animated.loop(
        Animated.sequence([
          Animated.parallel([
            Animated.timing(breathAnim, {
              toValue: 1.1,
              duration: 4000,
              useNativeDriver: Platform.OS !== 'web',
            }),
            Animated.timing(auraAnim, {
              toValue: 0.9,
              duration: 4000,
              useNativeDriver: Platform.OS !== 'web',
            }),
            Animated.timing(floatAnim, {
              toValue: -8,
              duration: 4000,
              useNativeDriver: Platform.OS !== 'web',
            }),
          ]),
          Animated.parallel([
            Animated.timing(breathAnim, {
              toValue: 1.0,
              duration: 4000,
              useNativeDriver: Platform.OS !== 'web',
            }),
            Animated.timing(auraAnim, {
              toValue: 0.35,
              duration: 4000,
              useNativeDriver: Platform.OS !== 'web',
            }),
            Animated.timing(floatAnim, {
              toValue: 0,
              duration: 4000,
              useNativeDriver: Platform.OS !== 'web',
            }),
          ]),
        ])
      );
    } else if (state === 'happy') {
      // Playful wiggle & bounce
      breathLoop = Animated.loop(
        Animated.sequence([
          Animated.timing(tiltAnim, {
            toValue: 1,
            duration: 250,
            useNativeDriver: Platform.OS !== 'web',
          }),
          Animated.timing(tiltAnim, {
            toValue: -1,
            duration: 250,
            useNativeDriver: Platform.OS !== 'web',
          }),
          Animated.timing(tiltAnim, {
            toValue: 0,
            duration: 200,
            useNativeDriver: Platform.OS !== 'web',
          }),
          Animated.delay(1200),
        ])
      );
    } else if (state === 'sleep') {
      // Slow, deep resting drift
      breathLoop = Animated.loop(
        Animated.sequence([
          Animated.timing(breathAnim, {
            toValue: 1.025,
            duration: 3200,
            useNativeDriver: Platform.OS !== 'web',
          }),
          Animated.timing(breathAnim, {
            toValue: 0.985,
            duration: 3200,
            useNativeDriver: Platform.OS !== 'web',
          }),
        ])
      );
    } else {
      // Natural idle breathing (2.4s cycle)
      breathLoop = Animated.loop(
        Animated.sequence([
          Animated.parallel([
            Animated.timing(breathAnim, {
              toValue: 1.035,
              duration: 2400,
              useNativeDriver: Platform.OS !== 'web',
            }),
            Animated.timing(auraAnim, {
              toValue: 0.65,
              duration: 2400,
              useNativeDriver: Platform.OS !== 'web',
            }),
            Animated.timing(floatAnim, {
              toValue: -5,
              duration: 2400,
              useNativeDriver: Platform.OS !== 'web',
            }),
          ]),
          Animated.parallel([
            Animated.timing(breathAnim, {
              toValue: 1.0,
              duration: 2400,
              useNativeDriver: Platform.OS !== 'web',
            }),
            Animated.timing(auraAnim, {
              toValue: 0.35,
              duration: 2400,
              useNativeDriver: Platform.OS !== 'web',
            }),
            Animated.timing(floatAnim, {
              toValue: 0,
              duration: 2400,
              useNativeDriver: Platform.OS !== 'web',
            }),
          ]),
        ])
      );
    }

    breathLoop.start();

    return () => {
      if (breathLoop) breathLoop.stop();
      if (floatLoop) floatLoop.stop();
    };
  }, [state]);

  // Handle user tap interaction
  const handlePress = () => {
    if (Haptics && Platform.OS !== 'web') {
      try {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      } catch {}
    }

    setIsTapped(true);

    // Spring bounce on tap
    Animated.sequence([
      Animated.spring(tapScale, {
        toValue: 1.12,
        friction: 4,
        tension: 180,
        useNativeDriver: Platform.OS !== 'web',
      }),
      Animated.spring(tapScale, {
        toValue: 1.0,
        friction: 5,
        tension: 120,
        useNativeDriver: Platform.OS !== 'web',
      }),
    ]).start(() => {
      setIsTapped(false);
    });

    onPress?.();
  };

  const tiltInterpolation = tiltAnim.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: ['-5deg', '0deg', '5deg'],
  });

  const auraSize = size * 1.32;
  const imageSize = size * 0.78;

  return (
    <View style={styles.container}>
      {/* Speech / Thought Bubble */}
      {showSpeechBubble && (
        <Animated.View
          style={[
            styles.speechBubble,
            { transform: [{ translateY: floatAnim }] },
          ]}
        >
          <Text style={styles.speechText}>
            "{customQuote || companion.quote.replace(/^"|"$/g, '')}"
          </Text>
          <Text style={styles.speechAuthor}>
            {companion.name} · {companion.trait.toLowerCase()}
          </Text>
          <View style={styles.speechPointer} />
        </Animated.View>
      )}

      {/* Main Mascot Interactive Wrap */}
      <TouchableOpacity
        activeOpacity={interactive ? 0.92 : 1}
        onPress={interactive ? handlePress : undefined}
        disabled={!interactive}
        style={styles.touchable}
      >
        {/* Breathing Aura Glow */}
        {showAura && (
          <Animated.View
            style={[
              styles.auraHalo,
              {
                width: auraSize,
                height: auraSize,
                borderRadius: auraSize / 2,
                backgroundColor: companion.accent || '#E8DEFF',
                opacity: auraAnim,
                transform: [{ scale: breathAnim }],
                ...(Platform.OS === 'web' ? { filter: 'blur(16px)' } : {}),
              },
            ]}
          />
        )}

        {/* Mascot Frame with Combined Breath & Tap Spring */}
        <Animated.View
          style={[
            styles.mascotCircle,
            {
              width: size,
              height: size,
              borderRadius: size / 2,
              backgroundColor: companion.accent || '#FAF5EE',
              transform: [
                { translateY: floatAnim },
                { scale: Animated.multiply(breathAnim, tapScale) },
                { rotate: tiltInterpolation },
              ],
            },
          ]}
        >
          <Image
            source={imageSource}
            style={[
              styles.mascotImg,
              { width: imageSize, height: imageSize },
            ]}
            resizeMode="contain"
          />
        </Animated.View>

        {/* Interactive Tap Hint Ring */}
        {interactive && (
          <View style={styles.tapIndicator}>
            <Text style={styles.indicatorText}>
              {state === 'breathe' ? '🌿 Breathe' : '✨ ' + companion.name}
            </Text>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  touchable: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  auraHalo: {
    position: 'absolute',
    alignSelf: 'center',
    zIndex: 1,
  },
  mascotCircle: {
    backgroundColor: '#FAF5EE',
    borderWidth: 3,
    borderColor: '#FFFFFF',
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
    shadowColor: '#492542',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 14,
    elevation: 4,
  },
  mascotImg: {
    alignSelf: 'center',
  },
  tapIndicator: {
    position: 'absolute',
    bottom: -8,
    backgroundColor: '#FFFFFF',
    paddingVertical: 2.5,
    paddingHorizontal: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(73, 37, 66, 0.08)',
    shadowColor: '#492542',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
    zIndex: 3,
  },
  indicatorText: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#6E5D87',
    letterSpacing: 0.3,
  },
  speechBubble: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 10,
    paddingHorizontal: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(73, 37, 66, 0.08)',
    shadowColor: '#492542',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
    maxWidth: 240,
    alignItems: 'center',
    position: 'relative',
    zIndex: 4,
  },
  speechText: {
    fontSize: 12,
    fontStyle: 'italic',
    color: '#38234A',
    textAlign: 'center',
    lineHeight: 16,
  },
  speechAuthor: {
    fontSize: 10,
    fontWeight: '700',
    color: '#8B6DA8',
    marginTop: 4,
  },
  speechPointer: {
    position: 'absolute',
    bottom: -6,
    width: 12,
    height: 12,
    backgroundColor: '#FFFFFF',
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: 'rgba(73, 37, 66, 0.08)',
    transform: [{ rotate: '45deg' }],
  },
});
