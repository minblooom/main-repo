// src/screens/arcade/games/ColourCrushGame.jsx
// MindBloom Bloom Crush (Mission-Based Match-3 Puzzle):
// Inspired by Candy Crush & Farm Heroes!
// Each level gives the player a specific harvest mission (e.g. Gather 12 Blossoms 🌸 and 10 Gems 💎)
// with limited moves. Accomplishing the full mission advances the level!

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { soundService } from '../audio/soundService';
import { styles } from './styles/ColourCrushGame.styles';

let Haptics;
try {
  Haptics = require('expo-haptics');
} catch {
  Haptics = null;
}

const GRID_SIZE = 6;

const ALL_ELEMENTS = [
  { id: 'blossom', emoji: '🌸', name: 'Blossom' },
  { id: 'gem',     emoji: '💎', name: 'Gem' },
  { id: 'sun',     emoji: '☀️', name: 'Sun' },
  { id: 'berry',   emoji: '🫐', name: 'Berry' },
  { id: 'leaf',    emoji: '🍃', name: 'Leaf' },
  { id: 'lotus',   emoji: '🪷', name: 'Lotus' },
];

const LEVEL_CONFIGS = [
  {
    level: 1,
    name: 'Blossom Meadow',
    elementTypes: 4,
    movesAllowed: 18,
    targetMission: [
      { elementId: 'blossom', emoji: '🌸', countNeeded: 12 },
      { elementId: 'gem',     emoji: '💎', countNeeded: 10 },
    ],
  },
  {
    level: 2,
    name: 'Sunlit Orchard',
    elementTypes: 5,
    movesAllowed: 17,
    targetMission: [
      { elementId: 'sun',   emoji: '☀️', countNeeded: 14 },
      { elementId: 'berry', emoji: '🫐', countNeeded: 12 },
    ],
  },
  {
    level: 3,
    name: 'Gemstone Falls',
    elementTypes: 5,
    movesAllowed: 16,
    targetMission: [
      { elementId: 'gem',     emoji: '💎', countNeeded: 15 },
      { elementId: 'blossom', emoji: '🌸', countNeeded: 15 },
      { elementId: 'leaf',    emoji: '🍃', countNeeded: 10 },
    ],
  },
  {
    level: 4,
    name: 'Ancient Grove',
    elementTypes: 6,
    movesAllowed: 15,
    targetMission: [
      { elementId: 'lotus', emoji: '🪷', countNeeded: 14 },
      { elementId: 'sun',   emoji: '☀️', countNeeded: 16 },
      { elementId: 'berry', emoji: '🫐', countNeeded: 14 },
    ],
  },
  {
    level: 5,
    name: 'Savanna Zenith',
    elementTypes: 6,
    movesAllowed: 14,
    targetMission: [
      { elementId: 'blossom', emoji: '🌸', countNeeded: 18 },
      { elementId: 'gem',     emoji: '💎', countNeeded: 18 },
      { elementId: 'lotus',   emoji: '🪷', countNeeded: 18 },
    ],
  },
];

function getRandomElement(elementCount = 4) {
  const pool = ALL_ELEMENTS.slice(0, elementCount);
  return pool[Math.floor(Math.random() * pool.length)];
}

function createInitialGrid(elementCount = 4) {
  const grid = [];
  for (let r = 0; r < GRID_SIZE; r++) {
    const row = [];
    for (let c = 0; c < GRID_SIZE; c++) {
      let elem;
      do {
        elem = getRandomElement(elementCount);
      } while (
        (c >= 2 && row[c - 1]?.id === elem.id && row[c - 2]?.id === elem.id) ||
        (r >= 2 && grid[r - 1]?.[c]?.id === elem.id && grid[r - 2]?.[c]?.id === elem.id)
      );
      row.push(elem);
    }
    grid.push(row);
  }
  return grid;
}

