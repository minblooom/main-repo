// src/screens/arcade/components/modals/GamePreviewModal.jsx
// Game preview & ready screen matching the Figma standardized gameplay journey.
// Styles extracted to src/screens/arcade/styles/GamePreviewModal.styles.js.

import React from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { soundService } from '../../audio/soundService';
import { styles } from '../../styles/GamePreviewModal.styles';

export const GamePreviewModal = ({
  visible,
  game,
  isFavourited = false,
  onClose,
  onStart,
  onToggleFavourite,
  theme,
}) => {
  if (!game) return null;

  const handleStart = () => {
    soundService.playClick();
    onStart?.();
  };

  const handleClose = () => {
    soundService.playClick();
    onClose?.();
  };

  const handleFav = () => {
    soundService.playClick();
    onToggleFavourite?.();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleClose}
    >
      <View style={styles.overlay}>
        <View style={[styles.modalCard, { backgroundColor: theme.cardBg }]}>
          {/* Header Banner */}
          <LinearGradient
            colors={[game.themeColor || '#2B2342', '#1A122E']}
            style={styles.headerBanner}
          >
            <View style={styles.topBar}>
              <View style={styles.badgePill}>
                <Text style={styles.badgeText}>
                  {(game.categoryLabel || 'MINDFUL').toUpperCase()}
                </Text>
              </View>

              <View style={styles.headerRight}>
                <TouchableOpacity
                  onPress={handleFav}
                  style={styles.iconCircle}
                  activeOpacity={0.7}
                >
                  <Text style={styles.heartIcon}>{isFavourited ? '❤️' : '♡'}</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={handleClose}
                  style={styles.iconCircle}
                  activeOpacity={0.7}
                >
                  <Text style={styles.closeText}>✕</Text>
                </TouchableOpacity>
              </View>
            </View>

            <Text style={styles.gameTitle}>{game.title}</Text>
            <Text style={styles.gameDuration}>
              {game.mood} · {game.duration} · {game.difficulty}
            </Text>
          </LinearGradient>

          {/* Body Content */}
          <ScrollView contentContainerStyle={styles.scrollBody} showsVerticalScrollIndicator={false}>
            <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>
              About this peaceful pause
            </Text>
            <Text style={[styles.fullDesc, { color: theme.textSecondary }]}>
              {game.fullDesc}
            </Text>

            {/* How to Play Rules */}
            <View style={{ marginTop: 14 }}>
              <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>
                How to play
              </Text>
              <View style={styles.rulesList}>
                {game.instructions?.map((inst, index) => (
                  <View key={index} style={styles.ruleRow}>
                    <View style={[styles.ruleBullet, { backgroundColor: theme.accentSoft }]}>
                      <Text style={[styles.ruleNum, { color: theme.pillText || '#492542' }]}>
                        {index + 1}
                      </Text>
                    </View>
                    <Text style={[styles.ruleText, { color: theme.textSecondary }]}>
                      {inst}
                    </Text>
                  </View>
                ))}
              </View>
            </View>

            {/* Mindful Assurance Callout */}
            <View style={[styles.assuranceBox, { backgroundColor: theme.heroBg, borderColor: theme.heroBorder }]}>
              <Text style={[styles.assuranceText, { color: theme.textMuted }]}>
                🍃 There are no timers pushing you, and no scores to lose. Move entirely at your own pace.
              </Text>
            </View>
          </ScrollView>

          {/* Bottom Action Footer */}
          <View style={[styles.footer, { borderTopColor: theme.heroBorder, backgroundColor: theme.cardBg }]}>
            <TouchableOpacity
              style={[styles.startBtn, { backgroundColor: theme.accent || '#492542' }]}
              onPress={handleStart}
              activeOpacity={0.88}
            >
              <Text style={styles.startBtnText}>Start Peaceful Session ✨</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};
