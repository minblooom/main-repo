
// src/screens/community/components/TeenDailyPulse.jsx
// Two hooks that bring 13-17 teens back every day:
//  1. Question of the Day — rotating daily prompt, tap one of 4 options, see peer breakdown
//  2. "Today I..." Anonymous Survival Board — peer one-liners + add your own

// src/screens/community/components/TeenDailyPulse.jsx
// Two hooks that bring 13-17 teens back every day:
//  1. Question of the Day — rotating daily prompt, tap one of 4 options, see peer breakdown
//  2. "Today I..." Anonymous Survival Board — peer one-liners + add your own

import React, { useEffect, useRef, useState, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  Platform,
} from 'react-native';
import { rb, s } from './styles/TeenDailyPulse.styles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../../../theme/ThemeContext';

const KEYS = {
  QUESTION: 'mindbloom:teen:question:v1',
  SURVIVAL: 'mindbloom:teen:survival:v1',
};

const QUESTIONS = [
  {
    q: 'School this week felt like...?',
    opts: [
      { id: 'a', label: '🌋 A lot', desc: 'overwhelming' },
      { id: 'b', label: '☁️ Meh', desc: 'just surviving' },
      { id: 'c', label: '🌊 Wavy', desc: 'up and down' },
      { id: 'd', label: '🌻 Fine', desc: 'actually okay' },
    ],
  },
  {
    q: 'If you could skip one thing today, what would it be?',
    opts: [
      { id: 'a', label: '📚 Class', desc: 'one specific class' },
      { id: 'b', label: '😬 A convo', desc: 'an awkward talk' },
      { id: 'c', label: '🪞 My brain', desc: 'overthinking' },
      { id: 'd', label: '📱 Notifications', desc: 'all the noise' },
    ],
  },
  {
    q: 'The version of you that showed up today was...?',
    opts: [
      { id: 'a', label: '😤 Trying', desc: 'against all odds' },
      { id: 'b', label: '🫠 Barely', desc: 'but still here' },
      { id: 'c', label: '😌 Calm-ish', desc: 'surprisingly chill' },
      { id: 'd', label: '🔥 That one', desc: 'actually in it' },
    ],
  },
  {
    q: "What's taking up the most space in your head right now?",
    opts: [
      { id: 'a', label: '📖 School', desc: 'grades / exams' },
      { id: 'b', label: '💔 People', desc: 'friends / family' },
      { id: 'c', label: '🔮 The future', desc: 'what comes next' },
      { id: 'd', label: '🤷 Nothing', desc: 'blessedly empty' },
    ],
  },
  {
    q: 'What kind of day do you need tomorrow to be?',
    opts: [
      { id: 'a', label: '🛌 Rest', desc: 'slow and quiet' },
      { id: 'b', label: '🎯 Progress', desc: 'get something done' },
      { id: 'c', label: '😂 Laugh', desc: 'lighter than today' },
      { id: 'd', label: '🫂 Connect', desc: 'actually feel close to someone' },
    ],
  },
  {
    q: 'One word for how home feels right now?',
    opts: [
      { id: 'a', label: '🏠 Safe', desc: 'my actual comfort' },
      { id: 'b', label: '😶 Tense', desc: 'walking on eggshells' },
      { id: 'c', label: '🌀 Chaotic', desc: 'loud and unpredictable' },
      { id: 'd', label: '😑 Distant', desc: 'everyone in their own world' },
    ],
  },
  {
    q: 'How do you usually deal when things feel too heavy?',
    opts: [
      { id: 'a', label: '🎧 Music', desc: 'just sit in it' },
      { id: 'b', label: '💤 Sleep', desc: 'escape it' },
      { id: 'c', label: '🗣️ Talk', desc: 'find one person' },
      { id: 'd', label: '🏃 Move', desc: 'walk / sport / anything' },
    ],
  },
  {
    q: "What's something small that actually helped today?",
    opts: [
      { id: 'a', label: '☀️ Fresh air', desc: 'just stepping outside' },
      { id: 'b', label: '🫖 Something warm', desc: 'tea / food / comfort' },
      { id: 'c', label: '😄 A moment', desc: 'one genuine laugh' },
      { id: 'd', label: '📵 Quiet', desc: 'phone down, brain off' },
    ],
  },
  {
    q: "If your week had a playlist genre, it'd be...?",
    opts: [
      { id: 'a', label: '😤 Rap / Drill', desc: 'raw and real' },
      { id: 'b', label: '🎸 Alt', desc: 'moody and layered' },
      { id: 'c', label: '🌊 Lo-fi', desc: 'just coping' },
      { id: 'd', label: '🎉 Afrobeats', desc: 'surviving with energy' },
    ],
  },
  {
    q: 'Something you wish adults understood about being your age?',
    opts: [
      { id: 'a', label: '😤 The pressure', desc: "it's a lot more than it looks" },
      { id: 'b', label: '🫙 The quiet', desc: "silence isn't fine" },
      { id: 'c', label: '🫂 Just listen', desc: "we don't need fixing" },
      { id: 'd', label: '⏳ Slow down', desc: "we're still figuring it out" },
    ],
  },
  {
    q: 'Your social battery right now is at...?',
    opts: [
      { id: 'a', label: '🔋 2%', desc: 'please leave me alone' },
      { id: 'b', label: '🔋 40%', desc: 'selective company only' },
      { id: 'c', label: '🔋 70%', desc: 'one good friend, yes' },
      { id: 'd', label: '🔋 100%', desc: "actually let's hang" },
    ],
  },
  {
    q: "What's the smallest win you can claim from today?",
    opts: [
      { id: 'a', label: '📲 Replied', desc: 'to that one message' },
      { id: 'b', label: '🍽️ Ate', desc: 'actually had a meal' },
      { id: 'c', label: '🛁 Showered', desc: 'basics still count' },
      { id: 'd', label: '📖 Showed up', desc: "even when I didn't want to" },
    ],
  },
  {
    q: 'Pick the emoji that describes this week:',
    opts: [
      { id: 'a', label: '🌧️', desc: 'rough all the way through' },
      { id: 'b', label: '🌤️', desc: 'patchy — good and bad' },
      { id: 'c', label: '😶', desc: 'just moving, not feeling much' },
      { id: 'd', label: '🌸', desc: 'actually kind of okay' },
    ],
  },
  {
    q: 'When did you last feel genuinely seen by someone?',
    opts: [
      { id: 'a', label: '📅 Today', desc: 'it happened' },
      { id: 'b', label: '📅 This week', desc: 'at least once' },
      { id: 'c', label: '📅 A while ago', desc: "can't really remember" },
      { id: 'd', label: '❓ Not sure', desc: 'hard to say' },
    ],
  },
  {
    q: "What's one thing you're not ready to talk about yet?",
    opts: [
      { id: 'a', label: '🏫 School', desc: 'that whole situation' },
      { id: 'b', label: '🫂 That person', desc: 'you know who' },
      { id: 'c', label: '🔮 The future', desc: 'what comes after school' },
      { id: 'd', label: '🪞 Me', desc: 'figuring myself out' },
    ],
  },
  {
    q: 'Pick your rest style tonight:',
    opts: [
      { id: 'a', label: '🎧 Headphones in', desc: 'music until I sleep' },
      { id: 'b', label: '📱 Scroll', desc: "mindless and that's okay" },
      { id: 'c', label: '📺 Show', desc: 'comfort episode rerun' },
      { id: 'd', label: '😴 Just sleep', desc: 'nothing, just out' },
    ],
  },
  {
    q: "What's the vibe in your friend group right now?",
    opts: [
      { id: 'a', label: '🔥 Tight', desc: "we're actually good" },
      { id: 'b', label: '😶 Distant', desc: 'something shifted' },
      { id: 'c', label: '🌀 Drama', desc: "it's a lot" },
      { id: 'd', label: '🤷 Solo', desc: "I'm doing my own thing" },
    ],
  },
  {
    q: "If you could talk to yourself a year ago, you'd say...?",
    opts: [
      { id: 'a', label: '😮‍💨 It gets better', desc: 'seriously, it does' },
      { id: 'b', label: '😤 Calm down', desc: "you're overthinking" },
      { id: 'c', label: '🫁 Breathe', desc: 'just slow down' },
      { id: 'd', label: '🎯 Trust yourself', desc: 'you knew more than you thought' },
    ],
  },
  {
    q: 'What does "having a good day" feel like for you?',
    opts: [
      { id: 'a', label: '😌 Calm', desc: 'nothing went wrong' },
      { id: 'b', label: '😄 Laughed', desc: 'genuinely, at least once' },
      { id: 'c', label: '✅ Done', desc: 'got what I needed to done' },
      { id: 'd', label: '🫂 Connected', desc: 'felt close to someone real' },
    ],
  },
  {
    q: 'Your anxiety today is showing up as...?',
    opts: [
      { id: 'a', label: '😤 Irritated', desc: 'snapping at everything' },
      { id: 'b', label: '🫠 Numb', desc: 'just checked out' },
      { id: 'c', label: '🌀 Spinning', desc: 'overthinking loops' },
      { id: 'd', label: '😶 Quiet', desc: 'just there under the surface' },
    ],
  },
  {
    q: "Pick the thing you're low-key proud of this week:",
    opts: [
      { id: 'a', label: '📤 Sent that text', desc: 'even though it was hard' },
      { id: 'b', label: '🛌 Rested', desc: 'without guilt' },
      { id: 'c', label: '🗣️ Said something', desc: "when I normally wouldn't" },
      { id: 'd', label: '💪 Kept going', desc: "just didn't stop" },
    ],
  },
  {
    q: "If someone could just do one thing for you today, it'd be...?",
    opts: [
      { id: 'a', label: '🤫 Say nothing', desc: 'just sit with me' },
      { id: 'b', label: '🫂 A hug', desc: 'genuine, no words' },
      { id: 'c', label: '😄 Make me laugh', desc: 'distract me a bit' },
      { id: 'd', label: '🫖 Bring food', desc: 'acts of service, please' },
    ],
  },
  {
    q: 'How honest are you with the people closest to you?',
    opts: [
      { id: 'a', label: '💯 Very', desc: 'they know the real me' },
      { id: 'b', label: '🙂 Mostly', desc: 'some things I keep back' },
      { id: 'c', label: '😶 Not really', desc: 'I wear a lot of masks' },
      { id: 'd', label: '🔒 Barely', desc: "it's safer that way" },
    ],
  },
  {
    q: 'Pick the energy you are putting out into the world today:',
    opts: [
      { id: 'a', label: '🌱 Growing', desc: 'quietly becoming' },
      { id: 'b', label: '🛡️ Surviving', desc: 'just holding the line' },
      { id: 'c', label: '🔥 Burning', desc: 'too much going on' },
      { id: 'd', label: '🌊 Flowing', desc: 'going with it today' },
    ],
  },
  {
    q: "The one thing you'd change about your day today?",
    opts: [
      { id: 'a', label: '🛌 More sleep', desc: 'I was running on empty' },
      { id: 'b', label: '🤐 Said less', desc: 'I over-explained myself' },
      { id: 'c', label: '💪 Done more', desc: 'I avoided something' },
      { id: 'd', label: '🫂 Been kinder', desc: 'to myself first' },
    ],
  },
  {
    q: 'What does being strong look like for you on hard days?',
    opts: [
      { id: 'a', label: '😤 Push through', desc: 'keep moving no matter what' },
      { id: 'b', label: '🛌 Rest', desc: 'let myself stop' },
      { id: 'c', label: '🗣️ Ask for help', desc: "even when it's hard" },
      { id: 'd', label: '😮‍💨 Just breathe', desc: 'get through the moment' },
    ],
  },
  {
    q: 'Pick what home means to you right now:',
    opts: [
      { id: 'a', label: '🛋️ Comfort', desc: 'my actual safe place' },
      { id: 'b', label: '🎧 My room', desc: 'just me and my space' },
      { id: 'c', label: '🫂 A person', desc: 'someone, not a place' },
      { id: 'd', label: '🌍 Still looking', desc: "haven't found it yet" },
    ],
  },
  {
    q: 'Your confidence this week has been...?',
    opts: [
      { id: 'a', label: '📈 Up', desc: 'more than usual' },
      { id: 'b', label: '📉 Low', desc: 'really struggling' },
      { id: 'c', label: '🌊 Wavy', desc: 'depends on the room' },
      { id: 'd', label: '😶 Not there', desc: 'just getting through' },
    ],
  },
  {
    q: 'If you could be anywhere right now, you would pick...?',
    opts: [
      { id: 'a', label: '🌄 Outside', desc: 'open air, no people' },
      { id: 'b', label: '🛌 My bed', desc: 'blanket, door closed' },
      { id: 'c', label: '🫂 With them', desc: 'that one person' },
      { id: 'd', label: '🗺️ Anywhere', desc: 'just not here' },
    ],
  },
  {
    q: "What's the realest thing you've felt this week?",
    opts: [
      { id: 'a', label: '😤 Frustrated', desc: 'things should be different' },
      { id: 'b', label: '🫙 Empty', desc: 'going through motions' },
      { id: 'c', label: '🌸 Grateful', desc: 'something small hit different' },
      { id: 'd', label: '😮‍💨 Relieved', desc: 'got through something hard' },
    ],
  },
];

