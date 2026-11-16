// src/screens/journal/components/JournalEditor.jsx
// Main journal writing card matching the Figma design
// Includes draft indicator, prompt spark, title, reflection body, feeling chips, and save action

import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
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
  draftState = 'Unsaved draft',
}) => {
  return (
    <View style={styles.card}>
      {/* Top Date & Draft Status Pill */}
      <View style={styles.dateRow}>
        <Text style={styles.dateText}>{dateString.toUpperCase()}</Text>
        <View style={styles.draftPill}>
          <Text style={styles.draftText}>{draftState}</Text>
        </View>
      </View>

      {/* Gentle Spark Banner or Re-open Link */}
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

      {/* Title Input */}
      <TextInput
        style={styles.titleInput}
        placeholder="A small, softer moment"
        placeholderTextColor="#B0A0C0"
        value={title}
        onChangeText={onChangeTitle}
        returnKeyType="next"
      />

      {/* Body Reflection Input */}
      <TextInput
        style={styles.bodyInput}
        placeholder="Today I stepped outside for a few minutes. The air was cool, and for a moment, I didn't need to figure anything out..."
        placeholderTextColor="#B0A0C0"
        multiline
        textAlignVertical="top"
        value={body}
        onChangeText={onChangeBody}
      />

      {/* Helper Tagline */}
      <Text style={styles.helperNote}>
        Keep going, or leave it here. Both are enough.
      </Text>

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
          <Text style={styles.saveBtnText}>Save entry →</Text>
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
    gap: 12,
  },
  dateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  dateText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#8B6DA8',
    letterSpacing: 1,
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
  showSparkBtn: {
    alignSelf: 'flex-start',
    backgroundColor: '#FFF6EA',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 10,
    marginBottom: 8,
  },
  showSparkText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#8A531C',
  },
  titleInput: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.textPrimary,
    letterSpacing: -0.4,
    paddingVertical: 4,
  },
  bodyInput: {
    fontSize: 14.5,
    color: '#2E1E3B',
    lineHeight: 23,
    minHeight: 160,
    paddingVertical: 4,
  },
  helperNote: {
    fontSize: 11.5,
    fontStyle: 'italic',
    color: '#A092B0',
    marginTop: -4,
  },
  feelingSection: {
    paddingTop: 12,
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
    marginTop: 4,
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
