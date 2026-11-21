// src/screens/arcade/games/StackAttackGame.jsx
// MindBloom Stack Attack (Tower Stacking Arcade Game):
// Tap at the exact right moment as sliding slabs pass over the tower.
// Perfect alignments trigger harmonic scale chimes and combo streaks!
// Slabs that overhang are cleanly sliced off. Reach height milestones to advance across 4 sky realms.

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { soundService } from '../audio/soundService';
import { styles } from './styles/StackAttackGame.styles';

let Haptics;
try {
  Haptics = require('expo-haptics');
} catch {
  Haptics = null;
}

const TOWER_CONTAINER_WIDTH = 340;
const INITIAL_BLOCK_WIDTH = 180;
const BLOCK_HEIGHT = 22;

const SLAB_COLORS = [
  '#F43F5E', '#FB923C', '#FACC15', '#4ADE80',
  '#2DD4BF', '#38BDF8', '#818CF8', '#C084FC',
];

const REALMS = [
  { level: 1, targetHeight: 10, speed: 4, name: 'Cloud Base' },
  { level: 2, targetHeight: 22, speed: 5.5, name: 'Stratosphere' },
  { level: 3, targetHeight: 36, speed: 7, name: 'Aurora Heights' },
  { level: 4, targetHeight: 52, speed: 9, name: 'Starlight Orbit' },
];

