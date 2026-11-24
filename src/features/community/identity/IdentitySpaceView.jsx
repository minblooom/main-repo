// src/features/community/identity/IdentitySpaceView.jsx
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
import { NewToTheCityView } from './NewToTheCityView';
import { LgbtqSpaceView } from './LgbtqSpaceView';
import { LifeStagesSpaceView } from './LifeStagesSpaceView';

const COMPANION_KEYS = Object.keys(COMPANION_MAP);
const getCompanion = (idx) =>
  COMPANION_MAP[COMPANION_KEYS[idx % COMPANION_KEYS.length]] || COMPANION_MAP.noodle;

const COMFORT_TAGS = [
  'Code-switching welcome',
  'Home language',
  'Untranslatable feeling',
  'Between two cultures',
  'Quiet listener',
  'Shared roots',
];

const DAILY_CULTURAL_PROMPTS = [
  'What is a word or proverb in your home language that captures a feeling English misses?',
  'What cultural ritual, meal, or song helps you feel grounded when life gets overwhelming?',
  'How do you care for yourself when navigating expectations between home and the outside world?',
  'Share a blessing or phrase of encouragement you grew up hearing.',
];

const HEARTH_REACTIONS = [
  { key: 'felt', label: 'I feel this 🤝' },
  { key: 'warmth', label: 'Warmth 🪔' },
  { key: 'gratitude', label: 'Asante 🌿' },
];

const SEED_PHRASES = [
  {
    id: 'ph-1',
    phrase: 'Pole pole ndio mwendo',
    language: 'Kiswahili',
    pronunciation: 'Poh-leh poh-leh n-dee-oh mwen-doh',
    meaning: 'Slowly, slowly is the way—a reminder not to rush your healing.',
    contributor: 'Amani',
  },
  {
    id: 'ph-2',
    phrase: 'Haraka haraka haina baraka',
    language: 'Kiswahili',
    pronunciation: 'Hah-rah-kah hah-rah-kah high-nah bah-rah-kah',
    meaning: 'Hurry, hurry has no blessing; steadiness carries peace.',
    contributor: 'Zuri',
  },
  {
    id: 'ph-3',
    phrase: 'Ubuntu — I am because we are',
    language: 'Nguni / Bantu',
    pronunciation: 'Oo-boon-too',
    meaning: 'You do not have to hold your story all by yourself.',
    contributor: 'Tariq',
  },
];

const SEED_NOTES = [
  {
    id: 'id-note-1',
    authorId: 'peer-amani',
    authorHandle: 'Amani',
    tag: 'Code-switching welcome',
    body: 'Sometimes English does not have the exact word for how tired my spirit feels—being able to mix languages here takes off half the weight.',
    timeLabel: '18m ago',
    reactions: { felt: true },
  },
  {
    id: 'id-note-2',
    authorId: 'peer-zuri',
    authorHandle: 'Zuri',
    tag: 'Between two cultures',
    body: 'Growing up between expectations at home and life outside can feel lonely. Glad we have a quiet corner where neither side needs explaining.',
    timeLabel: '1h ago',
    reactions: { warmth: true },
  },
];

const getDailyCulturalPrompt = () => {
  const todayKey = new Date().toISOString().slice(0, 10);
  const seed = [...todayKey].reduce((sum, ch) => sum + ch.charCodeAt(0), 0);
  return DAILY_CULTURAL_PROMPTS[seed % DAILY_CULTURAL_PROMPTS.length];
};

