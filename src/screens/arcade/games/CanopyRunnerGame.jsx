// src/screens/arcade/games/CanopyRunnerGame.jsx
// MindBloom Canopy Run (Action / Savanna Dash with Multi-Level Progression):
// Guide Kiko the swift companion across progressively faster and more challenging savanna trails.
// Jump over obstacles (logs, rocks) and collect glowing stars and seeds.
// Reach distance targets to advance across 4 twilight savanna realms!

import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { soundService } from '../audio/soundService';
import { styles } from './styles/CanopyRunnerGame.styles';

let Haptics;
try {
  Haptics = require('expo-haptics');
} catch {
  Haptics = null;
}

const GROUND_Y = 100; // Distance from bottom
const GRAVITY = 1.1;
const JUMP_FORCE = 17;

const LEVEL_CONFIGS = [
  { level: 1, targetDistance: 120, speed: 7, name: 'Acacia Plains', obstacleRate: 0.032 },
  { level: 2, targetDistance: 280, speed: 8.5, name: 'Amber Dunes', obstacleRate: 0.04 },
  { level: 3, targetDistance: 480, speed: 10, name: 'Baobab Ridge', obstacleRate: 0.048 },
  { level: 4, targetDistance: 720, speed: 11.5, name: 'Starfall Canopy', obstacleRate: 0.055 },
];