export const StackAttackGame = ({
  isPaused = false,
  soundEnabled = true,
  onFinishGame,
  savedState = null,
  onSaveState,
}) => {
  const [currentLevel, setCurrentLevel] = useState(() => savedState?.currentLevel || 1);
  const cfg = REALMS[Math.min(currentLevel - 1, REALMS.length - 1)];

  // Stack of placed blocks: [ { width, left, color } ]
  const [stack, setStack] = useState(() => savedState?.stack || [
    {
      width: INITIAL_BLOCK_WIDTH,
      left: (TOWER_CONTAINER_WIDTH - INITIAL_BLOCK_WIDTH) / 2,
      color: '#4338CA',
    },
  ]);

  // Current moving block
  const [movingLeft, setMovingLeft] = useState(0);
  const [movingDir, setMovingDir] = useState(1); // 1 = right, -1 = left
  const [perfectCombo, setPerfectCombo] = useState(() => savedState?.perfectCombo || 0);
  const [perfectBannerText, setPerfectBannerText] = useState('');
  const [levelUpBanner, setLevelUpBanner] = useState(null);

  // Automatically persist game progress so player can pick up where they paused
  useEffect(() => {
    onSaveState?.({
      currentLevel,
      stack,
      perfectCombo,
    });
  }, [currentLevel, stack, perfectCombo]);

  const topBlock = stack[stack.length - 1];
  const currentBlockWidth = topBlock ? topBlock.width : INITIAL_BLOCK_WIDTH;

  const advanceToNextLevel = (nextLvl) => {
    soundService.playLevelUp();
    if (soundEnabled && Haptics && Platform.OS !== 'web') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    }
    const nextCfg = REALMS[nextLvl - 1];
    setLevelUpBanner({ level: nextLvl, name: nextCfg.name });
    setTimeout(() => {
      setCurrentLevel(nextLvl);
      setLevelUpBanner(null);
    }, 1800);
  };

  // Moving slab tick
  useEffect(() => {
    if (isPaused || levelUpBanner) return;

    const interval = setInterval(() => {
      setMovingLeft((prev) => {
        let next = prev + movingDir * cfg.speed;
        if (next >= TOWER_CONTAINER_WIDTH - currentBlockWidth) {
          next = TOWER_CONTAINER_WIDTH - currentBlockWidth;
          setMovingDir(-1);
        } else if (next <= 0) {
          next = 0;
          setMovingDir(1);
        }
        return next;
      });
    }, 30);

    return () => clearInterval(interval);
  }, [isPaused, movingDir, currentBlockWidth, cfg.speed, levelUpBanner]);

  // Drop / Place slab
  const handleDropBlock = () => {
    if (isPaused || levelUpBanner) return;

    const prevBlock = stack[stack.length - 1];
    const diff = movingLeft - prevBlock.left;
    const absDiff = Math.abs(diff);

    // Tolerance for "PERFECT" match (within 5px)
    if (absDiff <= 5) {
      const nextCombo = perfectCombo + 1;
      setPerfectCombo(nextCombo);
      setPerfectBannerText(`✨ PERFECT! x${nextCombo}`);
      setTimeout(() => setPerfectBannerText(''), 900);

      if (soundEnabled) {
        soundService.playPop(1.0 + Math.min(2.0, nextCombo * 0.15));
      }
      if (soundEnabled && Haptics && Platform.OS !== 'web') {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy).catch(() => {});
      }

      // Snap exactly to previous block
      const newBlock = {
        width: prevBlock.width,
        left: prevBlock.left,
        color: SLAB_COLORS[stack.length % SLAB_COLORS.length],
      };

      const newStack = [...stack, newBlock];
      setStack(newStack);

      checkProgression(newStack);
      return;
    }

    // Overhang slice calculation
    setPerfectCombo(0);
    const newWidth = prevBlock.width - absDiff;

    if (newWidth <= 0) {
      // Missed completely -> Tower collapse!
      if (soundEnabled) soundService.playMismatch();
      if (soundEnabled && Haptics && Platform.OS !== 'web') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error).catch(() => {});
      }

      onFinishGame?.({
        summary: `Reached Level ${currentLevel} (${cfg.name}) with a majestic tower height of ${stack.length} blocks!`,
        seeds: Math.min(30, 8 + Math.floor(stack.length * 0.8)),
      });
      return;
    }

    // Sliced block fits
    if (soundEnabled) soundService.playBlockPlace();
    if (soundEnabled && Haptics && Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
    }

    const newLeft = diff > 0 ? movingLeft : prevBlock.left;
    const newBlock = {
      width: newWidth,
      left: newLeft,
      color: SLAB_COLORS[stack.length % SLAB_COLORS.length],
    };

    const newStack = [...stack, newBlock];
    setStack(newStack);

    checkProgression(newStack);
  };

  const checkProgression = (newStack) => {
    const height = newStack.length;
    if (height >= cfg.targetHeight) {
      if (currentLevel < REALMS.length) {
        advanceToNextLevel(currentLevel + 1);
      } else {
        // Master victory
        onFinishGame?.({
          summary: `Orbit Master! Built an extraordinary ${height}-block spire through all 4 sky realms!`,
          seeds: 35,
        });
      }
    }
  };

  // Only render the top 12 layers for vertical screen visibility
  const visibleStack = stack.slice(Math.max(0, stack.length - 12));

  return (
    <View style={styles.container}>
      {/* Top HUD */}
      <View style={styles.hudBar}>
        <View style={styles.hudPill}>
          <Text style={styles.hudLabel}>LEVEL</Text>
          <Text style={styles.hudValue}>{currentLevel} / {REALMS.length}</Text>
        </View>

        <View style={styles.hudPill}>
          <Text style={styles.hudLabel}>REALM</Text>
          <Text style={styles.hudValue}>{cfg.name.split(' ')[0]}</Text>
        </View>

        <View style={styles.hudPill}>
          <Text style={styles.hudLabel}>HEIGHT</Text>
          <Text style={styles.hudValue}>{stack.length} / {cfg.targetHeight}</Text>
        </View>

        <View style={styles.hudPill}>
          <Text style={styles.hudLabel}>COMBO</Text>
          <Text style={styles.hudValue}>🔥 {perfectCombo}</Text>
        </View>
      </View>

      {/* Main Stacking Tower Area */}
      <View style={styles.towerArea}>
        {/* Sky background scenery */}
        <View style={styles.skyStars}>
          <Text style={styles.moonIcon}>🌙</Text>
          <Text style={styles.starCluster}>✨ ✦ ✨</Text>
        </View>

        {/* Moving Block Layer (active swinging block) */}
        <View
          style={[
            styles.movingBlock,
            {
              width: currentBlockWidth,
              left: movingLeft,
              bottom: 20 + visibleStack.length * BLOCK_HEIGHT,
              backgroundColor: SLAB_COLORS[stack.length % SLAB_COLORS.length],
            },
          ]}
        />

        {/* Stacked Placed Blocks */}
        {visibleStack.map((block, idx) => (
          <View
            key={idx}
            style={[
              styles.blockLayer,
              {
                width: block.width,
                left: block.left,
                bottom: 20 + idx * BLOCK_HEIGHT,
                backgroundColor: block.color,
              },
            ]}
          />
        ))}

        {/* Base Platform */}
        <View
          style={[
            styles.basePlatform,
            { width: INITIAL_BLOCK_WIDTH, left: (TOWER_CONTAINER_WIDTH - INITIAL_BLOCK_WIDTH) / 2 },
          ]}
        />

        {/* Perfect alignment banner */}
        {perfectBannerText ? (
          <View style={styles.perfectBanner}>
            <Text style={styles.perfectBannerText}>{perfectBannerText}</Text>
          </View>
        ) : null}
      </View>

      {/* Tap-to-Place Trigger Control */}
      <View style={styles.controlsSection}>
        <TouchableOpacity
          style={styles.dropButton}
          onPress={handleDropBlock}
          activeOpacity={0.85}
        >
          <Text style={styles.dropButtonText}>TAP TO PLACE SLAB ⚡</Text>
        </TouchableOpacity>
        <Text style={styles.hintNotice}>
          Time your tap to align perfectly with the slab below!
        </Text>
      </View>

      {/* Level Up Celebration Banner */}
      {levelUpBanner && (
        <View style={styles.levelBanner}>
          <Text style={styles.levelBannerTag}>⭐ REALM ASCENDED!</Text>
          <Text style={styles.levelBannerTitle}>Level {levelUpBanner.level}</Text>
          <Text style={styles.levelBannerSub}>{levelUpBanner.name}</Text>
        </View>
      )}
    </View>
  );
};
