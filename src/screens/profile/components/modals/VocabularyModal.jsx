// src/screens/profile/components/modals/VocabularyModal.jsx
// Swahili and mindful wellness vocabulary the user has learned and adopted.

import React from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useTheme } from '../../../../theme/ThemeContext';

const VOCABULARY = [
  {
    word: 'Polepole',
    pronounce: '/poh-leh-poh-leh/',
    meaning: 'Slowly, gently, unhurried.',
    usage: 'A reminder that your growth does not have to be a sprint.',
    tag: 'SWAHILI WISDOM',
  },
  {
    word: 'Tulia',
    pronounce: '/too-lee-ah/',
    meaning: 'Be still, settle in, calm your spirit.',
    usage: 'The 2-minute breathwork practice when the world feels loud.',
    tag: 'NERVOUS SYSTEM',
  },
  {
    word: 'Baraza',
    pronounce: '/bah-rah-zah/',
    meaning: 'A gathering circle, a meeting place for mutual support.',
    usage: 'The peer community where youth share encouragement without judgment.',
    tag: 'COMMUNITY',
  },
  {
    word: 'Amani',
    pronounce: '/ah-mah-nee/',
    meaning: 'Peace, tranquility of the mind.',
    usage: 'The inner calm you cultivate one small breath at a time.',
    tag: 'SANCTUARY',
  },
];

export const VocabularyModal = ({ visible, onClose, theme: propTheme }) => {
  const { theme: ctxTheme } = useTheme();
  const theme = propTheme || ctxTheme;
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={[styles.modalCard, { backgroundColor: theme.cardBg }]}>
          <View style={styles.header}>
            <View>
              <Text style={[styles.tag, { color: theme.textMuted }]}>ROOM TO GROW</Text>
              <Text style={[styles.title, { color: theme.textPrimary }]}>Learned Vocabulary</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn} activeOpacity={0.7}>
              <Text style={styles.closeBtnText}>✕</Text>
            </TouchableOpacity>
          </View>

          <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
            Words you've made your own. Rooted in East African calm and mindful self-compassion.
          </Text>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
            {VOCABULARY.map((v, i) => (
              <View key={i} style={styles.wordCard}>
                <View style={styles.wordHeader}>
                  <Text style={styles.wordTitle}>{v.word}</Text>
                  <Text style={styles.wordTag}>{v.tag}</Text>
                </View>
                <Text style={styles.wordPronounce}>{v.pronounce}</Text>
                <Text style={styles.wordMeaning}>{v.meaning}</Text>
                <Text style={styles.wordUsage}>"{v.usage}"</Text>
              </View>
            ))}
          </ScrollView>

          <TouchableOpacity
            style={[styles.doneBtn, { backgroundColor: theme.accent }]}
            onPress={onClose}
            activeOpacity={0.88}
          >
            <Text style={styles.doneBtnText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

import { styles } from '../../styles/VocabularyModal.styles';
