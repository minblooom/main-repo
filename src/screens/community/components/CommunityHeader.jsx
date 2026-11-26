// src/screens/community/components/CommunityHeader.jsx
import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TouchableOpacity,
  Modal,
  Platform,
} from 'react-native';
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

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 22,
    position: 'relative',
  },
  titleCol: {
    flex: 1,
    paddingRight: 10,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: -0.6,
  },
  headerSubtitle: {
    fontSize: 13.5,
    fontWeight: '500',
    marginTop: 2,
  },
  rightCluster: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  iconAnchor: {
    position: 'relative',
  },
  todayIIconBtn: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  todayIIcon: {
    fontSize: 20,
  },
  todayIDot: {
    position: 'absolute',
    top: 3,
    right: 3,
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: '#8B5CF6',
  },
  webPopover: {
    position: 'absolute',
    top: 40,
    right: 0,
    width: 340,
    maxWidth: '90vw',
    borderRadius: 20,
    borderWidth: 1,
    padding: 14,
    gap: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.12,
    shadowRadius: 24,
    elevation: 10,
    zIndex: 100,
  },
  popoverTopBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  popoverEyebrow: {
    fontSize: 10.5,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  closeText: {
    fontSize: 14,
    fontWeight: '700',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  mobileModalCard: {
    width: '100%',
    maxWidth: 380,
    borderRadius: 22,
    borderWidth: 1,
    padding: 16,
    gap: 10,
  },
  privacyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 99,
  },
  privacyLockEmoji: { fontSize: 12 },
  privacyBadgeText: { fontSize: 11.5, fontWeight: '700' },
});
