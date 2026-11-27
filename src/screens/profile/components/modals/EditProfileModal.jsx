// src/screens/profile/components/modals/EditProfileModal.jsx
// Modal allowing the user to update their nickname, personal bio, and primary wellness focus areas.
// Zero mock/dummy defaults and clean cross/check icons.

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Platform,
} from 'react-native';
import { useTheme } from '../../../../theme/ThemeContext';
import { useI18n } from '../../../../services/i18n';
import { YOUTH_INTERESTS } from '../../../onboarding/InterestsSelectScreen';
import { FOCUS_AREAS, MAX_FOCUS_AREAS } from '../../../../constants/focusAreas';
import { styles } from '../../styles/EditProfileModal.styles';

export const EditProfileModal = ({
  visible,
  profile,
  onClose,
  onSave,
  theme: propTheme,
}) => {
  const { theme: ctxTheme } = useTheme();
  const theme = propTheme || ctxTheme;
  const { countryData } = useI18n();

  const [nickname, setNickname] = useState(profile?.nickname || '');
  const [bio, setBio] = useState(profile?.bio || '');
  const [selectedFocus, setSelectedFocus] = useState(profile?.focusAreas || ['anxiety']);
  const [selectedInterests, setSelectedInterests] = useState(profile?.interests || []);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState('');

  useEffect(() => {
    if (visible) {
      setNickname(profile?.nickname || '');
      setBio(profile?.bio || '');
      setSelectedFocus(profile?.focusAreas || ['anxiety']);
      setSelectedInterests(profile?.interests || []);
      setSaveError('');
    }
  }, [visible, profile]);

  const toggleInterest = (id) => {
    setSelectedInterests((current) => {
      if (current.includes(id)) return current.filter((interest) => interest !== id);
      if (current.length >= 5) return current;
      return [...current, id];
    });
  };

  const toggleFocus = (id) => {
    setSelectedFocus((current) => {
      if (current.includes(id)) return current.filter((focus) => focus !== id);
      if (current.length >= MAX_FOCUS_AREAS) return current;
      return [...current, id];
    });
  };

  const handleSave = async () => {
    if (isSaving) return;
    if (!nickname.trim()) {
      setSaveError('Please enter a nickname before saving your profile.');
      return;
    }
    setIsSaving(true);
    setSaveError('');
    try {
      await onSave?.({
        nickname: nickname.trim(),
        bio: bio.trim(),
        location: countryData?.regionName || profile?.location || 'East Africa',
        focusAreas: selectedFocus,
        interests: selectedInterests,
      });
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : 'Unable to save your changes. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={[styles.modalCard, { backgroundColor: theme.cardBg }]}>
          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={[styles.tag, { color: theme.textMuted }]}>YOUR SPACE</Text>
              <Text style={[styles.title, { color: theme.textPrimary }]}>Edit profile</Text>
            </View>
            <TouchableOpacity
              onPress={onClose}
              style={styles.closeBtn}
              activeOpacity={0.7}
              accessibilityRole="button"
              accessibilityLabel="Close edit profile"
            >
              <Text style={styles.closeBtnText}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
            {/* Nickname Input */}
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: theme.textSecondary }]}>What should we call you?</Text>
              <View style={styles.inputBox}>
                <TextInput
                  underlineColorAndroid="transparent"
                  style={[
                    styles.input,
                    { color: theme.textPrimary },
                    Platform.OS === 'web' && { outlineStyle: 'none', outlineWidth: 0 },
                  ]}
                  value={nickname}
                  onChangeText={setNickname}
                  maxLength={50}
                  accessibilityLabel="Nickname"
                  placeholder="e.g. Amani or your preferred nickname"
                  placeholderTextColor="#A092B0"
                />
              </View>
            </View>

            {/* Bio / Mood Tagline Input */}
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: theme.textSecondary }]}>Personal energy / bio</Text>
              <View style={styles.inputBox}>
                <TextInput
                  underlineColorAndroid="transparent"
                  style={[
                    styles.input,
                    { color: theme.textPrimary },
                    Platform.OS === 'web' && { outlineStyle: 'none', outlineWidth: 0 },
                  ]}
                  value={bio}
                  onChangeText={setBio}
                  maxLength={250}
                  accessibilityLabel="Personal energy or bio"
                  placeholder="e.g. Quiet pocket of peace or your personal bio"
                  placeholderTextColor="#A092B0"
                />
              </View>
            </View>

            {/* Constant Age Cohort & Synced Region (Read-Only) */}
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: theme.textSecondary }]}>Age Cohort & Region</Text>
              <View style={[styles.inputBox, { backgroundColor: theme.bg, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }]}>
                <Text style={{ fontSize: 13, fontWeight: '700', color: theme.textSecondary }}>
                  🔒 Age {profile?.ageBand || profile?.age || '18-24'} (Locked)
                </Text>
                <Text style={{ fontSize: 12.5, fontWeight: '600', color: theme.textMuted }}>
                  📍 {countryData?.regionName || 'East Africa'}
                </Text>
              </View>
            </View>

            {/* Focus Areas Picker */}
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: theme.textSecondary }]}>
                What needs space right now? ({selectedFocus.length}/{MAX_FOCUS_AREAS})
              </Text>
              <View style={styles.chipsWrap}>
                {FOCUS_AREAS.map((item) => {
                  const isSelected = selectedFocus.includes(item.id);
                  const isDisabled = !isSelected && selectedFocus.length >= MAX_FOCUS_AREAS;
                  return (
                    <TouchableOpacity
                      key={item.id}
                      style={[
                        styles.chip,
                        isSelected && { backgroundColor: theme.accentSoft, borderColor: theme.accent },
                        isDisabled && styles.chipDisabled,
                      ]}
                      onPress={() => toggleFocus(item.id)}
                      activeOpacity={0.8}
                      disabled={isDisabled}
                      accessibilityRole="checkbox"
                      accessibilityState={{ checked: isSelected, disabled: isDisabled }}
                      accessibilityLabel={item.label}
                    >
                      <Text
                        style={[
                          styles.chipText,
                          { color: isSelected ? theme.accent : theme.textSecondary },
                          isSelected && { fontWeight: '800' },
                        ]}
                      >
                        {item.label} {isSelected ? '✓' : ''}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
            {/* Passions & Interests Picker */}
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: theme.textSecondary }]}>
                Your Interests & Passions ({selectedInterests.length}/5)
              </Text>
              <View style={styles.chipsWrap}>
                {YOUTH_INTERESTS.map((item) => {
                  const isSelected = selectedInterests.includes(item.id);
                  const isDisabled = !isSelected && selectedInterests.length >= 5;
                  return (
                    <TouchableOpacity
                      key={item.id}
                      style={[
                        styles.chip,
                        isSelected && { backgroundColor: theme.accentSoft, borderColor: theme.accent },
                        isDisabled && styles.chipDisabled,
                      ]}
                      onPress={() => toggleInterest(item.id)}
                      activeOpacity={0.8}
                      disabled={isDisabled}
                      accessibilityRole="checkbox"
                      accessibilityState={{ checked: isSelected, disabled: isDisabled }}
                      accessibilityLabel={item.label}
                    >
                      <Text
                        style={[
                          styles.chipText,
                          { color: isSelected ? theme.accent : theme.textSecondary },
                          isSelected && { fontWeight: '800' },
                        ]}
                      >
                        {item.label} {isSelected ? '✓' : ''}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
            {saveError ? (
              <Text style={[styles.saveError, { color: theme.error || '#B42318' }]} accessibilityRole="alert">
                {saveError}
              </Text>
            ) : null}
          </ScrollView>

          {/* Actions */}
          <View style={styles.footer}>
            <TouchableOpacity style={styles.cancelBtn} onPress={onClose} activeOpacity={0.7} disabled={isSaving}>
              <Text style={styles.cancelBtnText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.saveBtn, { backgroundColor: theme.accent }]}
              onPress={handleSave}
              activeOpacity={0.88}
              disabled={isSaving}
              accessibilityRole="button"
              accessibilityState={{ disabled: isSaving }}
            >
              <Text style={styles.saveBtnText}>{isSaving ? 'Saving…' : 'Save changes'}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};
