// src/screens/aurora/AuroraScreen.tsx
// Aurora companion chat — vent, reflect, or get guidance with AI emotional support

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
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useThemeStore } from '../../store/themeStore';
import { useCompanionStore } from '../../store/companionStore';
import { AuroraAvatar } from '../../features/aurora/components/AuroraAvatar';
import { LiveCompanionMascot } from '../../components/LiveCompanionMascot';
import { CrisisShieldModal } from '../../components/CrisisShieldModal';
import { analyzeTextSafety } from '../../core/safety/safetyFilter';
import { apiClient } from '../../core/api/client';
import { RootStackParamList } from '../../navigation/types';
import {
  ArrowUp,
  ShieldAlert,
  Mic,
  Sparkles,
  Wind,
  Info,
  X,
  Sliders,
} from 'lucide-react-native';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  emotion?: string;
  suggestedTool?: string;
  suggestedScreen?: keyof RootStackParamList;
  suggestedMethod?: SupportMethod;
}

type AuroraMode = 'vent' | 'reflect' | 'guide';

type DistressLevel = 'low' | 'medium' | 'high';

interface DistressProfile {
  level: DistressLevel;
  signals: string[];
}

type SupportMethod = 'box-breathing' | 'grounding-54321' | 'muscle-relaxation' | 'thought-reframe' | 'movement-reset';

interface ArticleGroundedTip {
  method: SupportMethod;
  label: string;
  whyItCanHelp: string;
  quickSteps: string[];
  sources: Array<{ title: string; url: string }>;
}

interface SupportSuggestion {
  method?: SupportMethod;
  suggestedTool?: string;
  suggestedScreen?: keyof RootStackParamList;
}

interface IntensityLogEntry {
  id: string;
  method?: SupportMethod;
  before: number;
  after: number;
  timestamp: string;
}

interface ActiveCheckIn {
  sourceMessageId: string;
  method: SupportMethod;
  before: number;
}

const MODE_CONFIG: Record<
  AuroraMode,
  { label: string; emoji: string; desc: string; placeholder: string; color: string }
> = {
  vent: {
    label: 'Vent',
    emoji: '🕊️',
    desc: 'Safe space to release without filter or judgment',
    placeholder: 'Vent what is weighing on you right now...',
    color: '#9B6DFF',
  },
  reflect: {
    label: 'Reflect',
    emoji: '🪞',
    desc: 'Gentle space for mindful self-inquiry & clarity',
    placeholder: 'What is on your mind today?',
    color: '#6DBAFF',
  },
  guide: {
    label: 'Guide',
    emoji: '🧭',
    desc: 'Actionable CBT reframing & nervous system steps',
    placeholder: 'What challenge would you like guidance on?',
    color: '#6DFFB3',
  },
};

const MODE_RESPONSE_STYLE: Record<AuroraMode, string> = {
  vent: 'Validate first, no heavy fixing unless user asks, and end with one gentle check-in question.',
  reflect: 'Use curiosity and self-inquiry prompts, mirror patterns, and ask reflective questions.',
  guide: 'Give a clear 3-step practical plan with direct action language and a follow-up checkpoint.',
};

