// src/features/community/identity/LgbtqSpaceView.jsx
import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  TouchableOpacity,
  ScrollView,
  Image,
  StyleSheet,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../../../theme/ThemeContext';
import { COMPANION_MAP } from '../../../constants/companions';


const SANCTUARY_GUIDELINES = [
  {
    title: 'Confidentiality & Discretion',
    detail: 'What is shared in this sanctuary stays here. Never screenshot, out, or share another member’s story outside this space.',
  },
  {
    title: 'Affirmation Over Debate',
    detail: 'Respect every identity, pronoun, and lived experience. No invalidation, debating people’s existence, or unsolicited lecturing.',
  },
  {
    title: 'Protect Your Privacy',
    detail: 'Keep yourself safe—do not post phone numbers, social handles, workplaces, or exact real-world locations.',
  },
  {
    title: 'Honor Emotional Boundaries',
    detail: 'Check tone tags before replying—if someone asks for quiet listening or no advice, offer warmth without fixing.',
  },
];

const SANCTUARY_TAGS = [
  'Just venting · no advice',
  'Seeking gentle encouragement',
  'Quiet listener',
  'Chosen family & joy',
  'Boundaries & rest',
];

const DAILY_SANCTUARY_PROMPTS = [
  'What is one thing that brought you ease, joy, or breathing room today?',
  'Where do you feel most like yourself right now—even in small, quiet ways?',
  'What boundary or rest practice has been protecting your peace lately?',
  'If a friend in this room needed a reminder of their worth today, what would you tell them?',
];

const SANCTUARY_REACTIONS = [
  { key: 'affirm', label: 'Holding space 🕯️' },
  { key: 'seen', label: 'I see you 🌷' },
  { key: 'strength', label: 'Gentle strength 🌱' },
];

const SEED_SANCTUARY_NOTES = [
  {
    id: 'lgbtq-note-1',
    authorId: 'peer-sasha',
    authorHandle: 'Sasha',
    tag: 'Boundaries & rest',
    body: 'Spent the evening setting a quiet boundary around draining conversations. Protecting my peace is starting to feel less like guilt and more like care.',
    timeLabel: '22m ago',
    reactions: { affirm: true, strength: true },
  },
  {
    id: 'lgbtq-note-2',
    authorId: 'peer-devon',
    authorHandle: 'Devon',
    tag: 'Chosen family & joy',
    body: 'Grateful for even small digital corners where you do not have to translate your existence or brace for pushback. Wishing everyone a restful night.',
    timeLabel: '1h ago',
    reactions: { seen: true, affirm: true },
  },
];

const getDailySanctuaryPrompt = () => {
  const todayKey = new Date().toISOString().slice(0, 10);
  const seed = [...todayKey].reduce((sum, ch) => sum + ch.charCodeAt(0), 0);
  return DAILY_SANCTUARY_PROMPTS[seed % DAILY_SANCTUARY_PROMPTS.length];
};

const getCompanion = (index) => {
  const list = Array.isArray(COMPANION_MAP)
    ? COMPANION_MAP
    : Object.values(COMPANION_MAP || {});
  return list[index % list.length] || { accent: theme.accentSoft, image: null };
};