const SEED_SURVIVALS = [
  "got out of bed when I really didn't want to",
  'texted back after three days',
  'sat in the cafeteria alone and it was okay',
  'cried it out and felt a bit lighter after',
  'said no to something that would have drained me',
  'made it through a panic attack on my own',
  "submitted that assignment even though it wasn't perfect",
  'drank water and called it self-care',
  'told someone I was struggling for the first time',
  'turned up to class even with zero motivation',
  "didn't explain myself when I didn't have to",
  'let myself feel something instead of pushing it down',
  "spent time alone and it wasn't lonely",
  'asked a question I was afraid looked stupid',
  'kept a promise I made to myself',
  "took a nap and didn't feel guilty about it",
  'got through a whole week without telling anyone I was struggling',
  'chose myself over drama',
  'ate lunch even though the cafeteria felt scary today',
  "sent the apology I'd been sitting on for days",
];

const SURVIVAL_STARTERS = [
  "got out of bed when I really didn't want to",
  'sent that message I was scared to send',
  'made it through without breaking down',
  'chose to rest without feeling guilty',
  'kept going even when I wanted to stop',
  'asked for help for the first time',
  'turned up even though I was running on empty',
  "said something honest when I normally wouldn't",
  'let myself feel it instead of running from it',
  'got through a hard conversation',
  'took one small step even with no motivation',
];

