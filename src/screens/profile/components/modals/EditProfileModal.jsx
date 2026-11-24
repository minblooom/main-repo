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
} from 'react-native';
import { useTheme } from '../../../../theme/ThemeContext';
import { useI18n } from '../../../../services/i18n';
import { styles } from '../../styles/EditProfileModal.styles';

const AVAILABLE_FOCUS = [
  { id: 'anxiety', label: 'Anxiety & Panic' },
  { id: 'burnout', label: 'Burnout & Rest' },
  { id: 'sleep', label: 'Sleep & Night Calm' },
  { id: 'low_mood', label: 'Low Mood & Tenderness' },
  { id: 'relationships', label: 'Relationships & Boundaries' },
  { id: 'identity', label: 'Identity & Belonging' },
];

const GENDER_OPTIONS = [
  { id: 'female', label: 'Female' },
  { id: 'male', label: 'Male' },
  { id: 'non_binary', label: 'Non-Binary' },
  { id: 'prefer_not', label: 'Prefer not to say' },
];

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
  const [location, setLocation] = useState(profile?.location || countryData?.regionName || 'East Africa');
  const [gender, setGender] = useState(profile?.gender || 'prefer_not');
  const [selectedFocus, setSelectedFocus] = useState(profile?.focusAreas || ['anxiety']);

  useEffect(() => {
    if (visible) {
      setNickname(profile?.nickname || '');
      setBio(profile?.bio || '');
      setLocation(profile?.location || countryData?.regionName || 'East Africa');
      setGender(profile?.gender || 'prefer_not');
      setSelectedFocus(profile?.focusAreas || ['anxiety']);
    }
  }, [visible, profile, countryData]);

  const toggleFocus = (id) => {
    if (selectedFocus.includes(id)) {
      if (selectedFocus.length > 1) {
        setSelectedFocus(selectedFocus.filter((f) => f !== id));
      }
    } else {
      if (selectedFocus.length < 3) {
        setSelectedFocus([...selectedFocus, id]);
      }
    }
  };

  const handleSave = () => {
    onSave?.({
      ...profile,
      nickname: nickname.trim(),
      bio: bio.trim(),
      location: location.trim() || countryData?.regionName || 'East Africa',
      gender,
      focusAreas: selectedFocus,
    });
    onClose();
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
            <TouchableOpacity onPress={onClose} style={styles.closeBtn} activeOpacity={0.7}>
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
                  style={[styles.input, { color: theme.textPrimary }]}
                  value={nickname}
                  onChangeText={setNickname}
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
                  style={[styles.input, { color: theme.textPrimary }]}
                  value={bio}
                  onChangeText={setBio}
                  placeholder="e.g. Quiet pocket of peace or your personal bio"
                  placeholderTextColor="#A092B0"
                />
              </View>
            </View>

            {/* Region / Neutral Location */}
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: theme.textSecondary }]}>Region</Text>
              <View style={styles.inputBox}>
                <TextInput
                  underlineColorAndroid="transparent"
                  style={[styles.input, { color: theme.textPrimary }]}
                  value={location}
                  onChangeText={setLocation}
                  placeholder={countryData?.regionName || 'East Africa'}
                  placeholderTextColor="#A092B0"
                />
              </View>
            </View>

            {/* Gender Selection */}
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: theme.textSecondary }]}>Gender Identity</Text>
              <View style={styles.chipsWrap}>
                {GENDER_OPTIONS.map((item) => {
                  const isSelected = gender === item.id;
                  return (
                    <TouchableOpacity
                      key={item.id}
                      style={[
                        styles.chip,
                        isSelected && { backgroundColor: theme.accentSoft, borderColor: theme.accent },
                      ]}
                      onPress={() => setGender(item.id)}
                      activeOpacity={0.8}
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

            {/* Focus Areas Picker */}
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: theme.textSecondary }]}>
                What needs space right now? ({selectedFocus.length}/3)
              </Text>
              <View style={styles.chipsWrap}>
                {AVAILABLE_FOCUS.map((item) => {
                  const isSelected = selectedFocus.includes(item.id);
                  return (
                    <TouchableOpacity
                      key={item.id}
                      style={[
                        styles.chip,
                        isSelected && { backgroundColor: theme.accentSoft, borderColor: theme.accent },
                      ]}
                      onPress={() => toggleFocus(item.id)}
                      activeOpacity={0.8}
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
          </ScrollView>

          {/* Actions */}
          <View style={styles.footer}>
            <TouchableOpacity style={styles.cancelBtn} onPress={onClose} activeOpacity={0.7}>
              <Text style={styles.cancelBtnText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.saveBtn, { backgroundColor: theme.accent }]}
              onPress={handleSave}
              activeOpacity={0.88}
            >
              <Text style={styles.saveBtnText}>Save changes</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};
