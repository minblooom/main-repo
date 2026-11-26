// src/screens/journal/components/JournalEditor.jsx
// Main journal writing card with clearly defined, welcoming input text boxes
// Includes "+ New entry" action, title container, expansive body canvas, mood chips, and save action

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  
} from 'react-native';
import { styles } from '../styles/JournalEditor.styles';
import { JournalSparkBanner } from './JournalSparkBanner';
import { VoiceInputControls } from '../../../components/voice/VoiceInputControls';

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
  voiceNote = null,
  onChangeVoiceNote,
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

      {/* -- CLEARLY DEFINED TITLE INPUT BOX --------------------- */}
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>TITLE</Text>
        <View
          style={[
            styles.titleBoxWrap,
            isTitleFocused && styles.inputFocused,
          ]}
        >
          <TextInput
                    underlineColorAndroid="transparent"
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

      {/* -- CLEARLY DEFINED BODY WRITING TEXT BOX --------------- */}
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
                    underlineColorAndroid="transparent"
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

        <View style={{ marginTop: 10 }}>
          <VoiceInputControls
            voiceNote={voiceNote}
            onVoiceNoteChange={onChangeVoiceNote}
            maxSeconds={3600}
            onAppendTranscript={(chunk) =>
              onChangeBody?.(body ? `${body} ${chunk}` : chunk)
            }
          />
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

