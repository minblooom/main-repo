// src/features/community/baraza/BarazaPresenceBar.jsx
import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Animated,
  Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../../../theme/ThemeContext';
import { COMPANION_MAP } from '../../../constants/companions';

const STORAGE_KEY = 'mindbloom:community:barazaLanterns:v1';
const TEEN_STORAGE_KEY = 'mindbloom:community:teenVibe:v1';

const COMPANION_KEYS = Object.keys(COMPANION_MAP);
const pickCompanion = (index, fallback) =>
  COMPANION_MAP[COMPANION_KEYS[index]] || COMPANION_MAP[fallback] || COMPANION_MAP.noodle;

// ─── ADULT TABLE ────────────────────────────────────────────────────────────
const LANTERNS = [
  {
    key: 'lantern',
    companion: pickCompanion(0, 'noodle'),
    label: 'Light a lantern',
    icon: '🏮',
    baseCount: 18,
    glowBg: '#FFF6E5',
    glowBorder: '#F3D7A4',
    glowAccent: '#9A5B13',
    blessing: 'A warm light is lit in the room for anyone carrying something quietly today.',
  },
  {
    key: 'chai',
    companion: pickCompanion(1, 'pip'),
    label: 'Pour chai',
    icon: '🫖',
    baseCount: 24,
    glowBg: '#F9EFEA',
    glowBorder: '#E7C9BC',
    glowAccent: '#7D442B',
    blessing: 'A fresh cup is poured at the table—sit awhile, no rush to speak.',
  },
  {
    key: 'wildflower',
    companion: pickCompanion(2, 'sunny'),
    label: 'Leave a flower',
    icon: '🌼',
    baseCount: 14,
    glowBg: '#EDF5EE',
    glowBorder: '#CFE5D2',
    glowAccent: '#2C5A38',
    blessing: 'A small wildflower rests on the table—a gentle reminder that growth takes time.',
  },
  {
    key: 'presence',
    companion: pickCompanion(3, 'mochi'),
    label: 'Hold space',
    icon: '🕯️',
    baseCount: 31,
    glowBg: '#F0EAFA',
    glowBorder: '#D9CBEF',
    glowAccent: '#5B3765',
    blessing: 'Steady, quiet company for everyone who simply needed somewhere safe to land.',
  },
];

// ─── TEEN TABLE ─────────────────────────────────────────────────────────────
// 16 vibes across 4 emotional zones. Each responds with a reply that *sees* the teen.
const VIBE_ZONES = [
  { key: 'all',     label: 'All',      color: '#7C3AED' },
  { key: 'heavy',   label: 'Heavy 🌧️',  color: '#3B62C2' },
  { key: 'lowkey',  label: 'Lowkey ☁️', color: '#6B6B6B' },
  { key: 'steady',  label: 'Steady 🌱', color: '#2D7A35' },
  { key: 'hype',    label: 'Hype ✨',   color: '#B84020' },
];

