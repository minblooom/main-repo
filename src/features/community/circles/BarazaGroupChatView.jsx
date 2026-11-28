// src/features/community/circles/BarazaGroupChatView.jsx
// Authentic real-time group chat for MindBloom Baraza Circles
// Pure real user communication with AsyncStorage persistence, zero fake bots, and zero dummy seeds.

// src/features/community/circles/BarazaGroupChatView.jsx
// Authentic real-time group chat for MindBloom Baraza Circles
// Pure real user communication with AsyncStorage persistence, zero fake bots, and zero dummy seeds.

import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Modal,
  Alert,
  Dimensions,
} from 'react-native';
import { styles } from './styles/BarazaGroupChatView.styles';
import { Mic, MoreHorizontal, Send, Sparkles } from 'lucide-react-native';
import { initialMemes, initialStories, GUIDED_MEDITATIONS } from '../../../screens/chill-space/chillData';
import { formatChillShareText } from '../../../components/modals/ShareToCircleModal';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiClient, AUTH_STORAGE_KEYS } from '../../../core/api/client';
import { AuthService } from '../../../core/api/authService';
import { analyzeTextSafety } from '../../../core/safety/safetyFilter';
import { useTheme } from '../../../theme/ThemeContext';
import { useI18n } from '../../../services/i18n';
import { soundService } from '../../../screens/arcade/audio/soundService';
import { onboardingStorage } from '../../../services/onboardingStorage';
import { useCommunityStore } from '../store/communityStore';
import { canAccessCircle } from '../services/circleMatchingService';
import { VoiceNotePlayer } from '../../../components/voice/VoiceNotePlayer';
import {
  MAX_VOICE_NOTE_SECONDS,
  formatVoiceDuration,
  startVoiceRecording,
  stopVoiceRecording,
  cancelVoiceRecording,
  isSpeechRecognitionSupported,
  createDictationSession,
} from '../../../services/voiceNoteService';

function formatTimestamp(date = new Date()) {
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const formattedHours = hours % 12 || 12;
  const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
  return `${formattedHours}:${formattedMinutes} ${ampm}`;
}

