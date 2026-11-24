// src/features/community/groups/GroupSpaceView.jsx
// src/features/community/groups/GroupSpaceView.jsx
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
import { COMPANION_MAP } from '../../../constants/companions';

const COMPANION_KEYS = Object.keys(COMPANION_MAP);
const getCompanion = (idx) =>
  COMPANION_MAP[COMPANION_KEYS[idx % COMPANION_KEYS.length]] || COMPANION_MAP.noodle;

const JAR_CAPACITY = 10;
const GARLAND_SLOTS = 8;

const STARTER_SLIPS = [
  'Stepped away from screens',
  'Kept a quiet boundary',
  'Rested without guilt',
];

const QUICK_WINS = [
  '💧 Drank a glass of water',
  '🌤️ Opened curtains or stepped out',
  '📌 Finished one tiny task',
  '🫶 Spoken kindly to myself',
];

const CIRCLE_SEATS = Array.from({ length: 10 }, (_, idx) => ({
  seatNumber: idx + 1,
  companion: getCompanion(idx),
}));

const BALANCE_REACTIONS = [
  { key: 'relate', label: 'Me too' },
  { key: 'warmth', label: 'Warmth' },
  { key: 'steady', label: 'Steady' },
];

const WIN_REACTIONS = [
  { key: 'clap', label: 'Clap 👏' },
  { key: 'proud', label: 'Proud 🌱' },
  { key: 'spark', label: 'Spark ✨' },
];

const detectVibration = (group) => {
  const id = (group?.id || '').toLowerCase();
  const title = (group?.title || '').toLowerCase();
  if (id.includes('win') || title.includes('win')) return 'wins';
  return 'balance';
};

