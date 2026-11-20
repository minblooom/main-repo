// src/screens/arcade/components/modals/GamePauseModal.jsx
// In-game pause modal matching Figma standardized gameplay journey.
// Styles extracted to src/screens/arcade/styles/GamePauseModal.styles.js.

import React from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  Switch,
} from 'react-native';
import { soundService } from '../../audio/soundService';
import { styles } from '../../styles/GamePauseModal.styles';

export const GamePauseModal = ({
  visible,
  gameTitle,
  soundEnabled = true,
  onResume,
  onRestart,
  onExit,
  onToggleSound,
  theme,
}) => {
  const handleResume = () => {
    soundService.playClick();
    onResume?.();
  };

  const handleRestart = () => {
    soundService.playClick();
    onRestart?.();
  };

  const handleExit = () => {
    soundService.playClick();
    onExit?.();
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={handleResume}>
      <View style={styles.overlay}>
        <View style={[styles.modalCard, { backgroundColor: theme.cardBg }]}>
          <Text style={[styles.title, { color: theme.textPrimary }]}>Take a Breath</Text>
          <Text style={[styles.subtitle, { color: theme.textMuted }]}>
            Paused: {gameTitle}
          </Text>

          {/* Sound toggle row */}
          <View style={[styles.soundRow, { backgroundColor: theme.heroBg, borderColor: theme.heroBorder }]}>
            <View style={styles.soundTextWrap}>
              <Text style={[styles.soundLabel, { color: theme.textPrimary }]}>Sound Effects</Text>
              <Text style={[styles.soundSub, { color: theme.textMuted }]}>
                Gentle audio chimes and soothing feedback
              </Text>
            </View>
            <Switch
              value={soundEnabled}
              onValueChange={onToggleSound}
              trackColor={{ false: '#767577', true: theme.accentSoft || '#D2EBD7' }}
              thumbColor={soundEnabled ? theme.accent || '#492542' : '#f4f3f4'}
            />
          </View>

          {/* Action buttons */}
          <View style={styles.btnStack}>
            <TouchableOpacity
              style={[styles.primaryBtn, { backgroundColor: theme.accent || '#492542' }]}
              onPress={handleResume}
              activeOpacity={0.85}
            >
              <Text style={styles.primaryBtnText}>Resume Session</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.secondaryBtn, { borderColor: theme.heroBorder, backgroundColor: theme.heroBg }]}
              onPress={handleRestart}
              activeOpacity={0.8}
            >
              <Text style={[styles.secondaryBtnText, { color: theme.textPrimary }]}>
                Restart this Game
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.exitBtn, { borderColor: theme.heroBorder }]}
              onPress={handleExit}
              activeOpacity={0.8}
            >
              <Text style={[styles.exitBtnText, { color: theme.textMuted }]}>
                Quietly return to Bloom Arcade
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};
