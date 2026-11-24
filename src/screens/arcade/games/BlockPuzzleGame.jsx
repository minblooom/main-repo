
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Platform,
} from 'react-native';

import { soundService } from '../audio/soundService';
import { styles } from './styles/BlockPuzzleGame.styles';

// Optional haptics
let Haptics;

try {
  Haptics = require('expo-haptics');
} catch {
  Haptics = null;
}

// ==========================================
// GAME CONSTANTS
// ==========================================

const BOARD_SIZE = 8;
const TRAY_SIZE = 3;
const LEVEL_TRANSITION_DURATION = 1800;

// ==========================================
// GAME PIECES
// ==========================================

const BASE_SHAPES = [
  { id: 'single', coords: [[0, 0]] },

  { id: 'h2', coords: [[0, 0], [0, 1]] },
  { id: 'v2', coords: [[0, 0], [1, 0]] },

  { id: 'h3', coords: [[0, 0], [0, 1], [0, 2]] },
  { id: 'v3', coords: [[0, 0], [1, 0], [2, 0]] },

  {
    id: 'sq2',
    coords: [[0, 0], [0, 1], [1, 0], [1, 1]],
  },

  {
    id: 'l_shape',
    coords: [[0, 0], [1, 0], [2, 0], [2, 1]],
  },

  {
    id: 'corner',
    coords: [[0, 0], [1, 0], [1, 1]],
  },
];

const ADVANCED_SHAPES = [
  {
    id: 't_shape',
    coords: [[0, 0], [0, 1], [0, 2], [1, 1]],
  },

  {
    id: 'h4',
    coords: [[0, 0], [0, 1], [0, 2], [0, 3]],
  },

  {
    id: 'z_shape',
    coords: [[0, 0], [0, 1], [1, 1], [1, 2]],
  },
];

// ==========================================
// LEVEL CONFIGURATION
// ==========================================

const LEVEL_CONFIGS = [
  {
    level: 1,
    targetScore: 250,
    obstacleCoords: [],
    shapePool: BASE_SHAPES,
    name: 'Open Glade',
  },

  {
    level: 2,
    targetScore: 600,
    obstacleCoords: [[3, 3], [4, 4]],
    shapePool: BASE_SHAPES,
    name: 'Granite Ridge',
  },

  {
    level: 3,
    targetScore: 1000,
    obstacleCoords: [
      [2, 2],
      [5, 5],
      [2, 5],
      [5, 2],
    ],
    shapePool: [...BASE_SHAPES, ...ADVANCED_SHAPES],
    name: 'Ancient Monoliths',
  },

  {
    level: 4,
    targetScore: 1500,
    obstacleCoords: [
      [1, 3],
      [1, 4],
      [6, 3],
      [6, 4],
    ],
    shapePool: [...BASE_SHAPES, ...ADVANCED_SHAPES],
    name: 'Mystic Sanctuary',
  },
];

// ==========================================
// HELPER FUNCTIONS
// ==========================================

// Generate random pieces for the tray.
function getRandomShapes(shapePool) {
  const shapes = [];

  for (let i = 0; i < TRAY_SIZE; i++) {
    const shape =
      shapePool[Math.floor(Math.random() * shapePool.length)];

    shapes.push({
      ...shape,
      instanceId: `${shape.id}_${Date.now()}_${i}_${Math.random()}`,
    });
  }

  return shapes;
}

// Create a fresh board.
function createInitialBoard(obstacleCoords = []) {
  const board = Array.from(
    { length: BOARD_SIZE },
    () => Array(BOARD_SIZE).fill(false)
  );

  obstacleCoords.forEach(([row, col]) => {
    board[row][col] = 'obstacle';
  });

  return board;
}

// Check whether a piece fits at a specific position.
function canPlaceAt(board, piece, row, col) {
  return piece.coords.every(([dr, dc]) => {
    const newRow = row + dr;
    const newCol = col + dc;

    return (
      newRow >= 0 &&
      newRow < BOARD_SIZE &&
      newCol >= 0 &&
      newCol < BOARD_SIZE &&
      board[newRow][newCol] === false
    );
  });
}

// Check whether a specific piece can fit anywhere.
function canPlacePiece(board, piece) {
  if (!piece) return false;

  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      if (canPlaceAt(board, piece, row, col)) {
        return true;
      }
    }
  }

  return false;
}

// Check whether ANY available piece can fit anywhere.
function hasAnyValidMove(board, pieces) {
  return pieces.some(
    (piece) => piece && canPlacePiece(board, piece)
  );
}

