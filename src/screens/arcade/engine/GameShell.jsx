// src/screens/arcade/engine/GameShell.jsx
// Standardized in-game shell containing top HUD, pause controls, sound toggle,
// and victory/completion celebration flows.
// Hosts the verified top games catalog in a fully immersive themed arena.

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { useTheme } from '../../../theme/ThemeContext';
import { GamePauseModal } from '../components/modals/GamePauseModal';
import { GameVictoryModal } from '../components/modals/GameVictoryModal';
import { gameSessionManager } from './gameSessionManager';
import { markPlayedToday } from './dailyRotationService';
import { soundService } from '../audio/soundService';
import { styles } from '../styles/GameShell.styles';

// Top Playable Game Components
import { BubblePopGame } from '../games/BubblePopGame';
import { ColourCrushGame } from '../games/ColourCrushGame';
import { CanopyRunnerGame } from '../games/CanopyRunnerGame';
import { MemoryMatchGame } from '../games/MemoryMatchGame';
import { StackAttackGame } from '../games/StackAttackGame';
import { BlockPuzzleGame } from '../games/BlockPuzzleGame';

export const GameShell = ({
  game,
  companionId = 'taz',
  onExit,
  shouldResume = false,
}) => {
  const { theme } = useTheme();

  const [isPaused, setIsPaused] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(soundService.isSoundEnabled());
  const [victoryState, setVictoryState] = useState(null); // { summary, seeds }
  const [restartKey, setRestartKey] = useState(0);

  const [savedState, setSavedState] = useState(null);
  const [loadedState, setLoadedState] = useState(!shouldResume);

  // Load saved state if resuming
  useEffect(() => {
    if (shouldResume && game?.id) {
      (async () => {
        try {
          const state = await gameSessionManager.getGameState(game.id);
          if (state) {
            setSavedState(state);
          }
        } catch { }
        setLoadedState(true);
      })();
    } else {
      setLoadedState(true);
    }
  }, [shouldResume, game?.id]);

  const shellBg = game?.themeColor || '#1E1B4B';

  const toggleSound = () => {
    const nextVal = !soundEnabled;
    setSoundEnabled(nextVal);
    soundService.setSoundEnabled(nextVal);
    if (nextVal) {
      soundService.playClick();
    }
  };

  const handleSaveState = (state) => {
    if (game?.id) {
      gameSessionManager.saveGameState(game.id, state);
    }
  };

  const handleFinishGame = async (result) => {
    soundService.playVictory();
    // Record game in recently played
    if (game?.id) {
      await gameSessionManager.recordGamePlayed(game.id);
      await gameSessionManager.clearGameState(game.id);
      await markPlayedToday();
    }
    setVictoryState({
      summary: result?.summary || 'You took a mindful moment for yourself.',
      seeds: result?.seeds || 10,
    });
  };

  const handlePause = () => {
    soundService.playClick();
    setIsPaused(true);
  };

  const handleResume = () => {
    soundService.playClick();
    setIsPaused(false);
  };

  const handleRestart = async () => {
    soundService.playClick();
    if (game?.id) {
      await gameSessionManager.clearGameState(game.id);
    }
    setSavedState(null);
    setVictoryState(null);
    setIsPaused(false);
    setRestartKey((k) => k + 1);
  };

  const handleExit = () => {
    soundService.playClick();
    setVictoryState(null);
    setIsPaused(false);
    onExit?.();
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: shellBg }]}>
      <StatusBar barStyle="light-content" backgroundColor={shellBg} />
      <View style={[styles.shellContainer, { backgroundColor: shellBg }]}>
        {/* Top HUD Bar */}
        <View style={styles.topHud}>
          <TouchableOpacity
            style={styles.hudBtn}
            onPress={handlePause}
            activeOpacity={0.75}
          >
            <Text style={styles.hudBtnText}>⏸ Pause</Text>
          </TouchableOpacity>

          <View style={styles.titleWrap}>
            <Text style={styles.hudTitle}>{game.title}</Text>
            <Text style={styles.hudCategory}>
              {(game.categoryLabel || 'ARCADE').toUpperCase()} · {game.duration}
            </Text>
          </View>

          <TouchableOpacity
            style={styles.soundBtn}
            onPress={toggleSound}
            activeOpacity={0.75}
          >
            <Text style={styles.soundBtnText}>{soundEnabled ? '🔊' : '🔇'}</Text>
          </TouchableOpacity>
        </View>

        {/* Gameplay Canvas Area */}
        <View style={styles.gameContent}>
          {loadedState && game.id === 'bubble_pop' && (
            <BubblePopGame
              key={restartKey}
              isPaused={isPaused}
              soundEnabled={soundEnabled}
              savedState={shouldResume ? savedState : null}
              onSaveState={handleSaveState}
              onFinishGame={handleFinishGame}
            />
          )}

          {loadedState && game.id === 'colour_crush' && (
            <ColourCrushGame
              key={restartKey}
              isPaused={isPaused}
              soundEnabled={soundEnabled}
              savedState={shouldResume ? savedState : null}
              onSaveState={handleSaveState}
              onFinishGame={handleFinishGame}
            />
          )}

          {loadedState && game.id === 'canopy_runner' && (
            <CanopyRunnerGame
              key={restartKey}
              isPaused={isPaused}
              soundEnabled={soundEnabled}
              savedState={shouldResume ? savedState : null}
              onSaveState={handleSaveState}
              onFinishGame={handleFinishGame}
            />
          )}

          {loadedState && game.id === 'memory_match' && (
            <MemoryMatchGame
              key={restartKey}
              isPaused={isPaused}
              soundEnabled={soundEnabled}
              savedState={shouldResume ? savedState : null}
              onSaveState={handleSaveState}
              onFinishGame={handleFinishGame}
            />
          )}

          {loadedState && game.id === 'stack_attack' && (
            <StackAttackGame
              key={restartKey}
              isPaused={isPaused}
              soundEnabled={soundEnabled}
              savedState={shouldResume ? savedState : null}
              onSaveState={handleSaveState}
              onFinishGame={handleFinishGame}
            />
          )}

          {loadedState && game.id === 'block_puzzle' && (
            <BlockPuzzleGame
              key={restartKey}
              isPaused={isPaused}
              soundEnabled={soundEnabled}
              savedState={shouldResume ? savedState : null}
              onSaveState={handleSaveState}
              onFinishGame={handleFinishGame}
            />
          )}
        </View>

        {/* Modals */}
        <GamePauseModal
          visible={isPaused}
          gameTitle={game.title}
          soundEnabled={soundEnabled}
          onResume={handleResume}
          onRestart={handleRestart}
          onExit={handleExit}
          onToggleSound={toggleSound}
          theme={theme}
        />

        <GameVictoryModal
          visible={!!victoryState}
          gameTitle={game.title}
          companionId={companionId}
          statsSummary={victoryState?.summary}
          seedsEarned={victoryState?.seeds || 10}
          onPlayAgain={handleRestart}
          onDone={handleExit}
          theme={theme}
        />
      </View>
    </SafeAreaView>
  );
};