export const LgbtqSpaceView = ({
  space,
  joined = false,
  onToggleJoin,
  safetyAcknowledged = true,
  onAcknowledgeSafety,
  blockedAuthorIds = [],
  onBlockAuthor,
}) => {
  const { theme } = useTheme();
  const baseFont = theme.fontFamily ? { fontFamily: theme.fontFamily } : null;
  const scrollRef = useRef(null);

  const spaceId = space?.id || 'lgbtq-community';
  const storageKey = `mindbloom:community:lgbtq:${spaceId}:v1`;
  const dailyPrompt = useMemo(() => getDailySanctuaryPrompt(), []);

  const [notes, setNotes] = useState(SEED_SANCTUARY_NOTES);
  const [reportedIds, setReportedIds] = useState([]);
  //const [guidelinesOpen, setGuidelinesOpen] = useState(false);
  const [selectedTag, setSelectedTag] = useState(SANCTUARY_TAGS[0]);
  const [draftBody, setDraftBody] = useState('');
  const [menuNoteId, setMenuNoteId] = useState(null);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(storageKey);
        if (!active || !raw) return;
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed.notes) && parsed.notes.length > 0) {
          setNotes(parsed.notes);
        }
      } catch {}
    })();
    return () => {
      active = false;
    };
  }, [storageKey]);

  const persistNotes = async (nextNotes) => {
    setNotes(nextNotes);
    try {
      await AsyncStorage.setItem(storageKey, JSON.stringify({ notes: nextNotes }));
    } catch {}
  };

  const handleJoinAndEnter = () => {
    onToggleJoin?.(space?.id || spaceId);
    setTimeout(() => {
      scrollRef.current?.scrollTo({ y: 0, animated: true });
    }, 100);
  };

  const handleSendNote = async () => {
    const clean = draftBody.trim();
    if (!clean || !safetyAcknowledged) return;

    const entry = {
      id: `lgbtq-note-${Date.now()}`,
      authorId: 'me-local',
      authorHandle: 'You',
      tag: selectedTag,
      body: clean,
      timeLabel: 'Just now',
      reactions: {},
    };
    //That's already fine for single sends, 
    // just make sure persistNotes is called once per send 
    // and 
    // draftBody is cleared right after.
    //const nextNotes = [...notes, entry];
    //await persistNotes(nextNotes);
    await persistNotes([...notes, entry]);
    setDraftBody('');
  };

  const toggleReaction = async (noteId, key) => {
    const nextNotes = notes.map((n) => {
      if (n.id !== noteId) return n;
      return {
        ...n,
        reactions: {
          ...n.reactions,
          [key]: !n.reactions?.[key],
        },
      };
    });
    await persistNotes(nextNotes);
  };

  const visibleNotes = useMemo(
    () =>
      notes.filter(
        (n) =>
          !blockedAuthorIds.includes(n.authorId) &&
          !reportedIds.includes(n.id)
      ),
    [notes, blockedAuthorIds, reportedIds]
  );

  if (!joined) {
    return (
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        <View
          style={[
            styles.welcomeCard,
            { backgroundColor: theme.heroBg, borderColor: theme.heroBorder },
          ]}
        >
          <Text style={[styles.kicker, baseFont, { color: theme.accent }]}>
            LGBTQ+ WELLNESS SANCTUARY
          </Text>
          <Text style={[styles.welcomeTitle, baseFont, { color: theme.textPrimary }]}>
            A calm, affirming space to rest and be yourself
          </Text>
          <Text style={[styles.descText, baseFont, { color: theme.textSecondary }]}>
            {space?.description ||
              'Connect with peers around emotional wellbeing, chosen community, boundaries, and everyday affirmation at your own pace.'}
          </Text>

          {/* Sanctuary Care Guidelines Card */}
          <View
            style={[
              styles.guidelineGateBox,
              { backgroundColor: theme.cardBg, borderColor: theme.divider },
            ]}
          >
            <Text style={[styles.guidelineGateHeader, baseFont, { color: theme.accent }]}>
              SANCTUARY CARE GUIDELINES
            </Text>
            {SANCTUARY_GUIDELINES.map((item) => (
              <View key={item.title} style={styles.guidelineItem}>
                <Text style={[styles.guidelineTitle, baseFont, { color: theme.textPrimary }]}>
                  • {item.title}
                </Text>
                <Text style={[styles.guidelineDetail, baseFont, { color: theme.textSecondary }]}>
                  {item.detail}
                </Text>
              </View>
            ))}
          </View>

          <Pressable
            accessibilityRole="button"
            onPress={handleJoinAndEnter}
            style={[styles.enterBtn, { backgroundColor: theme.accent }]}
          >
            <Text style={[styles.enterBtnText, baseFont, { color: theme.bg }]}>
              Agree & Enter Sanctuary
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    );
  }

  return (
    <ScrollView
      ref={scrollRef}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.scroll}
    >
      {/* Active Sanctuary Header */}
      <View
        style={[
          styles.statusBar,
          { backgroundColor: theme.heroBg, borderColor: theme.heroBorder },
        ]}
      >
        <View style={styles.statusTextCol}>
          <Text style={[styles.kicker, baseFont, { color: theme.accent }]}>
            LGBTQ+ WELLNESS SANCTUARY
          </Text>
          <Text style={[styles.descText, baseFont, { color: theme.textPrimary }]}>
            {space?.description ||
              'A supportive, affirming circle focused on rest, belonging, and everyday emotional wellbeing.'}
          </Text>
        </View>

        {onToggleJoin && (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Leave sanctuary"
            onPress={() => onToggleJoin(space?.id || spaceId)}
            style={[
              styles.leaveBtn,
              { backgroundColor: theme.cardBg, borderColor: theme.divider },
            ]}
          >
            <Text style={[styles.leaveText, baseFont, { color: theme.textSecondary }]}>
              Leave
            </Text>
          </Pressable>
        )}
      </View>

      {/* Sanctuary Circle Thread */}
      <View
        style={[
          styles.sectionCard,
          { backgroundColor: theme.cardBg, borderColor: theme.divider },
        ]}
      >
        <Text style={[styles.sectionLabel, baseFont, { color: theme.textSecondary }]}>
          SANCTUARY CIRCLE · {visibleNotes.length} CHECK-INS
        </Text>

        {/* Automated Daily Reflection Prompt */}
        <View
          style={[
            styles.promptBox,
            { backgroundColor: theme.bg, borderColor: theme.divider },
          ]}
        >
          <Text style={[styles.promptLabel, baseFont, { color: theme.accent }]}>
            TODAY’S REFLECTION
          </Text>
          <Text style={[styles.promptText, baseFont, { color: theme.textPrimary }]}>
            {dailyPrompt}
          </Text>
        </View>

        <View
          style={[
            styles.chatThread,
            { backgroundColor: theme.bg, borderColor: theme.divider },
          ]}
        >
          {visibleNotes.length === 0 ? (
            <Text style={[styles.emptyText, baseFont, { color: theme.textSecondary }]}>
              The sanctuary is quiet right now—share whenever you’re ready.
            </Text>
          ) : (
            visibleNotes.map((note, idx) => {
              const isMine = note.authorId === 'me-local';
              const comp = getCompanion(idx);
              const menuOpen = menuNoteId === note.id;

              return (
                <View
                  key={note.id}
                  style={[
                    styles.msgRow,
                    isMine ? styles.msgRowRight : styles.msgRowLeft,
                  ]}
                >
                  {!isMine && (
                    <View
                      style={[
                        styles.chatAvatar,
                        { backgroundColor: comp.accent || theme.accentSoft },
                      ]}
                    >
                      <Image
                        source={comp.image}
                        style={styles.chatAvatarImg}
                        resizeMode="cover"
                      />
                    </View>
                  )}

                  <View
                    style={[
                      styles.bubble,
                      {
                        backgroundColor: isMine ? theme.navActive : theme.cardBg,
                        borderColor: isMine ? theme.accent : theme.divider,
                      },
                    ]}
                  >
                    <View style={styles.bubbleHead}>
                      <View style={styles.authorMeta}>
                        <Text style={[styles.authorName, baseFont, { color: theme.textPrimary }]}>
                          {note.authorHandle}
                        </Text>
                        {!!note.tag && (
                          <Text style={[styles.tagSub, baseFont, { color: theme.accent }]}>
                            · {note.tag}
                          </Text>
                        )}
                      </View>

                      <Pressable
                        onPress={() => setMenuNoteId(menuOpen ? null : note.id)}
                        hitSlop={8}
                      >
                        <Text style={[styles.dots, baseFont, { color: theme.textSecondary }]}>
                          {menuOpen ? '×' : '•••'}
                        </Text>
                      </Pressable>
                    </View>

                    {menuOpen && (
                      <View style={styles.menuActions}>
                        <Pressable
                          onPress={() => {
                            setReportedIds((prev) => [...prev, note.id]);
                            setMenuNoteId(null);
                          }}
                          style={[styles.menuChip, { borderColor: theme.accent }]}
                        >
                          <Text style={[styles.menuChipText, baseFont, { color: theme.accent }]}>
                            Report
                          </Text>
                        </Pressable>
                        <Pressable
                          onPress={() => {
                            onBlockAuthor?.(note.authorId);
                            setMenuNoteId(null);
                          }}
                          style={[styles.menuChip, { borderColor: theme.divider }]}
                        >
                          <Text style={[styles.menuChipText, baseFont, { color: theme.textSecondary }]}>
                            Block
                          </Text>
                        </Pressable>
                      </View>
                    )}

                    <Text style={[styles.bubbleText, baseFont, { color: theme.textPrimary }]}>
                      {note.body}
                    </Text>

                    <View style={styles.bubbleFoot}>
                      <View style={styles.reactWrap}>
                        {SANCTUARY_REACTIONS.map((r) => {
                          const active = !!note.reactions?.[r.key];
                          return (
                            <Pressable
                              key={r.key}
                              onPress={() => toggleReaction(note.id, r.key)}
                              style={[
                                styles.reactTag,
                                {
                                  backgroundColor: active ? theme.accentSoft : 'transparent',
                                  borderColor: active ? theme.accent : theme.divider,
                                },
                              ]}
                            >
                              <Text
                                style={[
                                  styles.reactTagText,
                                  baseFont,
                                  { color: active ? theme.textPrimary : theme.textSecondary },
                                ]}
                              >
                                {r.label}
                              </Text>
                            </Pressable>
                          );
                        })}
                      </View>
                      <Text style={[styles.timeText, baseFont, { color: theme.textSecondary }]}>
                        {note.timeLabel}
                      </Text>
                    </View>
                  </View>
                </View>
              );
            })
          )}
        </View>

        {!safetyAcknowledged ? (
          <View
            style={[
              styles.safetyNotice,
              { backgroundColor: theme.bg, borderColor: theme.accent },
            ]}
          >
            <Text style={[styles.mutedTiny, baseFont, { color: theme.textPrimary }]}>
              Keep this sanctuary affirming and private—treat every member with care and do not share personal contact details or exact locations.
            </Text>
            <Pressable
              onPress={onAcknowledgeSafety}
              style={[styles.primaryPillBtn, { backgroundColor: theme.accent, alignSelf: 'flex-start' }]}
            >
              <Text style={[styles.primaryPillText, baseFont, { color: theme.bg }]}>
                Acknowledge & enable chat
              </Text>
            </Pressable>
          </View>
        ) : (
          <View
            style={[
              styles.composerBar,
              { backgroundColor: theme.bg, borderColor: theme.divider },
            ]}
          >
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.tagRow}
            >
              {SANCTUARY_TAGS.map((tag) => {
                const selected = selectedTag === tag;
                return (
                  <TouchableOpacity
                    key={tag}
                    onPress={() => setSelectedTag(tag)}
                    style={[
                      styles.tagPill,
                      {
                        backgroundColor: selected ? theme.accentSoft : theme.cardBg,
                        borderColor: selected ? theme.accent : theme.divider,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.tagPillText,
                        baseFont,
                        { color: selected ? theme.textPrimary : theme.textSecondary },
                      ]}
                    >
                      {tag}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            <View style={styles.inputRow}>
              <TextInput
                value={draftBody}
                onChangeText={setDraftBody}
                placeholder="Share what is on your mind or how you’re resting…"
                placeholderTextColor={theme.textMuted}
                maxLength={320}
                multiline
                style={[
                  styles.chatInput,
                  baseFont,
                  {
                    color: theme.textPrimary,
                    backgroundColor: theme.cardBg,
                    borderColor: theme.divider,
                  },
                ]}
              />
              <Pressable
                disabled={!draftBody.trim()}
                onPress={handleSendNote}
                style={[
                  styles.sendBtn,
                  { backgroundColor: theme.accent },
                  !draftBody.trim() && styles.dimmed,
                ]}
              >
                <Text style={[styles.sendIcon, baseFont, { color: theme.bg }]}>→</Text>
              </Pressable>
            </View>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scroll: {
    gap: 18,
    paddingBottom: 32,
  },
  welcomeCard: {
    borderWidth: 1,
    borderRadius: 22,
    padding: 20,
    gap: 14,
  },
  welcomeTitle: {
    fontSize: 20,
    fontWeight: '800',
    lineHeight: 26,
  },
  guidelineGateBox: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 14,
    gap: 10,
  },
  guidelineGateHeader: {
    fontSize: 10.5,
    fontWeight: '800',
    letterSpacing: 0.7,
  },
  guidelineBanner: {
    borderWidth: 1,
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 10,
  },
  guidelineList: {
    gap: 10,
    paddingTop: 2,
  },
  guidelineItem: {
    gap: 2,
  },
  guidelineTitle: {
    fontSize: 13,
    fontWeight: '700',
  },
  guidelineDetail: {
    fontSize: 12.5,
    fontWeight: '500',
    lineHeight: 18,
    paddingLeft: 10,
  },
  enterBtn: {
    marginTop: 4,
    borderRadius: 999,
    paddingVertical: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  enterBtnText: {
    fontSize: 14.5,
    fontWeight: '800',
  },
  statusBar: {
    borderWidth: 1,
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  statusTextCol: {
    flex: 1,
    gap: 4,
  },
  kicker: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.7,
  },
  descText: {
    fontSize: 13.5,
    fontWeight: '500',
    lineHeight: 19,
  },
  leaveBtn: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  leaveText: {
    fontSize: 12,
    fontWeight: '600',
  },
  sectionCard: {
    borderWidth: 1,
    borderRadius: 22,
    padding: 18,
    gap: 14,
  },
  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.7,
  },
  actionLink: {
    fontSize: 12.5,
    fontWeight: '700',
  },
  promptBox: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 12,
    gap: 6,
  },
  promptLabel: {
    fontSize: 10.5,
    fontWeight: '800',
    letterSpacing: 0.6,
  },
  promptText: {
    fontSize: 13.5,
    fontWeight: '500',
    lineHeight: 19,
  },
  chatThread: {
    borderWidth: 1,
    borderRadius: 18,
    padding: 14,
    gap: 14,
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 13,
    fontWeight: '500',
    paddingVertical: 10,
  },
  msgRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
  },
  msgRowLeft: {
    justifyContent: 'flex-start',
  },
  msgRowRight: {
    justifyContent: 'flex-end',
  },
  chatAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  chatAvatarImg: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },
  bubble: {
    maxWidth: '84%',
    borderWidth: 1,
    borderRadius: 16,
    padding: 12,
    gap: 8,
  },
  bubbleHead: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  authorMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 4,
    flex: 1,
  },
  authorName: {
    fontSize: 12.5,
    fontWeight: '700',
  },
  tagSub: {
    fontSize: 11.5,
    fontWeight: '600',
  },
  dots: {
    fontSize: 13,
    fontWeight: '700',
  },
  menuActions: {
    flexDirection: 'row',
    gap: 8,
  },
  menuChip: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  menuChipText: {
    fontSize: 11.5,
    fontWeight: '700',
  },
  bubbleText: {
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 20,
  },
  bubbleFoot: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 6,
  },
  reactWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  reactTag: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 9,
    paddingVertical: 4,
  },
  reactTagText: {
    fontSize: 11.5,
    fontWeight: '600',
  },
  timeText: {
    fontSize: 11,
    fontWeight: '500',
  },
  mutedTiny: {
    fontSize: 12.5,
    fontWeight: '500',
    lineHeight: 18,
  },
  primaryPillBtn: {
    borderRadius: 999,
    paddingHorizontal: 15,
    paddingVertical: 8,
  },
  primaryPillText: {
    fontSize: 12.5,
    fontWeight: '700',
  },
  safetyNotice: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 14,
    gap: 10,
  },
  composerBar: {
    borderWidth: 1,
    borderRadius: 18,
    padding: 12,
    gap: 8,
  },
  tagRow: {
    flexDirection: 'row',
    gap: 6,
    paddingBottom: 2,
  },
  tagPill: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  tagPillText: {
    fontSize: 11.5,
    fontWeight: '600',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
  },
  chatInput: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 9,
    fontSize: 13.5,
    fontWeight: '500',
    maxHeight: 90,
  },
  sendBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendIcon: {
    fontSize: 16,
    fontWeight: '800',
  },
  dimmed: {
    opacity: 0.4,
  },
});