// ==========================================
// MAIN GAME COMPONENT
// ==========================================

export const BlockPuzzleGame = ({
  isPaused = false,
  soundEnabled = true,
  onFinishGame,
  savedState = null,
  onSaveState,
}) => {

  // ========================================
  // GAME STATE
  // ========================================

  const [currentLevel, setCurrentLevel] = useState(() => savedState?.currentLevel || 1);

  const [board, setBoard] = useState(() =>
    savedState?.board || createInitialBoard(LEVEL_CONFIGS[0].obstacleCoords)
  );

  const [trayPieces, setTrayPieces] = useState(() =>
    savedState?.trayPieces || getRandomShapes(LEVEL_CONFIGS[0].shapePool)
  );

  const [selectedPieceIndex, setSelectedPieceIndex] = useState(null);

  const [score, setScore] = useState(() => savedState?.score || 0);

  const [linesClearedTotal, setLinesClearedTotal] = useState(() => savedState?.linesClearedTotal || 0);

  const [levelUpBanner, setLevelUpBanner] = useState(null);

  // Automatically persist game progress so player can pick up where they paused
  useEffect(() => {
    onSaveState?.({
      currentLevel,
      board,
      trayPieces,
      score,
      linesClearedTotal,
    });
  }, [currentLevel, board, trayPieces, score, linesClearedTotal]);

  // playing | level_transition | completed
  const [gameStatus, setGameStatus] = useState('playing');

  const transitionTimerRef = useRef(null);

  const cfg = LEVEL_CONFIGS[currentLevel - 1];

  // ========================================
  // CLEANUP
  // ========================================

  useEffect(() => {
    return () => {
      if (transitionTimerRef.current) {
        clearTimeout(transitionTimerRef.current);
      }
    };
  }, []);

  // ========================================
  // SOUND AND HAPTICS
  // ========================================

  const triggerHaptic = (type = 'success') => {
    if (
      !soundEnabled ||
      !Haptics ||
      Platform.OS === 'web'
    ) {
      return;
    }

    if (type === 'success') {
      Haptics.notificationAsync(
        Haptics.NotificationFeedbackType.Success
      ).catch(() => {});
    } else if (type === 'heavy') {
      Haptics.impactAsync(
        Haptics.ImpactFeedbackStyle.Heavy
      ).catch(() => {});
    }
  };

  // ========================================
  // GAME COMPLETION
  // ========================================

  const finishGame = (summary, seeds) => {
    if (gameStatus !== 'playing') return;

    setGameStatus('completed');
    setSelectedPieceIndex(null);

    onFinishGame?.({
      summary,
      seeds,
    });
  };

  // ========================================
  // LEVEL ADVANCEMENT
  // ========================================

  const advanceToNextLevel = (nextLevel) => {
    if (
      nextLevel > LEVEL_CONFIGS.length ||
      gameStatus !== 'playing'
    ) {
      return;
    }

    const nextConfig = LEVEL_CONFIGS[nextLevel - 1];

    if (soundEnabled) {
      soundService.playLevelUp();
    }

    triggerHaptic('success');

    // Lock gameplay during transition.
    setGameStatus('level_transition');

    setSelectedPieceIndex(null);

    setLevelUpBanner({
      level: nextLevel,
      name: nextConfig.name,
    });

    // Prepare the next level.
    transitionTimerRef.current = setTimeout(() => {

      setCurrentLevel(nextLevel);

      // Reset the board with the next level's obstacles.
      setBoard(
        createInitialBoard(nextConfig.obstacleCoords)
      );

      // Generate a fresh tray.
      setTrayPieces(
        getRandomShapes(nextConfig.shapePool)
      );

      setSelectedPieceIndex(null);

      setLevelUpBanner(null);

      // Allow gameplay again.
      setGameStatus('playing');

      transitionTimerRef.current = null;

    }, LEVEL_TRANSITION_DURATION);
  };

  // ========================================
  // SELECT A PIECE
  // ========================================

  const handleSelectPiece = (index) => {

    if (
      isPaused ||
      gameStatus !== 'playing' ||
      !trayPieces[index]
    ) {
      return;
    }

    if (soundEnabled) {
      soundService.playClick();
    }

    setSelectedPieceIndex(
      index === selectedPieceIndex ? null : index
    );
  };

  // ========================================
  // PLACE A PIECE
  // ========================================

  const handleCellPress = (row, col) => {

    if (
      isPaused ||
      gameStatus !== 'playing' ||
      selectedPieceIndex === null ||
      !trayPieces[selectedPieceIndex]
    ) {
      return;
    }

    const piece = trayPieces[selectedPieceIndex];

    // --------------------------------------
    // 1. VALIDATE PLACEMENT
    // --------------------------------------

    const canFit = canPlaceAt(
      board,
      piece,
      row,
      col
    );

    if (!canFit) {
      if (soundEnabled) {
        soundService.playMismatch();
      }

      return;
    }

    // --------------------------------------
    // 2. PLACE PIECE ON BOARD
    // --------------------------------------

    if (soundEnabled) {
      soundService.playBlockPlace();
    }

    const newBoard = board.map(
      (boardRow) => [...boardRow]
    );

    piece.coords.forEach(([dr, dc]) => {
      newBoard[row + dr][col + dc] = true;
    });

    // --------------------------------------
    // 3. REMOVE USED PIECE
    // --------------------------------------

    const newTray = [...trayPieces];

    newTray[selectedPieceIndex] = null;

    setSelectedPieceIndex(null);

    // --------------------------------------
    // 4. CHECK COMPLETED ROWS
    // --------------------------------------

    const fullRows = [];

    const fullCols = [];

    for (let r = 0; r < BOARD_SIZE; r++) {

      if (
        newBoard[r].every(
          (cell) => cell === true || cell === 'obstacle'
        )
      ) {
        fullRows.push(r);
      }
    }

    // --------------------------------------
    // 5. CHECK COMPLETED COLUMNS
    // --------------------------------------

    for (let c = 0; c < BOARD_SIZE; c++) {

      let columnFull = true;

      for (let r = 0; r < BOARD_SIZE; r++) {

        if (
          newBoard[r][c] !== true &&
          newBoard[r][c] !== 'obstacle'
        ) {
          columnFull = false;
          break;
        }
      }

      if (columnFull) {
        fullCols.push(c);
      }
    }

    // --------------------------------------
    // 6. CLEAR COMPLETED LINES
    // --------------------------------------

    const linesCount =
      fullRows.length + fullCols.length;

    if (linesCount > 0) {

      // Clear rows.
      fullRows.forEach((r) => {

        for (let c = 0; c < BOARD_SIZE; c++) {

          if (newBoard[r][c] === true) {
            newBoard[r][c] = false;
          }
        }
      });

      // Clear columns.
      fullCols.forEach((c) => {

        for (let r = 0; r < BOARD_SIZE; r++) {

          if (newBoard[r][c] === true) {
            newBoard[r][c] = false;
          }
        }
      });

      if (soundEnabled) {
        soundService.playLineClear(linesCount);
      }

      triggerHaptic('heavy');

      setLinesClearedTotal(
        (prev) => prev + linesCount
      );
    }

    // --------------------------------------
    // 7. CALCULATE SCORE
    // --------------------------------------

    const pointsGained =
      (
        piece.coords.length * 10 +
        linesCount * 50
      ) * currentLevel;

    const newScore = score + pointsGained;

    setScore(newScore);

    setBoard(newBoard);

    // --------------------------------------
    // 8. CHECK TRAY REPLENISHMENT
    // --------------------------------------

    let finalTray = newTray;

    const trayIsEmpty = newTray.every(
      (p) => p === null
    );

    if (trayIsEmpty) {

      // All three pieces have been used.
      // Generate three new pieces.

      finalTray = getRandomShapes(cfg.shapePool);

    }

    setTrayPieces(finalTray);

    // --------------------------------------
    // 9. CHECK LEVEL PROGRESSION
    // --------------------------------------

    if (newScore >= cfg.targetScore) {

      // More levels available.
      if (currentLevel < LEVEL_CONFIGS.length) {

        advanceToNextLevel(currentLevel + 1);

        return;
      }

      // ------------------------------------
      // FINAL LEVEL COMPLETED: VICTORY
      // ------------------------------------

      finishGame(
        `Block Architect! Mastered all 4 puzzle realms with ${newScore} PTS!`,
        35
      );

      return;
    }

    // --------------------------------------
    // 10. CHECK AVAILABLE MOVES
    // --------------------------------------

    // Check the updated board against every
    // remaining piece in the tray.

    const hasMoves = hasAnyValidMove(
      newBoard,
      finalTray
    );

    // --------------------------------------
    // 11. GAME OVER
    // --------------------------------------

    if (!hasMoves) {

      finishGame(
        `Reached Level ${currentLevel} (${cfg.name}) with ${newScore} PTS & ${linesClearedTotal + linesCount} lines cleared.`,
        12 + currentLevel * 4
      );

      return;
    }

    // At least one valid move exists.
    // Gameplay continues normally.
  };

  // ========================================
  // RENDER PIECE PREVIEW
  // ========================================

  const renderPiece = (piece) => {

    if (!piece) return null;

    const rows =
      Math.max(...piece.coords.map(([r]) => r)) + 1;

    const cols =
      Math.max(...piece.coords.map(([, c]) => c)) + 1;

    return (
      <View>
        {Array.from({ length: rows }, (_, r) => (

          <View
            key={r}
            style={{ flexDirection: 'row' }}
          >

            {Array.from({ length: cols }, (_, c) => {

              const hasBlock = piece.coords.some(
                ([pr, pc]) => pr === r && pc === c
              );

              return (
                <View
                  key={c}
                  style={[
                    styles.miniBlock,
                    !hasBlock && {
                      backgroundColor: 'transparent',
                    },
                  ]}
                />
              );
            })}

          </View>
        ))}
      </View>
    );
  };

  // ========================================
  // MAIN UI
  // ========================================

  return (
    <View style={styles.container}>

      {/* ==================================
          TOP HUD
      ================================== */}

      <View style={styles.hudBar}>

        <View style={styles.hudPill}>
          <Text style={styles.hudLabel}>
            LEVEL
          </Text>

          <Text style={styles.hudValue}>
            {currentLevel} / {LEVEL_CONFIGS.length}
          </Text>
        </View>

        <View style={styles.hudPill}>
          <Text style={styles.hudLabel}>
            SCORE
          </Text>

          <Text style={styles.hudValue}>
            {score}
          </Text>
        </View>

        <View style={styles.hudPill}>
          <Text style={styles.hudLabel}>
            TARGET
          </Text>

          <Text style={styles.hudValue}>
            {cfg.targetScore}
          </Text>
        </View>

        <View style={styles.hudPill}>
          <Text style={styles.hudLabel}>
            LINES
          </Text>

          <Text style={styles.hudValue}>
            {linesClearedTotal}
          </Text>
        </View>

      </View>

      {/* ==================================
          GAME BOARD
      ================================== */}

      <View style={styles.boardCard}>

        {board.map((boardRow, r) => (

          <View
            key={r}
            style={styles.gridRow}
          >

            {boardRow.map((cell, c) => (

              <TouchableOpacity
                key={c}
                style={[
                  styles.cell,

                  cell === true &&
                    styles.cellFilled,

                  cell === 'obstacle' &&
                    styles.cellObstacle,
                ]}
                onPress={() => handleCellPress(r, c)}
                activeOpacity={0.8}
                disabled={
                  isPaused ||
                  gameStatus !== 'playing'
                }
              >

                {cell === 'obstacle' ? (

                  <Text
                    style={{
                      fontSize: 10,
                      textAlign: 'center',
                    }}
                  >
                    🪨
                  </Text>

                ) : null}

              </TouchableOpacity>

            ))}

          </View>

        ))}

      </View>

      {/* ==================================
          PIECE TRAY
      ================================== */}

      <View style={styles.piecesTray}>

        {trayPieces.map((piece, idx) => {

          // Empty tray position.
          if (!piece) {
            return (
              <View
                key={`empty_${idx}`}
                style={styles.pieceCard}
              />
            );
          }

          const isSelected =
            selectedPieceIndex === idx;

          return (

            <TouchableOpacity
              key={piece.instanceId}
              style={[
                styles.pieceCard,

                isSelected &&
                  styles.pieceCardSelected,
              ]}
              onPress={() => handleSelectPiece(idx)}
              activeOpacity={0.8}
              disabled={
                isPaused ||
                gameStatus !== 'playing'
              }
            >

              {renderPiece(piece)}

            </TouchableOpacity>

          );
        })}

      </View>

      {/* ==================================
          BOTTOM HINT
      ================================== */}

      <Text style={styles.bottomHint}>

        {gameStatus === 'level_transition'
          ? 'Preparing your next realm...'
          : gameStatus === 'completed'
            ? 'Game completed!'
            : 'Select a piece, then tap any board cell to place it.'
        }

      </Text>

      {/* ==================================
          LEVEL UP CELEBRATION
      ================================== */}

      {levelUpBanner && (

        <View style={styles.levelBanner}>

          <Text style={styles.levelBannerTag}>
            🌿 LEVEL ADVANCED!
          </Text>

          <Text style={styles.levelBannerTitle}>
            Level {levelUpBanner.level}
          </Text>

          <Text style={styles.levelBannerSub}>
            {levelUpBanner.name}
          </Text>

        </View>

      )}

    </View>
  );
};
