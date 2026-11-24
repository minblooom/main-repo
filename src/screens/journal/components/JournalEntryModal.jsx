// src/screens/journal/components/JournalEntryModal.jsx
// Modal allowing the user to view any past journal entry in full

import React from 'react';
import {
  View,
  Text,
  Modal,
  Alert,
  Platform,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { styles } from '../styles/JournalEntryModal.styles';
import { VoiceNotePlayer } from '../../../components/voice/VoiceNotePlayer';

export const JournalEntryModal = ({
  visible,
  entry,
  onClose,
  onLoadIntoEditor,
  onDeleteEntry,
}) => {
  if (!entry) return null;

  const handleDelete = () => {
    if (Platform.OS === 'web') {
      if (window.confirm(`Ready to let go of "${entry.title || 'this reflection'}"? Once released, it won't come back.`)) {
        onDeleteEntry?.(entry.id);
        onClose();
      }
      return;
    }

    Alert.alert(
      'Let Go of This Moment',
      `Ready to let go of "${entry.title || 'this reflection'}"? Once released, it won't come back.`,
      [
        { text: 'Keep entry', style: 'cancel' },
        {
          text: 'Let go',
          style: 'destructive',
          onPress: () => {
            onDeleteEntry?.(entry.id);
            onClose();
          },
        },
      ]
    );
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalCard}>
          {/* Header */}
          <View style={styles.modalHeader}>
            <View>
              <Text style={styles.dateText}>
                {entry.dateString || 'SAVED MOMENT'}
              </Text>
              <Text style={styles.titleText}>{entry.title || 'Untitled moment'}</Text>
            </View>
            <TouchableOpacity
              style={styles.closeBtn}
              onPress={onClose}
              activeOpacity={0.7}
            >
              <Text style={styles.closeBtnText}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* Feeling Tag */}
          {entry.feelingLabel && (
            <View style={styles.feelingTagWrap}>
              <Text style={styles.feelingTagText}>
                Felt: {entry.feelingLabel}
              </Text>
            </View>
          )}

          {/* Body Content */}
          <ScrollView style={styles.bodyScroll} showsVerticalScrollIndicator={false}>
            {entry.voiceNote && (
              <View style={{ marginBottom: 14 }}>
                <VoiceNotePlayer voiceNote={entry.voiceNote} />
              </View>
            )}
            {!!entry.body && <Text style={styles.bodyText}>{entry.body}</Text>}
          </ScrollView>

          {/* Modal Footer Actions */}
          <View style={styles.modalFooter}>
            {onDeleteEntry && (
              <TouchableOpacity
                style={styles.deleteBtn}
                onPress={handleDelete}
                activeOpacity={0.7}
              >
                <Text style={styles.deleteBtnText}>Delete</Text>
              </TouchableOpacity>
            )}
            <View style={styles.rightActions}>
              {onLoadIntoEditor && (
                <TouchableOpacity
                  style={styles.editBtn}
                  onPress={() => {
                    onLoadIntoEditor(entry);
                    onClose();
                  }}
                  activeOpacity={0.8}
                >
                  <Text style={styles.editBtnText}>Edit in journal</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity
                style={styles.doneBtn}
                onPress={onClose}
                activeOpacity={0.88}
              >
                <Text style={styles.doneBtnText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

