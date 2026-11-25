// src/services/voiceNoteService.js
// Cross-platform Voice Note recording (expo-av) and Web Speech-to-Text dictation.
// Converts Web blob URIs to persistent base64 data URIs so voice notes survive reloads in AsyncStorage.

import { Platform } from 'react-native';
import { Audio } from 'expo-av';

export const MAX_VOICE_NOTE_SECONDS = 3600; // 1 hour max (WhatsApp-style long voice notes)

const VOICE_RECORDING_OPTIONS = {
  ...Audio.RecordingOptionsPresets.HIGH_QUALITY,
  android: {
    ...Audio.RecordingOptionsPresets.HIGH_QUALITY.android,
    numberOfChannels: 1,
    bitRate: 32000,
  },
  ios: {
    ...Audio.RecordingOptionsPresets.HIGH_QUALITY.ios,
    numberOfChannels: 1,
    bitRate: 32000,
  },
  web: {
    mimeType: 'audio/webm',
    bitsPerSecond: 32000,
  },
};

export function formatVoiceDuration(seconds = 0) {
  const s = Math.max(0, Math.floor(seconds));
  const hrs = Math.floor(s / 3600);
  const mins = Math.floor((s % 3600) / 60);
  const secs = s % 60;
  if (hrs > 0) {
    return `${hrs}:${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
  }
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

/**
 * Convert a Web blob: URI to a persistent data:audio/...;base64,... URL
 * so it can be stored in AsyncStorage and played back after page reloads.
 */
async function uriToPersistentDataUri(uri) {
  if (!uri || Platform.OS !== 'web' || !uri.startsWith('blob:')) {
    return uri;
  }
  const response = await fetch(uri);
  const blob = await response.blob();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

let activeRecording = null;

export async function startVoiceRecording() {
  if (activeRecording) {
    try {
      await activeRecording.stopAndUnloadAsync();
    } catch {}
    activeRecording = null;
  }

  const permission = await Audio.requestPermissionsAsync();
  if (!permission.granted) {
    throw new Error('Microphone permission is needed to record a voice note.');
  }

  await Audio.setAudioModeAsync({
    allowsRecordingIOS: true,
    playsInSilentModeIOS: true,
  });

  const { recording } = await Audio.Recording.createAsync(
    VOICE_RECORDING_OPTIONS
  );
  activeRecording = recording;
  return recording;
}

export async function stopVoiceRecording(recording = activeRecording, maxSeconds = MAX_VOICE_NOTE_SECONDS) {
  const target = recording || activeRecording;
  if (!target) return null;

  try {
    const status = await target.getStatusAsync();
    const durationSec = Math.max(1, Math.round((status?.durationMillis || 1000) / 1000));
    await target.stopAndUnloadAsync();
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      playsInSilentModeIOS: true,
    });
    const rawUri = target.getURI();
    const persistentUri = await uriToPersistentDataUri(rawUri);
    activeRecording = null;
    return {
      uri: persistentUri,
      durationSec: Math.min(maxSeconds, durationSec),
      createdAt: new Date().toISOString(),
    };
  } catch (err) {
    activeRecording = null;
    throw err;
  }
}

export async function cancelVoiceRecording(recording = activeRecording) {
  const target = recording || activeRecording;
  if (!target) return;
  try {
    await target.stopAndUnloadAsync();
    await Audio.setAudioModeAsync({ allowsRecordingIOS: false });
  } catch {}
  activeRecording = null;
}

// ── Web Speech-to-Text Dictation (Chrome / Edge / Safari) ─────────────────
export function isSpeechRecognitionSupported() {
  if (Platform.OS !== 'web' || typeof window === 'undefined') return false;
  return Boolean(window.SpeechRecognition || window.webkitSpeechRecognition);
}

export function createDictationSession({ onTranscript, onEnd, onError }) {
  if (!isSpeechRecognitionSupported()) return null;

  const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = new SpeechRec();
  recognition.continuous = true;
  recognition.interimResults = false;
  recognition.lang = 'en-US';

  recognition.onresult = (event) => {
    let finalChunk = '';
    for (let i = event.resultIndex; i < event.results.length; i += 1) {
      if (event.results[i].isFinal) {
        finalChunk += event.results[i][0].transcript;
      }
    }
    if (finalChunk.trim()) {
      onTranscript?.(finalChunk.trim());
    }
  };

  recognition.onerror = (event) => {
    onError?.(event?.error || 'dictation_error');
  };

  recognition.onend = () => {
    onEnd?.();
  };

  return {
    start: () => recognition.start(),
    stop: () => recognition.stop(),
  };
}
