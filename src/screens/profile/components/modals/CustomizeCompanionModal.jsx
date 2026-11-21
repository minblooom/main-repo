// src/screens/profile/components/modals/CustomizeCompanionModal.jsx
// Interactive companion selector: switch between Noodle, Kovu, Kiko, and Taz with live preview and Swahili traits.

import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { COMPANIONS } from '../../../../constants/companions';
import { AnimatedCompanion } from '../../../../components/companion/AnimatedCompanion';
import { useTheme } from '../../../../theme/ThemeContext';

export const CustomizeCompanionModal = ({
  visible,
  currentCompanionId = 'noodle',
  onClose,
  onSelectCompanion,
  theme: propTheme,
}) => {
  const { theme: ctxTheme } = useTheme();
  const theme = propTheme || ctxTheme;
  const [selectedId, setSelectedId] = useState(currentCompanionId);

  const handleSave = () => {
    onSelectCompanion?.(selectedId);
    const chosen = COMPANIONS.find((c) => c.id === selectedId);
    Alert.alert(
      'Companion Updated',
      `${chosen?.name || 'Your companion'} is walking beside you in your sanctuary.`
    );
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={[styles.modalCard, { backgroundColor: theme.cardBg }]}>
          <View style={styles.header}>
            <View>
              <Text style={[styles.tag, { color: theme.textMuted }]}>BESIDE YOU</Text>
              <Text style={[styles.title, { color: theme.textPrimary }]}>Choose your companion</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn} activeOpacity={0.7}>
              <Text style={styles.closeBtnText}>✕</Text>
            </TouchableOpacity>
          </View>

          <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
            Pick the presence that fits your current season. There is no wrong choice.
          </Text>

          {/* Live Animated Mascot Preview */}
          <View style={[styles.previewArea, { backgroundColor: theme.heroBg, borderColor: theme.heroBorder }]}>
            <AnimatedCompanion companionId={selectedId} size={110} state="happy" interactive={true} />
            <Text style={[styles.previewName, { color: theme.textPrimary }]}>
              {COMPANIONS.find((c) => c.id === selectedId)?.name}
            </Text>
            <Text style={[styles.previewTrait, { color: theme.textSecondary }]}>
              {COMPANIONS.find((c) => c.id === selectedId)?.trait} · {COMPANIONS.find((c) => c.id === selectedId)?.swTrait}
            </Text>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
            <View style={styles.grid}>
              {COMPANIONS.map((c) => {
                const isSelected = selectedId === c.id;
                return (
                  <TouchableOpacity
                    key={c.id}
                    style={[
                      styles.choiceCard,
                      isSelected && { borderColor: theme.accent, backgroundColor: theme.accentSoft },
                    ]}
                    onPress={() => setSelectedId(c.id)}
                    activeOpacity={0.8}
                  >
                    <View style={styles.cardHeader}>
                      <Text style={[styles.cardName, { color: isSelected ? theme.accent : theme.textPrimary }]}>
                        {c.name}
                      </Text>
                      {isSelected && <Text style={[styles.checkText, { color: theme.accent }]}>✓</Text>}
                    </View>
                    <Text style={styles.cardSpecies}>{c.species}</Text>
                    <Text style={styles.cardTrait}>{c.trait}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </ScrollView>

          {/* Action Buttons */}
          <View style={styles.footer}>
            <TouchableOpacity style={styles.cancelBtn} onPress={onClose} activeOpacity={0.7}>
              <Text style={styles.cancelBtnText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.saveBtn, { backgroundColor: theme.accent }]}
              onPress={handleSave}
              activeOpacity={0.88}
            >
              <Text style={styles.saveBtnText}>Keep beside me</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

import { styles } from '../../styles/CustomizeCompanionModal.styles';
