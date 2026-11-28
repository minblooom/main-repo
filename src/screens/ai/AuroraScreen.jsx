// src/screens/ai/AuroraScreen.jsx
// Aurora AI Companion — Vent, Reflect, or Guide with distress detection,
// evidence-based coping pivots, before/after intensity check-ins, and Crisis Shield.

import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { styles } from './styles/AuroraScreen.styles';
import { ArrowUp, Mic, RotateCcw, ShieldAlert, Sparkles, X } from 'lucide-react-native';
import { useTheme } from '../../theme/ThemeContext';
import { useI18n } from '../../services/i18n';
import { AnimatedCompanion } from '../../components/companion/AnimatedCompanion';
import { CrisisShieldModal } from '../../components/CrisisShieldModal';
import { analyzeTextSafety } from '../../core/safety/safetyFilter';
import { apiClient } from '../../core/api/client';
import { onboardingStorage } from '../../services/onboardingStorage';
import { encryptedStorage } from '../../services/encryptedStorage';
import { normalizeAgeBand } from '../../features/community/services/circleMatchingService';
import {
  isSpeechRecognitionSupported,
  createDictationSession,
} from '../../services/voiceNoteService';

const AURORA_STORAGE_KEY = 'mindbloom:aurora:thread:v1';

const MODE_CONFIG = {
  vent: {
    label: 'Vent',
    emoji: '🌊',
    desc: 'Safe space to release without filter or judgment',
    placeholder: 'Vent what is weighing on you right now...',
  },
  reflect: {
    label: 'Reflect',
    emoji: '🪞',
    desc: 'Gentle space for mindful self-inquiry & clarity',
    placeholder: 'What is on your mind today?',
  },
  guide: {
    label: 'Guide',
    emoji: '🧭',
    desc: 'Actionable CBT reframing & nervous system steps',
    placeholder: 'What challenge would you like guidance on?',
  },
};

const ADULT_STARTER_PROMPTS = [
  { text: 'Feeling overwhelmed by everything today 🌿', mode: 'vent' },
  { text: 'Help me reframe an anxious thought 💭', mode: 'reflect' },
  { text: 'Take me through a 2-minute breathing reset 🌬️', mode: 'guide' },
  { text: 'Work & study pressure is getting heavy 💼', mode: 'vent' },
];

const TEEN_STARTER_PROMPTS = [
  { text: 'School & exam pressure is getting loud 🎒', mode: 'vent' },
  { text: 'Feeling left out or misunderstood lately 🫧', mode: 'reflect' },
  { text: 'Take me through a 2-minute breathing reset 🌬️', mode: 'guide' },
  { text: 'I cannot stop overthinking tonight 🌙', mode: 'reflect' },
];

const DISTRESS_MARKERS = {
  high: [
    'panic',
    'cant breathe',
    "can't breathe",
    'shaking',
    'hopeless',
    'breakdown',
    'done with everything',
    'numb',
    'worthless',
  ],
  medium: [
    'overwhelmed',
    'anxious',
    'stressed',
    'burnout',
    'burned out',
    'heavy',
    'tired',
    'drained',
    'cant cope',
    "can't cope",
  ],
};

const METHOD_FAILURE_PATTERN =
  /(not working|doesnt work|doesn't work|didnt work|didn't work|not helping|no change|made it worse|still anxious|still panicking|still overwhelmed|already tried|tried that)/i;

const METHOD_KEYWORDS = {
  'box-breathing': /(box breathing|breathe|breathing|inhale|exhale|4-4-4|4-7-8)/i,
  'grounding-54321': /(grounding|5-4-3-2-1|five senses|naming things you can see|disconnected)/i,
  'muscle-relaxation': /(muscle relaxation|pmr|progressive relaxation|tense and release|body scan)/i,
  'thought-reframe': /(reframe|thought|cbt|catastroph|overthink|mindset)/i,
  'movement-reset': /(walk|movement|exercise|stretch|shake it out)/i,
};

const ARTICLE_GROUNDED_TIPS = [
  {
    method: 'box-breathing',
    label: 'Longer-exhale breathing',
    whyItCanHelp:
      'If equal-count breathing is not helping, extending the exhale can increase parasympathetic calming.',
    quickSteps: [
      'Inhale gently for 4 seconds.',
      'Exhale slowly for 6 to 8 seconds.',
      'Repeat for 8 rounds while dropping shoulders and unclenching jaw.',
    ],
  },
  {
    method: 'grounding-54321',
    label: '5-4-3-2-1 sensory grounding',
    whyItCanHelp:
      'Grounding can interrupt spiraling and reconnect attention to the present environment.',
    quickSteps: [
      'Name 5 things you can see.',
      'Name 4 things you can feel physically.',
      'Name 3 things you can hear, 2 you can smell, and 1 you can taste.',
    ],
  },
  {
    method: 'muscle-relaxation',
    label: 'Progressive muscle relaxation',
    whyItCanHelp:
      'When thoughts are loud, body-first regulation can lower physical tension that feeds anxiety.',
    quickSteps: [
      'Tense feet and calves for 5 seconds, then release for 10 seconds.',
      'Repeat with hands, shoulders, and jaw.',
      'Notice warmth or heaviness after each release.',
    ],
  },
  {
    method: 'thought-reframe',
    label: 'Evidence check thought reframe',
    whyItCanHelp:
      'Cognitive reframing helps reduce catastrophic loops by testing thoughts against facts.',
    quickSteps: [
      'Write the distress thought in one sentence.',
      'List evidence for and against it.',
      'Create one balanced replacement thought that is realistic, not fake-positive.',
    ],
  },
  {
    method: 'movement-reset',
    label: '10-minute movement reset',
    whyItCanHelp:
      'Brief movement can reduce physiological arousal and improve mood regulation in the moment.',
    quickSteps: [
      'Do a brisk 10-minute walk or stair loop.',
      'Keep attention on foot pressure and breathing rhythm.',
      'Re-check anxiety intensity from 0 to 10 after movement.',
    ],
  },
];

