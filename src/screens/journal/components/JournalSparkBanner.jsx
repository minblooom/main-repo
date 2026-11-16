// src/screens/journal/components/JournalSparkBanner.jsx
// "A gentle spark" prompt banner matching the Figma design
// Allows cycling sparks, applying a prompt to the draft, or hiding the prompt

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export const JournalSparkBanner = ({
  prompt,
  onUsePrompt,
  onNextPrompt,
  onHide,
  isVisible = true,
}) => {
  if (!isVisible) return null;

  return (
    <View style={styles.banner}>
      {/* Top Tag & Actions */}
      <View style={styles.topRow}>
        <Text style={styles.tagText}>A GENTLE SPARK · OPTIONAL</Text>
      </View>

      {/* Prompt Quote */}
      <Text style={styles.promptText}>"{prompt}"</Text>

      {/* Action Buttons Row */}
      <View style={styles.actionRow}>
        <TouchableOpacity
          style={styles.useBtn}
          onPress={() => onUsePrompt?.(prompt)}
          activeOpacity={0.8}
        >
          <Text style={styles.useBtnText}>Use prompt</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.iconBtn}
          onPress={onNextPrompt}
          activeOpacity={0.7}
        >
          <Text style={styles.actionLinkText}>Another spark ↻</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.iconBtn}
          onPress={onHide}
          activeOpacity={0.7}
        >
          <Text style={styles.hideLinkText}>Hide</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  banner: {
    backgroundColor: '#FFF6EA',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#FFE6C9',
    gap: 10,
    marginBottom: 16,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tagText: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#8A531C',
    letterSpacing: 0.8,
  },
  promptText: {
    fontSize: 14.5,
    fontWeight: '700',
    color: '#3B2312',
    lineHeight: 21,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingTop: 2,
  },
  useBtn: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#F3D2AE',
  },
  useBtnText: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#8A531C',
  },
  actionLinkText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#8A531C',
  },
  hideLinkText: {
    fontSize: 11.5,
    fontWeight: '600',
    color: '#A08060',
  },
  iconBtn: {
    paddingVertical: 4,
    paddingHorizontal: 4,
  },
});