export const CanopyRunnerGame = ({
  isPaused = false,
  soundEnabled = true,
  onFinishGame,
  savedState = null,
  onSaveState,
}) => {
  const [currentLevel, setCurrentLevel] = useState(() => savedState?.currentLevel || 1);
  const cfg = LEVEL_CONFIGS[Math.min(currentLevel - 1, LEVEL_CONFIGS.length - 1)];

  const [playerY, setPlayerY] = useState(0); // Height above ground
  const [velocity, setVelocity] = useState(0);
  const [isGrounded, setIsGrounded] = useState(true);

  const [obstacles, setObstacles] = useState([]);
  const [collectibles, setCollectibles] = useState([]);
  const [distance, setDistance] = useState(() => savedState?.distance || 0);
  const [seedsCollected, setSeedsCollected] = useState(() => savedState?.seedsCollected || 0);
  const [hearts, setHearts] = useState(() => savedState?.hearts || 3);
  const [levelUpBanner, setLevelUpBanner] = useState(null);

  // Automatically persist game progress so player can pick up where they paused
  useEffect(() => {
    onSaveState?.({
      currentLevel,
      distance,
      seedsCollected,
      hearts,
    });
  }, [currentLevel, distance, seedsCollected, hearts]);

  const nextObsId = useRef(1);
  const nextColId = useRef(1);

  const advanceToNextLevel = (nextLvl) => {
    soundService.playLevelUp();
    if (soundEnabled && Haptics && Platform.OS !== 'web') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    }
    const nextCfg = LEVEL_CONFIGS[nextLvl - 1];
    setLevelUpBanner({ level: nextLvl, name: nextCfg.name });
    setTimeout(() => {
      setCurrentLevel(nextLvl);
      setObstacles([]);
      setCollectibles([]);
      setLevelUpBanner(null);
    }, 1800);
  };

  // Jump Action
  const handleJump = () => {
    if (isPaused || !isGrounded || levelUpBanner) return;

    if (soundEnabled) {
      soundService.playJump();
    }
    if (soundEnabled && Haptics && Platform.OS !== 'web') {
      try {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      } catch {}
    }

    setVelocity(JUMP_FORCE);
    setIsGrounded(false);
  };

  // Main Physics and Scrolling Loop
  useEffect(() => {
    if (isPaused || levelUpBanner) return;

    const interval = setInterval(() => {
      // 1. Update Player Gravity
      setPlayerY((curY) => {
        const nextY = curY + velocity;
        if (nextY <= 0) {
          setIsGrounded(true);
          setVelocity(0);
          return 0;
        } else {
          setIsGrounded(false);
          setVelocity((v) => v - GRAVITY);
          return nextY;
        }
      });

      // 2. Advance Distance
      setDistance((d) => {
        const nextD = d + 1;
        // Check level milestone
        if (nextD >= cfg.targetDistance && !levelUpBanner) {
          if (currentLevel < LEVEL_CONFIGS.length) {
            advanceToNextLevel(currentLevel + 1);
          } else {
            // Master victory
            onFinishGame?.({
              summary: `Savanna Champion! Dashed all the way through ${cfg.name} (${nextD}m) with ${seedsCollected} glowing seeds!`,
              seeds: 35,
            });
          }
        }
        return nextD;
      });

      // 3. Move and Spawn Obstacles (Logs & Rocks)
      setObstacles((prevObs) => {
        const nextObs = prevObs
          .map((obs) => ({ ...obs, x: obs.x - cfg.speed }))
          .filter((obs) => obs.x > -60);

        // Spawn new obstacle randomly based on level configuration
        if (Math.random() < cfg.obstacleRate && (nextObs.length === 0 || nextObs[nextObs.length - 1].x < 240)) {
          nextObs.push({
            id: nextObsId.current++,
            x: 420,
            emoji: Math.random() > 0.5 ? '🪵' : '🪨',
            hasCollided: false,
          });
        }
        return nextObs;
      });

      // 4. Move and Spawn Glowing Collectibles (Stars)
      setCollectibles((prevCol) => {
        const nextCol = prevCol
          .map((c) => ({ ...c, x: c.x - cfg.speed }))
          .filter((c) => c.x > -40);

        if (Math.random() < 0.045 && (nextCol.length === 0 || nextCol[nextCol.length - 1].x < 260)) {
          nextCol.push({
            id: nextColId.current++,
            x: 420,
            y: Math.random() > 0.5 ? 55 : 10,
          });
        }
        return nextCol;
      });
    }, 45);

    return () => clearInterval(interval);
  }, [isPaused, isGrounded, velocity, cfg, currentLevel, levelUpBanner, seedsCollected, onFinishGame]);

  // Collision Detection Loop
  useEffect(() => {
    if (isPaused || levelUpBanner) return;

    const PLAYER_X = 60;

    // Check collision with obstacles
    obstacles.forEach((obs) => {
      const xDist = Math.abs(obs.x - PLAYER_X);
      const isHit = xDist < 30 && playerY < 32;

      if (isHit && !obs.hasCollided) {
        obs.hasCollided = true;
        if (soundEnabled) {
          soundService.playMismatch();
        }
        if (soundEnabled && Haptics && Platform.OS !== 'web') {
          try {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
          } catch {}
        }

        setHearts((h) => {
          const nextH = h - 1;
          if (nextH <= 0) {
            onFinishGame?.({
              summary: `Reached Level ${currentLevel} (${cfg.name}) with ${distance}m dashed and ${seedsCollected} seeds!`,
              seeds: Math.min(25, 8 + Math.floor(distance / 50)),
            });
          }
          return nextH;
        });
      }
    });

    // Check collecting stars
    setCollectibles((prevCol) => {
      return prevCol.filter((col) => {
        const xDist = Math.abs(col.x - PLAYER_X);
        const yDist = Math.abs(col.y - playerY);
        const isCollected = xDist < 30 && yDist < 35;

        if (isCollected) {
          if (soundEnabled) {
            soundService.playPop(1.4);
          }
          setSeedsCollected((s) => s + 1);
          return false;
        }
        return true;
      });
    });
  }, [obstacles, collectibles, playerY, isPaused, distance, seedsCollected, soundEnabled, onFinishGame, currentLevel, cfg, levelUpBanner]);

  return (
    <View style={styles.container}>
      {/* Top HUD */}
      <View style={styles.hudBar}>
        <View style={styles.hudPill}>
          <Text style={styles.hudLabel}>LEVEL</Text>
          <Text style={styles.hudValue}>{currentLevel} / {LEVEL_CONFIGS.length}</Text>
        </View>

        <View style={styles.hudPill}>
          <Text style={styles.hudLabel}>DISTANCE</Text>
          <Text style={styles.hudValue}>{distance} m</Text>
        </View>

        <View style={styles.hudPill}>
          <Text style={styles.hudLabel}>SEEDS</Text>
          <Text style={styles.hudValue}>✨ {seedsCollected}</Text>
        </View>

        <View style={styles.hudPill}>
          <Text style={styles.hudLabel}>HEARTS</Text>
          <Text style={styles.hudValue}>{'❤️'.repeat(Math.max(0, hearts))}</Text>
        </View>
      </View>

      {/* Main Runner Field */}
      <View style={styles.trackArea}>
        {/* Sky with Sun and Cloud */}
        <View style={styles.skyScenery}>
          <Text style={styles.sunGlyph}>☀️</Text>
          <Text style={styles.cloudGlyph}>☁️</Text>
        </View>

        {/* Player Character (Kiko the Swift Fox Companion) */}
        <View
          style={[
            styles.playerCharacter,
            { bottom: GROUND_Y + playerY },
          ]}
        >
          <Text style={styles.playerEmoji}>🦊</Text>
        </View>

        {/* Obstacles (Logs & Rocks) */}
        {obstacles.map((obs) => (
          <View
            key={obs.id}
            style={[
              styles.obstacle,
              { left: obs.x, bottom: GROUND_Y },
            ]}
          >
            <Text style={styles.obstacleEmoji}>{obs.emoji}</Text>
          </View>
        ))}

        {/* Collectibles (Glowing Stars) */}
        {collectibles.map((col) => (
          <View
            key={col.id}
            style={[
              styles.collectible,
              { left: col.x, bottom: GROUND_Y + col.y },
            ]}
          >
            <Text style={styles.collectibleEmoji}>✨</Text>
          </View>
        ))}

        {/* Ground and Savannah Grass */}
        <View style={styles.groundLine}>
          <View style={styles.grassEdge}>
            {['🌿', '🌾', '🌱', '🌿', '🌾', '🌱', '🌿', '🌾'].map((g, i) => (
              <Text key={i} style={styles.grassTuft}>{g}</Text>
            ))}
          </View>
        </View>
      </View>

      {/* Tap to Jump Button */}
      <View style={styles.controlsRow}>
        <TouchableOpacity
          style={styles.jumpButton}
          onPress={handleJump}
          activeOpacity={0.85}
        >
          <Text style={styles.jumpButtonText}>TAP TO LEAP 🐾</Text>
        </TouchableOpacity>
      </View>

      {/* Level Up Banner Modal */}
      {levelUpBanner && (
        <View style={styles.levelBanner}>
          <Text style={styles.levelBannerTag}>SAVANNA REALM CLEARED!</Text>
          <Text style={styles.levelBannerTitle}>LEVEL {levelUpBanner.level} UNLOCKED 🎉</Text>
          <Text style={styles.levelBannerSub}>Entering {levelUpBanner.name} — hold onto your paws!</Text>
        </View>
      )}
    </View>
  );
};