const METHOD_LABELS = {
  'box-breathing': 'Box Breathing',
  'grounding-54321': '5-4-3-2-1 Grounding',
  'muscle-relaxation': 'Progressive Muscle Relaxation',
  'thought-reframe': 'Thought Reframe',
  'movement-reset': 'Movement Reset',
};

const API_METHOD_MAP = {
  tulia: 'box-breathing',
  grounding: 'grounding-54321',
};

const stripForCompare = (value) =>
  String(value || '')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .replace(/[^a-z0-9 ]/g, '')
    .trim();

const detectDistressProfile = (text) => {
  const normalized = stripForCompare(text);
  const foundHigh = DISTRESS_MARKERS.high.filter((token) => normalized.includes(token));
  if (foundHigh.length > 0) return { level: 'high', signals: foundHigh };
  const foundMedium = DISTRESS_MARKERS.medium.filter((token) => normalized.includes(token));
  if (foundMedium.length > 0) return { level: 'medium', signals: foundMedium };
  return { level: 'low', signals: [] };
};

const hasRecentDuplicate = (candidate, recentAssistantMessages) => {
  const normalizedCandidate = stripForCompare(candidate);
  if (!normalizedCandidate) return true;
  return recentAssistantMessages.some((msg) => {
    const normalizedMsg = stripForCompare(msg);
    return (
      normalizedMsg === normalizedCandidate ||
      normalizedMsg.includes(normalizedCandidate) ||
      normalizedCandidate.includes(normalizedMsg)
    );
  });
};

const chooseVariant = (variants, seedText) => {
  if (!variants.length) return '';
  const seed = String(seedText || '')
    .split('')
    .reduce((sum, char) => sum + char.charCodeAt(0), 0);
  return variants[seed % variants.length];
};

const detectMethodFailure = (text) => METHOD_FAILURE_PATTERN.test(text);

const inferMentionedMethod = (text, recentAssistantMessages) => {
  const haystack = `${text} ${recentAssistantMessages.join(' ')}`;
  for (const method of Object.keys(METHOD_KEYWORDS)) {
    if (METHOD_KEYWORDS[method].test(haystack)) return method;
  }
  return null;
};

const buildMethodFailureReply = ({ text, failedMethod, avoidedMethods, profile }) => {
  const opening = chooseVariant(
    [
      'Thank you for saying that. If that method is not helping, we switch quickly rather than forcing it.',
      'You are doing the right thing by telling me it is not working. We can pivot to another strategy now.',
      'That feedback helps a lot. One tool not working does not mean you are failing — it means we try a better-fit method.',
    ],
    text
  );

  const pivotLine = failedMethod
    ? `We will avoid ${METHOD_LABELS[failedMethod]} for now and switch to alternatives.`
    : 'We will avoid repeating the same strategy and switch to alternatives.';

  const alternatives = ARTICLE_GROUNDED_TIPS.filter(
    (tip) => !avoidedMethods.includes(tip.method)
  ).slice(0, 2);

  const alternativesText = alternatives
    .map((tip, index) => {
      const steps = tip.quickSteps.map((s) => `- ${s}`).join('\n');
      return `${index + 1}) ${tip.label}\nWhy: ${tip.whyItCanHelp}\n${steps}`;
    })
    .join('\n\n');

  const safetyLine =
    profile.level === 'high'
      ? 'If your distress is rising fast, place both feet down, do one slow exhale now, and tap the crisis shield if you feel unsafe.'
      : 'Pick only one of these now and test it for 2 to 3 minutes, then tell me what changed even slightly.';

  return `${opening}\n\n${pivotLine}\n\n${alternativesText}\n\n${safetyLine}`;
};

const inferSuggestedSupport = (text, avoidedMethods = []) => {
  const normalized = stripForCompare(text);
  const candidates = [
    {
      pattern: /(panic|breathe|breath|anxious|overwhelmed|shaking)/,
      method: 'box-breathing',
      suggestedTool: 'Guided Breathing',
      suggestedTab: 'soundscapes',
    },
    {
      pattern: /(ground|dizzy|spiral|numb|disconnected)/,
      method: 'grounding-54321',
      suggestedTool: '5-4-3-2-1 Grounding & Audio',
      suggestedTab: 'soundscapes',
    },
    {
      pattern: /(tense|tight|jaw|shoulder|body stress)/,
      method: 'muscle-relaxation',
      suggestedTool: 'Progressive Muscle Relaxation',
    },
    {
      pattern: /(overthink|catastroph|what if|negative thought)/,
      method: 'thought-reframe',
      suggestedTool: 'Thought Reframe Prompt',
    },
  ];

  const matched = candidates.find((c) => c.pattern.test(normalized));
  if (matched && !avoidedMethods.includes(matched.method)) {
    return matched;
  }

  const firstAllowed = candidates.find((c) => !avoidedMethods.includes(c.method));
  return firstAllowed || {};
};

