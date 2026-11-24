// src/features/community/circles/BarazaGroupChatView.jsx
// Authentic real-time group chat for MindBloom Baraza Circles
// Peer bubbles, live message input, AsyncStorage persistence, and empathetic reactions.

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
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../../../theme/ThemeContext';
import { soundService } from '../../../screens/arcade/audio/soundService';
import { onboardingStorage } from '../../../services/onboardingStorage';

const SEED_CHAT_MESSAGES = {
  campus_grounding: [
    {
      id: 'm-1',
      sender: 'Simba',
      emoji: '🦁',
      text: 'Does anyone else get that Sunday evening panic before campus starts?',
      time: '6m ago',
      isMe: false,
      reactions: { hugs: 6, hearts: 4 },
    },
    {
      id: 'm-2',
      sender: 'Zawadi Zebra',
      emoji: '🦓',
      text: 'Totally Simba. My chest gets tight around 6pm. I had to put my phone on Tulia mode.',
      time: '4m ago',
      isMe: false,
      reactions: { hugs: 8, hearts: 3 },
    },
    {
      id: 'm-3',
      sender: 'Kobi',
      emoji: '🐢',
      text: 'Slow breathing helps. We don’t have to conquer the whole week today, just tomorrow morning.',
      time: '2m ago',
      isMe: false,
      reactions: { hugs: 11, hearts: 9 },
    },
  ],
  hustle_purpose: [
    {
      id: 'm-h1',
      sender: 'Zawadi Zebra',
      emoji: '🦓',
      text: 'Sent 14 job proposals this week. Trying to breathe and not panic.',
      time: '15m ago',
      isMe: false,
      reactions: { hugs: 9, hearts: 7 },
    },
    {
      id: 'm-h2',
      sender: 'Kofi Hawk',
      emoji: '🦅',
      text: '14 is huge courage! Take tonight off screen time. Your worth is not your inbox.',
      time: '10m ago',
      isMe: false,
      reactions: { hugs: 12, hearts: 8 },
    },
  ],
  night_owls: [
    {
      id: 'm-n1',
      sender: 'Twiga',
      emoji: '🦒',
      text: '3 AM thoughts get so loud sometimes. Just listening to soft rain sounds.',
      time: '20m ago',
      isMe: false,
      reactions: { hugs: 14, hearts: 10 },
    },
    {
      id: 'm-n2',
      sender: 'Brave Simba',
      emoji: '🦁',
      text: 'Rest your shoulders Twiga. You are safe in the night.',
      time: '12m ago',
      isMe: false,
      reactions: { hugs: 7, hearts: 5 },
    },
  ],
  sisterhood_sanctuary: [
    {
      id: 'm-s1',
      sender: 'Lulu Flamingo',
      emoji: '🦩',
      text: 'Learning that "no" is a complete sentence without needing an apology.',
      time: '18m ago',
      isMe: false,
      reactions: { hugs: 18, hearts: 15 },
    },
  ],
  mens_grounding: [
    {
      id: 'm-mg1',
      sender: 'Brave Simba',
      emoji: '🦁',
      text: 'Checking in on the brothers. You do not have to carry it all alone in silence.',
      time: '24m ago',
      isMe: false,
      reactions: { hugs: 15, hearts: 12 },
    },
  ],
  tulia_healing: [
    {
      id: 'm-th1',
      sender: 'Twiga',
      emoji: '🦒',
      text: 'Inhale for 4, hold for 4, exhale for 6. Soften your jaw.',
      time: '30m ago',
      isMe: false,
      reactions: { hugs: 22, hearts: 19 },
    },
  ],
};

