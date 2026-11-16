// src/screens/journal/components/JournalEditor.jsx
// Main journal writing card with clearly defined, welcoming input text boxes
// Includes "+ New entry" action, title container, expansive body canvas, mood chips, and save action

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import { colors } from '../../../theme/colors';
import { JournalSparkBanner } from './JournalSparkBanner';

const FEELING_OPTIONS = [
  { id: 'heavy', label: 'A little heavy', color: '#6E5D87', bg: '#F2EDFA', border: '#DFD5F0' },
  { id: 'between', label: 'Somewhere in between', color: '#8A531C', bg: '#FFF5E8', border: '#FFE6C9' },
  { id: 'lighter', label: 'A little lighter', color: '#2C5A38', bg: '#EDF5EE', border: '#D8ECDA' },
];

export const JournalEditor = ({
  dateString = 'MONDAY, 16 NOVEMBER',
  title = '',
  onChangeTitle,
  body = '',
  onChangeBody,
  selectedFeeling = 'lighter',
  onSelectFeeling,
  prompt = '',
  isPromptVisible = true,
  onUsePrompt,
  onNextPrompt,
  onHidePrompt,
  onShowPrompt,
  onSave,
  onNewEntry,
  draftState = 'Unsaved draft',
  isEditingExisting = false,
}) => {
  const [isTitleFocused, setIsTitleFocused] = useState(false);
  const [isBodyFocused, setIsBodyFocused] = useState(false);

  const wordCount = body.trim() ? body.trim().split(/\s+/).length : 0;

  return (
    <View style={styles.card}>
      {/* Top Header Row with Date, Draft Pill, and "+ New Entry" button */}
      <View style={styles.dateRow}>
        <View style={styles.dateLeft}>
          <Text style={styles.dateText}>{dateString.toUpperCase()}</Text>
          {isEditingExisting && (
            <View style={styles.editingBadge}>
              <Text style={styles.editingBadgeText}>Editing saved</Text>
            </View>
          )}
        </View>

        <View style={styles.dateActions}>
          <View style={styles.draftPill}>
            <Text style={styles.draftText}>{draftState}</Text>
          </View>

          {/* Clear & Start Fresh Button */}
          <TouchableOpacity
            style={styles.newEntryBtn}
            onPress={onNewEntry}
            activeOpacity={0.8}
          >
            <Text style={styles.newEntryBtnText}>+ New entry</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Gentle Spark Prompt Banner or Re-open Link */}
      {isPromptVisible ? (
        <JournalSparkBanner
          prompt={prompt}
          onUsePrompt={onUsePrompt}
          onNextPrompt={onNextPrompt}
          onHide={onHidePrompt}
          isVisible={true}
        />
      ) : (
        <TouchableOpacity
          style={styles.showSparkBtn}
          onPress={onShowPrompt}
          activeOpacity={0.7}
        >
          <Text style={styles.showSparkText}>✨ Show gentle spark</Text>
        </TouchableOpacity>
      )}

      {/* ── CLEARLY DEFINED TITLE INPUT BOX ───────────────────── */}
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>TITLE</Text>
        <View
          style={[
            styles.titleBoxWrap,
            isTitleFocused && styles.inputFocused,
          ]}
        >
          <TextInput
            style={styles.titleInput}
            placeholder="Give your moment a title (e.g. A small, softer moment)..."
            placeholderTextColor="#A89BB5"
            value={title}
            onChangeText={onChangeTitle}
            onFocus={() => setIsTitleFocused(true)}
            onBlur={() => setIsTitleFocused(false)}
            returnKeyType="next"
          />
        </View>
      </View>

      {/* ── CLEARLY DEFINED BODY WRITING TEXT BOX ─────────────── */}
      <View style={styles.inputGroup}>
        <View style={styles.bodyLabelRow}>
          <Text style={styles.inputLabel}>YOUR REFLECTION · WRITE FREELY</Text>
          <Text style={styles.wordCountText}>
            {wordCount > 0 ? `${wordCount} words` : 'Empty sheet · No rush'}
          </Text>
        </View>

        <View
          style={[
            styles.bodyBoxWrap,
            isBodyFocused && styles.inputFocused,
          ]}
        >
          <TextInput
            style={styles.bodyInput}
            placeholder="Click here to start writing... What is on your mind? What felt heavy or gentle today? Take all the space you need..."
            placeholderTextColor="#A89BB5"
            multiline
            textAlignVertical="top"
            value={body}
            onChangeText={onChangeBody}
            onFocus={() => setIsBodyFocused(true)}
            onBlur={() => setIsBodyFocused(false)}
          />

          <View style={styles.bodyFooterHintWrap}>
            <Text style={styles.helperNote}>
              Keep going, or leave it here. Both are enough.
            </Text>
          </View>
        </View>
      </View>

      {/* Mood Selector: How does this moment feel? */}
      <View style={styles.feelingSection}>
        <View style={styles.feelingHeader}>
          <Text style={styles.feelingTitle}>How does this moment feel?</Text>
          <Text style={styles.feelingOptional}>Optional</Text>
        </View>

        <View style={styles.feelingRow}>
          {FEELING_OPTIONS.map((opt) => {
            const isSelected = selectedFeeling === opt.id;
            return (
              <TouchableOpacity
                key={opt.id}
                style={[
                  styles.feelingChip,
                  isSelected && {
                    backgroundColor: opt.bg,
                    borderColor: opt.border,
                  },
                ]}
                onPress={() => onSelectFeeling?.(isSelected ? null : opt.id)}
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    styles.feelingLabel,
                    isSelected && { color: opt.color, fontWeight: '800' },
                  ]}
                >
                  {isSelected ? `✓ ${opt.label}` : opt.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Bottom Footer Actions */}
      <View style={styles.footerRow}>
        <Text style={styles.footerHint}>Only share what feels right.</Text>
        <TouchableOpacity
          style={styles.saveBtn}
          onPress={onSave}
          activeOpacity={0.88}
        >
          <Text style={styles.saveBtnText}>
            {isEditingExisting ? 'Update entry →' : 'Save entry →'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(73, 37, 66, 0.08)',
    shadowColor: '#492542',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
    gap: 14,
  },
  dateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
    flexWrap: 'wrap',
    gap: 8,
  },
  dateLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dateText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#8B6DA8',
    letterSpacing: 1,
  },
  editingBadge: {
    backgroundColor: '#FFF5E8',
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FFE6C9',
  },
  editingBadgeText: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#8A531C',
  },
  dateActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  draftPill: {
    backgroundColor: '#FAF5EE',
    paddingVertical: 3,
    paddingHorizontal: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(73, 37, 66, 0.08)',
  },
  draftText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#8B6DA8',
  },
  newEntryBtn: {
    backgroundColor: '#F0EAFA',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#DFD5F0',
  },
  newEntryBtnText: {
    fontSize: 10.5,
    fontWeight: '800',
    color: colors.brand,
  },
  showSparkBtn: {
    alignSelf: 'flex-start',
    backgroundColor: '#FFF6EA',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 10,
    marginBottom: 4,
  },
  showSparkText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#8A531C',
  },
  inputGroup: {
    gap: 6,
  },
  inputLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#8B6DA8',
    letterSpacing: 0.8,
  },
  bodyLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  wordCountText: {
    fontSize: 10.5,
    color: '#8B6DA8',
    fontStyle: 'italic',
  },

  // Title Box
  titleBoxWrap: {
    backgroundColor: '#FAF7F2',
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#EAE3F7',
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  titleInput: {
    fontSize: 17,
    fontWeight: '800',
    color: colors.textPrimary,
    paddingVertical: 2,
    borderWidth: 0,
    backgroundColor: 'transparent',
    ...(Platform.OS === 'web' ? { outlineStyle: 'none' } : {}),
  },

  // Body Box
  bodyBoxWrap: {
    backgroundColor: '#FAF7F2',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#EAE3F7',
    padding: 14,
    minHeight: 180,
    justifyContent: 'space-between',
  },
  bodyInput: {
    fontSize: 14.5,
    color: '#2E1E3B',
    lineHeight: 23,
    minHeight: 130,
    paddingVertical: 2,
    borderWidth: 0,
    backgroundColor: 'transparent',
    ...(Platform.OS === 'web' ? { outlineStyle: 'none' } : {}),
  },
  inputFocused: {
    borderColor: colors.brand,
    backgroundColor: '#FFFFFF',
    shadowColor: colors.brand,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  bodyFooterHintWrap: {
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(73, 37, 66, 0.04)',
  },
  helperNote: {
    fontSize: 11,
    fontStyle: 'italic',
    color: '#A092B0',
  },

  feelingSection: {
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(73, 37, 66, 0.06)',
    gap: 8,
  },
  feelingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  feelingTitle: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#38234A',
  },
  feelingOptional: {
    fontSize: 11,
    color: '#A092B0',
  },
  feelingRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  feelingChip: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 14,
    backgroundColor: '#FAF5EE',
    borderWidth: 1,
    borderColor: 'rgba(73, 37, 66, 0.08)',
  },
  feelingLabel: {
    fontSize: 11.5,
    fontWeight: '600',
    color: '#6E5D87',
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: 'rgba(73, 37, 66, 0.06)',
    marginTop: 2,
  },
  footerHint: {
    fontSize: 11.5,
    color: '#8B6DA8',
    fontStyle: 'italic',
  },
  saveBtn: {
    backgroundColor: colors.brand,
    borderRadius: 16,
    paddingVertical: 10,
    paddingHorizontal: 20,
    shadowColor: colors.brand,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 2,
  },
  saveBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
});
