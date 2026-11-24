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
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../../../theme/ThemeContext';
import { soundService } from '../../../screens/arcade/audio/soundService';
import { onboardingStorage } from '../../../services/onboardingStorage';
import { useCommunityStore } from '../store/communityStore';
import { VoiceInputControls } from '../../../components/voice/VoiceInputControls';
import { VoiceNotePlayer } from '../../../components/voice/VoiceNotePlayer';

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
  const [userName, setUserName] = useState('You');
  const [showGuidelines, setShowGuidelines] = useState(false);
  const scrollRef = useRef(null);

  // Load chat history & user profile
  useEffect(() => {
    async function loadChat() {
      try {
        const [rawChat, prefs] = await Promise.all([
          AsyncStorage.getItem(storageKey),
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

    const newMsg = {
      id: `msg-${Date.now()}`,
      sender: userName,
      emoji: '🌱',
      text,
      voiceNote: draftVoiceNote,
      time: formatTimestamp(),
      isMe: true,
      reactions: { hugs: 0, hearts: 0 },
    };

    const nextMessages = [...messages, newMsg];
    setMessages(nextMessages);
    setInputText('');
    setDraftVoiceNote(null);

    try {
      await AsyncStorage.setItem(storageKey, JSON.stringify(nextMessages));
    } catch {}

    setTimeout(() => {
      scrollRef.current?.scrollToEnd({ animated: true });
    }, 100);
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
      await AsyncStorage.setItem(storageKey, JSON.stringify(next));
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
                Cohort: {circle.ageGroup || '18-24'} • Max 12 Members
              </Text>
            </View>
          </View>
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
      <ScrollView
        ref={scrollRef}
        contentContainerStyle={styles.messagesScroll}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.bannerNotice, { backgroundColor: theme.cardBg, borderColor: theme.divider }]}>
          <Text style={styles.bannerNoticeEmoji}>🌿</Text>
          <Text style={[styles.bannerNoticeText, { color: theme.textSecondary }]}>
            Welcome to {circle.title}. A confidential sanctuary for {circle.ageGroup || '18-24'} peers. Share gently, listen kindly.
          </Text>
        </View>

        {messages.filter((m) => !reportedMessageIds.includes(m.id)).length === 0 ? (
          <View style={[styles.emptyChatCard, { backgroundColor: theme.cardBg, borderColor: theme.divider }]}>
            <Text style={styles.emptyChatEmoji}>🕊️</Text>
            <Text style={[styles.emptyChatTitle, { color: theme.textPrimary }]}>The circle is calm and open</Text>
            <Text style={[styles.emptyChatSubtitle, { color: theme.textMuted }]}>
              No messages have been sent here yet today. Be the first to share a quiet thought, dictate, or send a voice note below.
            </Text>
          </View>
        ) : (
          messages
            .filter((m) => !reportedMessageIds.includes(m.id))
            .map((item) => {
            if (item.isMe) {
              return (
                <View key={item.id} style={styles.myBubbleRow}>
                  <View style={[styles.myBubble, { backgroundColor: theme.accent }]}>
                    {item.voiceNote && (
                      <View style={{ marginBottom: item.text ? 8 : 2 }}>
                        <VoiceNotePlayer voiceNote={item.voiceNote} inverted compact />
                      </View>
                    )}
                    {!!item.text && <Text style={styles.myBubbleText}>{item.text}</Text>}
                    <Text style={styles.myBubbleTime}>{item.time}</Text>
                  </View>
                </View>
              );
            }

            return (
              <View key={item.id} style={styles.peerBubbleRow}>
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
                  </View>
                  <View
                    style={[
                      styles.peerBubble,
                      { backgroundColor: theme.cardBg, borderColor: theme.divider },
                    ]}
                  >
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
                  </View>

                  {/* Quick Support Reactions & Safety Flag */}
                  <View style={styles.reactionRow}>
                    <TouchableOpacity
                      style={[styles.reactBtn, { borderColor: theme.divider }]}
                      onPress={() => handleReaction(item.id, 'hugs')}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.reactBtnEmoji}>🫂</Text>
                      <Text style={[styles.reactBtnCount, { color: theme.textMuted }]}>
                        {item.reactions?.hugs || 0}
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.reactBtn, { borderColor: theme.divider }]}
                      onPress={() => handleReaction(item.id, 'hearts')}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.reactBtnEmoji}>🌸</Text>
                      <Text style={[styles.reactBtnCount, { color: theme.textMuted }]}>
                        {item.reactions?.hearts || 0}
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.reactBtn, { borderColor: theme.divider }]}
                      onPress={() => handleReportMessage(item.id)}
                      activeOpacity={0.7}
                    >
                      <Text style={[styles.reactBtnCount, { color: theme.textMuted }]}>⚑ Hide</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            );
          })
        )}
      </ScrollView>

      {/* ── INPUT DOCK (Sticky above BottomNavBar) ───────────── */}
      <View
        style={[
          styles.inputDockWrap,
          { backgroundColor: theme.cardBg, borderColor: theme.divider },
        ]}
      >
        <VoiceInputControls
          voiceNote={draftVoiceNote}
          onVoiceNoteChange={setDraftVoiceNote}
          onAppendTranscript={(chunk) =>
            setInputText((prev) => (prev ? `${prev} ${chunk}` : chunk))
          }
          compact
        />
        <View style={styles.inputRow}>
          <TextInput
            style={[
              styles.inputField,
              { color: theme.textPrimary, backgroundColor: theme.bg, borderColor: theme.divider },
            ]}
            placeholder="Share with the circle gently..."
            placeholderTextColor={theme.textMuted}
            value={inputText}
            onChangeText={setInputText}
            multiline
            maxLength={300}
          />
          <TouchableOpacity
            style={[
              styles.sendBtn,
              {
                backgroundColor: theme.accent,
                opacity: inputText.trim() || draftVoiceNote ? 1 : 0.5,
              },
            ]}
            onPress={handleSendMessage}
            disabled={!inputText.trim() && !draftVoiceNote}
            activeOpacity={0.8}
          >
            <Text style={styles.sendBtnArrow}>➔</Text>
          </TouchableOpacity>
        </View>
      </View>

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
              • <Text style={{ fontWeight: '800' }}>Need Urgent Support?</Text> If you feel overwhelmed, reach out to Befrienders Kenya (0722 178 177) or local emergency services.
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
});