const TEEN_VIBES = [
  // zone: heavy
  { id: 'heavy',    zone: 'heavy',  chillTab: 'pods',    chillCta: '🎧 Unwind in Audio Sanctuary →', emoji: '🌧️', label: 'Heavy',    bg: '#E8F0FF', border: '#BFCFEF', active: '#3B62C2', basePeers: 11, reply: 'That weight is real. You showed up anyway—that takes something.', boostLabel: 'Send a quiet nod 🫶', boostDone: 'Quiet nod sent to the 11 others carrying weight today.' },
  { id: 'tired',    zone: 'heavy',  chillTab: 'pods',    chillCta: '🎧 Rest in Audio Sanctuary →',   emoji: '😶',  label: 'Tired',    bg: '#F3EDFF', border: '#D6C4FF', active: '#6D3FC8', basePeers: 14, reply: 'Tired is allowed. Rest here without explaining yourself.', boostLabel: 'Leave a pillow 🛋️', boostDone: 'Rest energy left on the table for the tired ones.' },
  { id: 'anxious',  zone: 'heavy',  chillTab: 'pods',    chillCta: '🎧 Slow down in Audio →',        emoji: '🌀',  label: 'Anxious',  bg: '#FFF0F0', border: '#FFC5C5', active: '#C23B3B', basePeers: 9,  reply: 'The spiral is loud today. Breathe—you are still in one piece.', boostLabel: 'Drop a slow breath 🌬️', boostDone: 'Slow breath shared with 9 others riding out the noise.' },
  { id: 'sad',      zone: 'heavy',  chillTab: 'pods',    chillCta: '🎧 Listen in Audio Sanctuary →', emoji: '🌊',  label: 'Sad',      bg: '#E8F4FF', border: '#B0D6F5', active: '#1D6FA4', basePeers: 8,  reply: 'Sadness does not need to be earned or explained here. It just is.', boostLabel: 'Sit beside them 🫂', boostDone: 'You sat quietly with everyone feeling low today.' },
  // zone: lowkey / in-between
  { id: 'meh',      zone: 'lowkey', chillTab: 'memes',   chillCta: '😂 Catch Chill Vibes →',         emoji: '☁️',  label: 'Meh',      bg: '#F4F4F4', border: '#D8D8D8', active: '#6B6B6B', basePeers: 22, reply: 'Meh days count. You are still here and that is quietly enough.', boostLabel: 'Same-page fistbump 🤜', boostDone: 'Fistbump dropped for the meh crew.' },
  { id: 'confused', zone: 'lowkey', chillTab: 'stories', chillCta: '✍️ Read Chill Stories →',        emoji: '🤔',  label: 'Confused', bg: '#FFF7E0', border: '#F0D98C', active: '#967413', basePeers: 13, reply: 'Not knowing is not failing. It is just the beginning of figuring out.', boostLabel: 'No-rush signal 🧭', boostDone: 'Sent a "figuring it out too" signal to the table.' },
  { id: 'numb',     zone: 'lowkey', chillTab: 'stories', chillCta: '✍️ Read Chill Stories →',        emoji: '🪨',  label: 'Numb',     bg: '#EEF0F0', border: '#C5CACA', active: '#4A5555', basePeers: 7,  reply: 'Numb is a kind of tired. The feeling will find its way back—no rush.', boostLabel: 'Hold quiet space 🕯️', boostDone: 'Quiet space held—zero pressure to feel anything yet.' },
  { id: 'unseen',   zone: 'lowkey', chillTab: 'stories', chillCta: '✍️ Read Peer Stories →',         emoji: '👻',  label: 'Unseen',   bg: '#F5F0FF', border: '#D3BFFF', active: '#6B3FA0', basePeers: 10, reply: 'You are seen here, fully, even when everywhere else felt invisible.', boostLabel: 'Wave back 👋', boostDone: '10 peers on this table see you right now.' },
  // zone: steady / holding
  { id: 'okay',     zone: 'steady', chillTab: 'stories', chillCta: '✍️ Explore Chill Stories →',     emoji: '☀️',  label: 'Okay',     bg: '#FFFBE6', border: '#F5E08C', active: '#9B7A00', basePeers: 28, reply: 'Okay is enough. Steady days are worth something too.', boostLabel: 'Pass steady vibes 🌤️', boostDone: 'Steady warmth passed onto the table.' },
  { id: 'grateful', zone: 'steady', chillTab: 'stories', chillCta: '✍️ Explore Chill Stories →',     emoji: '🌸',  label: 'Grateful', bg: '#FFF0F7', border: '#F5C0DC', active: '#B03070', basePeers: 17, reply: 'That gratitude—even if it is small—lands warmly on this table.', boostLabel: 'Drop a flower 🌸', boostDone: 'A flower landed in the middle of the room.' },
  { id: 'hopeful',  zone: 'steady', chillTab: 'stories', chillCta: '✍️ Explore Chill Stories →',     emoji: '🌱',  label: 'Hopeful',  bg: '#EDF7EE', border: '#B6DDB8', active: '#2D7A35', basePeers: 15, reply: 'Hope, even a tiny thread of it, is worth protecting today.', boostLabel: 'Water the table 💧', boostDone: 'Shared a little hope with the room.' },
  { id: 'calm',     zone: 'steady', chillTab: 'pods',    chillCta: '🎧 Stay in Audio Sanctuary →',   emoji: '🍃',  label: 'Calm',     bg: '#E8F5F0', border: '#A8D8C8', active: '#1D7A5F', basePeers: 12, reply: 'Calm is rare. Sit in it. Let it linger as long as it wants.', boostLabel: 'Share the chill 🍃', boostDone: 'Chill energy floating across the table.' },
  // zone: hype / good energy
  { id: 'excited',  zone: 'hype',   chillTab: 'memes',   chillCta: '😂 Share the Chill Vibes →',     emoji: '✨',  label: 'Excited',  bg: '#FFF8E0', border: '#FFD97A', active: '#B8860B', basePeers: 9,  reply: 'That spark on the table is contagious—bring it.', boostLabel: 'Toss a spark ⚡', boostDone: 'Spark tossed! The table feels a little brighter.' },
  { id: 'proud',    zone: 'hype',   chillTab: 'memes',   chillCta: '😂 Open Chill Vibes →',          emoji: '🏅',  label: 'Proud',    bg: '#FFF0E8', border: '#FFB899', active: '#C05020', basePeers: 11, reply: 'You earned that feeling. Let yourself claim it without shrinking.', boostLabel: 'Celebrate loud 🎉', boostDone: 'Mini confetti popped for your win today!' },
  { id: 'silly',    zone: 'hype',   chillTab: 'memes',   chillCta: '😂 Open Chill Vibes →',          emoji: '🤪',  label: 'Silly',    bg: '#FFF0FF', border: '#E0AAFF', active: '#8B00CC', basePeers: 16, reply: 'Silly is healthy. The table could use more of this energy today.', boostLabel: 'Drop chaos confetti 🎊', boostDone: 'Certified silly energy added to the table.' },
  { id: 'bold',     zone: 'hype',   chillTab: 'memes',   chillCta: '😂 Open Chill Vibes →',          emoji: '🔥',  label: 'Bold',     bg: '#FFF1EC', border: '#FFBBA0', active: '#B84020', basePeers: 8,  reply: 'Bold and 13–17? That is something. Carry it forward today.', boostLabel: 'Pass the mic 🎤', boostDone: 'Bold energy echoed around the room.' },
];

