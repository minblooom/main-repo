// src/screens/arcade/games/MemoryMatchGame.jsx
// MindBloom Companion Memory Match with Multi-Level Progression:
// 4 progressively challenging levels expanding from 6 cards (3 pairs) to 16 cards (8 pairs),
// with decreasing move allowances, tactile flipping, and harmonic audio.

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { soundService } from '../audio/soundService';
import { styles } from './styles/MemoryMatchGame.styles';

let Haptics;
try {
  Haptics = require('expo-haptics');
} catch {
  Haptics = null;
}

const ALL_PAIRS = [
  { pairId: 1, name: 'Taz',    emoji: '🐢', trait: 'Patience' },
  { pairId: 2, name: 'Noodle', emoji: '🦥', trait: 'Rest' },
  { pairId: 3, name: 'Kiko',   emoji: '🦊', trait: 'Curiosity' },
  { pairId: 4, name: 'Kovu',   emoji: '🦁', trait: 'Courage' },
  { pairId: 5, name: 'Acacia', emoji: '🌿', trait: 'Growth' },
  { pairId: 6, name: 'Amani',  emoji: '☀️', trait: 'Peace' },
  { pairId: 7, name: 'Jua',  emoji: '☀️', trait: 'Warmth' },
  { pairId: 8, name: 'Bora',   emoji: '🌸', trait: 'Grace' },
];

const LEVEL_CONFIGS = [
  { level: 1, pairCount: 3, maxMoves: 10, widthPct: '30%', name: 'Gentle Awakening' },
  { level: 2, pairCount: 4, maxMoves: 14, widthPct: '22%', name: 'Forest Companions' },
  { level: 3, pairCount: 6, maxMoves: 18, widthPct: '22%', name: 'Savanna Kinship' },
  { level: 4, pairCount: 8, maxMoves: 24, widthPct: '22%', name: 'Sanctuary Harmony' },
];

function buildDeck(pairCount) {
  const chosen = ALL_PAIRS.slice(0, pairCount);
  const duplicated = [
    ...chosen.map((c, i) => ({ ...c, cardId: `a_${i}` })),
    ...chosen.map((c, i) => ({ ...c, cardId: `b_${i}` })),
  ];
  return duplicated.sort(() => Math.random() - 0.5);
}