const detectTopicContext = (text) => {
  const n = stripForCompare(text);
  if (/(exam|school|grade|study|teacher|homework|assignment|class)/.test(n)) {
    return 'School and exam pressure can make every mistake feel permanent, even when it is just one chapter.';
  }
  if (/(sleep|insomnia|cant sleep|awake|night|3am|2am)/.test(n)) {
    return 'Nighttime tends to amplify worries because everything else goes quiet.';
  }
  if (/(friend|lonely|left out|alone|ignored|nobody|fit in)/.test(n)) {
    return 'Feeling unseen or disconnected from peers hurts deeply—it is human to want people who actually get you.';
  }
  if (/(parent|mom|dad|family|home|expectation)/.test(n)) {
    return 'Navigating expectations at home while trying to protect your own peace is exhausting.';
  }
  if (/(fail|not good enough|stupid|loser|compare|comparison)/.test(n)) {
    return 'That inner critic sounds loud right now, but a harsh thought is not a fact about your worth.';
  }
  return null;
};

const buildLocalCoachingReply = ({ text, mode, profile }) => {
  const topicNote = detectTopicContext(text);

  if (mode === 'vent') {
    const validatingLine = topicNote || chooseVariant(
      [
        'That sounds really heavy, and it makes sense your system feels overloaded right now.',
        'I hear how much you are carrying right now, and I am glad you shared it here.',
        'You are not being dramatic — this sounds genuinely difficult to hold alone.',
      ],
      text
    );
    const groundingLine =
      profile.level === 'high'
        ? 'For the next 30 seconds, keep both feet on the floor and take a slow exhale that is longer than your inhale.'
        : 'If it helps, place one hand on your chest and take one unhurried breath while you read this.';
    return `${validatingLine}\n\n${groundingLine}\n\nDo you want me to just stay with you and listen, or offer one practical step next?`;
  }

  if (mode === 'reflect') {
    const opening = topicNote || chooseVariant(
      [
        'Let us slow this down and get clearer together.',
        'We can map what is happening inside without judging it.',
        'You are already doing the hardest part by pausing to reflect.',
      ],
      text
    );
    const promptA =
      profile.level === 'high'
        ? 'What is the loudest thought in your mind right now, word-for-word?'
        : 'What story is your mind telling you about this situation?';
    const promptB = 'What evidence supports that story, and what evidence does not fully support it?';
    const promptC =
      'If a close friend said this about themselves, what kinder but honest response would you offer them?';
    return `${opening}\n\nTry this reflection:\n1) ${promptA}\n2) ${promptB}\n3) ${promptC}`;
  }

  const opening = topicNote || chooseVariant(
    [
      'Let us make a short plan you can use immediately.',
      'Here is a clear step-by-step reset for the next few minutes.',
      'We will keep this practical and doable right now.',
    ],
    text
  );
  const step1 =
    profile.level === 'high'
      ? 'Step 1 (60 sec): Inhale 4, exhale 6 for 6 rounds while looking at one stable object.'
      : 'Step 1 (60 sec): Unclench jaw, drop shoulders, and take 5 slow breaths.';
  const step2 =
    'Step 2 (2 min): Write the main stressor in one sentence and circle the part you can influence today.';
  const step3 =
    'Step 3 (10 min): Do one tiny action now that moves the circled part forward.';
  return `${opening}\n\n${step1}\n${step2}\n${step3}\n\nWhen you finish Step 3, tell me what changed from 0 to 10.`;
};

const normalizeAuroraReply = ({ apiReply, text, mode, profile, recentAssistantMessages }) => {
  const fallbackReply = buildLocalCoachingReply({ text, mode, profile });
  const trimmedApiReply = apiReply?.trim();
  if (!trimmedApiReply) return fallbackReply;
  if (hasRecentDuplicate(trimmedApiReply, recentAssistantMessages)) return fallbackReply;
  return trimmedApiReply;
};

const BREATH_PHASES = [
  { label: 'Inhale gently', secs: 4 },
  { label: 'Hold softly', secs: 6 },
  { label: 'Exhale slow', secs: 8 },
];

const GROUNDING_STEPS = [
  '5 things you can see',
  '4 things you can feel',
  '3 things you can hear',
  '2 things you can smell',
  '1 thing you can taste',
];

