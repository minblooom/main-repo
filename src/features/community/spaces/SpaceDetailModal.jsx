// src/features/community/components/SpaceDetailModal.jsx
import React from 'react';
import { Modal, View, Text, Pressable, ScrollView } from 'react-native';
import { useTheme } from '../../../theme/ThemeContext';
import { styles } from './styles/CommunitySheet.styles';

export const SpaceDetailModal = ({ visible, title, onClose, children }) => {
  const { theme } = useTheme();

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={[styles.card, { backgroundColor: theme.bg, borderColor: theme.divider }]}>
          <View style={styles.header}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.kicker, { color: theme.textMuted }]}>SPACE</Text>
              <Text style={[styles.title, { color: theme.textPrimary }]} numberOfLines={1}>
                {title}
              </Text>
            </View>
            <Pressable accessibilityRole="button" accessibilityLabel="Close space" onPress={onClose} style={styles.closeBtn}>
              <Text style={[styles.closeText, { color: theme.textSecondary }]}>✕</Text>
            </Pressable>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.sheetBody}>
            {children}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};