export const MemoryMatchGame = ({
  isPaused = false,
  soundEnabled = true,
  onFinishGame,
  savedState = null,
  onSaveState,
}) => {
  const [currentLevel, setCurrentLevel] = useState(() => savedState?.currentLevel || 1);
  const cfg = LEVEL_CONFIGS[Math.min(currentLevel - 1, LEVEL_CONFIGS.length - 1)];

  const [deck, setDeck] = useState(() => savedState?.deck || buildDeck(cfg.pairCount));
  const [flippedIndices, setFlippedIndices] = useState([]);
  const [matchedIds, setMatchedIds] = useState(() => savedState?.matchedIds || []);
  const [moves, setMoves] = useState(() => savedState?.moves || 0);
  const [levelUpBanner, setLevelUpBanner] = useState(null);

  // Automatically persist game progress so player can pick up where they paused
  useEffect(() => {
    onSaveState?.({
      currentLevel,
      deck,
      matchedIds,
      moves,
    });
  }, [currentLevel, deck, matchedIds, moves]);

  const advanceToNextLevel = (nextLvl) => {
    soundService.playLevelUp();
    if (soundEnabled && Haptics && Platform.OS !== 'web') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    }
    const nextCfg = LEVEL_CONFIGS[nextLvl - 1];
    setLevelUpBanner({ level: nextLvl, name: nextCfg.name });
    setTimeout(() => {
      setCurrentLevel(nextLvl);
      setDeck(buildDeck(nextCfg.pairCount));
      setFlippedIndices([]);
      setMatchedIds([]);
      setMoves(0);
      setLevelUpBanner(null);
    }, 1800);
  };

  const handleCardPress = (index) => {
    if (isPaused || levelUpBanner) return;
    if (flippedIndices.length === 2) return;
    if (flippedIndices.includes(index)) return;
    if (matchedIds.includes(deck[index].pairId)) return;

    if (soundEnabled) soundService.playCardFlip();
    const newFlipped = [...flippedIndices, index];
    setFlippedIndices(newFlipped);

    if (newFlipped.length === 2) {
      const nextMoves = moves + 1;
      setMoves(nextMoves);

      const [firstIdx, secondIdx] = newFlipped;
      const cardA = deck[firstIdx];
      const cardB = deck[secondIdx];

      if (cardA.pairId === cardB.pairId) {
        // Match found!
        if (soundEnabled) soundService.playMatch();
        if (soundEnabled && Haptics && Platform.OS !== 'web') {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
        }

        const newMatched = [...matchedIds, cardA.pairId];
        setMatchedIds(newMatched);
        setFlippedIndices([]);

        // Check if level complete
        if (newMatched.length === cfg.pairCount) {
          if (currentLevel < LEVEL_CONFIGS.length) {
            advanceToNextLevel(currentLevel + 1);
            return;
          } else {
            // Master victory
            onFinishGame?.({
              summary: `Memory Prodigy! Completed all 4 levels in total harmony.`,
              seeds: 35,
            });
            return;
          }
        }
      } else {
        // Mismatch - reset after brief glance
        if (soundEnabled) soundService.playMismatch();
        setTimeout(() => {
          setFlippedIndices([]);
        }, 900);
      }

      // Check move budget
      if (nextMoves >= cfg.maxMoves && matchedIds.length < cfg.pairCount) {
        setTimeout(() => {
          onFinishGame?.({
            summary: `Reached Level ${currentLevel} (${cfg.name}) with ${matchedIds.length} pairs matched.`,
            seeds: 10 + currentLevel * 5,
          });
        }, 800);
      }
    }
  };

  return (
    <View style={styles.container}>
      {/* Top HUD */}
      <View style={styles.hudRow}>
        <View style={styles.hudPill}>
          <Text style={styles.hudLabel}>LEVEL</Text>
          <Text style={styles.hudValue}>{currentLevel} / {LEVEL_CONFIGS.length}</Text>
        </View>

        <View style={styles.hudPill}>
          <Text style={styles.hudLabel}>PAIRS</Text>
          <Text style={styles.hudValue}>{matchedIds.length} / {cfg.pairCount}</Text>
        </View>

        <View style={styles.hudPill}>
          <Text style={styles.hudLabel}>MOVES</Text>
          <Text style={[styles.hudValue, moves >= cfg.maxMoves - 2 && { color: '#EF4444' }]}>
            {moves} / {cfg.maxMoves}
          </Text>
        </View>
      </View>

      {/* Dynamic Card Grid */}
      <View style={styles.grid}>
        {deck.map((card, index) => {
          const isFlipped = flippedIndices.includes(index) || matchedIds.includes(card.pairId);
          const isMatched = matchedIds.includes(card.pairId);

          return (
            <TouchableOpacity
              key={card.cardId}
              style={[
                styles.card,
                { width: cfg.widthPct },
                isFlipped && styles.cardFlipped,
                isMatched && styles.cardMatched,
              ]}
              onPress={() => handleCardPress(index)}
              activeOpacity={0.85}
            >
              {isFlipped ? (
                <View style={styles.cardFront}>
                  <Text style={styles.cardEmoji}>{card.emoji}</Text>
                  <Text style={styles.cardName}>{card.name}</Text>
                  <Text style={styles.cardTrait}>{card.trait}</Text>
                </View>
              ) : (
                <View style={styles.cardBack}>
                  <Text style={styles.cardBackPattern}>✦</Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </View>

      <Text style={styles.hintText}>
        Flip two cards to discover mindful companion twins.
      </Text>

      {/* Level Up Celebration Banner */}
      {levelUpBanner && (
        <View style={styles.levelBanner}>
          <Text style={styles.levelBannerTag}>🌿 LEVEL ADVANCED!</Text>
          <Text style={styles.levelBannerTitle}>Level {levelUpBanner.level}</Text>
          <Text style={styles.levelBannerSub}>{levelUpBanner.name}</Text>
        </View>
      )}
    </View>
  );
};
