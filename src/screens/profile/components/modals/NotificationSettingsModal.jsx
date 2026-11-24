// src/screens/profile/components/modals/NotificationSettingsModal.jsx
// Exact implementation of Figma "Notification preferences - Desktop/Mobile"
// "Protect your peace." with gentle nudge toggles, time selector, and companion illustration.

import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  Switch,
  ScrollView,
  Alert,
} from 'react-native';
import { AnimatedCompanion } from '../../../../components/companion/AnimatedCompanion';
import { useTheme } from '../../../../theme/ThemeContext';

const TIME_OPTIONS = ['7:00 AM', '8:00 AM', '9:00 AM', '1:00 PM', '8:00 PM', '9:30 PM'];

export const NotificationSettingsModal = ({
  visible,
  companionId = 'noodle',
  initialSettings,
  onClose,
  onSave,
  theme: propTheme,
  isWide = false,
}) => {
  const { theme: ctxTheme } = useTheme();
  const theme = propTheme || ctxTheme;
  const [dailyCheckIn, setDailyCheckIn] = useState(initialSettings?.dailyCheckIn ?? true);
  const [checkInTime, setCheckInTime] = useState(initialSettings?.checkInTime || '8:00 AM');
  const [barazaHugs, setBarazaHugs] = useState(initialSettings?.barazaHugs ?? true);
  const [tuliaBreathing, setTuliaBreathing] = useState(initialSettings?.tuliaBreathing ?? false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const handleSave = () => {
    onSave?.({
      dailyCheckIn,
      checkInTime,
      barazaHugs,
      tuliaBreathing,
    });
    Alert.alert('Preferences Saved', 'Your peaceful notification settings are active. Zero pressure, always.');
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={[styles.modalCard, { backgroundColor: theme.cardBg }, isWide && styles.modalCardWide]}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={onClose} style={styles.backBtn} activeOpacity={0.7}>
              <Text style={[styles.backText, { color: theme.textMuted }]}>‹ My sanctuary</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn} activeOpacity={0.7}>
              <Text style={styles.closeBtnText}>✕</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.titleWrap}>
            <Text style={[styles.tag, { color: theme.textMuted }]}>A LITTLE NUDGE, ON YOUR TERMS</Text>
            <Text style={[styles.title, { color: theme.textPrimary }]}>Protect your peace.</Text>
            <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
              Choose the notifications you'd like. A hint of encouragement, never pressure.
            </Text>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
            <View style={[styles.contentLayout, isWide && styles.contentLayoutWide]}>
              {/* Form Section */}
              <View style={[styles.formCard, { backgroundColor: '#FAF7F2' }]}>
                <Text style={[styles.formTitle, { color: theme.textPrimary }]}>Notification preferences</Text>
                <Text style={styles.formSubtitle}>Turn each reminder on or off, anytime.</Text>

                {/* Option 1: Daily Mindful Check-in */}
                <View style={styles.toggleRow}>
                  <View style={styles.toggleText}>
                    <Text style={[styles.toggleLabel, { color: theme.textPrimary }]}>Daily Mindful Check-in</Text>
                    <Text style={styles.toggleDesc}>A gentle moment to ask how you're feeling.</Text>
                  </View>
                  <Switch
                    value={dailyCheckIn}
                    onValueChange={setDailyCheckIn}
                    trackColor={{ false: '#E0D8EB', true: theme.accent }}
                    thumbColor="#FFFFFF"
                  />
                </View>

                {/* Time Picker Row (when active) */}
                {dailyCheckIn && (
                  <View style={styles.timeSelectRow}>
                    <Text style={styles.timeLabel}>Remind me at</Text>
                    <TouchableOpacity
                      style={styles.timeBtn}
                      onPress={() => setShowTimePicker(!showTimePicker)}
                      activeOpacity={0.8}
                    >
                      <Text style={styles.timeBtnText}>{checkInTime} ▾</Text>
                    </TouchableOpacity>
                  </View>
                )}

                {/* Time dropdown pills */}
                {dailyCheckIn && showTimePicker && (
                  <View style={styles.timePillsWrap}>
                    {TIME_OPTIONS.map((t) => (
                      <TouchableOpacity
                        key={t}
                        style={[
                          styles.timePill,
                          checkInTime === t && { backgroundColor: theme.accent, borderColor: theme.accent },
                        ]}
                        onPress={() => {
                          setCheckInTime(t);
                          setShowTimePicker(false);
                        }}
                      >
                        <Text
                          style={[
                            styles.timePillText,
                            checkInTime === t && { color: '#FFFFFF', fontWeight: '800' },
                          ]}
                        >
                          {t}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}

                <View style={styles.divider} />

                {/* Option 2: Baraza Hugs & Replies */}
                <View style={styles.toggleRow}>
                  <View style={styles.toggleText}>
                    <Text style={[styles.toggleLabel, { color: theme.textPrimary }]}>Baraza Hugs & Replies</Text>
                    <Text style={styles.toggleDesc}>When peers encourage your words.</Text>
                  </View>
                  <Switch
                    value={barazaHugs}
                    onValueChange={setBarazaHugs}
                    trackColor={{ false: '#E0D8EB', true: theme.accent }}
                    thumbColor="#FFFFFF"
                  />
                </View>

                <View style={styles.divider} />

                {/* Option 3: Tulia 60s Breathing Reminder */}
                <View style={styles.toggleRow}>
                  <View style={styles.toggleText}>
                    <Text style={[styles.toggleLabel, { color: theme.textPrimary }]}>Tulia 60s Breathing Reminder</Text>
                    <Text style={styles.toggleDesc}>An afternoon nervous system reset.</Text>
                  </View>
                  <Switch
                    value={tuliaBreathing}
                    onValueChange={setTuliaBreathing}
                    trackColor={{ false: '#E0D8EB', true: theme.accent }}
                    thumbColor="#FFFFFF"
                  />
                </View>

                {/* Action Buttons */}
                <View style={styles.actionsRow}>
                  <TouchableOpacity
                    style={[styles.saveBtn, { backgroundColor: theme.accent }]}
                    onPress={handleSave}
                    activeOpacity={0.88}
                  >
                    <Text style={styles.saveBtnText}>Save preferences</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.cancelBtn} onPress={onClose} activeOpacity={0.7}>
                    <Text style={styles.cancelBtnText}>Cancel</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Side Companion Note Card matching Figma image 2 */}
              <View style={[styles.companionCard, { backgroundColor: theme.heroBg, borderColor: theme.heroBorder }]}>
                <View style={styles.mascotWrap}>
                  <AnimatedCompanion companionId={companionId} size={100} state="idle" interactive={true} />
                </View>
                <Text style={[styles.companionTitle, { color: theme.textPrimary }]}>Gentle nudges. No guilt trips.</Text>
                <Text style={[styles.companionDesc, { color: theme.textSecondary }]}>
                  Some days you'll want a reminder. Some days you won't. There's room for both.
                </Text>
                <Text style={[styles.companionMuted, { color: theme.textMuted }]}>
                  You can change these whenever you like.
                </Text>
              </View>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

import { styles } from '../../styles/NotificationSettingsModal.styles';