const STARTER_PROMPTS = [
  { text: 'Feeling overwhelmed by life in Nairobi today 🌿', mode: 'vent' as const },
  { text: 'Help me reframe an anxious thought 💭', mode: 'reflect' as const },
  { text: 'Take me through a 2-minute breathing reset 🌬️', mode: 'guide' as const },
  { text: 'Work & hustle pressure is getting heavy 💼', mode: 'vent' as const },
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

const METHOD_KEYWORDS: Record<SupportMethod, RegExp> = {
  'box-breathing': /(box breathing|breathe|breathing|inhale|exhale|4-4-4|4-7-8)/i,
  'grounding-54321': /(grounding|5-4-3-2-1|five senses|naming things you can see|disconnected)/i,
  'muscle-relaxation': /(muscle relaxation|pmr|progressive relaxation|tense and release|body scan)/i,
  'thought-reframe': /(reframe|thought|cbt|catastroph|overthink|mindset)/i,
  'movement-reset': /(walk|movement|exercise|stretch|shake it out)/i,
};

const ARTICLE_GROUNDED_TIPS: ArticleGroundedTip[] = [
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
    sources: [
      { title: 'NHS Every Mind Matters: Breathing exercises', url: 'https://www.nhs.uk/every-mind-matters/mental-wellbeing-tips/breathing-exercises-for-stress/' },
      { title: 'Cleveland Clinic: Breathing exercises for anxiety', url: 'https://health.clevelandclinic.org/breathing-exercises-for-anxiety' },
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
    sources: [
      { title: 'University of Rochester Medical Center: Grounding techniques', url: 'https://www.urmc.rochester.edu/behavioral-health-partners/bhp-blog/april-2020/grounding-techniques.aspx' },
      { title: 'Mayo Clinic: Stress management and coping', url: 'https://www.mayoclinic.org/healthy-lifestyle/stress-management/in-depth/stress/art-20046037' },
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
    sources: [
      { title: 'Anxiety Canada: Progressive Muscle Relaxation', url: 'https://www.anxietycanada.com/articles/how-to-do-progressive-muscle-relaxation/' },
      { title: 'APA: Stress effects on body and relaxation support', url: 'https://www.apa.org/topics/stress/body' },
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
    sources: [
      { title: 'Psychology Tools: Cognitive restructuring', url: 'https://www.psychologytools.com/self-help/thought-records/' },
      { title: 'NHS: CBT and unhelpful thoughts', url: 'https://www.nhs.uk/mental-health/talking-therapies-medicine-treatments/talking-therapies-and-counselling/cognitive-behavioural-therapy-cbt/' },
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
    sources: [
      { title: 'CDC: Physical activity and mental health benefits', url: 'https://www.cdc.gov/physicalactivity/basics/pa-health/index.htm' },
      { title: 'Mind UK: Exercise and mental health', url: 'https://www.mind.org.uk/information-support/tips-for-everyday-living/physical-activity-and-your-mental-health/' },
    ],
  },
];

const METHOD_LABELS: Record<SupportMethod, string> = {
  'box-breathing': 'Box Breathing',
  'grounding-54321': '5-4-3-2-1 Grounding',
  'muscle-relaxation': 'Progressive Muscle Relaxation',
  'thought-reframe': 'Thought Reframe',
  'movement-reset': 'Movement Reset',
};

const API_METHOD_MAP: Record<string, SupportMethod> = {
  tulia: 'box-breathing',
  grounding: 'grounding-54321',
};

const stripForCompare = (value: string) =>
  value
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .replace(/[^a-z0-9 ]/g, '')
    .trim();

const detectDistressProfile = (text: string): DistressProfile => {
  const normalized = stripForCompare(text);
  const foundHigh = DISTRESS_MARKERS.high.filter((token) => normalized.includes(token));
  if (foundHigh.length > 0) {
    return { level: 'high', signals: foundHigh };
  }

  const foundMedium = DISTRESS_MARKERS.medium.filter((token) => normalized.includes(token));
  if (foundMedium.length > 0) {
    return { level: 'medium', signals: foundMedium };
  }

  return { level: 'low', signals: [] };
};

const hasRecentDuplicate = (candidate: string, recentAssistantMessages: string[]) => {
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

const chooseVariant = (variants: string[], seedText: string) => {
  if (variants.length === 0) return '';
  const seed = seedText
    .split('')
    .reduce((sum, char) => sum + char.charCodeAt(0), 0);
  return variants[seed % variants.length];
};

const detectMethodFailure = (text: string) => METHOD_FAILURE_PATTERN.test(text);

const inferMentionedMethod = (text: string, recentAssistantMessages: string[]): SupportMethod | null => {
  const haystack = `${text} ${recentAssistantMessages.join(' ')}`;
  const orderedMethods: SupportMethod[] = [
    'box-breathing',
    'grounding-54321',
    'muscle-relaxation',
    'thought-reframe',
    'movement-reset',
  ];

  for (const method of orderedMethods) {
    if (METHOD_KEYWORDS[method].test(haystack)) return method;
  }

  return null;
};

const getAlternativeTips = (avoidedMethods: SupportMethod[]) => {
  const alternatives = ARTICLE_GROUNDED_TIPS.filter((tip) => !avoidedMethods.includes(tip.method));
  return alternatives.slice(0, 2);
};

const buildMethodFailureReply = ({
  text,
  failedMethod,
  avoidedMethods,
  profile,
}: {
  text: string;
  failedMethod: SupportMethod | null;
  avoidedMethods: SupportMethod[];
  profile: DistressProfile;
}) => {
  const opening = chooseVariant(
    [
      'Thank you for saying that. If that method is not helping, we switch quickly rather than forcing it.',
      'You are doing the right thing by telling me it is not working. We can pivot to another strategy now.',
      'That feedback helps a lot. One tool not working does not mean you are failing, it means we try a better-fit method.',
    ],
    text,
  );

  const pivotLine = failedMethod
    ? `We will avoid ${METHOD_LABELS[failedMethod]} for now and switch to alternatives.`
    : 'We will avoid repeating the same strategy and switch to alternatives.';

  const alternatives = getAlternativeTips(avoidedMethods);
  const alternativesText = alternatives
    .map((tip, index) => {
      const steps = tip.quickSteps.map((s) => `- ${s}`).join('\n');
      const refs = tip.sources.map((s) => `${s.title}: ${s.url}`).join('\n');
      return `${index + 1}) ${tip.label}\nWhy: ${tip.whyItCanHelp}\n${steps}\nSource:\n${refs}`;
    })
    .join('\n\n');

  const safetyLine =
    profile.level === 'high'
      ? 'If your distress is rising fast, place both feet down, do one slow exhale now, and tap the crisis shield if you feel unsafe.'
      : 'Pick only one of these now and test it for 2 to 3 minutes, then tell me what changed even slightly.';

  return `${opening}\n\n${pivotLine}\n\n${alternativesText}\n\n${safetyLine}`;
};

const resolveApiSuggestedMethod = (apiSuggestedToolId?: string): SupportMethod | undefined => {
  if (!apiSuggestedToolId) return undefined;
  return API_METHOD_MAP[apiSuggestedToolId];
};

const formatMethodLabel = (method: SupportMethod) => METHOD_LABELS[method];

const inferTrendLabel = (entries: IntensityLogEntry[]) => {
  if (entries.length === 0) return 'No check-ins yet';
  const delta = entries.reduce((sum, entry) => sum + (entry.after - entry.before), 0);
  if (delta <= -2) return 'De-escalating';
  if (delta >= 2) return 'Escalating';
  return 'Holding steady';
};

const inferSuggestedSupport = (
  text: string,
  avoidedMethods: SupportMethod[] = [],
): SupportSuggestion => {
  const normalized = stripForCompare(text);

  const candidates: Array<SupportSuggestion & { pattern: RegExp }> = [
    {
      pattern: /(panic|breathe|breath|anxious|overwhelmed|shaking)/,
      method: 'box-breathing',
      suggestedTool: 'Tulia Box Breathing',
      suggestedScreen: 'Tulia',
    },
    {
      pattern: /(ground|dizzy|spiral|numb|disconnected)/,
      method: 'grounding-54321',
      suggestedTool: '5-4-3-2-1 Grounding',
      suggestedScreen: 'Grounding',
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

  const matched = candidates.find((candidate) => candidate.pattern.test(normalized));
  if (matched && matched.method && !avoidedMethods.includes(matched.method)) {
    return {
      method: matched.method,
      suggestedTool: matched.suggestedTool,
      suggestedScreen: matched.suggestedScreen,
    };
  }

  const firstAllowed = candidates.find(
    (candidate) => candidate.method && !avoidedMethods.includes(candidate.method),
  );

  if (firstAllowed) {
    return {
      method: firstAllowed.method,
      suggestedTool: firstAllowed.suggestedTool,
      suggestedScreen: firstAllowed.suggestedScreen,
    };
  }

  return {};
};

const buildLocalCoachingReply = ({
  text,
  mode,
  profile,
}: {
  text: string;
  mode: AuroraMode;
  profile: DistressProfile;
}) => {
  const ventReply = () => {
    const validatingLine = chooseVariant(
      [
        'That sounds really heavy, and it makes sense your system feels overloaded right now.',
        'I hear how much you are carrying right now, and I am glad you shared it here.',
        'You are not being dramatic, this sounds genuinely difficult to hold alone.',
      ],
      text,
    );

    const groundingLine =
      profile.level === 'high'
        ? 'For the next 30 seconds, keep both feet on the floor and take a slow exhale that is longer than your inhale.'
        : 'If it helps, place one hand on your chest and take one unhurried breath while you read this.';

    return `${validatingLine}\n\n${groundingLine}\n\nDo you want me to just stay with you and listen, or offer one practical step next?`;
  };

  const reflectReply = () => {
    const opening = chooseVariant(
      [
        'Let us slow this down and get clearer together.',
        'We can map what is happening inside without judging it.',
        'You are already doing the hardest part by pausing to reflect.',
      ],
      text,
    );

    const promptA =
      profile.level === 'high'
        ? 'What is the loudest thought in your mind right now, word-for-word?'
        : 'What story is your mind telling you about this situation?';
    const promptB = 'What evidence supports that story, and what evidence does not fully support it?';
    const promptC = 'If a close friend said this about themselves, what kinder but honest response would you offer them?';

    return `${opening}\n\nTry this reflection:\n1) ${promptA}\n2) ${promptB}\n3) ${promptC}`;
  };

  const guideReply = () => {
    const opening = chooseVariant(
      [
        'Let us make a short plan you can use immediately.',
        'Here is a clear step-by-step reset for the next few minutes.',
        'We will keep this practical and doable right now.',
      ],
      text,
    );

    const step1 =
      profile.level === 'high'
        ? 'Step 1 (60 sec): Inhale 4, exhale 6 for 6 rounds while looking at one stable object.'
        : 'Step 1 (60 sec): Unclench jaw, drop shoulders, and take 5 slow breaths.';
    const step2 = 'Step 2 (2 min): Write the main stressor in one sentence and circle the part you can influence today.';
    const step3 = 'Step 3 (10 min): Do one tiny action now that moves the circled part forward.';

    return `${opening}\n\n${step1}\n${step2}\n${step3}\n\nWhen you finish Step 3, tell me what changed from 0 to 10.`;
  };

  if (mode === 'vent') return ventReply();
  if (mode === 'reflect') return reflectReply();
  return guideReply();
};

const normalizeAuroraReply = ({
  apiReply,
  text,
  mode,
  profile,
  recentAssistantMessages,
}: {
  apiReply?: string;
  text: string;
  mode: AuroraMode;
  profile: DistressProfile;
  recentAssistantMessages: string[];
}) => {
  const fallbackReply = buildLocalCoachingReply({ text, mode, profile });
  const trimmedApiReply = apiReply?.trim();

  if (!trimmedApiReply) return fallbackReply;

  if (hasRecentDuplicate(trimmedApiReply, recentAssistantMessages)) {
    return fallbackReply;
  }

  const hasActionStep = /(try|step|breathe|breath|next|can do|start with)/i.test(trimmedApiReply);
  const hasFollowUp = /\?/.test(trimmedApiReply);
  const isGuideStructured = /(step\s*1|1\)|2\)|3\)|plan)/i.test(trimmedApiReply);
  const isReflective = /(what|notice|pattern|evidence|story)/i.test(trimmedApiReply);
  const isVentHolding = /(hear|with you|carry|heavy|valid|listen)/i.test(trimmedApiReply);

  if (mode === 'guide' && !isGuideStructured) {
    return fallbackReply;
  }

  if (mode === 'reflect' && !isReflective) {
    return fallbackReply;
  }

  if (mode === 'vent' && !isVentHolding) {
    return fallbackReply;
  }

  if (profile.level !== 'low' && (!hasActionStep || !hasFollowUp)) {
    const extraGuidance = buildLocalCoachingReply({ text, mode, profile })
      .split('\n\n')
      .slice(1)
      .join('\n\n');
    return `${trimmedApiReply}\n\n${extraGuidance}`;
  }

  return trimmedApiReply;
};

export const AuroraScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { colors, isDark } = useThemeStore();
  const { reactToUserText, setEmotion } = useCompanionStore();

  const [mode, setMode] = useState<AuroraMode>('reflect');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content:
        'Habari rafiki. I am Aurora. Whether you want to vent, reflect, or just sit quietly together, I am here with you.',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      emotion: '🌸',
    },
  ]);

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [crisisVisible, setCrisisVisible] = useState(false);
  const [failedMethods, setFailedMethods] = useState<SupportMethod[]>([]);
  const [intensityRating, setIntensityRating] = useState<number | null>(null);
  const [intensityLog, setIntensityLog] = useState<IntensityLogEntry[]>([]);
  const [activeCheckIn, setActiveCheckIn] = useState<ActiveCheckIn | null>(null);

  const flatListRef = useRef<FlatList>(null);

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
        ? failedMethods.map((method) => formatMethodLabel(method)).join(', ')
        : 'None flagged yet';

    const lastResult = intensityLog[intensityLog.length - 1];
    const progressText = lastResult
      ? `${formatMethodLabel(lastResult.method || 'movement-reset')}: ${lastResult.before} -> ${lastResult.after}`
      : 'No before/after score yet';

    const trendText = inferTrendLabel(intensityLog.slice(-3));

    return {
      focusText,
      failedText,
      progressText,
      trendText,
    };
  }, [messages, failedMethods, intensityLog]);

  const registerMethodAsNotHelpful = (method: SupportMethod) => {
    setFailedMethods((prev) => (prev.includes(method) ? prev : [...prev, method]));
  };

  const handleNotHelpfulFeedback = (message: Message) => {
    if (message.role !== 'assistant') return;

    const inferredMethod =
      message.suggestedMethod ||
      inferMentionedMethod(message.content, []);

    const avoidedMethods = inferredMethod
      ? Array.from(new Set([...failedMethods, inferredMethod]))
      : failedMethods;

    if (inferredMethod) {
      registerMethodAsNotHelpful(inferredMethod);
    }

    const lastUserText = [...messages]
      .reverse()
      .find((m) => m.role === 'user')?.content || 'That method did not help me.';

    const distressProfile = detectDistressProfile(lastUserText);
    const failureReply = buildMethodFailureReply({
      text: lastUserText,
      failedMethod: inferredMethod || null,
      avoidedMethods,
      profile: distressProfile,
    });
    const suggestedByContent = inferSuggestedSupport(failureReply, avoidedMethods);

    const feedbackMsg: Message = {
      id: `${Date.now()}-retry`,
      role: 'assistant',
      content: failureReply,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      emotion: distressProfile.level === 'high' ? '💙' : '🌸',
      suggestedTool: suggestedByContent.suggestedTool,
      suggestedScreen: suggestedByContent.suggestedScreen,
      suggestedMethod: suggestedByContent.method,
    };

    setMessages((prev) => [...prev, feedbackMsg]);
  };

  const handleAfterIntensityCheckIn = (afterScore: number) => {
    if (!activeCheckIn) return;

    const entry: IntensityLogEntry = {
      id: `${Date.now()}-intensity`,
      method: activeCheckIn.method,
      before: activeCheckIn.before,
      after: afterScore,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setIntensityLog((prev) => [...prev, entry]);
    setIntensityRating(afterScore);
    setActiveCheckIn(null);
  };

  const handleInputChange = (text: string) => {
    setInput(text);
    const safety = analyzeTextSafety(text);
    if (safety.isCritical) {
      setCrisisVisible(true);
      setEmotion('crisis');
      return;
    }
    reactToUserText(text);
  };

  const handleSendPrompt = (promptText: string, promptMode?: AuroraMode) => {
    if (promptMode) setMode(promptMode);
    setInput(promptText);
    setTimeout(() => {
      handleSendWithText(promptText, promptMode || mode);
    }, 50);
  };

  const handleSend = () => {
    handleSendWithText(input.trim(), mode);
  };

  const handleSendWithText = async (text: string, currentMode: AuroraMode) => {
    if (!text || loading) return;

    // Safety interceptor
    const safety = analyzeTextSafety(text);
    if (safety.isCritical) {
      setCrisisVisible(true);
      setEmotion('crisis');
      return;
    }

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);
    setEmotion('thinking');

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
        setFailedMethods((prev) => (prev.includes(failedMethod) ? prev : [...prev, failedMethod]));
      }

      const failureReply = buildMethodFailureReply({
        text,
        failedMethod,
        avoidedMethods,
        profile: distressProfile,
      });
      const suggestedByContent = inferSuggestedSupport(failureReply, avoidedMethods);

      const failureMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: failureReply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        emotion: distressProfile.level === 'high' ? '💙' : '🌸',
        suggestedTool: suggestedByContent.suggestedTool,
        suggestedScreen: suggestedByContent.suggestedScreen,
        suggestedMethod: suggestedByContent.method,
      };

      setMessages((prev) => [...prev, failureMsg]);
      setEmotion('empathic');
      setLoading(false);
      return;
    }

    try {
      const response = await apiClient.post('/aurora', {
        message: text,
        mode: currentMode,
        modeDirective: MODE_RESPONSE_STYLE[currentMode],
        history: messages.slice(-6).map((m) => ({ role: m.role, content: m.content })),
        userProfile: { name: 'Friend', primaryIssue: 'wellness' },
        intensity: intensityRating,
        failedMethods,
        summary: rollingSummary,
      });

      const reply = normalizeAuroraReply({
        apiReply: response.data?.reply,
        text,
        mode: currentMode,
        profile: distressProfile,
        recentAssistantMessages,
      });

      const suggestedByContent = inferSuggestedSupport(`${text} ${reply}`, failedMethods);
      const apiSuggestedMethod = resolveApiSuggestedMethod(response.data?.suggestedToolId);
      const blockApiSuggestion = !!(apiSuggestedMethod && failedMethods.includes(apiSuggestedMethod));
      const suggestedTool = blockApiSuggestion
        ? suggestedByContent.suggestedTool
        : response.data?.suggestedToolId || suggestedByContent.suggestedTool;

      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        emotion: currentMode === 'vent' ? '💙' : currentMode === 'guide' ? '⚡' : '🌸',
        suggestedTool,
        suggestedScreen:
          blockApiSuggestion
            ? suggestedByContent.suggestedScreen
            : response.data?.suggestedToolId === 'tulia'
              ? 'Tulia'
              : response.data?.suggestedToolId === 'grounding'
                ? 'Grounding'
                : suggestedByContent.suggestedScreen,
        suggestedMethod: blockApiSuggestion ? suggestedByContent.method : apiSuggestedMethod || suggestedByContent.method,
      };

      setMessages((prev) => [...prev, aiMsg]);
      if (aiMsg.suggestedMethod && intensityRating !== null) {
        setActiveCheckIn({
          sourceMessageId: aiMsg.id,
          method: aiMsg.suggestedMethod,
          before: intensityRating,
        });
      }
      setEmotion('empathic');
    } catch {
      // Offline fallback with cultural warmth
      const fallbackReply = normalizeAuroraReply({
        text,
        mode: currentMode,
        profile: distressProfile,
        recentAssistantMessages,
      });

      const suggestedByContent = inferSuggestedSupport(`${text} ${fallbackReply}`, failedMethods);

      const fallbackMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: fallbackReply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        emotion: '🌸',
        suggestedTool: suggestedByContent.suggestedTool,
        suggestedScreen: suggestedByContent.suggestedScreen,
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
      setEmotion('idle');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    flatListRef.current?.scrollToEnd({ animated: true });
  }, [messages, loading]);

  const bgColor = isDark ? '#1A1308' : '#FDF9F4';

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: bgColor }]}>
      <View style={styles.centerOuter}>
        <View style={styles.centerContainer}>
          {/* ── Sentient Glass Header ── */}
          <View
            style={[
              styles.header,
              {
                backgroundColor: isDark ? 'rgba(26, 34, 50, 0.95)' : 'rgba(255, 255, 255, 0.95)',
                borderColor: isDark ? 'rgba(126, 87, 194, 0.3)' : 'rgba(234, 160, 35, 0.25)',
              },
            ]}
          >
            {/* Left: Close */}
            <TouchableOpacity
              style={styles.headerIconButton}
              onPress={() => navigation.navigate('MainTabs')}
              activeOpacity={0.7}
            >
              <X size={20} color={isDark ? '#B39DDB' : '#7A6F68'} />
            </TouchableOpacity>

            {/* Center: Title & Sentient Companion Indicator */}
            <View style={styles.headerTitleCol}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <LiveCompanionMascot size={32} showBubble={false} interactive={true} />
                <View>
                  <Text
                    style={[
                      styles.headerTitle,
                      { color: isDark ? '#FFFFFF' : '#2C2420' },
                    ]}
                  >
                    AURORA
                  </Text>
                  <View style={styles.statusRow}>
                    <View
                      style={[
                        styles.statusDot,
                        { backgroundColor: loading ? '#EAA023' : '#4CAF50' },
                      ]}
                    />
                    <Text
                      style={[
                        styles.statusText,
                        { color: isDark ? '#B39DDB' : '#7A6F68' },
                      ]}
                    >
                      {loading ? 'Tuning in...' : 'By your side'}
                    </Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Right: Crisis Shield & Tuning */}
            <View style={styles.headerActions}>
              <TouchableOpacity
                style={styles.shieldBtn}
                onPress={() => setCrisisVisible(true)}
                activeOpacity={0.8}
              >
                <ShieldAlert size={16} color="#D32F2F" />
              </TouchableOpacity>
            </View>
          </View>

          {/* ── Mode Selector Banner (Vent / Reflect / Guide) ── */}
          <View
            style={[
              styles.modeBanner,
              {
                backgroundColor: isDark ? 'rgba(30, 40, 60, 0.7)' : 'rgba(255, 255, 255, 0.8)',
                borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(234, 160, 35, 0.2)',
              },
            ]}
          >
            <View style={styles.modeTabsRow}>
              {(['vent', 'reflect', 'guide'] as AuroraMode[]).map((m) => {
                const active = mode === m;
                const mConf = MODE_CONFIG[m];
                return (
                  <TouchableOpacity
                    key={m}
                    style={[
                      styles.modeTabPill,
                      active && {
                        backgroundColor: '#E06D3B',
                        borderColor: '#E06D3B',
                      },
                    ]}
                    onPress={() => setMode(m)}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.modeEmoji}>{mConf.emoji}</Text>
                    <Text
                      style={[
                        styles.modeTabText,
                        {
                          color: active ? '#FFFFFF' : isDark ? '#B39DDB' : '#7A6F68',
                          fontWeight: active ? '800' : '600',
                        },
                      ]}
                    >
                      {mConf.label}
                    </Text>
                    {active && (
                      <View style={styles.autoChip}>
                        <Text style={styles.autoChipText}>AUTO</Text>
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* ── Companion Avatar with Responsive Breathing Aura ── */}
          <View style={styles.avatarSection}>
            <AuroraAvatar size={84} showBubble={true} />
            <Text
              style={[
                styles.modeSubtitle,
                { color: isDark ? '#B39DDB' : '#7A6F68' },
              ]}
            >
              {MODE_CONFIG[mode].desc}
            </Text>
          </View>

          <View
            style={[
              styles.intensityCard,
              {
                backgroundColor: isDark ? 'rgba(22, 30, 44, 0.9)' : 'rgba(255,255,255,0.92)',
                borderColor: isDark ? 'rgba(126, 87, 194, 0.22)' : 'rgba(234, 160, 35, 0.22)',
              },
            ]}
          >
            <Text style={[styles.intensityTitle, { color: isDark ? '#D5C2F0' : '#7A6F68' }]}>DISTRESS INTENSITY (0-10)</Text>
            <Text style={[styles.intensityValue, { color: isDark ? '#FFFFFF' : '#2C2420' }]}>
              Current: {intensityRating === null ? 'Not set' : intensityRating}
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.intensityRow}>
              {Array.from({ length: 11 }, (_, idx) => (
                <TouchableOpacity
                  key={`current-${idx}`}
                  style={[
                    styles.intensityChip,
                    {
                      backgroundColor: intensityRating === idx ? '#E06D3B' : isDark ? '#2A364E' : '#F2ECE4',
                    },
                  ]}
                  onPress={() => setIntensityRating(idx)}
                  activeOpacity={0.8}
                >
                  <Text
                    style={[
                      styles.intensityChipText,
                      { color: intensityRating === idx ? '#FFFFFF' : isDark ? '#D5C2F0' : '#7A6F68' },
                    ]}
                  >
                    {idx}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {activeCheckIn && (
            <View
              style={[
                styles.checkInCard,
                {
                  backgroundColor: isDark ? 'rgba(34, 45, 66, 0.92)' : 'rgba(255, 249, 240, 0.95)',
                  borderColor: isDark ? 'rgba(126, 87, 194, 0.25)' : 'rgba(224, 109, 59, 0.26)',
                },
              ]}
            >
              <Text style={[styles.checkInTitle, { color: isDark ? '#F3E5F5' : '#2C2420' }]}>AFTER TRYING {formatMethodLabel(activeCheckIn.method).toUpperCase()}</Text>
              <Text style={[styles.checkInSubtitle, { color: isDark ? '#B39DDB' : '#7A6F68' }]}>Before was {activeCheckIn.before}. How are you now?</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.intensityRow}>
                {Array.from({ length: 11 }, (_, idx) => (
                  <TouchableOpacity
                    key={`after-${idx}`}
                    style={[
                      styles.intensityChip,
                      {
                        backgroundColor: isDark ? '#2A364E' : '#F2ECE4',
                      },
                    ]}
                    onPress={() => handleAfterIntensityCheckIn(idx)}
                    activeOpacity={0.8}
                  >
                    <Text style={[styles.intensityChipText, { color: isDark ? '#D5C2F0' : '#7A6F68' }]}>{idx}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}

          {/* ── Starter Prompts (if chat is fresh) ── */}
          {messages.length <= 1 && (
            <View style={styles.starterContainer}>
              <Text
                style={[
                  styles.starterHeader,
                  { color: isDark ? '#9E8BBD' : '#9E948E' },
                ]}
              >
                QUICK STARTERS
              </Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.starterScroll}
              >
                {STARTER_PROMPTS.map((prompt, idx) => (
                  <TouchableOpacity
                    key={idx}
                    style={[
                      styles.starterPill,
                      {
                        backgroundColor: isDark ? 'rgba(30, 40, 60, 0.85)' : '#FFFFFF',
                        borderColor: isDark ? 'rgba(126, 87, 194, 0.25)' : 'rgba(234, 160, 35, 0.25)',
                      },
                    ]}
                    onPress={() => handleSendPrompt(prompt.text, prompt.mode)}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[
                        styles.starterText,
                        { color: isDark ? '#F3E5F5' : '#2C2420' },
                      ]}
                    >
                      {prompt.text}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}

          {/* ── Chat Messages FlatList ── */}
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
                <View
                  style={[
                    styles.bubbleContainer,
                    isUser ? styles.userContainer : styles.aiContainer,
                  ]}
                >
                  {!isUser && item.emotion && (
                    <View style={styles.emotionBadge}>
                      <Text style={{ fontSize: 13 }}>{item.emotion}</Text>
                    </View>
                  )}
                  <View
                    style={[
                      styles.bubble,
                      isUser
                        ? {
                          backgroundColor: '#E06D3B',
                          borderBottomRightRadius: 4,
                        }
                        : {
                          backgroundColor: isDark ? '#241C10' : '#FFFFFF',
                          borderColor: isDark
                            ? 'rgba(224, 109, 59, 0.2)'
                            : 'rgba(224, 109, 59, 0.12)',
                          borderWidth: 1,
                          borderBottomLeftRadius: 4,
                        },
                    ]}
                  >
                    <Text
                      style={[
                        styles.messageText,
                        { color: isUser ? '#FFFFFF' : isDark ? '#F3E5F5' : '#2C2420' },
                      ]}
                    >
                      {item.content}
                    </Text>

                    {/* Interactive Suggested Tool Pill */}
                    {item.suggestedTool && item.suggestedScreen && (
                      <TouchableOpacity
                        style={styles.toolSuggestionPill}
                        onPress={() => navigation.navigate(item.suggestedScreen! as any)}
                        activeOpacity={0.8}
                      >
                        <Sparkles size={12} color="#D96B43" />
                        <Text style={styles.toolSuggestionText}>
                          Try: {item.suggestedTool} →
                        </Text>
                      </TouchableOpacity>
                    )}

                    {!isUser && item.id !== '1' && (
                      <TouchableOpacity
                        style={styles.notHelpfulBtn}
                        onPress={() => handleNotHelpfulFeedback(item)}
                        activeOpacity={0.8}
                      >
                        <Text style={styles.notHelpfulBtnText}>That did not help</Text>
                      </TouchableOpacity>
                    )}

                    <Text
                      style={[
                        styles.timeText,
                        {
                          color: isUser
                            ? 'rgba(255,255,255,0.75)'
                            : isDark
                              ? '#9E8BBD'
                              : '#9E948E',
                        },
                      ]}
                    >
                      {item.timestamp}
                    </Text>
                  </View>
                </View>
              );
            }}
          />

          {/* ── Bottom Input Bar: Perfectly elevated above the floating bottom nav bar ── */}
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
          >
            <View
              style={[
                styles.inputContainer,
                {
                  backgroundColor: isDark ? '#1A2232' : '#FFFFFF',
                  borderColor: isDark ? 'rgba(126, 87, 194, 0.3)' : 'rgba(234, 160, 35, 0.25)',
                },
              ]}
            >
              <TouchableOpacity style={styles.micBtn} activeOpacity={0.7}>
                <Mic size={18} color={isDark ? '#B39DDB' : '#7A6F68'} />
              </TouchableOpacity>

              <TextInput
                style={[
                  styles.textInput,
                  {
                    color: isDark ? '#F3E5F5' : '#2C2420',
                  },
                ]}
                placeholder={MODE_CONFIG[mode].placeholder}
                placeholderTextColor={isDark ? '#9E8BBD' : '#9E948E'}
                value={input}
                onChangeText={handleInputChange}
                multiline={false}
              />

              <TouchableOpacity
                style={[
                  styles.sendBtn,
                  {
                    backgroundColor: input.trim().length > 0 ? '#E06D3B' : isDark ? '#2A364E' : '#E8E2D9',
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
                    color={input.trim().length > 0 ? '#FFFFFF' : isDark ? '#5C6E8A' : '#9E948E'}
                  />
                )}
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </View>
      </View>

      <CrisisShieldModal
        visible={crisisVisible}
        onClose={() => setCrisisVisible(false)}
        countryCode="KE"
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
  },
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

  // ── Header ──
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 24,
    borderWidth: 1.2,
    marginBottom: 8,
    shadowColor: '#D96B43',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
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
    letterSpacing: 3,
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
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 0.4,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
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

  // ── Mode Selector Banner ──
  modeBanner: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 4,
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
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'transparent',
    gap: 5,
  },
  modeEmoji: {
    fontSize: 13,
  },
  modeTabText: {
    fontSize: 12,
  },
  autoChip: {
    backgroundColor: 'rgba(255,255,255,0.25)',
    paddingHorizontal: 5,
    paddingVertical: 1.5,
    borderRadius: 6,
    marginLeft: 3,
  },
  autoChipText: {
    fontSize: 8,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },

  // ── Avatar Section ──
  avatarSection: {
    alignItems: 'center',
    paddingVertical: 6,
  },
  modeSubtitle: {
    fontSize: 11,
    fontWeight: '500',
    marginTop: 4,
    textAlign: 'center',
  },
  summaryCard: {
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginTop: 6,
    marginBottom: 8,
  },
  summaryTitle: {
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1,
    marginBottom: 6,
  },
  summaryText: {
    fontSize: 11,
    marginBottom: 3,
    lineHeight: 16,
  },
  intensityCard: {
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 8,
  },
  intensityTitle: {
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1,
    marginBottom: 4,
  },
  intensityValue: {
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 8,
  },
  intensityRow: {
    gap: 6,
    paddingRight: 6,
  },
  intensityChip: {
    width: 30,
    height: 30,
    borderRadius: 15,
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
    fontSize: 11,
    marginBottom: 8,
  },

  // ── Starter Prompts ──
  starterContainer: {
    marginVertical: 6,
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

  // ── Messages ──
  messageListContainer: {
    flex: 1,
    minHeight: 0,
  },
  messageList: {
    paddingVertical: 8,
    paddingBottom: 16,
  },
  bubbleContainer: {
    marginBottom: 10,
    maxWidth: '82%',
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
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
    fontSize: 11,
    fontWeight: '700',
    color: '#D96B43',
  },
  notHelpfulBtn: {
    alignSelf: 'flex-start',
    marginTop: 8,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    backgroundColor: 'rgba(25, 118, 210, 0.14)',
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

  // ── Elevated Input Container: Placed ABOVE Floating Bottom Bar ──
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 28,
    borderWidth: 1.2,
    gap: 8,
    marginBottom: 88, // Clears the floating bottom nav bar on web and mobile
    shadowColor: '#D96B43',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 14,
    elevation: 6,
  },
  micBtn: {
    padding: 6,
  },
  textInput: {
    flex: 1,
    minHeight: 42,
    maxHeight: 42,
    paddingHorizontal: 8,
    paddingVertical: 0,
    fontSize: 14,
  },
  sendBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