function getTodayKey() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function getQuestionForToday() {
  const now = new Date();
  const startOfYear = new Date(now.getFullYear(), 0, 0);
  const dayOfYear = Math.floor((now - startOfYear) / 86400000);
  return QUESTIONS[dayOfYear % QUESTIONS.length];
}

function ResultBar({ pct, color, theme }) {
  const width = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.spring(width, {
      toValue: pct,
      tension: 100,
      friction: 10,
      useNativeDriver: false,
    }).start();
  }, [pct]);

  return (
    <View style={[rb.track, { backgroundColor: theme.divider }]}>
      <Animated.View
        style={[
          rb.fill,
          {
            width: width.interpolate({ inputRange: [0, 100], outputRange: ['0%', '100%'] }),
            backgroundColor: color,
          },
        ]}
      />
    </View>
  );
}



const BASE_VOTES = [23, 18, 31, 14];
const OPT_COLORS = ['#8B5CF6', '#3B82F6', '#10B981', '#F59E0B'];

function QuestionOfTheDay({ theme }) {
  const [picked, setPicked] = useState(null);
  const revealAnim = useRef(new Animated.Value(0)).current;
  const question = useMemo(() => getQuestionForToday(), []);

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(KEYS.QUESTION);
        if (!raw) return;
        const p = JSON.parse(raw);
        if (p.date === getTodayKey() && p.picked) {
          setPicked(p.picked);
          revealAnim.setValue(1);
        }
      } catch (_err) {}
    })();
  }, [revealAnim]);

  const handlePick = async (optId) => {
    if (picked) return;
    setPicked(optId);
    Animated.spring(revealAnim, {
      toValue: 1,
      tension: 80,
      friction: 9,
      useNativeDriver: false,
    }).start();
    try {
      await AsyncStorage.setItem(
        KEYS.QUESTION,
        JSON.stringify({ date: getTodayKey(), picked: optId })
      );
    } catch (_err) {}
  };

  const totalBase = BASE_VOTES.reduce((sum, v) => sum + v, 0) + (picked ? 1 : 0);
  const getVotes = (idx, optId) => BASE_VOTES[idx] + (picked === optId ? 1 : 0);
  const getPct = (idx, optId) => Math.round((getVotes(idx, optId) / totalBase) * 100);

  return (
    <View
      style={[
        s.card,
        { backgroundColor: theme.cardBg, borderColor: 'rgba(139, 92, 246, 0.2)' },
      ]}
    >
      <View style={s.qHeader}>
        <View style={[s.dayTag, { backgroundColor: 'rgba(139, 92, 246, 0.1)' }]}>
          <Text style={s.dayTagText}>DAILY PULSE</Text>
        </View>
        {picked && (
          <Text style={[s.lockedNote, { color: theme.textMuted }]}>
            Answered · see you tomorrow
          </Text>
        )}
      </View>

      <Text style={[s.qText, { color: theme.textPrimary }]}>{question.q}</Text>

      <View style={{ gap: 8 }}>
        {question.opts.map((opt, idx) => {
          const isMyPick = picked === opt.id;
          const showResult = !!picked;
          const pct = getPct(idx, opt.id);
          return (
            <TouchableOpacity
              key={opt.id}
              onPress={() => handlePick(opt.id)}
              activeOpacity={picked ? 1 : 0.8}
              disabled={!!picked && !isMyPick}
              style={[
                s.optRow,
                {
                  backgroundColor: isMyPick ? 'rgba(139, 92, 246, 0.1)' : theme.bg,
                  borderColor: isMyPick ? OPT_COLORS[idx] : theme.divider,
                  borderWidth: isMyPick ? 1.5 : 1,
                },
              ]}
            >
              <View style={{ flex: 1, gap: 4 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <Text style={[s.optLabel, { color: theme.textPrimary }]}>{opt.label}</Text>
                  <Text style={[s.optDesc, { color: theme.textMuted }]}>{opt.desc}</Text>
                  {isMyPick && (
                    <Text style={{ fontSize: 12, color: OPT_COLORS[idx] }}>· You</Text>
                  )}
                </View>
                {showResult && (
                  <Animated.View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 8,
                      opacity: revealAnim,
                    }}
                  >
                    <ResultBar pct={pct} color={OPT_COLORS[idx]} theme={theme} />
                    <Text style={[s.pctText, { color: OPT_COLORS[idx] }]}>{pct}%</Text>
                  </Animated.View>
                )}
              </View>
            </TouchableOpacity>
          );
        })}
      </View>

      {!picked && (
        <Text style={[s.nudge, { color: theme.textMuted }]}>
          Anonymous · see how peers answered after you tap
        </Text>
      )}
    </View>
  );
}

