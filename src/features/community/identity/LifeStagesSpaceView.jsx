// src/features/community/lifestages/LifeStagesSpaceView.jsx
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

const COMPANION_KEYS = Object.keys(COMPANION_MAP);
const getCompanion = (idx) =>
  COMPANION_MAP[COMPANION_KEYS[idx % COMPANION_KEYS.length]] || COMPANION_MAP.noodle;

const LIFE_STAGE_SEASONS = [
  { key: 'all', label: 'All seasons' },
  { key: 'early-career', label: 'Early career & 20s' },
  { key: 'parenting-care', label: 'Parenting & caregiving' },
  { key: 'pivot-midlife', label: 'Career & life pivots' },
  { key: 'later-chapters', label: 'Empty nest & later chapters' },
];

const SEASON_COMFORT_TAGS = [
  'Navigating a transition',
  'Feeling behind',
  'Need perspective',
  'Celebrating a small win',
  'Just venting · no fixing',
];

const DAILY_SEASON_PROMPTS = [
  'What part of your current life stage feels heavier—or quieter—than people around you realize?',
  'What old timeline or expectation are you slowly giving yourself permission to let go of?',
  'What is one small win from this week that deserves acknowledgment, even if nobody else saw it?',
  'If you could offer one sentence of kindness to someone entering your exact season, what would it be?',
  'How are you pacing yourself right now when everything around you feels like a rush?',
];

const SEASON_REACTIONS = [
  { key: 'relate', label: 'In this season too 🌿' },
  { key: 'wisdom', label: 'Needed this 🕯️' },
  { key: 'cheer', label: 'Proud of you ✨' },
];

const SEED_SEASON_REMINDERS = [
  {
    id: 'rem-1',
    season: 'early-career',
    seasonLabel: 'Early career & 20s',
    reminder: 'Nobody actually has their five-year plan figured out in year one—learning what drains you is still real progress.',
    author: 'Tariq',
  },
  {
    id: 'rem-2',
    season: 'parenting-care',
    seasonLabel: 'Parenting & caregiving',
    reminder: 'Rest is not something you earn after the to-do list ends; caring for others requires pacing your own energy first.',
    author: 'Wanjiku',
  },
  {
    id: 'rem-3',
    season: 'pivot-midlife',
    seasonLabel: 'Career & life pivots',
    reminder: 'Starting over in your 30s, 40s, or beyond is not starting from zero—you are starting from lived wisdom.',
    author: 'Daniel',
  },
];

const SEED_SEASON_NOTES = [
  {
    id: 'ls-note-1',
    authorId: 'peer-tariq',
    authorHandle: 'Tariq',
    season: 'early-career',
    tag: 'Feeling behind',
    body: 'Watching peers post big milestones while I am still figuring out basic budgeting and work boundaries can feel heavy. Reminding myself that slow roots still grow.',
    timeLabel: '20m ago',
    reactions: { relate: true, wisdom: true },
  },
  {
    id: 'ls-note-2',
    authorId: 'peer-wanjiku',
    authorHandle: 'Wanjiku',
    season: 'parenting-care',
    tag: 'Celebrating a small win',
    body: 'Finally asked for an hour of quiet help this afternoon instead of trying to carry everything alone. Small step, big relief.',
    timeLabel: '52m ago',
    reactions: { cheer: true, relate: true },
  },
  {
    id: 'ls-note-3',
    authorId: 'peer-daniel',
    authorHandle: 'Daniel',
    season: 'pivot-midlife',
    tag: 'Navigating a transition',
    body: 'Stepping away from a path that no longer fits feels terrifying and freeing at the same time. Grateful for a room that treats transitions with patience.',
    timeLabel: '2h ago',
    reactions: { wisdom: true },
  },
];

const getDailySeasonPrompt = () => {
  const todayKey = new Date().toISOString().slice(0, 10);
  const seed = [...todayKey].reduce((sum, ch) => sum + ch.charCodeAt(0), 0);
  return DAILY_SEASON_PROMPTS[seed % DAILY_SEASON_PROMPTS.length];
};

const getSeasonLabel = (key) =>
  LIFE_STAGE_SEASONS.find((s) => s.key === key)?.label || 'All seasons';

