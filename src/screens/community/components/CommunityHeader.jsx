// src/screens/community/components/CommunityHeader.jsx
import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  Pressable,
  TouchableOpacity,
  Modal,
  Platform,
} from 'react-native';
import { styles } from './styles/CommunityHeader.styles';
import { useTheme } from '../../../theme/ThemeContext';
import { useI18n } from '../../../services/i18n';
import { TodayISurvivalBoard } from './TeenDailyPulse';

export const CommunityHeader = ({ userAgeBand }) => {
  const { theme } = useTheme();
  const { countryData } = useI18n();
  const isTeen = userAgeBand === '13-17';
  const [showTodayI, setShowTodayI] = useState(false);
  const closeTimerRef = useRef(null);

  const openPopover = () => {
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    setShowTodayI(true);
  };

  const scheduleClose = () => {
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    closeTimerRef.current = setTimeout(() => setShowTodayI(false), 180);
  };

  return (
    <View style={[styles.header, showTodayI && { zIndex: 50 }]}>
      <View style={styles.titleCol}>
        <Text style={[styles.headerTitle, { color: theme.textPrimary }]}>
          Baraza Community 👥
        </Text>
        <Text style={[styles.headerSubtitle, { color: theme.textSecondary }]}>
          {isTeen
            ? `13–17 Teen Space • Peer-Only & Safe`
            : `Safe, Anonymous & Live • ${countryData?.regionName || 'East Africa'}`}
        </Text>
      </View>

      <View style={styles.rightCluster}>
        {isTeen && (
          <View
            style={styles.iconAnchor}
            {...(Platform.OS === 'web'
              ? { onMouseEnter: openPopover, onMouseLeave: scheduleClose }
              : {})}
          >
            <Pressable
              onPress={() => setShowTodayI((prev) => !prev)}
              accessibilityRole="button"
              accessibilityLabel="Today I peer moments"
              style={({ pressed }) => [
                styles.todayIIconBtn,
                pressed && { opacity: 0.7 },
              ]}
            >
              <Text style={styles.todayIIcon}>🕯️</Text>
              <View style={styles.todayIDot} />
            </Pressable>

            {Platform.OS === 'web' && showTodayI && (
              <View
                onMouseEnter={openPopover}
                onMouseLeave={scheduleClose}
                style={[
                  styles.webPopover,
                  { backgroundColor: theme.cardBg, borderColor: theme.divider },
                ]}
              >
                <View style={styles.popoverTopBar}>
                  <Text style={[styles.popoverEyebrow, { color: theme.textMuted }]}>
                    TODAY I…
                  </Text>
                  <TouchableOpacity
                    onPress={() => setShowTodayI(false)}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  >
                    <Text style={[styles.closeText, { color: theme.textMuted }]}>✕</Text>
                  </TouchableOpacity>
                </View>
                <TodayISurvivalBoard />
              </View>
            )}
          </View>
        )}

        <View style={[styles.privacyBadge, { backgroundColor: 'rgba(138, 154, 134, 0.15)' }]}>
          <Text style={styles.privacyLockEmoji}>🔒</Text>
          <Text style={[styles.privacyBadgeText, { color: '#5B7057' }]}>Encrypted</Text>
        </View>
      </View>

      {Platform.OS !== 'web' && isTeen && (
        <Modal
          visible={showTodayI}
          transparent
          animationType="fade"
          onRequestClose={() => setShowTodayI(false)}
        >
          <Pressable
            style={styles.modalBackdrop}
            onPress={() => setShowTodayI(false)}
          >
            <Pressable
              style={[
                styles.mobileModalCard,
                { backgroundColor: theme.cardBg, borderColor: theme.divider },
              ]}
              onPress={() => {}}
            >
              <View style={styles.popoverTopBar}>
                <Text style={[styles.popoverEyebrow, { color: theme.textMuted }]}>
                  TODAY I…
                </Text>
                <TouchableOpacity onPress={() => setShowTodayI(false)}>
                  <Text style={[styles.closeText, { color: theme.textMuted }]}>✕</Text>
                </TouchableOpacity>
              </View>
              <TodayISurvivalBoard />
            </Pressable>
          </Pressable>
        </Modal>
      )}
    </View>
  );
};
