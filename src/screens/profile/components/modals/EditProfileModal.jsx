// src/screens/profile/components/modals/EditProfileModal.jsx
// Modal allowing the user to update their nickname, personal bio, and primary wellness focus areas.

import React, { useState } from 'react';
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

const AVAILABLE_FOCUS = [
  { id: 'anxiety', label: 'Anxiety & Panic' },
  { id: 'burnout', label: 'Burnout & Rest' },
  { id: 'sleep', label: 'Sleep & Night Calm' },
  { id: 'low_mood', label: 'Low Mood & Tenderness' },
  { id: 'relationships', label: 'Relationships & Boundaries' },
  { id: 'identity', label: 'Identity & Belonging' },
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
  const [nickname, setNickname] = useState(profile?.nickname || 'soso');
  const [bio, setBio] = useState(profile?.bio || 'Growing & Fierce');
  const [location, setLocation] = useState(profile?.location || 'Kenya · East Africa');
  const [selectedFocus, setSelectedFocus] = useState(profile?.focusAreas || ['anxiety']);

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
      nickname: nickname.trim() || 'soso',
      bio: bio.trim() || 'Growing & Fierce',
      location: location.trim() || 'Kenya · East Africa',
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
                  style={[styles.input, { color: theme.textPrimary }]}
                  value={nickname}
                  onChangeText={setNickname}
                  placeholder="e.g. soso or Amani"
                  placeholderTextColor="#A092B0"
                />
              </View>
            </View>

            {/* Bio / Mood Tagline Input */}
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: theme.textSecondary }]}>Personal energy / bio</Text>
              <View style={styles.inputBox}>
                <TextInput
                  style={[styles.input, { color: theme.textPrimary }]}
                  value={bio}
                  onChangeText={setBio}
                  placeholder="e.g. Growing & Fierce"
                  placeholderTextColor="#A092B0"
                />
              </View>
            </View>

            {/* Region / Neutral Location (Strictly zero county names) */}
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: theme.textSecondary }]}>Region</Text>
              <View style={styles.inputBox}>
                <TextInput
                  style={[styles.input, { color: theme.textPrimary }]}
                  value={location}
                  onChangeText={setLocation}
                  placeholder="Kenya · East Africa"
                  placeholderTextColor="#A092B0"
                />
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

import { styles } from '../../styles/EditProfileModal.styles';