export const LifeStagesSpaceView = ({
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

  const spaceId = space?.id || 'life-stages';
  const storageKey = `mindbloom:community:lifestages:${spaceId}:v1`;
  const dailyPrompt = useMemo(() => getDailySeasonPrompt(), []);

  // Pre-select a season if the space object carries one, otherwise default to 'all'
  const initialSeason = useMemo(() => {
    const candidate = space?.seasonKey || space?.stageKey;
    return LIFE_STAGE_SEASONS.some((s) => s.key === candidate) ? candidate : 'all';
  }, [space?.seasonKey, space?.stageKey]);

  const [selectedSeason, setSelectedSeason] = useState(initialSeason);
  const [reminders, setReminders] = useState(SEED_SEASON_REMINDERS);
  const [notes, setNotes] = useState(SEED_SEASON_NOTES);
  const [reportedIds, setReportedIds] = useState([]);

  // Add Reminder Form
  const [reminderOpen, setReminderOpen] = useState(false);
  const [reminderText, setReminderText] = useState('');
  const [reminderSeason, setReminderSeason] = useState('early-career');

  // Circle Thread Composer
  const [composerSeason, setComposerSeason] = useState('early-career');
  const [selectedTag, setSelectedTag] = useState(SEASON_COMFORT_TAGS[0]);
  const [draftBody, setDraftBody] = useState('');
  const [menuNoteId, setMenuNoteId] = useState(null);

  useEffect(() => {
    setSelectedSeason(initialSeason);
    if (initialSeason !== 'all') {
      setComposerSeason(initialSeason);
      setReminderSeason(initialSeason);
    }
  }, [initialSeason]);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(storageKey);
        if (!active || !raw) return;
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed.reminders) && parsed.reminders.length > 0) {
          setReminders(parsed.reminders);
        }
        if (Array.isArray(parsed.notes) && parsed.notes.length > 0) {
          setNotes(parsed.notes);
        }
      } catch {}
    })();
    return () => {
      active = false;
    };
  }, [storageKey]);

  const persistSpace = async (nextReminders, nextNotes) => {
    setReminders(nextReminders);
    setNotes(nextNotes);
    try {
      await AsyncStorage.setItem(
        storageKey,
        JSON.stringify({ reminders: nextReminders, notes: nextNotes })
      );
    } catch {}
  };

  const handleJoinAndEnter = () => {
    onToggleJoin?.(space?.id || spaceId);
    setTimeout(() => {
      scrollRef.current?.scrollTo({ y: 0, animated: true });
    }, 100);
  };

  const handleSelectSeasonFilter = (key) => {
    setSelectedSeason(key);
    if (key !== 'all') {
      setComposerSeason(key);
      setReminderSeason(key);
    }
  };

  const handleAddReminder = async () => {
    const clean = reminderText.trim();
    if (!clean) return;

    const entry = {
      id: `rem-${Date.now()}`,
      season: reminderSeason,
      seasonLabel: getSeasonLabel(reminderSeason),
      reminder: clean,
      author: 'You',
    };

    await persistSpace([entry, ...reminders].slice(0, 12), notes);
    setReminderText('');
    setReminderOpen(false);
  };

  const handleSendNote = async () => {
    const clean = draftBody.trim();
    if (!clean || !safetyAcknowledged) return;

    const activeSeason = selectedSeason !== 'all' ? selectedSeason : composerSeason;

    const entry = {
      id: `ls-note-${Date.now()}`,
      authorId: 'me-local',
      authorHandle: 'You',
      season: activeSeason,
      tag: selectedTag,
      body: clean,
      timeLabel: 'Just now',
      reactions: {},
    };

    await persistSpace(reminders, [...notes, entry]);
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
    await persistSpace(reminders, nextNotes);
  };

  const visibleReminders = useMemo(
    () =>
      selectedSeason === 'all'
        ? reminders
        : reminders.filter((r) => r.season === selectedSeason),
    [reminders, selectedSeason]
  );

  const visibleNotes = useMemo(
    () =>
      notes.filter(
        (n) =>
          !blockedAuthorIds.includes(n.authorId) &&
          !reportedIds.includes(n.id) &&
          (selectedSeason === 'all' || n.season === selectedSeason)
      ),
    [notes, blockedAuthorIds, reportedIds, selectedSeason]
  );

  // Pre-join gate: sets a comparison-free tone before entering the circle
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
            {space?.title ? `${space.title.toUpperCase()} · CIRCLE` : 'LIFE STAGES · SEASON CIRCLE'}
          </Text>
          <Text style={[styles.welcomeTitle, baseFont, { color: theme.textPrimary }]}>
            Honor the season you are in—without comparison or rush
          </Text>
          <Text style={[styles.descText, baseFont, { color: theme.textSecondary }]}>
            {space?.description ||
              'Connect with peers navigating similar life chapters—from early career and caregiving to midlife pivots and later seasons—in a calm, supportive space.'}
          </Text>

          <View style={styles.highlights}>
            <Text style={[styles.highlightItem, baseFont, { color: theme.textPrimary }]}>
              • Filter by season — find peers in your exact chapter or read across ages
            </Text>
            <Text style={[styles.highlightItem, baseFont, { color: theme.textPrimary }]}>
              • Grounding reminders — lived perspective from people walking similar paths
            </Text>
            <Text style={[styles.highlightItem, baseFont, { color: theme.textPrimary }]}>
              • No timelines or hustle pressure — celebrate small wins or simply exhale
            </Text>
          </View>

          <Pressable
            accessibilityRole="button"
            onPress={handleJoinAndEnter}
            style={[styles.enterBtn, { backgroundColor: theme.accent }]}
          >
            <Text style={[styles.enterBtnText, baseFont, { color: theme.bg }]}>
              Join & Enter Chapter Circle
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
      {/* Active Space Header */}
      <View
        style={[
          styles.statusBar,
          { backgroundColor: theme.heroBg, borderColor: theme.heroBorder },
        ]}
      >
        <View style={styles.statusTextCol}>
          <Text style={[styles.kicker, baseFont, { color: theme.accent }]}>
            LIFE STAGES · SEASON CIRCLE
          </Text>
          <Text style={[styles.descText, baseFont, { color: theme.textPrimary }]}>
            Every chapter moves at its own rhythm. Browse by life stage or share where your feet are today.
          </Text>
        </View>

        {onToggleJoin && (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Leave circle"
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

      {/* Life Stage Filter Pills */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.seasonFilterRow}
      >
        {LIFE_STAGE_SEASONS.map((season) => {
          const selected = selectedSeason === season.key;
          return (
            <Pressable
              key={season.key}
              accessibilityRole="button"
              accessibilityState={{ selected }}
              onPress={() => handleSelectSeasonFilter(season.key)}
              style={[
                styles.seasonPill,
                {
                  backgroundColor: selected ? theme.accent : theme.cardBg,
                  borderColor: selected ? theme.accent : theme.divider,
                },
              ]}
            >
              <Text
                style={[
                  styles.seasonPillText,
                  baseFont,
                  { color: selected ? theme.bg : theme.textSecondary },
                ]}
              >
                {season.label}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      {/* 1. GENTLE REMINDERS FOR THIS SEASON */}
      <View
        style={[
          styles.sectionCard,
          { backgroundColor: theme.cardBg, borderColor: theme.divider },
        ]}
      >
        <View style={styles.rowBetween}>
          <Text style={[styles.sectionLabel, baseFont, { color: theme.textSecondary }]}>
            REMINDERS FOR THIS SEASON · {visibleReminders.length}
          </Text>

          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => setReminderOpen((v) => !v)}
          >
            <Text style={[styles.actionLink, baseFont, { color: theme.accent }]}>
              {reminderOpen ? 'Close' : '+ Share reminder'}
            </Text>
          </TouchableOpacity>
        </View>

        {reminderOpen && (
          <View
            style={[
              styles.reminderForm,
              { backgroundColor: theme.bg, borderColor: theme.divider },
            ]}
          >
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.tagRow}
            >
              {LIFE_STAGE_SEASONS.filter((s) => s.key !== 'all').map((s) => {
                const selected = reminderSeason === s.key;
                return (
                  <Pressable
                    key={s.key}
                    onPress={() => setReminderSeason(s.key)}
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
                      {s.label}
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>

            <TextInput
              value={reminderText}
              onChangeText={setReminderText}
              placeholder="A gentle lesson or reassurance for someone in this season…"
              placeholderTextColor={theme.textMuted}
              maxLength={180}
              multiline
              style={[
                styles.inputField,
                baseFont,
                {
                  color: theme.textPrimary,
                  backgroundColor: theme.cardBg,
                  borderColor: theme.divider,
                },
              ]}
            />

            <TouchableOpacity
              activeOpacity={0.85}
              disabled={!reminderText.trim()}
              onPress={handleAddReminder}
              style={[
                styles.primaryPillBtn,
                { backgroundColor: theme.accent, alignSelf: 'flex-end' },
                !reminderText.trim() && styles.dimmed,
              ]}
            >
              <Text style={[styles.primaryPillText, baseFont, { color: theme.bg }]}>
                Add to shelf
              </Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.reminderList}>
          {visibleReminders.length === 0 ? (
            <Text style={[styles.emptyText, baseFont, { color: theme.textSecondary }]}>
              No reminders pinned for this season yet—share one above.
            </Text>
          ) : (
            visibleReminders.map((item) => (
              <View
                key={item.id}
                style={[
                  styles.reminderCard,
                  { backgroundColor: theme.bg, borderColor: theme.divider },
                ]}
              >
                <View style={styles.rowBetween}>
                  <View
                    style={[
                      styles.seasonBadge,
                      { backgroundColor: theme.accentSoft, borderColor: theme.divider },
                    ]}
                  >
                    <Text style={[styles.seasonBadgeText, baseFont, { color: theme.textPrimary }]}>
                      {item.seasonLabel || getSeasonLabel(item.season)}
                    </Text>
                  </View>
                  <Text style={[styles.timeText, baseFont, { color: theme.textSecondary }]}>
                    — {item.author}
                  </Text>
                </View>

                <Text style={[styles.reminderBody, baseFont, { color: theme.textPrimary }]}>
                  “{item.reminder}”
                </Text>
              </View>
            ))
          )}
        </View>
      </View>

      {/* 2. CHAPTER CIRCLE CHECK-INS */}
      <View
        style={[
          styles.sectionCard,
          { backgroundColor: theme.cardBg, borderColor: theme.divider },
        ]}
      >
        <Text style={[styles.sectionLabel, baseFont, { color: theme.textSecondary }]}>
          CHAPTER CIRCLE · {visibleNotes.length} CHECK-INS
        </Text>

        {/* Automated Daily Season Prompt */}
        <View
          style={[
            styles.promptBox,
            { backgroundColor: theme.bg, borderColor: theme.divider },
          ]}
        >
          <Text style={[styles.promptLabel, baseFont, { color: theme.accent }]}>
            TODAY’S SEASON CHECK-IN
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
              No check-ins in this season yet—share how your week is unfolding.
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

                    {selectedSeason === 'all' && !!note.season && (
                      <Text style={[styles.seasonSubline, baseFont, { color: theme.textSecondary }]}>
                        {getSeasonLabel(note.season)}
                      </Text>
                    )}

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
                        {SEASON_REACTIONS.map((r) => {
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
              Honor every life stage without comparison or unsolicited advice, and avoid sharing private contact info.
            </Text>
            <Pressable
              onPress={onAcknowledgeSafety}
              style={[styles.primaryPillBtn, { backgroundColor: theme.accent, alignSelf: 'flex-start' }]}
            >
              <Text style={[styles.primaryPillText, baseFont, { color: theme.bg }]}>
                Enable circle chat
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
            {selectedSeason === 'all' && (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.tagRow}
              >
                {LIFE_STAGE_SEASONS.filter((s) => s.key !== 'all').map((s) => {
                  const selected = composerSeason === s.key;
                  return (
                    <TouchableOpacity
                      key={s.key}
                      onPress={() => setComposerSeason(s.key)}
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
                        {s.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            )}

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.tagRow}
            >
              {SEASON_COMFORT_TAGS.map((tag) => {
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
                placeholder="Share what this season feels like for you…"
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
  highlights: {
    gap: 8,
    marginTop: 2,
  },
  highlightItem: {
    fontSize: 13.5,
    fontWeight: '500',
    lineHeight: 19,
  },
  enterBtn: {
    marginTop: 6,
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
  seasonFilterRow: {
    flexDirection: 'row',
    gap: 8,
    paddingVertical: 2,
  },
  seasonPill: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 13,
    paddingVertical: 7,
  },
  seasonPillText: {
    fontSize: 12,
    fontWeight: '700',
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
  reminderForm: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 12,
    gap: 8,
  },
  inputField: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 9,
    fontSize: 13.5,
    fontWeight: '500',
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
  reminderList: {
    gap: 10,
  },
  reminderCard: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 14,
    gap: 8,
  },
  seasonBadge: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  seasonBadgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  reminderBody: {
    fontSize: 13.5,
    fontWeight: '500',
    lineHeight: 19,
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
  seasonSubline: {
    fontSize: 11,
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