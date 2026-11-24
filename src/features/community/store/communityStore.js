// src/features/community/store/communityStore.js
// Centralized reactive Zustand store for MindBloom Community Baraza
// Features persistent Small Wins vault, ephemeral Zero-Trace Safe Vents, and interactive reactions.

import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEYS = {
  WINS: 'mindbloom:community:wins:v2',
  VENTS: 'mindbloom:community:vents:v2',
  NOTIFIED_MENTORS: 'mindbloom:community:notified_mentors:v1',
};

const INITIAL_WINS = [
  {
    id: 'win-1',
    text: 'Made my bed, drank a warm cup of lemon water, and did not open social media first thing 🌱',
    author: 'Wanjiru · Nairobi',
    category: 'personal',
    cheers: 28,
    hasCheered: false,
    createdAt: '15m ago',
  },
  {
    id: 'win-2',
    text: 'Submitted my assignment without spiraling into panic or waiting for 11:59 PM 📚',
    author: 'Brian · Juja',
    category: 'school',
    cheers: 45,
    hasCheered: true,
    createdAt: '1h ago',
  },
  {
    id: 'win-3',
    text: 'Stood up for myself in a workplace discussion with calm confidence and zero apologies 💼',
    author: 'Kavata · Westlands',
    category: 'work',
    cheers: 52,
    hasCheered: false,
    createdAt: '3h ago',
  },
  {
    id: 'win-4',
    text: 'Ate lunch peacefully without guilt. My body is worthy of nourishing 🌺',
    author: 'Neema · Mombasa',
    category: 'healing',
    cheers: 39,
    hasCheered: false,
    createdAt: '5h ago',
  },
];

const INITIAL_VENTS = [
  {
    id: 'vent-1',
    text: 'Tired of being the "strong eldest sibling" who holds everyone together while feeling overwhelmed inside.',
    createdAt: '22m ago',
    hugs: 34,
    hasHugged: true,
    candles: 18,
    hasCandle: false,
  },
  {
    id: 'vent-2',
    text: 'Sent out 20 job applications this month. Getting automated rejections can feel heavy, but taking it one day at a time.',
    createdAt: '1h ago',
    hugs: 56,
    hasHugged: false,
    candles: 29,
    hasCandle: true,
  },
  {
    id: 'vent-3',
    text: 'When people dismiss mental wellness as "lack of hustle", it stings. Finding this quiet space helps a lot.',
    createdAt: '3h ago',
    hugs: 81,
    hasHugged: false,
    candles: 44,
    hasCandle: false,
  },
];

export const useCommunityStore = create((set, get) => ({
  wins: INITIAL_WINS,
  vents: INITIAL_VENTS,
  notifiedMentors: {},
  isHydrated: false,

  // Hydrate persistent data from AsyncStorage
  hydrate: async () => {
    try {
      const [savedWins, savedVents, savedMentors] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.WINS),
        AsyncStorage.getItem(STORAGE_KEYS.VENTS),
        AsyncStorage.getItem(STORAGE_KEYS.NOTIFIED_MENTORS),
      ]);

      const wins = savedWins ? JSON.parse(savedWins) : INITIAL_WINS;
      const vents = savedVents ? JSON.parse(savedVents) : INITIAL_VENTS;
      const notifiedMentors = savedMentors ? JSON.parse(savedMentors) : {};

      set({ wins, vents, notifiedMentors, isHydrated: true });
    } catch {
      set({ isHydrated: true });
    }
  },

  // Persistent Small Wins logic
  addWin: async (text, category = 'personal', author = 'You · MindBloom') => {
    const trimmed = text.trim();
    if (!trimmed) return;

    const newWin = {
      id: `win-${Date.now()}`,
      text: trimmed,
      author,
      category,
      cheers: 1,
      hasCheered: true,
      createdAt: 'Just now',
    };

    const nextWins = [newWin, ...get().wins];
    set({ wins: nextWins });

    try {
      await AsyncStorage.setItem(STORAGE_KEYS.WINS, JSON.stringify(nextWins));
    } catch {}
  },

  toggleCheerWin: async (id) => {
    const nextWins = get().wins.map((w) => {
      if (w.id === id) {
        const nextCheered = !w.hasCheered;
        return {
          ...w,
          hasCheered: nextCheered,
          cheers: nextCheered ? w.cheers + 1 : Math.max(0, w.cheers - 1),
        };
      }
      return w;
    });

    set({ wins: nextWins });

    try {
      await AsyncStorage.setItem(STORAGE_KEYS.WINS, JSON.stringify(nextWins));
    } catch {}
  },

  // Safe Vent Box logic (Zero-Trace / Ephemeral option)
  addVent: async (text) => {
    const trimmed = text.trim();
    if (!trimmed) return;

    const newVent = {
      id: `vent-${Date.now()}`,
      text: trimmed,
      createdAt: 'Just now',
      hugs: 0,
      hasHugged: false,
      candles: 0,
      hasCandle: false,
    };

    const nextVents = [newVent, ...get().vents];
    set({ vents: nextVents });

    try {
      await AsyncStorage.setItem(STORAGE_KEYS.VENTS, JSON.stringify(nextVents));
    } catch {}
  },

  toggleHugVent: async (id) => {
    const nextVents = get().vents.map((v) => {
      if (v.id === id) {
        const nextHugged = !v.hasHugged;
        return {
          ...v,
          hasHugged: nextHugged,
          hugs: nextHugged ? v.hugs + 1 : Math.max(0, v.hugs - 1),
        };
      }
      return v;
    });

    set({ vents: nextVents });

    try {
      await AsyncStorage.setItem(STORAGE_KEYS.VENTS, JSON.stringify(nextVents));
    } catch {}
  },

  toggleCandleVent: async (id) => {
    const nextVents = get().vents.map((v) => {
      if (v.id === id) {
        const nextCandle = !v.hasCandle;
        return {
          ...v,
          hasCandle: nextCandle,
          candles: nextCandle ? v.candles + 1 : Math.max(0, v.candles - 1),
        };
      }
      return v;
    });

    set({ vents: nextVents });

    try {
      await AsyncStorage.setItem(STORAGE_KEYS.VENTS, JSON.stringify(nextVents));
    } catch {}
  },

  // Mentor notification subscriptions
  toggleNotifyMentor: async (mentorId) => {
    const current = get().notifiedMentors;
    const next = {
      ...current,
      [mentorId]: !current[mentorId],
    };

    set({ notifiedMentors: next });

    try {
      await AsyncStorage.setItem(STORAGE_KEYS.NOTIFIED_MENTORS, JSON.stringify(next));
    } catch {}
  },
}));

// Auto-hydrate store on import
useCommunityStore.getState().hydrate();
