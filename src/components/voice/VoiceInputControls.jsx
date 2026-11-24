// src/components/voice/VoiceInputControls.jsx
// Reusable Voice Note recorder + Web Speech-to-Text Dictation controls.
// Drops cleanly into Chat, Small Wins, Safe Vent, and Journal Editor.

import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import {
  MAX_VOICE_NOTE_SECONDS,
  formatVoiceDuration,
  startVoiceRecording,
  stopVoiceRecording,
  cancelVoiceRecording,
  isSpeechRecognitionSupported,
  createDictationSession,
} from '../../services/voiceNoteService';
import { VoiceNotePlayer } from './VoiceNotePlayer';

export const VoiceInputControls = ({
  voiceNote = null,
  onVoiceNoteChange,
  onAppendTranscript,
  compact = false,
}) => {
  const { theme } = useTheme();
  const [isRecording, setIsRecording] = useState(false);
  const [elapsedSec, setElapsedSec] = useState(0);
  const [isDictating, setIsDictating] = useState(false);

  const recordingRef = useRef(null);
  const timerRef = useRef(null);
  const dictationRef = useRef(null);

  const speechSupported = isSpeechRecognitionSupported();

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (recordingRef.current) cancelVoiceRecording(recordingRef.current);
      if (dictationRef.current) {
        try {
          dictationRef.current.stop();
        } catch {}
      }
    };
  }, []);

  const handleStartRecording = async () => {
    if (isDictating) handleStopDictation();
    try {
      const rec = await startVoiceRecording();
      recordingRef.current = rec;
      setElapsedSec(0);
      setIsRecording(true);

      timerRef.current = setInterval(() => {
        setElapsedSec((prev) => {
          const next = prev + 1;
          if (next >= MAX_VOICE_NOTE_SECONDS) {
            handleStopRecording();
          }
          return next;
        });
      }, 1000);
    } catch (err) {
      Alert.alert('Microphone Needed', err?.message || 'Unable to access microphone.');
    }
  };

  const handleStopRecording = async () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setIsRecording(false);
    try {
      const result = await stopVoiceRecording(recordingRef.current);
      recordingRef.current = null;
      if (result) {
        onVoiceNoteChange?.(result);
      }
    } catch {
      recordingRef.current = null;
    }
  };

  const handleCancelRecording = async () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setIsRecording(false);
    setElapsedSec(0);
    await cancelVoiceRecording(recordingRef.current);
    recordingRef.current = null;
  };

  const handleStartDictation = () => {
    if (!speechSupported) return;
    const session = createDictationSession({
      onTranscript: (text) => onAppendTranscript?.(text),
      onEnd: () => setIsDictating(false),
      onError: () => setIsDictating(false),
    });
    if (session) {
      dictationRef.current = session;
      setIsDictating(true);
      try {
        session.start();
      } catch {
        setIsDictating(false);
      }
    }
  };

  const handleStopDictation = () => {
    try {
      dictationRef.current?.stop();
    } catch {}
    dictationRef.current = null;
    setIsDictating(false);
  };

  return (
    <View style={styles.wrapper}>
      {/* Active Recording Banner */}
      {isRecording ? (
        <View style={[styles.recordingBar, { backgroundColor: '#FEF2F2', borderColor: '#FCA5A5' }]}>
          <View style={styles.recordingLeft}>
            <View style={styles.liveRedDot} />
            <Text style={styles.recordingLabel}>
              Recording {formatVoiceDuration(elapsedSec)} / {formatVoiceDuration(MAX_VOICE_NOTE_SECONDS)}
            </Text>
          </View>
          <View style={styles.recordingActions}>
            <TouchableOpacity onPress={handleCancelRecording} style={styles.cancelBtn} activeOpacity={0.7}>
              <Text style={styles.cancelBtnText}>✕ Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleStopRecording}
              style={[styles.doneBtn, { backgroundColor: '#DC2626' }]}
              activeOpacity={0.85}
            >
              <Text style={styles.doneBtnText}>✓ Save VN</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <View style={styles.buttonsRow}>
          <TouchableOpacity
            style={[
              styles.voiceBtn,
              compact && styles.voiceBtnCompact,
              { backgroundColor: theme.bg, borderColor: theme.divider },
            ]}
            onPress={handleStartRecording}
            activeOpacity={0.8}
          >
            <Text style={[styles.voiceBtnText, { color: theme.textSecondary }]}>
              🎙️ {voiceNote ? 'Re-record VN' : 'Voice Note'}
            </Text>
          </TouchableOpacity>

          {speechSupported && onAppendTranscript && (
            <TouchableOpacity
              style={[
                styles.voiceBtn,
                compact && styles.voiceBtnCompact,
                {
                  backgroundColor: isDictating ? 'rgba(217, 107, 67, 0.14)' : theme.bg,
                  borderColor: isDictating ? theme.accent : theme.divider,
                },
              ]}
              onPress={isDictating ? handleStopDictation : handleStartDictation}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.voiceBtnText,
                  { color: isDictating ? theme.accent : theme.textSecondary },
                ]}
              >
                {isDictating ? '⏹ Stop Dictating' : '🗣️ Dictate'}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      {/* Draft Voice Note Preview */}
      {voiceNote && !isRecording && (
        <View style={styles.previewWrap}>
          <VoiceNotePlayer
            voiceNote={voiceNote}
            compact
            onRemove={() => onVoiceNoteChange?.(null)}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    gap: 8,
  },
  buttonsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  voiceBtn: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 99,
    borderWidth: 1,
  },
  voiceBtnCompact: {
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  voiceBtnText: {
    fontSize: 12,
    fontWeight: '700',
  },
  recordingBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 14,
    borderWidth: 1,
    gap: 8,
  },
  recordingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  liveRedDot: {
    width: 9,
    height: 9,
    borderRadius: 4.5,
    backgroundColor: '#DC2626',
  },
  recordingLabel: {
    fontSize: 12,
    fontWeight: '800',
    color: '#991B1B',
  },
  recordingActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  cancelBtn: {
    paddingHorizontal: 8,
    paddingVertical: 5,
  },
  cancelBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#7F1D1D',
  },
  doneBtn: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 99,
  },
  doneBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  previewWrap: {
    marginTop: 2,
  },
});