const DECK_TINTS = [
  { bg: 'rgba(139, 92, 246, 0.08)', border: 'rgba(139, 92, 246, 0.28)', accent: '#6D28D9' },
  { bg: 'rgba(236, 72, 153, 0.07)', border: 'rgba(236, 72, 153, 0.25)', accent: '#BE185D' },
  { bg: 'rgba(14, 165, 233, 0.08)', border: 'rgba(14, 165, 233, 0.26)', accent: '#0369A1' },
  { bg: 'rgba(16, 185, 129, 0.08)', border: 'rgba(16, 185, 129, 0.26)', accent: '#047857' },
  { bg: 'rgba(245, 158, 11, 0.08)', border: 'rgba(245, 158, 11, 0.28)', accent: '#B45309' },
];

function SurvivalBoard({ theme }) {
  const [myEntry, setMyEntry] = useState(null);
  const [showPicker, setShowPicker] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [feltEntries, setFeltEntries] = useState([]);

  const popScale = useRef(new Animated.Value(1)).current;
  const popOpacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(KEYS.SURVIVAL);
        if (!raw) return;
        const p = JSON.parse(raw);
        if (p.date === getTodayKey()) {
          if (p.entry) {
            setMyEntry(p.entry);
            setSubmitted(true);
          }
          if (Array.isArray(p.feltEntries)) {
            setFeltEntries(p.feltEntries);
          }
        }
      } catch (_err) {}
    })();
  }, []);

  const persistSurvival = async (entryVal, feltVal) => {
    try {
      await AsyncStorage.setItem(
        KEYS.SURVIVAL,
        JSON.stringify({
          date: getTodayKey(),
          entry: entryVal,
          feltEntries: feltVal,
        })
      );
    } catch (_err) {}
  };

  const triggerPop = () => {
    popScale.setValue(0.92);
    popOpacity.setValue(0.35);
    Animated.parallel([
      Animated.spring(popScale, {
        toValue: 1,
        tension: 240,
        friction: 8,
        useNativeDriver: Platform.OS !== 'web',
      }),
      Animated.timing(popOpacity, {
        toValue: 1,
        duration: 220,
        useNativeDriver: Platform.OS !== 'web',
      }),
    ]).start();
  };

  const handlePick = async (starter) => {
    setMyEntry(starter);
    setSubmitted(true);
    setShowPicker(false);
    setCurrentIndex(0);
    triggerPop();
    await persistSurvival(starter, feltEntries);
  };

  const board = useMemo(() => {
    const base = [...SEED_SURVIVALS];
    if (myEntry) {
      const filtered = base.filter((item) => item !== myEntry);
      return [myEntry, ...filtered];
    }
    return base;
  }, [myEntry]);

  const safeIndex = currentIndex % board.length;
  const currentEntry = board[safeIndex];
  const isMine = currentEntry === myEntry && submitted;
  const tint = isMine ? DECK_TINTS[0] : DECK_TINTS[safeIndex % DECK_TINTS.length];
  const hasFelt = feltEntries.includes(currentEntry);
  const baseMeToo = 4 + ((safeIndex * 3 + currentEntry.length) % 14);

  const handleNextCard = () => {
    setCurrentIndex((prev) => (prev + 1) % board.length);
    triggerPop();
  };

  const handleToggleFelt = async () => {
    const nextFelt = hasFelt
      ? feltEntries.filter((e) => e !== currentEntry)
      : [...feltEntries, currentEntry];
    setFeltEntries(nextFelt);
    await persistSurvival(myEntry, nextFelt);
  };

  return (
    <View style={{ gap: 10 }}>
      <View style={s.boardHeader}>
        <View style={{ flex: 1, gap: 2 }}>
          <Text style={[s.boardTitle, { color: theme.textPrimary }]}>Today I… 🕯️</Text>
          <Text style={[s.boardSub, { color: theme.textSecondary }]}>
            Tap the card to pop another peer's moment. Anonymous, always.
          </Text>
        </View>
        {!submitted && (
          <TouchableOpacity
            onPress={() => setShowPicker((prev) => !prev)}
            style={[
              s.addBtn,
              {
                backgroundColor: 'rgba(139, 92, 246, 0.1)',
                borderColor: 'rgba(139,92,246,0.3)',
              },
            ]}
            activeOpacity={0.8}
          >
            <Text style={[s.addBtnText, { color: '#7C3AED' }]}>
              {showPicker ? 'Close' : '+ Add yours'}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {showPicker && (
        <View
          style={[
            s.pickerWrap,
            { backgroundColor: theme.cardBg, borderColor: theme.divider },
          ]}
        >
          <Text style={[s.pickerTitle, { color: theme.textSecondary }]}>
            Pick the one that fits — anonymous, no names ever.
          </Text>
          <View style={{ gap: 6 }}>
            {SURVIVAL_STARTERS.map((starter) => (
              <TouchableOpacity
                key={starter}
                onPress={() => handlePick(starter)}
                style={[
                  s.starterRow,
                  { borderColor: theme.divider, backgroundColor: theme.bg },
                ]}
                activeOpacity={0.8}
              >
                <Text style={s.starterCheck}>→</Text>
                <Text style={[s.starterText, { color: theme.textPrimary }]}>
                  Today I {starter}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      {/* Stacked Tap-to-Pop Card Deck */}
      <View style={s.deckContainer}>
        <View
          style={[
            s.deckBackLayer,
            { backgroundColor: theme.cardBg, borderColor: theme.divider },
          ]}
        />
        <Animated.View
          style={[
            s.popCard,
            {
              backgroundColor: tint.bg,
              borderColor: tint.border,
              opacity: popOpacity,
              transform: [{ scale: popScale }],
            },
          ]}
        >
          <TouchableOpacity
            onPress={handleNextCard}
            activeOpacity={0.9}
            accessibilityRole="button"
            accessibilityLabel="Pop next peer moment"
            style={{ gap: 10 }}
          >
            <View style={s.popCardTop}>
              <Text style={[s.entryQuote, { color: tint.accent }]}>“</Text>
              <View style={s.popBadges}>
                {isMine && (
                  <View style={[s.mineBadge, { backgroundColor: 'rgba(124, 58, 237, 0.14)' }]}>
                    <Text style={[s.mineBadgeText, { color: '#6D28D9' }]}>Yours today ✨</Text>
                  </View>
                )}
                <Text style={[s.deckCounter, { color: theme.textMuted }]}>
                  {safeIndex + 1} / {board.length}
                </Text>
              </View>
            </View>

            <Text style={[s.popEntryText, { color: theme.textPrimary }]}>
              Today I {currentEntry}
            </Text>
          </TouchableOpacity>

          <View style={s.popCardFooter}>
            <TouchableOpacity
              onPress={handleToggleFelt}
              activeOpacity={0.82}
              style={[
                s.meTooBtn,
                {
                  backgroundColor: hasFelt ? tint.accent : 'rgba(255,255,255,0.75)',
                  borderColor: hasFelt ? tint.accent : tint.border,
                },
              ]}
            >
              <Text style={[s.meTooText, { color: hasFelt ? '#fff' : tint.accent }]}>
                {hasFelt ? '🫶 Me too · ' : '🫶 Me too · '}
                {baseMeToo + (hasFelt ? 1 : 0)}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleNextCard}
              activeOpacity={0.8}
              style={[s.nextPill, { borderColor: tint.border, backgroundColor: 'rgba(255,255,255,0.65)' }]}
            >
              <Text style={[s.nextPillText, { color: tint.accent }]}>
                Pop next ✨
              </Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </View>
  );
}

const DEFAULT_THEME = {
  bg: '#F8F7FC',
  cardBg: '#FFFFFF',
  divider: '#E5E7EB',
  textPrimary: '#111827',
  textSecondary: '#4B5563',
  textMuted: '#6B7280',
};

export function TodayISurvivalBoard() {
  const ctxTheme = useTheme ? useTheme() : null;
  const theme = {
    ...DEFAULT_THEME,
    ...(ctxTheme?.theme || ctxTheme || {}),
  };

  return <SurvivalBoard theme={theme} />;
}

export function TeenDailyPulse() {
  const ctxTheme = useTheme ? useTheme() : null;
  const theme = {
    ...DEFAULT_THEME,
    ...(ctxTheme?.theme || ctxTheme || {}),
  };

  return (
    <View style={s.container}>
      <QuestionOfTheDay theme={theme} />
    </View>
  );
}

export default TeenDailyPulse;