export const BarazaGroupChatView = ({ circle, userAgeBand, initialDraft = '', onBack }) => {
  const { theme } = useTheme();
  const { countryData } = useI18n();
  const circleId = circle?.id || 'campus_grounding';
  const storageKey = `mindbloom:baraza:chat:${circleId}:v2`;

  if (userAgeBand && !canAccessCircle(userAgeBand, circle)) {
    return (
      <View style={[styles.chatRoot, { backgroundColor: theme.bg, justifyContent: 'center', alignItems: 'center', padding: 24 }]}>
        <View style={[styles.emptyChatCard, { backgroundColor: theme.cardBg, borderColor: theme.divider, maxWidth: 420 }]}>
          <Text style={styles.emptyChatEmoji}>🔒</Text>
          <Text style={[styles.emptyChatTitle, { color: theme.textPrimary }]}>
            Cohort-Protected Space
          </Text>
          <Text style={[styles.emptyChatSubtitle, { color: theme.textSecondary }]}>
            To keep 13–17 teen spaces and 18+ spaces safe and peer-only, circles are strictly locked to your age group ({userAgeBand}).
          </Text>
          <TouchableOpacity
            onPress={onBack}
            style={[styles.safeTag, { backgroundColor: theme.accentSoft, paddingHorizontal: 16, paddingVertical: 10, marginTop: 8 }]}
            activeOpacity={0.8}
          >
            <Text style={[styles.safeTagText, { color: theme.accent }]}>‹ Back to Baraza</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const {
    joinedCircleIds,
    joinCircle,
    leaveCircle,
    reportedMessageIds,
    reportMessage,
  } = useCommunityStore();
  const isJoined = joinedCircleIds.includes(circleId);

  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState(initialDraft || '');
  const [draftVoiceNote, setDraftVoiceNote] = useState(null);

  useEffect(() => {
    if (initialDraft) {
      setInputText(initialDraft);
    }
  }, [initialDraft]);
  const [replyingTo, setReplyingTo] = useState(null);
  const [editingMsgId, setEditingMsgId] = useState(null);
  const [showScrollBottom, setShowScrollBottom] = useState(false);
  const [userName, setUserName] = useState('You');
  const [showGuidelines, setShowGuidelines] = useState(false);
  const [showCircleInfo, setShowCircleInfo] = useState(false);
  const [showHelplineNudge, setShowHelplineNudge] = useState(false);
  const [activeMsgMenu, setActiveMsgMenu] = useState(null);
  const [activeMsgAnchor, setActiveMsgAnchor] = useState(null);
  const [showChillAttach, setShowChillAttach] = useState(false);
  const [chillAttachTab, setChillAttachTab] = useState('memes'); // 'memes' | 'stories' | 'podcasts'
  const [isRecording, setIsRecording] = useState(false);

  const openMsgMenu = (msg, evt) => {
    const pageX = evt?.nativeEvent?.pageX;
    const pageY = evt?.nativeEvent?.pageY;
    if (typeof pageX === 'number' && typeof pageY === 'number') {
      setActiveMsgAnchor({ x: pageX, y: pageY });
    } else {
      setActiveMsgAnchor(null);
    }
    setActiveMsgMenu(msg);
  };
  const [elapsedSec, setElapsedSec] = useState(0);
  const [isDictating, setIsDictating] = useState(false);

  const recordingRef = useRef(null);
  const timerRef = useRef(null);
  const dictationRef = useRef(null);
  const scrollRef = useRef(null);
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
          if (next >= MAX_VOICE_NOTE_SECONDS) handleStopRecording();
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
      if (result) setDraftVoiceNote(result);
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
      onTranscript: (chunk) => setInputText((prev) => (prev ? `${prev} ${chunk}` : chunk)),
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

  // Load chat history & user profile, subscribe to live SSE stream (web), with polling fallback
  useEffect(() => {
    let active = true;
    let eventSource = null;

    const mapServerMsg = (m, currentUserId = null) => {
      const dt = m.createdAt ? new Date(m.createdAt) : new Date();
      const isMe =
        typeof m.isMe === 'boolean' && m.userId === undefined
          ? m.isMe
          : Boolean(currentUserId && m.userId === currentUserId);
      return {
        id: m.id,
        sender: isMe ? 'You' : m.sender || 'Peer',
        emoji: m.emoji || '🌱',
        text: m.text || '',
        voiceNote: m.voiceNote || null,
        replyTo: m.replyTo || null,
        dateLabel: dt.toLocaleDateString('en-US', { day: 'numeric', month: 'short' }),
        time: formatTimestamp(dt),
        isMe,
        edited: Boolean(m.edited),
        reactions: m.reactions || { hugs: 0, hearts: 0, pray: 0, green: 0 },
      };
    };

    async function syncFromServer() {
      try {
        const res = await apiClient.get(`/community/circles/${circleId}/messages?page=1&per_page=30`);
        const serverItems = res?.data?.data?.items;
        if (active && Array.isArray(serverItems) && serverItems.length > 0) {
          const formatted = serverItems.map((m) => mapServerMsg(m));
          setMessages(formatted);
        }
      } catch {
        // Offline or guest mode — keep ephemeral in-memory messages only (never stored)
      }
    }

    async function connectLiveStream() {
      if (Platform.OS !== 'web' || typeof EventSource === 'undefined') return;
      try {
        const [token, storedUser] = await Promise.all([
          AsyncStorage.getItem(AUTH_STORAGE_KEYS.ACCESS_TOKEN),
          AuthService.getStoredUser(),
        ]);
        if (!active || !token) return;

        const base = (apiClient.defaults.baseURL || '').replace(/\/+$/, '');
        const url = `${base}/community/circles/${encodeURIComponent(circleId)}/stream?token=${encodeURIComponent(token)}`;
        eventSource = new EventSource(url);

        eventSource.addEventListener('message:created', (evt) => {
          try {
            const payload = JSON.parse(evt.data);
            const incoming = mapServerMsg(payload, storedUser?.id);
            setMessages((curr) => {
              if (curr.some((m) => m.id === incoming.id)) return curr;
              return [...curr, incoming];
            });
          } catch {}
        });

        eventSource.addEventListener('message:updated', (evt) => {
          try {
            const payload = JSON.parse(evt.data);
            setMessages((curr) =>
              curr.map((m) => (m.id === payload.id ? { ...m, text: payload.text, edited: true } : m))
            );
          } catch {}
        });

        eventSource.addEventListener('message:deleted', (evt) => {
          try {
            const payload = JSON.parse(evt.data);
            setMessages((curr) => curr.filter((m) => m.id !== payload.id));
          } catch {}
        });

        eventSource.addEventListener('message:reacted', (evt) => {
          try {
            const payload = JSON.parse(evt.data);
            setMessages((curr) =>
              curr.map((m) => (m.id === payload.id ? { ...m, reactions: payload.reactions } : m))
            );
          } catch {}
        });
      } catch {}
    }

    async function loadChat() {
      try {
        const prefs = await onboardingStorage.getPreferences();
        if (active && (prefs?.name || prefs?.nickname)) {
          setUserName(prefs.name || prefs.nickname);
        }
      } catch {}
      if (active) setMessages([]);
      await syncFromServer();
      await connectLiveStream();
    }

    loadChat();
    const pollMs = Platform.OS === 'web' && typeof EventSource !== 'undefined' ? 15000 : 4000;
    const pollId = setInterval(syncFromServer, pollMs);
    return () => {
      active = false;
      clearInterval(pollId);
      if (eventSource) {
        try {
          eventSource.close();
        } catch {}
      }
    };
  }, [circleId]);

  const handleSendMessage = async () => {
    const text = inputText.trim();
    if (!text && !draftVoiceNote) return;

    // Flag dangerous/crisis terms immediately and gently nudge toward helplines
    const safety = analyzeTextSafety(text);
    if (safety.isCritical) {
      setShowHelplineNudge(true);
      return;
    }

    soundService.playPop();
    if (!isJoined) {
      joinCircle(circleId);
    }

    if (editingMsgId) {
      const targetId = editingMsgId;
      const nextMessages = messages.map((m) =>
        m.id === targetId ? { ...m, text, edited: true } : m
      );
      setMessages(nextMessages);
      setEditingMsgId(null);
      setInputText('');
      try {
        if (!String(targetId).startsWith('msg-')) {
          await apiClient.patch(`/community/circles/${circleId}/messages/${targetId}`, { text });
        }
      } catch {}
      return;
    }

    const tempId = `msg-${Date.now()}`;
    const newMsg = {
      id: tempId,
      sender: userName,
      emoji: '🌱',
      text,
      voiceNote: draftVoiceNote,
      replyTo: replyingTo
        ? {
            id: replyingTo.id,
            sender: replyingTo.sender,
            snippet: replyingTo.text || (replyingTo.voiceNote ? '🎙️ Voice note' : ''),
          }
        : null,
      dateLabel: new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short' }),
      time: formatTimestamp(),
      isMe: true,
      reactions: { hugs: 0, hearts: 0, pray: 0, green: 0 },
    };

    const nextMessages = [...messages, newMsg];
    setMessages(nextMessages);
    setInputText('');
    setDraftVoiceNote(null);
    setReplyingTo(null);

    try {
      const res = await apiClient.post(`/community/circles/${circleId}/messages`, {
        text,
        senderEmoji: '🌱',
        voiceNote: newMsg.voiceNote,
        replyTo: newMsg.replyTo,
      });
      const saved = res?.data?.data;
      if (saved?.id) {
        setMessages((curr) =>
          curr.map((m) =>
            m.id === tempId ? { ...m, id: saved.id, voiceNote: saved.voiceNote ?? m.voiceNote } : m
          )
        );
      }
    } catch (err) {
      const status = err?.response?.status;
      const serverMsg = err?.response?.data?.message;
      if (status === 422 || status === 429) {
        setMessages((curr) => curr.filter((m) => m.id !== tempId));
        if (Platform.OS === 'web') {
          window.alert(serverMsg || 'Unable to post this message right now.');
        } else {
          Alert.alert('Sanctuary Safety', serverMsg || 'Unable to post this message right now.');
        }
      }
    }

    setTimeout(() => {
      scrollRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const handleDeleteMessage = (msgId) => {
    const doDelete = async () => {
      const next = messages.filter((m) => m.id !== msgId);
      setMessages(next);
      try {
        if (!String(msgId).startsWith('msg-')) {
          await apiClient.delete(`/community/circles/${circleId}/messages/${msgId}`);
        }
      } catch {}
    };
    if (Platform.OS === 'web') {
      if (window.confirm('Delete this message?')) {
        doDelete();
      }
      return;
    }
    Alert.alert('Delete Message', 'Delete this message from the circle?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: doDelete },
    ]);
  };

  const handleReportMessage = (msgId) => {
    const doReport = () => {
      reportMessage(msgId);
      if (!String(msgId).startsWith('msg-')) {
        apiClient
          .post(`/community/circles/${circleId}/messages/${msgId}/report`, { reason: 'safety' })
          .catch(() => {});
      }
    };
    if (Platform.OS === 'web') {
      if (window.confirm('Hide and report this message for breaking sanctuary safety?')) {
        doReport();
      }
      return;
    }
    Alert.alert(
      'Report & Hide Message',
      'Hide and report this message for breaking sanctuary safety?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Report & Hide', style: 'destructive', onPress: doReport },
      ]
    );
  };

  const handleReaction = async (msgId, type) => {
    soundService.playPop();
    const next = messages.map((m) => {
      if (m.id === msgId) {
        const r = m.reactions || { hugs: 0, hearts: 0 };
        return {
          ...m,
          reactions: {
            ...r,
            [type]: (r[type] || 0) + 1,
          },
        };
      }
      return m;
    });

    setMessages(next);
    try {
      await encryptedStorage.setItem(storageKey, JSON.stringify(next));
      if (!String(msgId).startsWith('msg-')) {
        await apiClient.post(`/community/circles/${circleId}/messages/${msgId}/react`, { key: type });
      }
    } catch {}
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={[styles.container, { backgroundColor: theme.bg }]}
    >
      {/* ── CHAT TOP BAR ─────────────────────────────────────── */}
      <View style={[styles.topBar, { backgroundColor: theme.cardBg, borderColor: theme.divider }]}>
        <View style={styles.topBarLeft}>
          <TouchableOpacity onPress={onBack} style={styles.backBtn} activeOpacity={0.7}>
            <Text style={[styles.backBtnText, { color: theme.textSecondary }]}>‹ Baraza</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setShowCircleInfo(true)}
            style={{ flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 }}
            activeOpacity={0.75}
          >
            <View style={[styles.circleIconPill, { backgroundColor: circle.iconBg || '#E8F0FF' }]}>
              <Text style={styles.circleIconEmoji}>{circle.icon || '💬'}</Text>
            </View>
            <View style={styles.circleTitleBlock}>
              <Text style={[styles.circleTitleText, { color: theme.textPrimary }]} numberOfLines={1}>
                {circle.title}
              </Text>
              <View style={styles.circleStatusRow}>
                <View style={styles.onlineDot} />
                <Text style={[styles.onlineStatusText, { color: '#16A34A' }]}>
                  Peer Sanctuary • Tap for circle info
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>

        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <TouchableOpacity
            onPress={() => (isJoined ? leaveCircle(circleId) : joinCircle(circleId))}
            style={[
              styles.safeTag,
              {
                backgroundColor: isJoined ? 'rgba(22, 163, 74, 0.14)' : theme.accentSoft,
              },
            ]}
            activeOpacity={0.75}
          >
            <Text style={[styles.safeTagText, { color: isJoined ? '#16A34A' : theme.accent }]}>
              {isJoined ? '✓ Joined' : '+ Join'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setShowGuidelines(true)}
            style={[styles.safeTag, { backgroundColor: 'rgba(138, 154, 134, 0.15)' }]}
            activeOpacity={0.75}
          >
            <Text style={[styles.safeTagText, { color: '#5B7057' }]}>ⓘ Rules</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* ── ALIAS REASSURANCE BAR ────────────────────────────── */}
      <View style={[styles.aliasBar, { backgroundColor: theme.bg, borderColor: theme.divider }]}>
        <Text style={[styles.aliasText, { color: theme.textMuted }]}>
          🛡️ Anonymous Alias: <Text style={{ color: theme.textPrimary, fontWeight: '700' }}>{userName}</Text> · Voice & text stay confidential
        </Text>
      </View>

      {/* ── MESSAGES FEED ─────────────────────────────────────── */}
      <View style={{ flex: 1, position: 'relative' }}>
        <ScrollView
          ref={scrollRef}
          contentContainerStyle={styles.messagesScroll}
          showsVerticalScrollIndicator={false}
          onScroll={(e) => {
            const { layoutMeasurement, contentOffset, contentSize } = e.nativeEvent;
            const distanceFromBottom = contentSize.height - (layoutMeasurement.height + contentOffset.y);
            setShowScrollBottom(distanceFromBottom > 120);
          }}
          scrollEventThrottle={100}
        >
          <View style={[styles.bannerNotice, { backgroundColor: theme.cardBg, borderColor: theme.divider }]}>
            <Text style={styles.bannerNoticeEmoji}>🌿</Text>
            <Text style={[styles.bannerNoticeText, { color: theme.textSecondary }]}>
              Welcome to {circle.title}. A confidential sanctuary for {circle.ageGroup || '18-24'} peers. Share gently, listen kindly.
            </Text>
          </View>

          {messages.filter((m) => !reportedMessageIds.includes(m.id)).length === 0 ? (
            <View style={[styles.emptyChatCard, { backgroundColor: theme.cardBg, borderColor: theme.divider }]}>
              <Text style={styles.emptyChatEmoji}>🌿</Text>
              <Text style={[styles.emptyChatTitle, { color: theme.textPrimary }]}>The circle is calm and open</Text>
              <Text style={[styles.emptyChatSubtitle, { color: theme.textMuted }]}>
                No messages have been sent here yet today. Be the first to share a quiet thought, dictate, or send a voice note below.
              </Text>
              {(userAgeBand === '13-17' || circle?.ageGroup === '13-17') && (
                <View style={styles.promptStartersWrap}>
                  <Text style={[styles.promptStartersLabel, { color: theme.textSecondary }]}>
                    Not sure what to say? Tap a starter:
                  </Text>
                  <View style={styles.promptChipsRow}>
                    {[
                      "Right now I'm carrying...",
                      'One thing that helped today was...',
                      'Anyone else feeling...',
                    ].map((starter) => (
                      <TouchableOpacity
                        key={starter}
                        onPress={() => setInputText(`${starter} `)}
                        activeOpacity={0.8}
                        style={[
                          styles.promptChip,
                          { backgroundColor: theme.accentSoft, borderColor: theme.divider },
                        ]}
                      >
                        <Text style={[styles.promptChipText, { color: theme.accent }]}>
                          {starter}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              )}
            </View>
          ) : (
            (() => {
              const visibleMsgs = messages.filter((m) => !reportedMessageIds.includes(m.id));
              let lastDate = null;
              return visibleMsgs.map((item) => {
                const msgDate = item.dateLabel || 'Today';
                const showDateDivider = msgDate !== lastDate;
                lastDate = msgDate;

                if (item.isMe) {
                  return (
                    <React.Fragment key={item.id}>
                      {showDateDivider && (
                        <View style={[styles.dateDividerPill, { backgroundColor: theme.cardBg, borderColor: theme.divider }]}>
                          <Text style={[styles.dateDividerText, { color: theme.textMuted }]}>{msgDate}</Text>
                        </View>
                      )}
                      <View style={styles.myBubbleRow}>
                        <TouchableOpacity
                          activeOpacity={0.92}
                          onLongPress={(e) => openMsgMenu(item, e)}
                          style={[styles.myBubble, { backgroundColor: theme.accent }]}
                        >
                          <View style={styles.bubbleTopMenuRow}>
                            <View style={{ flex: 1 }}>
                              {item.replyTo && (
                                <View style={styles.myReplyQuote}>
                                  <Text style={styles.myReplySender}>{item.replyTo.sender}</Text>
                                  <Text style={styles.myReplySnippet} numberOfLines={1}>{item.replyTo.snippet}</Text>
                                </View>
                              )}
                            </View>
                            <TouchableOpacity
                              onPress={(e) => openMsgMenu(item, e)}
                              style={styles.bubbleMenuIconBtn}
                              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                              activeOpacity={0.7}
                            >
                              <MoreHorizontal size={14} color="rgba(255,255,255,0.8)" />
                            </TouchableOpacity>
                          </View>
                          {item.voiceNote && (
                            <View style={{ marginBottom: item.text ? 8 : 2 }}>
                              <VoiceNotePlayer voiceNote={item.voiceNote} inverted compact />
                            </View>
                          )}
                          {!!item.text && <Text style={styles.myBubbleText}>{item.text}</Text>}
                          <View style={styles.myBubbleMetaRow}>
                            <Text style={styles.myBubbleTime}>
                              {item.edited ? `Edited · ${item.time}` : item.time}
                            </Text>
                          </View>
                        </TouchableOpacity>
                      </View>
                    </React.Fragment>
                  );
                }

                return (
                  <React.Fragment key={item.id}>
                    {showDateDivider && (
                      <View style={[styles.dateDividerPill, { backgroundColor: theme.cardBg, borderColor: theme.divider }]}>
                        <Text style={[styles.dateDividerText, { color: theme.textMuted }]}>{msgDate}</Text>
                      </View>
                    )}
                    <View style={styles.peerBubbleRow}>
                      <View style={styles.peerAvatar}>
                        <Text style={styles.peerAvatarEmoji}>{item.emoji || '🌱'}</Text>
                      </View>
                      <View style={styles.peerBubbleCol}>
                        <View style={styles.peerSenderRow}>
                          <Text style={[styles.peerSenderName, { color: theme.textPrimary }]}>
                            {item.sender}
                          </Text>
                          <Text style={[styles.peerTimeText, { color: theme.textMuted }]}>
                            {item.time}
                          </Text>
                          <TouchableOpacity
                            onPress={(e) => openMsgMenu(item, e)}
                            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                            activeOpacity={0.7}
                          >
                            <MoreHorizontal size={14} color={theme.textMuted} />
                          </TouchableOpacity>
                        </View>
                        <TouchableOpacity
                          activeOpacity={0.92}
                          onLongPress={(e) => openMsgMenu(item, e)}
                          style={[
                            styles.peerBubble,
                            { backgroundColor: theme.cardBg, borderColor: theme.divider },
                          ]}
                        >
                          {item.replyTo && (
                            <View style={[styles.peerReplyQuote, { backgroundColor: theme.bg, borderLeftColor: theme.accent }]}>
                              <Text style={[styles.peerReplySender, { color: theme.accent }]}>{item.replyTo.sender}</Text>
                              <Text style={[styles.peerReplySnippet, { color: theme.textSecondary }]} numberOfLines={1}>{item.replyTo.snippet}</Text>
                            </View>
                          )}
                          {item.voiceNote && (
                            <View style={{ marginBottom: item.text ? 8 : 0 }}>
                              <VoiceNotePlayer voiceNote={item.voiceNote} compact />
                            </View>
                          )}
                          {!!item.text && (
                            <Text style={[styles.peerBubbleText, { color: theme.textPrimary }]}>
                              {item.text}
                            </Text>
                          )}
                        </TouchableOpacity>

                        {/* Quick Support Reactions */}
                        <View style={styles.reactionRow}>
                          {[
                            { key: 'hugs', emoji: '🫂' },
                            { key: 'hearts', emoji: '🌸' },
                            { key: 'pray', emoji: '🙏' },
                            { key: 'green', emoji: '💚' },
                          ].map((rx) => (
                            <TouchableOpacity
                              key={rx.key}
                              style={[styles.reactBtn, { borderColor: theme.divider }]}
                              onPress={() => handleReaction(item.id, rx.key)}
                              activeOpacity={0.7}
                            >
                              <Text style={styles.reactBtnEmoji}>{rx.emoji}</Text>
                              {(item.reactions?.[rx.key] || 0) > 0 && (
                                <Text style={[styles.reactBtnCount, { color: theme.textMuted }]}>
                                  {item.reactions[rx.key]}
                                </Text>
                              )}
                            </TouchableOpacity>
                          ))}
                        </View>
                      </View>
                    </View>
                  </React.Fragment>
                );
              });
            })()
          )}
        </ScrollView>

        {showScrollBottom && (
          <TouchableOpacity
            style={[styles.scrollBottomBtn, { backgroundColor: theme.cardBg, borderColor: theme.divider }]}
            onPress={() => scrollRef.current?.scrollToEnd({ animated: true })}
            activeOpacity={0.85}
          >
            <Text style={[styles.scrollBottomArrow, { color: theme.accent }]}>↓</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* ── INPUT DOCK (Sticky above BottomNavBar) ───────────── */}
      <View
        style={[
          styles.inputDockWrap,
          { backgroundColor: theme.cardBg, borderColor: theme.divider },
        ]}
      >
        {replyingTo && (
          <View style={[styles.replyBanner, { backgroundColor: theme.bg, borderLeftColor: theme.accent }]}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.replyBannerSender, { color: theme.accent }]}>
                Replying to {replyingTo.sender}
              </Text>
              <Text style={[styles.replyBannerText, { color: theme.textSecondary }]} numberOfLines={1}>
                {replyingTo.text || (replyingTo.voiceNote ? '🎙️ Voice note' : '')}
              </Text>
            </View>
            <TouchableOpacity onPress={() => setReplyingTo(null)} style={{ padding: 4 }} activeOpacity={0.7}>
              <Text style={{ fontSize: 13, fontWeight: '800', color: theme.textMuted }}>✕</Text>
            </TouchableOpacity>
          </View>
        )}
        {draftVoiceNote && !isRecording && (
          <View style={{ marginBottom: 4 }}>
            <VoiceNotePlayer
              voiceNote={draftVoiceNote}
              compact
              onRemove={() => setDraftVoiceNote(null)}
            />
          </View>
        )}

        {isRecording ? (
          <View style={styles.inlineRecordingRow}>
            <View style={styles.inlineRecordingLeft}>
              <View style={styles.liveRedDot} />
              <Text style={styles.inlineRecordingLabel}>
                Recording {formatVoiceDuration(elapsedSec)}
                {elapsedSec >= MAX_VOICE_NOTE_SECONDS - 60
                  ? ` / ${formatVoiceDuration(MAX_VOICE_NOTE_SECONDS)}`
                  : ''}
              </Text>
            </View>
            <View style={styles.inlineRecordingActions}>
              <TouchableOpacity onPress={handleCancelRecording} style={styles.inlineCancelRecBtn} activeOpacity={0.7}>
                <Text style={styles.inlineCancelRecText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleStopRecording}
                style={[styles.inlineSaveRecBtn, { backgroundColor: theme.accent }]}
                activeOpacity={0.85}
              >
                <Text style={styles.inlineSaveRecText}>Attach</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View style={styles.inputRow}>
            <TouchableOpacity
              onPress={() => setShowChillAttach(true)}
              style={{
                width: 38,
                height: 38,
                borderRadius: 19,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: theme.bg,
                borderWidth: 1,
                borderColor: theme.divider,
              }}
              activeOpacity={0.8}
            >
              <Sparkles size={17} color={theme.accent} />
            </TouchableOpacity>
            <View
              style={[
                styles.composerPill,
                { backgroundColor: theme.bg, borderColor: theme.divider },
              ]}
            >
              <TextInput
                underlineColorAndroid="transparent"
                style={[
                  styles.composerInput,
                  { color: theme.textPrimary },
                  Platform.OS === 'web' && { outlineStyle: 'none', outlineWidth: 0 },
                ]}
                placeholder={editingMsgId ? 'Edit your message...' : 'Share with the circle gently...'}
                placeholderTextColor={theme.textMuted}
                value={inputText}
                onChangeText={setInputText}
                multiline
                maxLength={300}
              />
              {speechSupported && (
                <TouchableOpacity
                  onPress={isDictating ? handleStopDictation : handleStartDictation}
                  style={[
                    styles.inlineDictateBtn,
                    isDictating && { backgroundColor: 'rgba(217, 107, 67, 0.14)' },
                  ]}
                  activeOpacity={0.75}
                >
                  <Text
                    style={[
                      styles.inlineDictateText,
                      { color: isDictating ? theme.accent : theme.textMuted },
                    ]}
                  >
                    {isDictating ? 'Stop' : 'Dictate'}
                  </Text>
                </TouchableOpacity>
              )}
            </View>

            {inputText.trim() || draftVoiceNote ? (
              <TouchableOpacity
                style={[styles.sendBtn, { backgroundColor: theme.accent }]}
                onPress={handleSendMessage}
                activeOpacity={0.8}
              >
                <Send size={17} color="#FFFFFF" />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={[styles.sendBtn, { backgroundColor: theme.accent }]}
                onPress={handleStartRecording}
                activeOpacity={0.8}
              >
                <Mic size={18} color="#FFFFFF" />
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>

      {/* ── WHATSAPP-STYLE ANCHORED MESSAGE ACTION MENU ──────── */}
      <Modal
        visible={!!activeMsgMenu}
        transparent
        animationType="fade"
        onRequestClose={() => setActiveMsgMenu(null)}
      >
        <TouchableOpacity
          style={[
            styles.modalOverlay,
            activeMsgAnchor
              ? { justifyContent: 'flex-start', alignItems: 'flex-start' }
              : null,
          ]}
          activeOpacity={1}
          onPress={() => setActiveMsgMenu(null)}
        >
          {(() => {
            const win = Dimensions.get('window');
            const menuWidth = 240;
            const estHeight = 220;
            const anchoredStyle = activeMsgAnchor
              ? {
                  position: 'absolute',
                  top: Math.min(Math.max(60, activeMsgAnchor.y + 10), win.height - estHeight - 24),
                  left: Math.min(Math.max(16, activeMsgAnchor.x - menuWidth / 2), win.width - menuWidth - 16),
                  width: menuWidth,
                }
              : null;
            return (
              <View style={[styles.msgMenuCard, anchoredStyle, { backgroundColor: theme.cardBg, borderColor: theme.divider }]}>
                {!!activeMsgMenu?.text && (
                  <Text style={[styles.msgMenuPreview, { color: theme.textMuted }]} numberOfLines={2}>
                    "{activeMsgMenu.text}"
                  </Text>
                )}
                <TouchableOpacity
                  style={[styles.msgMenuItem, { borderBottomColor: theme.divider }]}
                  onPress={() => {
                    const msg = activeMsgMenu;
                    setActiveMsgMenu(null);
                    if (msg) setReplyingTo(msg);
                  }}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.msgMenuText, { color: theme.textPrimary }]}>↩️ Reply</Text>
                </TouchableOpacity>

                {activeMsgMenu?.isMe && !!activeMsgMenu?.text && (
                  <TouchableOpacity
                    style={[styles.msgMenuItem, { borderBottomColor: theme.divider }]}
                    onPress={() => {
                      const msg = activeMsgMenu;
                      setActiveMsgMenu(null);
                      if (msg) {
                        setEditingMsgId(msg.id);
                        setInputText(msg.text);
                      }
                    }}
                    activeOpacity={0.7}
                  >
                    <Text style={[styles.msgMenuText, { color: theme.textPrimary }]}>✏️ Edit</Text>
                  </TouchableOpacity>
                )}

                {activeMsgMenu?.isMe ? (
                  <TouchableOpacity
                    style={[styles.msgMenuItem, { borderBottomColor: theme.divider }]}
                    onPress={() => {
                      const msg = activeMsgMenu;
                      setActiveMsgMenu(null);
                      if (msg) handleDeleteMessage(msg.id);
                    }}
                    activeOpacity={0.7}
                  >
                    <Text style={[styles.msgMenuText, { color: '#DC2626' }]}>🗑️ Delete</Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    style={[styles.msgMenuItem, { borderBottomColor: theme.divider }]}
                    onPress={() => {
                      const msg = activeMsgMenu;
                      setActiveMsgMenu(null);
                      if (msg) handleReportMessage(msg.id);
                    }}
                    activeOpacity={0.7}
                  >
                    <Text style={[styles.msgMenuText, { color: '#DC2626' }]}>Hide & report</Text>
                  </TouchableOpacity>
                )}

                <TouchableOpacity
                  style={[styles.msgMenuItem, { borderBottomWidth: 0 }]}
                  onPress={() => setActiveMsgMenu(null)}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.msgMenuText, { color: theme.textMuted }]}>Cancel</Text>
                </TouchableOpacity>
              </View>
            );
          })()}
        </TouchableOpacity>
      </Modal>

      {/* ── SHARE CHILL CONTENT TO THIS CIRCLE MODAL ────────── */}
      <Modal
        visible={showChillAttach}
        transparent
        animationType="slide"
        onRequestClose={() => setShowChillAttach(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.guidelinesCard, { backgroundColor: theme.cardBg, borderColor: theme.divider, maxHeight: '80%' }]}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text style={[styles.guidelinesTitle, { color: theme.textPrimary }]}>✨ Share to {circle.title}</Text>
              <TouchableOpacity onPress={() => setShowChillAttach(false)} style={{ padding: 4 }}>
                <Text style={{ fontSize: 18, fontWeight: '700', color: theme.textMuted }}>✕</Text>
              </TouchableOpacity>
            </View>
            <View style={{ flexDirection: 'row', gap: 8 }}>
              {[
                { id: 'memes', label: '😂 Memes' },
                { id: 'stories', label: '📖 Stories' },
                { id: 'podcasts', label: '🎧 Podcasts' },
              ].map((tab) => {
                const active = chillAttachTab === tab.id;
                return (
                  <TouchableOpacity
                    key={tab.id}
                    onPress={() => setChillAttachTab(tab.id)}
                    style={{
                      paddingHorizontal: 12,
                      paddingVertical: 6,
                      borderRadius: 12,
                      backgroundColor: active ? theme.accent : theme.bg,
                      borderWidth: 1,
                      borderColor: active ? theme.accent : theme.divider,
                    }}
                  >
                    <Text style={{ fontSize: 12, fontWeight: '700', color: active ? '#FFF' : theme.textPrimary }}>
                      {tab.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
            <ScrollView showsVerticalScrollIndicator={false} style={{ maxHeight: 280 }}>
              <View style={{ gap: 8 }}>
                {(chillAttachTab === 'memes'
                  ? initialMemes
                  : chillAttachTab === 'stories'
                    ? initialStories
                    : GUIDED_MEDITATIONS
                ).map((entry) => (
                  <TouchableOpacity
                    key={entry.id}
                    style={{
                      backgroundColor: theme.bg,
                      borderColor: theme.divider,
                      borderWidth: 1,
                      borderRadius: 14,
                      padding: 12,
                    }}
                    onPress={() => {
                      const shareKind =
                        chillAttachTab === 'memes'
                          ? 'meme'
                          : chillAttachTab === 'stories'
                            ? 'story'
                            : 'podcast';
                      setInputText(formatChillShareText(shareKind, entry));
                      setShowChillAttach(false);
                    }}
                    activeOpacity={0.8}
                  >
                    <Text style={{ fontSize: 13.5, fontWeight: '800', color: theme.textPrimary }}>
                      {entry.title}
                    </Text>
                    <Text style={{ fontSize: 11.5, color: theme.textMuted, marginTop: 2 }} numberOfLines={2}>
                      {entry.subtext || entry.excerpt || entry.quote || entry.guide}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* ── CIRCLE INFO MODAL (WhatsApp-style Group Info) ─────── */}
      <Modal
        visible={showCircleInfo}
        transparent
        animationType="fade"
        onRequestClose={() => setShowCircleInfo(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.guidelinesCard, { backgroundColor: theme.cardBg, borderColor: theme.divider }]}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              <View style={[styles.circleIconPill, { backgroundColor: circle.iconBg || '#E8F0FF', width: 48, height: 48 }]}>
                <Text style={{ fontSize: 24 }}>{circle.icon || '💬'}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.guidelinesTitle, { color: theme.textPrimary }]}>{circle.title}</Text>
                <Text style={{ fontSize: 12, color: theme.textMuted, fontWeight: '600' }}>
                  Peer Circle · Active Space
                </Text>
              </View>
            </View>
            {!!circle.description && (
              <Text style={[styles.guidelinesBody, { color: theme.textSecondary }]}>
                {circle.description}
              </Text>
            )}
            <View style={{ backgroundColor: theme.bg, padding: 12, borderRadius: 14, gap: 4 }}>
              <Text style={{ fontSize: 12, color: theme.textPrimary, fontWeight: '700' }}>
                Your Alias: {userName}
              </Text>
              <Text style={{ fontSize: 12, color: theme.textMuted }}>
                Messages here: {messages.length} · Voice notes: {messages.filter((m) => m.voiceNote).length}
              </Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 }}>
              <TouchableOpacity
                onPress={() => {
                  if (isJoined) leaveCircle(circleId);
                  else joinCircle(circleId);
                }}
                style={{ paddingVertical: 8, paddingHorizontal: 12 }}
                activeOpacity={0.75}
              >
                <Text style={{ fontSize: 13, fontWeight: '800', color: isJoined ? '#DC2626' : theme.accent }}>
                  {isJoined ? 'Leave Circle' : '+ Join Circle'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.guidelinesBtn, { backgroundColor: theme.accent }]}
                onPress={() => setShowCircleInfo(false)}
                activeOpacity={0.85}
              >
                <Text style={styles.guidelinesBtnText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* ── COMMUNITY GUIDELINES MODAL ───────────────────────── */}
      <Modal
        visible={showGuidelines}
        transparent
        animationType="fade"
        onRequestClose={() => setShowGuidelines(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.guidelinesCard, { backgroundColor: theme.cardBg, borderColor: theme.divider }]}>
            <Text style={[styles.guidelinesTitle, { color: theme.textPrimary }]}>🌿 Baraza Sanctuary Guidelines</Text>
            <Text style={[styles.guidelinesBody, { color: theme.textSecondary }]}>
              • <Text style={{ fontWeight: '800' }}>Confidentiality:</Text> What is shared in this circle stays in this circle.{'\n'}
              • <Text style={{ fontWeight: '800' }}>Kindness First:</Text> Listen without judgment or unsolicited fixing.{'\n'}
              • <Text style={{ fontWeight: '800' }}>Your Pace:</Text> You can speak via text, voice note, or simply read quietly.{'\n'}
              • <Text style={{ fontWeight: '800' }}>Need Urgent Support?</Text> If you feel overwhelmed, reach out to {countryData?.helplineName || 'Local Support'} ({countryData?.helplinePhone || 'local emergency services'}) in {countryData?.name || 'your region'}.
            </Text>
            <TouchableOpacity
              style={[styles.guidelinesBtn, { backgroundColor: theme.accent }]}
              onPress={() => setShowGuidelines(false)}
              activeOpacity={0.85}
            >
              <Text style={styles.guidelinesBtnText}>Got it, thank you</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* ── CRISIS SAFETY & HELPLINE NUDGE MODAL ───────────────────────── */}
      <Modal
        visible={showHelplineNudge}
        transparent
        animationType="fade"
        onRequestClose={() => setShowHelplineNudge(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.guidelinesCard, { backgroundColor: theme.cardBg, borderColor: '#FCA5A5', borderWidth: 1.5 }]}>
            <Text style={[styles.guidelinesTitle, { color: '#991B1B' }]}>💛 You don't have to carry this alone</Text>
            <Text style={[styles.guidelinesBody, { color: theme.textSecondary }]}>
              It sounds like you might be going through something really heavy right now. Please consider reaching out to someone trained to support you right away — free, confidential, and judgment-free:
              {'\n\n'}• <Text style={{ fontWeight: '800' }}>{countryData?.helplineName || 'Befrienders Kenya'}:</Text> {countryData?.helplinePhone || '+254 722 178 177'}
              {'\n'}• <Text style={{ fontWeight: '800' }}>Kenya Red Cross:</Text> 1199 (Toll-Free)
              {'\n'}• <Text style={{ fontWeight: '800' }}>Uganda Mental Health:</Text> 0800 21 21 21
              {'\n'}• <Text style={{ fontWeight: '800' }}>Rwanda Support:</Text> 114
              {'\n'}• <Text style={{ fontWeight: '800' }}>Global Directory:</Text> findahelpline.com
            </Text>
            <TouchableOpacity
              style={[styles.guidelinesBtn, { backgroundColor: theme.accent }]}
              onPress={() => setShowHelplineNudge(false)}
              activeOpacity={0.85}
            >
              <Text style={styles.guidelinesBtnText}>I understand</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
};
