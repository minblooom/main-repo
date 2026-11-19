// src/screens/arcade/components/GameOfTheDayHero.jsx
// Game of the Day hero banner — rich illustrated art + animated depth.
// Dynamically presents the featured daily game with animated glow and custom art scene.
// Styles extracted to src/screens/arcade/styles/GameOfTheDayHero.styles.js.

import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  StyleSheet,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { soundService } from '../audio/soundService';
import { styles } from '../styles/GameOfTheDayHero.styles';

export const GameOfTheDayHero = ({
  game,
  isWide = false,
  onPlayToday,
}) => {
  // Firefly & pulse animation
  const ff1Opacity = useRef(new Animated.Value(0.4)).current;
  const ff2Opacity = useRef(new Animated.Value(0.7)).current;
  const ff3Opacity = useRef(new Animated.Value(0.3)).current;
  const ff1Y = useRef(new Animated.Value(0)).current;
  const ff2Y = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const pulse1 = Animated.loop(
      Animated.sequence([
        Animated.timing(ff1Opacity, { toValue: 1, duration: 1600, useNativeDriver: true }),
        Animated.timing(ff1Opacity, { toValue: 0.3, duration: 1800, useNativeDriver: true }),
      ])
    );
    const pulse2 = Animated.loop(
      Animated.sequence([
        Animated.delay(600),
        Animated.timing(ff2Opacity, { toValue: 0.9, duration: 1400, useNativeDriver: true }),
        Animated.timing(ff2Opacity, { toValue: 0.4, duration: 1600, useNativeDriver: true }),
      ])
    );
    const pulse3 = Animated.loop(
      Animated.sequence([
        Animated.delay(1100),
        Animated.timing(ff3Opacity, { toValue: 0.9, duration: 1200, useNativeDriver: true }),
        Animated.timing(ff3Opacity, { toValue: 0.2, duration: 1400, useNativeDriver: true }),
      ])
    );
    const float1 = Animated.loop(
      Animated.sequence([
        Animated.timing(ff1Y, { toValue: -6, duration: 2200, useNativeDriver: true }),
        Animated.timing(ff1Y, { toValue: 4, duration: 2200, useNativeDriver: true }),
      ])
    );
    const float2 = Animated.loop(
      Animated.sequence([
        Animated.delay(800),
        Animated.timing(ff2Y, { toValue: 5, duration: 2000, useNativeDriver: true }),
        Animated.timing(ff2Y, { toValue: -5, duration: 2000, useNativeDriver: true }),
      ])
    );
    pulse1.start();
    pulse2.start();
    pulse3.start();
    float1.start();
    float2.start();
    return () => {
      pulse1.stop(); pulse2.stop(); pulse3.stop();
      float1.stop(); float2.stop();
    };
  }, []);

  if (!game) return null;

  const handlePlay = () => {
    soundService.playClick();
    onPlayToday?.();
  };

  const heroGradients = {
    bubble_pop: ['#1C0B30', '#3A1660', '#2B1248', '#160824'],
    colour_crush: ['#0A122E', '#162254', '#203278', '#0D153A'],
    canopy_runner: ['#2E1204', '#522409', '#753710', '#341505'],
    memory_match: ['#100C28', '#1E1840', '#28224E', '#14102E'],
    stack_attack: ['#1E1B4B', '#312E81', '#4338CA', '#1E1B4B'],
    block_puzzle: ['#0C2420', '#153A34', '#1E4D45', '#0A1E1A'],
  };

  const bgGradient = heroGradients[game.id] || ['#0A1E12', '#112C1A', '#1A3B27', '#0D2318'];

  return (
    <LinearGradient
      colors={bgGradient}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.heroCard, isWide && styles.heroCardWide]}
    >
      <LinearGradient
        colors={['rgba(10,25,15,0.72)', 'transparent', 'transparent']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={StyleSheet.absoluteFillObject}
        pointerEvents="none"
      />

      {/* -- Left Details Column -- */}
      <View style={[styles.leftCol, isWide && styles.leftColWide]}>
        <View style={styles.badgeRow}>
          <Text style={styles.dailyTag}>✦ GAME OF THE DAY</Text>
          <View style={styles.categoryPill}>
            <Text style={styles.categoryText}>{game.categoryLabel || 'FEATURED'}</Text>
          </View>
        </View>

        <Text style={styles.title}>{game.title}</Text>
        <Text style={styles.description}>{game.shortDesc}</Text>

        <View style={styles.metaRow}>
          <View style={styles.metaPill}>
            <Text style={styles.metaText}>⏱ {game.duration}</Text>
          </View>
          <View style={styles.metaPill}>
            <Text style={styles.metaText}>★ Featured Today</Text>
          </View>
          <View style={styles.metaPill}>
            <Text style={styles.metaText}>{game.mood || 'Joy'}</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.playBtn}
          onPress={handlePlay}
          activeOpacity={0.88}
        >
          <Text style={styles.playBtnText}>Play today's game</Text>
        </TouchableOpacity>
      </View>

      {/* -- Right Dynamic Art Scene -- */}
      <View style={[styles.artScene, isWide && styles.artSceneWide]}>
        <LinearGradient
          colors={bgGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFillObject}
        />

        {/* Ambient celestial backdrop */}
        <Text style={[styles.scLayer, { top: 10, right: 20, fontSize: 30, opacity: 0.85 }]}>
          {game.id === 'canopy_runner' ? '🌅' : '🌕'}
        </Text>
        <Text style={[styles.scLayer, { top: 14, left: 18, fontSize: 8, color: '#fff', opacity: 0.7 }]}>✦</Text>
        <Text style={[styles.scLayer, { top: 26, left: 48, fontSize: 6, color: '#B6E6BC', opacity: 0.5 }]}>✦</Text>
        <Text style={[styles.scLayer, { top: 20, right: 54, fontSize: 7, color: '#fff', opacity: 0.4 }]}>⬥</Text>

        {/* Dynamic Centerpiece Artwork */}
        {game.coverImage ? (
          <View style={styles.heroImageContainer}>
            <Image
              source={typeof game.coverImage === 'string' ? { uri: game.coverImage } : game.coverImage}
              style={styles.heroImage}
              resizeMode="cover"
            />
            <LinearGradient
              colors={['transparent', 'rgba(0,0,0,0.4)']}
              style={styles.groundFog}
              pointerEvents="none"
            />
          </View>
        ) : (
          <Text style={[styles.scCenter, { fontSize: 62 }]}>🎮</Text>
        )}

        {/* Animated sparkling floaters */}
        <Animated.Text
          style={[styles.scLayer, { top: 44, left: 24, fontSize: 14, opacity: ff1Opacity, transform: [{ translateY: ff1Y }] }]}
        >✨</Animated.Text>
        <Animated.Text
          style={[styles.scLayer, { bottom: 54, right: 26, fontSize: 11, opacity: ff2Opacity, transform: [{ translateY: ff2Y }] }]}
        >✨</Animated.Text>
        <Animated.Text
          style={[styles.scLayer, { top: 60, right: 16, fontSize: 9, opacity: ff3Opacity }]}
        >✨</Animated.Text>

        <View style={styles.ambientPill}>
          <Text style={styles.ambientText}>✨ {game.title} · Daily Pick</Text>
        </View>
      </View>
    </LinearGradient>
  );
};