const InlineMicroTool = ({ method, accent, theme }) => {
  const [running, setRunning] = useState(false);
  const [phaseIdx, setPhaseIdx] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(BREATH_PHASES[0].secs);
  const [checkedSteps, setCheckedSteps] = useState([]);

  useEffect(() => {
    if (!running || method !== 'box-breathing') return;
    const id = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev > 1) return prev - 1;
        setPhaseIdx((p) => {
          const next = (p + 1) % BREATH_PHASES.length;
          setSecondsLeft(BREATH_PHASES[next].secs);
          return next;
        });
        return 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [running, method]);

  if (method === 'box-breathing') {
    const phase = BREATH_PHASES[phaseIdx];
    return (
      <View style={[styles.microToolBox, { backgroundColor: theme?.bg || '#FAF6EF', borderColor: theme?.divider || '#E8DFF2' }]}>
        <View style={styles.microToolRow}>
          <View style={{ flex: 1 }}>
            <Text style={[styles.microToolTitle, { color: theme?.textPrimary || '#2A192E' }]}>
              🌬️ 4-6-8 Breathing Reset
            </Text>
            <Text style={[styles.microToolSub, { color: theme?.textSecondary || '#5C4D60' }]}>
              {running ? `${phase.label} · ${secondsLeft}s` : 'Tap start for a guided 4-6-8 cycle'}
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => {
              if (running) {
                setRunning(false);
              } else {
                setPhaseIdx(0);
                setSecondsLeft(BREATH_PHASES[0].secs);
                setRunning(true);
              }
            }}
            activeOpacity={0.8}
            style={[styles.microToolBtn, { backgroundColor: accent }]}
          >
            <Text style={styles.microToolBtnText}>{running ? 'Pause' : 'Start'}</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  if (method === 'grounding-54321') {
    return (
      <View style={[styles.microToolBox, { backgroundColor: theme?.bg || '#FAF6EF', borderColor: theme?.divider || '#E8DFF2' }]}>
        <Text style={[styles.microToolTitle, { color: theme?.textPrimary || '#2A192E' }]}>
          🌿 5-4-3-2-1 Tap Checklist
        </Text>
        <View style={styles.groundingChips}>
          {GROUNDING_STEPS.map((step) => {
            const done = checkedSteps.includes(step);
            return (
              <TouchableOpacity
                key={step}
                onPress={() =>
                  setCheckedSteps((prev) =>
                    prev.includes(step) ? prev.filter((s) => s !== step) : [...prev, step]
                  )
                }
                activeOpacity={0.8}
                style={[
                  styles.groundingChip,
                  {
                    backgroundColor: done ? accent : theme?.cardBg || '#FFFFFF',
                    borderColor: done ? accent : theme?.divider || '#E8DFF2',
                  },
                ]}
              >
                <Text style={[styles.groundingChipText, { color: done ? '#FFFFFF' : theme?.textPrimary || '#2A192E' }]}>
                  {done ? `✓ ${step}` : step}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    );
  }

  return null;
};

export const AuroraContent = ({
  companionId: propCompanionId,
  userName,
  onNavigateHome,
  onNavigateSoundscapes,
  isWide = false,
}) => {
  const { theme, isDark, companionId: globalCompanionId } = useTheme();
  const { countryData } = useI18n();
  const activeCompanionId = propCompanionId || globalCompanionId || 'noodle';

  const makeGreetingMsg = () => ({
    id: '1',
    role: 'assistant',
    content:
      'Hello friend. I am Aurora. Whether you want to vent, reflect, or just sit quietly together, I am here with you.',
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    emotion: '🌸',
  });

  const [mode, setMode] = useState('reflect');
  const [messages, setMessages] = useState([makeGreetingMsg()]);
  const [historyReady, setHistoryReady] = useState(false);
  const [storageError, setStorageError] = useState('');
  const [userPrefs, setUserPrefs] = useState({
    ageBand: '18-24',
    nickname: userName || 'Friend',
    focusAreas: ['wellness'],
    language: 'en',
  });
  const [isDictating, setIsDictating] = useState(false);
  const [dictationNotice, setDictationNotice] = useState('');
  const [showIntensityPicker, setShowIntensityPicker] = useState(false);

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [sendError, setSendError] = useState('');
  const [crisisVisible, setCrisisVisible] = useState(false);
  const [failedMethods, setFailedMethods] = useState([]);
  const [intensityRating, setIntensityRating] = useState(null);
  const [intensityLog, setIntensityLog] = useState([]);
  const [activeCheckIn, setActiveCheckIn] = useState(null);

  const flatListRef = useRef(null);
  const dictationRef = useRef(null);
  const historySaveQueueRef = useRef(Promise.resolve());
  const skipNextHistorySaveRef = useRef(false);
  const speechSupported = isSpeechRecognitionSupported();

  useEffect(() => {
    let active = true;
    setHistoryReady(false);
    setStorageError('');
    (async () => {
      try {
        const [prefs, savedRaw] = await Promise.all([
          onboardingStorage.getPreferences(),
          encryptedStorage.getItem(AURORA_STORAGE_KEY),
        ]);
        if (!active) return;
        if (prefs) {
          setUserPrefs({
            ageBand: normalizeAgeBand(prefs.ageBand || prefs.ageGroup || prefs.age),
            nickname: prefs.nickname || userName || 'Friend',
            focusAreas: Array.isArray(prefs.focusAreas) ? prefs.focusAreas : ['wellness'],
            language: prefs.language || 'en',
          });
        }
        if (savedRaw) {
          const parsed = JSON.parse(savedRaw);
          if (Array.isArray(parsed?.messages) && parsed.messages.length > 0) {
            setMessages(parsed.messages);
          }
          if (Array.isArray(parsed?.failedMethods)) {
            setFailedMethods(parsed.failedMethods);
          }
          if (Array.isArray(parsed?.intensityLog)) {
            setIntensityLog(parsed.intensityLog);
          }
        }
        setHistoryReady(true);
      } catch (error) {
        console.warn('Could not load encrypted Aurora history:', error);
        if (active) {
          setStorageError('Secure chat storage is unavailable. Aurora history cannot be loaded or saved on this device.');
        }
      }
    })();
    return () => {
      active = false;
      if (dictationRef.current) {
        try {
          dictationRef.current.stop();
        } catch {}
      }
    };
  }, [userName]);

  useEffect(() => {
    if (!historyReady) return undefined;
    if (skipNextHistorySaveRef.current) {
      skipNextHistorySaveRef.current = false;
      return undefined;
    }

    let active = true;
    const saveHistory = historySaveQueueRef.current
      .catch(() => {})
      .then(async () => {
        const saved = await encryptedStorage.setItem(
          AURORA_STORAGE_KEY,
          JSON.stringify({
            messages: messages.slice(-40),
            failedMethods,
            intensityLog: intensityLog.slice(-20),
          }),
        );
        if (active) {
          setStorageError(saved ? '' : 'Aurora could not save this conversation securely on your device.');
        }
      });
    historySaveQueueRef.current = saveHistory;
    saveHistory.catch((error) => {
      console.warn('Could not save encrypted Aurora history:', error);
      if (active) setStorageError('Aurora could not save this conversation securely on your device.');
    });
    return () => {
      active = false;
    };
  }, [messages, failedMethods, intensityLog, historyReady]);

  const handleClearChat = async () => {
    if (!historyReady || loading) return;

    skipNextHistorySaveRef.current = true;
    setMessages([makeGreetingMsg()]);
    setFailedMethods([]);
    setIntensityLog([]);
    setActiveCheckIn(null);
    const clearHistory = historySaveQueueRef.current
      .catch(() => {})
      .then(() => encryptedStorage.removeItem(AURORA_STORAGE_KEY));
    historySaveQueueRef.current = clearHistory.catch(() => {});
    const removed = await clearHistory;
    if (!removed) {
      setStorageError('Aurora could not clear the saved conversation from this device.');
    }
  };

  const toggleDictation = () => {
    if (!speechSupported) {
      setDictationNotice('Voice dictation requires Chrome or Edge on web — you can type anytime below.');
      setTimeout(() => setDictationNotice(''), 4000);
      return;
    }
    setDictationNotice('');
    if (isDictating && dictationRef.current) {
      try {
        dictationRef.current.stop();
      } catch {}
      dictationRef.current = null;
      setIsDictating(false);
      return;
    }
    const session = createDictationSession({
      onTranscript: (transcript) => {
        if (transcript) {
          setInput((prev) => (prev ? `${prev} ${transcript}` : transcript));
        }
      },
      onEnd: () => {
        setIsDictating(false);
        dictationRef.current = null;
      },
      onError: () => {
        setIsDictating(false);
        dictationRef.current = null;
      },
    });
    if (session) {
      dictationRef.current = session;
      setIsDictating(true);
      session.start();
    }
  };

  const starterPrompts =
    userPrefs.ageBand === '13-17' ? TEEN_STARTER_PROMPTS : ADULT_STARTER_PROMPTS;

  const handleNotHelpfulFeedback = (message) => {
    if (message.role !== 'assistant') return;
    const inferredMethod =
      message.suggestedMethod || inferMentionedMethod(message.content, []);
    const avoidedMethods = inferredMethod
      ? Array.from(new Set([...failedMethods, inferredMethod]))
      : failedMethods;

    if (inferredMethod) {
      setFailedMethods((prev) =>
        prev.includes(inferredMethod) ? prev : [...prev, inferredMethod]
      );
    }

    const lastUserText =
      [...messages].reverse().find((m) => m.role === 'user')?.content ||
      'That method did not help me.';
    const distressProfile = detectDistressProfile(lastUserText);
    const failureReply = buildMethodFailureReply({
      text: lastUserText,
      failedMethod: inferredMethod || null,
      avoidedMethods,
      profile: distressProfile,
    });
    const suggestedByContent = inferSuggestedSupport(failureReply, avoidedMethods);

    setMessages((prev) => [
      ...prev,
      {
        id: `${Date.now()}-retry`,
        role: 'assistant',
        content: failureReply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        emotion: distressProfile.level === 'high' ? '💙' : '🌸',
        suggestedTool: suggestedByContent.suggestedTool,
        suggestedTab: suggestedByContent.suggestedTab,
        suggestedMethod: suggestedByContent.method,
      },
    ]);
  };

  const handleAfterIntensityCheckIn = (afterScore) => {
    if (!activeCheckIn) return;
    setIntensityLog((prev) => [
      ...prev,
      {
        id: `${Date.now()}-intensity`,
        method: activeCheckIn.method,
        before: activeCheckIn.before,
        after: afterScore,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
    setIntensityRating(afterScore);
    setActiveCheckIn(null);
  };

  const handleInputChange = (text) => {
    setInput(text);
    setSendError('');
    const safety = analyzeTextSafety(text);
    if (safety.isCritical) {
      setCrisisVisible(true);
    }
  };

  const handleSendPrompt = (promptText, promptMode) => {
    if (promptMode) setMode(promptMode);
    setInput(promptText);
    setTimeout(() => {
      handleSendWithText(promptText, promptMode || mode);
    }, 50);
  };

  const handleSend = () => {
    handleSendWithText(input.trim(), mode);
  };

  const handleSendWithText = async (text, currentMode) => {
    if (!text || loading) return;

    const safety = analyzeTextSafety(text);
    if (safety.isCritical) {
      setCrisisVisible(true);
      return;
    }

    const userMsg = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setSendError('');
    setLoading(true);

    const distressProfile = detectDistressProfile(text);
    const recentAssistantMessages = messages
      .filter((m) => m.role === 'assistant')
      .slice(-3)
      .map((m) => m.content);
    const reportedMethodFailure = detectMethodFailure(text);
    const failedMethod = reportedMethodFailure
      ? inferMentionedMethod(text, recentAssistantMessages)
      : null;

    if (reportedMethodFailure) {
      const avoidedMethods = failedMethod
        ? Array.from(new Set([...failedMethods, failedMethod]))
        : failedMethods;
      if (failedMethod) {
        setFailedMethods((prev) =>
          prev.includes(failedMethod) ? prev : [...prev, failedMethod]
        );
      }
      const failureReply = buildMethodFailureReply({
        text,
        failedMethod,
        avoidedMethods,
        profile: distressProfile,
      });
      const suggestedByContent = inferSuggestedSupport(failureReply, avoidedMethods);
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: failureReply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          emotion: distressProfile.level === 'high' ? '💙' : '🌸',
          suggestedTool: suggestedByContent.suggestedTool,
          suggestedTab: suggestedByContent.suggestedTab,
          suggestedMethod: suggestedByContent.method,
        },
      ]);
      setLoading(false);
      return;
    }

    try {
      const response = await apiClient.post(
        '/aurora',
        {
          message: text,
          mode: currentMode,
          history: messages.slice(-6).map((m) => ({ role: m.role, content: m.content })),
        },
        { timeout: 30000 }
      );

      const reply = normalizeAuroraReply({
        apiReply: response.data?.reply || response.data?.data?.reply,
        text,
        mode: currentMode,
        profile: distressProfile,
        recentAssistantMessages,
      });

      const suggestedByContent = inferSuggestedSupport(`${text} ${reply}`, failedMethods);
      const apiToolId = response.data?.suggestedToolId || response.data?.data?.suggestedToolId;
      const apiSuggestedMethod = apiToolId ? API_METHOD_MAP[apiToolId] : undefined;
      const blockApiSuggestion = !!(apiSuggestedMethod && failedMethods.includes(apiSuggestedMethod));

      const aiMsg = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        emotion: currentMode === 'vent' ? '💙' : currentMode === 'guide' ? '⚡' : '🌸',
        suggestedTool: blockApiSuggestion
          ? suggestedByContent.suggestedTool
          : apiToolId || suggestedByContent.suggestedTool,
        suggestedTab: blockApiSuggestion
          ? suggestedByContent.suggestedTab
          : apiToolId === 'tulia' || apiToolId === 'grounding'
            ? 'soundscapes'
            : suggestedByContent.suggestedTab,
        suggestedMethod: blockApiSuggestion
          ? suggestedByContent.method
          : apiSuggestedMethod || suggestedByContent.method,
      };

      setMessages((prev) => [...prev, aiMsg]);
      if (aiMsg.suggestedMethod && intensityRating !== null) {
        setActiveCheckIn({
          sourceMessageId: aiMsg.id,
          method: aiMsg.suggestedMethod,
          before: intensityRating,
        });
      }
    } catch (error) {
      const errorCode = error?.response?.data?.error?.code;
      const status = error?.response?.status;
      if (errorCode === 'AI_NOT_CONFIGURED') {
        setSendError(
          "Aurora's AI service isn't connected yet. The app owner needs to add a Gemini API key to the backend's Render environment."
        );
      } else if (status === 401) {
        setSendError('Your session has expired. Please sign in again, then retry your message.');
      } else if (errorCode?.startsWith('AI_')) {
        setSendError("Aurora couldn't get an AI reply just now. Please try again shortly.");
      } else {
        setSendError("Aurora couldn't reach the app's AI service. Check your connection and try again.");
      }
      setMessages((prev) => prev.filter((message) => message.id !== userMsg.id));
      setInput(text);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 60);
  }, [messages, loading]);

  const accent = theme?.accent || '#E06D3B';
  const cardBg = theme?.cardBg || '#FFFFFF';
  const borderCol = theme?.heroBorder || theme?.divider || '#E8DFF2';
  const textPrim = theme?.textPrimary || '#2A192E';
  const textSec = theme?.textSecondary || '#5C4D60';
  const textMuted = theme?.textMuted || '#7E726D';

  return (
    <View style={[styles.centerOuter, isWide && { maxWidth: 820, alignSelf: 'center' }]}>
      <View style={styles.centerContainer}>
        {/* Header */}
        <View style={[styles.header, { backgroundColor: cardBg, borderColor: borderCol }]}>
          {onNavigateHome ? (
            <TouchableOpacity style={styles.headerIconButton} onPress={onNavigateHome} activeOpacity={0.7}>
              <X size={20} color={textSec} />
            </TouchableOpacity>
          ) : (
            <View style={{ width: 32 }} />
          )}

          <View style={styles.headerTitleCol}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <AnimatedCompanion
                companionId={activeCompanionId}
                size={40}
                state={loading ? 'breathe' : 'idle'}
                interactive={true}
                showAura={false}
              />
              <View>
                <Text style={[styles.headerTitle, { color: textPrim }]}>AURORA AI</Text>
                <View style={styles.statusRow}>
                  <View style={[styles.statusDot, { backgroundColor: loading ? accent : '#16A34A' }]} />
                  <Text style={[styles.statusText, { color: textMuted }]}>
                    {loading ? 'Tuning in...' : 'By your side'}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            {messages.length > 1 && (
              <TouchableOpacity
                style={[styles.headerIconButton, { padding: 6, opacity: !historyReady || loading ? 0.5 : 1 }]}
                onPress={handleClearChat}
                disabled={!historyReady || loading}
                accessibilityRole="button"
                accessibilityLabel="Clear Aurora chat"
                accessibilityState={{ disabled: !historyReady || loading }}
                activeOpacity={0.75}
              >
                <RotateCcw size={16} color={textSec} />
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={styles.shieldBtn}
              onPress={() => setCrisisVisible(true)}
              activeOpacity={0.8}
            >
              <ShieldAlert size={16} color="#D32F2F" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Mode Selector Banner (Vent / Reflect / Guide) */}
        <View style={[styles.modeBanner, { backgroundColor: cardBg, borderColor: borderCol }]}>
          <View style={styles.modeTabsRow}>
            {['vent', 'reflect', 'guide'].map((m) => {
              const active = mode === m;
              const mConf = MODE_CONFIG[m];
              return (
                <TouchableOpacity
                  key={m}
                  style={[styles.modeTabPill, active && { backgroundColor: accent, borderColor: accent }]}
                  onPress={() => setMode(m)}
                  activeOpacity={0.8}
                >
                  <Text style={styles.modeEmoji}>{mConf.emoji}</Text>
                  <Text
                    style={[
                      styles.modeTabText,
                      { color: active ? '#FFFFFF' : textSec, fontWeight: active ? '800' : '600' },
                    ]}
                  >
                    {mConf.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
          <Text style={[styles.modeSubtitle, { color: textMuted }]}>{MODE_CONFIG[mode].desc}</Text>
        </View>

        <View style={[styles.privacyNotice, { backgroundColor: cardBg, borderColor: borderCol }]}>
          <Text style={[styles.privacyNoticeTitle, { color: textPrim }]}>Your privacy</Text>
          <Text style={[styles.privacyNoticeText, { color: textSec }]}>
            History is encrypted on this device. Aurora sends your message and up to 6 recent messages to Google Gemini through MindBloom’s server; MindBloom does not save chat transcripts to your account. Google's API terms govern its processing.
          </Text>
        </View>
        {storageError ? (
          <Text style={styles.storageWarning} accessibilityRole="alert">
            {storageError}
          </Text>
        ) : null}

        {/* Compact Distress Intensity Toggle */}
        <View style={[styles.intensityCard, { backgroundColor: cardBg, borderColor: borderCol }]}>
          <TouchableOpacity
            onPress={() => setShowIntensityPicker((prev) => !prev)}
            activeOpacity={0.8}
            style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}
          >
            <Text style={[styles.intensityTitle, { color: textMuted }]}>DISTRESS INTENSITY (0–10)</Text>
            <Text style={[styles.intensityValue, { color: accent }]}>
              {intensityRating === null ? 'Tap to rate ▾' : `${intensityRating}/10 ▾`}
            </Text>
          </TouchableOpacity>
          {showIntensityPicker && (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={[styles.intensityRow, { marginTop: 8 }]}
            >
              {Array.from({ length: 11 }, (_, idx) => {
                const active = intensityRating === idx;
                return (
                  <TouchableOpacity
                    key={`current-${idx}`}
                    style={[
                      styles.intensityChip,
                      { backgroundColor: active ? accent : (theme?.bg || '#F2ECE4') },
                    ]}
                    onPress={() => {
                      setIntensityRating(idx);
                      setShowIntensityPicker(false);
                    }}
                    activeOpacity={0.8}
                  >
                    <Text style={[styles.intensityChipText, { color: active ? '#FFFFFF' : textSec }]}>
                      {idx}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          )}
        </View>

        {/* Post-Method Check-in */}
        {activeCheckIn && (
          <View style={[styles.checkInCard, { backgroundColor: theme?.heroBg || cardBg, borderColor: accent }]}>
            <Text style={[styles.checkInTitle, { color: textPrim }]}>
              AFTER TRYING {METHOD_LABELS[activeCheckIn.method]?.toUpperCase()}
            </Text>
            <Text style={[styles.checkInSubtitle, { color: textSec }]}>
              Before was {activeCheckIn.before}. How are you feeling now?
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.intensityRow}>
              {Array.from({ length: 11 }, (_, idx) => (
                <TouchableOpacity
                  key={`after-${idx}`}
                  style={[styles.intensityChip, { backgroundColor: cardBg }]}
                  onPress={() => handleAfterIntensityCheckIn(idx)}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.intensityChipText, { color: textPrim }]}>{idx}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Messages */}
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          style={styles.messageListContainer}
          contentContainerStyle={styles.messageList}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => {
            const isUser = item.role === 'user';
            return (
              <View style={[styles.bubbleContainer, isUser ? styles.userContainer : styles.aiContainer]}>
                {!isUser && item.emotion && (
                  <View style={styles.emotionBadge}>
                    <Text style={{ fontSize: 13 }}>{item.emotion}</Text>
                  </View>
                )}
                <View
                  style={[
                    styles.bubble,
                    isUser
                      ? { backgroundColor: accent, borderBottomRightRadius: 4 }
                      : {
                          backgroundColor: cardBg,
                          borderColor: borderCol,
                          borderWidth: 1,
                          borderBottomLeftRadius: 4,
                        },
                  ]}
                >
                  <Text style={[styles.messageText, { color: isUser ? '#FFFFFF' : textPrim }]}>
                    {item.content}
                  </Text>

                  {!isUser && (item.suggestedMethod === 'box-breathing' || item.suggestedMethod === 'grounding-54321') && (
                    <InlineMicroTool
                      method={item.suggestedMethod}
                      accent={accent}
                      theme={theme}
                    />
                  )}

                  {item.suggestedTool && item.suggestedTab && onNavigateSoundscapes && (
                    <TouchableOpacity
                      style={styles.toolSuggestionPill}
                      onPress={onNavigateSoundscapes}
                      activeOpacity={0.8}
                    >
                      <Sparkles size={12} color="#D96B43" />
                      <Text style={styles.toolSuggestionText}>Try: {item.suggestedTool} →</Text>
                    </TouchableOpacity>
                  )}

                  {!isUser && item.id !== '1' && (
                    <TouchableOpacity
                      style={styles.notHelpfulBtn}
                      onPress={() => handleNotHelpfulFeedback(item)}
                      activeOpacity={0.8}
                    >
                      <Text style={styles.notHelpfulBtnText}>That did not help — switch method</Text>
                    </TouchableOpacity>
                  )}

                  <Text
                    style={[
                      styles.timeText,
                      { color: isUser ? 'rgba(255,255,255,0.75)' : textMuted },
                    ]}
                  >
                    {item.timestamp}
                  </Text>
                </View>
              </View>
            );
          }}
        />

        {/* Quick Starters anchored above Input Bar */}
        {messages.length <= 1 && (
          <View style={styles.starterContainer}>
            <Text style={[styles.starterHeader, { color: textMuted }]}>QUICK STARTERS</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.starterScroll}>
              {starterPrompts.map((prompt, idx) => (
                <TouchableOpacity
                  key={idx}
                  style={[styles.starterPill, { backgroundColor: cardBg, borderColor: borderCol }]}
                  onPress={() => handleSendPrompt(prompt.text, prompt.mode)}
                  activeOpacity={0.75}
                >
                  <Text style={[styles.starterText, { color: textPrim }]}>{prompt.text}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {Boolean(dictationNotice) && (
          <Text style={[styles.dictationNoticeText, { color: textMuted }]}>
            {dictationNotice}
          </Text>
        )}
        {Boolean(sendError) && (
          <Text
            style={[
              styles.sendErrorText,
              { color: isDark ? '#FFB4AB' : '#B3261E' },
            ]}
            accessibilityRole="alert"
          >
            {sendError}
          </Text>
        )}

        {/* Input Bar */}
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
        >
          <View
            style={[
              styles.inputContainer,
              { backgroundColor: cardBg, borderColor: borderCol, marginBottom: isWide ? 16 : 12 },
            ]}
          >
            <TextInput
              style={[styles.textInput, { color: textPrim }]}
              placeholder={MODE_CONFIG[mode].placeholder}
              placeholderTextColor={textMuted}
              value={input}
              onChangeText={handleInputChange}
              onSubmitEditing={handleSend}
              returnKeyType="send"
              multiline={false}
            />

            <TouchableOpacity
              style={[
                styles.micBtn,
                isDictating && { backgroundColor: 'rgba(211, 47, 47, 0.12)' },
              ]}
              onPress={toggleDictation}
              accessibilityRole="button"
              accessibilityLabel={isDictating ? 'Stop voice dictation' : 'Start voice dictation'}
              activeOpacity={0.8}
            >
              <Mic size={18} color={isDictating ? '#D32F2F' : textMuted} />
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.sendBtn,
                {
                  backgroundColor:
                    input.trim().length > 0 ? accent : isDark ? '#2A364E' : '#E8E2D9',
                },
              ]}
              onPress={handleSend}
              disabled={loading || input.trim().length === 0}
              activeOpacity={0.8}
            >
              {loading ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <ArrowUp
                  size={18}
                  color={input.trim().length > 0 ? '#FFFFFF' : textMuted}
                />
              )}
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </View>

      <CrisisShieldModal
        visible={crisisVisible}
        onClose={() => setCrisisVisible(false)}
        onOpenGrounding={onNavigateSoundscapes}
        countryCode={countryData?.code || 'KE'}
      />
    </View>
  );
};

export const AuroraScreen = ({ navigation, route }) => {
  const { theme, companionId } = useTheme();
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme?.bg || '#FAF6EF' }}>
      <AuroraContent
        companionId={route?.params?.companion || companionId}
        onNavigateHome={() => navigation.goBack()}
        onNavigateSoundscapes={() => navigation.navigate('Chill', { initialTab: 'pods' })}
        isWide={false}
      />
    </SafeAreaView>
  );
};
