// src/screens/journal/components/JournalEntryModal.jsx
// Modal allowing the user to view any past journal entry in full

import React from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { colors } from '../../../theme/colors';

export const JournalEntryModal = ({
  visible,
  entry,
  onClose,
  onLoadIntoEditor,
}) => {
  if (!entry) return null;

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
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(46, 30, 59, 0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalCard: {
    width: '100%',
    maxWidth: 540,
    maxHeight: '80%',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(73, 37, 66, 0.1)',
    shadowColor: '#492542',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
    gap: 14,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  dateText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#8B6DA8',
    letterSpacing: 0.8,
  },
  titleText: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.textPrimary,
    marginTop: 2,
  },
  closeBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#FAF5EE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeBtnText: {
    fontSize: 12,
    color: '#8B6DA8',
    fontWeight: '700',
  },
  feelingTagWrap: {
    backgroundColor: '#F5FAF6',
    alignSelf: 'flex-start',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#D4EBD9',
  },
  feelingTagText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#285437',
  },
  bodyScroll: {
    maxHeight: 260,
    marginVertical: 4,
  },
  bodyText: {
    fontSize: 14.5,
    color: '#2E1E3B',
    lineHeight: 23,
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(73, 37, 66, 0.06)',
  },
  editBtn: {
    paddingVertical: 9,
    paddingHorizontal: 16,
    borderRadius: 14,
    backgroundColor: '#FAF5EE',
  },
  editBtnText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: colors.brand,
  },
  doneBtn: {
    paddingVertical: 9,
    paddingHorizontal: 18,
    borderRadius: 14,
    backgroundColor: colors.brand,
  },
  doneBtnText: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#FFFFFF',
  },
});