// A floating chip that bounces when tapped
function VibeChip({ vibe, onPress, picked }) {
  const scale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (picked) {
      Animated.sequence([
        Animated.spring(scale, {
          toValue: 1.09,
          tension: 260,
          friction: 7,
          useNativeDriver: Platform.OS !== 'web',
        }),
        Animated.spring(scale, {
          toValue: 1,
          tension: 200,
          friction: 9,
          useNativeDriver: Platform.OS !== 'web',
        }),
      ]).start();
    }
  }, [picked]);

  return (
    <TouchableOpacity
      onPress={() => onPress(vibe.id)}
      activeOpacity={0.82}
      accessibilityRole="button"
      accessibilityState={{ selected: picked }}
      accessibilityLabel={`Drop vibe: ${vibe.label}`}
    >
      <Animated.View
        style={[
          teenStyles.vibeChip,
          {
            backgroundColor: picked ? vibe.active : vibe.bg,
            borderColor: picked ? vibe.active : vibe.border,
            transform: [{ scale }],
          },
        ]}
      >
        <Text style={teenStyles.vibeEmoji}>{vibe.emoji}</Text>
        <Text style={[teenStyles.vibeLabel, { color: picked ? '#fff' : vibe.active }]}>
          {vibe.label}
        </Text>
        <Text style={[teenStyles.vibeCount, { color: picked ? 'rgba(255,255,255,0.85)' : vibe.active }]}>
          {vibe.basePeers + (picked ? 1 : 0)}
        </Text>
      </Animated.View>
    </TouchableOpacity>
  );
}

