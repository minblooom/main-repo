// src/features/community/circles/SharingCircleView.jsx
import React, { useEffect, useMemo, useState } from 'react';
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
import { getCompanionByIndex } from '../../../constants/companions';

const HOLD_INTENTIONS = [
  'Just sharing',
  'Open to kind reflections',
  'Rough draft',
];

const SALON_REACTIONS = [
  { key: 'moved', label: 'Moved 🕯️' },
  { key: 'resonates', label: 'Resonates 🌿' },
  { key: 'replay', label: 'Replay 🎵' },
];

const ART_COLLECTABLES = [
  { id: 'col-lantern', mark: '🏮', name: 'Paper Lantern', note: 'Soft evening light' },
  { id: 'col-fern', mark: '🌿', name: 'Pressed Fern', note: 'Quiet growth' },
  { id: 'col-folio', mark: '🖼️', name: 'Folio Study', note: 'Unhurried draft' },
  { id: 'col-shell', mark: '🐚', name: 'Tide Shell', note: 'Slow rhythm' },
];

const CIRCLE_CONFIGS = {
  poetry: {
    kicker: 'VERSE & VOICE CIRCLE',
    defaultDesc: 'Short poems, stanzas, and a shared verse woven line by line.',
    placeholderTitle: 'Poem title (optional)…',
    placeholderBody: 'Write a few lines or a stanza…',
  },
  music: {
    kicker: 'SOUND & SONG CIRCLE',
    defaultDesc: 'Songs, lyrics, and quiet sounds that help you settle.',
    placeholderTitle: 'Song & artist…',
    placeholderBody: 'Share a lyric or how this sound holds you…',
  },
  visual: {
    kicker: 'AT YOUR OWN PACE · ART & COLLECTABLES',
    defaultDesc: 'Visual sketches, unhurried notes, and small art collectables.',
    placeholderTitle: 'Piece or study name…',
    placeholderBody: 'Share a sketch note, visual mood, or unhurried piece…',
  },
};

const SEED_WORKS_BY_PURPOSE = {
  poetry: [
    {
      id: 'po-1',
      authorId: 'peer-luma',
      authorHandle: 'Quiet Ink',
      purpose: 'poetry',
      intention: 'Just sharing',
      title: 'Evening kettle',
      body: 'The kettle hums before the rain begins,\nand for five quiet minutes nothing asks my name.',
      pinned: true,
      reactions: { moved: true },
    },
    {
      id: 'po-2',
      authorId: 'peer-sable',
      authorHandle: 'Soft Margin',
      purpose: 'poetry',
      intention: 'Rough draft',
      title: null,
      body: 'Unfinished lines are still allowed\nto sit in the lamp light.',
      pinned: false,
      reactions: { resonates: true },
    },
  ],
  music: [
    {
      id: 'mu-1',
      authorId: 'peer-kora',
      authorHandle: 'Dusk Strings',
      purpose: 'music',
      intention: 'Open to kind reflections',
      title: 'Weightless — Marconi Union',
      body: 'Soft ambient pulse for when your thoughts feel loud.',
      pinned: true,
      reactions: { replay: true },
    },
    {
      id: 'mu-2',
      authorId: 'peer-reed',
      authorHandle: 'Low Tide',
      purpose: 'music',
      intention: 'Just sharing',
      title: 'Slow acoustic rain loop',
      body: 'Good background company while reading or making tea.',
      pinned: false,
      reactions: { moved: true },
    },
  ],
  visual: [
    {
      id: 'vi-1',
      authorId: 'peer-ochre',
      authorHandle: 'Warm Clay',
      purpose: 'visual',
      intention: 'Rough draft',
      title: 'Terracotta & window study',
      body: 'Three loose pencil and wash lines—no rush to finish.',
      pinned: true,
      reactions: { resonates: true },
    },
    {
      id: 'vi-2',
      authorId: 'peer-mist',
      authorHandle: 'Pale Horizon',
      purpose: 'visual',
      intention: 'Just sharing',
      title: 'Morning sill',
      body: 'A quiet corner sketch made before opening anything else.',
      pinned: false,
      reactions: { moved: true },
    },
  ],
};

