// src/screens/arcade/games/BubblePopGame.jsx
// MindBloom Aim-and-Shoot Bubble Shooter with Multi-Level Progression:
// Each level introduces more ceiling rows, distinct color palettes, tighter shots,
// and escalating target scores with level-up celebration banners.

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { soundService } from '../audio/soundService';
import { styles } from './styles/BubblePopGame.styles';

let Haptics;
try {
  Haptics = require('expo-haptics');
} catch {
  Haptics = null;
}

const COLS = 6;
const ROWS = 7;

// Distinct palettes across levels
const ALL_BUBBLE_COLORS = [
  { id: 'mint',     color: '#4ADE80', name: 'Mint' },
  { id: 'lavender', color: '#A78BFA', name: 'Lavender' },
  { id: 'peach',    color: '#FB923C', name: 'Peach' },
  { id: 'sky',      color: '#38BDF8', name: 'Sky' },
  { id: 'gold',     color: '#FACC15', name: 'Gold' },
  { id: 'rose',     color: '#F43F5E', name: 'Rose' },
];

const LEVEL_CONFIGS = [
  { level: 1, initialRows: 3, colorsCount: 3, shotsAllowed: 18, targetScore: 120, name: 'Meadow Breeze' },
  { level: 2, initialRows: 4, colorsCount: 4, shotsAllowed: 16, targetScore: 300, name: 'Savanna Twilight' },
  { level: 3, initialRows: 4, colorsCount: 5, shotsAllowed: 14, targetScore: 550, name: 'River of Lights' },
  { level: 4, initialRows: 5, colorsCount: 5, shotsAllowed: 13, targetScore: 850, name: 'Canopy Starlight' },
  { level: 5, initialRows: 5, colorsCount: 6, shotsAllowed: 12, targetScore: 1200, name: 'Celestial Bloom' },
];

function getRandomBubbleColor(colorsCount = 3) {
  const pool = ALL_BUBBLE_COLORS.slice(0, colorsCount);
  return pool[Math.floor(Math.random() * pool.length)];
}

function createCeilingForLevel(cfg) {
  const grid = [];
  for (let r = 0; r < ROWS; r++) {
    const row = [];
    for (let c = 0; c < COLS; c++) {
      if (r < cfg.initialRows) {
        row.push(getRandomBubbleColor(cfg.colorsCount));
      } else {
        row.push(null);
      }
    }
    grid.push(row);
  }
  return grid;
}