export const GroupSpaceView = ({
  group,
  posts = [],
  joined = false,
  onToggleJoin,
  safetyAcknowledged,
  onAcknowledgeSafety,
  blockedAuthorIds = [],
  reportedPostIds = [],
  onBlockAuthor,
  onReportPost,
  onCreatePost,
  onToggleReaction,
}) => {
  const { theme } = useTheme();
  const vibration = useMemo(() => detectVibration(group), [group]);

  // Sanctuary font helper (picks up custom font if defined in ThemeContext)
  const baseFont = theme.fontFamily ? { fontFamily: theme.fontFamily } : null;

  // --- FINDING BALANCE STATE ---
  const [stewardMode, setStewardMode] = useState(false);
  const [gateLocked, setGateLocked] = useState(false);
  const [pendingGuest, setPendingGuest] = useState(true);

  const [slipDraft, setSlipDraft] = useState('');
  const [slips, setSlips] = useState([
    { id: 's-1', text: 'Paused before replying' },
    { id: 's-2', text: 'Slow walk at dusk' },
  ]);
  const [releasedCount, setReleasedCount] = useState(10);
  const [showSlips, setShowSlips] = useState(true);
  const [activeSeat, setActiveSeat] = useState(1);

  // --- SMALL WINS STATE ---
  const winsStorageKey = `mindbloom:community:smallWins:${group.id}:v1`;
  const [winDraft, setWinDraft] = useState('');
  const [celebratedWins, setCelebratedWins] = useState([
    { id: 'w-1', label: '🌤️ Opened curtains or stepped out', tag: 'Today' },
    { id: 'w-2', label: '💧 Drank a glass of water', tag: 'Today' },
  ]);

  useEffect(() => {
    if (vibration !== 'wins') return;
    let active = true;
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(winsStorageKey);
        if (active && raw) {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed)) setCelebratedWins(parsed);
        }
      } catch {}
    })();
    return () => {
      active = false;
    };
  }, [vibration, winsStorageKey]);

  const persistWins = async (next) => {
    setCelebratedWins(next);
    try {
      await AsyncStorage.setItem(winsStorageKey, JSON.stringify(next));
    } catch {}
  };

  const handleLogWin = async (labelValue) => {
    const clean = (labelValue ?? winDraft).trim();
    if (!clean) return;
    const entry = {
      id: `win-${Date.now()}`,
      label: clean,
      tag: 'Just now',
    };
    if (!labelValue) setWinDraft('');
    await persistWins([entry, ...celebratedWins].slice(0, 24));
  };

  const handleResetGarland = async () => {
    await persistWins([]);
  };

  // --- SHARED CHAT STATE ---
  const [draft, setDraft] = useState('');
  const [contentNote, setContentNote] = useState('');
  const [revealedNotes, setRevealedNotes] = useState({});
  const [menuPostId, setMenuPostId] = useState(null);

  const visiblePosts = useMemo(
    () =>
      posts.filter(
        (p) =>
          !blockedAuthorIds.includes(p.authorId) &&
          !reportedPostIds.includes(p.id)
      ),
    [posts, blockedAuthorIds, reportedPostIds]
  );

  const anonCount = 4 + (joined ? 1 : 0);
  const jarFull = slips.length >= JAR_CAPACITY;
  const litFlags = Math.min(GARLAND_SLOTS, celebratedWins.length);
  const isWins = vibration === 'wins';
  const reactions = isWins ? WIN_REACTIONS : BALANCE_REACTIONS;

  const addSlip = (textValue) => {
    const clean = (textValue ?? slipDraft).trim();
    if (!clean || jarFull) return;
    setSlips((prev) => [...prev, { id: `slip-${Date.now()}`, text: clean }]);
    setSlipDraft('');
  };

  const handleBurnJar = () => {
    setReleasedCount((c) => c + slips.length);
    setSlips([]);
  };

  const handleNewJar = () => {
    setSlips([]);
  };

  const handleSend = async () => {
    const clean = draft.trim();
    if (!clean || !safetyAcknowledged) return;
    const ok = await onCreatePost?.({
      groupId: group.id,
      body: clean,
      contentNote: contentNote.trim() || null,
    });
    if (ok) {
      setDraft('');
      setContentNote('');
    }
  };

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.scroll}
    >
      {/* Top Room Strip (Sanctuary Hero Styling) */}
      <View
        style={[
          styles.statusBar,
          { backgroundColor: theme.heroBg, borderColor: theme.heroBorder },
        ]}
      >
        <View style={styles.statusTextCol}>
          <Text style={[styles.kicker, baseFont, { color: theme.accent }]}>
            {isWins ? 'SMALL WINS' : 'FINDING BALANCE'}
          </Text>
          {!!group.description && (
            <Text style={[styles.descText, baseFont, { color: theme.textPrimary }]}>
              {group.description}
            </Text>
          )}
        </View>

        <Pressable
          accessibilityRole="button"
          accessibilityState={{ selected: joined }}
          onPress={() => onToggleJoin?.(group.id)}
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
      </View>

      {/* ============================================================
          VIBRATION A: SMALL WINS
         ============================================================ */}
      {isWins ? (
        <View
          style={[
            styles.sectionCard,
            { backgroundColor: theme.cardBg, borderColor: theme.divider },
          ]}
        >
          <View style={styles.rowBetween}>
            <Text style={[styles.sectionLabel, baseFont, { color: theme.textSecondary }]}>
              WIN GARLAND · {litFlags}/{GARLAND_SLOTS}
            </Text>
            {celebratedWins.length > 0 && (
              <TouchableOpacity activeOpacity={0.85} onPress={handleResetGarland}>
                <Text style={[styles.actionLink, baseFont, { color: theme.accent }]}>
                  Refresh string
                </Text>
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.garlandRow}>
            {Array.from({ length: GARLAND_SLOTS }, (_, i) => {
              const lit = i < litFlags;
              return (
                <View
                  key={`flag-${i}`}
                  style={[
                    styles.flagBadge,
                    {
                      backgroundColor: lit ? theme.accentSoft : theme.bg,
                      borderColor: lit ? theme.accent : theme.divider,
                    },
                  ]}
                >
                  <Text style={styles.flagEmoji}>{lit ? '✨' : '·'}</Text>
                </View>
              );
            })}
          </View>

          <View style={styles.starterRow}>
            {QUICK_WINS.map((winLabel) => (
              <TouchableOpacity
                key={winLabel}
                activeOpacity={0.85}
                onPress={() => handleLogWin(winLabel)}
                style={[
                  styles.starterChip,
                  { backgroundColor: theme.bg, borderColor: theme.divider },
                ]}
              >
                <Text style={[styles.starterText, baseFont, { color: theme.textPrimary }]}>
                  + {winLabel}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.slipInputRow}>
            <TextInput
              value={winDraft}
              onChangeText={setWinDraft}
              placeholder="Add a tiny win…"
              placeholderTextColor={theme.textMuted}
              maxLength={80}
              onSubmitEditing={() => handleLogWin()}
              style={[
                styles.slipInput,
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
              disabled={!winDraft.trim()}
              onPress={() => handleLogWin()}
              style={[
                styles.dropSlipBtn,
                { backgroundColor: theme.accent },
                !winDraft.trim() && styles.dimmed,
              ]}
            >
              <Text style={[styles.dropSlipText, baseFont, { color: theme.bg }]}>
                Cheer
              </Text>
            </TouchableOpacity>
          </View>

          {celebratedWins.length > 0 && (
            <View style={styles.winShelf}>
              {celebratedWins.slice(0, 5).map((item) => (
                <View
                  key={item.id}
                  style={[
                    styles.winPillRow,
                    { backgroundColor: theme.bg, borderColor: theme.divider },
                  ]}
                >
                  <Text style={[styles.slipBody, baseFont, { color: theme.textPrimary, flex: 1 }]}>
                    {item.label}
                  </Text>
                  <Text style={[styles.mutedTiny, baseFont, { color: theme.textSecondary }]}>
                    {item.tag}
                  </Text>
                </View>
              ))}
            </View>
          )}
        </View>
      ) : (
        /* ============================================================
            VIBRATION B: FINDING BALANCE
           ============================================================ */
        <>
          <View
            style={[
              styles.sectionCard,
              { backgroundColor: theme.cardBg, borderColor: theme.divider },
            ]}
          >
            <View style={styles.rowBetween}>
              <Text style={[styles.sectionLabel, baseFont, { color: theme.textSecondary }]}>
                ANONYMOUS PRESENCE · {anonCount}
              </Text>

              <TouchableOpacity
                activeOpacity={0.85}
                onPress={() => setStewardMode((s) => !s)}
                style={[
                  styles.smallPill,
                  {
                    backgroundColor: stewardMode ? theme.accentSoft : theme.bg,
                    borderColor: stewardMode ? theme.accent : theme.divider,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.smallPillText,
                    baseFont,
                    { color: theme.textPrimary },
                  ]}
                >
                  Steward
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.presenceStrip}>
              {Array.from({ length: anonCount }, (_, idx) => {
                const comp = getCompanion(idx);
                return (
                  <View
                    key={`anon-${idx}`}
                    style={[
                      styles.presenceChip,
                      { backgroundColor: theme.bg, borderColor: theme.divider },
                    ]}
                  >
                    <View
                      style={[
                        styles.miniRing,
                        { backgroundColor: comp.accent || theme.accentSoft },
                      ]}
                    >
                      <Image source={comp.image} style={styles.miniImg} resizeMode="cover" />
                    </View>
                    <View style={[styles.liveDot, { backgroundColor: theme.accent }]} />
                    <Text style={[styles.anonLabel, baseFont, { color: theme.textPrimary }]}>
                      Anon #{idx + 1}
                    </Text>
                  </View>
                );
              })}
            </View>

            {stewardMode && (
              <View
                style={[
                  styles.stewardPanel,
                  { backgroundColor: theme.bg, borderColor: theme.divider },
                ]}
              >
                <View style={styles.rowBetween}>
                  <TouchableOpacity
                    activeOpacity={0.85}
                    onPress={() => setGateLocked((g) => !g)}
                  >
                    <Text style={[styles.actionLink, baseFont, { color: theme.textPrimary }]}>
                      {gateLocked ? 'Locked · Steward approval' : 'Open door'}
                    </Text>
                  </TouchableOpacity>

                  {pendingGuest ? (
                    <TouchableOpacity
                      activeOpacity={0.85}
                      onPress={() => setPendingGuest(false)}
                      style={[styles.admitBtn, { backgroundColor: theme.accent }]}
                    >
                      <Text style={[styles.admitText, baseFont, { color: theme.bg }]}>
                        Allow in (1)
                      </Text>
                    </TouchableOpacity>
                  ) : (
                    <Text style={[styles.mutedTiny, baseFont, { color: theme.textSecondary }]}>
                      No requests
                    </Text>
                  )}
                </View>
              </View>
            )}
          </View>

          <View
            style={[
              styles.sectionCard,
              { backgroundColor: theme.cardBg, borderColor: theme.divider },
            ]}
          >
            <View style={styles.rowBetween}>
              <Text style={[styles.sectionLabel, baseFont, { color: theme.textSecondary }]}>
                SLIP JAR · {slips.length}/{JAR_CAPACITY}
              </Text>

              <TouchableOpacity
                activeOpacity={0.85}
                onPress={() => setShowSlips((v) => !v)}
              >
                <Text style={[styles.actionLink, baseFont, { color: theme.accent }]}>
                  {showSlips ? 'Hide' : 'Slips'} · Burned {releasedCount}
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.meterTrack}>
              {Array.from({ length: JAR_CAPACITY }, (_, i) => (
                <View
                  key={`slot-${i}`}
                  style={[
                    styles.meterSlot,
                    {
                      backgroundColor: i < slips.length ? theme.accent : theme.bg,
                      borderColor: i < slips.length ? theme.accent : theme.divider,
                    },
                  ]}
                />
              ))}
            </View>

            {jarFull ? (
              <View
                style={[
                  styles.fullJarBox,
                  { backgroundColor: theme.bg, borderColor: theme.divider },
                ]}
              >
                <Text style={[styles.fullJarTitle, baseFont, { color: theme.textPrimary }]}>
                  Jar full
                </Text>
                <View style={styles.jarBtnRow}>
                  <TouchableOpacity
                    activeOpacity={0.85}
                    onPress={handleBurnJar}
                    style={[styles.burnBtn, { backgroundColor: theme.accent }]}
                  >
                    <Text style={[styles.burnBtnText, baseFont, { color: theme.bg }]}>
                      Burn
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    activeOpacity={0.85}
                    onPress={handleNewJar}
                    style={[
                      styles.freshBtn,
                      { backgroundColor: theme.cardBg, borderColor: theme.divider },
                    ]}
                  >
                    <Text style={[styles.freshBtnText, baseFont, { color: theme.textPrimary }]}>
                      New jar
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <>
                <View style={styles.slipInputRow}>
                  <TextInput
                    value={slipDraft}
                    onChangeText={setSlipDraft}
                    placeholder="Write a slip…"
                    placeholderTextColor={theme.textMuted}
                    maxLength={90}
                    onSubmitEditing={() => addSlip()}
                    style={[
                      styles.slipInput,
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
                    disabled={!slipDraft.trim()}
                    onPress={() => addSlip()}
                    style={[
                      styles.dropSlipBtn,
                      { backgroundColor: theme.accent },
                      !slipDraft.trim() && styles.dimmed,
                    ]}
                  >
                    <Text style={[styles.dropSlipText, baseFont, { color: theme.bg }]}>
                      Drop
                    </Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.starterRow}>
                  {STARTER_SLIPS.map((sample) => (
                    <TouchableOpacity
                      key={sample}
                      activeOpacity={0.85}
                      onPress={() => addSlip(sample)}
                      style={[
                        styles.starterChip,
                        { backgroundColor: theme.bg, borderColor: theme.divider },
                      ]}
                    >
                      <Text style={[styles.starterText, baseFont, { color: theme.textPrimary }]}>
                        + {sample}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </>
            )}

            {showSlips && slips.length > 0 && (
              <View
                style={[
                  styles.jarContents,
                  { backgroundColor: theme.bg, borderColor: theme.divider },
                ]}
              >
                {slips.map((slip, index) => (
                  <View
                    key={slip.id}
                    style={[
                      styles.slipPaper,
                      { backgroundColor: theme.cardBg, borderColor: theme.divider },
                    ]}
                  >
                    <Text style={[styles.slipNum, baseFont, { color: theme.accent }]}>
                      #{index + 1}
                    </Text>
                    <Text style={[styles.slipBody, baseFont, { color: theme.textPrimary }]}>
                      {slip.text}
                    </Text>
                  </View>
                ))}
              </View>
            )}
          </View>

          <View
            style={[
              styles.sectionCard,
              { backgroundColor: theme.cardBg, borderColor: theme.divider },
            ]}
          >
            <Text style={[styles.sectionLabel, baseFont, { color: theme.textSecondary }]}>
              10-SEAT CIRCLE · SEAT {activeSeat}
            </Text>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.seatsScroll}
            >
              {CIRCLE_SEATS.map((seat) => {
                const selected = activeSeat === seat.seatNumber;
                return (
                  <TouchableOpacity
                    key={seat.seatNumber}
                    activeOpacity={0.85}
                    onPress={() => setActiveSeat(seat.seatNumber)}
                    style={[
                      styles.seatItem,
                      {
                        backgroundColor: selected ? theme.accentSoft : theme.bg,
                        borderColor: selected ? theme.accent : theme.divider,
                      },
                    ]}
                  >
                    <View
                      style={[
                        styles.seatAvatarWrap,
                        { backgroundColor: seat.companion.accent || theme.accentSoft },
                      ]}
                    >
                      <Image
                        source={seat.companion.image}
                        style={styles.seatAvatar}
                        resizeMode="cover"
                      />
                    </View>
                    <Text
                      style={[
                        styles.seatNum,
                        baseFont,
                        { color: theme.textPrimary },
                      ]}
                    >
                      {seat.seatNumber}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        </>
      )}

      {/* WHATSAPP-STYLE CALM CHAT STREAM */}
      <View
        style={[
          styles.sectionCard,
          { backgroundColor: theme.cardBg, borderColor: theme.divider },
        ]}
      >
        <View
          style={[
            styles.chatThread,
            { backgroundColor: theme.bg, borderColor: theme.divider },
          ]}
        >
          <View
            style={[
              styles.roomPill,
              { backgroundColor: theme.cardBg, borderColor: theme.divider },
            ]}
          >
            <Text style={[styles.roomPillText, baseFont, { color: theme.textSecondary }]}>
              {isWins ? 'Cheer thread' : `Seat ${activeSeat}`}
            </Text>
          </View>

          {visiblePosts.length === 0 ? (
            <Text style={[styles.emptyText, baseFont, { color: theme.textSecondary }]}>
              Quiet room.
            </Text>
          ) : (
            visiblePosts.map((post, idx) => {
              const isMine = post.authorId === 'me-local';
              const seatComp = getCompanion(idx);
              const hidden = !!post.contentNote && !revealedNotes[post.id];
              const menuOpen = menuPostId === post.id;

              return (
                <View
                  key={post.id}
                  style={[
                    styles.msgRow,
                    isMine ? styles.msgRowRight : styles.msgRowLeft,
                  ]}
                >
                  {!isMine && (
                    <View
                      style={[
                        styles.chatAvatar,
                        { backgroundColor: seatComp.accent || theme.accentSoft },
                      ]}
                    >
                      <Image
                        source={seatComp.image}
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
                      <Text style={[styles.authorName, baseFont, { color: theme.textPrimary }]}>
                        {isWins ? post.authorHandle : `Seat ${(idx % 10) + 1} · ${post.authorHandle}`}
                      </Text>
                      <Pressable
                        onPress={() => setMenuPostId(menuOpen ? null : post.id)}
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
                            onReportPost?.(post.id);
                            setMenuPostId(null);
                          }}
                          style={[styles.menuChip, { borderColor: theme.accent }]}
                        >
                          <Text style={[styles.menuChipText, baseFont, { color: theme.accent }]}>
                            Report
                          </Text>
                        </Pressable>
                        <Pressable
                          onPress={() => {
                            onBlockAuthor?.(post.authorId);
                            setMenuPostId(null);
                          }}
                          style={[styles.menuChip, { borderColor: theme.divider }]}
                        >
                          <Text style={[styles.menuChipText, baseFont, { color: theme.textSecondary }]}>
                            Block
                          </Text>
                        </Pressable>
                      </View>
                    )}

                    {hidden ? (
                      <Pressable
                        onPress={() =>
                          setRevealedNotes((prev) => ({ ...prev, [post.id]: true }))
                        }
                      >
                        <Text style={[styles.noteLink, baseFont, { color: theme.accent }]}>
                          {post.contentNote} · Tap to open
                        </Text>
                      </Pressable>
                    ) : (
                      <Text style={[styles.bubbleText, baseFont, { color: theme.textPrimary }]}>
                        {post.body}
                      </Text>
                    )}

                    <View style={styles.bubbleFoot}>
                      <View style={styles.reactWrap}>
                        {reactions.map((r) => {
                          const active = !!post.myReactions?.[r.key];
                          return (
                            <Pressable
                              key={r.key}
                              onPress={() => onToggleReaction?.(post.id, r.key)}
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
                        {post.timeLabel} {isMine ? '✓✓' : ''}
                      </Text>
                    </View>
                  </View>
                </View>
              );
            })
          )}
        </View>

        {!joined ? (
          <Text style={[styles.footerHint, baseFont, { color: theme.textSecondary }]}>
            Join to chat.
          </Text>
        ) : !safetyAcknowledged ? (
          <View
            style={[
              styles.safetyNotice,
              { backgroundColor: theme.bg, borderColor: theme.accent },
            ]}
          >
            <Text style={[styles.mutedTiny, baseFont, { color: theme.textPrimary }]}>
              No medical advice or personal contact info.
            </Text>
            <Pressable
              onPress={onAcknowledgeSafety}
              style={[styles.joinBtn, { backgroundColor: theme.accent, alignSelf: 'flex-start' }]}
            >
              <Text style={[styles.admitText, baseFont, { color: theme.bg }]}>
                Enable chat
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
            <TextInput
              value={contentNote}
              onChangeText={setContentNote}
              placeholder="Content note (optional)"
              placeholderTextColor={theme.textMuted}
              maxLength={40}
              style={[
                styles.noteInput,
                baseFont,
                {
                  color: theme.textPrimary,
                  backgroundColor: theme.cardBg,
                  borderColor: theme.divider,
                },
              ]}
            />
            <View style={styles.inputRow}>
              <TextInput
                value={draft}
                onChangeText={setDraft}
                placeholder={isWins ? 'Share a win…' : `Seat ${activeSeat}…`}
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
                disabled={!draft.trim()}
                onPress={handleSend}
                style={[
                  styles.sendBtn,
                  { backgroundColor: theme.accent },
                  !draft.trim() && styles.dimmed,
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
  garlandRow: {
    flexDirection: 'row',
    gap: 6,
  },
  flagBadge: {
    flex: 1,
    height: 32,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  flagEmoji: {
    fontSize: 14,
  },
  winShelf: {
    gap: 8,
  },
  winPillRow: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 9,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  smallPill: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  smallPillText: {
    fontSize: 12,
    fontWeight: '700',
  },
  presenceStrip: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  presenceChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  miniRing: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  miniImg: {
    width: 20,
    height: 20,
    borderRadius: 10,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  anonLabel: {
    fontSize: 12.5,
    fontWeight: '600',
  },
  stewardPanel: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 12,
  },
  actionLink: {
    fontSize: 12.5,
    fontWeight: '700',
  },
  admitBtn: {
    borderRadius: 999,
    paddingHorizontal: 13,
    paddingVertical: 6,
  },
  admitText: {
    fontSize: 12,
    fontWeight: '700',
  },
  meterTrack: {
    flexDirection: 'row',
    gap: 5,
  },
  meterSlot: {
    flex: 1,
    height: 10,
    borderRadius: 999,
    borderWidth: 1,
  },
  slipInputRow: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  slipInput: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 9,
    fontSize: 13.5,
    fontWeight: '500',
  },
  dropSlipBtn: {
    borderRadius: 14,
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  dropSlipText: {
    fontSize: 13,
    fontWeight: '700',
  },
  starterRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  starterChip: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 11,
    paddingVertical: 6,
  },
  starterText: {
    fontSize: 12,
    fontWeight: '600',
  },
  fullJarBox: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 14,
    gap: 10,
  },
  fullJarTitle: {
    fontSize: 14,
    fontWeight: '700',
  },
  jarBtnRow: {
    flexDirection: 'row',
    gap: 10,
  },
  burnBtn: {
    borderRadius: 999,
    paddingHorizontal: 15,
    paddingVertical: 8,
  },
  burnBtnText: {
    fontSize: 12.5,
    fontWeight: '700',
  },
  freshBtn: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 15,
    paddingVertical: 8,
  },
  freshBtnText: {
    fontSize: 12.5,
    fontWeight: '700',
  },
  jarContents: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 12,
    gap: 8,
  },
  slipPaper: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 9,
    gap: 3,
  },
  slipNum: {
    fontSize: 11,
    fontWeight: '700',
  },
  slipBody: {
    fontSize: 13.5,
    fontWeight: '500',
    lineHeight: 19,
  },
  seatsScroll: {
    gap: 8,
    paddingVertical: 2,
  },
  seatItem: {
    borderWidth: 1,
    borderRadius: 16,
    paddingVertical: 8,
    paddingHorizontal: 10,
    alignItems: 'center',
    gap: 4,
    minWidth: 56,
  },
  seatAvatarWrap: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  seatAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
  },
  seatNum: {
    fontSize: 12,
    fontWeight: '700',
  },
  chatThread: {
    borderWidth: 1,
    borderRadius: 18,
    padding: 14,
    gap: 14,
  },
  roomPill: {
    alignSelf: 'center',
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  roomPillText: {
    fontSize: 11.5,
    fontWeight: '600',
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
    gap: 10,
  },
  authorName: {
    fontSize: 12.5,
    fontWeight: '700',
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
  noteLink: {
    fontSize: 12.5,
    fontWeight: '600',
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
  footerHint: {
    fontSize: 12.5,
    fontWeight: '500',
    textAlign: 'center',
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
  noteInput: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 7,
    fontSize: 12.5,
    fontWeight: '500',
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