export const ColourCrushGame = ({
  isPaused = false,
  soundEnabled = true,
  onFinishGame,
  savedState = null,
  onSaveState,
}) => {
  const [currentLevel, setCurrentLevel] = useState(() => savedState?.currentLevel || 1);
  const cfg = LEVEL_CONFIGS[Math.min(currentLevel - 1, LEVEL_CONFIGS.length - 1)];

  const [grid, setGrid] = useState(() => savedState?.grid || createInitialGrid(cfg.elementTypes));
  const [selectedPos, setSelectedPos] = useState(null); // { r, c }
  const [movesRemaining, setMovesRemaining] = useState(() => savedState?.movesRemaining ?? cfg.movesAllowed);
  const [comboText, setComboText] = useState('');
  const [levelUpBanner, setLevelUpBanner] = useState(null);

  // Mission progress: { [elementId]: currentCollectedCount }
  const [missionProgress, setMissionProgress] = useState(() => {
    if (savedState?.missionProgress) {
      return savedState.missionProgress;
    }
    const init = {};
    cfg.targetMission.forEach((m) => {
      init[m.elementId] = 0;
    });
    return init;
  });

  // Automatically persist game progress so player can pick up where they paused
  useEffect(() => {
    onSaveState?.({
      currentLevel,
      grid,
      movesRemaining,
      missionProgress,
    });
  }, [currentLevel, grid, movesRemaining, missionProgress]);

  // Advance level when full harvest mission is accomplished
  const advanceToNextLevel = (nextLvl) => {
    soundService.playLevelUp();
    if (soundEnabled && Haptics && Platform.OS !== 'web') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    }
    const nextCfg = LEVEL_CONFIGS[Math.min(nextLvl - 1, LEVEL_CONFIGS.length - 1)];
    setLevelUpBanner({ level: nextLvl, name: nextCfg.name });
    setTimeout(() => {
      setCurrentLevel(nextLvl);
      setGrid(createInitialGrid(nextCfg.elementTypes));
      setSelectedPos(null);
      setMovesRemaining(nextCfg.movesAllowed);

      const nextMission = {};
      nextCfg.targetMission.forEach((m) => {
        nextMission[m.elementId] = 0;
      });
      setMissionProgress(nextMission);
      setLevelUpBanner(null);
    }, 1800);
  };

  // Find all horizontal and vertical match-3 runs
  const findMatches = (currentGrid) => {
    const matchedCoords = new Set();

    // Check rows
    for (let r = 0; r < GRID_SIZE; r++) {
      let matchLen = 1;
      for (let c = 1; c < GRID_SIZE; c++) {
        if (currentGrid[r][c]?.id === currentGrid[r][c - 1]?.id && currentGrid[r][c]) {
          matchLen++;
        } else {
          if (matchLen >= 3) {
            for (let k = 0; k < matchLen; k++) {
              matchedCoords.add(`${r},${c - 1 - k}`);
            }
          }
          matchLen = 1;
        }
      }
      if (matchLen >= 3) {
        for (let k = 0; k < matchLen; k++) {
          matchedCoords.add(`${r},${GRID_SIZE - 1 - k}`);
        }
      }
    }

    // Check columns
    for (let c = 0; c < GRID_SIZE; c++) {
      let matchLen = 1;
      for (let r = 1; r < GRID_SIZE; r++) {
        if (currentGrid[r][c]?.id === currentGrid[r - 1][c]?.id && currentGrid[r][c]) {
          matchLen++;
        } else {
          if (matchLen >= 3) {
            for (let k = 0; k < matchLen; k++) {
              matchedCoords.add(`${r - 1 - k},${c}`);
            }
          }
          matchLen = 1;
        }
      }
      if (matchLen >= 3) {
        for (let k = 0; k < matchLen; k++) {
          matchedCoords.add(`${GRID_SIZE - 1 - k},${c}`);
        }
      }
    }

    return Array.from(matchedCoords).map((coord) => {
      const [r, c] = coord.split(',').map(Number);
      return { r, c };
    });
  };

  // Handle tile tap
  const handleTilePress = (r, c) => {
    if (isPaused || movesRemaining <= 0 || levelUpBanner) return;

    if (!selectedPos) {
      if (soundEnabled) soundService.playClick();
      setSelectedPos({ r, c });
      return;
    }

    // Adjacent swap check
    const dr = Math.abs(selectedPos.r - r);
    const dc = Math.abs(selectedPos.c - c);
    const isAdjacent = (dr === 1 && dc === 0) || (dr === 0 && dc === 1);

    if (!isAdjacent) {
      if (soundEnabled) soundService.playClick();
      setSelectedPos({ r, c });
      return;
    }

    // Execute swap
    if (soundEnabled) soundService.playSwap();
    const newGrid = grid.map((row) => [...row]);
    const temp = newGrid[selectedPos.r][selectedPos.c];
    newGrid[selectedPos.r][selectedPos.c] = newGrid[r][c];
    newGrid[r][c] = temp;

    setSelectedPos(null);

    const matches = findMatches(newGrid);

    if (matches.length === 0) {
      // Revert swap
      if (soundEnabled) soundService.playMismatch();
      return;
    }

    // Valid match! Count harvested mission elements
    const remainingMoves = movesRemaining - 1;
    setMovesRemaining(remainingMoves);

    const nextMission = { ...missionProgress };
    matches.forEach(({ r: mr, c: mc }) => {
      const elem = newGrid[mr][mc];
      if (elem && elem.id in nextMission) {
        nextMission[elem.id] = (nextMission[elem.id] || 0) + 1;
      }
      newGrid[mr][mc] = null;
    });

    setMissionProgress(nextMission);

    // Cascade gravity
    for (let col = 0; col < GRID_SIZE; col++) {
      let writeRow = GRID_SIZE - 1;
      for (let row = GRID_SIZE - 1; row >= 0; row--) {
        if (newGrid[row][col] !== null) {
          if (row !== writeRow) {
            newGrid[writeRow][col] = newGrid[row][col];
            newGrid[row][col] = null;
          }
          writeRow--;
        }
      }
      for (let row = writeRow; row >= 0; row--) {
        newGrid[row][col] = getRandomElement(cfg.elementTypes);
      }
    }

    setGrid(newGrid);

    if (soundEnabled) {
      soundService.playLineClear(1 + matches.length * 0.1);
    }
    if (soundEnabled && Haptics && Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
    }

    if (matches.length >= 4) {
      setComboText(`✨ Mega Harvest!`);
      setTimeout(() => setComboText(''), 1400);
    }

    // Check if ALL mission targets are completed!
    const isMissionCompleted = cfg.targetMission.every((target) => {
      return (nextMission[target.elementId] || 0) >= target.countNeeded;
    });

    if (isMissionCompleted) {
      if (currentLevel < LEVEL_CONFIGS.length) {
        advanceToNextLevel(currentLevel + 1);
        return;
      } else {
        // Master victory
        onFinishGame?.({
          summary: `Farm Hero Grandmaster! Accomplished all 5 level missions with flying colors!`,
          seeds: 35,
        });
        return;
      }
    }

    // Moves exhausted without completing mission
    if (remainingMoves <= 0) {
      onFinishGame?.({
        summary: `Level ${currentLevel} (${cfg.name}): Moves exhausted. Try again to clear the botanical mission!`,
        seeds: 10 + currentLevel * 3,
      });
    }
  };

  return (
    <View style={styles.container}>
      {/* Top HUD with Level, Moves & Mission Goals */}
      <View style={styles.hudBar}>
        <View style={styles.hudPill}>
          <Text style={styles.hudLabel}>LEVEL</Text>
          <Text style={styles.hudValue}>{currentLevel} / {LEVEL_CONFIGS.length}</Text>
        </View>

        {/* Harvest Mission Targets (Candy Crush / Farm Heroes style) */}
        {cfg.targetMission.map((m) => {
          const count = missionProgress[m.elementId] || 0;
          const isDone = count >= m.countNeeded;

          return (
            <View
              key={m.elementId}
              style={[
                styles.hudPill,
                isDone && { backgroundColor: '#DCFCE7', borderColor: '#22C55E' },
              ]}
            >
              <Text style={styles.hudLabel}>GOAL</Text>
              <Text style={[styles.hudValue, isDone && { color: '#16A34A' }]}>
                {m.emoji} {Math.min(count, m.countNeeded)} / {m.countNeeded} {isDone ? '✓' : ''}
              </Text>
            </View>
          );
        })}

        <View style={styles.hudPill}>
          <Text style={styles.hudLabel}>MOVES</Text>
          <Text style={[styles.hudValue, movesRemaining <= 3 && { color: '#EF4444' }]}>
            {movesRemaining}
          </Text>
        </View>
      </View>

      {/* Combo Banner */}
      {comboText ? (
        <View style={styles.comboBanner}>
          <Text style={styles.comboText}>{comboText}</Text>
        </View>
      ) : null}

      {/* 6x6 Grid Board */}
      <View style={styles.boardCard}>
        {grid.map((row, r) => (
          <View key={r} style={styles.gridRow}>
            {row.map((tile, c) => {
              const isSelected = selectedPos?.r === r && selectedPos?.c === c;
              return (
                <TouchableOpacity
                  key={c}
                  style={[styles.tile, isSelected && styles.tileSelected]}
                  onPress={() => handleTilePress(r, c)}
                  activeOpacity={0.8}
                >
                  <Text style={styles.tileEmoji}>{tile?.emoji || '🌸'}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        ))}
      </View>

      <Text style={styles.bottomHint}>
        Swap adjacent tiles · Complete the harvest mission above before moves run out!
      </Text>

      {/* Level Up Celebration Banner */}
      {levelUpBanner && (
        <View style={styles.levelBanner}>
          <Text style={styles.levelBannerTag}>⭐ MISSION ACCOMPLISHED!</Text>
          <Text style={styles.levelBannerTitle}>Level {levelUpBanner.level}</Text>
          <Text style={styles.levelBannerSub}>{levelUpBanner.name}</Text>
        </View>
      )}
    </View>
  );
};
