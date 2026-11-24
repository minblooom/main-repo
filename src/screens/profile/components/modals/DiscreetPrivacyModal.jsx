// src/screens/profile/components/modals/DiscreetPrivacyModal.jsx
// Discreet Privacy Shield modal inspired by WhatsApp locked chats:
// Allows the user to disguise MindBloom notifications with custom app names & innocuous previews
// (e.g., "Daily Notes", "Hydration", "Weather", or custom).

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Switch,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../../../../theme/ThemeContext';
import { styles } from '../../styles/DiscreetPrivacyModal.styles';

const DISGUISE_STORAGE_KEY = '@mindbloom:discreet_privacy_settings';

const PRESETS = [
  {
    id: 'notes',
    name: 'Daily Study Notes',
    icon: '📝',
    sample: '1 study note is ready for your evening review.',
  },
  {
    id: 'hydration',
    name: 'Hydration Tracker',
    icon: '💧',
    sample: 'Reminder: Remember to drink a glass of water.',
  },
  {
    id: 'weather',
    name: 'Weather Bulletin',
    icon: '☁️',
    sample: 'Mild weather and calm conditions for the day.',
  },
  {
    id: 'default',
    name: 'MindBloom (Sanctuary)',
    icon: '🌸',
    sample: 'Aurora & your companion are ready whenever you are.',
  },
  {
    id: 'custom',
    name: 'Custom Name...',
    icon: '✏️',
    sample: 'Gentle reminder ready for you.',
  },
];

