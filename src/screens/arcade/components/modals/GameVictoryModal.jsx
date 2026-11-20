// src/screens/arcade/components/modals/GameVictoryModal.jsx
// Completion celebration with companion cheer, reward seeds, and replay options.
// Styles extracted to src/screens/arcade/styles/GameVictoryModal.styles.js.

import React from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
} from 'react-native';
import { AnimatedCompanion } from '../../../../components/companion/AnimatedCompanion';
import { useTheme } from '../../../../theme/ThemeContext';
import { soundService } from '../../audio/soundService';
import { styles } from '../../styles/GameVictoryModal.styles';

export const GameVictoryModal = ({
  visible,
  gameTitle,
  companionId = 'taz',
  statsSummary = 'A quiet, refreshing pause.',
  seedsEarned = 10,
  onPlayAgain,
  onDone,
  theme: propTheme,
}) => {
  const { theme: ctxTheme } = useTheme();
  const theme = propTheme || ctxTheme;

  const handlePlayAgain = () => {
    soundService.playClick();
    onPlayAgain?.();
  };

  const handleDone = () => {
    soundService.playClick();
    onDone?.();
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={handleDone}>
      <View style={styles.overlay}>
        <View style={[styles.modalCard, { backgroundColor: theme.cardBg }]}>
          {/* Confetti & Companion Mascot */}
          <View style={styles.mascotArea}>
            <View style={[styles.companionCircle, { backgroundColor: theme.heroBg }]}>
              <AnimatedCompanion
                companionId={companionId}
                state="happy"
                size={88}
                showAura={true}
                interactive={false}
              />
            </View>
          </View>

          <Text style={[styles.sparkTag, { color: theme.pillText || '#7C5CBF' }]}>
            ✨ MINDFUL MOMENT COMPLETE
          </Text>
          <Text style={[styles.title, { color: theme.textPrimary }]}>
            Well done, peaceful explorer!
          </Text>
          <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
            {gameTitle}
          </Text>

          {/* Stats & Seeds Card */}
          <View style={[styles.statsCard, { backgroundColor: theme.heroBg, borderColor: theme.heroBorder }]}>
            <Text style={[styles.statsText, { color: theme.textPrimary }]}>{statsSummary}</Text>
            <View style={[styles.seedPill, { backgroundColor: theme.accentSoft, borderColor: theme.accentBorder }]}>
              <Text style={[styles.seedText, { color: theme.pillText || '#8A531C' }]}>
                🌱 +{seedsEarned} Seeds collected for your Sanctuary
              </Text>
            </View>
          </View>

          {/* Action buttons */}
          <View style={styles.btnRow}>
            <TouchableOpacity
              style={[styles.replayBtn, { borderColor: theme.heroBorder, backgroundColor: theme.cardBg }]}
              onPress={handlePlayAgain}
              activeOpacity={0.8}
            >
              <Text style={[styles.replayText, { color: theme.textPrimary }]}>↺ Play Again</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.doneBtn, { backgroundColor: theme.accent || '#492542' }]}
              onPress={handleDone}
              activeOpacity={0.85}
            >
              <Text style={styles.doneText}>✓ Return to Arcade</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};
