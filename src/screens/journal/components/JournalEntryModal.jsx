// src/screens/journal/components/JournalEntryModal.jsx
// Modal allowing the user to view any past journal entry in full

import React from 'react';
import {
  View,
  Text,
  Modal,
  Alert,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { styles } from '../styles/JournalEntryModal.styles';

export const JournalEntryModal = ({
  visible,
  entry,
  onClose,
  onLoadIntoEditor,
  onDeleteEntry,
}) => {
  if (!entry) return null;

  const handleDelete = () => {
    Alert.alert(
      'Delete Moment',
      `Are you sure you want to delete "${entry.title || 'this reflection'}"? This cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
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
            <Text style={styles.bodyText}>{entry.body}</Text>
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

