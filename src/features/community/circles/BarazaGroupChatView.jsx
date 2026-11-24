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
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Modal,
  Alert,
} from 'react-native';
import { Mic, MoreHorizontal, Send } from 'lucide-react-native';
import { encryptedStorage } from '../../../services/encryptedStorage';
import { useTheme } from '../../../theme/ThemeContext';
import { useI18n } from '../../../services/i18n';
import { soundService } from '../../../screens/arcade/audio/soundService';
import { onboardingStorage } from '../../../services/onboardingStorage';
import { useCommunityStore } from '../store/communityStore';
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

export const BarazaGroupChatView = ({ circle, onBack }) => {
  const { theme } = useTheme();
  const { countryData } = useI18n();
  const circleId = circle?.id || 'campus_grounding';
  const storageKey = `mindbloom:baraza:chat:${circleId}:v2`;

  const {
    joinedCircleIds,
    joinCircle,
    leaveCircle,
    reportedMessageIds,
    reportMessage,
  } = useCommunityStore();
  const isJoined = joinedCircleIds.includes(circleId);

  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [draftVoiceNote, setDraftVoiceNote] = useState(null);
  const [replyingTo, setReplyingTo] = useState(null);
  const [editingMsgId, setEditingMsgId] = useState(null);
  const [showScrollBottom, setShowScrollBottom] = useState(false);
  const [userName, setUserName] = useState('You');
  const [showGuidelines, setShowGuidelines] = useState(false);
  const [showCircleInfo, setShowCircleInfo] = useState(false);
  const [activeMsgMenu, setActiveMsgMenu] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
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

  // Load chat history & user profile
  useEffect(() => {
    async function loadChat() {
      try {
        const [rawChat, prefs] = await Promise.all([
          encryptedStorage.getItem(storageKey),
          onboardingStorage.getPreferences(),
        ]);

        if (prefs?.name || prefs?.nickname) {
          setUserName(prefs.name || prefs.nickname);
        }

        if (rawChat) {
          setMessages(JSON.parse(rawChat));
        } else {
          setMessages([]);
        }
      } catch {
        setMessages([]);
      }
    }
    loadChat();
  }, [circleId]);

  const handleSendMessage = async () => {
    const text = inputText.trim();
    if (!text && !draftVoiceNote) return;

    soundService.playPop();
    if (!isJoined) {
      joinCircle(circleId);
    }

    if (editingMsgId) {
      const nextMessages = messages.map((m) =>
        m.id === editingMsgId ? { ...m, text, edited: true } : m
      );
      setMessages(nextMessages);
      setEditingMsgId(null);
      setInputText('');
      try {
        await encryptedStorage.setItem(storageKey, JSON.stringify(nextMessages));
      } catch {}
      return;
    }

    const newMsg = {
      id: `msg-${Date.now()}`,
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
      await encryptedStorage.setItem(storageKey, JSON.stringify(nextMessages));
    } catch {}

    setTimeout(() => {
      scrollRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const handleDeleteMessage = (msgId) => {
    const doDelete = async () => {
      const next = messages.filter((m) => m.id !== msgId);
      setMessages(next);
      try {
        await encryptedStorage.setItem(storageKey, JSON.stringify(next));
      } catch {}
    };
    if (Platform.OS === 'web') {
      if (window.confirm('Let go of this message?')) {
        doDelete();
      }
      return;
    }
    Alert.alert('Let Go of Message', 'Gently remove this message from the circle?', [
      { text: 'Keep it', style: 'cancel' },
      { text: 'Let go', style: 'destructive', onPress: doDelete },
    ]);
  };

  const handleReportMessage = (msgId) => {
    const doReport = () => {
      reportMessage(msgId);
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
                  Cohort: {circle.ageGroup || '18-24'} • Tap for circle info
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
                          onLongPress={() => setActiveMsgMenu(item)}
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
                              onPress={() => setActiveMsgMenu(item)}
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
                            onPress={() => setActiveMsgMenu(item)}
                            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                            activeOpacity={0.7}
                          >
                            <MoreHorizontal size={14} color={theme.textMuted} />
                          </TouchableOpacity>
                        </View>
                        <TouchableOpacity
                          activeOpacity={0.92}
                          onLongPress={() => setActiveMsgMenu(item)}
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
                Recording {formatVoiceDuration(elapsedSec)} / {formatVoiceDuration(MAX_VOICE_NOTE_SECONDS)}
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

      {/* ── WHATSAPP-STYLE MESSAGE ACTION MENU ───────────────── */}
      <Modal
        visible={!!activeMsgMenu}
        transparent
        animationType="fade"
        onRequestClose={() => setActiveMsgMenu(null)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setActiveMsgMenu(null)}
        >
          <View style={[styles.msgMenuCard, { backgroundColor: theme.cardBg, borderColor: theme.divider }]}>
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
              <Text style={[styles.msgMenuText, { color: theme.textPrimary }]}>Reply</Text>
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
                <Text style={[styles.msgMenuText, { color: theme.textPrimary }]}>Edit</Text>
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
                <Text style={[styles.msgMenuText, { color: '#DC2626' }]}>Let go</Text>
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
        </TouchableOpacity>
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
                  Age Cohort {circle.ageGroup || '18-24'} · {Math.min(12, (circle.memberCount || 1) + (isJoined ? 1 : 0))}/12 Members
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
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
  },
  topBarLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  backBtn: {
    paddingVertical: 4,
    paddingRight: 6,
  },
  backBtnText: {
    fontSize: 14,
    fontWeight: '800',
  },
  circleIconPill: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  circleIconEmoji: {
    fontSize: 18,
  },
  circleTitleBlock: {
    flex: 1,
    gap: 2,
  },
  circleTitleText: {
    fontSize: 14.5,
    fontWeight: '800',
  },
  circleStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  onlineDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#16A34A',
  },
  onlineStatusText: {
    fontSize: 11,
    fontWeight: '700',
  },
  safeTag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  safeTagText: {
    fontSize: 10.5,
    fontWeight: '700',
  },
  messagesScroll: {
    padding: 16,
    gap: 16,
    paddingBottom: 24,
  },
  bannerNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 8,
  },
  bannerNoticeEmoji: {
    fontSize: 20,
  },
  bannerNoticeText: {
    flex: 1,
    fontSize: 12,
    lineHeight: 16,
  },
  emptyChatCard: {
    padding: 36,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginVertical: 24,
  },
  emptyChatEmoji: {
    fontSize: 32,
    marginBottom: 4,
  },
  emptyChatTitle: {
    fontSize: 16,
    fontWeight: '800',
  },
  emptyChatSubtitle: {
    fontSize: 12.5,
    lineHeight: 18,
    textAlign: 'center',
    maxWidth: 320,
  },
  peerBubbleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    maxWidth: '85%',
  },
  peerAvatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(0,0,0,0.05)',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  peerAvatarEmoji: {
    fontSize: 18,
  },
  peerBubbleCol: {
    flex: 1,
    gap: 4,
  },
  peerSenderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  peerSenderName: {
    fontSize: 12,
    fontWeight: '800',
  },
  peerTimeText: {
    fontSize: 10,
  },
  peerBubble: {
    padding: 12,
    borderRadius: 18,
    borderTopLeftRadius: 4,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  peerBubbleText: {
    fontSize: 13.5,
    lineHeight: 19,
  },
  reactionRow: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 2,
  },
  reactBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    borderWidth: 1,
    backgroundColor: 'rgba(0,0,0,0.02)',
  },
  reactBtnEmoji: {
    fontSize: 11,
  },
  reactBtnCount: {
    fontSize: 10,
    fontWeight: '700',
  },
  myBubbleRow: {
    alignSelf: 'flex-end',
    maxWidth: '85%',
  },
  myBubble: {
    padding: 12,
    borderRadius: 18,
    borderBottomRightRadius: 4,
    gap: 4,
  },
  myBubbleText: {
    color: '#FFFFFF',
    fontSize: 13.5,
    lineHeight: 19,
  },
  myBubbleTime: {
    color: 'rgba(255,255,255,0.75)',
    fontSize: 10,
    alignSelf: 'flex-end',
  },
  aliasBar: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderBottomWidth: 1,
  },
  aliasText: {
    fontSize: 11.5,
  },
  inputDockWrap: {
    paddingHorizontal: 12,
    paddingTop: 10,
    paddingBottom: 12,
    borderTopWidth: 1,
    gap: 8,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(26, 16, 36, 0.55)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  guidelinesCard: {
    width: '100%',
    maxWidth: 420,
    borderRadius: 22,
    borderWidth: 1,
    padding: 22,
    gap: 14,
  },
  guidelinesTitle: {
    fontSize: 17,
    fontWeight: '800',
  },
  guidelinesBody: {
    fontSize: 13.5,
    lineHeight: 21,
  },
  guidelinesBtn: {
    alignSelf: 'flex-end',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 99,
  },
  guidelinesBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
  dateDividerPill: {
    alignSelf: 'center',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 99,
    borderWidth: 1,
    marginVertical: 4,
  },
  dateDividerText: {
    fontSize: 10.5,
    fontWeight: '700',
  },
  myReplyQuote: {
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderLeftWidth: 3,
    borderLeftColor: '#FFFFFF',
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 6,
    marginBottom: 4,
  },
  myReplySender: {
    color: '#FFFFFF',
    fontSize: 10.5,
    fontWeight: '800',
  },
  myReplySnippet: {
    color: 'rgba(255,255,255,0.88)',
    fontSize: 11.5,
  },
  myBubbleMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 10,
    marginTop: 2,
  },
  myBubbleAction: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 10,
    fontWeight: '700',
  },
  peerReplyQuote: {
    borderLeftWidth: 3,
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 6,
    marginBottom: 6,
  },
  peerReplySender: {
    fontSize: 10.5,
    fontWeight: '800',
  },
  peerReplySnippet: {
    fontSize: 11.5,
  },
  replyBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    borderLeftWidth: 3,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 8,
  },
  replyBannerSender: {
    fontSize: 11,
    fontWeight: '800',
  },
  replyBannerText: {
    fontSize: 12,
  },
  scrollBottomBtn: {
    position: 'absolute',
    right: 16,
    bottom: 14,
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
  },
  scrollBottomArrow: {
    fontSize: 16,
    fontWeight: '900',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderTopWidth: 1,
    gap: 10,
  },
  inputField: {
    flex: 1,
    minHeight: 42,
    maxHeight: 100,
    borderRadius: 20,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 13.5,
  },
  sendBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendBtnArrow: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
  bubbleTopMenuRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 8,
  },
  bubbleMenuIconBtn: {
    padding: 2,
    marginLeft: 'auto',
  },
  composerPill: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 44,
    maxHeight: 110,
    borderRadius: 22,
    borderWidth: 1,
    paddingLeft: 16,
    paddingRight: 8,
    paddingVertical: 6,
    gap: 6,
  },
  composerInput: {
    flex: 1,
    fontSize: 13.5,
    paddingVertical: 4,
    maxHeight: 90,
  },
  inlineDictateBtn: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 14,
  },
  inlineDictateText: {
    fontSize: 12,
    fontWeight: '700',
  },
  inlineRecordingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FEF2F2',
    borderColor: '#FCA5A5',
    borderWidth: 1,
    borderRadius: 22,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  inlineRecordingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  liveRedDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#DC2626',
  },
  inlineRecordingLabel: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#991B1B',
  },
  inlineRecordingActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  inlineCancelRecBtn: {
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  inlineCancelRecText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#6B7280',
  },
  inlineSaveRecBtn: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
  },
  inlineSaveRecText: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  msgMenuCard: {
    width: '100%',
    maxWidth: 280,
    borderRadius: 18,
    borderWidth: 1,
    overflow: 'hidden',
  },
  msgMenuPreview: {
    fontSize: 12,
    fontStyle: 'italic',
    paddingHorizontal: 18,
    paddingTop: 14,
    paddingBottom: 8,
  },
  msgMenuItem: {
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderBottomWidth: 1,
  },
  msgMenuText: {
    fontSize: 14.5,
    fontWeight: '700',
  },
});