export const DiscreetPrivacyModal = ({ visible, onClose }) => {
  const { theme, privacyShield, togglePrivacyShield } = useTheme();

  const [selectedPreset, setSelectedPreset] = useState('notes');
  const [customName, setCustomName] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const saved = await AsyncStorage.getItem(DISGUISE_STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed.selectedPreset) setSelectedPreset(parsed.selectedPreset);
          if (parsed.customName) setCustomName(parsed.customName);
        }
      } catch { }
    })();
  }, []);

  const handleSave = async () => {
    try {
      await AsyncStorage.setItem(
        DISGUISE_STORAGE_KEY,
        JSON.stringify({
          selectedPreset,
          customName: customName.trim(),
        })
      );
    } catch { }

    Alert.alert(
      'Privacy Shield Updated 🛡️',
      `Your notification disguise is now set to "${getDisplayAppName()}". All lock-screen alerts and sensitive tags are safely disguised.`
    );
    onClose();
  };

  const getDisplayAppName = () => {
    if (selectedPreset === 'custom') {
      return customName.trim() || 'Study Notes';
    }
    const found = PRESETS.find((p) => p.id === selectedPreset);
    return found ? found.name : 'Daily Study Notes';
  };

  const getDisplayIcon = () => {
    if (selectedPreset === 'custom') return '📝';
    const found = PRESETS.find((p) => p.id === selectedPreset);
    return found ? found.icon : '📝';
  };

  const getDisplayMessage = () => {
    if (selectedPreset === 'custom') {
      return '1 new update is ready for you.';
    }
    const found = PRESETS.find((p) => p.id === selectedPreset);
    return found ? found.sample : '1 study note is ready for your review.';
  };

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={[styles.modalCard, { backgroundColor: theme.cardBg, borderColor: theme.heroBorder }]}>
          {/* Header */}
          <View style={[styles.header, { borderBottomColor: theme.heroBorder }]}>
            <View style={styles.titleRow}>
              <Text style={styles.titleIcon}>🛡️</Text>
              <Text style={[styles.title, { color: theme.textPrimary }]}>Discreet Privacy Shield</Text>
            </View>
            <TouchableOpacity style={styles.closeBtn} onPress={onClose} activeOpacity={0.7}>
              <Text style={[styles.closeBtnText, { color: theme.textSecondary }]}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* Body */}
          <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
            <Text style={[styles.introText, { color: theme.textSecondary }]}>
              Like locked chats on messaging apps, the Discreet Privacy Shield ensures no one looking over your shoulder or seeing your phone's lock screen can tell you are using a mental health app.
            </Text>

            {/* Master Switch Section */}
            <View style={[styles.switchSection, { backgroundColor: theme.bg, borderColor: theme.heroBorder }]}>
              <View style={styles.switchTextWrap}>
                <Text style={[styles.switchTitle, { color: theme.textPrimary }]}>Notification & Screen Disguise</Text>
                <Text style={[styles.switchSubtitle, { color: theme.textMuted }]}>
                  {privacyShield ? 'Shield is currently active' : 'Shield is currently off'}
                </Text>
              </View>
              <Switch
                value={privacyShield}
                onValueChange={togglePrivacyShield}
                trackColor={{ false: theme.heroBorder, true: theme.accent }}
                thumbColor={privacyShield ? '#FFFFFF' : theme.bg}
              />
            </View>

            {/* Notification App Name Aliases */}
            <Text style={[styles.sectionHeading, { color: theme.textMuted }]}>
              DISGUISE NOTIFICATION SENDER NAME
            </Text>
            <View style={styles.presetGroup}>
              {PRESETS.map((preset) => {
                const isSelected = selectedPreset === preset.id;
                return (
                  <TouchableOpacity
                    key={preset.id}
                    style={[
                      styles.presetRow,
                      { backgroundColor: theme.bg, borderColor: isSelected ? theme.accent : theme.heroBorder },
                    ]}
                    onPress={() => setSelectedPreset(preset.id)}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.presetIcon}>{preset.icon}</Text>
                    <View style={styles.presetTextWrap}>
                      <Text style={[styles.presetName, { color: theme.textPrimary }]}>{preset.name}</Text>
                      <Text style={[styles.presetPreviewHint, { color: theme.textMuted }]}>
                        Preview: "{preset.sample}"
                      </Text>
                    </View>
                    <View style={[styles.radioCircle, { borderColor: isSelected ? theme.accent : theme.textMuted }]}>
                      {isSelected && (
                        <View style={[styles.radioInner, { backgroundColor: theme.accent }]} />
                      )}
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Custom Name Input if selected */}
            {selectedPreset === 'custom' && (
              <View style={styles.customInputWrap}>
                <TextInput
                    underlineColorAndroid="transparent"
                  style={[
                    styles.customInput,
                    {
                      backgroundColor: theme.bg,
                      borderColor: theme.accent,
                      color: theme.textPrimary,
                    },
                  ]}
                  value={customName}
                  onChangeText={setCustomName}
                  placeholder="Enter discreet name (e.g. Work Tasks, Audio Player)"
                  placeholderTextColor={theme.textMuted}
                  maxLength={30}
                />
              </View>
            )}

            {/* Live Lock Screen Notification Preview */}
            <Text style={[styles.sectionHeading, { color: theme.textMuted }]}>
              LOCK SCREEN NOTIFICATION PREVIEW
            </Text>
            <View style={[styles.previewCard, { backgroundColor: theme.bg, borderColor: theme.heroBorder }]}>
              <View style={styles.previewHeader}>
                <View style={styles.previewAppBadge}>
                  <Text style={{ fontSize: 13 }}>{getDisplayIcon()}</Text>
                  <Text style={[styles.previewAppName, { color: theme.textPrimary }]}>
                    {getDisplayAppName().toUpperCase()}
                  </Text>
                </View>
                <Text style={[styles.previewTime, { color: theme.textMuted }]}>now</Text>
              </View>
              <Text style={[styles.previewMessage, { color: theme.textSecondary }]}>
                {getDisplayMessage()}
              </Text>
            </View>

            {/* Save & Apply */}
            <TouchableOpacity
              style={[styles.saveBtn, { backgroundColor: theme.accent }]}
              onPress={handleSave}
              activeOpacity={0.88}
            >
              <Text style={styles.saveBtnText}>Save Disguise Settings</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};