// Teen Baraza Table — interactive vibe cloud + live room mood meter + echo boost
function TeenBarazaTable({ storageKey, theme, onOpenChill }) {
  const [pickedId, setPickedId] = useState(null);
  const [activeZone, setActiveZone] = useState('all');
  const [boostSent, setBoostSent] = useState(false);
  const replyFade = useRef(new Animated.Value(0)).current;
  const boostScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(storageKey);
        if (!raw || !active) return;
        const parsed = JSON.parse(raw);
        const today = new Date().toISOString().slice(0, 10);
        if (parsed?.date === today && parsed?.vibeId) {
          setPickedId(parsed.vibeId);
          setBoostSent(Boolean(parsed?.boostSent));
          Animated.timing(replyFade, { toValue: 1, duration: 400, useNativeDriver: Platform.OS !== 'web' }).start();
        }
      } catch {}
    })();
    return () => { active = false; };
  }, [storageKey]);

  const persistState = async (vibeId, didBoost) => {
    try {
      const today = new Date().toISOString().slice(0, 10);
      await AsyncStorage.setItem(
        storageKey,
        JSON.stringify({ date: today, vibeId, boostSent: didBoost })
      );
    } catch {}
  };

  const handlePick = async (id) => {
    const next = pickedId === id ? null : id;
    setPickedId(next);
    setBoostSent(false);
    replyFade.setValue(0);
    if (next) {
      Animated.timing(replyFade, { toValue: 1, duration: 420, useNativeDriver: Platform.OS !== 'web' }).start();
    }
    await persistState(next, false);
  };

  const handleSurpriseVibe = () => {
    const pool = activeZone === 'all'
      ? TEEN_VIBES
      : TEEN_VIBES.filter((v) => v.zone === activeZone);
    const candidates = pool.filter((v) => v.id !== pickedId);
    const chosen = (candidates.length > 0 ? candidates : pool)[
      Math.floor(Math.random() * (candidates.length > 0 ? candidates.length : pool.length))
    ];
    if (chosen) handlePick(chosen.id);
  };

  const handleSendBoost = async () => {
    if (!pickedId || boostSent) return;
    setBoostSent(true);
    Animated.sequence([
      Animated.spring(boostScale, { toValue: 1.08, tension: 260, friction: 6, useNativeDriver: Platform.OS !== 'web' }),
      Animated.spring(boostScale, { toValue: 1, tension: 200, friction: 8, useNativeDriver: Platform.OS !== 'web' }),
    ]).start();
    await persistState(pickedId, true);
  };

  const picked = TEEN_VIBES.find((v) => v.id === pickedId) ?? null;
  const visibleVibes = activeZone === 'all'
    ? TEEN_VIBES
    : TEEN_VIBES.filter((v) => v.zone === activeZone);

  // Collective room mood breakdown across the 4 zones
  const zoneTotals = {
    heavy: TEEN_VIBES.filter((v) => v.zone === 'heavy').reduce((s, v) => s + v.basePeers + (v.id === pickedId ? 1 : 0), 0),
    lowkey: TEEN_VIBES.filter((v) => v.zone === 'lowkey').reduce((s, v) => s + v.basePeers + (v.id === pickedId ? 1 : 0), 0),
    steady: TEEN_VIBES.filter((v) => v.zone === 'steady').reduce((s, v) => s + v.basePeers + (v.id === pickedId ? 1 : 0), 0),
    hype: TEEN_VIBES.filter((v) => v.zone === 'hype').reduce((s, v) => s + v.basePeers + (v.id === pickedId ? 1 : 0), 0),
  };
  const totalVibesToday = zoneTotals.heavy + zoneTotals.lowkey + zoneTotals.steady + zoneTotals.hype + (boostSent ? 1 : 0);

  return (
    <View style={{ gap: 14 }}>
      {/* Title + Surprise Me Dice */}
      <View style={teenStyles.headerRow}>
        <View style={{ flex: 1, gap: 2 }}>
          <Text style={[teenStyles.heading, { color: theme.textPrimary }]}>
            Drop your vibe 🎲
          </Text>
          <Text style={[teenStyles.subheading, { color: theme.textSecondary }]}>
            One tap. Anonymous. See what the room feels like today.
          </Text>
        </View>
        <TouchableOpacity
          onPress={handleSurpriseVibe}
          activeOpacity={0.82}
          accessibilityRole="button"
          accessibilityLabel="Pick a random vibe"
          style={[teenStyles.diceBtn, { backgroundColor: theme.heroBg, borderColor: theme.heroBorder }]}
        >
          <Text style={{ fontSize: 13 }}>🎲</Text>
          <Text style={[teenStyles.diceBtnText, { color: theme.accent }]}>
            Roll vibe
          </Text>
        </TouchableOpacity>
      </View>

      {/* Collective Room Mood Meter */}
      <View style={teenStyles.meterWrap}>
        <View style={teenStyles.meterBar}>
          <View style={{ flex: zoneTotals.heavy, backgroundColor: '#6B8FE8' }} />
          <View style={{ flex: zoneTotals.lowkey, backgroundColor: '#A3A3B2' }} />
          <View style={{ flex: zoneTotals.steady, backgroundColor: '#56B870' }} />
          <View style={{ flex: zoneTotals.hype, backgroundColor: '#F59E0B' }} />
        </View>
        <Text style={[teenStyles.meterCaption, { color: theme.textMuted }]}>
          Room mood: {Math.round((zoneTotals.heavy / totalVibesToday) * 100)}% Heavy · {Math.round((zoneTotals.lowkey / totalVibesToday) * 100)}% Lowkey · {Math.round((zoneTotals.steady / totalVibesToday) * 100)}% Steady · {Math.round((zoneTotals.hype / totalVibesToday) * 100)}% Hype
        </Text>
      </View>

      {/* Zone Filter Tabs */}
      <View style={teenStyles.zoneRow}>
        {VIBE_ZONES.map((z) => {
          const isSelected = activeZone === z.key;
          return (
            <TouchableOpacity
              key={z.key}
              onPress={() => setActiveZone(z.key)}
              activeOpacity={0.8}
              style={[
                teenStyles.zoneTab,
                {
                  backgroundColor: isSelected ? z.color : theme.bg,
                  borderColor: isSelected ? z.color : theme.divider,
                },
              ]}
            >
              <Text style={[teenStyles.zoneTabText, { color: isSelected ? '#fff' : theme.textSecondary }]}>
                {z.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Vibe Cloud */}
      <View style={teenStyles.cloud}>
        {visibleVibes.map((vibe) => (
          <VibeChip
            key={vibe.id}
            vibe={vibe}
            onPress={handlePick}
            picked={pickedId === vibe.id}
          />
        ))}
      </View>

      {/* Reply + Interactive Echo Boost */}
      {picked && (
        <Animated.View
          style={[
            teenStyles.replyBox,
            { backgroundColor: picked.bg, borderColor: picked.border, opacity: replyFade },
          ]}
        >
          <View style={teenStyles.replyTop}>
            <Text style={{ fontSize: 22 }}>{picked.emoji}</Text>
            <View style={{ flex: 1, gap: 4 }}>
              <Text style={[teenStyles.peerTwinText, { color: picked.active }]}>
                You + {picked.basePeers} peers feel {picked.label.toLowerCase()} today
              </Text>
              <Text style={[teenStyles.replyText, { color: picked.active }]}>
                {picked.reply}
              </Text>
            </View>
          </View>

          <View style={teenStyles.replyActionsRow}>
            <Animated.View style={{ transform: [{ scale: boostScale }] }}>
              <TouchableOpacity
                onPress={handleSendBoost}
                disabled={boostSent}
                activeOpacity={0.84}
                style={[
                  teenStyles.boostBtn,
                  {
                    backgroundColor: boostSent ? 'rgba(255,255,255,0.7)' : picked.active,
                    borderColor: picked.active,
                  },
                ]}
              >
                <Text style={[teenStyles.boostBtnText, { color: boostSent ? picked.active : '#fff' }]}>
                  {boostSent ? `✓ ${picked.boostDone}` : picked.boostLabel}
                </Text>
              </TouchableOpacity>
            </Animated.View>

            {typeof onOpenChill === 'function' && (
              <TouchableOpacity
                onPress={() => onOpenChill(picked.chillTab, picked.label)}
                activeOpacity={0.84}
                style={[
                  teenStyles.chillBtn,
                  {
                    backgroundColor: 'rgba(255,255,255,0.85)',
                    borderColor: picked.border,
                  },
                ]}
              >
                <Text style={[teenStyles.chillBtnText, { color: picked.active }]}>
                  {picked.chillCta}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </Animated.View>
      )}

      {/* Live table pulse — total vibes dropped today */}
      <View style={[teenStyles.pulsePill, { backgroundColor: theme.heroBg, borderColor: theme.heroBorder }]}>
        <View style={teenStyles.liveDot} />
        <Text style={[teenStyles.pulseText, { color: theme.textMuted }]}>
          {totalVibesToday} vibes on the table today
          {pickedId ? ' · Your vibe is in there' : ''}
        </Text>
      </View>
    </View>
  );
}

export const BarazaPresenceBar = ({ cohortKey = '18-24', onOpenChill }) => {
  const { theme } = useTheme();
  const [litKeys, setLitKeys] = useState([]);
  const [activeKey, setActiveKey] = useState(null);
  const storageKey = `${STORAGE_KEY}:${cohortKey}`;
  const isTeen = cohortKey === '13-17';

  useEffect(() => {
    if (isTeen) return; // teen table handles its own storage
    let active = true;
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(storageKey);
        if (active && raw) {
          const parsed = JSON.parse(raw);
          const today = new Date().toISOString().slice(0, 10);
          if (parsed?.date === today && Array.isArray(parsed?.litKeys)) {
            setLitKeys(parsed.litKeys);
            if (parsed.litKeys.length > 0) {
              setActiveKey(parsed.litKeys[parsed.litKeys.length - 1]);
            }
          }
        }
      } catch {}
    })();
    return () => { active = false; };
  }, [storageKey, isTeen]);

  const toggleLantern = async (key) => {
    const alreadyLit = litKeys.includes(key);
    const nextLit = alreadyLit
      ? litKeys.filter((k) => k !== key)
      : [...litKeys, key];
    setLitKeys(nextLit);
    setActiveKey(alreadyLit ? nextLit[nextLit.length - 1] ?? null : key);
    try {
      const today = new Date().toISOString().slice(0, 10);
      await AsyncStorage.setItem(storageKey, JSON.stringify({ date: today, litKeys: nextLit }));
    } catch {}
  };

  const totalTableGlow = LANTERNS.reduce((sum, item) => sum + item.baseCount, 0) + litKeys.length;
  const activeLantern = LANTERNS.find((l) => l.key === activeKey) ?? null;

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: theme.cardBg,
          borderColor: isTeen ? 'rgba(155, 93, 229, 0.25)' : theme.heroBorder,
        },
      ]}
    >
      {isTeen ? (
        // ─── TEEN: Drop Your Vibe ────────────────────────────────────────
        <TeenBarazaTable
          storageKey={TEEN_STORAGE_KEY}
          theme={theme}
          onOpenChill={onOpenChill}
        />
      ) : (
        // ─── ADULT: Lantern Table ────────────────────────────────────────
        <>
          <View style={styles.topRow}>
            <View style={styles.titleBlock}>
              <Text style={[styles.question, { color: theme.textPrimary }]}>
                The Baraza table
              </Text>
              <Text style={[styles.subline, { color: theme.textSecondary }]}>
                Leave a quiet gesture for others gathering here today.
              </Text>
            </View>
            <View style={[styles.counterPill, { backgroundColor: theme.heroBg, borderColor: theme.heroBorder }]}>
              <Text style={[styles.counterText, { color: theme.accent }]}>
                ✨ {totalTableGlow} warmths today
              </Text>
            </View>
          </View>

          <View style={styles.tileRow}>
            {LANTERNS.map((item) => {
              const isLit = litKeys.includes(item.key);
              const count = item.baseCount + (isLit ? 1 : 0);
              const accentBg = item.companion?.accent || theme.accentSoft;
              return (
                <TouchableOpacity
                  key={item.key}
                  accessibilityRole="button"
                  accessibilityState={{ selected: isLit }}
                  accessibilityLabel={`${item.label}, ${count} shared today`}
                  activeOpacity={0.85}
                  onPress={() => toggleLantern(item.key)}
                  style={[
                    styles.tile,
                    { backgroundColor: isLit ? item.glowBg : theme.bg, borderColor: isLit ? item.glowBorder : theme.divider },
                  ]}
                >
                  <View style={styles.avatarWrap}>
                    <View style={[styles.avatarRing, { backgroundColor: accentBg, borderColor: isLit ? item.glowAccent : 'transparent' }]}>
                      <Image source={item.companion.image} style={styles.avatarImg} resizeMode="cover" />
                    </View>
                    <View style={[styles.badgeCircle, { backgroundColor: isLit ? item.glowAccent : theme.cardBg, borderColor: isLit ? item.glowBg : theme.divider }]}>
                      <Text style={styles.badgeEmoji}>{item.icon}</Text>
                    </View>
                  </View>
                  <Text numberOfLines={1} style={[styles.tileLabel, { color: isLit ? item.glowAccent : theme.textPrimary }]}>{item.label}</Text>
                  <Text style={[styles.tileCount, { color: isLit ? item.glowAccent : theme.textMuted }]}>
                    {isLit ? `Lit · ${count}` : `${count} shared`}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {activeLantern && (
            <View style={[styles.blessingBox, { backgroundColor: activeLantern.glowBg, borderColor: activeLantern.glowBorder }]} accessibilityLiveRegion="polite">
              <Text style={styles.blessingIcon}>{activeLantern.icon}</Text>
              <Text style={[styles.blessingText, { color: activeLantern.glowAccent }]}>{activeLantern.blessing}</Text>
            </View>
          )}
        </>
      )}
    </View>
  );
};

// ─── Teen-specific styles ────────────────────────────────────────────────────
const teenStyles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 10,
    flexWrap: 'wrap',
  },
  heading: {
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: -0.2,
  },
  subheading: {
    fontSize: 12.5,
    lineHeight: 18,
    marginTop: 2,
  },
  diceBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 11,
    paddingVertical: 6,
    borderRadius: 99,
    borderWidth: 1,
  },
  diceBtnText: {
    fontSize: 11.5,
    fontWeight: '800',
  },
  meterWrap: {
    gap: 6,
  },
  meterBar: {
    flexDirection: 'row',
    height: 7,
    borderRadius: 99,
    overflow: 'hidden',
    gap: 2,
  },
  meterCaption: {
    fontSize: 11,
    fontWeight: '600',
  },
  zoneRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  zoneTab: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 99,
    borderWidth: 1,
  },
  zoneTabText: {
    fontSize: 11.5,
    fontWeight: '700',
  },
  cloud: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  vibeChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 11,
    paddingVertical: 7,
    borderRadius: 99,
    borderWidth: 1.5,
  },
  vibeEmoji: {
    fontSize: 14,
  },
  vibeLabel: {
    fontSize: 12.5,
    fontWeight: '700',
  },
  vibeCount: {
    fontSize: 10.5,
    fontWeight: '700',
    marginLeft: 1,
  },
  replyBox: {
    gap: 10,
    padding: 13,
    borderRadius: 16,
    borderWidth: 1,
  },
  replyTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  peerTwinText: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.2,
    textTransform: 'uppercase',
  },
  replyText: {
    fontSize: 13,
    fontWeight: '600',
    lineHeight: 19,
  },
  boostBtn: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 99,
    borderWidth: 1,
  },
  boostBtnText: {
    fontSize: 12,
    fontWeight: '800',
  },
  replyActionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 8,
  },
  chillBtn: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 99,
    borderWidth: 1,
  },
  chillBtnText: {
    fontSize: 12,
    fontWeight: '800',
  },
  pulsePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 99,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  liveDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: '#8B5CF6',
  },
  pulseText: {
    fontSize: 11.5,
    fontWeight: '600',
  },
});

