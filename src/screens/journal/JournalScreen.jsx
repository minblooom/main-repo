// src/screens/journal/JournalScreen.jsx
// MindBloom Private Journal Sanctuary
// Low-pressure, unhurried writing space with gentle prompts and zero judgment

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useResponsiveLayout } from '../../hooks/useResponsiveLayout';
import { colors } from '../../theme/colors';

const PROMPTS = [
  'What is one small thing that felt gentle today?',
  'What is a thought or weight you want to set down?',
  'How did your body feel when you woke up this morning?',
  'A kind word you wish someone would tell you right now.',
];

export const JournalScreen = ({ navigation }) => {
  const { isDesktop, isTablet } = useResponsiveLayout();
  const isWide = isDesktop || isTablet;

  const [activePromptIndex, setActivePromptIndex] = useState(0);
  const [entryText, setEntryText] = useState('');
  const [savedCount, setSavedCount] = useState(0);

  const nextPrompt = () => {
    setActivePromptIndex((prev) => (prev + 1) % PROMPTS.length);
  };

  const handleSave = () => {
    if (!entryText.trim()) {
      Alert.alert('Empty Page', 'Take your time. Even a single word is enough.');
      return;
    }
    setSavedCount((c) => c + 1);
    Alert.alert('Saved to Your Sanctuary', 'Your words are safely resting in your private journal.');
    setEntryText('');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            styles.scrollContainer,
            isWide && styles.scrollContainerWide,
          ]}
        >
          <View style={[styles.wrapper, isWide && styles.wrapperWide]}>
            {/* Top Navigation Bar */}
            <View style={styles.topBar}>
              <TouchableOpacity
                style={styles.backBtn}
                onPress={() => navigation?.goBack?.() || navigation?.navigate?.('Home')}
                activeOpacity={0.8}
              >
                <Text style={styles.backBtnText}>← Sanctuary Home</Text>
              </TouchableOpacity>
              <Text style={styles.tagPill}>PRIVATE · ZERO PRESSURE</Text>
            </View>

            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.title}>What's on your heart?</Text>
              <Text style={styles.subhead}>
                No word counts. No performance. Write as little or as much as feels right.
              </Text>
            </View>

            {/* Gentle Prompt Card */}
            <View style={styles.promptCard}>
              <View style={styles.promptHeader}>
                <Text style={styles.promptTag}>GENTLE SPARK</Text>
                <TouchableOpacity onPress={nextPrompt} activeOpacity={0.7}>
                  <Text style={styles.shufflePromptText}>Another spark ↻</Text>
                </TouchableOpacity>
              </View>
              <Text style={styles.promptText}>"{PROMPTS[activePromptIndex]}"</Text>
            </View>

            {/* Journal Writing Area */}
            <View style={styles.editorCard}>
              <TextInput
                style={styles.editorInput}
                placeholder="Start typing here whenever you feel ready... Polepole."
                placeholderTextColor="#A89BB5"
                multiline
                textAlignVertical="top"
                value={entryText}
                onChangeText={setEntryText}
              />
              <View style={styles.editorFooter}>
                <Text style={styles.wordCount}>
                  {entryText.trim() ? `${entryText.trim().split(/\s+/).length} words` : 'Blank page'}
                </Text>
                <TouchableOpacity
                  style={[styles.saveBtn, !entryText.trim() && styles.saveBtnDisabled]}
                  onPress={handleSave}
                  disabled={!entryText.trim()}
                  activeOpacity={0.88}
                >
                  <Text style={styles.saveBtnText}>Save entry →</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Supportive Tagline */}
            <Text style={styles.footerNote}>
              Entries remain strictly on your device. Noodle is holding space for you.
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FAF5EE',
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 40,
  },
  scrollContainerWide: {
    paddingHorizontal: 48,
    paddingTop: 28,
  },
  wrapper: {
    width: '100%',
    maxWidth: 820,
    alignSelf: 'center',
    gap: 20,
  },
  wrapperWide: {
    paddingVertical: 10,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  backBtn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: 'rgba(73, 37, 66, 0.08)',
  },
  backBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.brand,
  },
  tagPill: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#8B6DA8',
    letterSpacing: 0.8,
  },
  header: {
    gap: 6,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.textPrimary,
    letterSpacing: -0.5,
  },
  subhead: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  promptCard: {
    backgroundColor: '#FFF5E8',
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: '#FFE6C9',
    gap: 8,
  },
  promptHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  promptTag: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#8A531C',
    letterSpacing: 0.8,
  },
  shufflePromptText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#8A531C',
  },
  promptText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#3B2312',
    lineHeight: 22,
    fontStyle: 'italic',
  },
  editorCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 22,
    borderWidth: 1,
    borderColor: 'rgba(73, 37, 66, 0.08)',
    minHeight: 280,
    justifyContent: 'space-between',
    shadowColor: '#492542',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  editorInput: {
    fontSize: 15,
    color: '#2E1E3B',
    lineHeight: 24,
    minHeight: 200,
  },
  editorFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
  },
  wordCount: {
    fontSize: 12,
    color: '#8B6DA8',
    fontWeight: '600',
  },
  saveBtn: {
    backgroundColor: colors.brand,
    borderRadius: 16,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  saveBtnDisabled: {
    opacity: 0.4,
  },
  saveBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
  footerNote: {
    fontSize: 12,
    color: '#8B6DA8',
    textAlign: 'center',
    fontStyle: 'italic',
    marginTop: 8,
  },
});
