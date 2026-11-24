// src/screens/journal/components/JournalSparkBanner.jsx
// "A gentle spark" prompt banner matching the Figma design
// Allows cycling sparks, applying a prompt to the draft, or hiding the prompt

import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { styles } from '../styles/JournalSparkBanner.styles';

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