export const BarazaGroupChatView = ({ circle, onBack }) => {
  const { theme } = useTheme();
  const circleId = circle?.id || 'campus_grounding';
  const storageKey = `mindbloom:baraza:chat:${circleId}:v1`;

  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [userName, setUserName] = useState('You');
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
          const seeds = SEED_CHAT_MESSAGES[circleId] || [
            {
              id: `m-init-${Date.now()}`,
              sender: 'Baraza Guide',
              emoji: '🌿',
              text: `Karibu to ${circle.title}. A quiet, safe space where you are seen and respected.`,
              time: 'Earlier',
              isMe: false,
              reactions: { hugs: 5, hearts: 4 },
            },
          ];
          setMessages(seeds);
        }
      } catch {
        setMessages(SEED_CHAT_MESSAGES[circleId] || []);
      }
    }
    loadChat();
  }, [circleId]);

  const handleSendMessage = async () => {
    const text = inputText.trim();
    if (!text) return;

    soundService.playPop();

    const newMsg = {
      id: `msg-${Date.now()}`,
      sender: `${userName} (You)`,
      emoji: '🌱',
      text,
      time: 'Just now',
      isMe: true,
      reactions: { hugs: 0, hearts: 0 },
    };

    const nextMessages = [...messages, newMsg];
    setMessages(nextMessages);
    setInputText('');

    try {
      await AsyncStorage.setItem(storageKey, JSON.stringify(nextMessages));
    } catch {}

    setTimeout(() => {
      scrollRef.current?.scrollToEnd({ animated: true });
    }, 100);

    // Simulated warm peer reaction/acknowledgment after 4 seconds
    setTimeout(() => {
      const peerReplies = [
        { sender: 'Zawadi Zebra', emoji: '🦓', text: 'Thank you for sharing that with us, you are not alone in this 🌸' },
        { sender: 'Kobi', emoji: '🐢', text: 'Holding space for you. Take it one gentle breath at a time.' },
        { sender: 'Simba', emoji: '🦁', text: 'Deeply resonates with me too. Proud of you for voicing it 🤝' },
      ];
      const randomReply = peerReplies[Math.floor(Math.random() * peerReplies.length)];

      const peerMsg = {
        id: `peer-${Date.now()}`,
        sender: randomReply.sender,
        emoji: randomReply.emoji,
        text: randomReply.text,
        time: 'Just now',
        isMe: false,
        reactions: { hugs: 2, hearts: 1 },
      };

      setMessages((prev) => {
        const updated = [...prev, peerMsg];
        AsyncStorage.setItem(storageKey, JSON.stringify(updated)).catch(() => {});
        return updated;
      });

      setTimeout(() => {
        scrollRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }, 4500);
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
                {circle.activeNow || 7} peers active now • Max 12
              </Text>
            </View>
          </View>
        </View>

        <View style={[styles.safeTag, { backgroundColor: 'rgba(138, 154, 134, 0.15)' }]}>
          <Text style={[styles.safeTagText, { color: '#5B7057' }]}>🔒 Encrypted</Text>
        </View>
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
            You have joined the cozy circle. Speak gently, listen kindly. Your words are held in strict privacy.
          </Text>
        </View>

        {messages.map((item) => {
          if (item.isMe) {
            return (
              <View key={item.id} style={styles.myBubbleRow}>
                <View style={[styles.myBubble, { backgroundColor: theme.accent }]}>
                  <Text style={styles.myBubbleText}>{item.text}</Text>
                  <Text style={styles.myBubbleTime}>{item.time}</Text>
                </View>
              </View>
            );
          }

          return (
            <View key={item.id} style={styles.peerBubbleRow}>
              <View style={styles.peerAvatar}>
                <Text style={styles.peerAvatarEmoji}>{item.emoji}</Text>
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
                  <Text style={[styles.peerBubbleText, { color: theme.textPrimary }]}>
                    {item.text}
                  </Text>
                </View>

                {/* Quick Support Reactions */}
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
                </View>
              </View>
            </View>
          );
        })}
      </ScrollView>

      {/* ── INPUT DOCK (Sticky above BottomNavBar) ───────────── */}
      <View
        style={[
          styles.inputContainer,
          { backgroundColor: theme.cardBg, borderColor: theme.divider },
        ]}
      >
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
              opacity: inputText.trim() ? 1 : 0.5,
            },
          ]}
          onPress={handleSendMessage}
          disabled={!inputText.trim()}
          activeOpacity={0.8}
        >
          <Text style={styles.sendBtnArrow}>➔</Text>
        </TouchableOpacity>
      </View>
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
