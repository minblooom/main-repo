// src/components/voice/VoiceInputControls.jsx
// Reusable Voice Note recorder + Web Speech-to-Text Dictation controls.
// Drops cleanly into Chat, Small Wins, Safe Vent, and Journal Editor.

import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { styles } from './styles/VoiceInputControls.styles';
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
  maxSeconds = MAX_VOICE_NOTE_SECONDS,
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
          if (next >= maxSeconds) {
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
      const result = await stopVoiceRecording(recordingRef.current, maxSeconds);
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
              Recording {formatVoiceDuration(elapsedSec)}
              {elapsedSec >= maxSeconds - 60
                ? ` / ${formatVoiceDuration(maxSeconds)}`
                : ''}
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