const styles = StyleSheet.create({
  card: {
    borderRadius: 22,
    padding: 18,
    borderWidth: 1,
    gap: 14,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 10,
  },
  titleBlock: {
    flex: 1,
    minWidth: 180,
    gap: 2,
  },
  question: {
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: -0.2,
  },
  subline: {
    fontSize: 12.5,
    lineHeight: 18,
  },
  counterPill: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  counterText: {
    fontSize: 11.5,
    fontWeight: '800',
  },
  tileRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  tile: {
    flex: 1,
    minWidth: 110,
    borderWidth: 1,
    borderRadius: 18,
    paddingVertical: 12,
    paddingHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  avatarWrap: {
    position: 'relative',
    marginBottom: 2,
  },
  avatarRing: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  avatarImg: {
    width: 42,
    height: 42,
    borderRadius: 21,
  },
  badgeCircle: {
    position: 'absolute',
    right: -4,
    bottom: -2,
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeEmoji: {
    fontSize: 11,
  },
  tileLabel: {
    fontSize: 12.5,
    fontWeight: '800',
    textAlign: 'center',
  },
  tileCount: {
    fontSize: 11,
    fontWeight: '600',
  },
  blessingBox: {
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 11,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  blessingIcon: {
    fontSize: 18,
  },
  blessingText: {
    flex: 1,
    fontSize: 13,
    fontWeight: '600',
    lineHeight: 19,
  },
});