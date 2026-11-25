// src/screens/ai/AuroraScreen.jsx
// Aurora AI Companion — Vent, Reflect, or Guide with distress detection,
// evidence-based coping pivots, before/after intensity check-ins, and Crisis Shield.

import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { ArrowUp, ShieldAlert, Sparkles, X } from 'lucide-react-native';
import { useTheme } from '../../theme/ThemeContext';
import { useI18n } from '../../services/i18n';
import { AnimatedCompanion } from '../../components/companion/AnimatedCompanion';
import { CrisisShieldModal } from '../../components/CrisisShieldModal';
import { analyzeTextSafety } from '../../core/safety/safetyFilter';
import { apiClient } from '../../core/api/client';

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

const MODE_RESPONSE_STYLE = {
  vent: 'Validate first, no heavy fixing unless user asks, and end with one gentle check-in question.',
  reflect: 'Use curiosity and self-inquiry prompts, mirror patterns, and ask reflective questions.',
  guide: 'Give a clear 3-step practical plan with direct action language and a follow-up checkpoint.',
};

const STARTER_PROMPTS = [
  { text: 'Feeling overwhelmed by everything today 🌿', mode: 'vent' },
  { text: 'Help me reframe an anxious thought 💭', mode: 'reflect' },
  { text: 'Take me through a 2-minute breathing reset 🌬️', mode: 'guide' },
  { text: 'Work & study pressure is getting heavy 💼', mode: 'vent' },
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

const buildLocalCoachingReply = ({ text, mode, profile }) => {
  if (mode === 'vent') {
    const validatingLine = chooseVariant(
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
    const opening = chooseVariant(
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

  const opening = chooseVariant(
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

  const [mode, setMode] = useState('reflect');
  const [messages, setMessages] = useState([
    {
      id: '1',
      role: 'assistant',
      content:
        'Hello friend. I am Aurora. Whether you want to vent, reflect, or just sit quietly together, I am here with you.',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      emotion: '🌸',
    },
  ]);

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [crisisVisible, setCrisisVisible] = useState(false);
  const [failedMethods, setFailedMethods] = useState([]);
  const [intensityRating, setIntensityRating] = useState(null);
  const [intensityLog, setIntensityLog] = useState([]);
  const [activeCheckIn, setActiveCheckIn] = useState(null);

  const flatListRef = useRef(null);

  const rollingSummary = useMemo(() => {
    const recentUserMessages = messages
      .filter((m) => m.role === 'user')
      .slice(-2)
      .map((m) => m.content);
    const focusText =
      recentUserMessages.length > 0
        ? recentUserMessages[recentUserMessages.length - 1]
        : 'No specific stressor shared yet.';
    const failedText =
      failedMethods.length > 0
        ? failedMethods.map((m) => METHOD_LABELS[m]).join(', ')
        : 'None flagged yet';
    const lastResult = intensityLog[intensityLog.length - 1];
    const progressText = lastResult
      ? `${METHOD_LABELS[lastResult.method || 'movement-reset']}: ${lastResult.before} -> ${lastResult.after}`
      : 'No before/after score yet';
    return { focusText, failedText, progressText };
  }, [messages, failedMethods, intensityLog]);

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
      const response = await apiClient.post('/aurora', {
        message: text,
        mode: currentMode,
        modeDirective: MODE_RESPONSE_STYLE[currentMode],
        history: messages.slice(-6).map((m) => ({ role: m.role, content: m.content })),
        userProfile: { name: userName || 'Friend', primaryIssue: 'wellness' },
        intensity: intensityRating,
        failedMethods,
        summary: rollingSummary,
      });

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
    } catch {
      const fallbackReply = normalizeAuroraReply({
        text,
        mode: currentMode,
        profile: distressProfile,
        recentAssistantMessages,
      });
      const suggestedByContent = inferSuggestedSupport(`${text} ${fallbackReply}`, failedMethods);
      const fallbackMsg = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: fallbackReply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        emotion: '🌸',
        suggestedTool: suggestedByContent.suggestedTool,
        suggestedTab: suggestedByContent.suggestedTab,
        suggestedMethod: suggestedByContent.method,
      };
      setMessages((prev) => [...prev, fallbackMsg]);
      if (fallbackMsg.suggestedMethod && intensityRating !== null) {
        setActiveCheckIn({
          sourceMessageId: fallbackMsg.id,
          method: fallbackMsg.suggestedMethod,
          before: intensityRating,
        });
      }
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

          <TouchableOpacity
            style={styles.shieldBtn}
            onPress={() => setCrisisVisible(true)}
            activeOpacity={0.8}
          >
            <ShieldAlert size={16} color="#D32F2F" />
          </TouchableOpacity>
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

        {/* Distress Intensity (0-10) */}
        <View style={[styles.intensityCard, { backgroundColor: cardBg, borderColor: borderCol }]}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
            <Text style={[styles.intensityTitle, { color: textMuted }]}>DISTRESS INTENSITY (0-10)</Text>
            <Text style={[styles.intensityValue, { color: textPrim }]}>
              {intensityRating === null ? 'Optional' : `${intensityRating}/10`}
            </Text>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.intensityRow}>
            {Array.from({ length: 11 }, (_, idx) => {
              const active = intensityRating === idx;
              return (
                <TouchableOpacity
                  key={`current-${idx}`}
                  style={[
                    styles.intensityChip,
                    { backgroundColor: active ? accent : (theme?.bg || '#F2ECE4') },
                  ]}
                  onPress={() => setIntensityRating(idx)}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.intensityChipText, { color: active ? '#FFFFFF' : textSec }]}>
                    {idx}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
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

        {/* Quick Starters */}
        {messages.length <= 1 && (
          <View style={styles.starterContainer}>
            <Text style={[styles.starterHeader, { color: textMuted }]}>QUICK STARTERS</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.starterScroll}>
              {STARTER_PROMPTS.map((prompt, idx) => (
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
        onNavigateSoundscapes={() => navigation.navigate('Chill')}
        isWide={false}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  centerOuter: {
    flex: 1,
    width: '100%',
    minHeight: 0,
  },
  centerContainer: {
    flex: 1,
    width: '100%',
    paddingHorizontal: 16,
    paddingTop: 12,
    minHeight: 0,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 22,
    borderWidth: 1,
    marginBottom: 8,
  },
  headerIconButton: {
    padding: 6,
  },
  headerTitleCol: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 2.5,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 2,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
  },
  shieldBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFEBEE',
    borderWidth: 1,
    borderColor: '#EF9A9A',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modeBanner: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 8,
    marginBottom: 8,
  },
  modeTabsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  modeTabPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'transparent',
    gap: 5,
  },
  modeEmoji: {
    fontSize: 13,
  },
  modeTabText: {
    fontSize: 12.5,
  },
  modeSubtitle: {
    fontSize: 11,
    fontWeight: '500',
    marginTop: 6,
    textAlign: 'center',
  },
  intensityCard: {
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 8,
  },
  intensityTitle: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  intensityValue: {
    fontSize: 11.5,
    fontWeight: '700',
  },
  intensityRow: {
    gap: 6,
    paddingRight: 6,
  },
  intensityChip: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  intensityChipText: {
    fontSize: 12,
    fontWeight: '800',
  },
  checkInCard: {
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 8,
  },
  checkInTitle: {
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 0.8,
    marginBottom: 3,
  },
  checkInSubtitle: {
    fontSize: 11.5,
    marginBottom: 8,
  },
  starterContainer: {
    marginVertical: 4,
  },
  starterHeader: {
    fontSize: 9.5,
    fontWeight: '800',
    letterSpacing: 1,
    marginBottom: 6,
    marginLeft: 4,
  },
  starterScroll: {
    gap: 8,
    paddingHorizontal: 2,
  },
  starterPill: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 18,
    borderWidth: 1,
  },
  starterText: {
    fontSize: 12,
    fontWeight: '600',
  },
  messageListContainer: {
    flex: 1,
    minHeight: 0,
  },
  messageList: {
    paddingVertical: 8,
    paddingBottom: 12,
  },
  bubbleContainer: {
    marginBottom: 10,
    maxWidth: '84%',
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 6,
  },
  userContainer: {
    alignSelf: 'flex-end',
  },
  aiContainer: {
    alignSelf: 'flex-start',
  },
  emotionBadge: {
    marginBottom: 4,
  },
  bubble: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
  },
  messageText: {
    fontSize: 14,
    lineHeight: 21,
  },
  toolSuggestionPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(217, 107, 67, 0.12)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    marginTop: 8,
    gap: 4,
    alignSelf: 'flex-start',
  },
  toolSuggestionText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#D96B43',
  },
  notHelpfulBtn: {
    alignSelf: 'flex-start',
    marginTop: 8,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    backgroundColor: 'rgba(25, 118, 210, 0.12)',
  },
  notHelpfulBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#1976D2',
  },
  timeText: {
    fontSize: 10,
    alignSelf: 'flex-end',
    marginTop: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 28,
    borderWidth: 1,
    gap: 8,
  },
  textInput: {
    flex: 1,
    minHeight: 40,
    maxHeight: 40,
    paddingHorizontal: 6,
    fontSize: 14,
  },
  sendBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