export const IdentitySpaceView = ({
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

  const spaceId = space?.id || 'identity-default';
  const storageKey = `mindbloom:community:identity:${spaceId}:v1`;
  const dailyPrompt = useMemo(() => getDailyCulturalPrompt(), []);

  const [phrases, setPhrases] = useState(SEED_PHRASES);
  const [selectedLang, setSelectedLang] = useState('All');
  const [notes, setNotes] = useState(SEED_NOTES);
  const [reportedIds, setReportedIds] = useState([]);

  // Add Phrase Form
  const [phraseOpen, setPhraseOpen] = useState(false);
  const [phraseText, setPhraseText] = useState('');
  const [phraseLang, setPhraseLang] = useState('');
  const [phrasePronunciation, setPhrasePronunciation] = useState('');
  const [phraseMeaning, setPhraseMeaning] = useState('');

  // Fireside Thread Composer
  const [selectedTag, setSelectedTag] = useState(COMFORT_TAGS[0]);
  const [draftBody, setDraftBody] = useState('');
  const [menuNoteId, setMenuNoteId] = useState(null);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(storageKey);
        if (!active || !raw) return;
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed.phrases) && parsed.phrases.length > 0) {
          setPhrases(parsed.phrases);
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

  const languages = useMemo(
    () => ['All', ...new Set(phrases.map((p) => p.language).filter(Boolean))],
    [phrases]
  );

  const visiblePhrases = useMemo(
    () => (selectedLang === 'All' ? phrases : phrases.filter((p) => p.language === selectedLang)),
    [phrases, selectedLang]
  );

  const visibleNotes = useMemo(
    () =>
      notes.filter(
        (n) =>
          !blockedAuthorIds.includes(n.authorId) &&
          !reportedIds.includes(n.id)
      ),
    [notes, blockedAuthorIds, reportedIds]
  );

  const isLgbtqSpace =
    space?.id === 'lgbtq' ||
    space?.id === 'lgbtq-plus' ||
    space?.id === 'lgbtq-community' ||
    /lgbtq/i.test(`${space?.id || ''} ${space?.title || ''}`);
  if (isLgbtqSpace) {
    return (
      <LgbtqSpaceView
        space={space}
        joined={joined}
        onToggleJoin={onToggleJoin}
        safetyAcknowledged={safetyAcknowledged}
        onAcknowledgeSafety={onAcknowledgeSafety}
        blockedAuthorIds={blockedAuthorIds}
        onBlockAuthor={onBlockAuthor}
      />
    );
  }

  const isLifeStagesSpace =
    space?.id === 'life-stages' ||
    space?.category === 'life-stages' ||
    Boolean(space?.seasonKey || space?.stageKey) ||
    /life\s*stage/i.test(`${space?.id || ''} ${space?.title || ''}`);

  if (isLifeStagesSpace) {
    return (
      <LifeStagesSpaceView
        space={space}
        joined={joined}
        onToggleJoin={onToggleJoin}
        safetyAcknowledged={safetyAcknowledged}
        onAcknowledgeSafety={onAcknowledgeSafety}
        blockedAuthorIds={blockedAuthorIds}
        onBlockAuthor={onBlockAuthor}
      />
    );
  }

  if (space?.id === 'new-to-the-city' || space?.hasMeetupSpots) {
    return (
      <NewToTheCityView
        space={space}
        joined={joined}
        onToggleJoin={onToggleJoin}
        safetyAcknowledged={safetyAcknowledged}
        onAcknowledgeSafety={onAcknowledgeSafety}
        blockedAuthorIds={blockedAuthorIds}
        onBlockAuthor={onBlockAuthor}
      />
    );
  }

  const persistSpace = async (nextPhrases, nextNotes) => {
    setPhrases(nextPhrases);
    setNotes(nextNotes);
    try {
      await AsyncStorage.setItem(
        storageKey,
        JSON.stringify({ phrases: nextPhrases, notes: nextNotes })
      );
    } catch {}
  };

  const handleJoinAndEnter = () => {
    onToggleJoin?.(space?.id || spaceId);
    setTimeout(() => {
      scrollRef.current?.scrollTo({ y: 0, animated: true });
    }, 100);
  };

  const handleAddPhrase = async () => {
    const cleanPhrase = phraseText.trim();
    const cleanMeaning = phraseMeaning.trim();
    if (!cleanPhrase || !cleanMeaning) return;

    const entry = {
      id: `ph-${Date.now()}`,
      phrase: cleanPhrase,
      language: phraseLang.trim() || 'Home tongue',
      pronunciation: phrasePronunciation.trim() || undefined,
      meaning: cleanMeaning,
      contributor: 'You',
    };

    await persistSpace([entry, ...phrases].slice(0, 15), notes);
    setPhraseText('');
    setPhraseLang('');
    setPhrasePronunciation('');
    setPhraseMeaning('');
    setPhraseOpen(false);
    setSelectedLang('All');
  };

  const handleSendNote = async () => {
    const clean = draftBody.trim();
    if (!clean || !safetyAcknowledged) return;

    const entry = {
      id: `id-note-${Date.now()}`,
      authorId: 'me-local',
      authorHandle: 'You',
      tag: selectedTag,
      body: clean,
      timeLabel: 'Just now',
      reactions: {},
    };

    await persistSpace(phrases, [...notes, entry]);
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
    await persistSpace(phrases, nextNotes);
  };

  // Pre-join gate: clicking Join takes the user directly into the active hearth
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
            {space?.title ? `${space.title.toUpperCase()} · HEARTH` : 'IDENTITY & LANGUAGE HEARTH'}
          </Text>
          <Text style={[styles.welcomeTitle, baseFont, { color: theme.textPrimary }]}>
            Speak in your own rhythm, without translating your soul
          </Text>
          <Text style={[styles.descText, baseFont, { color: theme.textSecondary }]}>
            {space?.description ||
              'Connect through shared language, heritage proverbs, and cultural experiences in a warm, respectful space.'}
          </Text>

          <View style={styles.highlights}>
            <Text style={[styles.highlightItem, baseFont, { color: theme.textPrimary }]}>
              • Words That Hold Us — collect and share comforting proverbs & idioms
            </Text>
            <Text style={[styles.highlightItem, baseFont, { color: theme.textPrimary }]}>
              • Fireside Table — code-switch freely and connect over shared roots
            </Text>
            <Text style={[styles.highlightItem, baseFont, { color: theme.textPrimary }]}>
              • Cultural dignity first — listen, reflect, or share at your own pace
            </Text>
          </View>

          <Pressable
            accessibilityRole="button"
            onPress={handleJoinAndEnter}
            style={[styles.enterBtn, { backgroundColor: theme.accent }]}
          >
            <Text style={[styles.enterBtnText, baseFont, { color: theme.bg }]}>
              Join & Enter Hearth
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
      {/* Active Hearth Header */}
      <View
        style={[
          styles.statusBar,
          { backgroundColor: theme.heroBg, borderColor: theme.heroBorder },
        ]}
      >
        <View style={styles.statusTextCol}>
          <Text style={[styles.kicker, baseFont, { color: theme.accent }]}>
            IDENTITY & LANGUAGE HEARTH
          </Text>
          <Text style={[styles.descText, baseFont, { color: theme.textPrimary }]}>
            {space?.description ||
              'A respectful space to speak in your own rhythm, share heritage words, and feel understood.'}
          </Text>
        </View>

        {onToggleJoin && (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Leave hearth"
            onPress={() => onToggleJoin(space.id)}
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

      {/* 1. COMFORTING WORDS & PROVERBS SHELF */}
      <View
        style={[
          styles.sectionCard,
          { backgroundColor: theme.cardBg, borderColor: theme.divider },
        ]}
      >
        <View style={styles.rowBetween}>
          <Text style={[styles.sectionLabel, baseFont, { color: theme.textSecondary }]}>
            WORDS THAT HOLD US · {visiblePhrases.length}
          </Text>

          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => setPhraseOpen((v) => !v)}
          >
            <Text style={[styles.actionLink, baseFont, { color: theme.accent }]}>
              {phraseOpen ? 'Close' : '+ Add phrase'}
            </Text>
          </TouchableOpacity>
        </View>

        {languages.length > 2 && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.tagRow}
          >
            {languages.map((lang) => {
              const selected = selectedLang === lang;
              return (
                <Pressable
                  key={lang}
                  onPress={() => setSelectedLang(lang)}
                  style={[
                    styles.tagPill,
                    {
                      backgroundColor: selected ? theme.accentSoft : theme.bg,
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
                    {lang}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
        )}

        {phraseOpen && (
          <View
            style={[
              styles.phraseForm,
              { backgroundColor: theme.bg, borderColor: theme.divider },
            ]}
          >
            <TextInput
              value={phraseText}
              onChangeText={setPhraseText}
              placeholder="Phrase, proverb, or comforting word…"
              placeholderTextColor={theme.textMuted}
              maxLength={80}
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
            <TextInput
              value={phraseLang}
              onChangeText={setPhraseLang}
              placeholder="Language or dialect (e.g. Kiswahili, Kikuyu, Dholuo)…"
              placeholderTextColor={theme.textMuted}
              maxLength={40}
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
            <TextInput
              value={phrasePronunciation}
              onChangeText={setPhrasePronunciation}
              placeholder="Pronunciation guide (optional)…"
              placeholderTextColor={theme.textMuted}
              maxLength={60}
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
            <TextInput
              value={phraseMeaning}
              onChangeText={setPhraseMeaning}
              placeholder="What it means to you…"
              placeholderTextColor={theme.textMuted}
              maxLength={140}
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
              disabled={!phraseText.trim() || !phraseMeaning.trim()}
              onPress={handleAddPhrase}
              style={[
                styles.primaryPillBtn,
                { backgroundColor: theme.accent, alignSelf: 'flex-end' },
                (!phraseText.trim() || !phraseMeaning.trim()) && styles.dimmed,
              ]}
            >
              <Text style={[styles.primaryPillText, baseFont, { color: theme.bg }]}>
                Place on shelf
              </Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.phraseList}>
          {visiblePhrases.map((item) => (
            <View
              key={item.id}
              style={[
                styles.phraseCard,
                { backgroundColor: theme.bg, borderColor: theme.divider },
              ]}
            >
              <View style={styles.rowBetween}>
                <Text style={[styles.phraseTitle, baseFont, { color: theme.textPrimary }]}>
                  “{item.phrase}”
                </Text>
                <View
                  style={[
                    styles.langBadge,
                    { backgroundColor: theme.accentSoft, borderColor: theme.divider },
                  ]}
                >
                  <Text style={[styles.langBadgeText, baseFont, { color: theme.textPrimary }]}>
                    {item.language}
                  </Text>
                </View>
              </View>

              {!!item.pronunciation && (
                <Text style={[styles.pronunciationText, baseFont, { color: theme.accent }]}>
                  /{item.pronunciation}/
                </Text>
              )}

              <Text style={[styles.phraseMeaning, baseFont, { color: theme.textSecondary }]}>
                {item.meaning}
              </Text>
            </View>
          ))}
        </View>
      </View>

      {/* 2. CULTURAL FIRESIDE THREAD */}
      <View
        style={[
          styles.sectionCard,
          { backgroundColor: theme.cardBg, borderColor: theme.divider },
        ]}
      >
        <Text style={[styles.sectionLabel, baseFont, { color: theme.textSecondary }]}>
          FIRESIDE TABLE
        </Text>

        {/* Automated Daily Cultural Reflection Prompt */}
        <View
          style={[
            styles.promptBox,
            { backgroundColor: theme.bg, borderColor: theme.divider },
          ]}
        >
          <Text style={[styles.promptLabel, baseFont, { color: theme.accent }]}>
            TODAY’S HERITAGE REFLECTION
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
              The table is quiet right now.
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
                        {HEARTH_REACTIONS.map((r) => {
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
              Hold every identity and language with dignity—no stereotyping or personal contact info.
            </Text>
            <Pressable
              onPress={onAcknowledgeSafety}
              style={[styles.primaryPillBtn, { backgroundColor: theme.accent, alignSelf: 'flex-start' }]}
            >
              <Text style={[styles.primaryPillText, baseFont, { color: theme.bg }]}>
                Enable table chat
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
              {COMFORT_TAGS.map((tag) => {
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
                placeholder="Share in any language or rhythm…"
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
    gap: 22,
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
  mutedTiny: {
    fontSize: 12.5,
    fontWeight: '500',
  },
  phraseForm: {
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
  phraseList: {
    gap: 10,
  },
  phraseCard: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 14,
    gap: 6,
  },
  phraseTitle: {
    flex: 1,
    fontSize: 14.5,
    fontWeight: '700',
  },
  langBadge: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  langBadgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  pronunciationText: {
    fontSize: 12,
    fontStyle: 'italic',
    fontWeight: '600',
  },
  phraseMeaning: {
    fontSize: 13,
    fontWeight: '500',
    lineHeight: 18,
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