const INITIAL_VERSE = [
  { id: 'v-1', text: 'Outside the window, dusk folds the noisy street in half,', author: 'Quiet Ink' },
  { id: 'v-2', text: 'and a single warm lamp remembers where we left our breath.', author: 'Soft Margin' },
];

const INITIAL_QUEUE = [
  { id: 'q-1', track: 'Morning Light — Gentle Acoustic', note: 'Slow start' },
  { id: 'q-2', track: 'Harbor Breeze — Ambient Synth', note: 'Unwind' },
];

const resolveCirclePurpose = (circle, circleIndex = 0) => {
  const raw = `${circle?.id || ''} ${circle?.title || ''} ${circle?.purpose || ''}`.toLowerCase();
  if (raw.includes('music') || raw.includes('song') || raw.includes('sound')) return 'music';
  if (
    raw.includes('visual') ||
    raw.includes('art') ||
    raw.includes('sketch') ||
    raw.includes('pace')
  ) {
    return 'visual';
  }
  if (raw.includes('poet') || raw.includes('verse') || raw.includes('write')) return 'poetry';

  const keys = ['poetry', 'music', 'visual'];
  return keys[circleIndex % keys.length];
};

export const SharingCircleView = ({
  circle,
  circleIndex = 0,
  joined = false,
  onToggleJoin,
  safetyAcknowledged = true,
  onAcknowledgeSafety,
  blockedAuthorIds = [],
  onBlockAuthor,
}) => {
  const { theme } = useTheme();
  const baseFont = theme.fontFamily ? { fontFamily: theme.fontFamily } : null;

  const purpose = useMemo(
    () => resolveCirclePurpose(circle, circleIndex),
    [circle, circleIndex]
  );
  const cfg = CIRCLE_CONFIGS[purpose] || CIRCLE_CONFIGS.poetry;

  const circleId = circle?.id || `salon-${purpose}`;
  const storageKey = `mindbloom:community:salon:${circleId}:v1`;
  const pocketKey = 'mindbloom:community:artPocket:v1';
  const collectablesKey = `mindbloom:community:artCollectables:${circleId}:v1`;

  const [works, setWorks] = useState(SEED_WORKS_BY_PURPOSE[purpose]);
  const [verseLines, setVerseLines] = useState(INITIAL_VERSE);
  const [queueItems, setQueueItems] = useState(INITIAL_QUEUE);
  const [collectedIds, setCollectedIds] = useState(['col-lantern']);
  const [pocketIds, setPocketIds] = useState([]);
  const [reportedIds, setReportedIds] = useState([]);

  const [showPocket, setShowPocket] = useState(false);
  const [composerOpen, setComposerOpen] = useState(false);
  const [draftIntention, setDraftIntention] = useState(HOLD_INTENTIONS[0]);
  const [draftTitle, setDraftTitle] = useState('');
  const [draftBody, setDraftBody] = useState('');
  const [activityDraft, setActivityDraft] = useState('');
  const [menuWorkId, setMenuWorkId] = useState(null);

  useEffect(() => {
    setWorks(SEED_WORKS_BY_PURPOSE[purpose]);
    setShowPocket(false);
    setComposerOpen(false);
    let active = true;
    (async () => {
      try {
        const [rawSalon, rawPocket, rawCols] = await Promise.all([
          AsyncStorage.getItem(storageKey),
          AsyncStorage.getItem(pocketKey),
          AsyncStorage.getItem(collectablesKey),
        ]);
        if (!active) return;
        if (rawSalon) {
          const parsed = JSON.parse(rawSalon);
          if (Array.isArray(parsed.works) && parsed.works.length > 0) {
            setWorks(parsed.works);
          }
          if (Array.isArray(parsed.verseLines)) setVerseLines(parsed.verseLines);
          if (Array.isArray(parsed.queueItems)) setQueueItems(parsed.queueItems);
        }
        if (rawPocket) {
          const parsedPocket = JSON.parse(rawPocket);
          if (Array.isArray(parsedPocket)) setPocketIds(parsedPocket);
        }
        if (rawCols) {
          const parsedCols = JSON.parse(rawCols);
          if (Array.isArray(parsedCols)) setCollectedIds(parsedCols);
        }
      } catch {}
    })();
    return () => {
      active = false;
    };
  }, [purpose, storageKey, collectablesKey]);

  const persistSalon = async (nextWorks, nextVerse = verseLines, nextQueue = queueItems) => {
    setWorks(nextWorks);
    setVerseLines(nextVerse);
    setQueueItems(nextQueue);
    try {
      await AsyncStorage.setItem(
        storageKey,
        JSON.stringify({
          works: nextWorks,
          verseLines: nextVerse,
          queueItems: nextQueue,
        })
      );
    } catch {}
  };

  const toggleCollectable = async (colId) => {
    const next = collectedIds.includes(colId)
      ? collectedIds.filter((id) => id !== colId)
      : [...collectedIds, colId];
    setCollectedIds(next);
    try {
      await AsyncStorage.setItem(collectablesKey, JSON.stringify(next));
    } catch {}
  };

  const togglePocket = async (workId) => {
    const exists = pocketIds.includes(workId);
    const next = exists
      ? pocketIds.filter((id) => id !== workId)
      : [workId, ...pocketIds];
    setPocketIds(next);
    try {
      await AsyncStorage.setItem(pocketKey, JSON.stringify(next));
    } catch {}
  };

  const togglePinWall = async (workId) => {
    const next = works.map((w) => ({
      ...w,
      pinned: w.id === workId ? !w.pinned : false,
    }));
    await persistSalon(next);
  };

  const toggleReaction = async (workId, reactionKey) => {
    const next = works.map((w) => {
      if (w.id !== workId) return w;
      return {
        ...w,
        reactions: {
          ...w.reactions,
          [reactionKey]: !w.reactions?.[reactionKey],
        },
      };
    });
    await persistSalon(next);
  };

  const handlePublishWork = async () => {
    const cleanBody = draftBody.trim();
    if (!cleanBody) return;

    const newEntry = {
      id: `work-${Date.now()}`,
      authorId: 'me-local',
      authorHandle: 'You',
      purpose,
      intention: draftIntention,
      title: draftTitle.trim() || null,
      body: cleanBody,
      pinned: false,
      reactions: {},
    };

    let nextCols = collectedIds;
    if (purpose === 'visual') {
      const nextUncollected = ART_COLLECTABLES.find((c) => !collectedIds.includes(c.id));
      if (nextUncollected) {
        nextCols = [...collectedIds, nextUncollected.id];
        setCollectedIds(nextCols);
        try {
          await AsyncStorage.setItem(collectablesKey, JSON.stringify(nextCols));
        } catch {}
      }
    }

    await persistSalon([newEntry, ...works]);
    setDraftTitle('');
    setDraftBody('');
    setComposerOpen(false);
  };

  const handlePurposeActivitySubmit = async () => {
    const clean = activityDraft.trim();
    if (!clean) return;
    if (purpose === 'poetry') {
      const nextVerse = [
        ...verseLines,
        { id: `v-${Date.now()}`, text: clean, author: 'You' },
      ].slice(-8);
      setActivityDraft('');
      await persistSalon(works, nextVerse, queueItems);
    } else if (purpose === 'music') {
      const nextQueue = [
        ...queueItems,
        { id: `q-${Date.now()}`, track: clean, note: 'Added' },
      ].slice(-6);
      setActivityDraft('');
      await persistSalon(works, verseLines, nextQueue);
    }
  };

  const visibleWorks = useMemo(() => {
    return works.filter((w) => {
      if (blockedAuthorIds.includes(w.authorId)) return false;
      if (reportedIds.includes(w.id)) return false;
      if (showPocket) return pocketIds.includes(w.id);
      return true;
    });
  }, [works, blockedAuthorIds, reportedIds, showPocket, pocketIds]);

  const spotlightWork = useMemo(
    () =>
      works.find(
        (w) =>
          w.pinned &&
          !blockedAuthorIds.includes(w.authorId) &&
          !reportedIds.includes(w.id)
      ),
    [works, blockedAuthorIds, reportedIds]
  );

  const descriptionText = circle?.description || cfg.defaultDesc;

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.scroll}
    >
      {/* Circle Purpose Strip */}
      <View
        style={[
          styles.statusBar,
          { backgroundColor: theme.heroBg, borderColor: theme.heroBorder },
        ]}
      >
        <View style={styles.statusTextCol}>
          <Text style={[styles.kicker, baseFont, { color: theme.accent }]}>
            {cfg.kicker}
          </Text>
          <Text style={[styles.descText, baseFont, { color: theme.textPrimary }]}>
            {descriptionText}
          </Text>
        </View>

        {onToggleJoin && (
          <Pressable
            accessibilityRole="button"
            accessibilityState={{ selected: joined }}
            onPress={() => onToggleJoin(circle.id)}
            style={[
              styles.joinBtn,
              {
                backgroundColor: joined ? theme.cardBg : theme.accent,
                borderColor: theme.accent,
              },
            ]}
          >
            <Text
              style={[
                styles.joinText,
                baseFont,
                { color: joined ? theme.textPrimary : theme.bg },
              ]}
            >
              {joined ? 'Joined ✓' : 'Join'}
            </Text>
          </Pressable>
        )}
      </View>

      {/* Gallery Wall Spotlight */}
      {spotlightWork && !showPocket && (
        <View
          style={[
            styles.spotlightCard,
            {
              backgroundColor: theme.cardBg,
              borderColor: theme.heroBorder,
            },
          ]}
        >
          <View style={styles.rowBetween}>
            <Text style={[styles.kicker, baseFont, { color: theme.accent }]}>
              ✦ GALLERY SPOTLIGHT
            </Text>
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => togglePocket(spotlightWork.id)}
            >
              <Text style={[styles.actionLink, baseFont, { color: theme.accent }]}>
                {pocketIds.includes(spotlightWork.id) ? 'In pocket ✓' : '+ Pocket'}
              </Text>
            </TouchableOpacity>
          </View>

          {!!spotlightWork.title && (
            <Text style={[styles.spotlightTitle, baseFont, { color: theme.textPrimary }]}>
              {spotlightWork.title}
            </Text>
          )}
          <Text style={[styles.spotlightBody, baseFont, { color: theme.textPrimary }]}>
            {spotlightWork.body}
          </Text>
          <Text style={[styles.spotlightAuthor, baseFont, { color: theme.textSecondary }]}>
            — {spotlightWork.authorHandle} · {spotlightWork.intention}
          </Text>
        </View>
      )}

      {/* Distinct Activity Per Circle Purpose */}
      {purpose === 'poetry' && (
        <View
          style={[
            styles.sectionCard,
            { backgroundColor: theme.cardBg, borderColor: theme.divider },
          ]}
        >
          <Text style={[styles.sectionLabel, baseFont, { color: theme.textSecondary }]}>
            PASS-THE-VERSE · {verseLines.length} LINES
          </Text>

          <View
            style={[
              styles.versePaper,
              { backgroundColor: theme.bg, borderColor: theme.divider },
            ]}
          >
            {verseLines.map((line) => (
              <View key={line.id} style={styles.verseLineRow}>
                <Text style={[styles.verseText, baseFont, { color: theme.textPrimary }]}>
                  {line.text}
                </Text>
                <Text style={[styles.verseBy, baseFont, { color: theme.textSecondary }]}>
                  — {line.author}
                </Text>
              </View>
            ))}
          </View>

          <View style={styles.inlineInputRow}>
            <TextInput
              value={activityDraft}
              onChangeText={setActivityDraft}
              placeholder="Add next line…"
              placeholderTextColor={theme.textMuted}
              maxLength={100}
              onSubmitEditing={handlePurposeActivitySubmit}
              style={[
                styles.lineInput,
                baseFont,
                {
                  color: theme.textPrimary,
                  backgroundColor: theme.bg,
                  borderColor: theme.divider,
                },
              ]}
            />
            <TouchableOpacity
              activeOpacity={0.85}
              disabled={!activityDraft.trim()}
              onPress={handlePurposeActivitySubmit}
              style={[
                styles.smallActionBtn,
                { backgroundColor: theme.accent },
                !activityDraft.trim() && styles.dimmed,
              ]}
            >
              <Text style={[styles.smallActionText, baseFont, { color: theme.bg }]}>
                Add line
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {purpose === 'music' && (
        <View
          style={[
            styles.sectionCard,
            { backgroundColor: theme.cardBg, borderColor: theme.divider },
          ]}
        >
          <Text style={[styles.sectionLabel, baseFont, { color: theme.textSecondary }]}>
            LISTENING QUEUE · {queueItems.length} TRACKS
          </Text>

          <View style={styles.queueList}>
            {queueItems.map((q, idx) => (
              <View
                key={q.id}
                style={[
                  styles.queueRow,
                  { backgroundColor: theme.bg, borderColor: theme.divider },
                ]}
              >
                <Text style={[styles.queueIndex, baseFont, { color: theme.accent }]}>
                  0{idx + 1}
                </Text>
                <Text style={[styles.queueTrack, baseFont, { color: theme.textPrimary, flex: 1 }]}>
                  {q.track}
                </Text>
                <Text style={[styles.mutedTiny, baseFont, { color: theme.textSecondary }]}>
                  {q.note}
                </Text>
              </View>
            ))}
          </View>

          <View style={styles.inlineInputRow}>
            <TextInput
              value={activityDraft}
              onChangeText={setActivityDraft}
              placeholder="Add song or sound…"
              placeholderTextColor={theme.textMuted}
              maxLength={90}
              onSubmitEditing={handlePurposeActivitySubmit}
              style={[
                styles.lineInput,
                baseFont,
                {
                  color: theme.textPrimary,
                  backgroundColor: theme.bg,
                  borderColor: theme.divider,
                },
              ]}
            />
            <TouchableOpacity
              activeOpacity={0.85}
              disabled={!activityDraft.trim()}
              onPress={handlePurposeActivitySubmit}
              style={[
                styles.smallActionBtn,
                { backgroundColor: theme.accent },
                !activityDraft.trim() && styles.dimmed,
              ]}
            >
              <Text style={[styles.smallActionText, baseFont, { color: theme.bg }]}>
                Queue
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {purpose === 'visual' && (
        <View
          style={[
            styles.sectionCard,
            { backgroundColor: theme.cardBg, borderColor: theme.divider },
          ]}
        >
          <View style={styles.rowBetween}>
            <Text style={[styles.sectionLabel, baseFont, { color: theme.textSecondary }]}>
              ART COLLECTABLES · {collectedIds.length}/{ART_COLLECTABLES.length}
            </Text>
            <Text style={[styles.mutedTiny, baseFont, { color: theme.textSecondary }]}>
              Tap to keep or release
            </Text>
          </View>

          <View style={styles.collectablesGrid}>
            {ART_COLLECTABLES.map((col) => {
              const owned = collectedIds.includes(col.id);
              return (
                <TouchableOpacity
                  key={col.id}
                  activeOpacity={0.85}
                  onPress={() => toggleCollectable(col.id)}
                  style={[
                    styles.collectableTile,
                    {
                      backgroundColor: owned ? theme.accentSoft : theme.bg,
                      borderColor: owned ? theme.accent : theme.divider,
                    },
                  ]}
                >
                  <View style={styles.rowBetween}>
                    <Text style={styles.collectableMark}>{col.mark}</Text>
                    <Text
                      style={[
                        styles.collectableTag,
                        baseFont,
                        { color: owned ? theme.accent : theme.textSecondary },
                      ]}
                    >
                      {owned ? 'Collected ✓' : 'Collect'}
                    </Text>
                  </View>
                  <Text style={[styles.collectableName, baseFont, { color: theme.textPrimary }]}>
                    {col.name}
                  </Text>
                  <Text style={[styles.collectableNote, baseFont, { color: theme.textSecondary }]}>
                    {col.note}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      )}

      {/* Circle Works + Pocket Perk + Composer */}
      <View
        style={[
          styles.sectionCard,
          { backgroundColor: theme.cardBg, borderColor: theme.divider },
        ]}
      >
        <View style={styles.rowBetween}>
          <Text style={[styles.sectionLabel, baseFont, { color: theme.textSecondary }]}>
            {showPocket ? `POCKET (${pocketIds.length})` : 'SHARED WORKS'}
          </Text>

          <View style={styles.headerActions}>
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => setShowPocket((v) => !v)}
              style={[
                styles.pocketPill,
                {
                  backgroundColor: showPocket ? theme.accent : theme.bg,
                  borderColor: theme.accent,
                },
              ]}
            >
              <Text
                style={[
                  styles.pocketPillText,
                  baseFont,
                  { color: showPocket ? theme.bg : theme.textPrimary },
                ]}
              >
                Pocket ({pocketIds.length})
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => setComposerOpen((v) => !v)}
              style={[
                styles.pocketPill,
                { backgroundColor: theme.accentSoft, borderColor: theme.accent },
              ]}
            >
              <Text style={[styles.pocketPillText, baseFont, { color: theme.textPrimary }]}>
                {composerOpen ? 'Close' : '+ Share'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {composerOpen && (
          !safetyAcknowledged ? (
            <View
              style={[
                styles.safetyBox,
                { backgroundColor: theme.bg, borderColor: theme.accent },
              ]}
            >
              <Text style={[styles.mutedTiny, baseFont, { color: theme.textPrimary }]}>
                Keep shares gentle—no personal contact info.
              </Text>
              <Pressable
                onPress={onAcknowledgeSafety}
                style={[styles.smallActionBtn, { backgroundColor: theme.accent, alignSelf: 'flex-start' }]}
              >
                <Text style={[styles.smallActionText, baseFont, { color: theme.bg }]}>
                  Enable sharing
                </Text>
              </Pressable>
            </View>
          ) : (
            <View
              style={[
                styles.composerCard,
                { backgroundColor: theme.bg, borderColor: theme.divider },
              ]}
            >
              <View style={styles.wrapRow}>
                {HOLD_INTENTIONS.map((intent) => {
                  const selected = draftIntention === intent;
                  return (
                    <TouchableOpacity
                      key={intent}
                      onPress={() => setDraftIntention(intent)}
                      style={[
                        styles.miniSelect,
                        {
                          backgroundColor: selected ? theme.accentSoft : theme.cardBg,
                          borderColor: selected ? theme.accent : theme.divider,
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.miniSelectText,
                          baseFont,
                          { color: selected ? theme.textPrimary : theme.textSecondary },
                        ]}
                      >
                        {intent}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              <TextInput
                value={draftTitle}
                onChangeText={setDraftTitle}
                placeholder={cfg.placeholderTitle}
                placeholderTextColor={theme.textMuted}
                maxLength={70}
                style={[
                  styles.titleInput,
                  baseFont,
                  {
                    color: theme.textPrimary,
                    backgroundColor: theme.cardBg,
                    borderColor: theme.divider,
                  },
                ]}
              />

              <TextInput
                value={draftBody}
                onChangeText={setDraftBody}
                placeholder={cfg.placeholderBody}
                placeholderTextColor={theme.textMuted}
                maxLength={360}
                multiline
                textAlignVertical="top"
                style={[
                  styles.bodyInput,
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
                disabled={!draftBody.trim()}
                onPress={handlePublishWork}
                style={[
                  styles.publishBtn,
                  { backgroundColor: theme.accent },
                  !draftBody.trim() && styles.dimmed,
                ]}
              >
                <Text style={[styles.smallActionText, baseFont, { color: theme.bg }]}>
                  Share
                </Text>
              </TouchableOpacity>
            </View>
          )
        )}

        <View style={styles.galleryList}>
          {visibleWorks.length === 0 ? (
            <Text style={[styles.emptyText, baseFont, { color: theme.textSecondary }]}>
              {showPocket ? 'Nothing saved in your pocket yet.' : 'No pieces yet.'}
            </Text>
          ) : (
            visibleWorks.map((work, idx) => {
              const comp = getCompanionByIndex(idx);
              const savedInPocket = pocketIds.includes(work.id);
              const menuOpen = menuWorkId === work.id;

              return (
                <View
                  key={work.id}
                  style={[
                    styles.artCard,
                    {
                      backgroundColor: theme.bg,
                      borderColor: theme.divider,
                    },
                  ]}
                >
                  <View style={styles.rowBetween}>
                    <View style={styles.artMetaLeft}>
                      <View
                        style={[
                          styles.artAvatar,
                          { backgroundColor: comp.accent || theme.accentSoft },
                        ]}
                      >
                        <Image
                          source={comp.image}
                          style={styles.artAvatarImg}
                          resizeMode="cover"
                        />
                      </View>
                      <View>
                        <Text style={[styles.artAuthor, baseFont, { color: theme.textPrimary }]}>
                          {work.authorHandle}
                        </Text>
                        <Text style={[styles.artSubMeta, baseFont, { color: theme.textSecondary }]}>
                          {work.intention}
                        </Text>
                      </View>
                    </View>

                    <Pressable
                      onPress={() => setMenuWorkId(menuOpen ? null : work.id)}
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
                          setReportedIds((prev) => [...prev, work.id]);
                          setMenuWorkId(null);
                        }}
                        style={[styles.menuChip, { borderColor: theme.accent }]}
                      >
                        <Text style={[styles.menuChipText, baseFont, { color: theme.accent }]}>
                          Report
                        </Text>
                      </Pressable>
                      <Pressable
                        onPress={() => {
                          onBlockAuthor?.(work.authorId);
                          setMenuWorkId(null);
                        }}
                        style={[styles.menuChip, { borderColor: theme.divider }]}
                      >
                        <Text style={[styles.menuChipText, baseFont, { color: theme.textSecondary }]}>
                          Block
                        </Text>
                      </Pressable>
                    </View>
                  )}

                  {!!work.title && (
                    <Text style={[styles.artTitle, baseFont, { color: theme.textPrimary }]}>
                      {work.title}
                    </Text>
                  )}
                  <Text
                    style={[
                      styles.artBody,
                      baseFont,
                      purpose === 'poetry' && styles.poetryItalic,
                      { color: theme.textPrimary },
                    ]}
                  >
                    {work.body}
                  </Text>

                  <View style={styles.artFooter}>
                    <View style={styles.wrapRow}>
                      {SALON_REACTIONS.map((r) => {
                        const active = !!work.reactions?.[r.key];
                        return (
                          <Pressable
                            key={r.key}
                            onPress={() => toggleReaction(work.id, r.key)}
                            style={[
                              styles.reactTag,
                              {
                                backgroundColor: active ? theme.cardBg : 'transparent',
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

                    <View style={styles.perkActions}>
                      <TouchableOpacity
                        activeOpacity={0.85}
                        onPress={() => togglePinWall(work.id)}
                      >
                        <Text
                          style={[
                            styles.perkLink,
                            baseFont,
                            { color: work.pinned ? theme.accent : theme.textSecondary },
                          ]}
                        >
                          {work.pinned ? '✦ Spotlight' : 'Pin'}
                        </Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        activeOpacity={0.85}
                        onPress={() => togglePocket(work.id)}
                      >
                        <Text
                          style={[
                            styles.perkLink,
                            baseFont,
                            { color: savedInPocket ? theme.accent : theme.textSecondary },
                          ]}
                        >
                          {savedInPocket ? 'Pocketed ✓' : '+ Pocket'}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              );
            })
          )}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scroll: {
    gap: 22,
    paddingBottom: 32,
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
  joinBtn: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 15,
    paddingVertical: 8,
  },
  joinText: {
    fontSize: 13,
    fontWeight: '700',
  },
  spotlightCard: {
    borderWidth: 1,
    borderRadius: 22,
    padding: 18,
    gap: 10,
  },
  spotlightTitle: {
    fontSize: 16,
    fontWeight: '800',
  },
  spotlightBody: {
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 21,
    fontStyle: 'italic',
  },
  spotlightAuthor: {
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
  mutedTiny: {
    fontSize: 12.5,
    fontWeight: '500',
  },
  actionLink: {
    fontSize: 12.5,
    fontWeight: '700',
  },
  versePaper: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 14,
    gap: 10,
  },
  verseLineRow: {
    gap: 3,
  },
  verseText: {
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 20,
    fontStyle: 'italic',
  },
  verseBy: {
    fontSize: 11.5,
    fontWeight: '600',
  },
  queueList: {
    gap: 8,
  },
  queueRow: {
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  queueIndex: {
    fontSize: 12,
    fontWeight: '800',
  },
  queueTrack: {
    fontSize: 13.5,
    fontWeight: '600',
  },
  collectablesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  collectableTile: {
    width: '48.5%',
    borderWidth: 1,
    borderRadius: 16,
    padding: 12,
    gap: 4,
  },
  collectableMark: {
    fontSize: 18,
  },
  collectableTag: {
    fontSize: 11,
    fontWeight: '700',
  },
  collectableName: {
    fontSize: 13.5,
    fontWeight: '700',
    marginTop: 2,
  },
  collectableNote: {
    fontSize: 11.5,
    fontWeight: '500',
  },
  inlineInputRow: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  lineInput: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 9,
    fontSize: 13.5,
    fontWeight: '500',
  },
  smallActionBtn: {
    borderRadius: 14,
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  smallActionText: {
    fontSize: 13,
    fontWeight: '700',
  },
  dimmed: {
    opacity: 0.4,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  pocketPill: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  pocketPillText: {
    fontSize: 12,
    fontWeight: '700',
  },
  safetyBox: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 14,
    gap: 10,
  },
  composerCard: {
    borderWidth: 1,
    borderRadius: 18,
    padding: 14,
    gap: 10,
  },
  wrapRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  miniSelect: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 11,
    paddingVertical: 6,
  },
  miniSelectText: {
    fontSize: 12,
    fontWeight: '600',
  },
  titleInput: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 9,
    fontSize: 13.5,
    fontWeight: '500',
  },
  bodyInput: {
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    fontWeight: '500',
    minHeight: 84,
  },
  publishBtn: {
    alignSelf: 'flex-end',
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 9,
  },
  galleryList: {
    gap: 14,
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 13,
    fontWeight: '500',
    paddingVertical: 14,
  },
  artCard: {
    borderWidth: 1,
    borderRadius: 18,
    padding: 16,
    gap: 10,
  },
  artMetaLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  artAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  artAvatarImg: {
    width: 28,
    height: 28,
    borderRadius: 14,
  },
  artAuthor: {
    fontSize: 13.5,
    fontWeight: '700',
  },
  artSubMeta: {
    fontSize: 11.5,
    fontWeight: '500',
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
  artTitle: {
    fontSize: 15.5,
    fontWeight: '800',
  },
  artBody: {
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 20,
  },
  poetryItalic: {
    fontStyle: 'italic',
  },
  artFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 2,
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
  perkActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  perkLink: {
    fontSize: 12,
    fontWeight: '700',
  },
});