export const BubblePopGame = ({
  isPaused = false,
  soundEnabled = true,
  onFinishGame,
  savedState = null,
  onSaveState,
}) => {
  const [currentLevel, setCurrentLevel] = useState(() => savedState?.currentLevel || 1);
  const cfg = LEVEL_CONFIGS[Math.min(currentLevel - 1, LEVEL_CONFIGS.length - 1)];

  const [grid, setGrid] = useState(() => savedState?.grid || createCeilingForLevel(cfg));
  const [currentBubble, setCurrentBubble] = useState(() => savedState?.currentBubble || getRandomBubbleColor(cfg.colorsCount));
  const [nextBubble, setNextBubble] = useState(() => savedState?.nextBubble || getRandomBubbleColor(cfg.colorsCount));
  const [score, setScore] = useState(() => savedState?.score || 0);
  const [shotsRemaining, setShotsRemaining] = useState(() => savedState?.shotsRemaining ?? cfg.shotsAllowed);
  const [levelUpBanner, setLevelUpBanner] = useState(null);

  // Automatically persist game progress so player can pick up where they paused
  useEffect(() => {
    onSaveState?.({
      currentLevel,
      grid,
      currentBubble,
      nextBubble,
      score,
      shotsRemaining,
    });
  }, [currentLevel, grid, score, shotsRemaining]);

  // When level advances, re-initialize board with higher difficulty configuration
  const advanceToNextLevel = (nextLvl) => {
    soundService.playLevelUp();
    if (soundEnabled && Haptics && Platform.OS !== 'web') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    }
    const nextCfg = LEVEL_CONFIGS[Math.min(nextLvl - 1, LEVEL_CONFIGS.length - 1)];
    setLevelUpBanner({ level: nextLvl, name: nextCfg.name });
    setTimeout(() => {
      setCurrentLevel(nextLvl);
      setGrid(createCeilingForLevel(nextCfg));
      setCurrentBubble(getRandomBubbleColor(nextCfg.colorsCount));
      setNextBubble(getRandomBubbleColor(nextCfg.colorsCount));
      setShotsRemaining(nextCfg.shotsAllowed);
      setLevelUpBanner(null);
    }, 1800);
  };

  // BFS to find connected cluster of same color
  const findCluster = (startR, startC, targetColorId, currentGrid) => {
    const cluster = [];
    const visited = Array(ROWS).fill(null).map(() => Array(COLS).fill(false));
    const queue = [[startR, startC]];
    visited[startR][startC] = true;

    while (queue.length > 0) {
      const [r, c] = queue.shift();
      cluster.push([r, c]);

      const neighbors = [
        [r - 1, c],
        [r + 1, c],
        [r, c - 1],
        [r, c + 1],
      ];

      for (const [nr, nc] of neighbors) {
        if (
          nr >= 0 && nr < ROWS &&
          nc >= 0 && nc < COLS &&
          !visited[nr][nc] &&
          currentGrid[nr]?.[nc]?.id === targetColorId
        ) {
          visited[nr][nc] = true;
          queue.push([nr, nc]);
        }
      }
    }
    return cluster;
  };

  // Drop floating bubbles not connected to ceiling (row 0)
  const dropOrphanBubbles = (currentGrid) => {
    const connected = Array(ROWS).fill(null).map(() => Array(COLS).fill(false));
    const queue = [];

    for (let c = 0; c < COLS; c++) {
      if (currentGrid[0][c] !== null) {
        connected[0][c] = true;
        queue.push([0, c]);
      }
    }

    while (queue.length > 0) {
      const [r, c] = queue.shift();
      const neighbors = [
        [r - 1, c], [r + 1, c], [r, c - 1], [r, c + 1],
      ];
      for (const [nr, nc] of neighbors) {
        if (
          nr >= 0 && nr < ROWS &&
          nc >= 0 && nc < COLS &&
          !connected[nr][nc] &&
          currentGrid[nr][nc] !== null
        ) {
          connected[nr][nc] = true;
          queue.push([nr, nc]);
        }
      }
    }

    const nextGrid = currentGrid.map((row, r) =>
      row.map((cell, c) => (connected[r][c] ? cell : null))
    );
    return nextGrid;
  };

  // Launch bubble into chosen column
  const handleShootColumn = (col) => {
    if (isPaused || shotsRemaining <= 0 || levelUpBanner) return;

    let targetRow = -1;
    for (let r = ROWS - 1; r >= 0; r--) {
      if (grid[r][col] === null) {
        let isAttached = false;
        if (r === 0) {
          isAttached = true;
        } else if (grid[r - 1][col] !== null) {
          isAttached = true;
        } else if (col > 0 && grid[r][col - 1] !== null) {
          isAttached = true;
        } else if (col < COLS - 1 && grid[r][col + 1] !== null) {
          isAttached = true;
        }
        if (isAttached) {
          targetRow = r;
          break;
        }
      }
    }

    if (targetRow === -1) {
      if (soundEnabled) soundService.playMismatch();
      return;
    }

    if (soundEnabled) soundService.playWhoosh();

    const placedColor = currentBubble;
    const nextGrid = grid.map((r) => [...r]);
    nextGrid[targetRow][col] = placedColor;

    const cluster = findCluster(targetRow, col, placedColor.id, nextGrid);
    let newScore = score;

    if (cluster.length >= 3) {
      if (soundEnabled) {
        soundService.playPop(1.0 + cluster.length * 0.1);
      }
      if (soundEnabled && Haptics && Platform.OS !== 'web') {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
      }

      cluster.forEach(([r, c]) => {
        nextGrid[r][c] = null;
      });

      const cleanedGrid = dropOrphanBubbles(nextGrid);
      const points = cluster.length * 15 * currentLevel;
      newScore += points;
      setScore(newScore);
      setGrid(cleanedGrid);

      // Check if all bubbles are completely popped
      const remainingBubbles = cleanedGrid.flat().filter(Boolean).length;
      if (remainingBubbles === 0) {
        if (currentLevel < LEVEL_CONFIGS.length) {
          advanceToNextLevel(currentLevel + 1);
          return;
        } else {
          onFinishGame?.({
            summary: `Bubble Maestro! Conquered all 5 Levels with a score of ${newScore}.`,
            seeds: 35,
          });
          return;
        }
      }
    } else {
      if (soundEnabled) soundService.playBlockPlace();
      setGrid(nextGrid);
    }

    const remainingShots = shotsRemaining - 1;
    setShotsRemaining(remainingShots);

    // Rotate ammunition
    setCurrentBubble(nextBubble);
    setNextBubble(getRandomBubbleColor(cfg.colorsCount));

    // Out of shots on current level
    if (remainingShots <= 0) {
      onFinishGame?.({
        summary: `Reached Level ${currentLevel} (${cfg.name}) with ${newScore} points.`,
        seeds: 10 + currentLevel * 4,
      });
    }
  };

  return (
    <View style={styles.container}>
      {/* Top HUD with Level Badge */}
      <View style={styles.hudBar}>
        <View style={styles.hudPill}>
          <Text style={styles.hudLabel}>LEVEL</Text>
          <Text style={styles.hudValue}>{currentLevel} / {LEVEL_CONFIGS.length}</Text>
        </View>

        <View style={styles.hudPill}>
          <Text style={styles.hudLabel}>SCORE</Text>
          <Text style={styles.hudValue}>{score}</Text>
        </View>

        <View style={styles.hudPill}>
          <Text style={styles.hudLabel}>REMAINING</Text>
          <Text style={styles.hudValue}>{grid.flat().filter(Boolean).length}</Text>
        </View>

        <View style={styles.hudPill}>
          <Text style={styles.hudLabel}>SHOTS</Text>
          <Text style={[styles.hudValue, shotsRemaining <= 3 && { color: '#EF4444' }]}>
            {shotsRemaining}
          </Text>
        </View>
      </View>

      {/* Ceiling Bubble Board */}
      <View style={styles.boardArea}>
        <View style={styles.ceilingBar} />
        {grid.map((row, r) => (
          <View key={r} style={styles.gridRow}>
            {row.map((cell, c) => (
              <TouchableOpacity
                key={c}
                style={styles.bubbleCell}
                onPress={() => handleShootColumn(c)}
                activeOpacity={0.8}
              >
                {cell ? (
                  <View style={[styles.bubble, { backgroundColor: cell.color }]}>
                    <View style={styles.bubbleHighlight} />
                  </View>
                ) : null}
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </View>

      {/* Bottom Launcher & Next Bubble Preview */}
      <View style={styles.launcherSection}>
        <View style={styles.launcherRow}>
          <View style={styles.nextWrap}>
            <Text style={styles.nextLabel}>NEXT</Text>
            <View style={[styles.miniBubble, { backgroundColor: nextBubble.color }]} />
          </View>

          <View style={styles.readyBubbleWrap}>
            <View style={[styles.readyBubble, { backgroundColor: currentBubble.color }]}>
              <View style={styles.bubbleHighlight} />
            </View>
          </View>

          <View style={styles.nextWrap}>
            <Text style={styles.nextLabel}>WORLD</Text>
            <Text style={{ fontSize: 13 }}>🌸</Text>
          </View>
        </View>

        <Text style={styles.aimHint}>
          Tap any column to aim and shoot · Match 3 or more!
        </Text>
      </View>

      {/* Level Up Celebration Banner Overlay */}
      {levelUpBanner && (
        <View style={styles.levelBanner}>
          <Text style={styles.levelBannerTag}>★ LEVEL ADVANCED!</Text>
          <Text style={styles.levelBannerTitle}>Level {levelUpBanner.level}</Text>
          <Text style={styles.levelBannerSub}>{levelUpBanner.name}</Text>
        </View>
      )}
    </View>
  );
};
